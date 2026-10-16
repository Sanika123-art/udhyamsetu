import {useEffect,useState} from 'react';
import {api,connect} from './api';
import {D} from './i18n';
const R=n=>'₹'+(n||0).toLocaleString('en-IN');
const useGet=(p,tick)=>{const[d,setD]=useState(null);useEffect(()=>{let ok=true;api(p).then(x=>ok&&setD(x)).catch(()=>{});return()=>{ok=false}},[p,tick]);return d};
const fail=x=>alert(x.message);
const Tag=({t,s})=><span className={'tag '+s}>{t(s)}</span>;
const Empty=({t})=><p className="mu">{t('none')}</p>;
const Tabs=({tabs,tab,set,t})=><nav>{tabs.map(([k,i])=><button key={k} className={tab===k?'on':''} onClick={()=>set(k)}><i>{i}</i>{t(k)}</button>)}</nav>;

function Bars({data,color='var(--pr)',fmt=x=>x}){const m=Math.max(1,...data.map(d=>d.value));
 return<svg viewBox={`0 0 ${Math.max(data.length,3)*50} 130`} className="chart">{data.map((d,i)=>{const h=d.value/m*85;return<g key={i}>
 <rect x={i*50+8} y={100-h} width="34" height={h} rx="4" fill={color}/><text x={i*50+25} y="116" textAnchor="middle" fontSize="10" fill="currentColor">{d.label}</text>
 <text x={i*50+25} y={95-h} textAnchor="middle" fontSize="9" fill="currentColor">{fmt(d.value)}</text></g>})}</svg>}
function Ring({pct}){const c=2*Math.PI*40,p=Math.min(1,pct||0);
 return<svg viewBox="0 0 100 100" width="110"><circle cx="50" cy="50" r="40" fill="none" stroke="var(--bd)" strokeWidth="10"/>
 <circle cx="50" cy="50" r="40" fill="none" stroke="var(--ac)" strokeWidth="10" strokeLinecap="round" strokeDasharray={`${c*p} ${c}`} transform="rotate(-90 50 50)"/>
 <text x="50" y="56" textAnchor="middle" fontSize="18" fill="currentColor">{Math.round(p*100)}%</text></svg>}

function Auth({t,onAuth}){const[mode,setMode]=useState('login'),[f,setF]=useState({role:'seller'}),[err,setErr]=useState('');
 const set=k=>e=>setF({...f,[k]:e.target.value}),reg=mode==='register';
 const go=async e=>{e.preventDefault();setErr('');try{const r=await api(reg?'/register':'/login',{method:'POST',body:f});localStorage.setItem('tok',r.token);onAuth(r.user)}catch(x){setErr(x.message)}};
 return<form className="card auth" onSubmit={go}><h2>{t('welcome')}</h2><p className="mu">{t('tagline')}</p>
 <div className="seg"><button type="button" className={!reg?'on':''} onClick={()=>setMode('login')}>{t('login')}</button><button type="button" className={reg?'on':''} onClick={()=>setMode('register')}>{t('register')}</button></div>
 {reg&&<><div className="seg" style={{marginTop:8}}>{['seller','buyer'].map(r=><button type="button" key={r} className={f.role===r?'on':''} onClick={()=>setF({...f,role:r})}>{t(r)}</button>)}</div>
 <input placeholder={t('name')} value={f.name||''} onChange={set('name')}/><input placeholder={t('place')} value={f.place||''} onChange={set('place')}/><input placeholder={t('district')} value={f.district||''} onChange={set('district')}/></>}
 <input placeholder={t('mobile')} inputMode="numeric" maxLength={10} value={f.mobile||''} onChange={set('mobile')}/>
 <input type="password" placeholder={t('password')} value={f.password||''} onChange={set('password')}/>
 {err&&<p className="err">{err}</p>}<button style={{width:'100%'}}>{reg?t('register'):t('login')}</button></form>}

function Enq({t,tick,role}){const l=useGet('/enquiries',tick);if(!l)return null;
 const act=(id,a)=>api(`/enquiries/${id}/${a}`,{method:'POST'}).catch(fail);
 return<><h2>💬 {t('enq')}</h2>{l.length?l.map(e=><div className="card" key={e.id}>
 <div className="row"><b>{e.buyer} → {e.seller}</b><Tag t={t} s={e.status}/></div><div>{e.product} × {e.qty} · {R(e.qty*e.price)}</div>
 {e.message&&<div className="mu">“{e.message}”</div>}
 {role==='seller'&&e.status==='pending'&&<div style={{marginTop:8}}><button className="g" onClick={()=>act(e.id,'accept')}>{t('accept')}</button> <button className="r" onClick={()=>act(e.id,'reject')}>{t('reject')}</button></div>}</div>):<Empty t={t}/>}</>}
function Orders({t,tick,role}){const l=useGet('/orders',tick);if(!l)return null;
 return<><h2>🧾 {t('orders')}</h2>{l.length?l.map(o=><div className="card row" key={o.id}><div><b>{o.product} × {o.qty}</b><div className="mu">{o.buyer} → {o.seller}</div></div>
 <div style={{textAlign:'right'}}><b>{R(o.total)}</b><br/><Tag t={t} s={o.status}/>{role==='seller'&&o.status!=='delivered'&&<div><button className="o" onClick={()=>api(`/orders/${o.id}/advance`,{method:'POST'}).catch(fail)}>{t('advance')}</button></div>}</div></div>):<Empty t={t}/>}</>}

function SDash({t,tick,user}){const s=useGet('/stats',tick),[g,setG]=useState('');if(!s)return null;const top=s.demand[0];
 return<><h2>{t('hi')}, {user.name} 🙏</h2>
 <div className="grid"><div className="card st"><b>{R(s.revenue)}</b>{t('revenue')}</div><div className="card st"><b>{s.orders}</b>{t('orders')}</div><div className="card st"><b>{s.pending}</b>{t('pending')}</div></div>
 <div className="card row"><div><h3>🎯 {t('goal')}</h3><p>{R(s.month)} / {R(s.goal)}</p><input type="number" placeholder={t('goalset')} value={g} onChange={e=>setG(e.target.value)}/><button className="o" onClick={()=>api('/goal',{method:'POST',body:{goal:g}}).then(()=>setG(''))}>OK</button></div><Ring pct={s.month/s.goal}/></div>
 <div className="card"><h3>📈 {t('sales7')}</h3><Bars data={s.daily.map(d=>({label:d.day,value:d.total}))} fmt={v=>v?R(v):''}/></div>
 <div className="card"><h3>🔥 {t('pulse')} <span className="live">● LIVE</span></h3>{top?<p>{t('pulseNote')} <b>{top.category}</b></p>:<Empty t={t}/>}<Bars data={s.demand.slice(0,6).map(d=>({label:d.category.slice(0,8),value:d.score}))} color="var(--ac)"/></div>
 <div className="card"><h3>💡 {t('advisor')}</h3>{s.advice.length?<div className="sw"><table><tbody>{s.advice.map((a,i)=><tr key={i}><td>{a.name}</td><td>{t('yours')}: {R(a.price)}</td><td>{a.avg?`${t('avg')}: ${R(a.avg)}`:'—'}</td>
 <td>{!a.avg?'—':a.price>a.avg*1.2?'⬇ '+t('lower'):a.price<a.avg*.8?'⬆ '+t('raise'):'✓ '+t('fair')}</td></tr>)}</tbody></table></div>:<Empty t={t}/>}</div></>}

function SProducts({t,tick,lang}){const list=useGet('/products?mine=1',tick),E={name:'',price:'',qty:'',category:'',desc:'',image:''},[f,setF]=useState(E),[busy,setBusy]=useState(false);
 const set=k=>e=>setF({...f,[k]:e.target.value});
 const photo=e=>{const file=e.target.files[0];if(!file)return;const r=new FileReader();r.onload=()=>{const im=new Image();im.onload=()=>{const c=document.createElement('canvas'),k=Math.min(1,400/im.width);c.width=im.width*k;c.height=im.height*k;c.getContext('2d').drawImage(im,0,0,c.width,c.height);setF(x=>({...x,image:c.toDataURL('image/jpeg',.7)}))};im.src=r.result};r.readAsDataURL(file)};
 const ai=async()=>{setBusy(true);try{const r=await api('/ai-catalogue',{method:'POST',body:{name:f.name}});setTimeout(()=>{setF(x=>({...x,category:r.category,desc:r.description}));setBusy(false)},900)}catch(x){setBusy(false);fail(x)}};
 const mic=()=>{const S=window.SpeechRecognition||window.webkitSpeechRecognition;if(!S)return alert('Voice not supported in this browser');const r=new S();r.lang={en:'en-IN',mr:'mr-IN',hi:'hi-IN'}[lang];r.onresult=e=>setF(x=>({...x,name:e.results[0][0].transcript}));r.start()};
 const save=async e=>{e.preventDefault();try{await api('/products',{method:'POST',body:{...f,price:+f.price,qty:+f.qty}});setF(E)}catch(x){fail(x)}};
 return<><h2>📦 {t('add')}</h2><form className="card" onSubmit={save}>
 <label className="mu">{t('photo')}</label><input type="file" accept="image/*" onChange={photo}/>{f.image&&<img className="pimg" src={f.image}/>}
 <div className="row" style={{flexWrap:'nowrap'}}><input placeholder={t('name')} value={f.name} onChange={set('name')} required/><button type="button" className="o" onClick={mic}>{t('speak')}</button></div>
 <div className="row" style={{flexWrap:'nowrap'}}><input type="number" placeholder={t('price')} value={f.price} onChange={set('price')} required/><input type="number" placeholder={t('qty')} value={f.qty} onChange={set('qty')} required/></div>
 <button type="button" className="g" onClick={ai} disabled={!f.name||busy}>{busy?t('aiBusy'):t('ai')}</button>
 <input placeholder={t('category')} value={f.category} onChange={set('category')}/><textarea rows="3" placeholder={t('desc')} value={f.desc} onChange={set('desc')}/><button>{t('save')}</button></form>
 {list&&list.map(p=><div className="card row" key={p.id}><div>{p.image&&<img className="pimg" style={{width:80,height:60}} src={p.image}/>}<b> {p.name}</b><div className="mu">{p.category} · {R(p.price)} · {p.qty} {t('stock')}</div></div><button className="r" onClick={()=>api('/products/'+p.id,{method:'DELETE'}).catch(fail)}>{t('del')}</button></div>)}</>}

function Seller({t,tick,user,lang}){const[tab,setTab]=useState('dash');
 return<>{tab==='dash'&&<SDash t={t} tick={tick} user={user}/>}{tab==='products'&&<SProducts t={t} tick={tick} lang={lang}/>}{tab==='enq'&&<Enq t={t} tick={tick} role="seller"/>}{tab==='orders'&&<Orders t={t} tick={tick} role="seller"/>}
 <Tabs t={t} tab={tab} set={setTab} tabs={[['dash','📊'],['products','📦'],['enq','💬'],['orders','🧾']]}/></>}

function Market({t,tick}){const[q,setQ]=useState(''),[cat,setCat]=useState(''),[sel,setSel]=useState(null),[e,setE]=useState({qty:10,message:''});
 const all=useGet('/products',tick),list=useGet(`/products?q=${encodeURIComponent(q)}&cat=${encodeURIComponent(cat)}`,tick);
 const track=c=>api('/track',{method:'POST',body:{q,cat:c}}).catch(()=>{});
 const send=async()=>{try{await api('/enquiries',{method:'POST',body:{productId:sel.id,...e}});alert(t('sent'));setSel(null)}catch(x){fail(x)}};
 return<><h2>🛒 {t('market')}</h2><form className="row" style={{flexWrap:'nowrap'}} onSubmit={ev=>{ev.preventDefault();track(cat)}}>
 <input placeholder={t('search')} value={q} onChange={ev=>setQ(ev.target.value)}/><select value={cat} onChange={ev=>{setCat(ev.target.value);track(ev.target.value)}} style={{width:140}}><option value="">{t('all')}</option>{[...new Set((all||[]).map(p=>p.category))].map(c=><option key={c}>{c}</option>)}</select><button>🔍</button></form>
 {sel&&<div className="card"><h3>{sel.name}</h3><p className="mu">{sel.seller} · {sel.place} · {R(sel.price)} · {sel.qty} {t('stock')}</p><p>{sel.desc}</p>
 <input type="number" min="1" value={e.qty} onChange={ev=>setE({...e,qty:ev.target.value})}/><textarea rows="2" placeholder={t('message')} value={e.message} onChange={ev=>setE({...e,message:ev.target.value})}/>
 <button className="g" onClick={send}>{t('send')}</button> <button className="o" onClick={()=>setSel(null)}>✕</button></div>}
 <div className="grid">{(list||[]).map(p=><div className="card" key={p.id}>{p.image?<img className="pimg" src={p.image}/>:<div className="pimg" style={{fontSize:50,textAlign:'center',lineHeight:'130px'}}>🎁</div>}<b>{p.name}</b>
 <div className="mu">{p.seller} · {p.place}</div><div className="row"><b>{R(p.price)}</b><button onClick={()=>setSel(p)}>{t('enq')}</button></div></div>)}</div>{list&&!list.length&&<Empty t={t}/>}</>}
function Buyer({t,tick}){const[tab,setTab]=useState('market');
 return<>{tab==='market'&&<Market t={t} tick={tick}/>}{tab==='enq'&&<Enq t={t} tick={tick} role="buyer"/>}{tab==='orders'&&<Orders t={t} tick={tick} role="buyer"/>}
 <Tabs t={t} tab={tab} set={setTab} tabs={[['market','🛒'],['enq','💬'],['orders','🧾']]}/></>}

function Admin({t,tick}){const o=useGet('/admin/overview',tick),p=useGet('/products',tick);if(!o)return null;
 return<><h2>🛠️ {t('admin')}</h2><div className="grid">{[['sellers',o.sellers],['buyers',o.buyers],['products',o.products],['enq',o.enquiries],['orders',o.orders],['gmv',R(o.gmv)]].map(([k,v])=><div className="card st" key={k}><b>{v}</b>{t(k)}</div>)}</div>
 <div className="card sw"><h3>👥 {t('users')} <span className="live">● LIVE</span></h3><table><tbody>{o.users.map(u=><tr key={u.id}><td>{u.name}<div className="mu">{u.mobile}</div></td><td>{t(u.role)}</td><td>{u.place}</td>
 <td><button className={u.blocked?'g':'r'} onClick={()=>api(`/admin/users/${u.id}/block`,{method:'POST'}).catch(fail)}>{u.blocked?t('unblock'):t('block')}</button></td></tr>)}</tbody></table></div>
 <div className="card sw"><h3>📦 {t('products')}</h3><table><tbody>{(p||[]).map(x=><tr key={x.id}><td>{x.name}</td><td>{x.seller}</td><td>{R(x.price)}</td><td><button className="r" onClick={()=>api('/products/'+x.id,{method:'DELETE'}).catch(fail)}>{t('del')}</button></td></tr>)}</tbody></table></div>
 <Enq t={t} tick={tick} role="admin"/><Orders t={t} tick={tick} role="admin"/></>}

export default function App(){
 const[user,setUser]=useState(null),[ready,setReady]=useState(false),[lang,setLang]=useState(localStorage.getItem('lang')||'en'),[tick,setTick]=useState(0),[toast,setToast]=useState('');
 const t=k=>D[k]?D[k][{en:0,mr:1,hi:2}[lang]]:k;
 useEffect(()=>{if(!localStorage.getItem('tok'))return setReady(true);api('/me').then(setUser).catch(()=>localStorage.removeItem('tok')).finally(()=>setReady(true))},[]);
 useEffect(()=>{if(!user)return;const s=connect(()=>setTick(x=>x+1),m=>{setToast(m);setTimeout(()=>setToast(''),4500)});return()=>s.close()},[user&&user.id]);
 if(!ready)return null;
 return<><header><b className="logo">Udyam <span>{lang==='hi'?'सेतु':'सेतू'}</span></b><div className="row">
 <select value={lang} onChange={e=>{setLang(e.target.value);localStorage.setItem('lang',e.target.value)}}><option value="en">English</option><option value="mr">मराठी</option><option value="hi">हिंदी</option></select>
 {user&&<button className="o" onClick={()=>{localStorage.removeItem('tok');setUser(null)}}>{t('logout')}</button>}</div></header>
 {toast&&<div className="toast">🔔 {toast}</div>}
 <main>{!user?<Auth t={t} onAuth={setUser}/>:user.role==='seller'?<Seller t={t} tick={tick} user={user} lang={lang}/>:user.role==='buyer'?<Buyer t={t} tick={tick}/>:<Admin t={t} tick={tick}/>}</main></>}
