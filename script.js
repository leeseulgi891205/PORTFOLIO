const revealTargets = document.querySelectorAll(".reveal-item, .section-title, .about-text, .skill-group, .project-card, .contact-box");

revealTargets.forEach((el) => el.classList.add("reveal"));

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
        observer.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.14,
  }
);

revealTargets.forEach((el) => observer.observe(el));

const sliders = document.querySelectorAll("[data-slider]");

sliders.forEach((slider) => {
  const track = slider.querySelector("[data-slider-track]");
  const slides = track ? track.querySelectorAll(".project-slide") : [];
  const preview = slider.closest(".project-preview");
  const titleOutput = preview?.querySelector("[data-slide-title-out]");
  const descOutput = preview?.querySelector("[data-slide-desc-out]");
  const tagsOutput = preview?.querySelector("[data-slide-tags-out]");
  const indexOutput = preview?.querySelector("[data-slide-index-out]");
  const thumbButtons = preview ? [...preview.querySelectorAll("[data-slide-go]")] : [];

  if (!track || slides.length <= 1) return;

  let currentIndex = 0;
  const lastIndex = slides.length - 1;

  const updateSlidePosition = (useTransition = true) => {
    track.style.transition = useTransition ? "transform 0.7s ease" : "none";
    track.style.transform = `translateX(-${currentIndex * 100}%)`;
  };

  const syncLinkToCurrentSlide = () => {
    const currentImage = slides[currentIndex]?.querySelector("img");
    if (currentImage?.getAttribute("src")) {
      slider.href = currentImage.getAttribute("src");
    }
  };

  const syncMetaToCurrentSlide = () => {
    const sourceSlide = slides[currentIndex]?.hasAttribute("aria-hidden") ? slides[0] : slides[currentIndex];
    if (!sourceSlide) return;
    const safeIndex = slides[currentIndex]?.hasAttribute("aria-hidden") ? 0 : currentIndex;

    if (titleOutput) {
      titleOutput.textContent = sourceSlide.dataset.slideTitle || "";
    }

    if (descOutput) {
      descOutput.textContent = sourceSlide.dataset.slideDesc || "";
    }

    if (indexOutput) {
      indexOutput.textContent = String(safeIndex + 1).padStart(2, "0");
    }

    if (tagsOutput) {
      const tags = (sourceSlide.dataset.slideTags || "")
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean);

      tagsOutput.innerHTML = tags.map((tag) => `<span>${tag}</span>`).join("");
    }

    thumbButtons.forEach((button, buttonIndex) => {
      button.classList.toggle("is-active", buttonIndex === safeIndex);
    });
  };

  const moveToNextSlide = () => {
    currentIndex += 1;
    updateSlidePosition(true);
    syncLinkToCurrentSlide();
    syncMetaToCurrentSlide();

    if (currentIndex === lastIndex) {
      window.setTimeout(() => {
        currentIndex = 0;
        updateSlidePosition(false);
        syncLinkToCurrentSlide();
        syncMetaToCurrentSlide();
      }, 720);
    }
  };

  updateSlidePosition(false);
  syncLinkToCurrentSlide();
  syncMetaToCurrentSlide();

  thumbButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const nextIndex = Number(button.dataset.slideGo);
      if (Number.isNaN(nextIndex)) return;

      currentIndex = nextIndex;
      updateSlidePosition(true);
      syncLinkToCurrentSlide();
      syncMetaToCurrentSlide();
    });
  });

  window.setInterval(moveToNextSlide, 3000);
});
