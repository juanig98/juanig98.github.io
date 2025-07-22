(function () {
    'use strict';

    const isMobile = {
        Android: () => /Android/i.test(navigator.userAgent),
        BlackBerry: () => /BlackBerry/i.test(navigator.userAgent),
        iOS: () => /iPhone|iPad|iPod/i.test(navigator.userAgent),
        Opera: () => /Opera Mini/i.test(navigator.userAgent),
        Windows: () => /IEMobile/i.test(navigator.userAgent),
        any: function () {
            return this.Android() || this.BlackBerry() || this.iOS() || this.Opera() || this.Windows();
        }
    };

    const fullHeight = () => {
        if (!isMobile.any()) {
            const setHeight = () => {
                document.querySelectorAll('.js-fullheight').forEach(el => {
                    el.style.height = `${window.innerHeight}px`;
                });
            };
            setHeight();
            window.addEventListener('resize', setHeight);
        }
    };

    // El contador y animaciones requieren plugins (countTo, Waypoints, Flexslider, OwlCarousel, Sticky-kit)
    // Como se pidió una versión vanilla, estos se omiten o se requieren reemplazar con lógica personalizada

    const burgerMenu = () => {
        document.querySelectorAll('.js-colorlib-nav-toggle').forEach(toggle => {
            toggle.addEventListener('click', (event) => {
                event.preventDefault();
                document.body.classList.toggle('offcanvas');
                toggle.classList.toggle('active');
            });
        });
    };

    const mobileMenuOutsideClick = () => {
        document.addEventListener('click', (e) => {
            const container = document.querySelector('#colorlib-aside');
            const toggle = document.querySelector('.js-colorlib-nav-toggle');

            if (!container.contains(e.target) && !toggle.contains(e.target)) {
                document.body.classList.remove('offcanvas');
                toggle.classList.remove('active');
            }
        });

        window.addEventListener('scroll', () => {
            const toggle = document.querySelector('.js-colorlib-nav-toggle');
            if (document.body.classList.contains('offcanvas')) {
                document.body.classList.remove('offcanvas');
                toggle.classList.remove('active');
            }
        });
    };

    const clickMenu = () => {
        document.querySelectorAll('#navbar a:not(.external)').forEach(link => {
            link.addEventListener('click', (event) => {
                event.preventDefault();
                const section = link.getAttribute('data-nav-section');
                const target = document.querySelector(`[data-section="${section}"]`);
                if (target) {
                    window.scrollTo({
                        top: target.offsetTop - 55,
                        behavior: 'smooth'
                    });
                }

                const navbar = document.getElementById('navbar');
                if (navbar && window.getComputedStyle(navbar).display !== 'none') {
                    navbar.classList.remove('in');
                    navbar.setAttribute('aria-expanded', 'false');
                    const navToggle = document.querySelector('.js-colorlib-nav-toggle');
                    if (navToggle) navToggle.classList.remove('active');
                }
            });
        });
    };

    const shareButtons = document.querySelectorAll('.shareButton');
    shareButtons.forEach(button => {
        button.addEventListener('click', (evt) => {
            evt.preventDefault();
            const project = evt.currentTarget;
            const url = project.getAttribute('data-url');
            const title = project.getAttribute('data-title');

            if (navigator.share) {
                navigator.share({ title, text: title, url })
                    .catch(error => console.error('Error al compartir:', error));
            } else {
                alert('La funcionalidad para compartir no está soportada en tu navegador.');
            }
        });
    });


    // Counter function
    function counter(el, duration = 2000) {
        if (el && el.dataset && el.dataset.to) {

            const end = parseFloat(el.dataset.to);
            const decimals = parseInt(el.dataset.decimals) || 0;
            const start = 0;
            const startTime = performance.now();

            function update(currentTime) {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const current = (progress * end).toFixed(decimals);
                el.textContent = current;

                if (progress < 1) {
                    requestAnimationFrame(update);
                }
            }

            requestAnimationFrame(update);
        }
    }

    // Counter on intersection
    function counterWayPoint() {
        const el = document.querySelector('#colorlib-counter');
        if (!el) return;

        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !el.classList.contains('animated')) {
                    const counters = el.querySelectorAll('.js-counter');
                    setTimeout(() => {
                        counters.forEach(counter => animateCounter(counter));
                    }, 400);
                    el.classList.add('animated');
                    obs.unobserve(el);
                }
            });
        }, { threshold: 0.1 });

        observer.observe(el);
    }

    // Animation on scroll
    function contentWayPoint() {
        const items = document.querySelectorAll('.animate-box');
        let i = 0;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
                    i++;
                    entry.target.classList.add('animated');
                    setTimeout(() => {
                        document.querySelectorAll('.animate-box.item-animate').forEach((el, k) => {
                            setTimeout(() => {
                                const effect = el.dataset.animateEffect;
                                switch (effect) {
                                    case 'fadeIn': el.classList.add('fadeIn', 'animated'); break;
                                    case 'fadeInLeft': el.classList.add('fadeInLeft', 'animated'); break;
                                    case 'fadeInRight': el.classList.add('fadeInRight', 'animated'); break;
                                    default: el.classList.add('fadeInUp', 'animated'); break;
                                }
                                el.classList.remove('item-animate');
                            }, k * 200);
                        });
                    }, 100);
                }
            });
        }, { threshold: 0.15 });

        items.forEach(item => observer.observe(item));
    }
    // Ejecutar funciones disponibles
    document.addEventListener('DOMContentLoaded', () => {
        fullHeight();
        burgerMenu();
        clickMenu();
        mobileMenuOutsideClick();
        counterWayPoint();
        contentWayPoint();
    });

})();
