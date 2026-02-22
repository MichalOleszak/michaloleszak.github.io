// Modern Beautiful Jekyll | Vanilla JS (no jQuery)

var main = {
  bigImgEl: null,
  numImgs: null,

  init: function () {
    // Navbar shrink on scroll
    var navbar = document.querySelector('.navbar');
    var avatarContainer = document.querySelector('.navbar-custom .avatar-container');

    if (navbar) {
      window.addEventListener('scroll', function () {
        if (window.scrollY > 50) {
          navbar.classList.add('top-nav-short');
          if (avatarContainer) avatarContainer.style.opacity = '0';
        } else {
          navbar.classList.remove('top-nav-short');
          if (avatarContainer) avatarContainer.style.opacity = '1';
        }
      });
    }

    // On mobile, hide avatar when navbar expands
    var mainNavbar = document.getElementById('main-navbar');
    if (mainNavbar) {
      mainNavbar.addEventListener('show.bs.collapse', function () {
        if (navbar) navbar.classList.add('top-nav-expanded');
      });
      mainNavbar.addEventListener('hidden.bs.collapse', function () {
        if (navbar) navbar.classList.remove('top-nav-expanded');
      });
    }

    // Dark mode toggle
    main.initThemeToggle();

    // Show big header images
    main.initImgs();
  },

  initThemeToggle: function () {
    var toggle = document.getElementById('theme-toggle');
    var icon = document.getElementById('theme-icon');
    var html = document.documentElement;

    // Check for saved preference or system preference
    var savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      html.setAttribute('data-bs-theme', savedTheme);
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      html.setAttribute('data-bs-theme', 'dark');
    }

    // Update icon based on current theme
    main.updateThemeIcon(icon);

    if (toggle) {
      toggle.addEventListener('click', function () {
        var current = html.getAttribute('data-bs-theme');
        var next = current === 'dark' ? 'light' : 'dark';
        html.setAttribute('data-bs-theme', next);
        localStorage.setItem('theme', next);
        main.updateThemeIcon(icon);
      });
    }

    // Listen for system theme changes
    if (window.matchMedia) {
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function (e) {
        if (!localStorage.getItem('theme')) {
          html.setAttribute('data-bs-theme', e.matches ? 'dark' : 'light');
          main.updateThemeIcon(icon);
        }
      });
    }
  },

  updateThemeIcon: function (icon) {
    if (!icon) return;
    var isDark = document.documentElement.getAttribute('data-bs-theme') === 'dark';
    icon.className = isDark ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
  },

  initImgs: function () {
    var headerBigImgs = document.getElementById('header-big-imgs');
    if (!headerBigImgs) return;

    main.bigImgEl = headerBigImgs;
    main.numImgs = parseInt(main.bigImgEl.getAttribute('data-num-img'));

    var imgInfo = main.getImgInfo();
    main.setImg(imgInfo.src, imgInfo.desc);

    // If multiple images, cycle through them
    if (main.numImgs > 1) {
      var getNextImg = function () {
        var imgInfo = main.getImgInfo();
        var src = imgInfo.src;
        var desc = imgInfo.desc;

        var prefetchImg = new Image();
        prefetchImg.src = src;

        setTimeout(function () {
          var img = document.createElement('div');
          img.className = 'big-img-transition';
          img.style.backgroundImage = 'url(' + src + ')';

          var introHeader = document.querySelector('.intro-header.big-img');
          if (introHeader) {
            introHeader.insertBefore(img, introHeader.firstChild);
            setTimeout(function () { img.style.opacity = '1'; }, 50);

            setTimeout(function () {
              main.setImg(src, desc);
              img.remove();
              getNextImg();
            }, 1000);
          }
        }, 6000);
      };

      getNextImg();
    }
  },

  getImgInfo: function () {
    var randNum = Math.floor(Math.random() * main.numImgs) + 1;
    var src = main.bigImgEl.getAttribute('data-img-src-' + randNum);
    var desc = main.bigImgEl.getAttribute('data-img-desc-' + randNum);
    return { src: src, desc: desc };
  },

  setImg: function (src, desc) {
    var introHeader = document.querySelector('.intro-header.big-img');
    if (introHeader) {
      introHeader.style.backgroundImage = 'url(' + src + ')';
    }
    var imgDesc = document.querySelector('.img-desc');
    if (imgDesc) {
      if (desc) {
        imgDesc.textContent = desc;
        imgDesc.style.display = 'block';
      } else {
        imgDesc.style.display = 'none';
      }
    }
  }
};

document.addEventListener('DOMContentLoaded', main.init);
