const slideDescriptions = [
  'How much are admin and software upkeep costing your certification business? Give your team more capacity for clients and growth.',
  'Faster to build. Still yours to run. AI-assisted software still needs integration, security, maintenance and improvement.',
  'Keeping it running takes time. Industry context: 13.5 hours per developer per week addressing technical debt, from Stripe/Harris Poll, 2018.',
  'Stay current. Share the investment. Intact shares core maintenance, security and ongoing AI investment across customers.',
  'Connected audits. Your decisions. Your data. Evidence, human review, certification decisions and certificate history in one traceable history.',
  'Built for certification. Intact-reported figures: 100+ companies, 96% implementation success and 20+ years in audit and certification.',
  'Time is money. We help you save both. Bring your current systems, workload and growth plans. Talk to Intact: info@intact-systems.com.'
];

const carousel = document.querySelector('.document-carousel');
const image = document.querySelector('#carousel-image');
const prev = document.querySelector('#carousel-prev');
const next = document.querySelector('#carousel-next');
const count = document.querySelector('#carousel-count');
const dots = [...document.querySelectorAll('[data-slide]')];
let slide = 0;
function showSlide(value) {
  slide = Math.max(0, Math.min(slideDescriptions.length - 1, value));
  image.src = 'assets/social/carousel-' + String(slide + 1).padStart(2, '0') + '.png';
  image.alt = 'Slide ' + (slide + 1) + ': ' + slideDescriptions[slide];
  count.textContent = (slide + 1) + ' / ' + slideDescriptions.length;
  prev.disabled = slide === 0;
  next.disabled = slide === slideDescriptions.length - 1;
  dots.forEach((dot, i) => i === slide ? dot.setAttribute('aria-current', 'true') : dot.removeAttribute('aria-current'));
  if (slide < slideDescriptions.length - 1) {
    const preload = new Image();
    preload.src = 'assets/social/carousel-' + String(slide + 2).padStart(2, '0') + '.png';
  }
}
prev.addEventListener('click', () => showSlide(slide - 1));
next.addEventListener('click', () => showSlide(slide + 1));
dots.forEach(dot => dot.addEventListener('click', () => showSlide(Number(dot.dataset.slide))));
carousel.addEventListener('keydown', event => {
  const positions = { ArrowLeft: slide - 1, ArrowRight: slide + 1, Home: 0, End: slideDescriptions.length - 1 };
  if (!(event.key in positions)) return;
  event.preventDefault();
  showSlide(positions[event.key]);
});
let touchStart = null;
carousel.addEventListener('touchstart', event => {
  if (event.touches.length !== 1) { touchStart = null; return; }
  touchStart = { x: event.touches[0].clientX, y: event.touches[0].clientY };
}, { passive: true });
carousel.addEventListener('touchend', event => {
  if (!touchStart || !event.changedTouches.length) return;
  const dx = event.changedTouches[0].clientX - touchStart.x;
  const dy = event.changedTouches[0].clientY - touchStart.y;
  touchStart = null;
  if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.3) showSlide(slide + (dx < 0 ? 1 : -1));
}, { passive: true });
carousel.addEventListener('touchcancel', () => { touchStart = null; }, { passive: true });

document.querySelectorAll('.caption-toggle').forEach(button => {
  button.addEventListener('click', () => {
    const expanded = button.getAttribute('aria-expanded') === 'true';
    document.getElementById(button.getAttribute('aria-controls')).hidden = expanded;
    button.setAttribute('aria-expanded', String(!expanded));
    button.textContent = expanded ? '… see more' : 'See less';
  });
});

// Resolve the CTA against this deployment, including GitHub repository subpaths.
document.querySelectorAll('[data-caption-url]').forEach(link => {
  link.textContent = new URL(link.getAttribute('href'), location.href).href;
});
let noticeTimer;
document.querySelectorAll('[data-copy]').forEach(button => {
  button.addEventListener('click', async () => {
    const caption = document.getElementById(button.dataset.copy);
    const text = [...caption.querySelectorAll('p')].map(p => {
      const clone = p.cloneNode(true);
      clone.querySelectorAll('br').forEach(br => br.replaceWith('\n'));
      return clone.textContent.trim();
    }).join('\n\n');
    const notice = document.querySelector('#copy-status');
    clearTimeout(noticeTimer);
    try {
      await navigator.clipboard.writeText(text);
      notice.textContent = 'Full caption copied, including the calculator link.';
    } catch {
      const toggle = document.querySelector('[aria-controls="' + caption.querySelector('.caption-more').id + '"]');
      if (toggle?.getAttribute('aria-expanded') !== 'true') toggle?.click();
      notice.textContent = 'Select the caption text to copy it. Clipboard access is unavailable.';
    }
    noticeTimer = setTimeout(() => { notice.textContent = ''; }, 5000);
  });
});
