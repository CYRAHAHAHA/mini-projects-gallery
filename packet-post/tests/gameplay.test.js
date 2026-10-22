// Execute the real game against a minimal DOM. These are logic checks, not browser rendering checks.
import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import fs from 'node:fs';
import {lessons,terms} from '../lessons.js';
import {signs} from '../trail.js';
function boot(save=null){
  const elements=new Map(),ctx=new Proxy({},{get:()=>()=>{}});
  class Element{
    constructor(){this.hidden=false;this.open=false;this.textContent='';this.style={};this.children=[];this.dataset={};this.handlers={};}
    addEventListener(e,f){this.handlers[e]=f;}setAttribute(){}focus(){}closest(){return null;}
    querySelector(){return this.child??=new Element();}replaceChildren(...c){this.children=c;}append(...c){this.children.push(...c);}
    getContext(){return ctx;}getBoundingClientRect(){return {width:1100,height:760,left:0,top:0};}
    showModal(){this.open=true;}close(){this.open=false;this.handlers.close?.();}
  }
  const get=id=>{if(!elements.has(id))elements.set(id,new Element());return elements.get(id);};
  const ports=[25,443,22].map(v=>{const b=new Element();b.dataset.port=''+v;return b;});
  const document={getElementById:get,createElement:()=>new Element(),querySelector:()=>[...elements.values()].find(e=>e.open),querySelectorAll:s=>s==='[data-port]'?ports:[],addEventListener(){}};
  const storage=new Map([['packet-post-v1',save]]);let time=0;const context=vm.createContext({document,localStorage:{getItem:key=>storage.get(key)||null,setItem:(key,v)=>storage.set(key,v)},matchMedia:()=>({matches:true}),devicePixelRatio:1,ResizeObserver:class{observe(){}},performance:{now:()=>time},requestAnimationFrame(){},addEventListener(){},lessons,terms,signs,initWorkshop:()=>({open(){},guide(){}}),console,Math,Map,Set,window:{}});
  const source=fs.readFileSync(new URL('../game.js',import.meta.url),'utf8').replace(/^(?:import[^\n]+\n)+/,'');
  vm.runInContext(source+`;globalThis.game={state:()=>({stage,completed,forwarded,resolved,started,won,visited:[...visited],x:player.x,y:player.y}),visit:id=>{const m=mailbox(buildings.find(b=>b.id===id));player.x=m.x;player.y=m.y;tick(performance.now());},visitSign:id=>{const s=trail.find(t=>t.id===id);player.x=s.x;player.y=s.y;tick(performance.now());},move:()=>{keys.add('d');tick(40);keys.clear();},interact,blocked,navigate,route:()=>path,draw,tick};`,context);
  return {game:context.game,get,ports,start:()=>get('start-btn').onclick(),next:()=>get('next-btn').onclick(),stored:()=>storage.get('packet-post-v1')};
}
test('complete all six deliveries with enforced gateway, DNS, and port steps',()=>{
  const b=boot(),{game:g}=b;assert.equal(g.state().started,true);assert.equal(b.get('welcome').hidden,true);
  g.visit('spare');g.interact();assert.equal(g.state().completed,0);
  for(const id of ['five','eight','twelve']){g.visit(id);g.interact();assert.equal(g.state().won,true);b.next();}
  assert.equal(g.state().stage,3);g.visit('bakery');g.interact();assert.equal(g.state().completed,3);
  g.visit('router');g.interact();assert.equal(g.state().forwarded,true);g.visit('bakery');g.interact();b.next();
  assert.equal(g.state().stage,4);g.visit('router');g.interact();assert.equal(g.state().forwarded,false);
  g.visit('dns');g.interact();assert.equal(g.state().resolved,true);assert.equal(b.get('destination').textContent,'192.168.2.5');
  g.visit('bakery');g.interact();assert.equal(g.state().completed,4);
  g.visit('router');g.interact();g.visit('bakery');g.interact();b.next();
  g.visit('router');g.interact();g.visit('bakery');g.interact();assert.equal(b.get('ports').open,true);
  b.ports[0].onclick();assert.equal(g.state().completed,5);assert.match(b.get('port-feedback').textContent,/another application/);
  b.ports[1].onclick();assert.equal(g.state().completed,6);assert.equal(JSON.parse(b.stored()).completed,6);
  b.next();assert.equal(g.state().won,false);assert.equal(b.get('celebration').hidden,true);
});
test('the entire map is walkable immediately while river banks and buildings remain solid',()=>{
  const b=boot();assert.equal(b.game.blocked(1140,770),false);b.game.navigate(810,500);assert.ok(b.game.route().length>0);
  assert.equal(b.game.blocked(420,680),true);assert.equal(b.game.blocked(1140,500),true);
  const expanded=boot('{"completed":3}');assert.equal(expanded.game.blocked(1140,770),false);expanded.game.navigate(1510,750);assert.ok(expanded.game.route().length>0);
});
test('saved progress resumes and malformed storage cannot break startup',()=>{
  for(const save of ['garbage','{"completed":1.5}','{"completed":999}',null]){const b=boot(save);assert.ok(Number.isInteger(b.game.state().stage));b.game.draw();}
  const b=boot('{"completed":4}');assert.equal(b.game.state().stage,4);assert.equal(b.game.state().resolved,false);
  b.get('restart-btn').onclick();assert.equal(b.game.state().completed,0);assert.equal(b.game.state().started,true);
});

test('signboards are discovered in the world and never lock movement',()=>{
 const b=boot();const x=b.game.state().x;b.game.move();assert.ok(b.game.state().x>x,'movement works without starting');
 for(const sign of signs){b.game.visitSign(sign.id);b.game.interact();assert.equal(b.get('sign-title').textContent,sign.title);assert.equal(b.get('sign-panel').hidden,false);}
 assert.equal(b.game.state().visited.length,signs.length);assert.match(b.get('trail-count').textContent,/15 \/ 15/);
 const before=b.game.state().x;b.game.move();assert.ok(b.game.state().x>before,'reading a sign does not pause movement');b.get('sign-close').onclick();assert.equal(b.get('sign-panel').hidden,true);
});

test('sign reading temporarily folds delivery feedback without losing next delivery',()=>{
 const b=boot();b.game.visit('five');b.game.interact();assert.equal(b.game.state().won,true);b.game.visitSign('welcome');b.game.interact();assert.equal(b.get('celebration').hidden,true);b.get('sign-close').onclick();assert.equal(b.get('celebration').hidden,false);b.next();assert.equal(b.game.state().stage,1);
});
