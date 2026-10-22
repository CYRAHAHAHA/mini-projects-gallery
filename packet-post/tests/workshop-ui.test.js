// Exercise controller events and resume behavior against a small DOM, without asserting pixels.
import test from 'node:test';
import assert from 'node:assert/strict';
import {initWorkshop} from '../workshop.js';
function dom(initial=null,storageWorks=true){
  const nodes=new Map();let saved=initial;
  class Element{
    constructor(){this.children=[];this.value='';this.hidden=false;this.checked=false;this.dataset={};this.classList={remove(){},add(){}};this.handlers={};this._id='';}
    set id(value){this._id=value;nodes.set(value,this);}get id(){return this._id;}
    append(...children){this.children.push(...children);}replaceChildren(...children){this.children=children;}
    querySelector(){return this.child??=new Element();}setAttribute(){}focus(){this.focused=true;globalThis.document.activeElement=this;}
    addEventListener(e,f){this.handlers[e]=f;}showModal(){this.open=true;}close(){this.open=false;}
  }
  const get=id=>{if(!nodes.has(id)){const e=new Element();e.id=id;}return nodes.get(id);};
  globalThis.document={getElementById:get,createElement:()=>new Element()};globalThis.localStorage={getItem:()=>saved,setItem:(_,value)=>{if(!storageWorks)throw Error('blocked');saved=value;}};
  let opened=false;const app=initWorkshop({onOpen:()=>{opened=true;},onClose:()=>{opened=false;}});
  return {app,get,save:()=>saved,opened:()=>opened,send:()=>get('lab-form').onsubmit({preventDefault(){}})};
}
test('workshop entry, repair, completion, and next challenge are wired together',()=>{
  const b=dom();b.app.open();assert.equal(b.opened(),true);assert.equal(b.get('town').hidden,true);b.send();assert.match(b.get('lab-response-status').textContent,/No HTTP response/);assert.equal(b.get('lab-success').hidden,true);
  const checkbox=b.get('lab-setting-web');checkbox.focus();checkbox.checked=true;checkbox.onchange();assert.equal(globalThis.document.activeElement,b.get('lab-setting-web'),'focus follows replacement control');b.send();assert.equal(b.get('lab-success').hidden,false);assert.equal(b.get('lab-success-title').focused,true);assert.equal(JSON.parse(b.save()).completed,1);
  b.get('lab-reflection').value='The laptop needed a running process.';b.get('lab-reflection').oninput();assert.match(JSON.parse(b.save()).records[0].reflection,/running process/);
  b.get('lab-next').onclick();assert.equal(b.get('lab-client').value,'phone');assert.equal(b.get('lab-url').value,'http://localhost:8080/');b.send();assert.match(b.get('lab-response-message').textContent,/looking at itself/);
  b.get('lab-url').value='http://192.168.1.50:8080/';b.send();assert.equal(JSON.parse(b.save()).completed,2);b.app.close();assert.equal(b.get('town').hidden,false);assert.equal(b.opened(),false);
});
test('a completed POST resumes without reissuing the write or losing reflection',()=>{
  const b=dom(JSON.stringify({version:1,index:5,completed:5,note:'Water the basil',records:[]}));b.app.open();b.get('lab-method').value='POST';b.get('lab-body').value='{"text":"Keep this note"}';b.send();b.get('lab-reflection').value='POST created the record.';b.get('lab-reflection').oninput();const saved=b.save();assert.equal(JSON.parse(saved).state.notes.length,1);
  const c=dom(saved);c.app.open();assert.equal(c.get('lab-success').hidden,false);assert.equal(c.get('lab-reflection').value,'POST created the record.');assert.equal(JSON.parse(c.save()).state.notes.length,1);c.get('lab-next').onclick();assert.match(c.get('lab-mission-title').textContent,/API/);
});
test('hints preserve progress and storage failures do not prevent play',()=>{
  const b=dom('malformed',false);b.app.open();for(let n=0;n<3;n++)b.get('lab-hint').onclick();assert.equal(b.get('lab-hint').disabled,true);assert.match(b.get('lab-hint-text').textContent,/Start the web server/);assert.match(b.get('lab-save-status').textContent,/unavailable/);const input=b.get('lab-setting-web');input.checked=true;input.onchange();b.send();assert.equal(b.get('lab-success').hidden,false);
});
