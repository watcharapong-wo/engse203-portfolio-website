// Mobile Navigation Toggle
const navToggle = document.querySelector('#navToggle');
const navMenu = document.querySelector('#navMenu');

function toggleMenu() {
  navMenu.classList.toggle('active');
  navToggle.classList.toggle('active');
  const expanded = navToggle.getAttribute('aria-expanded') === 'true';
  navToggle.setAttribute('aria-expanded', String(!expanded));
}

navToggle.addEventListener('click', toggleMenu);

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    navMenu.classList.remove('active');
    navToggle.classList.remove('active');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

// Smooth scrolling for navigation links (only if needed)
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (!href || href === '#') return;
    const target = document.querySelector(href);
    if (!target) return;

    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

// Navbar background on scroll
window.addEventListener('scroll', () => {
  const navbar = document.querySelector('#navbar');
  if (window.scrollY > 100) {
    navbar.style.background = 'rgba(255, 255, 255, 0.98)';
  } else {
    navbar.style.background = 'rgba(255, 255, 255, 0.95)';
  }
});

// Contact form handling (demo)
const contactForm = document.querySelector('#contactForm');
contactForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const formData = new FormData(contactForm);
  const name = formData.get('name');
  const email = formData.get('email');
  const message = formData.get('message');

  if (name && email && message) {
    showToast('✅ Thank you! Your message has been sent (demo).');
    contactForm.reset();
  } else {
    showToast('⚠️ Please fill in all fields.');
  }
});

// feature2: Reveal on scroll (IntersectionObserver)
const revealEls = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('show');
  });
}, { threshold: 0.15 });

revealEls.forEach(el => observer.observe(el));

// feature2: Top scroll progress bar
const progressBar = document.querySelector('.scroll-progress-top__bar');
window.addEventListener('scroll', () => {
  const scrollTop = window.scrollY || document.documentElement.scrollTop;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const percent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  progressBar.style.width = `${Math.min(100, Math.max(0, percent))}%`;
});

// feature2: active nav link highlight
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

function setActiveLink() {
  let current = '';
  sections.forEach(sec => {
    const top = window.scrollY;
    const offset = sec.offsetTop - 140;
    const height = sec.offsetHeight;
    if (top >= offset && top < offset + height) current = sec.getAttribute('id');
  });

  navLinks.forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === `#${current}`);
  });
}
window.addEventListener('scroll', setActiveLink);
window.addEventListener('load', setActiveLink);

// feature2: Download CV demo button + toast
const downloadCvBtn = document.querySelector('#downloadCvBtn');
downloadCvBtn.addEventListener('click', (e) => {
  e.preventDefault();
  showToast('📄 CV download is a demo (add a real file later).');
});

// Toast helper (feature2)
const toast = document.querySelector('#toast');
let toastTimer = null;

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');

  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2500);
}
