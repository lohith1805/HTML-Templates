
document.addEventListener('DOMContentLoaded', () => {
  const header = document.querySelector('.header');
  const counters = document.querySelectorAll('[data-count]');
  const revealItems = document.querySelectorAll('.reveal');
  const statusBtns = document.querySelectorAll('.filter-btn');
  const audienceBtns = document.querySelectorAll('.audience-btn');
  const cards = document.querySelectorAll('.event-col');
  let statusFilter = 'all';
  let audienceFilter = 'all';

  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const target = document.querySelector(link.getAttribute('href'));
      if(target){
        e.preventDefault();
        target.scrollIntoView({behavior:'smooth', block:'start'});
      }
    });
  });

  function onScroll(){
    if(header) header.classList.toggle('scrolled', window.scrollY > 40);
    revealItems.forEach(item => {
      if(item.getBoundingClientRect().top < window.innerHeight - 90){ item.classList.add('visible'); }
    });
  }
  window.addEventListener('scroll', onScroll);
  onScroll();

  if(counters.length){
    const counterObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if(entry.isIntersecting){
          const el = entry.target;
          const target = Number(el.dataset.count);
          const suffix = el.dataset.suffix || '';
          let current = 0;
          const step = Math.max(1, Math.ceil(target / 70));
          const timer = setInterval(() => {
            current += step;
            if(current >= target){ current = target; clearInterval(timer); }
            el.textContent = current.toLocaleString('en-IN') + suffix;
          }, 22);
          counterObserver.unobserve(el);
        }
      });
    }, {threshold:.4});
    counters.forEach(counter => counterObserver.observe(counter));
  }

  function applyFilters(){
    cards.forEach(card => {
      const statusOk = statusFilter === 'all' || card.dataset.status === statusFilter;
      const audienceOk = audienceFilter === 'all' || card.dataset.audience === audienceFilter;
      card.style.display = statusOk && audienceOk ? '' : 'none';
    });
  }
  statusBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      statusBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      statusFilter = btn.dataset.filter;
      applyFilters();
    });
  });
  audienceBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      audienceBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      audienceFilter = btn.dataset.audience;
      applyFilters();
    });
  });

  const ticketForms = document.querySelectorAll('[data-ticket-form]');
  ticketForms.forEach(form => {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const slug = form.dataset.event || 'startup-networking-night';
      const qty = form.querySelector('[name="qty"]')?.value || '1';
      window.location.href = `../payment.html?event=${encodeURIComponent(slug)}&qty=${encodeURIComponent(qty)}`;
    });
  });

  const eventMap = {
    'startup-networking-night': ['Startup Networking Night','₹499','assets/images/hero-1.jpg'],
    'campus-tech-expo': ['Campus Tech Expo','₹299','assets/images/hero-2.jpg'],
    'product-launch-summit': ['Product Launch Summit','₹799','assets/images/hero-3.jpg'],
    'corporate-leadership-meet': ['Corporate Leadership Meet','₹999','assets/images/hero-1.jpg'],
    'design-thinking-workshop': ['Design Thinking Workshop','₹399','assets/images/hero-2.jpg'],
    'annual-cultural-fest': ['Annual Cultural Fest','₹249','assets/images/hero-3.jpg']
  };
  const params = new URLSearchParams(window.location.search);
  if(document.body.classList.contains('checkout-page')){
    const slug = params.get('event') || 'startup-networking-night';
    const qty = Number(params.get('qty') || 1);
    const data = eventMap[slug] || eventMap['startup-networking-night'];
    const price = Number(data[1].replace(/[₹,]/g,''));
    const service = 49;
    const subtotal = price * qty;
    const total = subtotal + service;
    const setText = (id, val) => { const el = document.getElementById(id); if(el) el.textContent = val; };
    setText('orderEventName', data[0]); setText('orderQty', `Qty: ${qty}`); setText('orderPrice', `₹${price.toLocaleString('en-IN')}`); setText('subtotal', `₹${subtotal.toLocaleString('en-IN')}`); setText('serviceFee', `₹${service}`); setText('totalAmount', `₹${total.toLocaleString('en-IN')}`);
    const thumb = document.getElementById('orderThumb'); if(thumb) thumb.style.backgroundImage = `url('${data[2]}')`;
    document.querySelectorAll('.payment-method').forEach(method => {
      method.addEventListener('click', () => {
        document.querySelectorAll('.payment-method').forEach(m => m.classList.remove('active'));
        method.classList.add('active');
        const type = method.dataset.method;
        document.querySelectorAll('[data-payment-form]').forEach(f => f.style.display = f.dataset.paymentForm === type ? 'block' : 'none');
      });
    });
    const form = document.getElementById('paymentForm');
    if(form){
      form.addEventListener('submit', e => {
        e.preventDefault();
        let ok = true;
        form.querySelectorAll('[required]').forEach(input => {
          const wrap = input.closest('.field-wrap');
          if(!input.value.trim()) { ok = false; wrap?.classList.add('invalid'); }
          else wrap?.classList.remove('invalid');
        });
        if(ok){
          const box = document.getElementById('paymentSuccess');
          if(box) box.style.display='block';
          form.scrollIntoView({behavior:'smooth', block:'center'});
        }
      });
    }
  }

  document.querySelectorAll('[data-countdown]').forEach(timerBox => {
    const target = new Date(timerBox.dataset.countdown).getTime();
    const daysEl = timerBox.querySelector('[data-days]');
    const hoursEl = timerBox.querySelector('[data-hours]');
    const minsEl = timerBox.querySelector('[data-minutes]');
    const secsEl = timerBox.querySelector('[data-seconds]');
    const pad = n => String(Math.max(0, n)).padStart(2, '0');
    const tick = () => {
      const diff = target - Date.now();
      if(diff <= 0){
        if(daysEl) daysEl.textContent = '00';
        if(hoursEl) hoursEl.textContent = '00';
        if(minsEl) minsEl.textContent = '00';
        if(secsEl) secsEl.textContent = '00';
        const title = timerBox.querySelector('.countdown-title');
        if(title) title.textContent = 'Event is live / completed';
        return;
      }
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const mins = Math.floor((diff / (1000 * 60)) % 60);
      const secs = Math.floor((diff / 1000) % 60);
      if(daysEl) daysEl.textContent = pad(days);
      if(hoursEl) hoursEl.textContent = pad(hours);
      if(minsEl) minsEl.textContent = pad(mins);
      if(secsEl) secsEl.textContent = pad(secs);
    };
    tick();
    setInterval(tick, 1000);
  });

});
