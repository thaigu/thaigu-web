let isHeroDrinksInitialized = false;

function initHeroDrinks() {
  if (isHeroDrinksInitialized) return;
  const hero = document.querySelector(".hero-drinks");
  if (!hero) return;
  const drinkItems = hero.querySelectorAll(".drink-item");

  // Extract data from HTML
  const drinksData = Array.from(drinkItems).map((item) => ({
    title: item.querySelector(".title")?.textContent.trim() || "",
    description: item.querySelector(".description")?.textContent.trim() || "",
    image: item.querySelector(".image")?.getAttribute("src") || "",
    bgImage: item.dataset.bg || "",
  }));

  if (drinksData.length === 0) {
    console.error("No drink data found");
    return;
  }

  isHeroDrinksInitialized = true;

  // Hide original items (keep for SEO)
  hero.querySelector(".show-drink").classList.add("js-enhanced");

  // Generate animated structure
  generateDrinksHTML(drinksData);

  // Initialize after generation
  setTimeout(() => initializeCarousel(drinksData), 100);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initHeroDrinks);
} else {
  initHeroDrinks();
}

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

  // Crossfade background
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

    bgContainer.appendChild(newBg);

    requestAnimationFrame(() => {
      newBg.style.opacity = "1";
    });

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

    // Background transition
    crossfadeBackground(drink.bgImage);

    setTimeout(() => {
      drinkImage.src = drink.image;
      title.textContent = drink.title;
      description.textContent = drink.description;
      priceAction.innerHTML = `
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

  // Touch swipe gesture for iPhone
  let startX = 0;
  let startY = 0;
  hero.addEventListener("touchstart", (e) => {
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
  }, { passive: true });

  hero.addEventListener("touchend", (e) => {
    const diffX = e.changedTouches[0].clientX - startX;
    const diffY = e.changedTouches[0].clientY - startY;
    if (Math.abs(diffX) > 45 && Math.abs(diffX) > Math.abs(diffY)) {
      if (diffX < 0) {
        goNext();
      } else {
        goPrev();
      }
    }
  }, { passive: true });
}