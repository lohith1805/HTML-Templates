const navbar = document.getElementById('mainNavbar');
const topHoverZone = document.getElementById('topHoverZone');
let lastScrollY = window.scrollY;

function updateNavbar() {
  if (!navbar) return;
  const currentY = window.scrollY;
  if (currentY > 140 && currentY > lastScrollY) {
    navbar.classList.add('nav-hidden');
  } else {
    navbar.classList.remove('nav-hidden');
  }
  navbar.classList.toggle('nav-small', currentY > 60);
  lastScrollY = currentY;
}

window.addEventListener('scroll', updateNavbar);
if (topHoverZone && navbar) {
  topHoverZone.addEventListener('mouseenter', () => navbar.classList.remove('nav-hidden'));
}
updateNavbar();

const filterButtons = document.querySelectorAll('.filter-btn');
const courseItems = document.querySelectorAll('.course-item');

filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    filterButtons.forEach((btn) => btn.classList.remove('active'));
    button.classList.add('active');
    const selected = button.dataset.filter;
    courseItems.forEach((item) => {
      const show = selected === 'all' || item.dataset.category === selected;
      item.style.display = show ? 'block' : 'none';
    });
  });
});

const navLinks = document.querySelectorAll('.nav-link');
navLinks.forEach((link) => {
  link.addEventListener('click', () => {
    const collapse = document.querySelector('.navbar-collapse.show');
    if (collapse && window.bootstrap) {
      bootstrap.Collapse.getOrCreateInstance(collapse).hide();
    }
  });
});

const loginForm = document.querySelector('[data-login-form]');
if (loginForm) {
  loginForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const alertBox = document.getElementById('loginAlert');
    if (alertBox) {
      alertBox.classList.remove('d-none');
      alertBox.textContent = 'Login UI submitted successfully. Backend integration can be added later.';
    }
  });
}


const clickableCourseCards = document.querySelectorAll('.creative-course-card[data-course-url]');
clickableCourseCards.forEach((card) => {
  card.addEventListener('click', (event) => {
    if (event.target.closest('a, button')) return;
    const targetUrl = card.dataset.courseUrl;
    if (targetUrl) window.location.href = targetUrl;
  });
  card.setAttribute('tabindex', '0');
  card.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      const targetUrl = card.dataset.courseUrl;
      if (targetUrl) window.location.href = targetUrl;
    }
  });
});


const reviewForm = document.querySelector('[data-review-form]');
if (reviewForm) {
  reviewForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const alertBox = document.getElementById('reviewAlert');
    if (alertBox) alertBox.classList.remove('d-none');
    reviewForm.reset();
  });
}

const animatedItems = document.querySelectorAll('[data-animate]');
if ('IntersectionObserver' in window && animatedItems.length) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.16 });
  animatedItems.forEach((item) => observer.observe(item));
} else {
  animatedItems.forEach((item) => item.classList.add('is-visible'));
}
