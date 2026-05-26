document.addEventListener('DOMContentLoaded', () => {
  const counters = document.querySelectorAll('.count');
  let countersStarted = false;

  function animateCounters() {
    counters.forEach((counter) => {
      const target = Number(counter.dataset.target || 0);
      const duration = 1400;
      const startTime = performance.now();

      function update(now) {
        const progress = Math.min((now - startTime) / duration, 1);
        const value = Math.floor(progress * target);
        counter.textContent = value.toLocaleString('en-IN');
        if (progress < 1) requestAnimationFrame(update);
        else counter.textContent = target.toLocaleString('en-IN');
      }

      requestAnimationFrame(update);
    });
  }

  if (counters.length) {
    const observer = new IntersectionObserver((entries) => {
      if (!countersStarted && entries.some((entry) => entry.isIntersecting)) {
        countersStarted = true;
        animateCounters();
        observer.disconnect();
      }
    }, { threshold: 0.25 });
    observer.observe(counters[0].closest('.stats-section'));
  }

  const revealItems = document.querySelectorAll('.reveal-item');
  if (revealItems.length) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add('visible');
      });
    }, { threshold: 0.12 });
    revealItems.forEach((item) => revealObserver.observe(item));
  }

  let lastScrollY = window.scrollY;
  let ticking = false;
  const navbarCollapse = document.getElementById('mainNavbar');
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        const currentScrollY = window.scrollY;
        const menuOpen = navbarCollapse && navbarCollapse.classList.contains('show');
        if (!menuOpen && currentScrollY > lastScrollY && currentScrollY > 170) {
          document.body.classList.add('nav-hidden');
        } else {
          document.body.classList.remove('nav-hidden');
        }
        lastScrollY = Math.max(currentScrollY, 0);
        ticking = false;
      });
      ticking = true;
    }
  });

  const form = document.getElementById('appointmentForm');
  if (!form) return;

  const today = new Date().toISOString().split('T')[0];
  const dateInput = document.getElementById('appointmentDate');
  if (dateInput) dateInput.setAttribute('min', today);

  function setError(input, message) {
    const msg = input.parentElement.querySelector('.error-message');
    if (msg) msg.textContent = message;
    input.classList.toggle('is-invalid', Boolean(message));
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    let valid = true;
    const name = document.getElementById('patientName');
    const age = document.getElementById('patientAge');
    const phone = document.getElementById('patientPhone');
    const date = document.getElementById('appointmentDate');
    const problem = document.getElementById('currentProblem');
    const history = document.getElementById('medicalHistory');
    const result = document.getElementById('appointmentResult');

    if (name.value.trim().length < 3) { setError(name, 'Please enter a valid name.'); valid = false; } else setError(name, '');
    const ageValue = Number(age.value);
    if (!ageValue || ageValue < 1 || ageValue > 120) { setError(age, 'Enter age between 1 and 120.'); valid = false; } else setError(age, '');
    if (!/^\d{10}$/.test(phone.value.trim())) { setError(phone, 'Enter a valid 10-digit phone number.'); valid = false; } else setError(phone, '');
    if (!date.value) { setError(date, 'Please choose a preferred date.'); valid = false; } else setError(date, '');
    if (problem.value.trim().length < 5) { setError(problem, 'Mention the current problem clearly.'); valid = false; } else setError(problem, '');
    if (history.value.trim().length < 5) { setError(history, 'Add a short medical history or write None.'); valid = false; } else setError(history, '');

    result.className = 'form-result mt-3 mb-0';
    if (!valid) {
      result.textContent = 'Please correct the highlighted fields.';
      result.classList.add('error');
      return;
    }

    result.textContent = `Appointment request received for ${name.value.trim()} on ${date.value}.`;
    result.classList.add('success');
    form.reset();
    date.setAttribute('min', today);
  });
});
