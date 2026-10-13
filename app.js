import {monitor} from './illustrations.js';
import {certificationScreen} from './certification-screen.js';
import './guide-reader.js';
import {workflowEditor,recordTrail,operationsOverview,featureIcon} from './feature-visuals.js';
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const inject=(id,html)=>{const el=$(id);if(el)el.innerHTML=html;};
inject('#hero-device',monitor({screen:certificationScreen()}));inject('#contact-device',monitor({compact:true}));
inject('#automation-visual',workflowEditor());inject('#traceability-visual',recordTrail());inject('#visibility-overview',operationsOverview());inject('#evidence-icon',featureIcon('file'));inject('#decision-icon',featureIcon('certificate'));
const reduce=matchMedia('(prefers-reduced-motion: reduce)');
const menu=$('#mobile-menu'),toggle=$('#menu-toggle');
function closeMenu(){if(!menu||!toggle)return;menu.hidden=true;toggle.setAttribute('aria-expanded','false');toggle.setAttribute('aria-label','Open menu');}
toggle?.addEventListener('click',()=>{const open=menu.hidden;menu.hidden=!open;toggle.setAttribute('aria-expanded',String(open));toggle.setAttribute('aria-label',open?'Close menu':'Open menu');});
$$('#mobile-menu a').forEach(a=>a.addEventListener('click',closeMenu));
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeMenu();});
let process=0;const processViews=$$('.hero-device .dashboard,#contact-device .dashboard');
function highlightProcess(views,index){views.forEach(view=>view.querySelectorAll('[data-process]').forEach(el=>el.classList.toggle('is-current',Number(el.dataset.process)===index)));}
highlightProcess(processViews,0);
let phaseTimer;
const processObserver=new IntersectionObserver(entries=>{if(entries.some(e=>e.isIntersecting)){if(!phaseTimer&&!reduce.matches)phaseTimer=setInterval(()=>{if(document.hidden)return;process=(process+1)%4;highlightProcess(processViews,process);},2800);}else{clearInterval(phaseTimer);phaseTimer=null;}},{threshold:0});
if(processViews[0])processObserver.observe(processViews[0]);
reduce.addEventListener('change',()=>{if(reduce.matches){clearInterval(phaseTimer);phaseTimer=null;highlightProcess(processViews,0);}});
// Module consumers initialize only after the native illustrations are in the document.
document.documentElement.dataset.intactReady='true';
