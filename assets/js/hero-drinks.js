document.addEventListener("DOMContentLoaded", () => {
  const hero = document.querySelector(".hero-drinks");
  const drinkItems = hero.querySelectorAll(".drink-item");

  // Extract data from HTML (SEO-friendly)
  const drinksData = Array.from(drinkItems).map((item) => ({
    id: item.querySelector(".js-add-to-cart")?.getAttribute("data-meal-id") || "",
    title: item.querySelector(".title")?.textContent.trim() || "",
    description: item.querySelector(".description")?.textContent.trim() || "",
    price: item.querySelector(".price")?.textContent.trim() || "",
    image: item.querySelector(".image")?.getAttribute("src") || "",
    bgImage: item.dataset.bg || "",
  }));

  if (drinksData.length === 0) {
    console.error("No drink data found");
    return;
  }

  // AHORA SÍ BORRA LOS data-meal-id
  drinkItems.forEach(item => {
    const buttons = item.querySelectorAll(".js-add-to-cart, [data-meal-id]");
    buttons.forEach(btn => {
      btn.removeAttribute("data-meal-id");
    });
  });

  // Hide original items (keep for SEO)
  hero.querySelector(".show-drink").classList.add("js-enhanced");

  // Generate animated structure
  generateDrinksHTML(drinksData);

  // Initialize after generation
  setTimeout(() => initializeCarousel(drinksData), 100);
});

// Generate animated HTML
function generateDrinksHTML(drinksData) {
  const hero = document.querySelector(".hero-drinks");

  const wrapper = document.createElement("div");
  wrapper.className = "drinks-animated-wrapper";
  wrapper.innerHTML = `
    <div class="main-drink-display">
      <div class="drink-image-box">
        <img class="drink-main-image" src="${drinksData[0].image}" alt="${drinksData[0].title}">
      </div>
      <div class="drink-info-box">
        <h2 class="title">${drinksData[0].title}</h2>
        <p class="description">${drinksData[0].description}</p>
        <div class="price-action">
          <span class="price">${drinksData[0].price}</span>
          <button class="btn sm js-add-to-cart" 
                  data-meal-id="${drinksData[0].id}"
                  data-product-name="${drinksData[0].title}"
                  data-product-price="${drinksData[0].price}"
                  data-product-image="${drinksData[0].image}">
            Add to cart
          </button>
          <div class="controls">
            <button class="btn-nav prevDrink">←</button>
            <button class="btn-nav nextDrink">→</button>
          </div>
        </div>
      </div>
    </div>
  `;
  hero.appendChild(wrapper);

  // Create dots
  const dotsContainer = document.createElement("div");
  dotsContainer.className = "dots";
  drinksData.forEach((_, i) => {
    const dot = document.createElement("div");
    dot.className = `dot ${i === 0 ? "active" : ""}`;
    dot.dataset.index = i;
    dotsContainer.appendChild(dot);
  });
  hero.appendChild(dotsContainer);
}

// Initialize carousel
function initializeCarousel(drinksData) {
  const hero = document.querySelector(".hero-drinks");
  const drinkImage = hero.querySelector(".drink-main-image");
  const bgContainer = hero.querySelector(".main-image-drink");
  const bgImage = hero.querySelector(".main-image-drink .image");
  const title = hero.querySelector(".drinks-animated-wrapper .title");
  const description = hero.querySelector(".drinks-animated-wrapper .description");
  const priceAction = hero.querySelector(".drinks-animated-wrapper .price-action");
  const dots = hero.querySelectorAll(".dot");

  let currentIndex = 0;
  let animating = false;

  // Text animations
  function animateElementOut(element, delay = 0) {
    if (!element) return;
    setTimeout(() => {
      element.style.transition = "opacity 0.4s ease, transform 0.4s ease";
      element.style.opacity = "0";
      element.style.transform = "translateX(30px)";
    }, delay);
  }

  function animateElementIn(element, delay = 0) {
    if (!element) return;
    element.style.opacity = "0";
    element.style.transform = "translateX(-30px)";
    element.style.transition = "none";
    setTimeout(() => {
      element.style.transition =
        "opacity 0.5s cubic-bezier(0.25, 0.8, 0.25, 1), transform 0.5s cubic-bezier(0.25, 0.8, 0.25, 1)";
      element.style.opacity = "1";
      element.style.transform = "translateX(0)";
    }, delay);
  }

  // ✅ Crossfade de fondo suave sin parpadeo
  function crossfadeBackground(newSrc) {
    const newBg = document.createElement("img");
    newBg.className = "image fade-layer";
    newBg.src = newSrc;
    Object.assign(newBg.style, {
      position: "absolute",
      top: "0",
      left: "0",
      width: "100%",
      height: "100%",
      objectFit: "cover",
      opacity: "0",
      transition: "opacity 1.2s ease-in-out",
      zIndex: "2",
    });

    // Añadimos nueva imagen arriba de la actual
    bgContainer.appendChild(newBg);

    // Activamos la transición suave
    requestAnimationFrame(() => {
      newBg.style.opacity = "1";
    });

    // Después del desvanecido, reemplazamos el src y limpiamos
    setTimeout(() => {
      bgImage.src = newSrc;
      bgImage.style.opacity = "1";
      newBg.remove();
    }, 1200);
  }

  // Update content
  function updateDrinkContent(newIndex) {
    if (animating || newIndex === currentIndex) return;
    animating = true;

    const drink = drinksData[newIndex];
    const oldControls = priceAction.querySelector(".controls");

    // Out animations
    drinkImage.style.transition = "opacity 0.6s ease, transform 0.6s ease";
    drinkImage.style.opacity = "0";
    drinkImage.style.transform = "translateY(80px)";
    animateElementOut(title, 0);
    animateElementOut(description, 80);
    if (oldControls) animateElementOut(oldControls, 100);
    const priceSpan = priceAction.querySelector(".price");
    const addBtn = priceAction.querySelector(".btn");
    if (priceSpan) animateElementOut(priceSpan, 100);
    if (addBtn) animateElementOut(addBtn, 100);

    // 🌙 Fondo suave
    crossfadeBackground(drink.bgImage);

    setTimeout(() => {
      drinkImage.src = drink.image;
      title.textContent = drink.title;
      description.textContent = drink.description;
      priceAction.innerHTML = `
        <span class="price">${drink.price}</span>
        <button class="btn sm js-add-to-cart" 
                data-meal-id="${drink.id}"
                data-product-name="${drink.title}"
                data-product-price="${drink.price}"
                data-product-image="${drink.image}">
          Add to cart
        </button>
        <div class="controls">
          <button class="btn-nav prevDrink">←</button>
          <button class="btn-nav nextDrink">→</button>
        </div>
      `;

      // Animate in
      drinkImage.style.transition = "none";
      drinkImage.style.opacity = "0";
      drinkImage.style.transform = "translateY(-80px)";
      setTimeout(() => {
        drinkImage.style.transition = "opacity 0.6s ease, transform 0.6s ease";
        drinkImage.style.opacity = "1";
        drinkImage.style.transform = "translateY(0)";
      }, 50);

      animateElementIn(title, 150);
      animateElementIn(description, 250);
      const newPriceSpan = priceAction.querySelector(".price");
      const newAddBtn = priceAction.querySelector(".btn");
      if (newPriceSpan) animateElementIn(newPriceSpan, 250);
      if (newAddBtn) animateElementIn(newAddBtn, 250);
      const newControls = priceAction.querySelector(".controls");
      if (newControls) animateElementIn(newControls, 350);

      // Reconnect controls
      setTimeout(() => {
        const newBtnNext = priceAction.querySelector(".nextDrink");
        const newBtnPrev = priceAction.querySelector(".prevDrink");
        if (newBtnNext) newBtnNext.addEventListener("click", goNext);
        if (newBtnPrev) newBtnPrev.addEventListener("click", goPrev);
      }, 400);

      dots.forEach((dot) => dot.classList.remove("active"));
      dots[newIndex].classList.add("active");

      currentIndex = newIndex;
      setTimeout(() => (animating = false), 800);
    }, 450);
  }

  // Navigation
  function goNext() {
    const next = (currentIndex + 1) % drinksData.length;
    updateDrinkContent(next);
  }

  function goPrev() {
    const prev = (currentIndex - 1 + drinksData.length) % drinksData.length;
    updateDrinkContent(prev);
  }

  // Initial listeners
  const initialBtnNext = hero.querySelector(".nextDrink");
  const initialBtnPrev = hero.querySelector(".prevDrink");
  if (initialBtnNext) initialBtnNext.addEventListener("click", goNext);
  if (initialBtnPrev) initialBtnPrev.addEventListener("click", goPrev);

  dots.forEach((dot) => {
    dot.addEventListener("click", () => updateDrinkContent(Number(dot.dataset.index)));
  });
}