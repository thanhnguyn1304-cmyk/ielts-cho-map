# Bump the cache-busting VERSION in index.html, commit everything, and push (GitHub Pages redeploys).
# usage: powershell -File tools/publish.ps1 "commit message"
param([string]$Message = "Update content")
$root = Split-Path $PSScriptRoot -Parent
$index = Join-Path $root "index.html"
$html = [IO.File]::ReadAllText($index)
$m = [regex]::Match($html, 'var VERSION = "(\d+)"')
$next = [int]$m.Groups[1].Value + 1
$html = $html.Replace($m.Value, "var VERSION = `"$next`"")
[IO.File]::WriteAllText($index, $html)
Set-Location $root
git add -A
git commit -q -m $Message -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
git push 2>&1 | Select-String "main"
"published v$next"
