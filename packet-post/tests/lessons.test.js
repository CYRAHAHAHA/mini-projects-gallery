import test from 'node:test';
import assert from 'node:assert/strict';
import {sameSubnet,lessons,terms} from '../lessons.js';
test('local deliveries share the source /24; routed deliveries do not',()=>{
  for(const ip of ['192.168.1.5','192.168.1.8','192.168.1.12'])assert.equal(sameSubnet('192.168.1.2',ip),true);
  assert.equal(sameSubnet('192.168.1.2','192.168.2.5'),false);
});
test('prefix masks compare address bits, not text prefixes',()=>{
  assert.equal(sameSubnet('192.168.1.2','192.168.2.5',16),true);
  assert.equal(sameSubnet('192.168.1.127','192.168.1.128',25),false);
  assert.equal(sameSubnet('0.0.0.0','255.255.255.255',0),true);
  assert.equal(sameSubnet('192.168.1.2','192.168.1.3',32),false);
  assert.throws(()=>sameSubnet('999.1.2.3','1.2.3.4'));
});
test('six deliveries unlock networking concepts in order',()=>{
  assert.equal(lessons.length,6);assert.equal(terms.length,6);
  assert.deepEqual(lessons.map(l=>l.unlock),[2,3,4,5,6,6]);
  assert.equal(lessons[4].address,'bakery.example');
  assert.match(lessons[5].payload,/TCP port 443/);
});
