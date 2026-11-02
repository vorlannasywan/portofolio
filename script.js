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

const gallery = document.querySelector('[data-project-gallery]');

if (gallery) {
  const gallerySection = gallery.closest('.project-gallery');
  const slides = Array.from(gallery.querySelectorAll('.gallery-slide'));
  const previousButton = document.querySelector('[data-gallery-previous]');
  const nextButton = document.querySelector('[data-gallery-next]');
  const toggleButton = document.querySelector('[data-gallery-toggle]');
  const status = document.querySelector('[data-gallery-status]');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let currentIndex = 0;
  let timer;
  let userPaused = reducedMotion.matches;
  let reducedMotionOptIn = false;

  const updateStatus = () => {
    const viewportLeft = gallery.getBoundingClientRect().left;
    const nearestSlide = slides.reduce((nearest, slide, index) => {
      const distance = Math.abs(slide.getBoundingClientRect().left - viewportLeft);
      return distance < nearest.distance ? { index, distance } : nearest;
    }, { index: 0, distance: Infinity });

    currentIndex = nearestSlide.index;
    status.textContent = `Image ${currentIndex + 1} of ${slides.length}`;
  };

  const goToSlide = (index) => {
    currentIndex = (index + slides.length) % slides.length;
    const slide = slides[currentIndex];
    const left = slide.getBoundingClientRect().left - gallery.getBoundingClientRect().left + gallery.scrollLeft;
    gallery.scrollTo({ left, behavior: reducedMotion.matches && !reducedMotionOptIn ? 'auto' : 'smooth' });
    status.textContent = `Image ${currentIndex + 1} of ${slides.length}`;
  };

  const stopAutoplay = () => window.clearInterval(timer);
  const startAutoplay = (userStarted = false) => {
    stopAutoplay();
    if ((reducedMotion.matches && !reducedMotionOptIn) || userPaused || document.hidden || (!userStarted && gallerySection.contains(document.activeElement))) return;
    timer = window.setInterval(() => goToSlide(currentIndex + 1), 4500);
  };

  previousButton.addEventListener('click', () => goToSlide(currentIndex - 1));
  nextButton.addEventListener('click', () => goToSlide(currentIndex + 1));
  toggleButton.addEventListener('click', () => {
    userPaused = !userPaused;
    if (!userPaused && reducedMotion.matches) reducedMotionOptIn = true;
    toggleButton.textContent = userPaused ? 'Play' : 'Pause';
    toggleButton.setAttribute('aria-label', userPaused ? 'Play automatic slide' : 'Pause automatic slide');
    startAutoplay(!userPaused);
  });

  gallery.addEventListener('scroll', () => window.requestAnimationFrame(updateStatus), { passive: true });
  gallerySection.addEventListener('focusin', stopAutoplay);
  gallerySection.addEventListener('focusout', (event) => {
    if (!gallerySection.contains(event.relatedTarget)) startAutoplay();
  });
  document.addEventListener('visibilitychange', () => startAutoplay());
  reducedMotion.addEventListener('change', () => {
    if (reducedMotion.matches && !reducedMotionOptIn) {
      userPaused = true;
      toggleButton.textContent = 'Play';
      toggleButton.setAttribute('aria-label', 'Play automatic slide');
    }
    startAutoplay();
  });

  if (reducedMotion.matches) {
    toggleButton.textContent = 'Play';
    toggleButton.setAttribute('aria-label', 'Play automatic slide');
  }

  startAutoplay();
}
