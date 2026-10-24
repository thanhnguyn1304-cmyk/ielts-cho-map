// Install once: npm install --prefix work/content-check jsdom --no-audit --no-fund
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const {JSDOM} = require('../work/content-check/node_modules/jsdom');
process.chdir(path.resolve(__dirname, '..'));
const dom = new JSDOM('<div id="app"></div>', {url:'http://localhost/',runScripts:'outside-only'});
const w=dom.window;
w.scrollTo=()=>{};
w.HTMLElement.prototype.scrollIntoView=()=>{};
w.HTMLMediaElement.prototype.load=()=>{};
w.HTMLMediaElement.prototype.pause=()=>{};
w.HTMLMediaElement.prototype.play=()=>Promise.resolve();
w.setInterval=()=>1; w.clearInterval=()=>{};
w.confirm=()=>true;
w.eval(fs.readFileSync('app.js','utf8').replace('    addBook(b) {','    inspect: {books, route, groupQs},\n    addBook(b) {')+'\nwindow.api=IELTS;');
w.IELTS=w.api;
for(const [,file] of fs.readFileSync('index.html','utf8').matchAll(/"(data\/[^"\s]+\.js)"/g)) w.eval(fs.readFileSync(file,'utf8'));
const api=w.api, {books,route,groupQs}=api.inspect;
let checked=0;
function visit(hash,expected) {
 w.history.replaceState(null,'',hash); route();
 const nav=Array.from(w.document.querySelectorAll('[data-qn]'),x=>Number(x.dataset.qn));
 assert.deepEqual(nav,expected,hash+' navigation');
 assert(!Array.from(w.document.querySelectorAll('.group-body')).some(el=>el.textContent.includes('[[')),hash+' unresolved blank');
 for(const q of expected) assert(w.document.querySelector(`[data-q="${q}"]`) || w.document.querySelector(`[data-multi*="${q}"]`),hash+' missing answer control '+q);
 checked++;
}
for(const b of books) for(const t of b.tests) for(const skill of ['reading','listening']) {
 const secs=t[skill]?.[skill==='reading'?'passages':'parts'];
 if(!secs)continue;
 for(let si=0;si<secs.length;si++) {
  const base=`#/${b.id}/${t.n}/${skill}/p${si+1}`;
  visit(base,Array.from(secs[si].groups.flatMap(groupQs)));
  for(let gi=0;gi<secs[si].groups.length;gi++) visit(base+`/g${gi+1}`,Array.from(groupQs(secs[si].groups[gi])));
 }
}
// Exercise actual controls and grading, including either-order paired answers.
w.localStorage.clear();
visit('#/201/8/reading/p2/g1',[14,15,16,17,18,19]);
function fill(q,value) {
 const input=w.document.querySelector(`input[data-q="${q}"]`);
 input.value=value; input.dispatchEvent(new w.Event('input',{bubbles:true}));
}
fill(14,'clay'); fill(15,'water'); fill(16,'straw'); fill(17,'cow manure');
w.document.querySelector('.check').click();
let saved=JSON.parse(w.localStorage.getItem('ielts:201:8:reading:p2:g1'));
assert.equal(saved.score,4,'swapped paired answers both earn marks');
const history=JSON.parse(w.localStorage.getItem('ielts:history'));
assert.equal(history[0].total,6,'focused practice denominator excludes other groups');
fill(17,'straw'); w.document.querySelector('.check').click();
saved=JSON.parse(w.localStorage.getItem('ielts:201:8:reading:p2:g1'));
assert.equal(saved.score,3,'duplicated paired answer earns only one mark');
assert.equal(saved.firstScore,4,'retry preserves original score');
assert.equal(w.localStorage.getItem('ielts:201:8:reading:p2'),null,'focused attempt does not overwrite passage progress');
visit('#/101/1/reading/p1/g2',[5,6,7,8]);
fill(6,'moving'); w.document.querySelector('.check').click();
saved=JSON.parse(w.localStorage.getItem('ielts:101:1:reading:p1:g2'));
assert.equal(saved.score,1,'passage wording "moving" is accepted alongside the answer-key form "move"');
dom.window.close();
console.log(`Passed ${checked} section/group forms: exact navigation, answer controls, no literal blank markers.`);
