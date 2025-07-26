
document.addEventListener('DOMContentLoaded', function() {
  const audio = document.getElementById("slide-audio");

  const textSlider = new Swiper(".text-slider", {
    effect: "fade",
    fadeEffect: {
      crossFade: true
    },
    autoplay: {
      delay: 3000,
      disableOnInteraction: false,
    },
    speed: 1500,
    mousewheel: true,
    allowTouchMove: false
  });

  const imageSlider = new Swiper(".image-slider", {
    effect: "creative",
    creativeEffect: {
      prev: {
        translate: [0, 0, -800],
        rotate: [-90, 0, 0],
        opacity: 0
      },
      next: {
        translate: [0, 0, -800],
        rotate: [90, 0, 0],
        opacity: 0
      },
    },
    grabCursor: true,
    mousewheel: true,
    speed: 1500,
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    }
  });

  textSlider.controller.control = imageSlider;
  imageSlider.controller.control = textSlider;

  // 🔊 Play audio on every slide change
  textSlider.on('slideChange', () => {
    audio.currentTime = 0;
    audio.play();
  });
});
