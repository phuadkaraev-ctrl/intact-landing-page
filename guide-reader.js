export const GUIDE_TITLES = [
 'The Real Cost of Building It Yourself','Are you running your software?',
 'What AI changes, and what it doesn’t','Where the money actually goes',
 'The people behind the patch','Build it yourself, or partner',
 'Why certification software is different','The Intact answer',
 'How Intact delivers','The question has changed','Next steps'
];
export const PREVIEW_PAGES=[2,3];
export function guidePage(value=2) {
 const n=Number(value),page=Math.max(1,Math.min(11,Number.isFinite(n)?Math.trunc(n):2));
 return {page,title:GUIDE_TITLES[page-1],src:page<=3?'/assets/guide-pages/page-'+String(page).padStart(2,'0')+'.webp':'/api/guide/pages/'+page,pdf:'/api/guide/pdf#page='+page};
}
export function initGuideReader(doc=document,fetcher=globalThis.fetch,transport=globalThis.IntactGuideTransport) {
 const reader=doc.querySelector('#guide-reader'),trigger=doc.querySelector('#guide-toggle');
 if(!reader||!trigger)return;
 const q=s=>reader.querySelector(s);
 const image=q('#guide-page-image'),select=q('#guide-page'),prev=q('#guide-prev'),next=q('#guide-next'),zoom=q('#guide-zoom'),viewport=q('.reader-viewport'),status=q('#guide-reader-status'),error=q('#guide-reader-error'),loading=q('#guide-reader-loading'),pdf=q('#guide-reader-pdf'),close=q('#guide-close'),controls=q('.reader-controls'),gate=q('#guide-gate'),form=q('#guide-access-form'),formError=q('#guide-form-error'),submit=q('#guide-submit'),aside=q('.reader-aside'),unlockedNote=q('#guide-unlocked'),continueButton=q('#guide-continue'),gateBack=q('#guide-back'),railUnlock=q('#guide-rail-unlock'),retry=q('#guide-retry');
 if(transport?.fetch)fetcher=transport.fetch;
 let current=2,pendingPage=4,returnFocus=null,oldOverflow='',opened=false,unlocked=false,submitting=false,gateShown=false,accessSequence=0,pageSequence=0;
 function setZoom(on){viewport.classList.toggle('zoomed',on);zoom.setAttribute('aria-pressed',String(on));zoom.querySelector('span').textContent=on?'Fit width':'Zoom in';if(!on)viewport.scrollLeft=0;}
 function setOptions(){select.innerHTML=(unlocked?GUIDE_TITLES.map((title,i)=>'<option value="'+(i+1)+'">'+String(i+1).padStart(2,'0')+' · '+title+'</option>'):PREVIEW_PAGES.map(page=>'<option value="'+page+'">'+String(page).padStart(2,'0')+' · '+GUIDE_TITLES[page-1]+'</option>').concat('<option value="4">Continue with the full guide →</option>')).join('');}
 function loaded(){if(gateShown)return;loading.hidden=true;image.hidden=false;error.hidden=true;status.textContent=unlocked?'Page '+current+' of 11 · '+GUIDE_TITLES[current-1]:'Sample '+(PREVIEW_PAGES.indexOf(current)+1)+' of 2 · Page '+current+' of 11';}
 image.addEventListener('load',loaded);
 async function imageError(){
  if(gateShown)return;loading.hidden=true;image.hidden=true;error.hidden=false;status.textContent='The page image could not load. Try again.';
  if(unlocked){try{const r=await fetcher('/api/guide/access',{credentials:'same-origin',cache:'no-store'});if(r.ok&&!(await r.json()).unlocked){unlocked=false;setOptions();showGate(current);formError.hidden=false;formError.textContent='Your guide access has expired. Enter your details to unlock it again.';}}catch{}}
 }
 image.addEventListener('error',imageError);
 if(transport?.openPDF)pdf.addEventListener('click',event=>{event.preventDefault();void transport.openPDF(current).catch(()=>{status.textContent='The PDF could not download. Please try again.';});});
 function showGate(page=4,focus=true) {
  if(unlocked){showPage(page);return;}
  pendingPage=guidePage(page).page;gateShown=true;pageSequence++;
  controls.hidden=true;aside.hidden=true;image.hidden=true;error.hidden=true;loading.hidden=true;gate.hidden=false;reader.classList.add('is-gated');setZoom(false);viewport.scrollTop=0;
  pdf.hidden=true;continueButton.hidden=true;status.textContent='Two sample pages · Full guide: 11 pages';unlockedNote.hidden=true;
  if(focus)form.elements.namedItem('fullName').focus({preventScroll:true});
 }
 function showPage(value) {
  const info=guidePage(value);
  if(!unlocked&&!PREVIEW_PAGES.includes(info.page)){showGate(info.page);return;}
  current=info.page;gateShown=false;gate.hidden=true;reader.classList.remove('is-gated');controls.hidden=false;aside.hidden=unlocked;select.value=String(current);
  prev.disabled=current===(unlocked?1:2);next.disabled=unlocked&&current===11;next.setAttribute('aria-label',!unlocked&&current===3?'Unlock the full guide':'Next page');
  image.hidden=false;error.hidden=true;loading.hidden=false;loading.textContent='Loading page '+current+'…';
  image.alt='Page '+current+' of the Intact whitepaper: '+info.title;image.loading='eager';
  if(transport?.pageSrc){const sequence=++pageSequence;Promise.resolve(transport.pageSrc(info.page)).then(src=>{if(sequence===pageSequence&&!gateShown&&opened){image.src=src;if(image.complete&&image.naturalWidth>0)loaded();}}).catch(()=>{if(sequence===pageSequence&&!gateShown&&opened)void imageError();});}else image.src=info.src;
  pdf.href=transport?.openPDF?'#':info.pdf;pdf.hidden=!unlocked;continueButton.hidden=unlocked;continueButton.textContent=current===2?'Next sample page →':'Continue reading →';unlockedNote.hidden=!unlocked;
  status.textContent=unlocked?'Page '+current+' of 11':'Sample '+(PREVIEW_PAGES.indexOf(current)+1)+' of 2 · Page '+current+' of 11';
  viewport.scrollTop=0;viewport.scrollLeft=0;
  if(!transport?.pageSrc&&image.complete&&image.naturalWidth>0)loaded();
  const ImageCtor=doc.defaultView?.Image??globalThis.Image;
  for(const neighbor of [current-1,current+1])if(!transport?.pageSrc&&neighbor>=1&&neighbor<=11&&(unlocked||PREVIEW_PAGES.includes(neighbor))&&ImageCtor){const preload=new ImageCtor();preload.src=guidePage(neighbor).src;}
 }
 async function checkAccess(requested){
  const sequence=++accessSequence;
  try{const r=await fetcher('/api/guide/access',{credentials:'same-origin',cache:'no-store'});if(!r.ok)return;const data=await r.json();if(sequence!==accessSequence)return;unlocked=Boolean(data.unlocked);setOptions();if(opened){if(unlocked)showPage(gateShown?pendingPage:current);else if(!PREVIEW_PAGES.includes(current))showGate(requested,false);else if(!gateShown)showPage(current);}}
  catch{/* The two-page preview still works if the access check is unavailable. */}
 }
 function finishClose(){if(!opened)return;opened=false;doc.body.style.overflow=oldOverflow;trigger.setAttribute('aria-expanded','false');setZoom(false);returnFocus?.focus();}
 function closeReader(){if(typeof reader.close==='function')reader.close();else reader.removeAttribute('open');finishClose();}
 function openReader(page=2,source=trigger){
  if(opened){showPage(page);return;}
  returnFocus=source;oldOverflow=doc.body.style.overflow;doc.body.style.overflow='hidden';opened=true;
  try{if(typeof reader.showModal==='function')reader.showModal();else reader.setAttribute('open','');}catch{reader.setAttribute('open','');}
  trigger.setAttribute('aria-expanded','true');setOptions();showPage(page);if(!gateShown)close.focus();void checkAccess(page);
 }
 trigger.addEventListener('click',event=>{event.preventDefault();openReader(2,trigger);});
 doc.querySelectorAll('[data-guide-page],[data-guide-open]').forEach(link=>link.addEventListener('click',event=>{event.preventDefault();openReader(Number(link.dataset.guidePage)||4,link);}));
 close.addEventListener('click',closeReader);prev.addEventListener('click',()=>showPage(current-1));next.addEventListener('click',()=>showPage(current+1));select.addEventListener('change',()=>showPage(select.value));
 zoom.addEventListener('click',()=>setZoom(zoom.getAttribute('aria-pressed')!=='true'));continueButton.addEventListener('click',()=>showPage(current+1));
 railUnlock.addEventListener('click',()=>showGate(4));gateBack.addEventListener('click',()=>showPage(3));retry.addEventListener('click',()=>showPage(current));
 form.addEventListener('submit',async event=>{
  event.preventDefault();if(submitting||!form.reportValidity())return;submitting=true;submit.disabled=true;submit.querySelector('span').textContent='Unlocking…';formError.hidden=true;form.setAttribute('aria-busy','true');
  const field=name=>form.elements.namedItem(name).value;
  try{
   const r=await fetcher('/api/guide/unlock',{method:'POST',credentials:'same-origin',headers:{'Content-Type':'application/json'},body:JSON.stringify({fullName:field('fullName'),email:field('email'),company:field('company'),website:field('website')})});
   const data=await r.json();if(!r.ok||!data.unlocked){formError.textContent=data.error||'We couldn’t unlock the guide. Please try again.';formError.hidden=false;if(data.field&&opened)form.elements.namedItem(data.field)?.focus();return;}
   unlocked=true;accessSequence++;setOptions();form.reset();if(opened){showPage(pendingPage);select.focus();status.textContent='Full guide unlocked · Page '+pendingPage+' of 11';}
  }catch{formError.textContent='We couldn’t complete your request. Please check your connection and try again.';formError.hidden=false;}
  finally{submitting=false;submit.disabled=false;submit.querySelector('span').textContent='Unlock the full guide';form.removeAttribute('aria-busy');}
 });
 reader.addEventListener('close',finishClose);reader.addEventListener('cancel',event=>{event.preventDefault();closeReader();});
 reader.addEventListener('click',event=>{if(event.target!==reader)return;const b=reader.getBoundingClientRect();if(event.clientX<b.left||event.clientX>b.right||event.clientY<b.top||event.clientY>b.bottom)closeReader();});
 reader.addEventListener('keydown',event=>{
  if(event.key==='Escape'){event.preventDefault();closeReader();return;}
  if(event.key==='Tab'&&typeof reader.showModal!=='function'){
   const focusable=[...reader.querySelectorAll('button:not([disabled]),a[href],select:not([disabled]),input:not([disabled])')].filter(el=>!el.closest('[hidden]'));
   const first=focusable[0],last=focusable[focusable.length-1];
   if(event.shiftKey&&doc.activeElement===first){event.preventDefault();last.focus();}
   else if(!event.shiftKey&&doc.activeElement===last){event.preventDefault();first.focus();}
  }
  if(gateShown||['SELECT','INPUT','TEXTAREA'].includes(event.target.tagName))return;
  if(event.key==='ArrowRight'){event.preventDefault();showPage(current+1);}
  if(event.key==='ArrowLeft'){event.preventDefault();if(!prev.disabled)showPage(current-1);}
  if(event.key==='Home'){event.preventDefault();showPage(unlocked?1:2);}
  if(event.key==='End'){event.preventDefault();showPage(unlocked?11:3);}
 });
 setOptions();
 return {open:openReader,close:closeReader,showPage,showGate};
}
if(typeof document!=='undefined')initGuideReader();
