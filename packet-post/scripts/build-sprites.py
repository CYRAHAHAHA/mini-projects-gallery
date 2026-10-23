"""Author the cube-world SVG sprite set. No runtime dependencies."""
from pathlib import Path
OUT=Path(__file__).resolve().parents[1]/'assets/sprites'
def poly(p,c):return f'<polygon points="{p}" fill="{c}"/>'
def rect(x,y,w,h,c):return f'<rect x="{x}" y="{y}" width="{w}" height="{h}" fill="{c}"/>'
def cube(x,y,w,h,d,colors):
 a,b,c=colors
 return poly(f'{x},{y} {x+d},{y-d*.65} {x+w+d},{y-d*.65} {x+w},{y}',a)+rect(x,y,w,h,b)+poly(f'{x+w},{y} {x+w+d},{y-d*.65} {x+w+d},{y+h-d*.65} {x+w},{y+h}',c)
def label(s,x,y,size=14,c='#183a48'):return f'<text x="{x}" y="{y}" font-family="sans-serif" font-weight="bold" font-size="{size}" fill="{c}">{s}</text>'
cream=('#fff7d9','#f0ddac','#c2ac7e');blue=('#87e4fa','#359fc8','#247092');ink=('#426376','#243e50','#182b3b');mint=('#92f2c1','#3bb990','#25846e');purple=('#c5b7ff','#8b78d2','#6055a2');gold=('#ffe591','#efb951','#b58235')
def save(name,body):
 OUT.joinpath(name+'.svg').write_text('<svg xmlns="http://www.w3.org/2000/svg" width="240" height="260" viewBox="0 0 240 260"><title>'+name.replace('-',' ')+'</title>'+poly('26,222 171,242 227,208 78,190','#224b4830')+body+'</svg>')
def plinth():return cube(25,201,165,16,25,('#e9f5cd','#c1d49b','#8dac80'))
s=plinth()+cube(44,109,125,91,26,cream)+cube(36,98,141,18,26,mint)+cube(62,65,88,31,18,mint)
s+=rect(79,70,49,24,'#fff9dd')+poly('81,73 103,87 126,73','#f3b654')+label('PACKET POST',52,137,14)
s+=rect(57,151,47,33,'#29495b')+rect(62,156,37,4,'#91e5cf')+rect(121,150,31,50,'#277d79')+cube(14,177,34,28,11,gold)
save('packet-depot',s)
for name,palette,caption in [('desktop-client',blue,'CLIENT'),('phone-client',purple,'PHONE'),('printer-client',gold,'PRINTER')]:
 s=plinth()
 if name=='desktop-client':
  s+=cube(52,61,113,97,19,ink)+rect(61,70,95,76,'#a3ebed')+rect(69,79,79,12,'#f6ffde')+rect(70,101,45,7,'#3a9fae')+rect(70,115,64,7,'#3a9fae')+cube(99,157,20,31,10,palette)+cube(69,188,81,9,17,palette)
 elif name=='phone-client':
  s+=cube(75,41,74,154,19,palette)+rect(82,56,59,116,'#243e50')+rect(88,64,47,89,'#d7f4f0')+rect(97,84,30,26,'#8b78d2')+rect(96,124,31,5,'#61bba9')+rect(105,180,15,4,'#fff7d9')
 else:
  s+=cube(49,126,121,67,23,palette)+cube(64,109,87,24,16,ink)+rect(76,68,65,65,'#fff9df')+rect(85,82,46,5,'#87a6ac')+rect(85,94,36,5,'#87a6ac')+rect(64,156,90,12,'#243e50')+rect(78,166,65,34,'#fff9df')
 s+=label(caption,64,222,12);save(name,s)
s=plinth()+cube(43,66,122,112,17,ink)+rect(51,74,106,91,'#78d7d2')+label('&gt; localhost',57,100,12)+rect(60,114,64,6,'#285767')+rect(60,128,86,6,'#285767')+cube(32,184,145,17,29,blue)
for y in [181,187,193]:
 for x in range(53,155,14):s+=rect(x,y,10,3,'#245477')
save('laptop-workshop',s)
s=plinth()+cube(38,132,136,59,29,mint)
for x in [49,162]:s+=cube(x,51,7,80,7,ink)+cube(x-3,45,13,11,7,mint)
s+=poly('62,127 91,109 91,119 135,119 135,109 163,126 135,143 135,133 91,133 91,143','#eaffdd')
for x in range(50,161,25):s+=rect(x,158,18,18,'#203d4a')+rect(x+3,160,12,5,'#ffc96b')
s+=label('GATEWAY',67,215,12);save('router',s)
s=plinth()+cube(57,48,107,149,27,blue)+cube(49,37,123,17,27,cream)
for y,word in [(76,'.example'),(111,'A RECORD'),(146,'192.168…')]:s+=rect(66,y-15,88,27,'#e9f9e9')+label(word,72,y+2,11)+rect(69,y+7,8,2,'#237a96')
s+=label('DNS',89,29,22);save('dns-directory',s)
s=plinth()+cube(39,61,139,136,25,ink)+cube(33,48,151,18,25,gold)
for x,title,color in [(49,'HTTPS','#65dcc6'),(113,'HTTP','#f7c96b')]:
 s+=rect(x,79,54,104,'#36546a')+label(title,x+5,96,10,'#f3f9df')
 for y in [110,132,154]:s+=rect(x+6,y,41,15,'#1b3042')+rect(x+10,y+5,5,5,color)+rect(x+21,y+6,20,3,'#7499a7')
s+=label('BAKERY WEB',48,41,15);save('web-server',s)
s=plinth()+cube(58,63,103,132,23,purple)
for y in [76,112,148]:s+=cube(69,y,80,27,7,ink)+rect(76,y+8,7,7,'#a4ecc6')+rect(90,y+9,44,4,'#7297ad')
s+=label('REMOTE HOST',51,222,12);save('remote-host',s)
s=cube(107,166,17,54,15,('#ba9863','#9b794b','#705b3f'))+cube(62,85,94,80,31,mint)+cube(80,51,59,49,23,('#b7eb93','#7ecb71','#4c9b67'));save('tree',s)
s=cube(99,132,12,89,10,cream)+cube(26,96,176,69,12,('#ffedbd','#ffdda0','#ba8d50'))+rect(34,104,160,51,'#fff8dc');save('signboard',s)
s=cube(103,166,9,51,8,cream)+cube(81,132,53,39,12,blue)+rect(88,143,38,5,'#f7f5d4')+rect(136,115,5,35,'#e98669')+rect(141,115,17,12,'#f8ae75');save('mailbox',s)
# Small block-bodied courier; separate legs are animated by the renderer.
s=cube(83,122,61,63,16,blue)+cube(79,68,65,55,17,('#ffe5b5','#f3bf8c','#d99468'))+cube(72,54,80,20,20,blue)+cube(77,74,82,7,24,ink)+rect(96,93,5,6,'#263c49')+rect(125,93,5,6,'#263c49')+rect(108,108,12,3,'#b66f51')+poly('84,126 92,126 145,170 137,175','#ffd57e')+cube(130,152,30,33,9,gold)+cube(70,130,13,43,8,cream)+cube(148,129,12,32,8,cream)
save('postman',s)
print('Authored',len(list(OUT.glob('*.svg'))),'SVG sprites')
