// Load every data/*.js file the way index.html does (with a stub IELTS object) and print the
// combined books as JSON, so Python tools can read the site's data.
// usage: node tools/dump_data.js [file.js ...]   (default: the files listed in index.html)
const fs = require("fs"), path = require("path");
const root = path.join(__dirname, "..");
let files = process.argv.slice(2);
if (!files.length) {
  const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
  files = [...html.matchAll(/"(data\/[^"]+\.js)"/g)].map(m => m[1]);
}
const books = [];
const IELTS = {
  addBook: b => books.push(b),
  addScripts: (id, n, scripts) => {
    const t = books.find(x => x.id === id)?.tests.find(x => x.n === n);
    if (t?.listening) scripts.forEach((s, i) => { if (t.listening.parts[i]) t.listening.parts[i].script = s; });
  },
  addReading: (id, n, reading) => {
    const b = books.find(x => x.id === id);
    let t = b.tests.find(x => x.n === n);
    if (!t) { t = { n }; b.tests.push(t); }
    t.reading = reading;
  },
};
for (const f of files) new Function("IELTS", fs.readFileSync(path.join(root, f), "utf8"))(IELTS);
process.stdout.write(JSON.stringify(books));
