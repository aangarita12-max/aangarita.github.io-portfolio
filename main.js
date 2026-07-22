/* Andrés Angarita — Portfolio: shared behavior for all pages */
(function () {
  'use strict';

  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Mobile nav ---------- */
  var navToggle = document.querySelector('.nav-toggle');
  var navOverlay = document.querySelector('.nav-overlay');

  if (navToggle && navOverlay) {
    navToggle.addEventListener('click', function () {
      var isOpen = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', String(!isOpen));
      navOverlay.classList.toggle('is-open', !isOpen);
      document.body.classList.toggle('nav-open', !isOpen);
    });

    navOverlay.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        navToggle.setAttribute('aria-expanded', 'false');
        navOverlay.classList.remove('is-open');
        document.body.classList.remove('nav-open');
      });
    });
  }

  /* ---------- Scroll reveal ---------- */
  var revealEls = document.querySelectorAll('.reveal');

  if (prefersReducedMotion || !('IntersectionObserver' in window)) {
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  } else {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach(function (el) { observer.observe(el); });
  }

  /* ---------- Custom cursor (desktop, pointer:fine, >=1200px) ---------- */
  var pointerFine = window.matchMedia('(pointer: fine)').matches;
  var wideEnough = window.matchMedia('(min-width: 1200px)').matches;

  if (pointerFine && wideEnough && !prefersReducedMotion) {
    document.body.classList.add('cursor-active');

    var cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    cursor.setAttribute('aria-hidden', 'true');
    document.body.appendChild(cursor);

    var cursorLabel = document.createElement('span');
    cursor.appendChild(cursorLabel);

    document.addEventListener('mousemove', function (e) {
      cursor.style.transform = 'translate3d(' + e.clientX + 'px, ' + e.clientY + 'px, 0) translate(-50%, -50%)';
    });

    var hoverTargets = document.querySelectorAll('a, button, .chip, .project-row');

    hoverTargets.forEach(function (el) {
      el.addEventListener('mouseenter', function () {
        cursor.classList.add('is-hover');
        cursorLabel.textContent = 'View →';
      });
      el.addEventListener('mouseleave', function () {
        cursor.classList.remove('is-hover');
        cursorLabel.textContent = '';
      });
    });

    document.addEventListener('mouseleave', function () {
      cursor.style.opacity = '0';
    });
    document.addEventListener('mouseenter', function () {
      cursor.style.opacity = '1';
    });
  }

  /* ---------- Filter chips (projects.html) ---------- */
  var filterChips = document.querySelectorAll('.chip[data-filter]');
  var projectRows = document.querySelectorAll('.project-list .project-row');

  if (filterChips.length && projectRows.length) {
    filterChips.forEach(function (chip) {
      chip.addEventListener('click', function () {
        filterChips.forEach(function (c) { c.classList.remove('is-active'); });
        chip.classList.add('is-active');
        chip.setAttribute('aria-pressed', 'true');
        filterChips.forEach(function (c) {
          if (c !== chip) c.setAttribute('aria-pressed', 'false');
        });

        var filter = chip.getAttribute('data-filter');

        projectRows.forEach(function (row) {
          var tags = (row.getAttribute('data-tags') || '').toLowerCase();
          var match = filter === 'all' || tags.indexOf(filter) !== -1;

          if (match) {
            row.style.display = '';
            row.setAttribute('aria-hidden', 'false');
            window.requestAnimationFrame(function () {
              row.classList.remove('is-filtered-out');
            });
          } else {
            row.classList.add('is-filtered-out');
            row.setAttribute('aria-hidden', 'true');
            window.setTimeout(function () {
              if (row.classList.contains('is-filtered-out')) {
                row.style.display = 'none';
              }
            }, prefersReducedMotion ? 0 : 300);
          }
        });
      });
    });
  }

  /* ---------- Accordion (about.html) ---------- */
  var accordionItems = document.querySelectorAll('.accordion__item');

  accordionItems.forEach(function (item) {
    var trigger = item.querySelector('.accordion__trigger');
    if (!trigger) return;

    trigger.addEventListener('click', function () {
      var isOpen = item.classList.contains('is-open');

      accordionItems.forEach(function (other) {
        other.classList.remove('is-open');
        var otherTrigger = other.querySelector('.accordion__trigger');
        if (otherTrigger) otherTrigger.setAttribute('aria-expanded', 'false');
      });

      if (!isOpen) {
        item.classList.add('is-open');
        trigger.setAttribute('aria-expanded', 'true');
      }
    });
  });

  /* ---------- Generic slider factory (photo carousel + testimonials) ---------- */
  function createSlider(root, options) {
    options = options || {};
    var slides = Array.prototype.slice.call(root.querySelectorAll(options.slideSelector));
    if (!slides.length) return null;

    var index = 0;
    var scope = root.closest('[data-slider]') || root.parentElement;
    var prevBtn = scope.querySelector(options.prevSelector);
    var nextBtn = scope.querySelector(options.nextSelector);
    var dotsContainer = options.dotsContainer ? scope.querySelector(options.dotsContainer) : null;
    var dots = [];

    function render() {
      slides.forEach(function (slide, i) {
        if (options.mode === 'track') {
          slide.style.transform = '';
        }
        slide.classList.toggle(options.activeClass, i === index);
      });

      if (options.mode === 'track') {
        root.style.transform = 'translateX(-' + (index * 100) + '%)';
      }

      if (dots.length) {
        dots.forEach(function (dot, i) {
          dot.classList.toggle('is-active', i === index);
        });
      }
    }

    function goTo(i) {
      index = (i + slides.length) % slides.length;
      render();
    }

    function next() { goTo(index + 1); }
    function prev() { goTo(index - 1); }

    if (dotsContainer) {
      slides.forEach(function (_, i) {
        var dot = document.createElement('button');
        dot.className = 'carousel__dot';
        dot.type = 'button';
        dot.setAttribute('aria-label', 'Go to slide ' + (i + 1));
        dot.addEventListener('click', function () { goTo(i); reset(); });
        dotsContainer.appendChild(dot);
        dots.push(dot);
      });
    }

    if (nextBtn) nextBtn.addEventListener('click', function () { next(); reset(); });
    if (prevBtn) prevBtn.addEventListener('click', function () { prev(); reset(); });

    /* Touch swipe */
    var touchStartX = null;
    root.addEventListener('touchstart', function (e) {
      touchStartX = e.touches[0].clientX;
    }, { passive: true });

    root.addEventListener('touchend', function (e) {
      if (touchStartX === null) return;
      var deltaX = e.changedTouches[0].clientX - touchStartX;
      if (Math.abs(deltaX) > 40) {
        if (deltaX < 0) next(); else prev();
        reset();
      }
      touchStartX = null;
    }, { passive: true });

    /* Auto-advance */
    var timer = null;
    function start() {
      if (!options.autoAdvance || prefersReducedMotion) return;
      timer = window.setInterval(next, options.autoAdvance);
    }
    function stop() {
      if (timer) window.clearInterval(timer);
    }
    function reset() {
      stop();
      start();
    }

    if (options.autoAdvance) {
      root.addEventListener('mouseenter', stop);
      root.addEventListener('mouseleave', start);
      root.addEventListener('focusin', stop);
      root.addEventListener('focusout', start);
      start();
    }

    render();

    return { goTo: goTo, next: next, prev: prev };
  }

  var photoCarousel = document.querySelector('.carousel__track');
  if (photoCarousel) {
    createSlider(photoCarousel, {
      slideSelector: '.carousel__slide',
      prevSelector: '.carousel__arrow--prev',
      nextSelector: '.carousel__arrow--next',
      dotsContainer: '.carousel__dots',
      mode: 'track',
      activeClass: 'is-active'
    });
  }

  var testimonialsTrack = document.querySelector('.testimonials__track');
  if (testimonialsTrack) {
    createSlider(testimonialsTrack, {
      slideSelector: '.testimonial-slide',
      prevSelector: '.testimonials__arrow--prev',
      nextSelector: '.testimonials__arrow--next',
      mode: 'fade',
      activeClass: 'is-active',
      autoAdvance: 7000
    });
  }
})();
