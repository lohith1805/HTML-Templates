const CART_KEY = 'spiceroute-cart';

function loadCart() {
  try { return JSON.parse(localStorage.getItem(CART_KEY)) || []; }
  catch { return []; }
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function formatPrice(v) { return `₹${v}`; }

let cart = loadCart();
let promoApplied = false;
const PROMO_CODE = 'SPICY10';
const PROMO_DISCOUNT = 0.10;

// ─── Render Order Summary ───────────────────────────────────────────────────
function renderSummary() {
  const list = document.getElementById('checkoutItemsList');
  const empty = document.getElementById('checkoutEmpty');
  const badge = document.getElementById('itemCountBadge');
  const totalsEl = document.getElementById('orderTotals');

  const itemCount = cart.reduce((s, i) => s + i.qty, 0);
  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const delivery = subtotal > 0 ? 30 : 0;
  const discount = promoApplied ? Math.round(subtotal * PROMO_DISCOUNT) : 0;
  const total = subtotal + delivery - discount;

  if (badge) badge.textContent = `${itemCount} item${itemCount !== 1 ? 's' : ''}`;

  if (!list || !empty) return;

  if (!cart.length) {
    list.innerHTML = '';
    empty.classList.remove('d-none');
    totalsEl?.classList.add('d-none');
    return;
  }

  empty.classList.add('d-none');
  totalsEl?.classList.remove('d-none');

  list.innerHTML = cart.map(item => `
    <div class="co-item">
      <img src="${item.image}" alt="${item.name}">
      <div class="co-item-info">
        <h6>${item.name}</h6>
        <span>Qty: ${item.qty} × ${formatPrice(item.price)}</span>
      </div>
      <strong class="co-item-price">${formatPrice(item.price * item.qty)}</strong>
    </div>
  `).join('');

  const coSubtotal = document.getElementById('coSubtotal');
  const coDelivery = document.getElementById('coDelivery');
  const coTotal = document.getElementById('coTotal');
  const coDiscount = document.getElementById('coDiscount');
  const discountRow = document.getElementById('discountRow');

  if (coSubtotal) coSubtotal.textContent = formatPrice(subtotal);
  if (coDelivery) coDelivery.textContent = subtotal > 0 ? formatPrice(delivery) : '—';
  if (coTotal) coTotal.textContent = formatPrice(total);
  if (discountRow) discountRow.classList.toggle('d-none', !promoApplied);
  if (coDiscount) coDiscount.textContent = `−${formatPrice(discount)}`;
}

// ─── Promo Code ─────────────────────────────────────────────────────────────
const promoApplyBtn = document.getElementById('promoApplyBtn');
const promoInput = document.getElementById('promoInput');
const promoMsg = document.getElementById('promoMsg');

promoApplyBtn?.addEventListener('click', () => {
  const code = promoInput?.value.trim().toUpperCase();
  if (code === PROMO_CODE) {
    promoApplied = true;
    if (promoMsg) {
      promoMsg.textContent = '✓ 10% discount applied!';
      promoMsg.className = 'promo-msg success';
      promoMsg.classList.remove('d-none');
    }
    if (promoInput) promoInput.disabled = true;
    if (promoApplyBtn) promoApplyBtn.disabled = true;
    renderSummary();
  } else {
    if (promoMsg) {
      promoMsg.textContent = '✗ Invalid promo code.';
      promoMsg.className = 'promo-msg error';
      promoMsg.classList.remove('d-none');
    }
  }
});

// ─── Address Type Pills ───────────────────────────────────────────────────────
document.querySelectorAll('.addr-pill').forEach(pill => {
  pill.addEventListener('click', () => {
    document.querySelectorAll('.addr-pill').forEach(p => p.classList.remove('active'));
    pill.classList.add('active');
  });
});

// ─── Step Navigation ──────────────────────────────────────────────────────────
const step1Panel = document.getElementById('step1Panel');
const step2Panel = document.getElementById('step2Panel');
const successPanel = document.getElementById('successPanel');
const step1Dot = document.getElementById('step1Dot');
const step2Dot = document.getElementById('step2Dot');
const stepLine = document.getElementById('stepLine');

function goToStep(step) {
  [step1Panel, step2Panel, successPanel].forEach(p => p?.classList.remove('active'));
  if (step === 1) {
    step1Panel?.classList.add('active');
    step1Dot?.classList.add('active');
    step1Dot?.classList.remove('done');
    step2Dot?.classList.remove('active', 'done');
    stepLine?.classList.remove('done');
  } else if (step === 2) {
    step2Panel?.classList.add('active');
    step1Dot?.classList.add('done');
    step1Dot?.classList.remove('active');
    step2Dot?.classList.add('active');
    stepLine?.classList.add('done');
  } else if (step === 'success') {
    successPanel?.classList.add('active');
    step1Dot?.classList.add('done');
    step2Dot?.classList.add('done');
    stepLine?.classList.add('done');
    // Generate order id
    const orderIdNum = document.getElementById('orderIdNum');
    if (orderIdNum) orderIdNum.textContent = Math.floor(100000 + Math.random() * 900000);
    // Clear cart
    saveCart([]);
  }
}

// Validate Step 1
function validateAddress() {
  const required = ['firstName', 'lastName', 'email', 'phone', 'address1', 'city', 'pincode'];
  let valid = true;
  required.forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    if (!el.value.trim()) {
      el.classList.add('is-invalid');
      valid = false;
    } else {
      el.classList.remove('is-invalid');
    }
  });
  return valid;
}

document.getElementById('goToPaymentBtn')?.addEventListener('click', () => {
  if (!cart.length) { alert('Your cart is empty. Add items from the menu first.'); return; }
  if (validateAddress()) goToStep(2);
});

document.getElementById('backToAddressBtn')?.addEventListener('click', () => goToStep(1));

document.getElementById('placeOrderBtn')?.addEventListener('click', () => {
  goToStep('success');
});

// Remove invalid class on input
document.querySelectorAll('.co-input').forEach(input => {
  input.addEventListener('input', () => input.classList.remove('is-invalid'));
});

// ─── Payment Method Switching ─────────────────────────────────────────────────
const pmPanels = {
  upi: document.getElementById('upiPanel'),
  card: document.getElementById('cardPanel'),
  cod: document.getElementById('codPanel'),
  wallet: document.getElementById('walletPanel'),
};

const pmOptions = {
  upi: document.getElementById('pmUPI'),
  card: document.getElementById('pmCard'),
  cod: document.getElementById('pmCOD'),
  wallet: document.getElementById('pmWallet'),
};

document.querySelectorAll('.payment-option').forEach(option => {
  option.addEventListener('click', () => {
    const radio = option.querySelector('input[type="radio"]');
    if (!radio) return;
    radio.checked = true;
    const method = radio.value;

    document.querySelectorAll('.payment-option').forEach(o => o.classList.remove('active'));
    option.classList.add('active');

    Object.values(pmPanels).forEach(p => p?.classList.remove('active'));
    pmPanels[method]?.classList.add('active');
  });
});

// ─── Card number formatting ───────────────────────────────────────────────────
document.getElementById('cardNumber')?.addEventListener('input', function () {
  let v = this.value.replace(/\D/g, '').slice(0, 16);
  this.value = v.replace(/(.{4})/g, '$1 ').trim();
});

document.getElementById('cardExpiry')?.addEventListener('input', function () {
  let v = this.value.replace(/\D/g, '').slice(0, 4);
  if (v.length >= 2) v = v.slice(0, 2) + '/' + v.slice(2);
  this.value = v;
});

// ─── Init ─────────────────────────────────────────────────────────────────────
renderSummary();
goToStep(1);
