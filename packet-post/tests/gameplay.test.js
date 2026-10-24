// Execute the real game against a minimal DOM. These are logic checks, not browser rendering checks.
import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import fs from 'node:fs';
import {lessons,terms} from '../lessons.js';
import {signs} from '../trail.js';
function boot(save=null,AudioContext=null){
  const globalEvents=new Map(),elements=new Map(),ctx=new Proxy({},{get:()=>()=>{}});
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
  const storage=new Map([['packet-post-v1',save]]);let time=0;const context=vm.createContext({document,localStorage:{getItem:key=>storage.get(key)||null,setItem:(key,v)=>storage.set(key,v)},matchMedia:()=>({matches:true}),devicePixelRatio:1,ResizeObserver:class{observe(){}},performance:{now:()=>time},requestAnimationFrame(){},addEventListener:(name,fn)=>globalEvents.set(name,fn),lessons,terms,signs,initWorkshop:()=>({open(){},guide(){}}),console,Math,Map,Set,window:{AudioContext}});
  const source=fs.readFileSync(new URL('../game.js',import.meta.url),'utf8').replace(/^(?:import[^\n]+\n)+/,'');
  vm.runInContext(source+`;globalThis.game={state:()=>({stage,completed,forwarded,resolved,started,won,visited:[...visited],x:player.x,y:player.y}),visit:id=>{const m=mailbox(buildings.find(b=>b.id===id));player.x=m.x;player.y=m.y;tick(performance.now());},visitSign:id=>{showSigns=true;const s=trail.find(t=>t.id===id);player.x=s.x;player.y=s.y;tick(performance.now());},move:()=>{keys.add('d');tick(last+40);keys.clear();},enterLevel,levels,dimensions:()=>({width:WIDTH,height:HEIGHT,top:worldTop,zoom}),visibleSigns,nextStop,labelBox,signBox,trail,cameraTarget,resize,camera,player,keys,startAudio,musicTick,hushAudio,audioState:()=>({sound,audio,musicStep}),setViewport:(w,h)=>{width=w;height=h;zoom=Math.max(w/WIDTH,h/((HEIGHT-worldTop)*SCALE_Y),.73);clampCamera();},buildings,roads,interact,blocked,navigate,route:()=>path,draw,tick};`,context);
  return {keydown:globalEvents.get('keydown'),game:context.game,get,ports,start:()=>get('start-btn').onclick(),next:()=>get('next-btn').onclick(),stored:()=>storage.get('packet-post-v1')};
}

test('each independent level contains only its task devices and resets its state',()=>{
 const {game:g}=boot();const counts=[2,3,4,3,4,4];for(let i=0;i<6;i++){g.enterLevel(i);assert.equal(g.buildings.length,counts[i]);assert.equal(g.state().forwarded,false);assert.equal(g.state().resolved,false);assert.equal(g.state().won,false);assert.equal(g.state().y,660);assert.equal(g.visibleSigns().length,0);g.draw();}
 g.enterLevel(4);g.visit('dns');g.interact();assert.equal(g.state().resolved,true);g.enterLevel(0);g.enterLevel(4);assert.equal(g.state().resolved,false);
});
test('all six narrative deliveries enforce routing, DNS and service selection',()=>{
 const b=boot(),g=b.game;for(const id of ['five','eight','twelve']){g.visit(id);g.interact();assert.equal(g.state().won,true);b.next();}
 g.visit('bakery');g.interact();assert.equal(g.state().won,false);g.visit('router');g.interact();g.visit('bakery');g.interact();b.next();
 assert.match(b.get('story-target').textContent,/DNS/);g.visit('router');g.interact();assert.equal(g.state().forwarded,false);g.visit('dns');g.interact();assert.match(b.get('story-target').textContent,/Router/);g.visit('router');g.interact();g.visit('bakery');g.interact();b.next();
 g.visit('router');g.interact();g.visit('bakery');g.interact();assert.equal(b.get('ports').open,true);b.ports[0].onclick();assert.equal(g.state().won,false);b.ports[1].onclick();assert.equal(g.state().won,true);assert.equal(g.state().completed,6);b.next();assert.equal(g.state().stage,6);
 g.enterLevel(0);g.visit('five');g.interact();assert.equal(g.state().won,true,'completed levels remain replayable');assert.equal(g.state().completed,6);
});
test('aligned road centerlines meet mailboxes and never cross device footprints in any level',()=>{
 const {game:g}=boot();for(let i=0;i<6;i++){g.enterLevel(i);for(const d of g.buildings){assert.ok(g.roads.some(([a])=>a[0]===d.x&&a[1]===d.y+d.d/2+55));for(const [a,b]of g.roads){const l=Math.min(a[0],b[0])-46,r=Math.max(a[0],b[0])+46,t=Math.min(a[1],b[1])-46,bt=Math.max(a[1],b[1])+46;assert.ok(r<=d.x-d.w/2||l>=d.x+d.w/2||bt<=d.y-d.d/2||t>=d.y+d.d/2,`level ${i}: road crosses ${d.id}`);}assert.ok(g.navigate(d.x,d.y+d.d/2+85,true)?.length,`level ${i}: ${d.id} unreachable`);}}
});
test('camera contains viewport at every level edge and aspect ratio',()=>{
 const {game:g}=boot();for(let i=0;i<6;i++){g.enterLevel(i);for(const [w,h]of [[390,480],[1440,636],[3440,1200],[800,1600]]){g.setViewport(w,h);const {width:W,height:H,zoom:z}=g.dimensions();for(const [x,y]of [[0,0],[W,H]]){const c=g.cameraTarget(x,y);assert.ok(c.x-w/(2*z)>=-.001);assert.ok(c.x+w/(2*z)<=W+.001);assert.ok(c.y-h/(2*z*.76)>=-.001);assert.ok(c.y+h/(2*z*.76)<=H+.001);}}}
});
test('route preview never moves player, optional lesson is scoped to level',()=>{
 const b=boot(),g=b.game;const start=g.state();g.draw();assert.equal(g.route().length,0);assert.equal(g.state().x,start.x);b.get('lessons-toggle').onclick();assert.equal(g.visibleSigns().length,1);g.visitSign('welcome');g.interact();assert.match(b.get('sign-title').textContent,/postman/);b.get('sign-close').onclick();g.enterLevel(4);assert.deepEqual(Array.from(g.visibleSigns(),s=>s.id),['dns']);
});
test('level selection persists, malformed and legacy storage resume safely',()=>{
 for(const save of ['garbage','{"completed":999}',null]){const b=boot(save);assert.equal(b.game.state().stage,0);b.game.draw();}
 const b=boot('{"completed":1,"levels":[4],"current":2,"levelVersion":1}');assert.equal(b.game.state().stage,2);assert.equal(b.game.state().completed,1);b.game.enterLevel(5);assert.equal(JSON.parse(b.stored()).current,5);b.get('restart-btn').onclick();assert.equal(b.game.state().completed,0);
});
test('soundtrack schedules bounded notes, reuses audio context, and respects mute',()=>{
 let contexts=0,notes=0;
 class AudioContext{constructor(){contexts++;this.currentTime=0;this.state='suspended';this.destination={};}resume(){this.state='running';return Promise.resolve();}suspend(){this.state='suspended';return Promise.resolve();}createGain(){return{gain:{value:0,setValueAtTime(){},linearRampToValueAtTime(){},exponentialRampToValueAtTime(){}},connect(){},disconnect(){}};}createOscillator(){return{frequency:{value:0},connect(){},disconnect(){},start(){notes++;},stop(){}};}}
 const {game:g,get}=boot(null,AudioContext);g.startAudio();g.startAudio();assert.equal(contexts,1);g.musicTick();assert.ok(notes>=3);const scheduled=notes;g.musicTick();assert.equal(notes,scheduled);get('sound-btn').onclick();assert.equal(g.audioState().sound,false);assert.equal(g.audioState().audio.state,'suspended');g.musicTick();assert.equal(notes,scheduled);get('sound-btn').onclick();assert.equal(g.audioState().audio.state,'running');assert.equal(contexts,1);g.hushAudio();assert.equal(g.audioState().audio.state,'suspended');
});


test('out-of-order clears mark the correct level and keyboard selector keeps native keys',()=>{const b=boot();b.game.enterLevel(5);b.game.visit('router');b.game.interact();b.game.visit('bakery');b.game.interact();b.ports[1].onclick();const markers=b.get('progress').children;assert.equal(markers[0].className,'');assert.equal(markers[5].className,'done');assert.equal(b.get('term-count').textContent,6);b.keydown({key:'ArrowDown',target:{tagName:'SELECT'},preventDefault(){throw Error('native select key intercepted');}});});

test('dispatch preference stays fixed during movement and level changes',()=>{const b=boot();b.game.move();assert.equal(b.get('dispatch-letter').hidden,false);b.get('dispatch-toggle').onclick();b.game.move();b.game.enterLevel(1);assert.equal(b.get('dispatch-letter').hidden,true);});
test('advanced levels teach and validate networking decisions',()=>{const b=boot(),g=b.game;for(let i=6;i<12;i++){g.enterLevel(i);g.visit('five');g.interact();assert.equal(b.get('packet-bag').open,true);const choices=b.get('bag-content').children.filter(e=>e.className==='bag-choice');assert.equal(choices.length,2);choices[1].onclick();assert.equal(g.state().won,false);choices[0].onclick();assert.equal(g.state().won,true);}});
