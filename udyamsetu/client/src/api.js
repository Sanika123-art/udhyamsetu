import {io} from 'socket.io-client';
export const api=async(path,o={})=>{const t=localStorage.getItem('tok');
 const r=await fetch('/api'+path,{method:o.method||'GET',headers:{'Content-Type':'application/json',...(t?{Authorization:'Bearer '+t}:{})},body:o.body?JSON.stringify(o.body):undefined});
 const d=await r.json().catch(()=>({}));if(!r.ok)throw new Error(d.error||'Error');return d};
export const connect=(onChange,onNotify)=>{const s=io({auth:{token:localStorage.getItem('tok')}});s.on('changed',onChange);s.on('notify',onNotify);return s};
