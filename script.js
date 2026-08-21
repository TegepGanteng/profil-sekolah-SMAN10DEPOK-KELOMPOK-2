/* ==========================================================================
   SMAN 10 DEPOK - SCRIPT INTERAKTIF MODERN & FUTURISTIK (script.js)
   Fitur Utama:
   1. Interactive Particle Network Canvas
   2. Custom Glowing Mouse Cursor & Trail
   3. 3D Card Parallax Tilt Effect
   4. Dynamic Typing Effect Tagline
   5. Magnetic Button Effect
   6. Ripple Click Effect
   7. Smooth Intersection Observer (Scroll Reveal)
   8. Eased Animated Counter
   9. Confetti Particle Burst pada Form Submit
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
       1. CANVAS PARTICLES INTERACTIVE BACKGROUND (Header & Background Glow)
       ========================================================================== */
    const initParticleCanvas = () => {
        const header = document.querySelector('.top-header');
        if (!header) return;

        const canvas = document.createElement('canvas');
        canvas.id = 'particle-canvas';
        canvas.style.position = 'absolute';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        canvas.style.pointerEvents = 'none';
        canvas.style.zIndex = '0';
        header.style.position = 'relative';
        header.insertBefore(canvas, header.firstChild);

        const ctx = canvas.getContext('2d');
        let width = canvas.width = header.offsetWidth;
        let height = canvas.height = header.offsetHeight;

        let particles = [];
        const particleCount = Math.floor(width / 20);

        class Particle {
            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.vx = (Math.random() - 0.5) * 0.8;
                this.vy = (Math.random() - 0.5) * 0.8;
                this.radius = Math.random() * 2 + 1;
                this.alpha = Math.random() * 0.5 + 0.2;
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;

                if (this.x < 0 || this.x > width) this.vx *= -1;
                if (this.y < 0 || this.y > height) this.vy *= -1;
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255, 255, 255, ${this.alpha})`;
                ctx.fill();
            }
        }

        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }

        const animate = () => {
            ctx.clearRect(0, 0, width, height);

            // Draw connecting lines
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < 100) {
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.strokeStyle = `rgba(255, 255, 255, ${0.25 - dist / 400})`;
                        ctx.lineWidth = 0.6;
                        ctx.stroke();
                    }
                }
            }

            particles.forEach(p => {
                p.update();
                p.draw();
            });

            requestAnimationFrame(animate);
        };

        animate();

        window.addEventListener('resize', () => {
            width = canvas.width = header.offsetWidth;
            height = canvas.height = header.offsetHeight;
        });
    };
    initParticleCanvas();


    /* ==========================================================================
       2. CUSTOM GLOWING CURSOR TRAIL (Efek Cahaya Mengikuti Kursor)
       ========================================================================== */
    const initCustomCursor = () => {
        const cursorGlow = document.createElement('div');
        cursorGlow.classList.add('cursor-glow');
        document.body.appendChild(cursorGlow);

        // Inject Styles untuk Cursor
        const style = document.createElement('style');
        style.innerHTML = `
            .cursor-glow {
                position: fixed;
                width: 300px;
                height: 300px;
                background: radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, rgba(245, 158, 11, 0.05) 40%, transparent 70%);
                border-radius: 50%;
                pointer-events: none;
                transform: translate(-50%, -50%);
                transition: transform 0.1s ease-out, opacity 0.3s ease;
                z-index: 9999;
                mix-blend-mode: screen;
            }
        `;
        document.head.appendChild(style);

        let mouseX = 0, mouseY = 0;
        let cursorX = 0, cursorY = 0;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        const renderCursor = () => {
            cursorX += (mouseX - cursorX) * 0.1;
            cursorY += (mouseY - cursorY) * 0.1;
            cursorGlow.style.left = `${cursorX}px`;
            cursorGlow.style.top = `${cursorY}px`;
            requestAnimationFrame(renderCursor);
        };
        renderCursor();
    };
    initCustomCursor();


    /* ==========================================================================
       3. 3D TILT EFFECT PADA KARTU (Efek Kemiringan 3D saat Mouse Hover)
       ========================================================================== */
    const cards = document.querySelectorAll('.card, .kelompok-info');
    cards.forEach(card => {
        card.style.transition = 'transform 0.15s ease-out, box-shadow 0.3s ease';

        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            const rotateX = (-y / rect.height) * 12; // derajat kemiringan X
            const rotateY = (x / rect.width) * 12;  // derajat kemiringan Y

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
        });
    });


    /* ==========================================================================
       4. DYNAMIC TYPING EFFECT (Pengetikan Otomatis pada Tagline)
       ========================================================================== */
    const tagline = document.querySelector('.brand-text p');
    if (tagline) {
        const text = tagline.innerText;
        tagline.innerText = '';
        let i = 0;

        const typeWriter = () => {
            if (i < text.length) {
                tagline.innerHTML += text.charAt(i);
                i++;
                setTimeout(typeWriter, 35);
            }
        };
        setTimeout(typeWriter, 500);
    }


    /* ==========================================================================
       5. MAGNETIC BUTTONS (Efek Tombol Tertarik oleh Kursor)
       ========================================================================== */
    const magneticBtns = document.querySelectorAll('.btn-submit, .navbar a');
    magneticBtns.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            btn.style.transform = `translate(${x * 0.25}px, ${y * 0.25}px)`;
        });

        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'translate(0px, 0px)';
        });
    });


    /* ==========================================================================
       6. RIPPLE CLICK EFFECT (Efek Gelombang Air Saat Diklik)
       ========================================================================== */
    document.querySelectorAll('.btn-submit, .navbar a').forEach(button => {
        button.addEventListener('click', function (e) {
            const circle = document.createElement('span');
            const diameter = Math.max(this.clientWidth, this.clientHeight);
            const radius = diameter / 2;

            const rect = this.getBoundingClientRect();
            circle.style.width = circle.style.height = `${diameter}px`;
            circle.style.left = `${e.clientX - rect.left - radius}px`;
            circle.style.top = `${e.clientY - rect.top - radius}px`;
            circle.classList.add('ripple');

            const rippleStyle = document.createElement('style');
            rippleStyle.innerHTML = `
                .ripple {
                    position: absolute;
                    background: rgba(255, 255, 255, 0.4);
                    border-radius: 50%;
                    transform: scale(0);
                    animation: ripple-anim 0.6s linear;
                    pointer-events: none;
                }
                @keyframes ripple-anim {
                    to {
                        transform: scale(4);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(rippleStyle);

            const existingRipple = this.querySelector('.ripple');
            if (existingRipple) existingRipple.remove();

            this.appendChild(circle);
        });
    });


    /* ==========================================================================
       7. SCROLL REVEAL & NAVBAR HIGHLIGHTER
       ========================================================================== */
    const reveals = document.querySelectorAll('.reveal');
    const observerOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, observerOptions);

    reveals.forEach(el => revealObserver.observe(el));

    // Navbar Scroll Highlight
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 150;
            if (pageYOffset >= sectionTop) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(current)) {
                link.classList.add('active');
            }
        });
    });


    /* ==========================================================================
       8. ANIMATED COUNTER WITH EASING (Pencacah Angka Statistik)
       ========================================================================== */
    const counters = document.querySelectorAll('.counter');
    let counterAnimated = false;

    const animateCounters = () => {
        counters.forEach(counter => {
            const target = +counter.getAttribute('data-target');
            let count = 0;
            const speed = target / 80;

            const updateCount = () => {
                count += speed;
                if (count < target) {
                    counter.innerText = Math.ceil(count).toLocaleString('id-ID');
                    setTimeout(updateCount, 20);
                } else {
                    counter.innerText = target.toLocaleString('id-ID');
                }
            };
            updateCount();
        });
    };

    const akademikSection = document.getElementById('akademik');
    if (akademikSection) {
        const counterObserver = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && !counterAnimated) {
                animateCounters();
                counterAnimated = true;
            }
        }, { threshold: 0.4 });

        counterObserver.observe(akademikSection);
    }


    /* ==========================================================================
       9. FORM CONFETTI BURST (Semburan Partikel saat Form Berhasil Dikirim)
       ========================================================================== */
    const triggerConfetti = (originX, originY) => {
        const particleCount = 40;
        const colors = ['#2563eb', '#f59e0b', '#10b981', '#ef4444', '#8b5cf6'];

        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.style.position = 'fixed';
            particle.style.left = `${originX}px`;
            particle.style.top = `${originY}px`;
            particle.style.width = `${Math.random() * 8 + 4}px`;
            particle.style.height = `${Math.random() * 8 + 4}px`;
            particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            particle.style.borderRadius = '50%';
            particle.style.pointerEvents = 'none';
            particle.style.zIndex = '10000';
            document.body.appendChild(particle);

            const angle = Math.random() * Math.PI * 2;
            const velocity = Math.random() * 120 + 60;
            const tx = Math.cos(angle) * velocity;
            const ty = Math.sin(angle) * velocity - 50; // sedikit dorongan ke atas

            particle.animate([
                { transform: 'translate(0, 0) scale(1)', opacity: 1 },
                { transform: `translate(${tx}px, ${ty}px) scale(0)`, opacity: 0 }
            ], {
                duration: 1000 + Math.random() * 500,
                easing: 'cubic-bezier(0.1, 0.8, 0.3, 1)',
                fill: 'forwards'
            });

            setTimeout(() => particle.remove(), 1500);
        }
    };

    const form = document.getElementById('guestForm');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = form.querySelector('.btn-submit');
            const rect = btn.getBoundingClientRect();

            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Memproses...';
            btn.style.opacity = '0.7';

            setTimeout(() => {
                // Trigger Efek Confetti Partikel
                triggerConfetti(rect.left + rect.width / 2, rect.top + rect.height / 2);

                btn.innerHTML = '<i class="fas fa-check-circle"></i> Pesan Terkirim!';
                btn.style.background = 'linear-gradient(135deg, #10b981, #059669)';
                btn.style.opacity = '1';

                form.reset();

                setTimeout(() => {
                    btn.innerHTML = '<i class="fas fa-paper-plane"></i> Kirim Pesan';
                    btn.style.background = '';
                }, 3500);
            }, 1000);
        });
    }

});
