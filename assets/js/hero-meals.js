// Variable to control current rotation
let currentRotation = 0;
let mealsData = [];
let originalImageSources = [];
let currentMealIndex = 0;

// Wait for DOM to be fully loaded
document.addEventListener("DOMContentLoaded", async () => {
  const hero = document.querySelector(".hero-meals-box");

  // Build mealsData from existing HTML
  const mealItems = hero.querySelectorAll(".meal-item");
  if (mealItems.length === 0) {
    console.error("No .meal-item elements found inside .hero-meals-box");
    return;
  }

  mealsData = Array.from(mealItems).map((item) => ({
    id: item.querySelector(".js-add-to-cart")?.getAttribute("data-meal-id") || "",
    title: item.querySelector(".title")?.textContent.trim() || "",
    image: item.querySelector(".image")?.getAttribute("src") || "",
    alt: item.querySelector(".image")?.getAttribute("alt") || "",
    price: item.querySelector(".price")?.textContent.trim() || "",
    buttonHtml: (() => {
      const clone = item.querySelector(".price-add")?.cloneNode(true);
      if (!clone) return "";
      const priceEl = clone.querySelector(".price");
      if (priceEl) priceEl.remove();
      return clone.innerHTML.trim();
    })(),
  }));

  mealItems.forEach(item => {
    const buttons = item.querySelectorAll(".js-add-to-cart, [data-meal-id]");
    buttons.forEach(btn => {
      btn.removeAttribute("data-meal-id");
    });
  });

  // Hide original items but keep them in DOM for SEO
  hero.classList.add("js-enhanced");

  // Generate animation structure
  generateMealsHTML();

  // Initialize carousel after generation
  setTimeout(() => {
    initializeCarousel();
  }, 100);
});

// Generate the animated circular meals layout
function generateMealsHTML() {
  if (mealsData.length === 0) return;

  const hero = document.querySelector(".hero-meals-box");

  const wrapper = document.createElement("div");
  wrapper.className = "hero-meals-anim";
  wrapper.innerHTML = `
    <div class="circle"></div>
    <div class="line">
      <div class="main-meal"></div>
    </div>
  `;

  hero.appendChild(wrapper);

  const circle = wrapper.querySelector(".circle");
  const mainMeal = wrapper.querySelector(".main-meal");

  // Generate mini-circles
  mealsData.forEach((meal) => {
    const minCircle = document.createElement("div");
    minCircle.className = "min-circle";
    const img = document.createElement("img");
    img.className = "image";
    img.src = meal.image;
    img.alt = meal.alt;
    minCircle.appendChild(img);
    circle.appendChild(minCircle);
  });

  // Generate main meal content
  mainMeal.innerHTML = `
    <div class="box-image">
      <img class="image" src="${mealsData[0].image}" alt="${mealsData[0].alt}">
    </div>

    <div class="controls">
      <button id="rotateLeft">←</button>
      <button id="rotateRight">→</button>
    </div>

    <div class="info pt-4">
      <h2 class="title">${mealsData[0].title}</h2>
      <div class="price-add">
        <span class="price">${mealsData[0].price}</span>
        ${mealsData[0].buttonHtml}
      </div>
    </div>
  `;
}

// Initialize carousel functionality
function initializeCarousel() {
  const circle = document.querySelector(".hero-meals-anim .circle");
  const minCircles = document.querySelectorAll(".hero-meals-anim .min-circle");
  const mainImage = document.querySelector(".hero-meals-anim .main-meal .box-image .image");

  if (!circle || minCircles.length === 0 || !mainImage) {
    console.error("Required elements not found");
    return;
  }

  // Variables that will be recalculated on resize
  let circleDiameter, circleRadius, borderWidth, adjustedRadius, minCircleSize, minCircleRadius;
  const totalCircles = minCircles.length;
  const angleStep = (2 * Math.PI) / totalCircles;
  const startAngle = -Math.PI / 2;

  // Function to recalculate dimensions based on current circle size
  function recalculateDimensions() {
    circleDiameter = circle.offsetWidth;
    circleRadius = circleDiameter / 2;
    borderWidth = parseFloat(getComputedStyle(circle).borderWidth) || 2;
    adjustedRadius = circleRadius - borderWidth / 2;
    minCircleSize = circleDiameter * 0.2;
    minCircleRadius = minCircleSize / 2;
  }

  // Initial calculation
  recalculateDimensions();

  // --- Utility functions for smooth text animations ---
  function animateElementOut(element, delay = 0) {
    setTimeout(() => {
      element.style.transition = "opacity 0.4s ease, transform 0.4s ease";
      element.style.opacity = "0";
      element.style.transform = "translateY(20px)";
    }, delay);
  }

  function animateElementIn(element, delay = 0) {
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

  function getTopImageIndex() {
    const normalizedRotation = ((currentRotation % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
    const steps = Math.round(normalizedRotation / angleStep);
    const topIndex = (totalCircles - (steps % totalCircles)) % totalCircles;
    return topIndex;
  }

  // --- Update main meal info and animate text in sequence ---
  function updateMainContent() {
    const topIndex = getTopImageIndex();
    currentMealIndex = topIndex;
    const meal = mealsData[topIndex];

    if (originalImageSources[topIndex] && mainImage && meal) {
      const title = document.querySelector(".hero-meals-anim .main-meal .info .title");
      const priceAdd = document.querySelector(".hero-meals-anim .main-meal .info .price-add");

      // --- Animate current image out (move down) ---
      mainImage.style.transition = "opacity 0.5s ease, transform 0.6s ease";
      mainImage.style.opacity = "0";
      mainImage.style.transform = "translateY(80px)"; // move down out of view

      // Animate text out
      animateElementOut(title, 0);
      animateElementOut(priceAdd, 80);

      // Replace content after short delay
      setTimeout(() => {
        mainImage.src = originalImageSources[topIndex];
        if (title) title.textContent = meal.title;

        if (priceAdd) {
          // Keep existing button HTML but add data attributes dynamically
          priceAdd.innerHTML = `
            <span class="price">${meal.price}</span>
            ${meal.buttonHtml}
          `;

          // Add data attributes to the button
          const addBtn = priceAdd.querySelector(".js-add-to-cart");
          if (addBtn) {
            addBtn.setAttribute("data-meal-id", meal.id);
            addBtn.setAttribute("data-product-name", meal.title);
            addBtn.setAttribute("data-product-price", meal.price);
            addBtn.setAttribute("data-product-image", meal.image);
          }
        }

        // --- Animate new image in (from top) ---
        mainImage.style.transition = "none";
        mainImage.style.opacity = "0";
        mainImage.style.transform = "translateY(-80px)"; // start above
        setTimeout(() => {
          mainImage.style.transition = "opacity 0.5s ease, transform 0.6s ease";
          mainImage.style.opacity = "1";
          mainImage.style.transform = "translateY(0)";
        }, 50);

        // Animate text back in sequentially
        animateElementIn(title, 150);
        animateElementIn(priceAdd, 250);
      }, 450);
    }
  }

  // --- Crop images to circular shape ---
  async function cropImageToCircle(imgElement, size) {
    return new Promise((resolve) => {
      const canvas = document.createElement("canvas");
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext("2d");
      const image = new Image();
      image.onload = function () {
        ctx.save();
        ctx.beginPath();
        ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
        ctx.closePath();
        ctx.clip();

        const imgRatio = image.width / image.height;
        const canvasRatio = 1;
        let drawWidth, drawHeight, offsetX, offsetY;

        if (imgRatio > canvasRatio) {
          drawHeight = size;
          drawWidth = size * imgRatio;
          offsetX = -(drawWidth - size) / 2;
          offsetY = 0;
        } else {
          drawWidth = size;
          drawHeight = size / imgRatio;
          offsetX = 0;
          offsetY = -(drawHeight - size) / 2;
        }

        ctx.drawImage(image, offsetX, offsetY, drawWidth, drawHeight);
        ctx.restore();

        canvas.className = imgElement.className;
        imgElement.replaceWith(canvas);
        resolve(canvas);
      };
      image.src = imgElement.src;
    });
  }

  function positionCircles() {
    // Recalculate dimensions every time we position
    recalculateDimensions();
    
    circle.style.transform = `rotate(${currentRotation}rad)`;
    circle.style.transition = "transform 0.6s ease";
    minCircles.forEach((minCircle, index) => {
      const angle = startAngle + angleStep * index;
      const x = circleRadius + adjustedRadius * Math.cos(angle);
      const y = circleRadius + adjustedRadius * Math.sin(angle);
      minCircle.style.width = `${minCircleSize}px`;
      minCircle.style.height = `${minCircleSize}px`;
      minCircle.style.left = `${x - minCircleRadius}px`;
      minCircle.style.top = `${y - minCircleRadius}px`;
      minCircle.style.position = "absolute";
      minCircle.style.borderRadius = "50%";
      minCircle.style.overflow = "hidden";
      minCircle.style.transform = `rotate(${-currentRotation}rad)`;
      minCircle.style.transition = "transform 0.5s ease";
    });
    updateMainContent();
  }

  async function processImages() {
    originalImageSources = [];
    for (let i = 0; i < minCircles.length; i++) {
      const minCircle = minCircles[i];
      const img = minCircle.querySelector(".image");
      if (img) {
        originalImageSources[i] = img.src;
        await cropImageToCircle(img, minCircleSize);
      }
    }
    positionCircles();
  }

  // Function to reprocess images when resize happens
  async function reprocessImagesOnResize() {
    recalculateDimensions();
    
    // Replace canvases with images and re-crop with new size
    for (let i = 0; i < minCircles.length; i++) {
      const minCircle = minCircles[i];
      const canvasOrImg = minCircle.querySelector("canvas, .image");
      if (canvasOrImg && originalImageSources[i]) {
        // Create new img element
        const img = document.createElement("img");
        img.className = "image";
        img.src = originalImageSources[i];
        canvasOrImg.replaceWith(img);
        // Re-crop with new size
        await cropImageToCircle(img, minCircleSize);
      }
    }
    positionCircles();
  }

  processImages();

  // Smooth rotation buttons
  function rotateLeft() {
    currentRotation -= angleStep;
    positionCircles();
  }

  function rotateRight() {
    currentRotation += angleStep;
    positionCircles();
  }

  // --- Click on mini plate to rotate and show info ---
  minCircles.forEach((circleEl, index) => {
    circleEl.addEventListener("click", () => {
      const diff = (index - currentMealIndex + totalCircles) % totalCircles;
      const rotationSteps = diff > totalCircles / 2 ? diff - totalCircles : diff;
      currentRotation -= rotationSteps * angleStep;
      positionCircles();
    });
  });

  // Controls
  document.getElementById("rotateLeft").addEventListener("click", rotateLeft);
  document.getElementById("rotateRight").addEventListener("click", rotateRight);

  // Add resize listener with debounce to avoid too many calls
  let resizeTimeout;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      reprocessImagesOnResize();
    }, 150);
  });
}