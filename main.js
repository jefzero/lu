document.addEventListener('DOMContentLoaded', () => {
    // Menu toggle functionality
    const menuToggle = document.querySelector('.menu-toggle');
    const siteNav = document.querySelector('.site-nav');

    if (menuToggle && siteNav) {
        menuToggle.addEventListener('click', () => {
            const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
            menuToggle.setAttribute('aria-expanded', !isExpanded);
            siteNav.classList.toggle('active');
        });

        // Close menu when clicking on links
        siteNav.addEventListener('click', (e) => {
            if (e.target.tagName === 'A') {
                menuToggle.setAttribute('aria-expanded', 'false');
                siteNav.classList.remove('active');
            }
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!menuToggle.contains(e.target) && !siteNav.contains(e.target)) {
                menuToggle.setAttribute('aria-expanded', 'false');
                siteNav.classList.remove('active');
            }
        });
    }

    const testimonials = [
        {
            name: 'Maria S.',
            location: 'Sorocaba - SP',
            text: 'A Dra. Lu transformou minha jornada. Seu cuidado vai além do tratamento, ela realmente se importa com cada detalhe da minha vida.',
            rating: 5
        },
        {
            name: 'João P.',
            location: 'Votorantim - SP',
            text: 'Profissional excepcional. Me senti acolhido desde a primeira consulta. O tratamento foi personalizado e humano.',
            rating: 5
        },
        {
            name: 'Ana L.',
            location: 'Sorocaba - SP',
            text: 'Encontrei na Dra. Lu não apenas uma oncologista competente, mas alguém que tornou minha jornada mais leve e esperançosa.',
            rating: 5
        }
    ];

    let currentTestimonial = 0;
    let testimonialIntervalId;

    const testimonialText = document.getElementById('testimonial-text');
    const testimonialName = document.getElementById('testimonial-name');
    const testimonialLocation = document.getElementById('testimonial-location');
    const testimonialStars = document.getElementById('testimonial-stars');

    function generateStars(rating) {
        const filled = '★'.repeat(rating);
        const empty = '☆'.repeat(5 - rating);
        return `${filled}${empty}`;
    }

    function updateTestimonial() {
        const testimonial = testimonials[currentTestimonial];
        testimonialText.textContent = `"${testimonial.text}"`;
        testimonialName.textContent = testimonial.name;
        testimonialLocation.textContent = testimonial.location;
        testimonialStars.textContent = generateStars(testimonial.rating);
    }

    function showNextTestimonial() {
        currentTestimonial = (currentTestimonial + 1) % testimonials.length;
        updateTestimonial();
    }

    function showPreviousTestimonial() {
        currentTestimonial = (currentTestimonial - 1 + testimonials.length) % testimonials.length;
        updateTestimonial();
    }

    function startTestimonialRotation() {
        testimonialIntervalId = window.setInterval(showNextTestimonial, 6000);
    }

    function restartTestimonialRotation() {
        if (testimonialIntervalId) {
            window.clearInterval(testimonialIntervalId);
        }
        startTestimonialRotation();
    }

    const nextButton = document.querySelector('[data-action="next-testimonial"]');
    const prevButton = document.querySelector('[data-action="prev-testimonial"]');

    if (nextButton && prevButton) {
        nextButton.addEventListener('click', () => {
            showNextTestimonial();
            restartTestimonialRotation();
        });

        prevButton.addEventListener('click', () => {
            showPreviousTestimonial();
            restartTestimonialRotation();
        });
    }

    updateTestimonial();
    startTestimonialRotation();

    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const fadeObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                fadeObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.fade-in').forEach((element) => {
        fadeObserver.observe(element);
    });

    const header = document.querySelector('.site-header');

    function getHeaderOffset() {
        return header ? header.offsetHeight + 16 : 0;
    }

    function smoothScrollTo(target) {
        const element = document.querySelector(target);
        if (!element) return;
        const headerOffset = getHeaderOffset();
        const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
        window.scrollTo({
            top: elementPosition - headerOffset,
            behavior: 'smooth'
        });
    }

    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener('click', (event) => {
            const hash = anchor.getAttribute('href');
            if (!hash || hash === '#') return;
            const targetElement = document.querySelector(hash);
            if (!targetElement) return;

            event.preventDefault();
            smoothScrollTo(hash);

            const targetIsFocusAble = typeof targetElement.tabIndex === 'number' && targetElement.tabIndex >= 0;
            if (!targetIsFocusAble) {
                targetElement.setAttribute('tabindex', '-1');
            }
            targetElement.focus({ preventScroll: true });
        });
    });

    // Modal functionality
    const modal = document.getElementById('contact-modal');
    const contactForm = document.getElementById('contact-form');
    const formSuccess = document.getElementById('form-success');
    const formError = document.getElementById('form-error');

    // Open modal
    document.querySelectorAll('[data-open-modal]').forEach((button) => {
        button.addEventListener('click', () => {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
            // Focus on first input
            setTimeout(() => {
                document.getElementById('name').focus();
            }, 100);
        });
    });

    // Close modal
    document.querySelectorAll('[data-close-modal]').forEach((element) => {
        element.addEventListener('click', () => {
            modal.classList.remove('active');
            document.body.style.overflow = '';
            // Reset form and messages
            contactForm.reset();
            formSuccess.style.display = 'none';
            formError.style.display = 'none';
            contactForm.style.display = 'block';
        });
    });

    // Close modal on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
            contactForm.reset();
            formSuccess.style.display = 'none';
            formError.style.display = 'none';
            contactForm.style.display = 'block';
        }
    });

    // Handle form submission with Web3Forms
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const submitButton = contactForm.querySelector('button[type="submit"]');
            const originalText = submitButton.textContent;
            submitButton.textContent = 'Enviando...';
            submitButton.disabled = true;

            const formData = new FormData(contactForm);

            try {
                const response = await fetch('https://api.web3forms.com/submit', {
                    method: 'POST',
                    body: formData
                });

                const data = await response.json();

                if (data.success) {
                    contactForm.style.display = 'none';
                    formSuccess.style.display = 'block';
                    setTimeout(() => {
                        modal.classList.remove('active');
                        document.body.style.overflow = '';
                        setTimeout(() => {
                            contactForm.reset();
                            contactForm.style.display = 'block';
                            formSuccess.style.display = 'none';
                        }, 300);
                    }, 2000);
                } else {
                    formError.style.display = 'block';
                    setTimeout(() => {
                        formError.style.display = 'none';
                    }, 3000);
                }
            } catch (error) {
                formError.style.display = 'block';
                setTimeout(() => {
                    formError.style.display = 'none';
                }, 3000);
            } finally {
                submitButton.textContent = originalText;
                submitButton.disabled = false;
            }
        });
    }
});
