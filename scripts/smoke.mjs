import {spawn} from 'node:child_process';
import {setTimeout as delay} from 'node:timers/promises';
import fs from 'node:fs/promises';
const chrome='C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const port=9224;
const profile=process.env.TEMP+'\\clone-school-chrome-smoke3';
const child=spawn(chrome,[`--remote-debugging-port=${port}`,`--user-data-dir=${profile}`,'--headless=new','--disable-gpu','about:blank'],{stdio:'ignore'});
async function waitJson(){ for(let i=0;i<60;i++){ try{const r=await fetch(`http://127.0.0.1:${port}/json/list`); if(r.ok) return await r.json();}catch{} await delay(200);} throw new Error('no');}
try{
  let list=await waitJson();
  let page=list.find(x=>x.type==='page')||list[0];
  const ws=new WebSocket(page.webSocketDebuggerUrl);
  await new Promise((res,rej)=>{ws.onopen=res;ws.onerror=rej;});
  let id=0; const pending=new Map(); const errors=[];
  ws.onmessage=e=>{const msg=JSON.parse(e.data); if(msg.id){const p=pending.get(msg.id); if(p){pending.delete(msg.id); msg.error?p.rej(new Error(msg.error.message)):p.res(msg.result);}}
    if(msg.method==='Runtime.exceptionThrown') errors.push(msg.params.exceptionDetails?.exception?.description||msg.params.exceptionDetails?.text||'exception');
    if(msg.method==='Log.entryAdded' && ['error','assert'].includes(msg.params.entry.level)) errors.push(msg.params.entry.text);
  };
  const send=(method,params={})=>new Promise((res,rej)=>{const my=++id; pending.set(my,{res,rej}); ws.send(JSON.stringify({id:my,method,params})); setTimeout(()=>{if(pending.has(my)){pending.delete(my); rej(new Error('timeout '+method));}},15000);});
  await send('Runtime.enable'); await send('Page.enable'); await send('Log.enable');
  const results=[]; const pages=['/splash','/login','/register','/home','/courses','/games','/euee','/euee/archive','/courses/scholar','/profile','/settings','/notifications'];
  for(const path of pages){ errors.length=0; await send('Page.navigate',{url:`http://127.0.0.1:4173${path}`}); await delay(1800);
    const actual=(await send('Runtime.evaluate',{expression:'location.pathname',returnByValue:true})).result.value;
    const title=(await send('Runtime.evaluate',{expression:'document.title',returnByValue:true})).result.value;
    const snippet=(await send('Runtime.evaluate',{expression:'document.body.innerText.replace(/\\s+/g," ").slice(0,160)',returnByValue:true})).result.value;
    results.push({path,actual,title,errors:[...errors],snippet});
  }
  await fs.mkdir('screenshots',{recursive:true});
  for(const [name,w,h] of [['mobile',390,844],['tablet',768,1024],['desktop',1440,900]]){
    await send('Emulation.setDeviceMetricsOverride',{width:w,height:h,deviceScaleFactor:1,mobile:name==='mobile'});
    for(const path of ['/home','/courses','/euee/archive','/games']){
      await send('Page.navigate',{url:`http://127.0.0.1:4173${path}`}); await delay(1500);
      const shot=await send('Page.captureScreenshot',{format:'png'});
      await fs.writeFile(`screenshots/${name}${path.replaceAll('/','_')}.png`,Buffer.from(shot.data,'base64'));
    }
  }
  console.log(JSON.stringify(results,null,2));
  ws.close();
} finally { try{child.kill();}catch{} }
