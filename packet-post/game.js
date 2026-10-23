import {lessons,terms} from './lessons.js';
import {initWorkshop} from './workshop.js';
import {signs} from './trail.js?v=2.3.1';
const $=id=>document.getElementById(id), canvas=$('world'),ctx=canvas.getContext('2d');
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
const WIDTH=2080,HEIGHT=1450,SCALE_Y=.76,STORAGE='packet-post-v1';
let saved=0;try{saved=Math.floor(Math.min(6,Math.max(0,Number(JSON.parse(localStorage.getItem(STORAGE))?.completed)||0)));}catch{}
let workshopVisible=false,workshop;
let completed=saved,stage=Math.min(5,completed),started=true,won=false,paused=false,forwarded=false,resolved=false,sound=true,audio=null;
let width=900,height=700,zoom=1,clock=0,last=0,toastTime=0,particles=[],walking=false,hintUntil=0;
const player={x:470,y:780,face:1},camera={x:470,y:735},keys=new Set();let path=[],near=null,currentSign=null;
const trail=signs.map(sign=>({...sign,kind:'sign'})),visited=new Set();
try{const value=JSON.parse(localStorage.getItem('packet-post-trail-v1'));if(Array.isArray(value))for(const id of value)if(trail.some(t=>t.id===id))visited.add(id);}catch{}
const buildings=[
  {id:'post',x:420,y:650,w:160,d:115,h:105,roof:'#269e88',wall:'#fff2cf',side:'#ded1a8',name:'Post office',ip:'192.168.1.2',type:'post'},
  {id:'five',x:730,y:390,w:125,d:100,h:105,roof:'#fa745b',wall:'#fff0d7',side:'#e4ceb2',name:'Device',ip:'192.168.1.5'},
  {id:'eight',x:730,y:1030,w:130,d:105,h:100,roof:'#a980ec',wall:'#fff2dc',side:'#d9cfbe',name:'Device',ip:'192.168.1.8'},
  {id:'twelve',x:260,y:1040,w:125,d:100,h:95,roof:'#f2bd35',wall:'#fff5de',side:'#e4d6b4',name:'Device',ip:'192.168.1.12'},
  {id:'spare',x:260,y:340,w:115,d:95,h:90,roof:'#40ace0',wall:'#f7efd7',side:'#d2d2bb',name:'Old laptop · Workshop',ip:'192.168.1.50',type:'workshop'},
  {id:'router',x:970,y:660,w:145,d:110,h:102,roof:'#24b99c',wall:'#e9ead3',side:'#b8c6b0',name:'Router · Gateway',ip:'192.168.1.1',type:'router'},
  {id:'dns',x:1450,y:360,w:135,d:100,h:118,roof:'#499eec',wall:'#eff0db',side:'#c2d2cb',name:'DNS server',ip:'192.168.2.53',type:'dns'},
  {id:'bakery',x:1720,y:900,w:160,d:120,h:110,roof:'#ed9561',wall:'#fff0d2',side:'#deccb0',name:'Device · Bakery',ip:'192.168.2.5',type:'bakery'},
  {id:'remote',x:1460,y:1150,w:125,d:100,h:95,roof:'#b376e7',wall:'#f6eddf',side:'#d3c6c5',name:'Device',ip:'192.168.2.8'}
];
// Authored SVG models share one ground anchor and one top/right lighting direction.
const spriteNames=['packet-depot','desktop-client','phone-client','printer-client','laptop-workshop','router','dns-directory','web-server','remote-host','tree','signboard','mailbox','postman'];
spriteNames.push(...Array.from({length:8},(_,i)=>'postman-walk-'+i));
const sprites=new Map();
if(typeof Image!=='undefined')for(const name of spriteNames){const img=new Image();img.src='./assets/sprites/'+name+'.svg?v=2.3.1';sprites.set(name,img);}
function sprite(name,x,y,size=240){const img=sprites.get(name);if(!img?.complete||!img.naturalWidth)return false;ctx.drawImage(img,x-size/2,y-size*220/240,size,size*260/240);return true;}
const modelById={post:'packet-depot',five:'desktop-client',eight:'phone-client',twelve:'printer-client',spare:'laptop-workshop',router:'router',dns:'dns-directory',bakery:'web-server',remote:'remote-host'};
const names={post:'Packet depot',five:'Desktop client',eight:'Phone client',twelve:'Network printer',spare:'Old laptop · Workshop',router:'Router · Gateway',dns:'DNS directory',bakery:'Bakery · Web server',remote:'Remote host'};
for(const b of buildings)b.name=names[b.id];
// Arterial roads and access spurs avoid every solid device footprint.
const roads=[[[110,770],[1930,770]],[[570,260],[570,1300]],[[845,260],[845,1300]],[[1590,260],[1590,1320]]];
for(const b of buildings){const m=mailbox(b),lane=b.x<600?570:b.x<1080?845:1590;roads.push([[lane,m.y+36],[m.x,m.y+36]]);}
function onRoad(x,y,pad=0){return roads.some(([a,b])=>x>=Math.min(a[0],b[0])-42-pad&&x<=Math.max(a[0],b[0])+42+pad&&y>=Math.min(a[1],b[1])-42-pad&&y<=Math.max(a[1],b[1])+42+pad);}
const trees=[];let seed=42;function rand(){seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;}
for(let i=0;i<65;i++){const x=65+rand()*1950,y=70+rand()*1300;if(onRoad(x,y,35)||(x>1040&&x<1230)||Math.abs(y-770)<92||buildings.some(b=>Math.abs(x-b.x)<b.w*.7+55&&Math.abs(y-b.y)<130)||Math.abs(x-490)<70||Math.abs(x-730)<75||trail.some(sign=>Math.abs(x-sign.x)<130&&y>sign.y-75&&y<sign.y+200)||buildings.some(b=>Math.abs(x-b.x)<b.w/2+70&&y>b.y+40&&y<b.y+310))continue;trees.push({x,y,s:.65+rand()*.7,c:rand()});}

function persist(){try{localStorage.setItem(STORAGE,JSON.stringify({completed}));}catch{}}
function toast(message){$('toast').textContent=message;$('toast').hidden=false;toastTime=7;}
// Original 16-bar pentatonic score: soft clockwork arpeggios, bass and bell melody.
let musicBus=null,nextNote=0,musicStep=0;
try{sound=localStorage.getItem('packet-post-sound')!=='off';}catch{}
function soundUI(){const b=$('sound-btn');b.setAttribute('aria-pressed',String(sound));b.setAttribute('aria-label',sound?'Mute music and sounds':'Play music and sounds');b.title=sound?'Mute music and sounds':'Play music and sounds';b.style.color=sound?'#bd4c30':'';}
function startAudio(){if(!sound||paused||document.hidden)return;try{audio??=new (window.AudioContext||window.webkitAudioContext)();if(!musicBus){musicBus=audio.createGain();musicBus.gain.value=.65;musicBus.connect(audio.destination);}audio.resume().catch(()=>{});nextNote=Math.max(nextNote,audio.currentTime+.04);}catch{}}
function tone(midi,time,duration,volume,type='sine'){if(!audio||!musicBus)return;const o=audio.createOscillator(),g=audio.createGain();o.type=type;o.frequency.value=440*2**((midi-69)/12);g.gain.setValueAtTime(0,time);g.gain.linearRampToValueAtTime(volume,time+.015);g.gain.exponentialRampToValueAtTime(.0001,time+duration);o.connect(g);g.connect(musicBus);o.onended=()=>{o.disconnect();g.disconnect();};o.start(time);o.stop(time+duration+.02);}
function musicTick(){if(!sound||!audio||audio.state!=='running'||paused||document.hidden)return;const stepDuration=60/96/2;if(nextNote<audio.currentTime)nextNote=audio.currentTime+.04;
 const chords=[[48,55,60,64],[45,52,57,60],[41,48,53,57],[43,50,55,62]];
 const tune=[72,null,76,79,null,76,74,null,72,67,null,69,72,null,74,null,76,null,79,81,79,null,76,74,72,null,69,67,null,69,72,null];
 while(nextNote<audio.currentTime+.15){const chord=chords[Math.floor(musicStep/32)%4],beat=musicStep%8;tone(chord[[0,2,1,3,2,1,3,1][beat]]+12,nextNote,.28,.027,'triangle');if(beat===0)tone(chord[0]-12,nextNote,1.1,.065);if(musicStep%2===0){const note=tune[Math.floor(musicStep/2)%tune.length];if(note!==null)tone(note,nextNote,.65,.035);}musicStep=(musicStep+1)%128;nextNote+=stepDuration;}}
function hushAudio(){if(audio)audio.suspend().catch(()=>{});}
function beep(success=false){if(!sound)return;startAudio();if(!audio)return;[72,76,...(success?[79]:[])].forEach((n,i)=>tone(n,audio.currentTime+i*.1,.2,.07));}
for(const event of ['pointerdown','keydown'])document.addEventListener(event,e=>{if(!e.target.closest?.('#sound-btn'))startAudio();},{capture:true});
function current(){return lessons[stage];}
function unlocked(){return completed===0?2:lessons[Math.min(completed-1,5)].unlock;}
function updateGuide(){const count=unlocked();$('term-count').textContent=count;$('guide-content').replaceChildren(...terms.map((t,i)=>{const el=document.createElement('article');el.className='guide-entry'+(i>=count?' locked':'');const h=document.createElement('h3');h.textContent=i<count?t.name:'Still to discover';const p=document.createElement('p');p.textContent=i<count?t.text:'Keep delivering to discover this concept.';el.append(h,p);return el;}));}
function updateTrailCount(){$('trail-count').textContent=visited.size+' / '+trail.length+' signs explored';}
function closeSign(){currentSign=null;$('sign-panel').hidden=true;if(won)$('celebration').hidden=false;canvas.focus({preventScroll:true});}
function readSign(sign){currentSign=sign;visited.add(sign.id);try{localStorage.setItem('packet-post-trail-v1',JSON.stringify([...visited]));}catch{}updateTrailCount();$('sign-title').textContent=sign.title;$('sign-lesson').textContent=sign.lesson;$('sign-try').textContent=sign.try;$('sign-panel').hidden=false;$('celebration').hidden=true;$('route-details').hidden=true;$('route-btn').setAttribute('aria-expanded','false');path=[];keys.clear();$('spawn-note').hidden=true;$('sign-title').focus({preventScroll:true});beep();}
function addTrailNotes(){const h=document.createElement('h2');h.className='trail-guide-heading';h.textContent='Your signboard discoveries';$('guide-content').append(h);if(!visited.size){const p=document.createElement('p');p.className='trail-guide-note';p.textContent='Find colorful signboards around the map. Read them with E or a tap; their lessons will be saved here.';$('guide-content').append(p);}for(const sign of trail){if(!visited.has(sign.id))continue;const article=document.createElement('article');article.className='guide-entry';const title=document.createElement('h3');title.textContent=sign.title;const p=document.createElement('p');p.textContent=sign.lesson+' '+sign.try;article.append(title,p);$('guide-content').append(article);}}
function refresh(){const l=current();$('mission-title').textContent=l.title;$('mission-description').textContent=l.description;$('destination').textContent=stage===4&&resolved?'192.168.2.5':l.address;$('packet-detail').textContent='Payload: '+l.payload;$('mission-number').textContent=(stage+1)+' / 6';$('progress-text').textContent=completed+' of 6 delivered';$('progress').replaceChildren(...lessons.map((_,i)=>{const el=document.createElement('span');el.className=i<completed?'done':'';return el;}));$('chapter').textContent=stage<3?'Chapter 1 · Hello, network':'Chapter 2 · A wider world';$('hud-address').textContent=completed===6?'Route complete':(stage===4&&resolved?'192.168.2.5':l.address);$('hud-deliveries').textContent=completed+' / 6';$('packet-state').textContent=completed===6?'ROUTE COMPLETE':forwarded?'FORWARDED':'READY TO DELIVER';updateGuide();}
function resetPosition(){player.x=470;player.y=780;camera.x=470;camera.y=735;path=[];near=null;keys.clear();$('interact-btn').hidden=true;}
function nextStop(){if(stage===4&&!resolved)return buildings.find(b=>b.id==='dns');if(stage>=3&&!forwarded)return buildings.find(b=>b.id==='router');return buildings.find(b=>b.id===current().target);}
function blocked(x,y){if(x<65||x>WIDTH-65||y<90||y>HEIGHT-65)return true;if(x>1080&&x<1220&&(y<696||y>858))return true;return buildings.some(b=>Math.abs(x-b.x)<b.w/2+15&&y>b.y-b.d/2-10&&y<b.y+b.d/2+13);}
function mailbox(b){return{x:b.x+b.w/2+22,y:b.y+b.d/2+25};}
// Breadth-first search on a coarse navigation grid makes tap-to-walk respect buildings and the river.
function navigate(x,y){const cell=28,cols=Math.ceil(WIDTH/cell),rows=Math.ceil(HEIGHT/cell),sx=Math.round(player.x/cell),sy=Math.round(player.y/cell),gx=Math.round(x/cell),gy=Math.round(y/cell);if(blocked(gx*cell,gy*cell)){toast('Choose an open patch of ground, or walk closer with the movement keys.');return;}const start=sy*cols+sx,goal=gy*cols+gx,queue=[start],prev=new Map([[start,-1]]);let found=false;for(let n=0;n<queue.length;n++){const id=queue[n],cx=id%cols,cy=Math.floor(id/cols);if(id===goal){found=true;break;}for(const [dx,dy]of[[1,0],[-1,0],[0,1],[0,-1]]){const nx=cx+dx,ny=cy+dy,ni=ny*cols+nx;if(nx<0||nx>=cols||ny<0||ny>=rows||prev.has(ni)||blocked(nx*cell,ny*cell))continue;prev.set(ni,id);queue.push(ni);}}if(found){const route=[];let id=goal;while(id!==start){route.push({x:(id%cols)*cell,y:Math.floor(id/cols)*cell});id=prev.get(id);}path=route.reverse();}else toast('There’s no walking route there. Try a nearby open path.');}
function complete(){if(won||completed===6)return;won=true;completed=Math.max(completed,stage+1);persist();beep(true);$('success-title').textContent=current().success;$('success-copy').textContent=current().explanation;$('next-btn').textContent=stage===5?'Explore your town →':'Next delivery →';$('celebration').hidden=false;$('interact-btn').hidden=true;$('success-title').focus();for(let i=0;i<32;i++)particles.push({x:player.x,y:player.y-40,vx:(Math.random()-.5)*180,vy:-80-Math.random()*140,life:1.8,c:['#dc805e','#e3bc69','#89a479','#a79db7'][i%4]});refresh();}
function interact(){if(!started||paused||document.querySelector('dialog[open]')||!near)return;const b=near;if(b.kind==='sign'){readSign(b);return;}if(b.type==='workshop'){workshop.open();return;}if(won)return;if(b.id==='post'){toast('You’re carrying a packet from 192.168.1.2. Check its destination IP and find the matching device.');return;}if(b.id==='router'){if(stage<3){toast('This is your default gateway. You’ll use it when a destination is outside your subnet.');return;}if(stage===4&&!resolved){toast('First resolve bakery.example at the DNS server. A router needs a destination IP to forward your packet.');return;}forwarded=true;beep();refresh();toast('Packet forwarded: 192.168.1.0/24 → 192.168.2.0/24. Next stop: 192.168.2.5.');return;}if(b.id==='dns'){if(stage!==4){toast('This DNS server resolves hostnames into IP addresses. You’ll use it on the hostname delivery.');return;}resolved=true;beep();refresh();toast('DNS A record: bakery.example → 192.168.2.5. Now visit your default gateway to forward the packet.');return;}if(b.id!==current().target){toast('Different destination! This device is '+b.ip+'. Your packet is addressed to '+$('destination').textContent+'.');return;}if(stage===4&&!resolved){toast('Visit the DNS server first to resolve bakery.example into an IP address.');return;}if(stage>=3&&!forwarded){toast('This destination is outside your source subnet. First forward your packet at the default gateway, 192.168.1.1.');return;}if(stage===5){$('port-feedback').textContent='';$('ports').showModal();keys.clear();path=[];return;}complete();}
$('start-btn').onclick=()=>{started=true;$('welcome').hidden=true;canvas.focus();if(completed===6)toast('Welcome back! Your route is complete. Explore freely or start again from the field guide.');};
$('next-btn').onclick=()=>{$('celebration').hidden=true;if(stage===5){won=false;toast('Route complete! Open Home server to bring an old laptop online.');$('mentor').textContent='Six deliveries. A whole new way to see a connected world.';return;}stage++;won=false;forwarded=false;resolved=false;path=[];near=null;keys.clear();refresh();if(stage===3)toast('Your next packet leaves this subnet. Visit the default gateway before delivering.');canvas.focus();};
$('hint-btn').onclick=()=>{hintUntil=clock+14;toast(current().hint);};
$('home-btn').onclick=()=>{resetPosition();toast('Back at the post office. Your packet is still in your satchel.');};
$('interact-btn').onclick=interact;
function openDialog(id){keys.clear();path=[];$(id).showModal();}
$('journal-btn').onclick=()=>{if(workshopVisible){workshop.guide();return;}updateGuide();addTrailNotes();openDialog('guide');};$('help-btn').onclick=()=>openDialog('help');
for(const el of document.querySelectorAll('dialog .close'))el.onclick=()=>el.closest('dialog').close();
function pause(){paused=true;hushAudio();keys.clear();path=[];$('paused').showModal();}function resume(){paused=false;startAudio();$('paused').close();canvas.focus();}
$('pause-btn').onclick=pause;$('resume-btn').onclick=resume;$('paused').addEventListener('close',()=>{paused=false;startAudio();last=performance.now();});
$('sound-btn').onclick=()=>{sound=!sound;try{localStorage.setItem('packet-post-sound',sound?'on':'off');}catch{}soundUI();if(sound)startAudio();else hushAudio();toast(sound?'Music and delivery sounds on.':'Music and sounds muted.');};
$('restart-btn').onclick=()=>{completed=0;stage=0;won=false;forwarded=false;resolved=false;started=true;persist();refresh();resetPosition();$('guide').close();$('welcome').hidden=true;$('celebration').hidden=true;$('mentor').textContent='Take your time. Good networks aren’t built in a rush.';};
for(const b of document.querySelectorAll('[data-port]'))b.onclick=()=>{if(b.dataset.port==='443'){$('ports').close();complete();}else $('port-feedback').textContent='That port serves another application. Your packet needs HTTPS on TCP port 443. Try again.';};
addEventListener('keydown',e=>{if(workshopVisible)return;if(document.querySelector('dialog[open]')||/INPUT|TEXTAREA/.test(e.target.tagName))return;const k=e.key.toLowerCase();if(e.target.closest?.('button,a')&&(k===' '||k==='e'))return;if(['arrowup','arrowdown','arrowleft','arrowright','w','a','s','d',' ','e'].includes(k)){e.preventDefault();if(!started)return;keys.add(k);path=[];if((k==='e'||k===' ')&&!e.repeat)interact();}if(k==='escape'&&started){if(!$('sign-panel').hidden)closeSign();else if(!$('route-details').hidden){$('route-details').hidden=true;$('route-btn').setAttribute('aria-expanded','false');canvas.focus();}else pause();}});
addEventListener('keyup',e=>keys.delete(e.key.toLowerCase()));addEventListener('blur',()=>{keys.clear();path=[];});
document.addEventListener('visibilitychange',()=>{if(document.hidden){keys.clear();path=[];hushAudio();}else startAudio();last=performance.now();});
for(const b of document.querySelectorAll('[data-dir]')){const key={up:'w',left:'a',down:'s',right:'d'}[b.dataset.dir];b.onpointerdown=e=>{e.preventDefault();b.setPointerCapture(e.pointerId);if(started){keys.add(key);path=[];}};for(const event of ['pointerup','pointercancel','lostpointercapture'])b.addEventListener(event,()=>keys.delete(key));}
canvas.addEventListener('pointerdown',e=>{if(!started||paused)return;canvas.focus();const r=canvas.getBoundingClientRect(),x=(e.clientX-r.left-width/2)/zoom+camera.x,y=((e.clientY-r.top-height/2)/zoom+camera.y*SCALE_Y)/SCALE_Y;const clickedSign=trail.find(sign=>Math.abs(x-sign.x)<70&&y>sign.y-90/SCALE_Y&&y<sign.y+25);if(clickedSign){if(Math.hypot(player.x-clickedSign.x,(player.y-clickedSign.y)*SCALE_Y)<105){readSign(clickedSign);}else navigate(clickedSign.x,clickedSign.y+45);return;}const clicked=buildings.find(b=>Math.abs(x-b.x)<b.w*.8&&y>b.y-b.d/2-b.h/SCALE_Y&&y<b.y+b.d/2+70);if(clicked){const m=mailbox(clicked);if(Math.hypot(player.x-m.x,player.y-m.y)<100){near=clicked;interact();}else navigate(m.x,m.y+30);}else navigate(x,y);});
function cameraTarget(x,y){const halfW=width/(2*zoom),halfH=height/(2*zoom*SCALE_Y);return{x:Math.max(halfW,Math.min(WIDTH-halfW,x)),y:Math.max(halfH,Math.min(HEIGHT-halfH,y))};}
function clampCamera(){Object.assign(camera,cameraTarget(camera.x,camera.y));}
function resize(){const rect=canvas.getBoundingClientRect();width=rect.width;height=rect.height;const dpr=Math.min(devicePixelRatio||1,2);canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);zoom=Math.max(width/WIDTH,height/(HEIGHT*SCALE_Y),width<600?.73:Math.min(1.05,Math.max(.78,width/1050)));clampCamera();}new ResizeObserver(resize).observe(canvas);
function ellipse(x,y,rx,ry,c){ctx.fillStyle=c;ctx.beginPath();ctx.ellipse(x,y,rx,ry,0,0,Math.PI*2);ctx.fill();}
function poly(points,color){ctx.fillStyle=color;ctx.beginPath();points.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));ctx.closePath();ctx.fill();}
function round(x,y,w,h,r,fill,stroke){ctx.beginPath();ctx.roundRect(x,y,w,h,r);if(fill){ctx.fillStyle=fill;ctx.fill();}if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=1;ctx.stroke();}}
function text(t,x,y,size,color='#506345',font='DM Sans',align='center'){ctx.font=`500 ${size}px "${font}",sans-serif`;ctx.textAlign=align;ctx.fillStyle=color;ctx.fillText(t,x,y);}
function line(points,color,w=2){ctx.beginPath();points.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));ctx.strokeStyle=color;ctx.lineWidth=w;ctx.lineCap='round';ctx.lineJoin='round';ctx.stroke();}
function drawGround(){
  ctx.fillStyle='#8acb86';ctx.fillRect(0,0,WIDTH,HEIGHT*SCALE_Y);
  // Quiet, broad land parcels keep the road grid and landmarks legible.
  for(const [x,y,w,h,c]of[[70,250,425,460,'#9dd892'],[610,250,240,440,'#a6dd93'],[90,920,410,430,'#a4d98e'],[620,940,230,400,'#91cf88'],[1280,230,250,430,'#a1dcb1'],[1640,390,360,950,'#97d4a3']]){ctx.fillStyle=c;ctx.fillRect(x,y*SCALE_Y,w,h*SCALE_Y);}
  // Paint every border first, then every surface: junctions have no overlapping seams.
  for(const [size,color]of[[96,'#5e997e'],[88,'#d9e6d3'],[76,'#f8edcb']])for(const [a,b]of roads){ctx.fillStyle=color;ctx.fillRect(Math.min(a[0],b[0])-size/2,(Math.min(a[1],b[1])-size/2)*SCALE_Y,Math.abs(a[0]-b[0])+size,(Math.abs(a[1]-b[1])+size)*SCALE_Y);}
  ctx.fillStyle='#399db9';ctx.fillRect(1080,0,140,HEIGHT*SCALE_Y);
  ctx.fillStyle='#62c7d3';ctx.fillRect(1092,0,116,HEIGHT*SCALE_Y);
  for(let y=20;y<HEIGHT*SCALE_Y;y+=65){const drift=reduced?0:Math.sin(clock*.65+y)*6;ctx.fillStyle='#c4eff0';ctx.fillRect(1110+drift,y,42,3);}
  const by=770*SCALE_Y;ctx.fillStyle='#486d79';ctx.fillRect(1060,by-45,180,99);ctx.fillStyle='#e6e9ca';ctx.fillRect(1060,by-45,180,83);
  for(let x=1064;x<1240;x+=22){ctx.fillStyle='#b6c6b6';ctx.fillRect(x,by-45,2,83);}for(const y of[by-48,by+35]){ctx.fillStyle='#faf3cd';ctx.fillRect(1056,y,188,8);}
  text('192.168.1.0/24',390,155,25,'#285c4d','Outfit');text('LOOPBACK MEADOWS',390,177,10,'#285c4d');text('192.168.2.0/24',1630,130,25,'#285c4d','Outfit');text('SUNRISE SUBNET',1630,152,10,'#285c4d');
}
function drawTree(t){sprite('tree',t.x,t.y*SCALE_Y,115*t.s);}
function drawHouse(b){
 const x=b.x,front=(b.y+b.d/2)*SCALE_Y;
 sprite(modelById[b.id],x,front,b.w*1.55);
 const m=mailbox(b),my=m.y*SCALE_Y;sprite('mailbox',m.x,my,95);
 const active=!won&&completed<6&&b.id===nextStop().id;
 if(active){ctx.beginPath();ctx.ellipse(m.x,my+8,21,9,0,0,Math.PI*2);ctx.strokeStyle='#fff9db';ctx.lineWidth=3;ctx.stroke();const lift=reduced?0:Math.sin(clock*3)*4;poly([[m.x-7,my-53+lift],[m.x+7,my-53+lift],[m.x,my-43+lift]],'#fff9db');}
}
function labelBox(b){const w=Math.max(152,b.name.length*7+20);return{x:b.x-w/2,y:(b.y+b.d/2)*SCALE_Y+18,w,h:43};}
function signBox(sign){return{x:sign.x-66,y:sign.y*SCALE_Y-87,w:132,h:58};}
function drawLabel(b){let box=labelBox(b);const overlaps=(a,c)=>a.x<c.x+c.w&&a.x+a.w>c.x&&a.y<c.y+c.h&&a.y+a.h>c.y;const courier={x:player.x-24,y:player.y*SCALE_Y-74,w:48,h:78};if(overlaps(box,courier)){const candidates=[{...box,x:courier.x-box.w-12},{...box,x:courier.x+courier.w+12}];const clear=candidates.find(c=>!trail.some(t=>overlaps(c,signBox(t)))&&!buildings.some(other=>other!==b&&overlaps(c,labelBox(other)))&&c.x>10&&c.x+c.w<WIDTH-10);if(clear)box=clear;}const center=box.x+box.w/2;round(box.x,box.y,box.w,box.h,5,'#fff9e7');text(b.name,center,box.y+16,12,'#234d4c','Outfit');text(b.ip,center,box.y+34,14,'#173e4c','monospace');}
function drawSign(sign){const x=sign.x,y=sign.y*SCALE_Y,seen=visited.has(sign.id),active=near?.kind==='sign'&&near.id===sign.id;
 sprite('signboard',x,y,166);text(sign.label[0],x-3,y-64,12,'#173e3c','Outfit');
 if(seen){round(x+54,y-88,14,14,3,'#226b55');line([[x+57,y-81],[x+60,y-78],[x+65,y-84]],'#fffbe8',2);}
 if(active){round(x-45,y+13,90,24,5,'#fffdf1');text('E · READ SIGN',x,y+29,10,'#173e3c','Outfit');}}
function drawPlayer(){const x=player.x,y=player.y*SCALE_Y,frame=walking&&!reduced?Math.floor(clock*12)%8:null,bob=frame===null?0:Math.abs(Math.sin(clock*12*Math.PI/4))*1.5;
 ellipse(x+3,y+3,15,6,'#24495735');ctx.save();ctx.translate(x,y);ctx.scale(player.face<0?-1:1,1);sprite(frame===null?'postman':'postman-walk-'+frame,0,-bob,95);ctx.restore();
}
function drawHint(){if(!started||won||hintUntil<=clock||completed===6)return;const b=nextStop(),m=mailbox(b);ctx.save();ctx.setLineDash([6,12]);ctx.strokeStyle='#c38a5990';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(player.x,player.y*SCALE_Y+8);ctx.lineTo(m.x,m.y*SCALE_Y+8);ctx.stroke();ctx.restore();}
function draw(){clampCamera();ctx.clearRect(0,0,width,height);ctx.fillStyle='#8acb86';ctx.fillRect(0,0,width,height);ctx.save();ctx.translate(width/2-camera.x*zoom,height/2-camera.y*SCALE_Y*zoom);ctx.scale(zoom,zoom);drawGround();drawHint();const objects=[...trees.map(t=>({y:t.y,render:()=>drawTree(t)})),...buildings.map(b=>({y:b.y+b.d/2,render:()=>drawHouse(b)})),...trail.map(sign=>({y:sign.y,render:()=>drawSign(sign)})),{y:player.y,render:drawPlayer}].sort((a,b)=>a.y-b.y);for(const o of objects)o.render();for(const b of buildings)drawLabel(b);for(const p of particles){ctx.globalAlpha=Math.max(0,p.life/1.8);round(p.x,p.y*SCALE_Y,5,5,1,p.c);}ctx.globalAlpha=1;ctx.restore();}
function tick(now){const dt=Math.min(.04,(now-last)/1000||0);last=now;musicTick();if(workshopVisible){requestAnimationFrame(tick);return;}const active=!paused&&!document.querySelector('dialog[open]');walking=false;if(active){clock+=dt;if(toastTime>0){toastTime-=dt;if(toastTime<=0)$('toast').hidden=true;}
  if(started){let dx=(keys.has('d')||keys.has('arrowright')?1:0)-(keys.has('a')||keys.has('arrowleft')?1:0),dy=(keys.has('s')||keys.has('arrowdown')?1:0)-(keys.has('w')||keys.has('arrowup')?1:0);if(path.length&&!dx&&!dy){const p=path[0],dist=Math.hypot(p.x-player.x,p.y-player.y);if(dist<7)path.shift();else{dx=(p.x-player.x)/dist;dy=(p.y-player.y)/dist;}}const len=Math.hypot(dx,dy);if(len){const oldX=player.x,oldY=player.y;$('spawn-note').hidden=true;if(dx)player.face=dx>0?1:-1;const speed=190*dt;const nx=player.x+dx/len*speed,ny=player.y+dy/len*speed/SCALE_Y;if(!blocked(nx,player.y))player.x=nx;if(!blocked(player.x,ny))player.y=ny;walking=player.x!==oldX||player.y!==oldY;}
    near=null;let min=90;for(const b of buildings){const m=mailbox(b),dist=Math.hypot(player.x-m.x,(player.y-m.y)*SCALE_Y);if(dist<min){min=dist;near=b;}}
    for(const sign of trail){const dist=Math.hypot(player.x-sign.x,(player.y-sign.y)*SCALE_Y);if(dist<min){min=dist;near=sign;}}
    const btn=$('interact-btn');btn.hidden=!near||(won&&near.kind!=='sign'&&near.type!=='workshop')||(completed===6&&near.kind!=='sign'&&near.type!=='workshop');btn.querySelector('span').textContent=near?.kind==='sign'?'Read '+near.label[0]:near?.id==='router'?'Forward packet':near?.id==='dns'?'Resolve hostname':near?.id==='post'?'Check dispatch':near?.type==='workshop'?'Open server workshop':'Deliver packet';
  }
  if(started){const target=cameraTarget(player.x,player.y-45),desiredX=target.x,desiredY=target.y;camera.x+=(desiredX-camera.x)*Math.min(1,dt*4);camera.y+=(desiredY-camera.y)*Math.min(1,dt*4);}
  for(const p of particles){p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy+=220*dt;p.life-=dt;}particles=particles.filter(p=>p.life>0);
  const remote=player.x>1220;$('location-name').textContent=remote?'Sunrise Subnet':'Loopback Meadows';$('subnet-label').textContent=remote?'REMOTE NETWORK · 192.168.2.0/24':'LOCAL NETWORK · 192.168.1.0/24';
}draw();requestAnimationFrame(tick);}
workshop=initWorkshop({onOpen:()=>{workshopVisible=true;keys.clear();path=[];},onClose:()=>{workshopVisible=false;last=performance.now();resize();}});
$('sign-close').onclick=closeSign;$('spawn-close').onclick=()=>{$('spawn-note').hidden=true;};$('sign-explore').onclick=()=>{const sign=currentSign;if(!sign)return;closeSign();const b=buildings.find(b=>b.id===sign.target);const m=mailbox(b);hintUntil=clock+15;navigate(m.x,m.y+32);};$('route-btn').onclick=()=>{$('route-details').hidden=!$('route-details').hidden;$('route-btn').setAttribute('aria-expanded',String(!$('route-details').hidden));};$('route-close').onclick=()=>{$('route-details').hidden=true;$('route-btn').setAttribute('aria-expanded','false');$('route-btn').focus();};$('trail-btn').onclick=()=>{updateGuide();addTrailNotes();openDialog('guide');};
$('welcome').hidden=true;soundUI();updateTrailCount();refresh();resize();canvas.focus({preventScroll:true});requestAnimationFrame(tick);
