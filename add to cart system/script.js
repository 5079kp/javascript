

// script.js
document.addEventListener('DOMContentLoaded', () => {
  gsap.registerPlugin(ScrollTrigger);

  // Product cards entrance
  gsap.from('.product-card', {
    opacity: 0,
    y: 24,
    duration: 0.6,
    stagger: 0.06,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: '.products',
      start: 'top 85%',
    }
  });

  // Header slight drop on load
  gsap.from('header .nav', { y: -18, opacity: 0, duration: 0.5, ease: 'power2.out' });
});

// ====== State ======
let cartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');

// ====== Elements ======
const productsEl = document.getElementById('products');
const cartBtn = document.getElementById('cartBtn');
const cartDrawer = document.getElementById('cartDrawer');
const overlay = document.getElementById('overlay');
const closeCartBtn = document.getElementById('closeCart');
const cartList = document.getElementById('cart-items');
const totalEl = document.getElementById('total-price');
const countEl = document.getElementById('cart-count');
const emptyState = document.getElementById('emptyState');
const checkoutBtn = document.getElementById('checkoutBtn');
const toast = document.getElementById('toast');
const liveRegion = document.getElementById('liveRegion');
const searchInput = document.getElementById('searchInput');

// ====== Helpers ======
const fmt = (n) => `$${Number(n).toFixed(2)}`;

function save() {
  localStorage.setItem('cartItems', JSON.stringify(cartItems));
}

function calcTotals() {
  const total = cartItems.reduce((sum, i) => sum + i.price * i.qty, 0);
  const count = cartItems.reduce((c, i) => c + i.qty, 0);
  totalEl.textContent = fmt(total);
  countEl.textContent = count;
  emptyState.style.display = cartItems.length ? 'none' : 'block';
}

function renderCart() {
  cartList.innerHTML = '';
  cartItems.forEach(item => {
    const li = document.createElement('li');
    li.className = 'cart-item';
    li.innerHTML = `
      <img class="cart-thumb" src="${item.image}" alt="${item.name}">
      <div>
        <div class="item-name">${item.name}</div>
        <div class="item-price">${fmt(item.price)} each</div>
      </div>
      <div class="qty" role="group" aria-label="Quantity">
        <button data-action="dec" aria-label="Decrease quantity">-</button>
        <span aria-live="polite">${item.qty}</span>
        <button data-action="inc" aria-label="Increase quantity">+</button>
      </div>
      <button class="remove" data-action="remove" aria-label="Remove ${item.name}">Remove</button>
    `;
    // Bind qty/remove buttons
    li.querySelector('[data-action="dec"]').addEventListener('click', () => changeQty(item.id, -1));
    li.querySelector('[data-action="inc"]').addEventListener('click', () => changeQty(item.id, +1));
    li.querySelector('[data-action="remove"]').addEventListener('click', () => removeItem(item.id));
    cartList.appendChild(li);
  });
  calcTotals();
}

function bumpBadge() {
  gsap.fromTo(countEl, { scale: 0.9 }, { scale: 1, duration: 0.25, ease: 'back.out(3)' });
}

function showToast(msg = 'Added to cart') {
  toast.textContent = msg;
  toast.innerHTML = `<i class="ri-check-line"></i> ${msg}`;
  const tl = gsap.timeline();
  tl.to(toast, { opacity: 1, y: 0, duration: 0.25, ease: 'power2.out', pointerEvents: 'auto' })
    .to(toast, { opacity: 0, y: 20, duration: 0.3, ease: 'power2.in', pointerEvents: 'none', delay: 1.2 });
}

function openCart() {
  cartBtn.setAttribute('aria-expanded', 'true');
  overlay.style.pointerEvents = 'auto';
  gsap.to(overlay, { opacity: 1, duration: 0.25, ease: 'power2.out' });
  gsap.to(cartDrawer, { x: 0, duration: 0.35, ease: 'power3.out' });
}

function closeCart() {
  cartBtn.setAttribute('aria-expanded', 'false');
  gsap.to(overlay, { opacity: 0, duration: 0.25, ease: 'power2.in', onComplete: () => overlay.style.pointerEvents = 'none' });
  gsap.to(cartDrawer, { x: '100%', duration: 0.35, ease: 'power3.in' });
}

function addToCartFromCard(card) {
  const id = card.dataset.id;
  const name = card.dataset.name || card.querySelector('.product-name')?.textContent?.trim();
  const price = Number(card.dataset.price || card.querySelector('.price')?.textContent?.replace(/[^0-9.]/g,''));
  const image = card.querySelector('img')?.src;

  if (!id || !name || !price || !image) return;

  const existing = cartItems.find(i => i.id === id);
  if (existing) {
    existing.qty += 1;
  } else {
    cartItems.push({ id, name, price, image, qty: 1 });
  }
  save();
  renderCart();
  bumpBadge();
  liveRegion.textContent = `${name} added to cart.`;
  showToast('Added to cart');
}

function changeQty(id, delta) {
  const item = cartItems.find(i => i.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) {
    cartItems = cartItems.filter(i => i.id !== id);
  }
  save();
  renderCart();
}

function removeItem(id) {
  const item = cartItems.find(i => i.id === id);
  cartItems = cartItems.filter(i => i.id !== id);
  save();
  renderCart();
  if (item) showToast('Removed from cart');
}

// ====== Events ======
// Add buttons (event delegation)
productsEl.addEventListener('click', (e) => {
  const btn = e.target.closest('.add-btn');
  if (!btn) return;
  const card = e.target.closest('.product-card');
  if (card) addToCartFromCard(card);
});

// Search filter
searchInput.addEventListener('input', () => {
  const q = searchInput.value.toLowerCase();
  document.querySelectorAll('.product-card').forEach(card => {
    const name = (card.dataset.name || '').toLowerCase();
    const tag = (card.dataset.tag || '').toLowerCase();
    const show = name.includes(q) || tag.includes(q);
    gsap.to(card, { opacity: show ? 1 : 0.15, scale: show ? 1 : 0.98, duration: 0.2, pointerEvents: show ? 'auto' : 'none' });
  });
});

// Cart open/close
cartBtn.addEventListener('click', openCart);
closeCartBtn.addEventListener('click', closeCart);
overlay.addEventListener('click', closeCart);
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeCart();
});

// Checkout demo
checkoutBtn.addEventListener('click', () => {
  if (!cartItems.length) { showToast('Your cart is empty'); return; }
  showToast('Checkout coming soon');
});

// ====== Init ======
renderCart();

// Graceful image fallback
document.querySelectorAll('.product-card img').forEach(img => {
  img.addEventListener('error', () => {
    img.src = 'https://via.placeholder.com/600x450?text=Image+not+found';
  });
});
