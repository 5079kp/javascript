
const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const format = n => '₹' + Number(n || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 });
const parsePrice = v => {
  const n = parseFloat(String(v ?? 0).replace(/[^\d.]/g, ''));
  return Number.isFinite(n) ? n : 0;
};

const productGrid = $('#productGrid');
const categoryList = $('#categoryList');
const resultCount = $('#resultCount');
const searchInput = $('#searchInput');
const quickSearch = $('#quickSearch');
const sortSelect = $('#sortSelect');
const applyBtn = $('#applyBtn');
const resetBtn = $('#resetBtn');

const cartDrawer = $('#cartDrawer');
const cartOverlay = $('#cartOverlay');
const openCartBtn = $('#openCartBtn');
const closeCartBtn = $('#closeCart');
const cartList = $('#cartList');
const cartTotal = $('#cartTotal');
const cartCount = $('#cartCount');
const toast = $('#toast');

let cart = {};
let filters = { q: '', category: '', sort: 'new' };
let productIdCounter = 100;


function getProducts() {
  return $$("#productGrid .card").map(card => ({
    id: card.dataset.id,
    title: (card.querySelector("h3")?.textContent || "").trim(),
    price: parsePrice(card.dataset.price),
    category: card.dataset.category,
    image: card.querySelector("img")?.src || ""
  }));
}


function updateCategories() {
  const products = getProducts();
  const cats = [...new Set(products.map(p => p.category))].filter(Boolean);

  categoryList.innerHTML = `
    <label><input type="radio" name="cat" value="" checked> All</label>
    ${cats.map(c => `<label><input type="radio" name="cat" value="${c}">${c}</label>`).join("")}
  `;

  categoryList.querySelectorAll("input[name=cat]").forEach(radio => {
    radio.addEventListener("change", e => {
      filters.category = e.target.value;
      render();
    });
  });
}


function getFiltered() {
  let list = getProducts().filter(p => {
    if (filters.category && p.category !== filters.category) return false;
    if (filters.q && !p.title.toLowerCase().includes(filters.q.toLowerCase())) return false;
    return true;
  });

  if (filters.sort === "low") list.sort((a, b) => a.price - b.price);
  else if (filters.sort === "high") list.sort((a, b) => b.price - a.price);

  return list;
}

function render() {
  const list = getFiltered();
  resultCount.textContent = list.length;
  const visibleIds = new Set(list.map(p => p.id));
  $$("#productGrid .card").forEach(card => {
    card.style.display = visibleIds.has(card.dataset.id) ? "flex" : "none";
  });
  gsap.from("#productGrid .card", { duration: 0.4, y: 20, opacity: 0, stagger: 0.1 });
  renderCart();
}


function renderCart() {
  const products = getProducts();
  const items = Object.entries(cart).map(([id, qty]) => {
    const p = products.find(pp => pp.id === id);
    return p ? { ...p, qty } : null;
  }).filter(Boolean);

  cartList.innerHTML = items.map(it => `
    <div class="cart-row" data-id="${it.id}">
      <img src="${it.image}">
      <div style="flex:1">
        <div><b>${it.title}</b></div>
        <div style="font-size:13px;color:gray">${format(it.price)} x ${it.qty}</div>
      </div>
      <div>
        <b>${format(it.price * it.qty)}</b>
        <div>
          <button class="btn ghost" data-cart="dec" data-id="${it.id}">-</button>
          <button class="btn ghost" data-cart="inc" data-id="${it.id}">+</button>
          <button class="btn ghost" data-cart="rm" data-id="${it.id}">Remove</button>
        </div>
      </div>
    </div>
  `).join("") || "<p>Cart is empty</p>";

  const total = items.reduce((s, it) => s + (it.price * it.qty), 0);
  cartTotal.textContent = format(total);
  cartCount.textContent = items.reduce((s, it) => s + it.qty, 0);
}


function addToCart(id) {
  if (!id) return;
  cart[id] = (cart[id] || 0) + 1;
  renderCart();
  showToast("Added to cart");
  openCart();
}

let t;
function showToast(msg) {
  toast.textContent = msg;
  toast.classList.add("show");
  clearTimeout(t);
  t = setTimeout(() => toast.classList.remove("show"), 1200);
}

function openCart() {
  cartOverlay.classList.add("active");
  gsap.to(cartDrawer, { x: 0, duration: 0.4, ease: "power3.out" });
}
function closeCart() {
  gsap.to(cartDrawer, { x: 420, duration: 0.4, ease: "power3.in" });
  cartOverlay.classList.remove("active");
}


productGrid.addEventListener("click", e => {
  const addBtn = e.target.closest('[data-action="add"]');
  const delBtn = e.target.closest('[data-action="delete"]');

  if (addBtn) addToCart(addBtn.dataset.id);
  if (delBtn) {
    const card = e.target.closest('.card');
    if (card) card.remove();
    updateCategories();
    render();
  }
});

cartList.addEventListener("click", e => {
  const target = e.target.closest('[data-cart]');
  if (!target) return;
  const { id, cart: act } = target.dataset;

  if (act === "inc") cart[id] = (cart[id] || 0) + 1;
  if (act === "dec") { cart[id]--; if (cart[id] <= 0) delete cart[id]; }
  if (act === "rm") delete cart[id];
  renderCart();
});

openCartBtn.addEventListener("click", openCart);
closeCartBtn.addEventListener("click", closeCart);
cartOverlay.addEventListener("click", closeCart);

$("#checkout").addEventListener("click", () => {
  if (Object.keys(cart).length === 0) return alert("Cart is empty");
  alert("Checkout: " + cartTotal.textContent);
  cart = {};
  renderCart();
  closeCart();
});

applyBtn.addEventListener("click", () => {
  filters.q = searchInput.value.trim();
  filters.sort = sortSelect.value;
  render();
});

resetBtn.addEventListener("click", () => {
  searchInput.value = "";
  quickSearch.value = "";
  sortSelect.value = "new";
  filters = { q: "", category: "", sort: "new" };
  const allRadio = categoryList.querySelector("input[value='']");
  if (allRadio) allRadio.checked = true;
  render();
});

quickSearch.addEventListener("input", e => {
  filters.q = e.target.value.trim();
  render();
});

sortSelect.addEventListener("change", e => {
  filters.sort = e.target.value;
  render();
});

$("#addProductBtn").addEventListener("click", () => {
  const title = $("#pTitle").value.trim();
  const price = parseFloat($("#pPrice").value);
  const category = $("#pCategory").value.trim();
  const file = $("#pImage").files[0];

  if (!title || !price || !category || !file) {
    alert("Fill all fields!");
    return;
  }

  const reader = new FileReader();
  reader.onload = function(e) {
    const id = "p" + (++productIdCounter);
    const newCard = document.createElement("div");
    newCard.className = "card";
    newCard.dataset.id = id;
    newCard.dataset.category = category;
    newCard.dataset.price = price;

    newCard.innerHTML = `
      <img src="${e.target.result}">
      <h3>${title}</h3>
      <div class="meta"><div>${category}</div><div>${format(price)}</div></div>
      <div class="actions">
        <button class="btn" data-action="add" data-id="${id}">Add to Cart</button>
        <button class="btn ghost" data-action="delete" data-id="${id}">Delete</button>
      </div>
    `;
    productGrid.appendChild(newCard);
    updateCategories();
    render();
  };
  reader.readAsDataURL(file);

  $("#pTitle").value = "";
  $("#pPrice").value = "";
  $("#pCategory").value = "";
  $("#pImage").value = "";
});


function init() {
  gsap.set(cartDrawer, { x: 420 });
  updateCategories();
  render();
}
init();
