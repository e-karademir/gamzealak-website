// ============================================
// Dr. Gamze ALAK — Academic Portfolio Scripts
// ============================================

document.addEventListener('DOMContentLoaded', () => {

    // --- Navbar scroll effect ---
    const navbar = document.getElementById('navbar');
    const handleNavScroll = () => {
        if (window.scrollY > 40) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    };
    window.addEventListener('scroll', handleNavScroll, { passive: true });

    // --- Theme Toggle ---
    const themeToggleBtn = document.getElementById('themeToggle');

    // ODKAEP theme-sensitive logo switcher (uses data-light-src / data-dark-src attributes)
    const updateOdkaepLogo = (isDark) => {
        const img = document.getElementById('odkaep-main-logo');
        if (!img) return;
        img.src = isDark
            ? (img.dataset.darkSrc || img.src)
            : (img.dataset.lightSrc || img.src);
    };

    // Apply logo on initial load
    updateOdkaepLogo(document.documentElement.getAttribute('data-theme') === 'dark');

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

            if (newTheme === 'dark') {
                document.documentElement.setAttribute('data-theme', 'dark');
            } else {
                document.documentElement.removeAttribute('data-theme');
            }

            localStorage.setItem('theme', newTheme);
            updateOdkaepLogo(newTheme === 'dark');
        });
    }

    // --- Mobile nav toggle ---
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.getElementById('navLinks');

    navToggle.addEventListener('click', () => {
        navLinks.classList.toggle('open');
    });

    // Close mobile nav when a link is clicked
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('open');
        });
    });

    // --- Active nav link on scroll ---
    const sections = document.querySelectorAll('section[id]');
    const navAnchors = document.querySelectorAll('.nav-links a');

    const highlightNav = () => {
        const scrollY = window.scrollY + 120;

        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');

            if (scrollY >= top && scrollY < top + height) {
                navAnchors.forEach(a => {
                    a.classList.remove('active');
                    if (a.getAttribute('href') === `#${id}`) {
                        a.classList.add('active');
                    }
                });
            }
        });
    };

    window.addEventListener('scroll', highlightNav, { passive: true });

    // --- Scroll reveal animation ---
    const revealElements = () => {
        // Reveal sections
        const sectionHeaders = document.querySelectorAll('.section-header');
        const cards = document.querySelectorAll('.edu-card, .project-card, .contact-card, .pub-item, .course-chip');
        const timelineItems = document.querySelectorAll('.timeline-item');
        const aboutBlocks = document.querySelectorAll('.about-text, .research-areas');

        const allRevealable = [...sectionHeaders, ...cards, ...timelineItems, ...aboutBlocks];

        allRevealable.forEach(el => {
            if (!el.classList.contains('reveal')) {
                el.classList.add('reveal');
            }
        });

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, {
            threshold: 0.12,
            rootMargin: '0px 0px -40px 0px'
        });

        allRevealable.forEach(el => observer.observe(el));
    };

    revealElements();

    // --- Staggered animation for cards ---
    const staggerReveal = () => {
        const groups = document.querySelectorAll('.education-grid, .courses-grid, .contact-grid, .pub-list');

        groups.forEach(group => {
            const children = group.children;
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        Array.from(children).forEach((child, index) => {
                            setTimeout(() => {
                                child.classList.add('visible');
                            }, index * 80);
                        });
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.1 });

            observer.observe(group);
        });
    };

    staggerReveal();

    // --- WhatsApp One-time Popup ---
    const waPopup = document.getElementById('waPopup');
    const waPopupClose = document.getElementById('waPopupClose');
    const WA_POPUP_KEY = 'wa_popup_shown_v1';

    if (waPopup && !localStorage.getItem(WA_POPUP_KEY)) {
        // Show after 3 seconds
        const showTimer = setTimeout(() => {
            waPopup.classList.add('wa-popup--visible');

            // Auto-dismiss after 8 seconds
            const hideTimer = setTimeout(() => {
                dismissWaPopup();
            }, 8000);

            // Store timer ref for close button
            waPopup._hideTimer = hideTimer;
        }, 3000);

        function dismissWaPopup() {
            waPopup.classList.remove('wa-popup--visible');
            localStorage.setItem(WA_POPUP_KEY, 'true');
            if (waPopup._hideTimer) clearTimeout(waPopup._hideTimer);
        }

        if (waPopupClose) {
            waPopupClose.addEventListener('click', dismissWaPopup);
        }
    }

    // --- Hide Floating WhatsApp in Contact Section ---
    const contactSection = document.getElementById('contact');
    const waBtn = document.getElementById('waBtn');
    
    if (contactSection && waBtn) {
        const contactObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Contact section is visible, hide floating button
                    waBtn.style.opacity = '0';
                    waBtn.style.pointerEvents = 'none';
                    waBtn.style.transform = 'translateY(20px)';
                } else {
                    // Contact section is out of view, show floating button
                    waBtn.style.opacity = '1';
                    waBtn.style.pointerEvents = 'auto';
                    waBtn.style.transform = 'translateY(0)';
                }
            });
        }, {
            threshold: 0.1 // Trigger when 10% of contact section is visible
        });

        contactObserver.observe(contactSection);
        
        // Ensure transition on floating button for smooth hide/show
        waBtn.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    }

    // --- Wikipedia Modal Logic ---
    const wikiModal = document.getElementById('wikiModal');
    const wikiModalOverlay = document.getElementById('wikiModalOverlay');
    const wikiModalClose = document.getElementById('wikiModalClose');
    const wikiContent = document.getElementById('wikiContent');
    const wikiTitle = document.getElementById('wikiTitle');
    const wikiReadMore = document.getElementById('wikiReadMore');
    const courseChips = document.querySelectorAll('.course-chip, .wiki-trigger');

    if (wikiModal && courseChips.length > 0) {
        const closeWikiModal = () => {
            wikiModal.classList.remove('active');
            setTimeout(() => {
                wikiContent.innerHTML = ''; // Clear after fade out
            }, 300);
        };

        wikiModalClose.addEventListener('click', closeWikiModal);
        wikiModalOverlay.addEventListener('click', closeWikiModal);

        courseChips.forEach(chip => {
            chip.addEventListener('click', async () => {
                const wikiTerm = chip.getAttribute('data-wiki');
                const courseName = chip.textContent;

                if (!wikiTerm) return;

                // Show modal and loading state
                wikiTitle.textContent = courseName;
                wikiReadMore.style.display = 'none'; // hide link while loading
                wikiContent.innerHTML = `
                    <div class="wiki-loading">
                        <div class="wiki-skeleton title"></div>
                        <div class="wiki-skeleton line-1"></div>
                        <div class="wiki-skeleton line-2"></div>
                        <div class="wiki-skeleton line-3"></div>
                    </div>
                `;
                wikiModal.classList.add('active');

                try {
                    const response = await fetch(`https://tr.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(wikiTerm)}`);
                    
                    if (!response.ok) {
                        throw new Error('Wikipedia sayfası bulunamadı.');
                    }

                    const data = await response.json();

                    // Inject content
                    if (data.extract_html) {
                        wikiContent.innerHTML = data.extract_html;
                    } else {
                        wikiContent.innerHTML = '<p>Bu konu hakkında Vikipedi özeti bulunamadı.</p>';
                    }

                    // Setup read more link
                    if (data.content_urls && data.content_urls.desktop) {
                        wikiReadMore.href = data.content_urls.desktop.page;
                        wikiReadMore.style.display = 'inline-flex';
                    }

                } catch (error) {
                    wikiContent.innerHTML = `
                        <p style="color: var(--clr-accent);">
                            <strong>Bilgi alınamadı.</strong><br>
                            Şu an için "${courseName}" hakkında Vikipedi verisine ulaşılamıyor veya bağlantı hatası oluştu.
                        </p>
                    `;
                    wikiReadMore.href = `https://tr.wikipedia.org/w/index.php?search=${encodeURIComponent(wikiTerm)}`;
                    wikiReadMore.style.display = 'inline-flex';
                }
            });
        });
    }
    // --- Publications Modal Logic ---
    const pubsModal = document.getElementById('pubsModal');
    const openPubsBtn = document.getElementById('openPubsModal');
    const pubsModalClose = document.getElementById('pubsModalClose');
    const pubsModalOverlay = document.getElementById('pubsModalOverlay');

    if (pubsModal && openPubsBtn) {
        const closePubsModal = () => {
            pubsModal.classList.remove('active');
        };

        openPubsBtn.addEventListener('click', (e) => {
            e.preventDefault();
            pubsModal.classList.add('active');
        });

        if (pubsModalClose) pubsModalClose.addEventListener('click', closePubsModal);
        if (pubsModalOverlay) pubsModalOverlay.addEventListener('click', closePubsModal);
    }
});

// Book Tooltip Logic
document.addEventListener('DOMContentLoaded', () => {
    const bookMockups = document.querySelectorAll('.book-mockup');
    const bookTooltip = document.getElementById('book-tooltip');
    if (bookTooltip && bookMockups.length > 0) {
        const titleEl = bookTooltip.querySelector('.book-tooltip-title');
        const descEl = bookTooltip.querySelector('.book-tooltip-desc');
        
        bookMockups.forEach(book => {
            book.addEventListener('mouseenter', () => {
                if(titleEl) titleEl.textContent = book.getAttribute('data-title');
                if(descEl) descEl.textContent = book.getAttribute('data-desc');
                bookTooltip.classList.add('visible');
            });
            book.addEventListener('mouseleave', () => {
                bookTooltip.classList.remove('visible');
            });
        });
    }
});

// Mobile Menu Toggle
document.addEventListener('DOMContentLoaded', () => {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navLinks = document.getElementById('navLinks');
    
    if(mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
        
        // Close menu when a link is clicked
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
            });
        });
    }
});
