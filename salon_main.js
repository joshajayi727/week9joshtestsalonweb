/* =============================================
   Maison Lumière — main.js
   Interactions: Nav, Scroll Reveal, Testimonials, Form
   ============================================= */

'use strict';

// ── Navbar scroll effect ────────────────────
const navbar = document.getElementById('navbar');

function handleNavScroll() {
  if (window.scrollY > 40) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}
window.addEventListener('scroll', handleNavScroll, { passive: true });
handleNavScroll();

// ── Mobile menu ─────────────────────────────
const hamburger  = document.getElementById('hamburger');
const navLinks   = document.getElementById('nav-links');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
});

// Close menu when a link is clicked
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
  });
});

// ── Scroll reveal ───────────────────────────
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Stagger siblings inside the same parent
        const siblings = entry.target.parentElement.querySelectorAll('.reveal');
        siblings.forEach((el, idx) => {
          if (el === entry.target) {
            setTimeout(() => el.classList.add('visible'), idx * 80);
          }
        });
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
);

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ── Testimonial slider ──────────────────────
const cards     = document.querySelectorAll('.testimonial-card');
const dotsWrap  = document.getElementById('testimonial-dots');
let current     = 0;
let autoSlide;

// Build dots
cards.forEach((_, i) => {
  const btn = document.createElement('button');
  btn.setAttribute('aria-label', `Testimonial ${i + 1}`);
  if (i === 0) btn.classList.add('active');
  btn.addEventListener('click', () => goTo(i));
  dotsWrap.appendChild(btn);
});

function goTo(index) {
  cards[current].classList.remove('active');
  dotsWrap.children[current].classList.remove('active');
  current = (index + cards.length) % cards.length;
  cards[current].classList.add('active');
  dotsWrap.children[current].classList.add('active');
}

function startAuto() {
  autoSlide = setInterval(() => goTo(current + 1), 5000);
}
function stopAuto() {
  clearInterval(autoSlide);
}

startAuto();

// Pause on hover
const testimonialSection = document.querySelector('.testimonials');
if (testimonialSection) {
  testimonialSection.addEventListener('mouseenter', stopAuto);
  testimonialSection.addEventListener('mouseleave', startAuto);
}

// Swipe support on mobile
let touchStartX = 0;
const track = document.getElementById('testimonial-track');
if (track) {
  track.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });
  track.addEventListener('touchend', e => {
    const diff = touchStartX - e.changedTouches[0].screenX;
    if (Math.abs(diff) > 40) goTo(current + (diff > 0 ? 1 : -1));
  }, { passive: true });
}

// ── Booking form ────────────────────────────
const bookingForm = document.getElementById('booking-form');
const submitBtn   = document.getElementById('submit-btn');
const formSuccess = document.getElementById('form-success');

// Set minimum date to today
const dateInput = document.getElementById('date');
if (dateInput) {
  const today = new Date().toISOString().split('T')[0];
  dateInput.setAttribute('min', today);
}

function validateForm() {
  const fname   = document.getElementById('fname').value.trim();
  const lname   = document.getElementById('lname').value.trim();
  const email   = document.getElementById('email').value.trim();
  const service = document.getElementById('service').value;
  const date    = document.getElementById('date').value;

  if (!fname)    return showError('fname',   'Please enter your first name.');
  if (!lname)    return showError('lname',   'Please enter your last name.');
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
                 return showError('email',   'Please enter a valid email address.');
  if (!service)  return showError('service', 'Please select a service.');
  if (!date)     return showError('date',    'Please select a preferred date.');
  return true;
}

function showError(fieldId, message) {
  const field = document.getElementById(fieldId);
  if (!field) return false;

  field.style.borderColor = '#c0392b';

  // Remove previous error if any
  const prev = field.parentElement.querySelector('.field-error');
  if (prev) prev.remove();

  const err = document.createElement('span');
  err.className = 'field-error';
  err.style.cssText = 'font-size:0.72rem;color:#c0392b;letter-spacing:0.05em;';
  err.textContent = message;
  field.parentElement.appendChild(err);

  field.addEventListener('input', () => {
    field.style.borderColor = '';
    if (err.parentElement) err.remove();
  }, { once: true });

  return false;
}

if (bookingForm) {
  bookingForm.addEventListener('submit', (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    // Simulate form submission (replace with real endpoint if needed)
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled    = true;
    submitBtn.style.opacity = '0.7';

    setTimeout(() => {
      bookingForm.reset();
      submitBtn.textContent = 'Request Appointment';
      submitBtn.disabled    = false;
      submitBtn.style.opacity = '';
      formSuccess.style.display = 'block';

      setTimeout(() => {
        formSuccess.style.display = 'none';
      }, 6000);
    }, 1200);
  });
}

// ── Smooth scroll for anchor links ─────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = parseInt(getComputedStyle(document.documentElement)
      .getPropertyValue('--nav-h')) || 72;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

// ── Active nav link on scroll ────────────────
const sections = document.querySelectorAll('section[id]');

const navObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        document.querySelectorAll('.nav-links a').forEach(a => {
          a.style.color = a.getAttribute('href') === `#${id}` ? 'var(--gold)' : '';
        });
      }
    });
  },
  { threshold: 0.4 }
);

sections.forEach(s => navObserver.observe(s));
