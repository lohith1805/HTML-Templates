const CART_KEY = document.body.dataset.cartKey || 'woodoraCart';
const money = value => '₹' + Number(value || 0).toLocaleString('en-IN');

function getCart(){
  try { return JSON.parse(localStorage.getItem(CART_KEY)) || []; }
  catch(e){ return []; }
}
function setCart(cart){
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartBadges();
  renderCart();
  renderCheckout();
}
function cartTotals(){
  const cart = getCart();
  const subtotal = cart.reduce((sum,item)=>sum + Number(item.price) * Number(item.qty || 1),0);
  const shipping = subtotal ? 99 : 0;
  return {cart, subtotal, shipping, total: subtotal + shipping, count: cart.reduce((s,i)=>s + Number(i.qty || 1),0)};
}
function updateCartBadges(){
  const {count} = cartTotals();
  document.querySelectorAll('[data-cart-count]').forEach(el => el.textContent = count);
}
function showToast(message){
  const toast = document.querySelector('[data-toast]');
  if(!toast) return;
  toast.textContent = message;
  toast.classList.remove('d-none');
  setTimeout(()=>toast.classList.add('d-none'),1800);
}
function addToCart(data){
  const cart = getCart();
  const existing = cart.find(item => item.name === data.name);
  if(existing) existing.qty += 1;
  else cart.push({...data, qty:1});
  setCart(cart);
  showToast(data.name + ' added to cart');
}
function renderCart(){
  const list = document.querySelector('[data-cart-list]');
  const summary = document.querySelector('[data-cart-summary]');
  if(!list && !summary) return;
  const {cart, subtotal, shipping, total, count} = cartTotals();
  if(list){
    if(!cart.length){
      list.innerHTML = `<div class="text-center p-5 bg-white rounded-4 shadow-sm"><h4>Your cart is empty</h4><p class="text-muted">Add products from the product page and they will appear here.</p><a href="products.html" class="btn btn-primary mt-2">Browse Products</a></div>`;
    } else {
      list.innerHTML = cart.map((item,index)=>`<div class="cart-row d-flex gap-3 align-items-center"><img src="${item.image}" alt="${item.name}"><div class="flex-grow-1"><h5 class="fw-bold mb-1">${item.name}</h5><p class="text-muted mb-1">${item.desc || ''}</p><span class="price">${money(item.price)}</span></div><div class="d-flex align-items-center gap-2"><button class="btn btn-sm btn-outline-primary" data-dec="${index}">-</button><strong>${item.qty}</strong><button class="btn btn-sm btn-outline-primary" data-inc="${index}">+</button></div><button class="btn btn-sm btn-outline-danger" data-remove="${index}">Remove</button></div>`).join('');
    }
  }
  if(summary){
    summary.innerHTML = cart.length ? `<p class="d-flex justify-content-between"><span>Items</span><strong>${count}</strong></p><p class="d-flex justify-content-between"><span>Subtotal</span><strong>${money(subtotal)}</strong></p><p class="d-flex justify-content-between"><span>Shipping</span><strong>${money(shipping)}</strong></p><hr><h4 class="d-flex justify-content-between"><span>Total</span><strong>${money(total)}</strong></h4>` : '<p class="mb-0 text-muted">No items added yet.</p>';
  }
}
function renderCheckout(){
  const summary = document.querySelector('[data-checkout-summary]');
  const totals = document.querySelector('[data-checkout-totals]');
  if(!summary && !totals) return;
  const {cart, subtotal, shipping, total} = cartTotals();
  if(summary){
    summary.innerHTML = cart.length ? cart.map(item=>`<div class="summary-item"><img src="${item.image}" alt="${item.name}"><div class="flex-grow-1"><strong>${item.name}</strong><span>Qty: ${item.qty}</span></div><strong>${money(Number(item.price)*Number(item.qty))}</strong></div>`).join('') : `<div class="summary-item"><img src="images/item-6.jpg" alt="Demo sofa"><div class="flex-grow-1"><strong>Your cart is empty</strong><span>Add products before checkout</span></div></div>`;
  }
  if(totals){
    totals.innerHTML = `<div class="checkout-totals"><p><span>Subtotal</span><strong>${money(subtotal)}</strong></p><p><span>Shipping</span><strong>${subtotal ? money(shipping) : 'Enter shipping address'}</strong></p><hr><h3><span>Total</span><strong>${money(total)}</strong></h3></div>`;
  }
}
function revealOnScroll(){
  const items = document.querySelectorAll('.section-reveal, [data-card]');
  if(!('IntersectionObserver' in window)){
    items.forEach(el => el.classList.add('revealed'));
    return;
  }
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, {threshold:.14});
  items.forEach(el => observer.observe(el));
}
function handleInitialHash(){
  if(location.hash){
    setTimeout(()=>{
      const target = document.querySelector(location.hash);
      if(target) target.scrollIntoView({behavior:'smooth', block:'start'});
    }, 250);
  }
}

document.addEventListener('click', e => {
  const add = e.target.closest('[data-add-cart]');
  if(add){
    e.preventDefault();
    addToCart({name:add.dataset.name, price:add.dataset.price, image:add.dataset.image, desc:add.dataset.desc});
  }
  const detail = e.target.closest('[data-view-details]');
  if(detail){
    document.querySelector('[data-modal-title]').textContent = detail.dataset.name;
    document.querySelector('[data-modal-price]').textContent = money(detail.dataset.price);
    document.querySelector('[data-modal-desc]').textContent = detail.dataset.desc;
    document.querySelector('[data-modal-img]').src = detail.dataset.image;
    const modalAdd = document.querySelector('[data-modal-add]');
    modalAdd.dataset.name = detail.dataset.name;
    modalAdd.dataset.price = detail.dataset.price;
    modalAdd.dataset.image = detail.dataset.image;
    modalAdd.dataset.desc = detail.dataset.desc;
  }
  const inc = e.target.closest('[data-inc]');
  const dec = e.target.closest('[data-dec]');
  const rem = e.target.closest('[data-remove]');
  if(inc || dec || rem){
    const cart = getCart();
    const idx = Number((inc || dec || rem).dataset.inc ?? (inc || dec || rem).dataset.dec ?? (inc || dec || rem).dataset.remove);
    if(inc) cart[idx].qty++;
    if(dec) cart[idx].qty = Math.max(1, cart[idx].qty - 1);
    if(rem) cart.splice(idx, 1);
    setCart(cart);
  }
  if(e.target.closest('[data-empty-cart]')){
    localStorage.removeItem(CART_KEY);
    updateCartBadges();
    renderCart();
    showToast('Cart cleared');
  }
  const samePageLink = e.target.closest('a[href^="#"]');
  if(samePageLink){
    const target = document.querySelector(samePageLink.getAttribute('href'));
    if(target){
      e.preventDefault();
      target.scrollIntoView({behavior:'smooth', block:'start'});
    }
  }
});

document.querySelectorAll('[data-search], [data-search-global]').forEach(input => {
  input.addEventListener('input', () => {
    const q = input.value.toLowerCase().trim();
    document.querySelectorAll('[data-card]').forEach(card => {
      card.style.display = card.textContent.toLowerCase().includes(q) ? '' : 'none';
    });
  });
});

document.querySelectorAll('[data-filter]').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('[data-filter]').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    document.querySelectorAll('[data-card]').forEach(card => {
      card.style.display = filter === 'all' || card.dataset.category === filter ? '' : 'none';
    });
  });
});

document.querySelectorAll('[data-validate-form]').forEach(form => {
  form.addEventListener('submit', e => {
    e.preventDefault();
    const msg = form.querySelector('[data-form-message]');
    if(!form.checkValidity()){
      form.classList.add('was-validated');
      if(msg){ msg.className = 'mt-3 mb-0 text-warning fw-bold'; msg.textContent = 'Please fill all required fields correctly.'; }
      return;
    }
    if(msg){ msg.className = 'mt-3 mb-0 text-success fw-bold'; msg.textContent = 'Payment demo submitted successfully. Backend payment gateway is not connected.'; }
    form.classList.remove('was-validated');
  });
});

window.addEventListener('scroll', () => {
  document.querySelectorAll('.shop-navbar').forEach(nav => nav.classList.toggle('scrolled', window.scrollY > 20));
});

updateCartBadges();
renderCart();
renderCheckout();
revealOnScroll();
handleInitialHash();
