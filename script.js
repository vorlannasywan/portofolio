const root = document.documentElement;
const themeToggle = document.querySelector('.theme-toggle');
const themeIcon = document.querySelector('.theme-icon');

const savedTheme = localStorage.getItem('vorlan-theme');
if (savedTheme === 'dark') document.body.classList.add('dark');
updateThemeButton();

themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark');
  localStorage.setItem('vorlan-theme', document.body.classList.contains('dark') ? 'dark' : 'light');
  updateThemeButton();
});

function updateThemeButton() {
  const isDark = document.body.classList.contains('dark');
  themeToggle.setAttribute('aria-pressed', String(isDark));
  themeToggle.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
  themeIcon.textContent = isDark ? '☾' : '☼';
}

if (window.gsap && window.ScrollTrigger && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  gsap.registerPlugin(ScrollTrigger);
  gsap.from('.site-header', { y: -25, opacity: 0, duration: 0.7, ease: 'power3.out' });
  gsap.from('.hero-copy > *', { y: 25, opacity: 0, duration: 0.7, stagger: 0.1, delay: 0.15, ease: 'power3.out' });
  gsap.from('.hero-visual', { x: 35, opacity: 0, duration: 1, delay: 0.25, ease: 'power3.out' });
  gsap.utils.toArray('.reveal').forEach((element) => {
    if (element.closest('.hero')) return;
    gsap.to(element, { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', scrollTrigger: { trigger: element, start: 'top 88%', once: true } });
  });
  gsap.to('.orbit-one', { rotation: 325, duration: 16, repeat: -1, ease: 'none' });
  gsap.to('.orbit-two', { rotation: -325, duration: 20, repeat: -1, ease: 'none' });
} else {
  document.querySelectorAll('.reveal').forEach((element) => { element.style.opacity = '1'; element.style.transform = 'none'; });
}