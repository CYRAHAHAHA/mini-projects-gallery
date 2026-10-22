// A deterministic teaching simulation. No requests leave the browser.
export const LAB_VERSION=1;
export const workshopTerms=[
  ['Server process','A running program that listens for requests. A laptop becomes a server by running a service; it can still be a client too.'],
  ['localhost / loopback','localhost normally resolves to a loopback address such as 127.0.0.1 or ::1. It always refers to the device making the request.'],
  ['Listening address','A service bound to 127.0.0.1 accepts local connections only. Binding to 0.0.0.0 listens on all IPv4 interfaces; it is a setting, not the address clients should visit.'],
  ['Firewall','Rules allow or block traffic. Allow a specific service port from the required source network rather than disabling the entire firewall.'],
  ['HTTP request & response','A client sends a method and path; a server returns a status, headers, and often a body. An HTTP message can span many network packets.'],
  ['API / GET / POST','An API is an interface used by software. In this notes API, GET reads records and POST creates one. Endpoints and method behavior are defined by the application.'],
  ['Database','Stores structured data. Here, the API queries a database on the same laptop using its local connection. Browsers use the API; the database port stays private.'],
  ['DHCP reservation','The router assigns a chosen IP to a particular device identity when issuing a lease. A reservation is not the same as manually assigning a static IP on the laptop.'],
  ['Availability & service startup','Sleeping or powered-off laptops cannot serve requests normally. Automatic startup restores configured services after boot; it does not replace backups.'],
  ['Backup & restore','A separate copy of data can be used after loss. A backup is useful only if you can restore it. A production backup should be separate from the original machine and tested.'],
  ['DNS record','Maps a hostname to information such as an IP address. DNS does not start a server, open a firewall, or supply a port number in an ordinary A record.'],
  ['VPN / NAT / CGNAT','A VPN can provide authenticated access to a private network. NAT translates addresses; CGNAT adds translation at the ISP. A rule on your home router alone cannot create inbound reachability through the ISP’s CGNAT. VPN products and setup requirements vary.'],
  ['HTTPS / TLS / reverse proxy','TLS encrypts a connection and authenticates the server when its certificate is valid and trusted. A reverse proxy can terminate HTTPS and forward to a local HTTP service. HTTPS does not replace application authentication.']
];

const mission=(title,goal,brief,concept,controls,url,sender,hints,why,transfer)=>({title,goal,brief,concept,controls,url,sender,hints,why,transfer});
export const missions=[
  mission('Give the laptop a job','Open a web page on the laptop.','Your old laptop has a page ready, but nothing is serving it. Try the request and inspect the result.','Server process · localhost · port',['web'],'http://localhost:8080/','laptop',[
    'A file on disk cannot answer a network request. Look at the web server’s process state.',
    'The URL uses localhost: this request stays on the laptop. Port 8080 is the service endpoint.',
    'Start the web server, then send the request again.'
  ],'The page worked because a running web server listened on port 8080 and answered an HTTP GET request. The hardware was already capable; the server is software.','With Python installed, python3 -m http.server 8080 --bind 127.0.0.1 serves the current folder locally. On Windows, py -m http.server may be the command. Use a folder containing only files you intend to serve. This development server is not a production server.'),
  mission('A phone wants to visit','Open that page from your phone on home Wi-Fi.','The web server is running and already accepts LAN connections for this exercise. Your phone still cannot see the page.','Client · loopback · LAN IP',[],'http://localhost:8080/','phone',[
    'localhost means the device sending the request. Which device is sending this one?',
    'The phone needs the laptop’s LAN IP. Inspect the address on the laptop below.',
    'Send the phone to http://192.168.1.50:8080/ instead of localhost.'
  ],'On the phone, localhost meant the phone. The laptop’s LAN IP identified a different device on the same network. No port forwarding was needed.','Find the laptop’s local IPv4 address in its network settings. A phone on the same LAN uses that address plus the service port; localhost on the phone refers to the phone.'),
  mission('The door faces inward','Let the phone reach the running web server.','After a restart, the server is listening only on 127.0.0.1. The phone has the correct laptop IP.','Binding · network interface',['bind'],'http://192.168.1.50:8080/','phone',[
    'An IP address can be correct while the service listens on the wrong interface.',
    '127.0.0.1 is loopback. The phone arrives through the laptop’s LAN interface.',
    'Change the listening address to 0.0.0.0, then retry the phone request. Keep the destination as the laptop’s actual IP.'
  ],'The listening address controlled where the process accepted traffic. 0.0.0.0 is a bind setting, not a destination address to type into the phone.','Use the service’s documented host/bind option to listen on the intended interface. For a LAN-only development exercise, 0.0.0.0 listens on all IPv4 interfaces; review firewall scope before doing this.'),
  mission('A very specific permission','Allow the phone’s request without disabling the firewall.','The process is running and listening on the LAN. A firewall rule now blocks inbound TCP port 8080.','Firewall · TCP port',['firewall'],'http://192.168.1.50:8080/','phone',[
    'Read the trace: does it reach the application, or stop before an HTTP response?',
    'The rule needs the web server’s TCP port and your home LAN as its source.',
    'Allow LAN → TCP 8080. Leave the database private, then retry.'
  ],'A narrow firewall rule allowed this LAN connection. The database did not need an inbound rule, and the firewall stayed enabled.','Add an OS-specific inbound rule for your service port, limited to the network or sources that need access. Do not turn off the whole firewall to make one service work.'),
  mission('A service for software','Get the notes API to return its records.','The website works. Now a client needs structured data from a separate API process on port 3000.','API · endpoint · JSON',['api'],'http://192.168.1.50:3000/api/notes','phone',[
    'The website and API are separate processes in this exercise. One can run while the other is stopped.',
    'Port 3000 is this API’s configured port, not a universal API port. The endpoint is /api/notes.',
    'Start the notes API and retry GET /api/notes on port 3000.'
  ],'The API answered with JSON rather than an HTML page. Its port and endpoint were application configuration, not special properties of the laptop.','A real API requires application code or a server framework. It can share a process with a website or run separately, as in this simulation. An ordinary static file server does not implement this notes API.'),
  mission('Make something worth saving','Save a note through the API.','Reading the list does not add a record. Create a note containing any short message you want to keep.','HTTP method · POST · request body',['api','body'],'http://192.168.1.50:3000/api/notes','phone',[
    'GET reads the list in this API. You need the operation that creates a new record.',
    'Use POST with a JSON body containing a text field. The API validates that body.',
    'Choose POST and enter {"text":"Water the basil"}, or use your own message. Then send it.'
  ],'The API accepted a POST body, wrote the note to its database, and returned 201 Created. A successful GET alone would not have saved anything.','In an actual app, validate input and use parameterized database queries. HTTP methods express intent; the application implements the behavior and access rules.'),
  mission('The API’s own delivery','Repair the API’s connection to its database.','The API process is running, but its database process stopped. The browser receives 503 Service Unavailable.','Database · dependency · 503',['api','db'],'http://192.168.1.50:3000/api/notes','phone',[
    'The request reached the API. That rules out the phone’s address and the API’s inbound firewall in this scenario.',
    'Read the application log. Which local service did the API fail to contact?',
    'Start the database. Keep its listening address at 127.0.0.1 and retry the API request.'
  ],'The browser reached the API, and the API made a separate local database query. Repairing that dependency restored the response without exposing the database port.','Inspect the API’s logs and its database connection configuration. If both processes are on one machine, a loopback database connection can keep it off the LAN. Containers introduce additional network boundaries.'),
  mission('Read it back','Retrieve your saved note, without creating another.','The database is healthy again. Your request form still has the previous create operation selected.','GET · POST · persistence',['body'],'http://192.168.1.50:3000/api/notes','phone',[
    'The goal is to read an existing record. Sending another write is a different operation.',
    'Change the method, not the database’s visibility or the device address.',
    'Use GET /api/notes. Your saved note should appear in the response JSON.'
  ],'The note outlived the request that created it. GET retrieved stored data without creating a duplicate record.','A database usually persists data on disk, but persistence depends on configuration. Container data needs durable storage; a temporary in-memory store disappears when its process ends.'),
  mission('Yesterday’s address','Restore a stable way to reach the laptop.','DHCP issued a different lease: the laptop is now 192.168.1.77. The phone still uses yesterday’s address.','DHCP lease · reservation',['dhcp'],'http://192.168.1.50:8080/','phone',[
    'Compare the destination with the laptop’s current IP in the status strip.',
    'Using .77 tests the current lease. A reservation can make later leases predictable.',
    'Reserve 192.168.1.50 and renew the simulated lease, then retry the old URL. The task requires the reservation as well as a working page.'
  ],'The router’s reservation issued .50 to this device on renewal. That made its LAN address predictable. A reservation does not make a service publicly reachable.','Configure a DHCP reservation on your router for the laptop’s device identity. Check the router’s subnet, DHCP range, and address conflicts; do not copy this example address blindly.'),
  mission('The lid-close mystery','Keep the page available when nobody touches the laptop.','The laptop went to sleep. Correct addresses and a running-service setting cannot help while the device is suspended.','Sleep · availability',['awake'],'http://192.168.1.50:8080/','phone',[
    'The trace stops at the laptop before reaching any process. Inspect its power state.',
    'A server must remain awake to answer normal requests. A firewall change will not wake it.',
    'Wake the laptop and enable the keep-awake setting, then retry.'
  ],'The powered, awake laptop could answer again. Network availability depends on the machine’s power and sleep settings as well as its services.','Review sleep and lid-close behavior in your OS, maintain ventilation, and use a sound power supply. A permanently running laptop still needs updates and a restart plan.'),
  mission('Survive a reboot','Make the services return after a reboot, then test them.','A reboot stopped your services. Starting them by hand once will not prove that the next boot works.','Service manager · automatic startup',['web','api','db','autostart'],'http://192.168.1.50:3000/api/notes','phone',[
    'This task checks what happens after boot, not just what is running now.',
    'Configure automatic service startup, then use the reboot control as a test.',
    'Enable automatic startup, reboot, and send GET /api/notes. The database and API must both come back.'
  ],'You tested service startup with a real simulated reboot. The API and database came back automatically and returned the saved record.','Use your OS service manager, such as systemd on many Linux systems, with documented startup ordering, restart policy, and logs. Automatic startup is not a guarantee that an app is healthy.'),
  mission('A backup you can trust','Back up, simulate data loss, restore, and read your note.','A saved record is not a backup. Prove recovery before relying on this laptop for important data.','Backup · restore · recovery test',['backup'],'http://192.168.1.50:3000/api/notes','phone',[
    'First create a backup. The recovery exercise does not allow data loss until that copy exists.',
    'After simulating loss, restore the backup. Then verify through the API, not just a “restored” label.',
    'Create backup → simulate data loss → restore backup → GET /api/notes. Confirm your original note is present.'
  ],'The recovery test succeeded because a separate snapshot survived the simulated loss and restored the expected record. An empty successful response would not have proved recovery.','Use a database-supported backup method, keep copies separate from the laptop, protect sensitive backups, and test restores. Copying a live database file without following its backup procedure can produce an inconsistent copy.'),
  mission('A name for your home','Open the page using home.example.','Your local DNS has no A record for this name. The server itself is healthy.','DNS A record · hostname',['dns'],'http://home.example:8080/','phone',[
    'NXDOMAIN is a DNS result, not an HTTP status. No request reached the web server.',
    'An A record supplies an IPv4 address. It does not supply the service port.',
    'Set the local A record to the laptop’s current IPv4 address, then retry home.example:8080.'
  ],'The local DNS record resolved the hostname to the laptop’s IP. Port 8080 still had to be present in the URL. This local name is not a publicly registered domain.','Configure local DNS on an appropriate resolver or router. home.example is a reserved teaching name. A public name needs a domain you control and suitable DNS; local DNS alone does not make a server public.'),
  mission('Away from home','Reach your private page from outside the home LAN.','Your simulated ISP uses CGNAT. You want private remote access to the laptop, not a publicly exposed database.','VPN · NAT · CGNAT',['vpn','forward'],'http://192.168.1.50:8080/','away',[
    'A private 192.168.x.x address is not directly routed across the public internet.',
    'The router WAN is 100.64.12.8, inside shared address space used by CGNAT. A home-router rule cannot open the ISP’s upstream mapping.',
    'Connect the preconfigured simulated VPN, then retry the private IP. Port forwarding alone will not solve this scenario.'
  ],'The VPN provided a private route into the home LAN. A home-router port-forward rule alone could not cross this scenario’s CGNAT. The database stayed private.','Choose a VPN solution with authenticated access appropriate to your network; some require a relay or coordination service behind CGNAT. Public hosting is a separate setup involving reachability, firewall rules, TLS, authentication, and maintenance.'),
  mission('Protect the connection','Visit the page over HTTPS through your VPN.','The VPN is connected. The local DNS record is correct. A local CA certificate is already trusted on the simulated client, but the HTTPS reverse proxy is stopped.','HTTPS · TLS · reverse proxy',['tls'],'https://home.example/','away',[
    'https uses port 443 by default. Starting a plain HTTP service on 8080 does not automatically add TLS.',
    'The reverse proxy can accept TLS on 443 and forward to the existing HTTP server on 8080.',
    'Start the HTTPS reverse proxy. Retry https://home.example/; check both the TLS step and the upstream web server in the trace.'
  ],'TLS protected the client-to-proxy connection. The proxy then forwarded locally to the HTTP server. The trusted, matching certificate was a prerequisite, not something HTTPS invents by itself.','Use valid certificates for the chosen name and clients. A private CA requires explicit client trust; public CAs will not issue for this reserved example name. Encryption does not replace authorization or careful reverse-proxy configuration.'),
  mission('Your first home-server rescue','Restore the named website and retrieve the saved note.','After a reboot and lease change, several things are broken. Test the website and API using home.example. Repair each failure using the trace; both must work from the phone.','Independent repair · transfer',['web','bind','firewall','api','db','dhcp','dns','body'],'http://home.example:8080/','phone',[
    'Work from the first failing step. DNS, the device, transport, the process, and its dependencies fail differently.',
    'Compare DNS with the current lease, then inspect processes, listening address, and the specific firewall rule.',
    'Restore the address/DNS mapping; start web, API, and database; listen on the LAN and allow TCP 8080. Verify GET home.example:8080/ and GET home.example:3000/api/notes.'
  ],'You repaired a connected system rather than memorizing a route. The same host served a website, an API, and a private database; you verified both the page and its saved data.','Next real-world milestone: serve one non-sensitive page locally, open it from a second LAN device, then build a tiny API with durable storage. Keep private services private until you understand their access controls and maintenance needs.')
];

export function createLab(index,carry={}){
  const i=Math.max(0,Math.min(missions.length-1,Math.floor(index)||0));
  const text=typeof carry.note==='string'&&carry.note.trim()?carry.note.slice(0,200):'Water the basil';
  const state={webRunning:true,apiRunning:true,dbRunning:true,webBind:'0.0.0.0',allowWeb:true,ip:'192.168.1.50',reserved:false,awake:true,keepAwake:false,autostart:false,bootTest:false,notes:[{id:1,text}],expectedNote:text,backup:null,lossTest:false,restoreTest:false,dns:'192.168.1.50',vpn:false,portForward:false,cgnat:true,tlsRunning:false,certificateTrusted:true,websiteSeen:false,notesSeen:false};
  if(i===0){state.webRunning=false;state.webBind='127.0.0.1';}
  if(i===2)state.webBind='127.0.0.1';
  if(i===3)state.allowWeb=false;
  if(i===4)state.apiRunning=false;
  if(i===5)state.notes=[];
  if(i===6)state.dbRunning=false;
  if(i===8)state.ip='192.168.1.77';
  if(i===9)state.awake=false;
  if(i===10){state.webRunning=false;state.apiRunning=false;state.dbRunning=false;}
  if(i===12)state.dns='';
  if(i===14)state.vpn=true;
  if(i===15){state.ip='192.168.1.77';state.webRunning=false;state.apiRunning=false;state.dbRunning=false;state.webBind='127.0.0.1';state.allowWeb=false;}
  return {index:i,state,request:{sender:missions[i].sender,method:i===7?'POST':'GET',url:missions[i].url,body:i===7?JSON.stringify({text:'A second note'}):''}};
}

export function applyAction(s,action,value){
  const booleanFields={web:'webRunning',api:'apiRunning',db:'dbRunning',firewall:'allowWeb',awake:'keepAwake',autostart:'autostart',vpn:'vpn',forward:'portForward',tls:'tlsRunning'};
  if(booleanFields[action]){s[booleanFields[action]]=Boolean(value);if(action==='awake'&&value)s.awake=true;return 'Configuration updated. Send a request to test what changed.';}
  if(action==='bind'){s.webBind=value==='0.0.0.0'?'0.0.0.0':'127.0.0.1';return 'Web server listening address updated.';}
  if(action==='dhcp'){s.reserved=true;s.ip='192.168.1.50';return 'Router reservation saved; renewed lease: 192.168.1.50.';}
  if(action==='dns'){s.dns=String(value).trim().slice(0,64);return 'Local DNS A record updated. Test the hostname.';}
  if(action==='reboot'){s.awake=true;s.webRunning=s.autostart;s.apiRunning=s.autostart;s.dbRunning=s.autostart;s.bootTest=true;return s.autostart?'Reboot complete. Configured services started automatically.':'Reboot complete. Services are stopped: automatic startup is disabled.';}
  if(action==='backup'){if(s.lossTest&&!s.restoreTest)return 'Restore the good backup before replacing it with an empty one.';s.backup=s.notes.map(n=>({...n}));return 'Separate simulated backup created. Now test recovery.';}
  if(action==='loss'){if(!s.backup?.some(n=>n.text===s.expectedNote))return 'Create a backup containing your note before testing data loss.';s.notes=[];s.lossTest=true;s.restoreTest=false;return 'Simulated disk data lost. The separate backup still exists.';}
  if(action==='restore'){if(!s.backup)return 'No backup exists. Create a backup before testing recovery.';s.notes=s.backup.map(n=>({...n}));s.restoreTest=s.lossTest;return 'Backup restored. Verify the note through GET /api/notes.';}
  return 'Choose a supported configuration action.';
}

export function runRequest(s,request){
  const trace=[];let u;
  const fail=(code,message,status=null,body=null)=>({ok:false,code,message,status,body,trace});
  const step=(name,detail,ok=true)=>trace.push({name,detail,ok});
  const sender=['laptop','phone','away'].includes(request.sender)?request.sender:'phone';
  step('Client',sender==='laptop'?'Browser on the old laptop':sender==='phone'?'Phone on the home LAN':'Client away from home');
  try{u=new URL(request.url);}catch{step('URL','A complete URL needs a scheme, host, and optional port.',false);return fail('URL','Use a URL such as http://192.168.1.50:8080/.');}
  if(!['http:','https:'].includes(u.protocol)){step('URL','This client speaks HTTP or HTTPS.',false);return fail('PROTOCOL','Use http:// or https:// for this web client.');}
  let host=u.hostname;const local=['localhost','127.0.0.1','[::1]'].includes(host);
  if(host==='home.example'){if(!s.dns){step('DNS','NXDOMAIN: no local A record for home.example.',false);return fail('DNS','No DNS record exists. The request has not reached a server.');}host=s.dns;step('DNS',`home.example → ${host} (simulated local resolver)`);}
  if(local&&sender!=='laptop'){step('Loopback',`${u.hostname} refers to the ${sender==='phone'?'phone':'away client'} itself.`,false);return fail('LOOPBACK','This client is looking at itself. Use the old laptop’s LAN IP to contact the laptop.');}
  if(host==='0.0.0.0'){step('Destination','0.0.0.0 is a wildcard bind setting here, not a client destination.',false);return fail('DESTINATION','Use the laptop’s actual LAN IP as the destination.');}
  if(sender==='away'){
    if(!s.vpn){step('Route',s.portForward?'Home-router rule exists, but ISP CGNAT still blocks unsolicited inbound access.':'No private route to the home LAN.',false);return fail('PRIVATE_ROUTE','The private LAN address is not directly internet-routable. A configured VPN can provide a private route in this scenario.');}
    step('VPN route','Authenticated simulated VPN → home LAN');
  }else step('Route',local?'Loopback: stays on this laptop':'Same home subnet: direct LAN delivery');
  if(!local&&host!==s.ip){step('Destination',`No simulated laptop at ${host}. Current lease: ${s.ip}.`,false);return fail('WRONG_IP','Compare the destination IP with the laptop’s current DHCP lease.');}
  if(!s.awake){step('Laptop','Suspended: no response from the device.',false);return fail('ASLEEP','The laptop is asleep. Wake it and check its sleep policy.');}
  step('Laptop',`Awake · ${s.ip}`);
  const port=Number(u.port)||(u.protocol==='https:'?443:80);
  if(port===5432){step('Database port','Database uses a database protocol, with loopback-only access.',false);return fail('DB_PRIVATE','Use the API on port 3000. This database is not an HTTP endpoint and is not exposed to the LAN.');}
  if(![8080,3000,443].includes(port)){step('TCP connection',`No service configured on port ${port}.`,false);return fail('REFUSED',`No service listens on ${port}. Check the configured service port.`);}
  if(port===8080&&!local&&s.webBind!=='0.0.0.0'){step('Listening address','Web server accepts loopback connections only.',false);return fail('BIND','The process is running but listens only on 127.0.0.1. LAN clients arrive on another interface.');}
  if(port===8080&&sender!=='laptop'&&!s.allowWeb){step('Firewall','LAN → TCP 8080 is blocked.',false);return fail('FIREWALL','Allow this specific web port from the LAN. Keep the firewall and private database boundary in place.');}
  const transportDetail=`${local?'Local':sender==='away'?'VPN':'LAN'} → TCP ${port}`;
  let service=port===3000?'api':'web';
  if(port===443){
    if(!s.tlsRunning){step('HTTPS proxy','No process listening on TCP 443.',false);return fail('REFUSED','The HTTPS reverse proxy is stopped. HTTP on port 8080 does not automatically provide HTTPS.');}
    step('TCP connection',transportDetail);
    if(u.protocol!=='https:'){step('TLS','Port 443 expects a TLS connection.',false);return fail('TLS','Use https:// for this TLS listener.');}
    if(!s.certificateTrusted||u.hostname!=='home.example'){step('TLS certificate','Certificate is untrusted or does not match the hostname.',false);return fail('CERTIFICATE','Use the certificate’s matching name. This simulation assumes a local CA already trusted by the client.');}
    step('TLS','Encrypted client → proxy; matching, trusted local CA certificate');step('Reverse proxy','Proxy → localhost:8080 (HTTP)');
  }else if(u.protocol==='https:'){step('TLS','This port is configured for plain HTTP, not TLS.',false);return fail('TLS','Use HTTP on this service port, or configure an HTTPS listener on 443.');}
  if(!(service==='api'?s.apiRunning:s.webRunning)){step(service==='api'?'API process':'Web process','Stopped: no application response.',false);return fail(port===443?'UPSTREAM':'REFUSED',port===443?'HTTPS proxy is reachable, but its HTTP upstream is stopped.':'Start the service process and retry.',port===443?502:null);}
  if(port!==443)step('TCP connection',transportDetail);
  step(service==='api'?'API process':'Web process',`Running · ${request.method} ${u.pathname}`);
  if(service==='web'){
    if(request.method!=='GET'){step('HTTP response','405 Method Not Allowed',false);return fail('METHOD','This simulated website supports GET.',405);}
    if(!['/','/index.html'].includes(u.pathname)){step('HTTP response','404 Not Found',false);return fail('PATH','The server answered, but this website has no page at that path.',404);}
    step('HTTP response','200 OK · text/html → client');return {ok:true,code:'PAGE',status:200,message:'The client received the laptop’s web page.',body:'<h1>Hello from my old laptop!</h1>',trace,service,host:u.hostname};
  }
  if(u.pathname!=='/api/notes'){step('HTTP response','404 Not Found',false);return fail('PATH','The API answered, but its notes endpoint is /api/notes.',404);}
  if(!['GET','POST'].includes(request.method)){step('HTTP response','405 Method Not Allowed',false);return fail('METHOD','This endpoint implements GET and POST.',405);}
  if(!s.dbRunning){step('Database query','API log: connection refused at 127.0.0.1:5432.',false);step('HTTP response','API returns 503 Service Unavailable',false);return fail('DATABASE','The API is reachable. Its local database dependency is stopped.',503,{error:'database_unavailable'});}
  step('Database query','API → local database at 127.0.0.1:5432; database port stays private');
  if(request.method==='POST'){
    let data;try{data=JSON.parse(request.body);}catch{step('Validation','400 Bad Request: malformed JSON body.',false);return fail('JSON','Send valid JSON such as {"text":"Water the basil"}.',400);}
    if(!data||typeof data.text!=='string'||!data.text.trim()||data.text.trim().length>200){step('Validation','400 Bad Request: text must be 1–200 characters.',false);return fail('VALIDATION','Provide a non-empty text string of at most 200 characters.',400);}
    if(s.notes.length>=20){step('Validation','409 Conflict: simulated notebook is full.',false);return fail('LIMIT','The simulated notebook holds 20 notes. Reset this challenge to try again.',409);}
    const note={id:Math.max(0,...s.notes.map(n=>n.id))+1,text:data.text.trim()};s.notes.push(note);step('Database write',`Persisted note ${note.id}`);step('HTTP response','201 Created · application/json → client');return {ok:true,code:'CREATED',status:201,message:'Your note was saved through the API.',body:note,trace,service,host:u.hostname};
  }
  step('Database read',`${s.notes.length} stored record${s.notes.length===1?'':'s'}`);step('HTTP response','200 OK · application/json → client');return {ok:true,code:'NOTES',status:200,message:'The API returned the stored notes.',body:s.notes.map(n=>({...n})),trace,service,host:u.hostname};
}

export function checkGoal(index,s,request,result){
  if(!result.ok)return false;
  const page=result.code==='PAGE',notes=result.code==='NOTES'&&result.body.some(n=>n.text===s.expectedNote),phone=request.sender==='phone';
  switch(index){
    case 0:return page&&request.sender==='laptop';
    case 1:case 2:case 3:return page&&phone;
    case 4:return result.code==='NOTES'&&phone;
    case 5:return result.code==='CREATED'&&phone;
    case 6:case 7:return notes&&phone;
    case 8:return page&&phone&&s.reserved&&s.ip==='192.168.1.50';
    case 9:return page&&phone&&s.keepAwake;
    case 10:return notes&&phone&&s.autostart&&s.bootTest;
    case 11:return notes&&phone&&s.lossTest&&s.restoreTest;
    case 12:return page&&phone&&result.host==='home.example';
    case 13:return page&&request.sender==='away'&&s.vpn;
    case 14:return page&&request.sender==='away'&&request.url.startsWith('https://')&&s.tlsRunning;
    case 15:
      if(phone&&result.host==='home.example'){if(page)s.websiteSeen=true;if(notes)s.notesSeen=true;}
      return s.websiteSeen&&s.notesSeen&&s.webRunning&&s.apiRunning&&s.dbRunning&&s.webBind==='0.0.0.0'&&s.allowWeb&&s.awake&&s.dns===s.ip;
    default:return false;
  }
}
