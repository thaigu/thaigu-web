document.addEventListener("DOMContentLoaded", () => {
  // Elements (may be null on pages without sidebar)
  const cartSidebar = document.querySelector(".cart-sidebar");
  const cartContent = document.querySelector(".cart-sidebar-content");
  const cartOverlay = document.querySelector(".cart-overlay");
  const cartClose = document.querySelector(".close-cart");
  const checkoutBtn = document.querySelector(".checkout-btn");
  const cartIcon = document.querySelector(".shopping-cart");
  const cartCountEl = document.querySelector(".shopping-cart .counting");

  // Orders stored in sessionStorage under "orders"
  let orders = JSON.parse(sessionStorage.getItem("orders")) || [];

  // Save orders and re-render
  const saveOrders = () => {
    sessionStorage.setItem("orders", JSON.stringify(orders));
    renderCart();
  };

  // Update the cart-count number on the icon
  const updateCartCount = () => {
    if (!cartCountEl) return;
    const total = orders.reduce((acc, item) => acc + item.quantity, 0);
    cartCountEl.textContent = total;
  };

  // Add item (or increase quantity if exists)
  const addToCart = (meal) => {
    if (!meal || typeof meal.id === "undefined") return;
    const existing = orders.find((o) => String(o.id) === String(meal.id));
    if (existing) existing.quantity++;
    else orders.push({ ...meal, quantity: 1 });
    saveOrders();
    showNotification("Saved to cart 🛒");
  };

  // Remove item completely
  const removeItem = (id) => {
    orders = orders.filter((o) => String(o.id) !== String(id));
    saveOrders();
  };

  // Increase quantity
  const increaseQuantity = (id) => {
    const item = orders.find((o) => String(o.id) === String(id));
    if (item) {
      item.quantity++;
      saveOrders();
    }
  };

  // Decrease quantity, remove if <= 0
  const decreaseQuantity = (id) => {
    const item = orders.find((o) => String(o.id) === String(id));
    if (!item) return;
    item.quantity--;
    if (item.quantity <= 0) removeItem(id);
    else saveOrders();
  };

  const getMealInfoById = (mealId) => {
    if (!mealId) return null;
    const selector = `[data-meal-id="${mealId}"]`;
    const element = document.querySelector(selector);
    if (!element) return null;

    return {
      id: mealId,
      title: element.dataset.productName || "No title",
      price: element.dataset.productPrice || "0",
      image: element.dataset.productImage || "",
    };
  };

  // Render sidebar cart content
  const renderCart = () => {
    if (!cartContent) {
      updateCartCount();
      return;
    }

    cartContent.innerHTML = "";

    if (!orders || orders.length === 0) {
      cartContent.innerHTML = "<p>No items in your order.</p>";
      updateCartCount();
      return;
    }

    orders.forEach((item) => {
      const div = document.createElement("div");
      div.className = "cart-item";
      div.innerHTML = `
        <img src="${item.image}" alt="${escapeHtml(item.title)}">
        <div class="cart-info">
          <span class="title">${escapeHtml(item.title)}</span><br>
          <span class="price">${escapeHtml(item.price)}</span>
        </div>
        <div class="cart-controls">
          <button class="decrease" data-id="${item.id}">-</button>
          <span class="quantity">${item.quantity}</span>
          <button class="increase" data-id="${item.id}">+</button>
          <button class="remove" data-id="${item.id}">✕</button>
        </div>
      `;
      cartContent.appendChild(div);
    });

    cartContent.querySelectorAll(".increase").forEach((btn) =>
      btn.addEventListener("click", () =>
        increaseQuantity(btn.dataset.id)
      )
    );
    cartContent.querySelectorAll(".decrease").forEach((btn) =>
      btn.addEventListener("click", () =>
        decreaseQuantity(btn.dataset.id)
      )
    );
    cartContent.querySelectorAll(".remove").forEach((btn) =>
      btn.addEventListener("click", () =>
        removeItem(btn.dataset.id)
      )
    );

    updateCartCount();
  };

  // Helper to prevent HTML injection
  function escapeHtml(text) {
    if (!text) return "";
    return text
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  // Event delegation for add-to-cart buttons
  document.addEventListener("click", (e) => {
    const addBtn = e.target.closest(".js-add-to-cart, [data-add-to-cart]");
    if (!addBtn) return;
    e.preventDefault();

    // Get mealId from button or parent
    let mealId = addBtn.dataset.mealId || addBtn.getAttribute("data-meal-id");
    if (!mealId) {
      const parent = addBtn.closest(".meal-item");
      mealId = parent ? parent.dataset.mealId : null;
    }

    if (!mealId) {
      console.warn("Add-to-cart clicked but no data-meal-id found.");
      return;
    }

    const meal = getMealInfoById(mealId);
    if (!meal) {
      console.warn("Meal element not found for id:", mealId);
      return;
    }

    addToCart(meal);
  });

  // 🔔 Simple notification system
  const showNotification = (message) => {
    const notification = document.createElement("div");
    notification.classList.add("cart-notification");
    notification.textContent = message;
    document.body.appendChild(notification);

    // CSS transition trigger
    setTimeout(() => notification.classList.add("show"), 10);

    // Hide and remove after delay
    setTimeout(() => {
      notification.classList.remove("show");
      setTimeout(() => notification.remove(), 300);
    }, 2000);
  };

  // Open / Close sidebar
  if (cartIcon && cartSidebar && cartOverlay) {
    cartIcon.addEventListener("click", () => {
      cartSidebar.classList.add("active");
      cartOverlay.classList.add("active");
    });
  }

  const closeCart = () => {
    if (cartSidebar) cartSidebar.classList.remove("active");
    if (cartOverlay) cartOverlay.classList.remove("active");
  };

  if (cartClose) cartClose.addEventListener("click", closeCart);
  if (cartOverlay) cartOverlay.addEventListener("click", closeCart);

  // Checkout
  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", () => {
      console.log("Final Order:", orders);
    });
  }

  // Initial render
  renderCart();

  // Debug API
  window.__cart = {
    getOrders: () => orders,
    clear: () => {
      orders = [];
      saveOrders();
    },
    addById: (id) => {
      const meal = getMealInfoById(id);
      if (meal) addToCart(meal);
    },
  };
});