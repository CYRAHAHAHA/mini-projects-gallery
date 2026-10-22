import test from 'node:test';
import assert from 'node:assert/strict';
import {missions,createLab,applyAction,runRequest,checkGoal} from '../server-lab.js';
const act=(lab,key,value=true)=>applyAction(lab.state,key,value);
const send=lab=>runRequest(lab.state,lab.request);
test('all sixteen scenarios have a reproducible repair and verified goal',()=>{
  for(let i=0;i<missions.length;i++){
    const lab=createLab(i),s=lab.state,r=lab.request;
    assert.equal(checkGoal(i,s,r,send(lab)),false,`problem ${i+1} must not start solved`);
    switch(i){
      case 0:act(lab,'web');break;
      case 1:r.url='http://192.168.1.50:8080/';break;
      case 2:act(lab,'bind','0.0.0.0');break;
      case 3:act(lab,'firewall');break;
      case 4:act(lab,'api');break;
      case 5:r.method='POST';r.body='{"text":"A note from my laptop"}';break;
      case 6:act(lab,'db');break;
      case 7:r.method='GET';break;
      case 8:act(lab,'dhcp');break;
      case 9:act(lab,'awake');break;
      case 10:act(lab,'autostart');act(lab,'reboot');break;
      case 11:act(lab,'backup');act(lab,'loss');act(lab,'restore');break;
      case 12:act(lab,'dns',s.ip);break;
      case 13:act(lab,'vpn');break;
      case 14:act(lab,'tls');break;
      case 15:
        act(lab,'dhcp');act(lab,'web');act(lab,'api');act(lab,'db');act(lab,'bind','0.0.0.0');act(lab,'firewall');
        assert.equal(checkGoal(i,s,r,send(lab)),false,'capstone also requires API read');
        r.url='http://home.example:3000/api/notes';break;
    }
    const result=send(lab);assert.equal(result.ok,true,`problem ${i+1}: ${result.message}`);assert.equal(checkGoal(i,s,r,result),true,`problem ${i+1} should complete`);
  }
});
test('loopback, bind address, firewall and wrong port are distinct failures',()=>{
  const lab=createLab(1);assert.equal(send(lab).code,'LOOPBACK');lab.request.url='http://192.168.1.50:8080/';act(lab,'bind','127.0.0.1');assert.equal(send(lab).code,'BIND');
  lab.request.sender='laptop';assert.equal(send(lab).code,'BIND','own LAN address is not loopback');lab.request.url='http://localhost:8080/';assert.equal(send(lab).ok,true);
  lab.request.sender='phone';lab.request.url='http://0.0.0.0:8080/';assert.equal(send(lab).code,'DESTINATION');lab.request.url='http://192.168.1.50:8080/';act(lab,'bind','0.0.0.0');act(lab,'firewall',false);assert.equal(send(lab).code,'FIREWALL');act(lab,'firewall');lab.request.url='http://192.168.1.50/';assert.equal(send(lab).code,'REFUSED');
});
test('API validates writes and keeps the database private',()=>{
  const lab=createLab(5);assert.equal(send(lab).code,'NOTES');assert.equal(lab.state.notes.length,0);lab.request.method='POST';lab.request.body='not json';assert.equal(send(lab).status,400);assert.equal(lab.state.notes.length,0);
  lab.request.body='{"text":"<script>literal data</script>"}';assert.equal(send(lab).status,201);assert.equal(lab.state.notes[0].text,'<script>literal data</script>');
  lab.request.method='GET';assert.equal(send(lab).body[0].text,'<script>literal data</script>');act(lab,'db',false);assert.equal(send(lab).status,503);lab.request.url='http://192.168.1.50:5432/';assert.equal(send(lab).code,'DB_PRIVATE');
});
test('HTTP errors differ from DNS and transport failures',()=>{
  const lab=createLab(12);assert.equal(send(lab).status,null);assert.equal(send(lab).code,'DNS');act(lab,'dns',lab.state.ip);lab.request.url='http://home.example:8080/missing';assert.equal(send(lab).status,404);lab.request.method='POST';lab.request.url='http://home.example:8080/';assert.equal(send(lab).status,405);
});
test('a stopped listener cannot report successful TCP transport',()=>{
  const stopped=createLab(0),result=send(stopped);assert.equal(result.code,'REFUSED');assert.equal(result.trace.some(t=>t.name==='TCP connection'&&t.ok),false);
  const proxy=createLab(14);act(proxy,'tls');act(proxy,'web',false);const upstream=send(proxy);assert.equal(upstream.status,502);assert.equal(upstream.trace.some(t=>t.name==='TCP connection'&&t.ok),true,'proxy transport succeeds even when its separate upstream is down');
});
test('backup is independent and requires a verified restored record',()=>{
  const lab=createLab(11);act(lab,'loss');assert.equal(lab.state.lossTest,false);act(lab,'backup');act(lab,'loss');assert.equal(lab.state.notes.length,0);assert.equal(lab.state.backup.length,1);assert.equal(checkGoal(11,lab.state,lab.request,send(lab)),false);act(lab,'backup');assert.equal(lab.state.backup.length,1);act(lab,'restore');assert.equal(checkGoal(11,lab.state,lab.request,send(lab)),true);
});
test('manual startup cannot substitute for testing autostart after a reboot',()=>{
  const lab=createLab(10);act(lab,'api');act(lab,'db');assert.equal(checkGoal(10,lab.state,lab.request,send(lab)),false);act(lab,'reboot');assert.equal(lab.state.apiRunning,false);act(lab,'autostart');act(lab,'reboot');assert.equal(checkGoal(10,lab.state,lab.request,send(lab)),true);
});
test('home-router forwarding does not overcome CGNAT; VPN and TLS are separate',()=>{
  const lab=createLab(13);act(lab,'forward');assert.equal(send(lab).code,'PRIVATE_ROUTE');act(lab,'vpn');assert.equal(send(lab).ok,true);lab.request.url='https://home.example/';assert.equal(send(lab).code,'REFUSED');act(lab,'tls');assert.equal(send(lab).ok,true);act(lab,'web',false);assert.equal(send(lab).status,502);act(lab,'web');lab.state.certificateTrusted=false;assert.equal(send(lab).code,'CERTIFICATE');
});
