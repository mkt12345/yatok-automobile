/* ============================================
   YATOK AUTOMOBILES – MAIN JS (Static/GitHub Pages)
   ============================================ */

document.addEventListener('DOMContentLoaded', function () {

  // ── FOOTER YEAR ──────────────────────────
  var yearEl = document.getElementById('footerYear');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ── HERO SLIDER ──────────────────────────
  var heroSlides = document.getElementById('yaSlides');
  var heroDots   = document.getElementById('yaHeroDots');
  if (heroSlides) {
    var current = 0;
    var total   = heroSlides.children.length;
    var heroTimer;

    for (var i = 0; i < total; i++) {
      (function(idx) {
        var d = document.createElement('div');
        d.className = 'ya-dot' + (idx === 0 ? ' active' : '');
        d.addEventListener('click', function() { heroGoTo(idx); });
        heroDots.appendChild(d);
      })(i);
    }

    function heroGoTo(n) {
      current = (n + total) % total;
      heroSlides.style.transform = 'translateX(-' + (current * 100) + '%)';
      document.querySelectorAll('.ya-dot').forEach(function(d, i) {
        d.classList.toggle('active', i === current);
      });
    }

    function startAutoplay() {
      heroTimer = setInterval(function() { heroGoTo(current + 1); }, 5000);
    }

    window.heroMove = function(dir) {
      clearInterval(heroTimer);
      heroGoTo(current + dir);
      startAutoplay();
    };

    startAutoplay();

    // Pause on hover
    var heroEl = document.querySelector('.ya-hero');
    if (heroEl) {
      heroEl.addEventListener('mouseenter', function() { clearInterval(heroTimer); });
      heroEl.addEventListener('mouseleave', startAutoplay);
    }
  }

  // ── CARS SLIDER ──────────────────────────
  var carsSlider = document.getElementById('yaCarsSlider');
  var carDotsEl  = document.getElementById('yaCarDots');
  if (carsSlider) {
    var carIndex = 0;
    var carCards = carsSlider.querySelectorAll('.ya-car-card');

    function visibleCars() {
      return window.innerWidth < 560 ? 1 : window.innerWidth < 900 ? 2 : 3;
    }
    function maxCarIdx() { return Math.max(0, carCards.length - visibleCars()); }

    var dotCount = carCards.length - 2;
    for (var j = 0; j < dotCount; j++) {
      (function(idx) {
        var d = document.createElement('div');
        d.className = 'ya-sdot' + (idx === 0 ? ' active' : '');
        d.addEventListener('click', function() { carGoTo(idx); });
        carDotsEl.appendChild(d);
      })(j);
    }

    function carGoTo(n) {
      carIndex = Math.max(0, Math.min(n, maxCarIdx()));
      var cardW = carCards[0].offsetWidth + 18;
      carsSlider.style.transform = 'translateX(-' + (carIndex * cardW) + 'px)';
      carsSlider.style.transition = 'transform .4s ease';
      document.querySelectorAll('.ya-sdot').forEach(function(d, i) {
        d.classList.toggle('active', i === carIndex);
      });
    }

    window.carMove = function(dir) { carGoTo(carIndex + dir); };
    window.addEventListener('resize', function() { carGoTo(carIndex); });
  }

  // ── MOBILE MENU ──────────────────────────
  window.yaToggleMenu = function() {
    var m = document.getElementById('yaMobileMenu');
    if (m) {
      m.style.display = m.style.display === 'flex' ? 'none' : 'flex';
    }
  };

  // ── CATEGORIES DROPDOWN ──────────────────
  window.yaToggleCats = function() {
    var d = document.getElementById('yaCatsDropdown');
    if (d) d.classList.toggle('open');
  };
  document.addEventListener('click', function(e) {
    var d = document.getElementById('yaCatsDropdown');
    if (d && d.classList.contains('open')) {
      if (!e.target.closest('.ya-nav-btn') && !e.target.closest('.ya-cats-dropdown')) {
        d.classList.remove('open');
      }
    }
  });

  // ── SCROLL REVEAL ─────────────────────────
  var revealEls = document.querySelectorAll('.ya-reveal');
  if ('IntersectionObserver' in window) {
    var obs = new IntersectionObserver(function(entries) {
      entries.forEach(function(e) {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.1 });
    revealEls.forEach(function(el) { obs.observe(el); });
  } else {
    revealEls.forEach(function(el) { el.classList.add('visible'); });
  }

  // ── STICKY HEADER SHADOW ─────────────────
  var header = document.getElementById('yaHeader');
  var backTop = document.getElementById('yaBackTop');
  window.addEventListener('scroll', function() {
    if (header) {
      header.style.boxShadow = window.scrollY > 10
        ? '0 4px 30px rgba(0,0,0,.8)'
        : '0 2px 20px rgba(0,0,0,.6)';
    }
    if (backTop) {
      backTop.classList.toggle('visible', window.scrollY > 400);
    }
  });

  // ── CART STATE ───────────────────────────
  var cart     = JSON.parse(localStorage.getItem('yatok_cart') || '[]');
  var wishlist = JSON.parse(localStorage.getItem('yatok_wishlist') || '[]');
  updateCartUI();

  function saveCart() {
    localStorage.setItem('yatok_cart', JSON.stringify(cart));
    updateCartUI();
  }

  function updateCartUI() {
    var count = cart.length;
    var badge = document.getElementById('cartCount');
    var inner = document.getElementById('cartCountInner');
    if (badge) {
      badge.textContent = count;
      badge.classList.add('bump');
      setTimeout(function() { badge.classList.remove('bump'); }, 300);
    }
    if (inner) inner.textContent = count;
  }

  window.addToCart = function(e, name, price) {
    e.preventDefault();
    cart.push({ name: name, price: price, id: Date.now() });
    saveCart();
    showToast('🛒 Added to cart: ' + name);
  };

  window.showCart = function(e) {
    e.preventDefault();
    if (cart.length === 0) {
      showToast('Your cart is empty');
      return;
    }
    var msg = cart.slice(0, 3).map(function(c) { return c.name; }).join(', ');
    if (cart.length > 3) msg += '…';
    showToast('Cart: ' + msg);
  };

  window.addToWishlist = function(e, name) {
    e.preventDefault();
    var btn = e.currentTarget;
    if (wishlist.includes(name)) {
      wishlist = wishlist.filter(function(n) { return n !== name; });
      btn.classList.remove('active');
      showToast('Removed from wishlist');
    } else {
      wishlist.push(name);
      btn.classList.add('active');
      showToast('❤️ Saved to wishlist: ' + name);
    }
    localStorage.setItem('yatok_wishlist', JSON.stringify(wishlist));
  };

  window.showWishlist = function(e) {
    e.preventDefault();
    if (wishlist.length === 0) {
      showToast('Your wishlist is empty');
      return;
    }
    showToast('❤️ Wishlist: ' + wishlist.slice(0, 2).join(', ') + (wishlist.length > 2 ? '…' : ''));
  };

  // Restore wishlist button states
  document.querySelectorAll('.ya-wish-btn').forEach(function(btn) {
    var card = btn.closest('.ya-car-card');
    if (!card) return;
    var h4 = card.querySelector('h4');
    if (h4 && wishlist.includes(h4.textContent.trim())) {
      btn.classList.add('active');
    }
  });

  // ── SEARCH ───────────────────────────────
  window.handleSearch = function(val) {
    // Future: filter cards dynamically
  };

  window.triggerSearch = function() {
    var val = document.getElementById('yaSearch').value.trim();
    if (val) showToast('🔍 Searching for: ' + val);
  };

  // ── CONTACT FORM ─────────────────────────
  window.sendMessage = function() {
    var name  = document.getElementById('contactName').value.trim();
    var email = document.getElementById('contactEmail').value.trim();
    var msg   = document.getElementById('contactMsg').value.trim();
    if (!name || !email || !msg) {
      showToast('⚠️ Please fill in all fields');
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      showToast('⚠️ Please enter a valid email');
      return;
    }
    showToast('✅ Message sent! We\'ll be in touch soon.');
    document.getElementById('contactName').value = '';
    document.getElementById('contactEmail').value = '';
    document.getElementById('contactMsg').value = '';
  };

  // ── NEWSLETTER ───────────────────────────
  window.subscribe = function() {
    var email = document.getElementById('nlEmail').value.trim();
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      showToast('⚠️ Enter a valid email address');
      return;
    }
    showToast('🎉 Subscribed! Welcome to Yatok.');
    document.getElementById('nlEmail').value = '';
  };

  // ── BRAND FILTER ─────────────────────────
  window.filterBrand = function(brand) {
    showToast('🔍 Filtering: ' + brand + ' vehicles');
    document.querySelectorAll('.ya-brand-pill').forEach(function(p) {
      p.classList.toggle('active', p.textContent.includes(brand));
    });
  };

  // ── TOAST ─────────────────────────────────
  var toastTimer;
  function showToast(msg) {
    var t = document.getElementById('yaToast');
    if (!t) return;
    clearTimeout(toastTimer);
    t.textContent = msg;
    t.classList.add('show');
    toastTimer = setTimeout(function() { t.classList.remove('show'); }, 3000);
  }

});
