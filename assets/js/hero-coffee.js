document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("coffee-carousel");
  if (!container) return;

  // Read coffee data directly from HTML (SEO-friendly)
  const coffeeItems = container.querySelectorAll(".coffee-item");
  const coffeeData = Array.from(coffeeItems).map((item, i) => ({
    id: item.querySelector(".js-add-to-cart")?.getAttribute("data-meal-id") || "",
    title: item.querySelector(".title")?.textContent.trim() || "",
    image: item.querySelector(".image")?.getAttribute("src") || "",
    alt: item.querySelector(".image")?.getAttribute("alt") || "",
    price: item.querySelector(".price")?.textContent.trim() || "",
    description: item.querySelector(".description")?.textContent.trim() || "",
  }));

  coffeeItems.forEach(item => {
    const buttons = item.querySelectorAll(".js-add-to-cart, [data-meal-id]");
    buttons.forEach(btn => {
      btn.removeAttribute("data-meal-id");
    });
  });

  if (coffeeData.length === 0) return;

  // --- Build the carousel structure dynamically ---
  container.innerHTML = `
    <div class="hero-coffee">
      <div class="show-coffee">
        <img class="image-bg" src="assets/images/backgrounds/coffee-beans.png" alt="Coffee beans background">
        <img class="image" src="${coffeeData[0].image}" alt="${coffeeData[0].alt}" data-product-image>
      </div>

      <div class="list-coffee">
        <div class="box-coffee">
          ${coffeeData
            .map(
              (c, i) => `
              <div class="circular-image ${i === 0 ? "active" : ""}" data-index="${i}">
                <img class="image" src="${c.image}" alt="${c.alt}">
              </div>`
            )
            .join("")}
        </div>
      </div>

      <div class="info-coffee">
        <div class="box-info-coffee">
          <h2 class="title">${coffeeData[0].title}</h2>
          <p class="description">${coffeeData[0].description}</p>
          <div class="options">
            <span class="price">${coffeeData[0].price}</span>
            <button class='btn sm js-add-to-cart'>
              Add to cart
            </button>
          </div>
        </div>

        <div class="controls">
          <button id="prevCoffee" class="btn-nav">←</button>
          <button id="nextCoffee" class="btn-nav">→</button>
        </div>
      </div>
    </div>
  `;

  // --- Get DOM references ---
  const showCoffee = container.querySelector(".show-coffee");
  const title = container.querySelector(".title");
  const desc = container.querySelector(".description");
  const options = container.querySelector(".options");
  const price = container.querySelector(".price");
  const addButton = container.querySelector(".js-add-to-cart");
  const infoBox = container.querySelector(".box-info-coffee");
  const dots = container.querySelectorAll(".circular-image");
  const btnPrev = container.querySelector("#prevCoffee");
  const btnNext = container.querySelector("#nextCoffee");

  let currentIndex = 0;
  let animating = false;

  // --- Helper: Animate info elements out ---
  function animateElementOut(element, delay) {
    setTimeout(() => {
      element.style.transition = "opacity 0.4s ease, transform 0.4s ease";
      element.style.opacity = "0";
      element.style.transform = "translateY(20px)";
    }, delay);
  }

  // --- Helper: Animate info elements in ---
  function animateElementIn(element, delay) {
    element.style.opacity = "0";
    element.style.transform = "translateY(-20px)";
    element.style.transition = "none";
    setTimeout(() => {
      element.style.transition =
        "opacity 0.5s cubic-bezier(0.25, 0.8, 0.25, 1), transform 0.5s cubic-bezier(0.25, 0.8, 0.25, 1)";
      element.style.opacity = "1";
      element.style.transform = "translateY(0)";
    }, delay);
  }

  // --- Update addButton with correct data attributes ---
  function updateAddButtonData(index) {
    const coffee = coffeeData[index];
    addButton.setAttribute("data-meal-id", coffee.id);
    addButton.setAttribute("data-product-name", coffee.title);
    addButton.setAttribute("data-product-price", coffee.price);
    addButton.setAttribute("data-product-image", coffee.image);
  }

  // Assign first coffee initially
  updateAddButtonData(0);

  // --- Main coffee switching logic ---
  function changeCoffee(newIndex, direction) {
    if (animating || newIndex === currentIndex) return;
    animating = true;

    const currentImg = showCoffee.querySelector(".image");
    const currentBg = showCoffee.querySelector(".image-bg");
    const fromDot = dots[currentIndex];
    const toDot = dots[newIndex];

    const sourceRect = fromDot.getBoundingClientRect();
    const targetRect = toDot.getBoundingClientRect();
    const moveX = targetRect.left - sourceRect.left;
    const moveY = targetRect.top - sourceRect.top;

    fromDot.style.setProperty("--start-top", `${sourceRect.top}px`);
    fromDot.style.setProperty("--start-left", `${sourceRect.left}px`);
    fromDot.style.setProperty("--move-x", `${moveX}px`);
    fromDot.style.setProperty("--move-y", `${moveY}px`);

    fromDot.classList.remove("active");
    fromDot.classList.add("moving");

    setTimeout(() => {
      toDot.classList.add("active");
    }, 300);

    // Create next image and background
    const nextImg = document.createElement("img");
    nextImg.className = "image";
    nextImg.src = coffeeData[newIndex].image;
    nextImg.alt = coffeeData[newIndex].alt;
    nextImg.setAttribute("data-product-image", "");

    const nextBg = document.createElement("img");
    nextBg.className = "image-bg";
    nextBg.src = "assets/images/backgrounds/coffee-beans.png";
    nextBg.alt = "Coffee beans background";

    const outAnim = direction === "right" ? "rotate-out-left" : "rotate-out-right";
    const inAnim = direction === "right" ? "rotate-in-left" : "rotate-in-right";

    currentImg.style.animation = `${outAnim} 0.8s ease forwards`;
    currentBg.style.animation = `${outAnim} 0.8s ease forwards`;
    nextImg.style.animation = `${inAnim} 0.8s ease forwards`;
    nextBg.style.animation = `${inAnim} 0.8s ease forwards`;

    showCoffee.appendChild(nextBg);
    showCoffee.appendChild(nextImg);

    animateElementOut(title, 0);
    animateElementOut(desc, 80);
    animateElementOut(options, 160);

    setTimeout(() => {
      title.textContent = coffeeData[newIndex].title;
      desc.textContent = coffeeData[newIndex].description;
      price.textContent = coffeeData[newIndex].price;

      // --- Update button dynamically ---
      updateAddButtonData(newIndex);

      animateElementIn(title, 50);
      animateElementIn(desc, 150);
      animateElementIn(options, 250);
    }, 500);

    setTimeout(() => {
      currentImg.remove();
      currentBg.remove();
      fromDot.classList.remove("moving");
      animating = false;
      currentIndex = newIndex;
    }, 800);
  }

  // --- Navigation events ---
  btnNext.addEventListener("click", () => {
    const next = (currentIndex + 1) % coffeeData.length;
    changeCoffee(next, "right");
  });

  btnPrev.addEventListener("click", () => {
    const prev = (currentIndex - 1 + coffeeData.length) % coffeeData.length;
    changeCoffee(prev, "left");
  });

  // --- Dot click interaction ---
  dots.forEach((dot, i) => {
    dot.addEventListener("click", () => {
      changeCoffee(i, i > currentIndex ? "right" : "left");
    });
  });
});
