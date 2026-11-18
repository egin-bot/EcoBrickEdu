document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    const headerEl = document.querySelector('header');

    if (hamburger && navMenu && headerEl) {
        /** @param {boolean} isOpen */
        function setMenuOpen(isOpen) {
            if (!hamburger || !navMenu) {
                return;
            }
            hamburger.classList.toggle('active', isOpen);
            navMenu.classList.toggle('active', isOpen);
            hamburger.setAttribute('aria-expanded', String(isOpen));
            hamburger.setAttribute('aria-label', isOpen ? 'Tutup menu navigasi' : 'Buka menu navigasi');
        }

        hamburger.addEventListener('click', () => {
            setMenuOpen(!navMenu.classList.contains('active'));
        });

        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => setMenuOpen(false));
        });

        document.addEventListener('click', (event) => {
            if (navMenu.classList.contains('active') && (!(event.target instanceof Node) || !headerEl.contains(event.target))) {
                setMenuOpen(false);
            }
        });

        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && navMenu.classList.contains('active')) {
                setMenuOpen(false);
                hamburger.focus();
            }
        });

        const desktopNavQuery = window.matchMedia && window.matchMedia('(min-width: 900px)');
        if (desktopNavQuery && typeof desktopNavQuery.addEventListener === 'function') {
            desktopNavQuery.addEventListener('change', (event) => {
                if (event.matches && navMenu.classList.contains('active')) {
                    setMenuOpen(false);
                }
            });
        }
    }

    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        /** @param {string} theme */
        const syncThemeButton = (theme) => {
            const isDark = theme === 'dark';
            themeToggle.setAttribute('aria-pressed', String(isDark));
            themeToggle.setAttribute('aria-label', isDark ? 'Aktifkan mode terang' : 'Aktifkan mode gelap');
        };

        syncThemeButton(document.documentElement.getAttribute('data-theme') || 'light');

        themeToggle.addEventListener('click', () => {
            const nextTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme', nextTheme);
            syncThemeButton(nextTheme);
            try {
                localStorage.setItem('ecobrickedu-theme', nextTheme);
            } catch (_) {
                // Ignore storage failures in restricted contexts.
            }
        });
    }

    const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const winAny = /** @type {any} */ (window);
    const gsapGlobal = winAny.gsap;
    const scrollTriggerGlobal = winAny.ScrollTrigger;

    /**
     * Split element words into spans while preserving full heading accessibility via aria-label.
     * @param {Element} container
     */
    const splitWords = (container) => {
        const text = (container.textContent || '').trim();
        if (!text) {
            return [];
        }
        const words = text.split(/\s+/);
        container.textContent = '';
        /** @type {HTMLSpanElement[]} */
        const spans = [];
        words.forEach((word, idx) => {
            const span = document.createElement('span');
            span.className = 'split-word';
            span.setAttribute('aria-hidden', 'true');
            span.textContent = word;
            container.appendChild(span);
            spans.push(span);
            if (idx < words.length - 1) {
                container.appendChild(document.createTextNode(' '));
            }
        });
        return spans;
    };

    if (!prefersReducedMotion && gsapGlobal) {
        document.documentElement.classList.add('gsap-active');
        if (scrollTriggerGlobal && typeof gsapGlobal.registerPlugin === 'function') {
            gsapGlobal.registerPlugin(scrollTriggerGlobal);
        }

        const heroEl = document.querySelector('.hero');
        if (heroEl) {
            const heroTl = gsapGlobal.timeline({ defaults: { ease: 'power3.out' } });
            const breadcrumb = heroEl.querySelector('.hero-breadcrumb');
            const heading = heroEl.querySelector('h1');
            const lines = heroEl.querySelectorAll('.hero-line');
            const accent = heroEl.querySelector('.hero-accent');
            const lead = heroEl.querySelector('p');
            const actions = heroEl.querySelector('.hero-actions');
            const metricCards = heroEl.querySelectorAll('.hero-metric-card');

            if (heading && !heading.getAttribute('aria-label')) {
                heading.setAttribute('aria-label', (heading.textContent || '').replace(/\s+/g, ' ').trim());
            }

            if (breadcrumb) {
                heroTl.fromTo(breadcrumb, { y: 10, opacity: 0 }, { y: 0, opacity: 1, duration: 0.35, clearProps: 'transform,opacity' }, 0);
            }

            if (lines.length > 0) {
                /** @type {HTMLSpanElement[]} */
                const heroWords = [];
                lines.forEach(line => {
                    heroWords.push(...splitWords(line));
                });
                heroTl.fromTo(
                    heroWords,
                    { y: 24, opacity: 0, rotateX: -18 },
                    { y: 0, opacity: 1, rotateX: 0, duration: 0.54, stagger: 0.055, clearProps: 'transform,opacity' },
                    breadcrumb ? 0.08 : 0
                );
            }

            if (accent) {
                heroTl.fromTo(accent, { '--accent-scale': 0 }, { '--accent-scale': 1, duration: 0.45 }, 0.38);
            }

            if (lead) {
                heroTl.fromTo(
                    lead,
                    { y: 14, opacity: 0, filter: 'blur(7px)' },
                    { y: 0, opacity: 1, filter: 'blur(0px)', duration: 0.52, clearProps: 'filter,transform,opacity' },
                    0.26
                );
            }

            if (actions) {
                heroTl.fromTo(actions, { y: 12, opacity: 0 }, { y: 0, opacity: 1, duration: 0.42, clearProps: 'transform,opacity' }, 0.36);
            }

            if (metricCards.length > 0) {
                heroTl.fromTo(
                    metricCards,
                    { y: 16, opacity: 0, scale: 0.96 },
                    { y: 0, opacity: 1, scale: 1, duration: 0.44, stagger: 0.08, clearProps: 'transform,opacity' },
                    0.3
                );
            }
        }

        if (scrollTriggerGlobal) {
            const heroContent = document.querySelector('.hero-home .hero-content');
            if (heroContent) {
                gsapGlobal.to(heroContent, {
                    y: -36,
                    opacity: 0.35,
                    ease: 'none',
                    scrollTrigger: {
                        trigger: '.hero-home',
                        start: 'top top',
                        end: 'bottom top',
                        scrub: true
                    }
                });
            }

            if (headerEl) {
                scrollTriggerGlobal.create({
                    start: 24,
                    onEnter: () => headerEl.classList.add('is-scrolled'),
                    onLeaveBack: () => headerEl.classList.remove('is-scrolled')
                });
            }

            const isNarrow = window.matchMedia && window.matchMedia('(max-width: 799px)').matches;

            /**
             * Split non-SVG text nodes of a heading into word spans for ScrollReveal without altering icons.
             * @param {Element} heading
             */
            const splitHeadingWords = (heading) => {
                const fullText = (heading.textContent || '').replace(/\s+/g, ' ').trim();
                if (!fullText) {
                    return [];
                }
                if (!heading.getAttribute('aria-label')) {
                    heading.setAttribute('aria-label', fullText);
                }

                /** @type {Text[]} */
                const textNodes = [];
                const walker = document.createTreeWalker(heading, NodeFilter.SHOW_TEXT, {
                    acceptNode: (node) => {
                        const parent = node.parentElement;
                        if (!parent || parent.closest('svg, .section-icon')) {
                            return NodeFilter.FILTER_REJECT;
                        }
                        return /\S/.test(node.nodeValue || '') ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
                    }
                });
                let currentNode = walker.nextNode();
                while (currentNode) {
                    textNodes.push(/** @type {Text} */ (currentNode));
                    currentNode = walker.nextNode();
                }

                /** @type {HTMLSpanElement[]} */
                const spans = [];
                textNodes.forEach(textNode => {
                    const frag = document.createDocumentFragment();
                    const parts = (textNode.nodeValue || '').split(/(\s+)/);
                    parts.forEach(part => {
                        if (!part) {
                            return;
                        }
                        if (/^\s+$/.test(part)) {
                            frag.appendChild(document.createTextNode(part));
                        } else {
                            const span = document.createElement('span');
                            span.className = 'sr-word';
                            span.setAttribute('aria-hidden', 'true');
                            span.textContent = part;
                            frag.appendChild(span);
                            spans.push(span);
                        }
                    });
                    textNode.replaceWith(frag);
                });
                return spans;
            };

            document.querySelectorAll('main h2:not(.sr-only), main h3:not(#modalTitle), main .chart-caption').forEach(heading => {
                const words = splitHeadingWords(heading);
                const iconBox = heading.querySelector('.section-icon, svg');
                if (iconBox && heading.tagName === 'H2') {
                    gsapGlobal.fromTo(
                        iconBox,
                        { scale: 0.72, rotate: -10, opacity: 0 },
                        {
                            scale: 1,
                            rotate: 0,
                            opacity: 1,
                            duration: 0.45,
                            ease: 'back.out(1.8)',
                            clearProps: 'transform,opacity',
                            scrollTrigger: { trigger: heading, start: 'top 94%', once: true }
                        }
                    );
                }
                if (words.length > 0) {
                    gsapGlobal.fromTo(
                        words,
                        { opacity: 0.14, y: 14, rotateZ: 1.5, filter: 'blur(5px)' },
                        {
                            opacity: 1,
                            y: 0,
                            rotateZ: 0,
                            filter: 'blur(0px)',
                            duration: 0.58,
                            stagger: 0.042,
                            ease: 'power2.out',
                            clearProps: 'transform,opacity,filter',
                            scrollTrigger: { trigger: heading, start: 'top 94%', once: true }
                        }
                    );
                }
            });

            document.querySelectorAll('[data-animated-content], [data-gsap="fade-up"], [data-gsap="zoom-in"], [data-gsap="fade-right"], [data-gsap="fade-left"]').forEach(el => {
                const legacyMode = el.getAttribute('data-gsap');
                let direction = el.getAttribute('data-direction') || 'vertical';
                let reverse = el.getAttribute('data-reverse') === 'true';
                let distance = Number(el.getAttribute('data-distance') || '28');
                let scale = Number(el.getAttribute('data-scale') || '1');
                const duration = Number(el.getAttribute('data-duration') || '0.62');
                const delay = Number(el.getAttribute('data-delay') || el.getAttribute('data-gsap-delay') || '0');
                const startPos = el.getAttribute('data-start') || (el.tagName === 'FOOTER' ? 'top 98%' : 'top 94%');

                if (legacyMode === 'zoom-in') {
                    scale = 0.94;
                    distance = 18;
                } else if (legacyMode === 'fade-right') {
                    direction = 'horizontal';
                    reverse = true;
                } else if (legacyMode === 'fade-left') {
                    direction = 'horizontal';
                    reverse = false;
                }

                const useHorizontal = direction === 'horizontal' && !isNarrow;
                const offset = reverse ? -distance : distance;
                /** @type {Record<string, any>} */
                const fromVars = {
                    opacity: 0,
                    scale,
                    x: useHorizontal ? offset : 0,
                    y: useHorizontal ? 0 : distance
                };

                gsapGlobal.fromTo(el, fromVars, {
                    opacity: 1,
                    scale: 1,
                    x: 0,
                    y: 0,
                    duration,
                    delay,
                    ease: 'power3.out',
                    clearProps: 'transform,opacity',
                    scrollTrigger: {
                        trigger: el,
                        start: startPos,
                        once: true
                    }
                });
            });

            document.querySelectorAll('[data-animated-stagger], .stat-list, .page-navigation-grid, .step-list, .gallery-grid').forEach(container => {
                const items = container.querySelectorAll('[data-animated-item], [data-gsap="stagger"]');
                if (items.length === 0) {
                    return;
                }
                const staggerGap = Number(container.getAttribute('data-stagger') || '0.075');
                gsapGlobal.fromTo(
                    items,
                    { y: 22, scale: 0.97, opacity: 0 },
                    {
                        y: 0,
                        scale: 1,
                        opacity: 1,
                        duration: 0.52,
                        stagger: staggerGap,
                        ease: 'power2.out',
                        clearProps: 'transform,opacity',
                        scrollTrigger: {
                            trigger: container,
                            start: 'top 92%',
                            once: true
                        }
                    }
                );
            });

            document.querySelectorAll('[data-countup]').forEach(el => {
                const target = parseFloat(el.getAttribute('data-countup') || '');
                if (!Number.isFinite(target)) {
                    return;
                }
                const decimals = Number(el.getAttribute('data-decimals') || '0');
                const suffix = el.getAttribute('data-suffix') || '';
                const useComma = el.getAttribute('data-comma') === 'true';
                const proxy = { val: 0 };
                const formatNum = (num) => {
                    const str = num.toFixed(decimals);
                    return (useComma ? str.replace('.', ',') : str) + suffix;
                };
                gsapGlobal.to(proxy, {
                    val: target,
                    duration: 0.9,
                    ease: 'power2.out',
                    onUpdate: () => {
                        el.textContent = formatNum(proxy.val);
                    },
                    onComplete: () => {
                        el.textContent = formatNum(target);
                    },
                    scrollTrigger: {
                        trigger: el,
                        start: 'top 92%',
                        once: true
                    }
                });
            });

            const refreshTriggers = () => {
                scrollTriggerGlobal.refresh();
            };
            window.addEventListener('hashchange', refreshTriggers);
            window.addEventListener('load', refreshTriggers);
        }

        const finePointer = window.matchMedia && window.matchMedia('(hover: hover) and (pointer: fine)').matches;
        if (finePointer) {
            document.querySelectorAll('[data-spotlight]').forEach(card => {
                if (!(card instanceof HTMLElement)) {
                    return;
                }
                card.addEventListener('pointermove', (e) => {
                    const rect = card.getBoundingClientRect();
                    card.style.setProperty('--spot-x', `${(e.clientX - rect.left).toFixed(1)}px`);
                    card.style.setProperty('--spot-y', `${(e.clientY - rect.top).toFixed(1)}px`);
                    card.style.setProperty('--spot-opacity', '1');
                });
                card.addEventListener('pointerleave', () => {
                    card.style.setProperty('--spot-opacity', '0');
                });
            });

            document.querySelectorAll('[data-magnet]').forEach(btn => {
                if (!(btn instanceof HTMLElement)) {
                    return;
                }
                const xTo = gsapGlobal.quickTo(btn, 'x', { duration: 0.3, ease: 'power3.out' });
                const yTo = gsapGlobal.quickTo(btn, 'y', { duration: 0.3, ease: 'power3.out' });
                btn.addEventListener('pointermove', (e) => {
                    const rect = btn.getBoundingClientRect();
                    const dx = (e.clientX - (rect.left + rect.width / 2)) * 0.14;
                    const dy = (e.clientY - (rect.top + rect.height / 2)) * 0.22;
                    xTo(Math.max(-8, Math.min(8, dx)));
                    yTo(Math.max(-6, Math.min(6, dy)));
                });
                btn.addEventListener('pointerleave', () => {
                    gsapGlobal.to(btn, { x: 0, y: 0, duration: 0.45, ease: 'elastic.out(1, 0.45)', overwrite: 'auto' });
                });
            });
        }
    }

    document.documentElement.classList.remove('gsap-prep');
});
