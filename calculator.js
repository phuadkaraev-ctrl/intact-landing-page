import { CAPACITY, DEFAULTS, LIMITS, calculate, normalize } from './model.js';
import { formatCurrency, formatNumber, buildEstimateHTML } from './report.js';
const $ = selector => document.querySelector(selector);
const $$ = selector => [...document.querySelectorAll(selector)];
const storageKey = 'intact-finmax-usd-v1';
const form = $('#cost-form');
$$('.currency-field').forEach(field=>field.addEventListener('click',()=>field.querySelector('input').focus()));
let period = 'annual', custom = false, result;
let initial = DEFAULTS;
try { const saved = JSON.parse(localStorage.getItem(storageKey)); if(saved && typeof saved==='object') {initial=normalize(saved);custom=true;} } catch {}
function values(){return Object.fromEntries(Object.keys(DEFAULTS).map(key=>[key,form.elements.namedItem(key).value]));}
function setInputs(input){for(const key of Object.keys(DEFAULTS)) form.elements.namedItem(key).value=input[key];$('#hours-slider').value=input.hours;}
function render(){
 result=calculate(values()); const factor=period==='annual'?12:1;
 const currency=formatCurrency(result.monthly*factor);$('#cost-output').textContent=currency;$('#cost-output').style.setProperty('--cost-scale',String(Math.min(1,7/currency.length)));
 $('#period-caption').textContent='estimated per '+(period==='annual'?'year':'month');
 $('#time-output').textContent=formatCurrency(result.timeCost*factor);
 $('#upkeep-output').textContent=formatCurrency(result.inputs.upkeep*factor);
 $('#team-hours').textContent=formatNumber(result.monthlyHours)+' h';
 $('#capacity-output').textContent=formatNumber(result.capacityShare);
 $('#capacity-fill').style.width=result.capacityShare+'%';
 $('#hours-slider').style.setProperty('--fill',result.capacityShare+'%');
 $('#team-formula').textContent=formatNumber(result.inputs.people)+' '+(result.inputs.people===1?'person':'people')+' × '+formatNumber(result.inputs.hours)+' h each = '+formatNumber(result.monthlyHours)+' team hours.';
 $('#input-state').textContent=custom?'YOUR INPUTS · STORED IN THIS BROWSER':'ILLUSTRATIVE STARTING VALUES';
}
function commit(feedback=false){
 const raw=values(), clean=normalize(raw);let adjusted=false;
 for(const key of Object.keys(DEFAULTS)){if(Number(raw[key])!==clean[key]||raw[key]==='')adjusted=true;}
 setInputs(clean);custom=true;render();
 $('#input-feedback').textContent=feedback&&adjusted?'Values adjusted to the allowed range. Hours are capped at 160 per person.':'';
 try{localStorage.setItem(storageKey,JSON.stringify(clean));}catch{}
}
setInputs(initial);render();
form.addEventListener('submit',e=>e.preventDefault());
form.addEventListener('input',e=>{if(e.target.id==='hours-slider'){$('#hours').value=e.target.value;commit();return;}if(Object.keys(DEFAULTS).includes(e.target.name)){if(Number(e.target.value)>LIMITS[e.target.name]){commit(true);return;}custom=true;render();if(e.target.name==='hours')$('#hours-slider').value=result.inputs.hours;}});
form.addEventListener('change',e=>{if(Object.keys(DEFAULTS).includes(e.target.name)||e.target.id==='hours-slider')commit(true);});
$$('[data-step]').forEach(button=>button.addEventListener('click',()=>{$('#people').value=Number($('#people').value)+Number(button.dataset.step);commit(true);}));
$$('[data-period]').forEach(button=>button.addEventListener('click',()=>{period=button.dataset.period;$$('[data-period]').forEach(other=>{const active=other===button;other.classList.toggle('active',active);other.setAttribute('aria-pressed',String(active));});render();}));
$('#reset').addEventListener('click',()=>{setInputs(DEFAULTS);custom=false;$('#input-feedback').textContent='';try{localStorage.removeItem(storageKey);}catch{}render();});
$('#export-estimate').addEventListener('click',()=>{commit(true);const blob=new Blob([buildEstimateHTML(result)],{type:'text/html;charset=utf-8'});const url=URL.createObjectURL(blob);const link=document.createElement('a');link.href=url;link.download='Intact-Ownership-Estimate.html';document.body.append(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);});
