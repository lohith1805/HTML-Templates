const navbar = document.querySelector('.food-navbar');
function updateNavbar() {
  if (!navbar) return;
  navbar.classList.toggle('nav-scrolled', window.scrollY > 60);
}
window.addEventListener('scroll', updateNavbar);
updateNavbar();

const filterButtons = document.querySelectorAll('.filter-btn');
const foodItems = document.querySelectorAll('.food-item');
const searchInput = document.getElementById('foodSearch');
const clearSearch = document.getElementById('clearSearch');
const emptyState = document.getElementById('emptyState');
const menuResultCount = document.getElementById('menuResultCount');
const showAllMenuBtn = document.getElementById('showAllMenuBtn');
const reviewForm = document.getElementById('reviewForm');

let activeCategory = 'all';
let menuExpanded = false;
const DEFAULT_MENU_LIMIT = 6;

function getCategoryLabel(category) {
  const labels = {
    all: 'all spicy fast food items',
    burger: 'burger items',
    wrap: 'wrap items',
    fries: 'fries and snack items',
    drink: 'drink items'
  };
  return labels[category] || 'items';
}

function filterFoodCards() {
  const term = (searchInput?.value || '').trim().toLowerCase();
  const matchedItems = [];

  foodItems.forEach((item) => {
    const category = item.dataset.category;
    const name = item.dataset.name.toLowerCase();
    const description = item.querySelector('p')?.textContent.toLowerCase() || '';
    const meta = item.querySelector('.food-meta')?.textContent.toLowerCase() || '';
    const categoryMatch = activeCategory === 'all' || category === activeCategory;
    const searchMatch = !term || name.includes(term) || description.includes(term) || meta.includes(term);

    if (categoryMatch && searchMatch) matchedItems.push(item);
  });

  const shouldLimit = !menuExpanded && matchedItems.length > DEFAULT_MENU_LIMIT;
  const visibleItems = shouldLimit ? matchedItems.slice(0, DEFAULT_MENU_LIMIT) : matchedItems;
  const visibleSet = new Set(visibleItems);

  foodItems.forEach((item) => {
    const shouldShow = visibleSet.has(item);

    if (shouldShow) {
      item.classList.remove('d-none', 'is-hiding');
      item.classList.add('menu-card-visible');
    } else {
      item.classList.add('is-hiding');
      item.classList.remove('menu-card-visible');
      setTimeout(() => {
        if (item.classList.contains('is-hiding')) item.classList.add('d-none');
      }, 140);
    }
  });

  if (emptyState) emptyState.classList.toggle('d-none', matchedItems.length !== 0);

  if (showAllMenuBtn) {
    const hasMore = matchedItems.length > DEFAULT_MENU_LIMIT;
    showAllMenuBtn.classList.toggle('d-none', !hasMore || matchedItems.length === 0);
    showAllMenuBtn.textContent = menuExpanded ? 'Show Less' : 'Show All Menu Items';
  }

  if (menuResultCount) {
    const label = getCategoryLabel(activeCategory);
    if (!matchedItems.length) {
      menuResultCount.textContent = 'No matching items right now';
    } else if (!menuExpanded && matchedItems.length > DEFAULT_MENU_LIMIT) {
      menuResultCount.textContent = `Showing ${visibleItems.length} of ${matchedItems.length} ${label}${term ? ` matching “${term}”` : ''}`;
    } else {
      menuResultCount.textContent = `Showing ${matchedItems.length} ${label}${term ? ` matching “${term}”` : ''}`;
    }
  }

  if (clearSearch) clearSearch.classList.toggle('show', Boolean(term));
}


filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    filterButtons.forEach((btn) => btn.classList.remove('active'));
    button.classList.add('active');
    activeCategory = button.dataset.category;
    menuExpanded = false;
    filterFoodCards();
  });
});

if (searchInput) {
  searchInput.addEventListener('input', () => {
    menuExpanded = false;
    filterFoodCards();
  });
}
if (clearSearch) {
  clearSearch.addEventListener('click', () => {
    searchInput.value = '';
    searchInput.focus();
    menuExpanded = false;
    filterFoodCards();
  });
}

showAllMenuBtn?.addEventListener('click', () => {
  menuExpanded = !menuExpanded;
  filterFoodCards();
  if (!menuExpanded) {
    document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
});

reviewForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  showCartToast('Thanks for your review!');
  reviewForm.reset();
});

const CART_KEY = 'spiceroute-cart';
const cartCount = document.getElementById('cartCount');
const cartItems = document.getElementById('cartItems');
const cartEmpty = document.getElementById('cartEmpty');
const cartSummary = document.getElementById('cartSummary');
const cartSubtotal = document.getElementById('cartSubtotal');
const cartTotal = document.getElementById('cartTotal');
const clearCartBtn = document.getElementById('clearCartBtn');
const checkoutBtn = document.getElementById('checkoutBtn');
const cartToast = document.getElementById('cartToast');

let cart = loadCart();

function loadCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
  } catch (error) {
    return [];
  }
}

function saveCart() {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function formatPrice(value) {
  return `₹${value}`;
}

function showCartToast(message) {
  if (!cartToast) return;
  cartToast.textContent = message;
  cartToast.classList.add('show');
  setTimeout(() => cartToast.classList.remove('show'), 1300);
}

function readFoodData(button) {
  const card = button.closest('.food-card');
  const item = button.closest('.food-item');
  const name = item?.dataset.name || card?.querySelector('h3')?.textContent.trim() || 'Food item';
  const priceText = card?.querySelector('.food-bottom strong')?.textContent || '₹0';
  const price = Number(priceText.replace(/[^0-9]/g, '')) || 0;
  const image = card?.querySelector('img')?.getAttribute('src') || '';
  const category = item?.dataset.category || 'food';
  const id = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  return { id, name, price, image, category };
}

function addToCart(food) {
  const existing = cart.find((item) => item.id === food.id);
  if (existing) existing.qty += 1;
  else cart.push({ ...food, qty: 1 });
  saveCart();
  renderCart();
  showCartToast(`${food.name} added`);
}

function changeQty(id, amount) {
  cart = cart
    .map((item) => item.id === id ? { ...item, qty: item.qty + amount } : item)
    .filter((item) => item.qty > 0);
  saveCart();
  renderCart();
}

function removeItem(id) {
  cart = cart.filter((item) => item.id !== id);
  saveCart();
  renderCart();
}

function renderCart() {
  const itemCount = cart.reduce((sum, item) => sum + item.qty, 0);
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const delivery = subtotal > 0 ? 30 : 0;

  if (cartCount) {
    cartCount.textContent = itemCount;
    cartCount.classList.toggle('has-items', itemCount > 0);
    const cartBtn = document.querySelector('.cart-nav-btn');
    if (cartBtn) cartBtn.classList.toggle('has-items', itemCount > 0);
  }

  if (!cartItems || !cartEmpty || !cartSummary) return;

  cartItems.innerHTML = cart.map((item) => `
    <div class="cart-item" data-id="${item.id}">
      <img src="${item.image}" alt="${item.name}">
      <div class="cart-item-info">
        <h6>${item.name}</h6>
        <span>${formatPrice(item.price)} each</span>
        <div class="qty-control" aria-label="Quantity controls for ${item.name}">
          <button type="button" data-action="decrease" data-id="${item.id}">−</button>
          <strong>${item.qty}</strong>
          <button type="button" data-action="increase" data-id="${item.id}">+</button>
          <button type="button" class="remove-item" data-action="remove" data-id="${item.id}">Remove</button>
        </div>
      </div>
      <strong class="cart-line-total">${formatPrice(item.price * item.qty)}</strong>
    </div>
  `).join('');

  cartEmpty.classList.toggle('d-none', cart.length > 0);
  cartSummary.classList.toggle('show', cart.length > 0);
  if (cartSubtotal) cartSubtotal.textContent = formatPrice(subtotal);
  if (cartTotal) cartTotal.textContent = formatPrice(subtotal + delivery);
}

cartItems?.addEventListener('click', (event) => {
  const button = event.target.closest('button');
  if (!button) return;
  const id = button.dataset.id;
  const action = button.dataset.action;
  if (action === 'increase') changeQty(id, 1);
  if (action === 'decrease') changeQty(id, -1);
  if (action === 'remove') removeItem(id);
});

clearCartBtn?.addEventListener('click', () => {
  cart = [];
  saveCart();
  renderCart();
});

checkoutBtn?.addEventListener('click', () => {
  if (!cart.length) return;
  window.location.href = 'checkout.html';
});

document.querySelectorAll('.add-btn').forEach((button) => {
  button.addEventListener('click', () => {
    const food = readFoodData(button);
    addToCart(food);

    const originalText = button.textContent;
    button.textContent = 'Added';
    button.classList.add('added');
    setTimeout(() => {
      button.textContent = originalText;
      button.classList.remove('added');
    }, 900);
  });
});

const revealItems = document.querySelectorAll('.food-card, .flow-card, .mini-info, .hero-image-card, .review-form, .review-highlights div');
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealItems.forEach((item) => {
    item.classList.add('reveal-soft');
    observer.observe(item);
  });
}

filterFoodCards();
renderCart();
