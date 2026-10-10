"""Call an LLM for JSON, walking the provider -> key -> model chain from pipeline.toml.

A call moves on to the next key when it is rate-limited / out of quota (429, quota messages),
to the next model on model errors (404, 400 "not supported", invalid JSON), and to the next
provider when every key of a provider is exhausted. Raises AllExhausted when nothing is left,
so the caller can save progress and stop cleanly.
"""
import base64, json, re, time
import requests
from . import keys, mask


class AllExhausted(Exception):
    pass


class NeedsReview(Exception):
    """Models answered, but every answer failed the quality check: a person has to look."""


class _RateLimited(Exception):
    pass


class _ModelFailed(Exception):
    pass


class _BadKey(Exception):
    pass


def _is_bad_key(status, body):
    return status == 401 or bool(re.search(r"API key not valid|invalid authentication|User not found|invalid api key", body, re.I))


def _extract_json(text):
    text = text.strip()
    text = re.sub(r"^```(?:json)?\s*|\s*```$", "", text)
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        m = re.search(r"\{.*\}", text, re.S)
        if m:
            return json.loads(m.group(0))
        raise


def _is_quota(status, body):
    return status == 429 or (status in (403, 402) and re.search(r"quota|limit|exhaust|credits", body, re.I))


# ---------------------------------------------------------------- providers
def _gemini(key, model, prompt, images, schema, timeout, effort=None):
    parts = [{"text": prompt}] + [{"inline_data": {"mime_type": "image/png", "data": base64.b64encode(b).decode()}} for b in images]
    body = {"contents": [{"parts": parts}], "generationConfig": {"responseMimeType": "application/json", "temperature": 0.1}}
    if schema:
        body["generationConfig"]["responseJsonSchema"] = schema
    r = requests.post(f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent",
                      headers={"x-goog-api-key": key}, json=body, timeout=timeout)
    if _is_bad_key(r.status_code, r.text):
        raise _BadKey(r.text[:120])
    if _is_quota(r.status_code, r.text):
        raise _RateLimited(r.text[:200])
    if not r.ok:
        raise _ModelFailed(f"{r.status_code} {r.text[:200]}")
    cand = (r.json().get("candidates") or [{}])[0]
    text = "".join(p.get("text", "") for p in cand.get("content", {}).get("parts", []))
    if not text:
        raise _ModelFailed(f"empty response (finishReason={cand.get('finishReason')})")
    return text


def _openrouter(key, model, prompt, images, schema, timeout, effort=None):
    content = [{"type": "text", "text": prompt}] + [
        {"type": "image_url", "image_url": {"url": "data:image/png;base64," + base64.b64encode(b).decode()}} for b in images]
    body = {"model": model, "messages": [{"role": "user", "content": content if images else prompt}], "temperature": 0.1}
    if schema:
        body["response_format"] = {"type": "json_object"}
    r = requests.post("https://openrouter.ai/api/v1/chat/completions", headers={"Authorization": f"Bearer {key}"}, json=body, timeout=timeout)
    if _is_bad_key(r.status_code, r.text):
        raise _BadKey(r.text[:120])
    if _is_quota(r.status_code, r.text):
        raise _RateLimited(r.text[:200])
    if not r.ok:
        raise _ModelFailed(f"{r.status_code} {r.text[:200]}")
    j = r.json()
    if j.get("error"):
        if _is_quota(j["error"].get("code", 0), json.dumps(j["error"])):
            raise _RateLimited(str(j["error"])[:200])
        raise _ModelFailed(str(j["error"])[:200])
    return j["choices"][0]["message"]["content"] or ""


def _claude(key, model, prompt, images, schema, timeout, effort="medium"):
    import anthropic  # paid fallback; only imported when a key is configured
    client = anthropic.Anthropic(api_key=key, timeout=timeout)
    content = [{"type": "image", "source": {"type": "base64", "media_type": "image/png", "data": base64.b64encode(b).decode()}} for b in images]
    content.append({"type": "text", "text": prompt})
    try:
        with client.beta.messages.stream(
            model=model, max_tokens=64000, output_config={"effort": effort},
            betas=["server-side-fallback-2026-07-01"], fallbacks="default",
            messages=[{"role": "user", "content": content}],
        ) as stream:
            msg = stream.get_final_message()
    except anthropic.AuthenticationError as e:
        raise _BadKey(str(e)[:120])
    except anthropic.RateLimitError as e:
        raise _RateLimited(str(e)[:200])
    except anthropic.APIStatusError as e:
        raise _ModelFailed(f"{e.status_code} {str(e)[:200]}")
    if msg.stop_reason == "refusal":
        raise _ModelFailed("refused")
    return "".join(b.text for b in msg.content if b.type == "text")


PROVIDERS = {
    "gemini": (_gemini, "GEMINI_API_KEYS"),
    "openrouter": (_openrouter, "OPENROUTER_API_KEYS"),
    "claude": (_claude, "ANTHROPIC_API_KEY"),
}


class Chain:
    """Remembers exhausted keys and broken models for the rest of the run."""

    def __init__(self, cfg, env, log):
        self.cfg, self.env, self.log = cfg, env, log
        self.spent = set()        # (key, model) pairs that hit their quota this run
        self.broken = set()       # (provider, model) that do not exist / are not allowed
        self.dead_keys = set()    # keys rejected as invalid (for every model)

    def _try_key(self, fn, prov, model, key, prompt, images, schema, check, label):
        """'ok' with the result, 'quota' (try another key), or 'bad' (try another model)."""
        llm = self.cfg["llm"]
        for attempt in (1, 2):
            try:
                t0 = time.time()
                text = fn(key, model, prompt, list(images), schema, llm.get("timeout", 180), llm[prov].get("effort"))
                obj = _extract_json(text)
                problems = check(obj) if check else []
                if problems:
                    self.log(f"{label}: {prov}/{model} output rejected ({'; '.join(problems[:3])}) -> next model")
                    self.rejected.append(problems)
                    return "bad", None
                self.log(f"{label}: OK via {prov}/{model} key {mask(key)} ({time.time() - t0:.0f}s)")
                return "ok", obj
            except _BadKey:
                self.dead_keys.add(key)
                self.log(f"{label}: key {mask(key)} rejected by {prov} as invalid -> next key")
                return "quota", None
            except _RateLimited:
                if attempt == 1:
                    self.log(f"{label}: rate-limited on {prov}/{model} key {mask(key)}; retry in {llm['retry_wait']}s")
                    time.sleep(llm["retry_wait"])
                    continue
                self.spent.add((key, model))
                self.log(f"{label}: key {mask(key)} out of quota for {prov}/{model} -> next key")
                return "quota", None
            except (_ModelFailed, json.JSONDecodeError, ValueError, requests.RequestException) as e:
                if re.search(r"\b(404|403)\b|not found|no longer available|only available", str(e), re.I):
                    self.broken.add((prov, model))
                self.log(f"{label}: {prov}/{model} failed ({str(e)[:140]}) -> next model")
                return "bad", None
        return "quota", None

    def ask_json(self, prompt, images=(), schema=None, check=None, label=""):
        """Return (parsed JSON, "provider/model"). `check(obj)` may return a list of problems;
        a non-empty list rejects that answer and the chain moves on to the next model.
        Raises NeedsReview after `max_rejections` rejected answers, AllExhausted when every provider/model/key is used up or failing."""
        llm = self.cfg["llm"]
        self.rejected = []
        for prov in llm["providers"]:
            fn, key_name = PROVIDERS[prov]
            pkeys = keys(self.env, key_name)
            for model in llm[prov]["models"] if pkeys else []:
                if (prov, model) in self.broken:
                    continue
                for key in pkeys:
                    if (key, model) in self.spent or key in self.dead_keys:
                        continue
                    status, obj = self._try_key(fn, prov, model, key, prompt, images, schema, check, label)
                    if status == "ok":
                        return obj, f"{prov}/{model}"
                    if len(self.rejected) >= llm.get("max_rejections", 3):
                        raise NeedsReview(f"{label}: {len(self.rejected)} models gave output that failed the checks "
                                          f"(last: {'; '.join(self.rejected[-1][:2])})")
                    if status == "bad":
                        break          # same model with another key would fail the same way
        raise AllExhausted(f"{label}: every provider/model/key is out of quota or failing")
