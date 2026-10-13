import './app.js';
const g=window.gsap,ST=window.ScrollTrigger,Split=window.SplitText;
const q=s=>document.querySelector(s),qa=s=>[...document.querySelectorAll(s)];
function bezier(x1,y1,x2,y2){const cubic=(t,a,b)=>3*(1-t)*(1-t)*t*a+3*(1-t)*t*t*b+t*t*t;return x=>{let low=0,high=1,t=.5;for(let i=0;i<14;i++){t=(low+high)/2;if(cubic(t,x1,x2)>x)high=t;else low=t;}return cubic(t,y1,y2);};}
async function start(){
 if(!g||!ST)return;
 try{await document.fonts.ready;}catch{}
 g.registerPlugin(ST);if(Split)g.registerPlugin(Split);
 const mm=g.matchMedia();
 mm.add('(prefers-reduced-motion: no-preference)',()=>{
  const splits=[];const loops=[];const cleanup=[];
  // Finmax ix3: .3s masked hero characters, .5s stagger from edges, back.out(1.7).
  qa('.hero-title').forEach(el=>{if(Split){const s=Split.create(el,{type:'words,chars',mask:'chars',wordsClass:'motion-word'});splits.push(s);g.from(s.chars,{yPercent:-104,duration:.3,delay:.05,stagger:{amount:.5,from:'edges'},ease:'back.out(1.7)'});}else g.from(el,{y:-30,opacity:0,duration:.8,ease:'power3.out'});});
  // Finmax ix3: scroll-linked character opacity and 30-degree skew, .8s scrub.
  qa('.heading-title').forEach(el=>{if(Split){const s=Split.create(el,{type:'words,chars',mask:'chars',wordsClass:'motion-word'});splits.push(s);g.fromTo(s.chars,{opacity:0,skewX:30},{opacity:1,skewX:0,ease:'none',stagger:.3,scrollTrigger:{trigger:el,start:'top bottom',end:'bottom 50%',scrub:.8}});}else g.from(el,{opacity:0,y:25,scrollTrigger:{trigger:el,start:'top 90%'},duration:.7});});
  if(q('.hero')){
   g.from('.hero-question,.hero-description,.hero-copy .actions',{opacity:0,y:16,duration:.8,delay:.4,stagger:.12,ease:'power2.out'});
   // The phone entry is transferred to a desktop monitor: -300% → 0%, 1.5s inOutCubic.
   g.fromTo('.hero-device .monitor',{yPercent:-300},{yPercent:0,duration:1.5,delay:.2,ease:'power2.inOut'});
   const floats=['.float-top','.float-left','.float-right','.float-history','.hero-orb'];
   floats.forEach((s,i)=>g.fromTo(s,{opacity:0,scale:.8,rotationY:40,xPercent:i<2?-10:10,yPercent:i<2?5:-5},{opacity:1,scale:1,rotationY:0,xPercent:0,yPercent:0,duration:i===0?.5:1,delay:1.25+Math.max(0,i-1)*.25,ease:i===0?'none':'power1.inOut'}));
  }
  const desktop=g.matchMedia();
  desktop.add('(min-width: 821px)',()=>{
   if(q('.hero-showcase')){
    const scroll={trigger:'.hero-showcase',start:'top 60%',end:'bottom top',scrub:1};
    g.to('.float-top',{x:'54vh',y:'35vh',ease:'none',scrollTrigger:scroll});
    g.to('.float-right',{x:'-51vh',y:'30vh',ease:'none',scrollTrigger:scroll});
    g.to('.float-left',{x:'50vh',y:'21vh',ease:'none',scrollTrigger:scroll});
    g.to('.float-history',{x:'-42vh',y:'19vh',ease:'none',scrollTrigger:scroll});g.to('.hero-orb',{y:'-8vh',ease:'none',scrollTrigger:scroll});
   }
   if(q('.feature-grid')){
    const t=g.timeline({scrollTrigger:{trigger:'.feature-grid',start:'top bottom',end:'bottom top',scrub:1},defaults:{ease:'none'}});
    t.fromTo('.feature-left',{x:'-31vh',rotation:-10,opacity:0},{x:0,rotation:0,opacity:1,duration:.22},0).fromTo('.feature-right',{x:'31vh',rotation:10,opacity:0},{x:0,rotation:0,opacity:1,duration:.20},.05).to({},{duration:.75},.25);
   }
   if(q('.feature-wide')){
    const t=g.timeline({scrollTrigger:{trigger:'.feature-wide',start:'top bottom',end:'bottom top',scrub:1},defaults:{ease:'none'}});
    t.fromTo('.feature-wide',{rotationX:40},{rotationX:0,duration:.31},0).to('.feature-wide',{rotationX:0,scale:1,duration:.09},.31).to('.feature-wide',{rotationX:-55,scale:.8,duration:.29},.4).to({},{duration:.31},.69);
   }
   if(q('.calculator-grid')){
    const t=g.timeline({scrollTrigger:{trigger:'.calculator-grid',start:'top bottom',end:'top 22%',scrub:.8},defaults:{ease:'none'}});
    t.fromTo('#cost-form',{rotationY:48},{rotationY:0,duration:1},0).fromTo('.result-panel',{rotationY:-51},{rotationY:0,duration:1},0);
   }
   if(q('.visibility-visual')){
    const el=q('.visibility-visual'),ticket=q('.visibility-ticket');
    const move=e=>{const b=el.getBoundingClientRect(),x=Math.max(0,Math.min(1,(e.clientX-b.left)/b.width)),y=Math.max(0,Math.min(1,(e.clientY-b.top)/b.height));g.to(ticket,{xPercent:57-102*x,yPercent:14-80*y,rotation:10-20*x,duration:.8,ease:'power2.out',overwrite:true});};
    const leave=()=>g.to(ticket,{xPercent:0,yPercent:0,rotation:-4,duration:1,ease:'power3.out'});el.addEventListener('pointermove',move);el.addEventListener('pointerleave',leave);return()=>{el.removeEventListener('pointermove',move);el.removeEventListener('pointerleave',leave);};
   }
  });
  const mobile=g.matchMedia();mobile.add('(max-width: 820px)',()=>{qa('.feature-card').forEach((el,i)=>g.from(el,{x:i%2?35:-35,rotation:i%2?4:-4,opacity:0,duration:.9,scrollTrigger:{trigger:el,start:'top 95%',end:'top 45%',scrub:.8}}));if(q('.feature-wide'))g.from('.feature-wide',{rotationX:20,opacity:0,scrollTrigger:{trigger:'.feature-wide',start:'top 95%',end:'top 55%',scrub:.8}});});
  // Two-second rolling digit columns with the source's custom cubic-bezier easing.
  qa('[data-counter]').forEach(el=>{const value=el.dataset.counter,suffix=el.dataset.suffix;el.setAttribute('aria-label',value+suffix);el.innerHTML='';[...value].forEach((d,i)=>{const mask=document.createElement('span');mask.className='digit-mask';mask.setAttribute('aria-hidden','true');const strip=document.createElement('span');strip.className='digit-strip';for(let n=0;n<10;n++){const digit=document.createElement('span');digit.textContent=n;strip.append(digit);}mask.append(strip);el.append(mask);const to=-Number(d)*10;g.fromTo(strip,{yPercent:i%2?-90:0},{yPercent:to,duration:2,ease:bezier(.702,.311,.292,.983),scrollTrigger:{trigger:el,start:'top 87%',once:true}});});const mark=document.createElement('span');mark.textContent=suffix;mark.setAttribute('aria-hidden','true');el.append(mark);});
  qa('.automation-node').forEach((el,i)=>g.from(el,{y:20,opacity:0,duration:.8,delay:i*.16,ease:'power3.out',scrollTrigger:{trigger:'.automation-window',start:'top 85%',once:true}}));
  qa('.trail-node').forEach((el,i)=>g.from(el,{x:18,opacity:0,duration:.8,delay:i*.12,ease:'power3.out',scrollTrigger:{trigger:'.trace-window',start:'top 85%',once:true}}));
  qa('.work-item').forEach((el,i)=>g.from(el,{y:22,opacity:0,duration:1,delay:i*.15,ease:'power3.out',scrollTrigger:{trigger:'.operations-window',start:'top 85%',once:true}}));
  qa('.route-pulse').forEach((el,i)=>loops.push(g.fromTo(el,{y:0,opacity:.3},{y:12,opacity:1,duration:1.4,repeat:-1,repeatDelay:.5,delay:i*.3,ease:'power1.inOut'})));
  qa('.record-back-sheet,.trace-window,.book-object').forEach((el,i)=>g.from(el,{y:35,opacity:0,duration:1.1,ease:'power3.out',delay:(i%3)*.1,scrollTrigger:{trigger:el,start:'top 90%',once:true}}));
  if(q('.hero-device .monitor')&&window.matchMedia('(hover: hover) and (pointer: fine)').matches){
   const area=q('.hero-showcase'),monitor=q('.hero-device .monitor'),tiltX=g.quickTo(monitor,'rotationX',{duration:1.5,ease:'power3.out'}),tiltY=g.quickTo(monitor,'rotationY',{duration:1.5,ease:'power3.out'});
   const move=e=>{if(e.pointerType==='touch')return;const b=area.getBoundingClientRect(),x=Math.max(0,Math.min(1,(e.clientX-b.left)/b.width))-.5,y=Math.max(0,Math.min(1,(e.clientY-b.top)/b.height))-.5;tiltX(-y*2);tiltY(x*4);};
   const leave=()=>{tiltX(0);tiltY(0);};area.addEventListener('pointermove',move,{passive:true});area.addEventListener('pointerleave',leave);
   cleanup.push(()=>{area.removeEventListener('pointermove',move);area.removeEventListener('pointerleave',leave);});
  }
  qa('.ai-stage').forEach((el,i)=>g.from(el,{y:26,opacity:0,duration:1,delay:i*.14,ease:'power3.out',scrollTrigger:{trigger:'.ai-comparison',start:'top 86%',once:true}}));
  if(q('.ai-ownership-dot'))loops.push(g.to('.ai-ownership-dot',{scale:1.25,opacity:.65,duration:2,repeat:-1,yoyo:true,ease:'sine.inOut'}));
  qa('.hero>.contour,.contact-banner>.contour').forEach(el=>loops.push(g.to(el,{scale:.7,duration:2,repeat:-1,yoyo:true,ease:'none'})));
  if(q('.logo-cube')){const t=g.timeline({repeat:-1,defaults:{duration:5,ease:'none'}});[-90,-180,-270,-360,-450,-540,-630,-630,-720].forEach(deg=>t.to('.logo-cube',{rotationX:deg}));loops.push(t);}
  if('IntersectionObserver' in window){qa('.hero,.ai-decision,.feature-left,.site-footer,.contact-banner').forEach(section=>{const its=loops.filter(t=>t.getChildren?t.getChildren().some(child=>child.targets().some(el=>section.contains(el))):t.targets().some(el=>section.contains(el)));if(!its.length)return;const observer=new IntersectionObserver(entries=>its.forEach(t=>entries[0].isIntersecting?t.play():t.pause()));observer.observe(section);cleanup.push(()=>observer.disconnect());});}
  // SplitText creates a separate word wrapper, keeping long headings responsive.
  ST.refresh();
  return()=>{cleanup.forEach(fn=>fn());desktop.revert();mobile.revert();splits.forEach(s=>s.revert());qa('[data-counter]').forEach(el=>{el.innerHTML=el.dataset.counter+'<span>'+el.dataset.suffix+'</span>';});};
 });
}
start().catch(()=>{ /* All content and interactions remain available without motion. */ });
