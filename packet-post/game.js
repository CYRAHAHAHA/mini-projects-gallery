import {lessons,terms} from './lessons.js?v=2.6.0';
import {initWorkshop} from './workshop.js';
import {signs} from './trail.js?v=2.6.0';
const $=id=>document.getElementById(id), canvas=$('world'),ctx=canvas.getContext('2d');
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
let WIDTH=1100,HEIGHT=1200,worldTop=0;const SCALE_Y=.76,STORAGE='packet-post-v1';
let saved=0;try{saved=Math.floor(Math.min(6,Math.max(0,Number(JSON.parse(localStorage.getItem(STORAGE))?.completed)||0)));}catch{}
let workshopVisible=false,workshop;
let showSigns=false,showRoute=true,guideRoute=[],guideAt=-1;
let completed=saved,stage=Math.min(5,completed),started=true,won=false,paused=false,forwarded=false,resolved=false,sound=true,audio=null;
let width=900,height=700,zoom=1,clock=0,last=0,toastTime=0,particles=[],walking=false,hintUntil=0;
const player={x:470,y:780,face:1},camera={x:470,y:735},keys=new Set();let path=[],near=null,currentSign=null;
const trail=signs.map(sign=>({...sign,kind:'sign'})),visited=new Set();
try{const value=JSON.parse(localStorage.getItem('packet-post-trail-v1'));if(Array.isArray(value))for(const id of value)if(trail.some(t=>t.id===id))visited.add(id);}catch{}
const deviceCatalog=[
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
if(typeof Image!=='undefined')for(const name of spriteNames){const img=new Image();img.src='./assets/sprites/'+name+'.svg?v=2.6.0';sprites.set(name,img);}
function sprite(name,x,y,size=240){const img=sprites.get(name);if(!img?.complete||!img.naturalWidth)return false;ctx.drawImage(img,x-size/2,y-size*220/240,size,size*260/240);return true;}
const modelById={post:'packet-depot',five:'desktop-client',eight:'phone-client',twelve:'printer-client',spare:'laptop-workshop',router:'router',dns:'dns-directory',bakery:'web-server',remote:'remote-host'};
const names={post:'Packet depot',five:'Niko · Desktop',eight:'Jo · Phone',twelve:'Network printer',spare:'Old laptop · Workshop',router:'Router · Gateway',dns:'DNS directory',bakery:'Bea · Web server',remote:'Remote host'};
for(const b of deviceCatalog)b.name=names[b.id];
const levels=[
 {title:'One packet, one address',width:1100,items:[['post',250,420],['five',800,420]],sign:'welcome'},
 {title:'Choose the right device',width:1300,items:[['post',220,420],['five',650,420],['eight',1080,420]],sign:'address'},
 {title:'Inside a subnet',width:1450,items:[['post',220,420],['five',560,420],['eight',900,420],['twelve',1240,420]],sign:'subnet'},
 {title:'Through the gateway',width:1600,items:[['post',220,420],['router',650,420],['bakery',1320,420]],sign:'gateway',river:930},
 {title:'Look up a name',width:1800,items:[['post',220,420],['router',650,420],['bakery',1250,420],['dns',1580,230]],sign:'dns',river:930},
 {title:'Find the right service',width:1850,items:[['post',220,420],['router',650,420],['bakery',1220,420],['remote',1620,420]],sign:'ports',river:930}
];
const buildings=[],roads=[],trees=[];let riverX=null,campaignDone=false;
let cleared=new Set(Array.from({length:saved},(_,i)=>i));
try{const old=JSON.parse(localStorage.getItem(STORAGE));if(Array.isArray(old?.levels))cleared=new Set(old.levels.filter(i=>Number.isInteger(i)&&i>=0&&i<6));if(old?.levelVersion===1&&Number.isInteger(old.current))stage=Math.max(0,Math.min(5,old.current));else stage=0;}catch{stage=0;}
completed=cleared.size;
function enterLevel(index){$('tools-menu').open=false;stage=index;campaignDone=false;won=false;forwarded=false;resolved=false;near=null;currentSign=null;path=[];guideRoute=[];guideAt=-1;keys.clear();particles=[];
 const level=levels[stage];WIDTH=level.width;HEIGHT=1200;riverX=level.river??null;
 buildings.splice(0,buildings.length,...level.items.map(([id,x,y])=>({...deviceCatalog.find(b=>b.id===id),x,y})));
 roads.splice(0,roads.length,[[buildings[0].x,660],[buildings.at(-1).x,660]],...buildings.map(b=>{const m=mailbox(b);return [[m.x,m.y],[m.x,660]];}));
 trees.splice(0,trees.length); // Each level keeps only its task's landmarks.
 const board=trail.find(t=>t.id===level.sign);board.x=WIDTH/2;board.y=820;
 worldTop=Math.max(0,Math.min(...buildings.map(b=>b.y+b.d/2-b.w*1.55*190/(240*SCALE_Y)))-35);
 resetPosition();setDispatch(true);$('celebration').hidden=true;$('sign-panel').hidden=true;refresh();resize();persist();
 $('level-select').value=String(stage);$('level-heading').textContent='Level '+(stage+1)+' · '+level.title;
}
function onRoad(x,y,pad=0){return roads.some(([a,b])=>x>=Math.min(a[0],b[0])-38-pad&&x<=Math.max(a[0],b[0])+38+pad&&y>=Math.min(a[1],b[1])-38-pad&&y<=Math.max(a[1],b[1])+38+pad);}
function persist(){try{localStorage.setItem(STORAGE,JSON.stringify({completed,levels:[...cleared],current:stage,levelVersion:1}));}catch{}}
function toast(message){$('toast').textContent=message;$('toast').hidden=false;toastTime=7;}
// Original 16-bar pentatonic score: soft clockwork arpeggios, bass and bell melody.
let musicBus=null,nextNote=0,musicStep=0;
try{sound=localStorage.getItem('packet-post-sound')!=='off';}catch{}
function soundUI(){const b=$('sound-btn');b.setAttribute('aria-pressed',String(sound));b.setAttribute('aria-label',sound?'Mute music and sounds':'Play music and sounds');b.title=sound?'Mute music and sounds':'Play music and sounds';b.style.color=sound?'#f4c878':'';}
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
function unlocked(){return Math.max(2,lessons[stage].unlock,...[...cleared].map(i=>lessons[i].unlock));}
function updateGuide(){const count=unlocked();$('term-count').textContent=count;$('guide-content').replaceChildren(...terms.map((t,i)=>{const el=document.createElement('article');el.className='guide-entry'+(i>=count?' locked':'');const h=document.createElement('h3');h.textContent=i<count?t.name:'Still to discover';const p=document.createElement('p');p.textContent=i<count?t.text:'Keep delivering to discover this concept.';el.append(h,p);return el;}));}
function updateTrailCount(){$('trail-count').textContent=visited.size+' / '+trail.length+' signs explored';}
function closeSign(){currentSign=null;$('sign-panel').hidden=true;if(won)$('celebration').hidden=false;canvas.focus({preventScroll:true});}
function readSign(sign){currentSign=sign;visited.add(sign.id);try{localStorage.setItem('packet-post-trail-v1',JSON.stringify([...visited]));}catch{}updateTrailCount();$('sign-title').textContent=sign.title;$('sign-lesson').textContent=sign.lesson;$('sign-try').textContent=sign.try;$('sign-panel').hidden=false;$('celebration').hidden=true;$('route-details').hidden=true;$('route-btn').setAttribute('aria-expanded','false');path=[];keys.clear();$('spawn-note').hidden=true;$('sign-title').focus({preventScroll:true});beep();}
function addTrailNotes(){const h=document.createElement('h2');h.className='trail-guide-heading';h.textContent='Your signboard discoveries';$('guide-content').append(h);if(!visited.size){const p=document.createElement('p');p.className='trail-guide-note';p.textContent='Find colorful signboards around the map. Read them with E or a tap; their lessons will be saved here.';$('guide-content').append(p);}for(const sign of trail){if(!visited.has(sign.id))continue;const article=document.createElement('article');article.className='guide-entry';const title=document.createElement('h3');title.textContent=sign.title;const p=document.createElement('p');p.textContent=sign.lesson+' '+sign.try;article.append(title,p);$('guide-content').append(article);}}
function setDispatch(open){$('dispatch-letter').hidden=!open;$('dispatch-toggle').setAttribute('aria-expanded',String(open));$('dispatch-fold').textContent=open?'−':'+';}
function refreshStory(){$('story-task').hidden=false;const l=current(),done=campaignDone&&!won;const stop=nextStop();$('story-sender').textContent=l.sender;$('story-progress').textContent=done?'Level complete':'Level '+(stage+1)+' of 6';$('story-title').textContent=done?(cleared.size===6?'The picnic is ready':'Another delivery complete'):l.title;$('story-copy').textContent=done?'Mira: “That request is delivered. Choose another level, or try giving your old laptop a job in the workshop.”':l.story;$('story-step').textContent=won?'Delivered':done?'Your next adventure':'Next stop';$('story-target').textContent=won?'A reply has arrived':done?'Old laptop · Workshop':stop.id==='router'?'Router · forward the packet':stop.id==='dns'?'DNS directory · find the IP':l.recipient;$('dispatch-caption').textContent=won?'Delivery complete':done?'Choose your next request':$('story-target').textContent;$('story-address').textContent=won?'Read the reply below.':done?'Open Home server from the menu.':stop.ip;$('story-controls').textContent=done?'Keep exploring, or open the menu for more.':'Follow the dotted trail. Move with arrows / WASD or tap. Press E nearby.';guideAt=-1;}
function visibleSigns(){return showSigns?trail.filter(t=>t.id===levels[stage].sign):[];}
function refresh(){const l=current();$('mission-title').textContent=l.title;$('mission-description').textContent=l.description;$('destination').textContent=stage===4&&resolved?'192.168.2.5':l.address;$('packet-detail').textContent='Payload: '+l.payload;$('mission-number').textContent=(stage+1)+' / 6';$('progress-text').textContent=completed+' of 6 delivered';$('progress').replaceChildren(...lessons.map((_,i)=>{const el=document.createElement('span');el.className=cleared.has(i)?'done':'';return el;}));$('chapter').textContent=stage<3?'Chapter 1 · Hello, network':'Chapter 2 · A wider world';$('hud-address').textContent=campaignDone?'Route complete':(stage===4&&resolved?'192.168.2.5':l.address);$('hud-deliveries').textContent=completed+' / 6';$('packet-state').textContent=campaignDone?'ROUTE COMPLETE':forwarded?'FORWARDED':'READY TO DELIVER';updateGuide();refreshStory();}
function resetPosition(){player.x=buildings[0]?.x??220;player.y=660;camera.x=player.x;camera.y=440;path=[];near=null;keys.clear();$('interact-btn').hidden=true;}
function nextStop(){if(stage===4&&!resolved)return buildings.find(b=>b.id==='dns');if(stage>=3&&!forwarded)return buildings.find(b=>b.id==='router');return buildings.find(b=>b.id===current().target);}
function blocked(x,y){if(x<65||x>WIDTH-65||y<90||y>HEIGHT-65)return true;if(riverX!==null&&x>riverX&&x<riverX+100&&(y<610||y>710))return true;return buildings.some(b=>Math.abs(x-b.x)<b.w/2+15&&y>b.y-b.d/2-10&&y<b.y+b.d/2+13);}
function mailbox(b){return{x:b.x,y:b.y+b.d/2+55};}
// Breadth-first search on a coarse navigation grid makes tap-to-walk respect buildings and the river.
function navigate(x,y,preview=false){const cell=28,cols=Math.ceil(WIDTH/cell),rows=Math.ceil(HEIGHT/cell),sx=Math.round(player.x/cell),sy=Math.round(player.y/cell),gx=Math.round(x/cell),gy=Math.round(y/cell);if(blocked(gx*cell,gy*cell)){if(preview)return [];toast('Choose an open patch of ground, or walk closer with the movement keys.');return;}const start=sy*cols+sx,goal=gy*cols+gx,queue=[start],prev=new Map([[start,-1]]);let found=false;for(let n=0;n<queue.length;n++){const id=queue[n],cx=id%cols,cy=Math.floor(id/cols);if(id===goal){found=true;break;}for(const [dx,dy]of[[1,0],[-1,0],[0,1],[0,-1]]){const nx=cx+dx,ny=cy+dy,ni=ny*cols+nx;if(nx<0||nx>=cols||ny<0||ny>=rows||prev.has(ni)||blocked(nx*cell,ny*cell))continue;prev.set(ni,id);queue.push(ni);}}if(found){const route=[];let id=goal;while(id!==start){route.push({x:(id%cols)*cell,y:Math.floor(id/cols)*cell});id=prev.get(id);}route.reverse();if(preview)return route;path=route;}else if(!preview)toast('There’s no walking route there. Try a nearby open path.');}
function complete(){if(won||campaignDone)return;won=true;cleared.add(stage);completed=cleared.size;persist();beep(true);$('success-title').textContent='Delivered to '+current().recipient;$('success-copy').textContent=current().explanation;$('next-btn').textContent=stage===5?'Choose another level →':'Next request →';$('celebration').hidden=false;$('interact-btn').hidden=true;$('success-title').focus();for(let i=0;i<32;i++)particles.push({x:player.x,y:player.y-40,vx:(Math.random()-.5)*180,vy:-80-Math.random()*140,life:1.8,c:['#dc805e','#e3bc69','#89a479','#a79db7'][i%4]});refresh();}
function interact(){if(!started||paused||document.querySelector('dialog[open]')||!near)return;const b=near;if(b.kind==='sign'){readSign(b);return;}if(b.type==='workshop'){workshop.open();return;}if(won)return;if(b.id==='post'){toast('You’re carrying a packet from 192.168.1.2. Check its destination IP and find the matching device.');return;}if(b.id==='router'){if(stage<3){toast('This is your default gateway. You’ll use it when a destination is outside your subnet.');return;}if(stage===4&&!resolved){toast('First resolve bakery.example at the DNS server. A router needs a destination IP to forward your packet.');return;}forwarded=true;beep();refresh();toast('Packet forwarded: 192.168.1.0/24 → 192.168.2.0/24. Next stop: 192.168.2.5.');return;}if(b.id==='dns'){if(stage!==4){toast('This DNS server resolves hostnames into IP addresses. You’ll use it on the hostname delivery.');return;}resolved=true;beep();refresh();toast('DNS A record: bakery.example → 192.168.2.5. Now visit your default gateway to forward the packet.');return;}if(b.id!==current().target){toast('Different destination! This device is '+b.ip+'. Your packet is addressed to '+$('destination').textContent+'.');return;}if(stage===4&&!resolved){toast('Visit the DNS server first to resolve bakery.example into an IP address.');return;}if(stage>=3&&!forwarded){toast('This destination is outside your source subnet. First forward your packet at the default gateway, 192.168.1.1.');return;}if(stage===5){$('port-feedback').textContent='';$('ports').showModal();keys.clear();path=[];return;}complete();}
$('start-btn').onclick=()=>{started=true;$('welcome').hidden=true;canvas.focus();if(campaignDone)toast('Welcome back! Your route is complete. Explore freely or start again from the field guide.');};
$('next-btn').onclick=()=>{if(stage<5){enterLevel(stage+1);canvas.focus();}else{won=false;campaignDone=true;$('celebration').hidden=true;refreshStory();$('tools-menu').open=true;toast('Choose any level from the menu, or try Home server.');}};
$('hint-btn').onclick=()=>{hintUntil=clock+14;toast(current().hint);};
$('home-btn').onclick=()=>{resetPosition();toast('Back at the post office. Your packet is still in your satchel.');};
$('interact-btn').onclick=interact;
function openDialog(id){keys.clear();path=[];$(id).showModal();}
$('journal-btn').onclick=()=>{if(workshopVisible){workshop.guide();return;}updateGuide();addTrailNotes();openDialog('guide');};$('help-btn').onclick=()=>openDialog('help');
for(const el of document.querySelectorAll('dialog .close'))el.onclick=()=>el.closest('dialog').close();
function pause(){paused=true;hushAudio();keys.clear();path=[];$('paused').showModal();}function resume(){paused=false;startAudio();$('paused').close();canvas.focus();}
$('pause-btn').onclick=pause;$('resume-btn').onclick=resume;$('paused').addEventListener('close',()=>{paused=false;startAudio();last=performance.now();});
$('sound-btn').onclick=()=>{sound=!sound;try{localStorage.setItem('packet-post-sound',sound?'on':'off');}catch{}soundUI();if(sound)startAudio();else hushAudio();toast(sound?'Music and delivery sounds on.':'Music and sounds muted.');};
$('restart-btn').onclick=()=>{cleared.clear();completed=0;$('guide').close();enterLevel(0);};
for(const b of document.querySelectorAll('[data-port]'))b.onclick=()=>{if(b.dataset.port==='443'){$('ports').close();complete();}else $('port-feedback').textContent='That port serves another application. Your packet needs HTTPS on TCP port 443. Try again.';};
addEventListener('keydown',e=>{if(workshopVisible)return;if(document.querySelector('dialog[open]')||/INPUT|TEXTAREA|SELECT/.test(e.target.tagName))return;const k=e.key.toLowerCase();if(e.target.closest?.('button,a')&&(k===' '||k==='e'))return;if(['arrowup','arrowdown','arrowleft','arrowright','w','a','s','d',' ','e'].includes(k)){e.preventDefault();if(!started)return;keys.add(k);path=[];if((k==='e'||k===' ')&&!e.repeat)interact();}if(k==='escape'&&started){if($('tools-menu').open){$('tools-menu').open=false;return;}if(!$('sign-panel').hidden)closeSign();else if(!$('route-details').hidden){$('route-details').hidden=true;$('route-btn').setAttribute('aria-expanded','false');canvas.focus();}else pause();}});
addEventListener('keyup',e=>keys.delete(e.key.toLowerCase()));addEventListener('blur',()=>{keys.clear();path=[];});
document.addEventListener('visibilitychange',()=>{if(document.hidden){keys.clear();path=[];hushAudio();}else startAudio();last=performance.now();});
for(const b of document.querySelectorAll('[data-dir]')){const key={up:'w',left:'a',down:'s',right:'d'}[b.dataset.dir];b.onpointerdown=e=>{e.preventDefault();b.setPointerCapture(e.pointerId);if(started){keys.add(key);path=[];}};for(const event of ['pointerup','pointercancel','lostpointercapture'])b.addEventListener(event,()=>keys.delete(key));}
canvas.addEventListener('pointerdown',e=>{if(!started||paused)return;canvas.focus();const r=canvas.getBoundingClientRect(),x=(e.clientX-r.left-width/2)/zoom+camera.x,y=((e.clientY-r.top-height/2)/zoom+camera.y*SCALE_Y)/SCALE_Y;const clickedSign=visibleSigns().find(sign=>Math.abs(x-sign.x)<70&&y>sign.y-90/SCALE_Y&&y<sign.y+25);if(clickedSign){if(Math.hypot(player.x-clickedSign.x,(player.y-clickedSign.y)*SCALE_Y)<105){readSign(clickedSign);}else navigate(clickedSign.x,clickedSign.y+45);return;}const clicked=buildings.find(b=>Math.abs(x-b.x)<b.w*.8&&y>b.y-b.d/2-b.h/SCALE_Y&&y<b.y+b.d/2+70);if(clicked){const m=mailbox(clicked);if(Math.hypot(player.x-m.x,player.y-m.y)<100){near=clicked;interact();}else navigate(m.x,m.y+30);}else navigate(x,y);});
function cameraTarget(x,y){const halfW=width/(2*zoom),halfH=height/(2*zoom*SCALE_Y);return{x:Math.max(halfW,Math.min(WIDTH-halfW,x)),y:Math.max(worldTop+halfH,Math.min(HEIGHT-halfH,y))};}
function clampCamera(){Object.assign(camera,cameraTarget(camera.x,camera.y));}
function resize(){const rect=canvas.getBoundingClientRect();width=rect.width;height=rect.height;const dpr=Math.min(devicePixelRatio||1,2);canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);zoom=Math.max(width/WIDTH,height/((HEIGHT-worldTop)*SCALE_Y),width<600?.73:Math.min(1.05,Math.max(.78,width/1050)));camera.y=worldTop+height/(2*zoom*SCALE_Y);clampCamera();}new ResizeObserver(resize).observe(canvas);
function ellipse(x,y,rx,ry,c){ctx.fillStyle=c;ctx.beginPath();ctx.ellipse(x,y,rx,ry,0,0,Math.PI*2);ctx.fill();}
function poly(points,color){ctx.fillStyle=color;ctx.beginPath();points.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));ctx.closePath();ctx.fill();}
function round(x,y,w,h,r,fill,stroke){ctx.beginPath();ctx.roundRect(x,y,w,h,r);if(fill){ctx.fillStyle=fill;ctx.fill();}if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=1;ctx.stroke();}}
function text(t,x,y,size,color='#506345',font='DM Sans',align='center'){ctx.font=`500 ${size}px "${font}",sans-serif`;ctx.textAlign=align;ctx.fillStyle=color;ctx.fillText(t,x,y);}
function line(points,color,w=2){ctx.beginPath();points.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));ctx.strokeStyle=color;ctx.lineWidth=w;ctx.lineCap='round';ctx.lineJoin='round';ctx.stroke();}
function drawGround(){ctx.fillStyle='#8acb86';ctx.fillRect(0,0,WIDTH,HEIGHT*SCALE_Y);
 for(const b of buildings){ctx.fillStyle='#9dd892';ctx.fillRect(b.x-b.w*.8,(b.y-b.d/2-25)*SCALE_Y,b.w*1.6,(b.d+45)*SCALE_Y);}
 // All road widths are world-space units; branch endpoints share mailbox centerlines.
 for(const [size,color]of[[92,'#5e997e'],[84,'#d9e6d3'],[76,'#f8edcb']])for(const [a,b]of roads){ctx.fillStyle=color;ctx.fillRect(Math.min(a[0],b[0])-size/2,(Math.min(a[1],b[1])-size/2)*SCALE_Y,Math.abs(a[0]-b[0])+size,(Math.abs(a[1]-b[1])+size)*SCALE_Y);}
 if(riverX!==null){ctx.fillStyle='#62c7d3';ctx.fillRect(riverX,0,100,HEIGHT*SCALE_Y);const y=622*SCALE_Y;ctx.fillStyle='#f8edcb';ctx.fillRect(riverX-4,y,108,76*SCALE_Y);for(const edge of[622,698]){ctx.fillStyle='#5e997e';ctx.fillRect(riverX-4,edge*SCALE_Y,108,3);}for(let x=riverX+12;x<riverX+100;x+=20){ctx.fillStyle='#d9d9b6';ctx.fillRect(x,y,2,76*SCALE_Y);}}
}
function drawTree(t){sprite('tree',t.x,t.y*SCALE_Y,115*t.s);}
function drawHouse(b){
 const x=b.x,front=(b.y+b.d/2)*SCALE_Y;
 sprite(modelById[b.id],x,front,b.w*1.55);
 const m=mailbox(b),my=m.y*SCALE_Y;sprite('mailbox',m.x,my,95);
 const active=!won&&!campaignDone&&b.id===nextStop().id;
 if(active){ctx.beginPath();ctx.ellipse(m.x,my+8,21,9,0,0,Math.PI*2);ctx.strokeStyle='#fff9db';ctx.lineWidth=3;ctx.stroke();const lift=reduced?0:Math.sin(clock*3)*4;poly([[m.x-7,my-53+lift],[m.x+7,my-53+lift],[m.x,my-43+lift]],'#fff9db');}
}
function labelBox(b){const w=Math.max(152,b.name.length*7+20);return{x:b.x-w/2,y:(b.y+b.d/2)*SCALE_Y+84,w,h:43};}
function signBox(sign){return{x:sign.x-66,y:sign.y*SCALE_Y-87,w:132,h:58};}
function drawLabel(b){let box=labelBox(b);const overlaps=(a,c)=>a.x<c.x+c.w&&a.x+a.w>c.x&&a.y<c.y+c.h&&a.y+a.h>c.y;const courier={x:player.x-24,y:player.y*SCALE_Y-74,w:48,h:78};if(overlaps(box,courier)){const candidates=[{...box,x:courier.x-box.w-12},{...box,x:courier.x+courier.w+12}];const clear=candidates.find(c=>!trail.some(t=>overlaps(c,signBox(t)))&&!buildings.some(other=>other!==b&&overlaps(c,labelBox(other)))&&c.x>10&&c.x+c.w<WIDTH-10);if(clear)box=clear;}const center=box.x+box.w/2;round(box.x,box.y,box.w,box.h,5,'#fff9e7');text(b.name,center,box.y+16,12,'#234d4c','Outfit');text(b.ip,center,box.y+34,14,'#173e4c','monospace');}
function drawSign(sign){const x=sign.x,y=sign.y*SCALE_Y,seen=visited.has(sign.id),active=near?.kind==='sign'&&near.id===sign.id;
 sprite('signboard',x,y,166);text(sign.label[0],x-3,y-64,12,'#173e3c','Outfit');
 if(seen){round(x+54,y-88,14,14,3,'#226b55');line([[x+57,y-81],[x+60,y-78],[x+65,y-84]],'#fffbe8',2);}
 if(active){round(x-45,y+13,90,24,5,'#fffdf1');text('E · READ SIGN',x,y+29,10,'#173e3c','Outfit');}}
function drawPlayer(){const x=player.x,y=player.y*SCALE_Y,frame=walking&&!reduced?Math.floor(clock*12)%8:null,bob=frame===null?0:Math.abs(Math.sin(clock*12*Math.PI/4))*1.5;
 ellipse(x+3,y+3,15,6,'#24495735');ctx.save();ctx.translate(x,y);ctx.scale(player.face<0?-1:1,1);sprite(frame===null?'postman':'postman-walk-'+frame,0,-bob,95);ctx.restore();
}
function drawHint(){if(!started||won||campaignDone||!showRoute)return;const m=mailbox(nextStop());if(clock>=guideAt){guideRoute=navigate(m.x,m.y+30,true)||[];guideAt=clock+.8;}if(!guideRoute.length)return;ctx.save();ctx.setLineDash([2,13]);ctx.strokeStyle='#91632c';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(player.x,player.y*SCALE_Y);for(const p of guideRoute)ctx.lineTo(p.x,p.y*SCALE_Y);ctx.stroke();ctx.restore();}
function draw(){clampCamera();ctx.clearRect(0,0,width,height);ctx.fillStyle='#8acb86';ctx.fillRect(0,0,width,height);ctx.save();ctx.translate(width/2-camera.x*zoom,height/2-camera.y*SCALE_Y*zoom);ctx.scale(zoom,zoom);drawGround();drawHint();const objects=[...trees.map(t=>({y:t.y,render:()=>drawTree(t)})),...buildings.map(b=>({y:b.y+b.d/2,render:()=>drawHouse(b)})),...visibleSigns().map(sign=>({y:sign.y,render:()=>drawSign(sign)})),{y:player.y,render:drawPlayer}].sort((a,b)=>a.y-b.y);for(const o of objects)o.render();for(const b of buildings)if((!won&&!campaignDone&&b.id===nextStop().id)||near?.id===b.id)drawLabel(b);for(const p of particles){ctx.globalAlpha=Math.max(0,p.life/1.8);round(p.x,p.y*SCALE_Y,5,5,1,p.c);}ctx.globalAlpha=1;ctx.restore();}
function tick(now){const dt=Math.min(.04,(now-last)/1000||0);last=now;musicTick();if(workshopVisible){requestAnimationFrame(tick);return;}const active=!paused&&!document.querySelector('dialog[open]');walking=false;if(active){clock+=dt;if(toastTime>0){toastTime-=dt;if(toastTime<=0)$('toast').hidden=true;}
  if(started){let dx=(keys.has('d')||keys.has('arrowright')?1:0)-(keys.has('a')||keys.has('arrowleft')?1:0),dy=(keys.has('s')||keys.has('arrowdown')?1:0)-(keys.has('w')||keys.has('arrowup')?1:0);if(path.length&&!dx&&!dy){const p=path[0],dist=Math.hypot(p.x-player.x,p.y-player.y);if(dist<7)path.shift();else{dx=(p.x-player.x)/dist;dy=(p.y-player.y)/dist;}}const len=Math.hypot(dx,dy);if(len){const oldX=player.x,oldY=player.y;$('spawn-note').hidden=true;if(dx)player.face=dx>0?1:-1;const speed=190*dt;const nx=player.x+dx/len*speed,ny=player.y+dy/len*speed/SCALE_Y;if(!blocked(nx,player.y))player.x=nx;if(!blocked(player.x,ny))player.y=ny;walking=player.x!==oldX||player.y!==oldY;if(walking)setDispatch(false);}
    near=null;let min=90;for(const b of buildings){const m=mailbox(b),dist=Math.hypot(player.x-m.x,(player.y-m.y)*SCALE_Y);if(dist<min){min=dist;near=b;}}
    for(const sign of visibleSigns()){const dist=Math.hypot(player.x-sign.x,(player.y-sign.y)*SCALE_Y);if(dist<min){min=dist;near=sign;}}
    const btn=$('interact-btn');btn.hidden=!near||(won&&near.kind!=='sign'&&near.type!=='workshop')||(campaignDone&&near.kind!=='sign'&&near.type!=='workshop');btn.querySelector('span').textContent=near?.kind==='sign'?'Read '+near.label[0]:near?.id==='router'?'Forward packet':near?.id==='dns'?'Resolve hostname':near?.id==='post'?'Check dispatch':near?.type==='workshop'?'Open server workshop':'Deliver packet';
  }
  if(started){const halfY=height/(zoom*SCALE_Y),relative=(player.y-camera.y)/halfY+.5;const target=cameraTarget(player.x,relative>.72?player.y-.22*halfY:relative<.25?player.y+.25*halfY:camera.y),desiredX=target.x,desiredY=target.y;camera.x+=(desiredX-camera.x)*Math.min(1,dt*4);camera.y+=(desiredY-camera.y)*Math.min(1,dt*4);}
  for(const p of particles){p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy+=220*dt;p.life-=dt;}particles=particles.filter(p=>p.life>0);
  const remote=riverX!==null&&player.x>riverX+100;$('location-name').textContent=remote?'Sunrise Subnet':'Loopback Meadows';$('subnet-label').textContent=remote?'REMOTE NETWORK · 192.168.2.0/24':'LOCAL NETWORK · 192.168.1.0/24';
}draw();requestAnimationFrame(tick);}
workshop=initWorkshop({onOpen:()=>{workshopVisible=true;keys.clear();path=[];},onClose:()=>{workshopVisible=false;last=performance.now();resize();}});
$('sign-close').onclick=closeSign;$('spawn-close').onclick=()=>{$('spawn-note').hidden=true;};$('sign-explore').onclick=()=>{const sign=currentSign;if(!sign)return;closeSign();const b=buildings.find(b=>b.id===sign.target)??nextStop();const m=mailbox(b);hintUntil=clock+15;navigate(m.x,m.y+32);};$('route-btn').onclick=()=>{$('route-details').hidden=!$('route-details').hidden;$('route-btn').setAttribute('aria-expanded',String(!$('route-details').hidden));};$('route-close').onclick=()=>{$('route-details').hidden=true;$('route-btn').setAttribute('aria-expanded','false');$('dispatch-toggle').focus();};$('trail-btn').onclick=()=>{updateGuide();addTrailNotes();openDialog('guide');};
$('lessons-toggle').onclick=()=>{showSigns=!showSigns;$('lessons-toggle').textContent=showSigns?'Hide lesson signs':'Show lesson signs';$('lessons-toggle').setAttribute('aria-pressed',String(showSigns));if(!showSigns)closeSign();};$('story-route').onclick=()=>{showRoute=!showRoute;$('story-route').textContent=showRoute?'Hide route':'Show route';$('story-route').setAttribute('aria-pressed',String(showRoute));guideAt=-1;};$('story-details').onclick=()=>{$('route-details').hidden=false;setDispatch(false);$('route-close').focus();};$('dispatch-toggle').onclick=()=>setDispatch($('dispatch-letter').hidden);$('menu-close').onclick=()=>{$('tools-menu').open=false;};
$('level-select').onchange=e=>{enterLevel(Number(e.target.value));$('tools-menu').open=false;canvas.focus();};$('tools-menu').addEventListener('click',e=>{if(e.target.closest?.('button'))$('tools-menu').open=false;});$('replay-level').onclick=()=>enterLevel(stage);$('welcome').hidden=true;soundUI();updateTrailCount();enterLevel(stage);canvas.focus({preventScroll:true});requestAnimationFrame(tick);
