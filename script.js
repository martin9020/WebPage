// ===== DOM Elements =====
const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');
const navLinks = document.querySelectorAll('.nav-link');
const filterBtns = document.querySelectorAll('.filter-btn');
const portfolioItems = document.querySelectorAll('.portfolio-item');
const contactForm = document.getElementById('contact-form');

// ===== Navigation Scroll Effect =====
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    // Add/remove scrolled class
    if (currentScroll > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }

    lastScroll = currentScroll;
});

// ===== Mobile Navigation Toggle =====
navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
    document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
});

// Close mobile menu on link click
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
    });
});

// ===== Active Navigation Link =====
const sections = document.querySelectorAll('section[id]');

function setActiveNavLink() {
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');
        const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

        if (navLink && scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            navLinks.forEach(link => link.classList.remove('active'));
            navLink.classList.add('active');
        }
    });
}

window.addEventListener('scroll', setActiveNavLink);

// ===== Smooth Scrolling =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Portfolio filter functionality moved to modal section below

// ===== Contact Form Handling =====
if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
        e.preventDefault();

        // Get form data
        const formData = new FormData(this);
        const data = Object.fromEntries(formData);

        // Create mailto link with form data
        const subject = encodeURIComponent(data.subject || 'Website Inquiry');
        const body = encodeURIComponent(
            `Name: ${data.name}\n` +
            `Email: ${data.email}\n` +
            `Service: ${data.service || 'Not specified'}\n\n` +
            `Message:\n${data.message}`
        );

        // Open email client
        window.location.href = `mailto:martinizvorov@gmail.com?subject=${subject}&body=${body}`;

        // Show success message
        showNotification('Opening your email client...', 'success');
    });
}

// ===== Notification System =====
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button class="notification-close">&times;</button>
    `;

    // Add styles
    notification.style.cssText = `
        position: fixed;
        bottom: 24px;
        right: 24px;
        padding: 16px 24px;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
        color: white;
        border-radius: 8px;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
        display: flex;
        align-items: center;
        gap: 16px;
        z-index: 9999;
        animation: slideIn 0.3s ease;
    `;

    // Add animation keyframes
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
    `;
    document.head.appendChild(style);

    // Add to DOM
    document.body.appendChild(notification);

    // Close button functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.style.cssText = `
        background: none;
        border: none;
        color: white;
        font-size: 1.5rem;
        cursor: pointer;
        padding: 0;
        line-height: 1;
    `;
    closeBtn.addEventListener('click', () => notification.remove());

    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.style.animation = 'slideIn 0.3s ease reverse';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// ===== Scroll Reveal Animation =====
function revealOnScroll() {
    const reveals = document.querySelectorAll('.service-card, .skill-card, .timeline-item, .portfolio-item, .contact-card');

    reveals.forEach(element => {
        const windowHeight = window.innerHeight;
        const elementTop = element.getBoundingClientRect().top;
        const revealPoint = 100;

        if (elementTop < windowHeight - revealPoint) {
            element.classList.add('revealed');
        }
    });
}

// Add reveal styles
const revealStyles = document.createElement('style');
revealStyles.textContent = `
    .service-card, .skill-card, .timeline-item, .portfolio-item, .contact-card {
        opacity: 0;
        transform: translateY(30px);
        transition: opacity 0.6s ease, transform 0.6s ease;
    }

    .service-card.revealed, .skill-card.revealed, .timeline-item.revealed,
    .portfolio-item.revealed, .contact-card.revealed {
        opacity: 1;
        transform: translateY(0);
    }

    .timeline-item:nth-child(2) { transition-delay: 0.1s; }
    .timeline-item:nth-child(3) { transition-delay: 0.2s; }
    .timeline-item:nth-child(4) { transition-delay: 0.3s; }
    .timeline-item:nth-child(5) { transition-delay: 0.4s; }

    .service-card:nth-child(2) { transition-delay: 0.1s; }
    .service-card:nth-child(3) { transition-delay: 0.2s; }
    .service-card:nth-child(4) { transition-delay: 0.3s; }
    .service-card:nth-child(5) { transition-delay: 0.4s; }
    .service-card:nth-child(6) { transition-delay: 0.5s; }
`;
document.head.appendChild(revealStyles);

window.addEventListener('scroll', revealOnScroll);
window.addEventListener('load', revealOnScroll);

// ===== Typing Effect for Hero =====
function typeWriter(element, text, speed = 50) {
    let i = 0;
    element.textContent = '';

    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }

    type();
}

// ===== Counter Animation for Stats =====
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);
    const isDecimal = target % 1 !== 0;

    function update() {
        start += increment;
        if (start < target) {
            element.textContent = isDecimal ? start.toFixed(1) : Math.floor(start);
            requestAnimationFrame(update);
        } else {
            element.textContent = target;
        }
    }

    update();
}

// Animate stats when they come into view
const stats = document.querySelectorAll('.stat-number');
let statsAnimated = false;

function checkStats() {
    if (statsAnimated) return;

    const heroSection = document.querySelector('.hero');
    if (!heroSection) return;

    const rect = heroSection.getBoundingClientRect();

    if (rect.top < window.innerHeight && rect.bottom > 0) {
        statsAnimated = true;
        // Stats are already showing text, no need to animate numbers
    }
}

window.addEventListener('scroll', checkStats);
window.addEventListener('load', checkStats);

// ===== Parallax Effect for Hero Background =====
window.addEventListener('scroll', () => {
    const heroGrid = document.querySelector('.hero-grid');
    if (heroGrid) {
        const scrolled = window.pageYOffset;
        heroGrid.style.transform = `translateY(${scrolled * 0.3}px)`;
    }
});

// ===== Initialize =====
document.addEventListener('DOMContentLoaded', () => {
    // Set initial active nav link
    setActiveNavLink();

    // Trigger initial reveal check
    revealOnScroll();

    // Add loaded class to body for initial animations
    document.body.classList.add('loaded');
});

// Keyboard navigation is handled in the modal section

// ===== Preload Images =====
function preloadImages() {
    const images = document.querySelectorAll('img[src]');
    images.forEach(img => {
        const src = img.getAttribute('src');
        if (src) {
            const preloadImg = new Image();
            preloadImg.src = src;
        }
    });
}

preloadImages();

// ===== Portfolio Folder Data =====
const folderData = {
    'baumit': {
        name: 'Baumit',
        category: 'industrial',
        items: [
            { type: 'image', src: 'Projects/Baumit/Project Folder Picture.JPG', title: 'Baumit Overview', desc: 'Industrial steel structure' },
            { type: 'image', src: 'Projects/Baumit/View - 1.png', title: 'Baumit 3D View 1', desc: 'Tekla model visualization' },
            { type: 'image', src: 'Projects/Baumit/View - 2.png', title: 'Baumit 3D View 2', desc: 'Structural details' },
            { type: 'pdf', src: 'Projects/Baumit/Group FD/BFY-FD-A1B119-0.pdf', thumb: 'Projects/Baumit/thumbnails/BFY-FD-A1B119-0.jpg', title: 'Fabrication Detail A1B119', desc: 'Steel fabrication drawing' },
            { type: 'pdf', src: 'Projects/Baumit/Group FD/BFY-FD-A1B34-0.pdf', thumb: 'Projects/Baumit/thumbnails/BFY-FD-A1B34-0.jpg', title: 'Fabrication Detail A1B34', desc: 'Steel fabrication drawing' },
            { type: 'pdf', src: 'Projects/Baumit/Group FD/BFY-FD-A1V30-0.pdf', thumb: 'Projects/Baumit/thumbnails/BFY-FD-A1V30-0.jpg', title: 'Fabrication Detail A1V30', desc: 'Steel fabrication drawing' },
            { type: 'pdf', src: 'Projects/Baumit/Group GA/BFY-GA-A1-01-0-Model.pdf', thumb: 'Projects/Baumit/thumbnails/BFY-GA-A1-01-0-Model.jpg', title: 'GA A1-01 Model', desc: 'General arrangement' },
            { type: 'pdf', src: 'Projects/Baumit/Group GA/BFY-GA-A1-03-0-Model.pdf', thumb: 'Projects/Baumit/thumbnails/BFY-GA-A1-03-0-Model.jpg', title: 'GA A1-03 Model', desc: 'General arrangement' },
            { type: 'pdf', src: 'Projects/Baumit/Group GA/BFY-GA-A1-17-0-Model.pdf', thumb: 'Projects/Baumit/thumbnails/BFY-GA-A1-17-0-Model.jpg', title: 'GA A1-17 Model', desc: 'General arrangement' },
            { type: 'pdf', src: 'Projects/Baumit/Group GA/BFY-GA-A2-01-0.pdf', thumb: 'Projects/Baumit/thumbnails/BFY-GA-A2-01-0.jpg', title: 'GA A2-01', desc: 'General arrangement' },
            { type: 'pdf', src: 'Projects/Baumit/Group GA/BFY-GA-A2-02-0.pdf', thumb: 'Projects/Baumit/thumbnails/BFY-GA-A2-02-0.jpg', title: 'GA A2-02', desc: 'General arrangement' },
            { type: 'pdf', src: 'Projects/Baumit/Group GA/BFY-GA-A2-06-0.pdf', thumb: 'Projects/Baumit/thumbnails/BFY-GA-A2-06-0.jpg', title: 'GA A2-06', desc: 'General arrangement' },
            { type: 'pdf', src: 'Projects/Baumit/Group GA/BFY-GA-A3-01-0.pdf', thumb: 'Projects/Baumit/thumbnails/BFY-GA-A3-01-0.jpg', title: 'GA A3-01', desc: 'General arrangement' },
            { type: 'pdf', src: 'Projects/Baumit/Group GA/BFY-GA-A3-04-0.pdf', thumb: 'Projects/Baumit/thumbnails/BFY-GA-A3-04-0.jpg', title: 'GA A3-04', desc: 'General arrangement' },
            { type: 'pdf', src: 'Projects/Baumit/Group GA/BFY-GA-A3-12-0.pdf', thumb: 'Projects/Baumit/thumbnails/BFY-GA-A3-12-0.jpg', title: 'GA A3-12', desc: 'General arrangement' }
        ]
    },
    'cimcoop': {
        name: 'CimCoop',
        category: 'industrial',
        items: [
            { type: 'image', src: 'Projects/CimCoop/Exported View.png', title: 'CimCoop Overview', desc: 'Office building steel structure' },
            { type: 'pdf', src: 'Projects/CimCoop/Group FD/OFC-WD-FD-BA10-B.pdf', thumb: 'Projects/CimCoop/thumbnails/OFC-WD-FD-BA10-B.jpg', title: 'FD BA10', desc: 'Fabrication detail' },
            { type: 'pdf', src: 'Projects/CimCoop/Group FD/OFC-WD-FD-HA24-B.pdf', thumb: 'Projects/CimCoop/thumbnails/OFC-WD-FD-HA24-B.jpg', title: 'FD HA24', desc: 'Fabrication detail' },
            { type: 'pdf', src: 'Projects/CimCoop/Group FD/OFC-WD-FD-KA13-B.pdf', thumb: 'Projects/CimCoop/thumbnails/OFC-WD-FD-KA13-B.jpg', title: 'FD KA13', desc: 'Fabrication detail' },
            { type: 'pdf', src: 'Projects/CimCoop/Group FD/OFC-WD-FD-TA1-B.pdf', thumb: 'Projects/CimCoop/thumbnails/OFC-WD-FD-TA1-B.jpg', title: 'FD TA1', desc: 'Fabrication detail' },
            { type: 'pdf', src: 'Projects/CimCoop/Group FD/OFC-WD-FD-TA2-B.pdf', thumb: 'Projects/CimCoop/thumbnails/OFC-WD-FD-TA2-B.jpg', title: 'FD TA2', desc: 'Fabrication detail' },
            { type: 'pdf', src: 'Projects/CimCoop/Group GA/OFC-WD-GA-01-B.pdf', thumb: 'Projects/CimCoop/thumbnails/OFC-WD-GA-01-B.jpg', title: 'GA 01', desc: 'General arrangement' },
            { type: 'pdf', src: 'Projects/CimCoop/Group GA/OFC-WD-GA-02-B.pdf', thumb: 'Projects/CimCoop/thumbnails/OFC-WD-GA-02-B.jpg', title: 'GA 02', desc: 'General arrangement' },
            { type: 'pdf', src: 'Projects/CimCoop/Group GA/OFC-WD-GA-03-B.pdf', thumb: 'Projects/CimCoop/thumbnails/OFC-WD-GA-03-B.jpg', title: 'GA 03', desc: 'General arrangement' },
            { type: 'pdf', src: 'Projects/CimCoop/Group GA/OFC-WD-GA-04-B.pdf', thumb: 'Projects/CimCoop/thumbnails/OFC-WD-GA-04-B.jpg', title: 'GA 04', desc: 'General arrangement' },
            { type: 'pdf', src: 'Projects/CimCoop/Group GA/OFC-WD-GA-05-B.pdf', thumb: 'Projects/CimCoop/thumbnails/OFC-WD-GA-05-B.jpg', title: 'GA 05', desc: 'General arrangement' },
            { type: 'pdf', src: 'Projects/CimCoop/Group GA/OFC-WD-GA-06-B.pdf', thumb: 'Projects/CimCoop/thumbnails/OFC-WD-GA-06-B.jpg', title: 'GA 06', desc: 'General arrangement' },
            { type: 'pdf', src: 'Projects/CimCoop/Group GA/OFC-WD-GA-07-B.pdf', thumb: 'Projects/CimCoop/thumbnails/OFC-WD-GA-07-B.jpg', title: 'GA 07', desc: 'General arrangement' },
            { type: 'pdf', src: 'Projects/CimCoop/Group GA/OFC-WD-GA-08-B.pdf', thumb: 'Projects/CimCoop/thumbnails/OFC-WD-GA-08-B.jpg', title: 'GA 08', desc: 'General arrangement' }
        ]
    },
    'mfg-general': {
        name: 'MFG - General',
        category: 'canopy',
        items: [
            { type: 'image', src: 'Projects/MFG - General/EV Charging Hub - day.jpg', title: 'EV Charging Hub Day', desc: 'Complete charging station' },
            { type: 'image', src: 'Projects/MFG - General/EV Charging Hub - night.jpg', title: 'EV Charging Hub Night', desc: 'Illuminated view' },
            { type: 'image', src: 'Projects/MFG - General/EV Charging Bay.jpg', title: 'EV Charging Bay', desc: 'Single bay unit' },
            { type: 'image', src: 'Projects/MFG - General/EV Charging Bay - 1.jpg', title: 'Charging Bay Design', desc: 'Canopy structure' },
            { type: 'image', src: 'Projects/MFG - General/EV Chagrgin Bay - 2.jpg', title: 'Charging Bay Variant', desc: 'Design variant' },
            { type: 'image', src: 'Projects/MFG - General/MFG Ambassador.jpg', title: 'MFG Ambassador', desc: 'Completed installation' },
            { type: 'image', src: 'Projects/MFG - General/MFG Swaffham.jpg', title: 'MFG Swaffham', desc: 'Service station' },
            { type: 'image', src: 'Projects/MFG - General/MFG - Putney 1.jpg', title: 'MFG Putney', desc: 'Completed site' },
            { type: 'pdf', src: 'Projects/MFG - General/MFG - Generic 4 Bay GA - Detailed Layout GA.pdf', thumb: 'Projects/MFG - General/thumbnails/MFG - Generic 4 Bay GA - Detailed Layout GA.jpg', title: 'Generic 4 Bay Layout', desc: 'Detailed GA drawing' }
        ]
    },
    'mfg-glyne-gap': {
        name: 'MFG - Glyne Gap',
        category: 'canopy',
        items: [
            { type: 'image', src: 'Projects/MFG - Projects/MFG - Glyne Gap/MFG - Glyne Gap - 1 .jpg', title: 'Glyne Gap View 1', desc: 'Service station' },
            { type: 'image', src: 'Projects/MFG - Projects/MFG - Glyne Gap/MFG - Glyne Gap - 2.jpg', title: 'Glyne Gap View 2', desc: 'Installation detail' },
            { type: 'pdf', src: 'Projects/MFG - Projects/MFG - Glyne Gap/Glyne Gap Service Station - Foundation GA.pdf', thumb: 'Projects/MFG - Projects/MFG - Glyne Gap/thumbnails/Glyne Gap Service Station - Foundation GA.jpg', title: 'Foundation GA', desc: 'Foundation layout' },
            { type: 'pdf', src: 'Projects/MFG - Projects/MFG - Glyne Gap/Glyne Gap Service Station - Layout GA.pdf', thumb: 'Projects/MFG - Projects/MFG - Glyne Gap/thumbnails/Glyne Gap Service Station - Layout GA.jpg', title: 'Layout GA', desc: 'General arrangement' }
        ]
    },
    'mfg-stretford': {
        name: 'MFG - Stretford',
        category: 'canopy',
        items: [
            { type: 'image', src: 'Projects/MFG - Projects/MFG - Stretford/MFG - Stretford 1.jpg', title: 'Stretford View 1', desc: 'Canopy installation' },
            { type: 'image', src: 'Projects/MFG - Projects/MFG - Stretford/MFG - Stretford 2.jpg', title: 'Stretford View 2', desc: 'Construction phase' },
            { type: 'image', src: 'Projects/MFG - Projects/MFG - Stretford/MFG - Stretford 3.jpg', title: 'Stretford View 3', desc: 'Progress view' },
            { type: 'image', src: 'Projects/MFG - Projects/MFG - Stretford/MFG - Stretford 4.jpg', title: 'Stretford View 4', desc: 'Completed station' },
            { type: 'pdf', src: 'Projects/MFG - Projects/MFG - Stretford/MFG - Stretford - Foundation - GA-01 - Rev 2.pdf', thumb: 'Projects/MFG - Projects/MFG - Stretford/thumbnails/MFG - Stretford - Foundation - GA-01 - Rev 2.jpg', title: 'Foundation GA', desc: 'Foundation layout Rev 2' },
            { type: 'pdf', src: 'Projects/MFG - Projects/MFG - Stretford/MFG - Stretford - Layout GA-01 - Rev 2.pdf', thumb: 'Projects/MFG - Projects/MFG - Stretford/thumbnails/MFG - Stretford - Layout GA-01 - Rev 2.jpg', title: 'Layout GA', desc: 'General arrangement Rev 2' }
        ]
    },
    'mfg-wellington': {
        name: 'MFG - Wellington',
        category: 'canopy',
        items: [
            { type: 'image', src: 'Projects/MFG - Projects/MFG - Wellington/MFG - Wellington 1.jpg', title: 'Wellington View 1', desc: 'Completed station' },
            { type: 'image', src: 'Projects/MFG - Projects/MFG - Wellington/MFG - Wellington 2.jpg', title: 'Wellington View 2', desc: 'Aerial view' },
            { type: 'image', src: 'Projects/MFG - Projects/MFG - Wellington/MFG - Wellington 3.jpg', title: 'Wellington View 3', desc: 'Detail view' },
            { type: 'pdf', src: 'Projects/MFG - Projects/MFG - Wellington/MFG Wellington - Layout GA.pdf', thumb: 'Projects/MFG - Projects/MFG - Wellington/thumbnails/MFG Wellington - Layout GA.jpg', title: 'Layout GA', desc: 'General arrangement' }
        ]
    },
    'mfg-crow-orchard': {
        name: 'MFG - Crow Orchard',
        category: 'canopy',
        items: [
            { type: 'image', src: 'Projects/MFG - Projects/MFG - Crow Orchard/MFG - Crow Orchard.jpg', title: 'Crow Orchard', desc: 'Service station canopy' },
            { type: 'pdf', src: 'Projects/MFG - Projects/MFG - Crow Orchard/MFG Crow Orchard - GA.pdf', thumb: 'Projects/MFG - Projects/MFG - Crow Orchard/thumbnails/MFG Crow Orchard - GA.jpg', title: 'Layout GA', desc: 'General arrangement' }
        ]
    },
    'bishop-david-brown': {
        name: 'Bishop David Brown',
        category: 'schools',
        items: [
            { type: 'image', src: 'Projects/Oxford LT/Bishop David Brown/DJI_20231222101152_0013_D.JPG', title: 'Aerial View', desc: 'Drone footage' },
            { type: 'image', src: 'Projects/Oxford LT/Bishop David Brown/PXL_20231103_110609052.jpg', title: 'Site Photo', desc: 'Construction progress' },
            { type: 'pdf', src: 'Projects/Oxford LT/Bishop David Brown/704149-3-Bishop David Brown-Layout GA-Sections .pdf', thumb: 'Projects/Oxford LT/Bishop David Brown/thumbnails/704149-3-Bishop David Brown-Layout GA-Sections .jpg', title: 'Layout GA Sections', desc: 'General arrangement' }
        ]
    },
    'castle-view': {
        name: 'Castle View Academy',
        category: 'schools',
        items: [
            { type: 'image', src: 'Projects/Oxford LT/Castle View/1.jpg', title: 'Castle View 1', desc: 'School building' },
            { type: 'image', src: 'Projects/Oxford LT/Castle View/2.jpg', title: 'Castle View 2', desc: 'Steel frame' },
            { type: 'image', src: 'Projects/Oxford LT/Castle View/3.jpg', title: 'Castle View 3', desc: 'Construction' },
            { type: 'image', src: 'Projects/Oxford LT/Castle View/4.jpg', title: 'Castle View 4', desc: 'Detail view' },
            { type: 'image', src: 'Projects/Oxford LT/Castle View/5.jpg', title: 'Castle View 5', desc: 'Progress' },
            { type: 'pdf', src: 'Projects/Oxford LT/Castle View/725014-01-R01-Castle View Academy-Foundation Layout GA.pdf', thumb: 'Projects/Oxford LT/Castle View/thumbnails/725014-01-R01-Castle View Academy-Foundation Layout GA.jpg', title: 'Foundation Layout GA', desc: 'Foundation drawing' },
            { type: 'pdf', src: 'Projects/Oxford LT/Castle View/725014-01-R01-Castle View Academy-Layout GA.pdf', thumb: 'Projects/Oxford LT/Castle View/thumbnails/725014-01-R01-Castle View Academy-Layout GA.jpg', title: 'Layout GA', desc: 'General arrangement' }
        ]
    },
    'lavington': {
        name: 'Lavington School',
        category: 'schools',
        items: [
            { type: 'image', src: 'Projects/Oxford XL/Lavington/01.jpg', title: 'Lavington View 1', desc: 'School project' },
            { type: 'image', src: 'Projects/Oxford XL/Lavington/04.jpg', title: 'Lavington View 2', desc: 'Steel framing' },
            { type: 'image', src: 'Projects/Oxford XL/Lavington/20240902_120020.jpg', title: 'Progress 2024', desc: 'Construction update' },
            { type: 'image', src: 'Projects/Oxford XL/Lavington/20240902_120222.jpg', title: 'Site View 2024', desc: 'Construction progress' },
            { type: 'pdf', src: 'Projects/Oxford XL/Lavington/724041-03-R1-Lavington School-Layout - GA2.pdf', thumb: 'Projects/Oxford XL/Lavington/thumbnails/724041-03-R1-Lavington School-Layout - GA2.jpg', title: 'Layout GA2', desc: 'General arrangement' }
        ]
    },
    'toynbee': {
        name: 'Toynbee School',
        category: 'schools',
        items: [
            { type: 'image', src: 'Projects/Oxford XL/Toynbee/DJI_20240529102905_0096_D.JPG', title: 'Aerial View 1', desc: 'Drone footage' },
            { type: 'image', src: 'Projects/Oxford XL/Toynbee/DJI_20240529103016_0099_D.JPG', title: 'Aerial View 2', desc: 'Drone footage' },
            { type: 'image', src: 'Projects/Oxford XL/Toynbee/DJI_20240529104722_0112_D.JPG', title: 'Aerial View 3', desc: 'Drone footage' },
            { type: 'image', src: 'Projects/Oxford XL/Toynbee/DJI_20240529111237_0138_D.JPG', title: 'Aerial View 4', desc: 'Drone footage' },
            { type: 'image', src: 'Projects/Oxford XL/Toynbee/Oxford XL - Project Folder.jpg', title: 'Tekla Model', desc: '3D visualization' },
            { type: 'image', src: 'Projects/Oxford XL/Toynbee/PXL_20240403_104653865.jpg', title: 'Site Photo 1', desc: 'Construction' },
            { type: 'image', src: 'Projects/Oxford XL/Toynbee/PXL_20240403_104710414.jpg', title: 'Site Photo 2', desc: 'Construction' }
        ]
    },
    'uxbridge': {
        name: 'Uxbridge Dining Hall',
        category: 'schools',
        items: [
            { type: 'image', src: 'Projects/Uxbridge/Dining Hall.png', title: '3D Render', desc: 'Visualization' },
            { type: 'image', src: 'Projects/Uxbridge/20230417_131912.jpg', title: 'Site Photo', desc: 'Construction' },
            { type: 'pdf', src: 'Projects/Uxbridge/704509--Claremont Primary School - Dining Hall-3D - View - GA.pdf', thumb: 'Projects/Uxbridge/thumbnails/704509--Claremont Primary School - Dining Hall-3D - View - GA.jpg', title: '3D View GA', desc: 'General arrangement' }
        ]
    },
    'portfolio': {
        name: 'Project Showcase',
        category: 'docs',
        items: [
            { type: 'pdf', src: 'Projects/Portfolio/Rema Design Portfolio.pdf', thumb: 'Projects/Portfolio/thumbnails/Rema Design Portfolio.jpg', title: 'Rema Design Portfolio', desc: 'Previous work collection' }
        ]
    },
    'cv': {
        name: 'About Me',
        category: 'docs',
        items: [
            { type: 'pdf', src: 'Projects/Modern Professional CV Resume.pdf', thumb: 'Projects/thumbnails/Modern Professional CV Resume.jpg', title: 'Martin Velichkov CV', desc: 'Resume & qualifications' }
        ]
    }
};

// ===== Portfolio Navigation State =====
let currentView = 'folders'; // 'folders' or 'contents'
let currentFolder = null;
let currentFilter = 'all';

// DOM Elements
const portfolioFolders = document.getElementById('portfolio-folders');
const portfolioContents = document.getElementById('portfolio-contents');
const breadcrumb = document.getElementById('portfolio-breadcrumb');
const modal = document.getElementById('portfolio-modal');
const modalOverlay = modal?.querySelector('.modal-overlay');
const modalClose = modal?.querySelector('.modal-close');
const modalImageContainer = document.getElementById('modal-image-container');
const modalImage = document.getElementById('modal-image');
const modalPdfContainer = document.getElementById('modal-pdf-container');
const modalPdf = document.getElementById('modal-pdf');
const modalCaption = document.getElementById('modal-caption');
const pdfZoomIn = document.getElementById('pdf-zoom-in');
const pdfZoomOut = document.getElementById('pdf-zoom-out');
const pdfZoomReset = document.getElementById('pdf-zoom-reset');
const pdfZoomLevel = document.getElementById('pdf-zoom-level');
const pdfDownload = document.getElementById('pdf-download');
const pdfViewerWrapper = document.getElementById('pdf-viewer-wrapper');

let currentZoom = 100;
const zoomStep = 25;
const minZoom = 50;
const maxZoom = 300;

// ===== PDF.js Configuration =====
if (typeof pdfjsLib !== 'undefined') {
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
}

// ===== Render PDF Thumbnail =====
async function renderPdfThumbnail(canvas, pdfSrc) {
    if (typeof pdfjsLib === 'undefined') {
        throw new Error('PDF.js not loaded');
    }

    const pdf = await pdfjsLib.getDocument(pdfSrc).promise;
    const page = await pdf.getPage(1);

    const scale = 0.5;
    const viewport = page.getViewport({ scale });

    canvas.width = viewport.width;
    canvas.height = viewport.height;

    const context = canvas.getContext('2d');
    await page.render({
        canvasContext: context,
        viewport: viewport
    }).promise;
}

// ===== Initialize PDF Thumbnails =====
function initPdfThumbnails() {
    // PDF thumbnails are now using fallback icons by default
    // Thumbnails will be generated when folders are opened
    console.log('PDF fallback icons loaded');
}

// ===== Filter Folders =====
function filterFolders(filter) {
    currentFilter = filter;
    const folders = document.querySelectorAll('.portfolio-folder');

    folders.forEach(folder => {
        const category = folder.dataset.category;
        // Exclude 'docs' from 'all' - only show when specifically selected
        const shouldShow = (filter === 'all' && category !== 'docs') || category === filter;

        if (shouldShow) {
            folder.style.display = 'block';
            setTimeout(() => {
                folder.style.opacity = '1';
                folder.style.transform = 'translateY(0)';
            }, 10);
        } else {
            folder.style.opacity = '0';
            folder.style.transform = 'translateY(20px)';
            setTimeout(() => {
                folder.style.display = 'none';
            }, 300);
        }
    });
}

// ===== Open Folder =====
function openFolder(folderId) {
    const folder = folderData[folderId];
    if (!folder) return;

    currentView = 'contents';
    currentFolder = folderId;

    // Update breadcrumb
    breadcrumb.innerHTML = `
        <span class="breadcrumb-back" onclick="goBackToFolders()">&#8592; Back</span>
        <span class="breadcrumb-separator">/</span>
        <span class="breadcrumb-item active">${folder.name}</span>
    `;

    // Hide folders, show contents
    portfolioFolders.style.display = 'none';
    portfolioContents.style.display = 'grid';

    // Generate content items
    portfolioContents.innerHTML = folder.items.map((item, index) => {
        if (item.type === 'image') {
            return `
                <div class="portfolio-item" data-type="image" data-src="${item.src}" data-title="${item.title}" data-desc="${item.desc}">
                    <div class="portfolio-image">
                        <img src="${item.src}" alt="${item.title}">
                    </div>
                    <div class="portfolio-overlay">
                        <h3>${item.title}</h3>
                        <p>${item.desc}</p>
                    </div>
                </div>
            `;
        } else {
            // Use thumbnail image if available, otherwise show fallback
            const thumbSrc = item.thumb || '';
            return `
                <div class="portfolio-item portfolio-item-pdf" data-type="pdf" data-src="${item.src}" data-title="${item.title}" data-desc="${item.desc}">
                    <div class="portfolio-image">
                        ${thumbSrc ? `<img src="${thumbSrc}" alt="${item.title}" class="pdf-thumb-img">` : `<div class="pdf-thumbnail-container"><div class="pdf-fallback-icon">PDF</div></div>`}
                    </div>
                    <div class="portfolio-overlay">
                        <h3>${item.title}</h3>
                        <p>${item.desc}</p>
                    </div>
                </div>
            `;
        }
    }).join('');

    // Add click handlers for content items
    document.querySelectorAll('#portfolio-contents .portfolio-item').forEach(item => {
        item.addEventListener('click', () => openModal(item));
    });

    // Trigger reveal animation
    setTimeout(() => {
        document.querySelectorAll('#portfolio-contents .portfolio-item').forEach(item => {
            item.classList.add('revealed');
        });
    }, 100);
}

// ===== Go Back to Folders =====
function goBackToFolders() {
    currentView = 'folders';
    currentFolder = null;

    // Update breadcrumb
    breadcrumb.innerHTML = `<span class="breadcrumb-item active">All Projects</span>`;

    // Show folders, hide contents
    portfolioFolders.style.display = 'grid';
    portfolioContents.style.display = 'none';
    portfolioContents.innerHTML = '';

    // Re-apply filter
    filterFolders(currentFilter);
}

// Make goBackToFolders available globally
window.goBackToFolders = goBackToFolders;

// ===== Open Modal =====
function openModal(item) {
    const type = item.dataset.type;
    const src = item.dataset.src;
    const title = item.dataset.title || item.querySelector('.portfolio-overlay h3')?.textContent || '';
    const desc = item.dataset.desc || item.querySelector('.portfolio-overlay p')?.textContent || '';

    if (!src) return;

    // Reset zoom
    currentZoom = 100;
    updateZoomLevel();

    if (type === 'image') {
        modalImageContainer.classList.add('active');
        modalPdfContainer.classList.remove('active');
        modalImage.src = src;
        modalImage.alt = title;
    } else if (type === 'pdf') {
        modalImageContainer.classList.remove('active');
        modalPdfContainer.classList.add('active');
        modalPdf.src = src;
        pdfDownload.href = src;
    }

    modalCaption.textContent = title + (desc ? ' - ' + desc : '');
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// ===== Close Modal =====
function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
    setTimeout(() => {
        modalImage.src = '';
        modalPdf.src = '';
        modalImageContainer.classList.remove('active');
        modalPdfContainer.classList.remove('active');
    }, 300);
}

// ===== PDF Zoom Controls =====
function updateZoomLevel() {
    if (pdfZoomLevel) {
        pdfZoomLevel.textContent = currentZoom + '%';
    }
    if (modalPdf) {
        modalPdf.style.transform = `scale(${currentZoom / 100})`;
        if (pdfViewerWrapper) {
            const scale = currentZoom / 100;
            modalPdf.style.width = (100 / scale) + '%';
            modalPdf.style.height = (100 / scale) + '%';
        }
    }
}

// ===== Event Listeners =====

// Filter buttons
filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.dataset.filter;

        if (currentView === 'folders') {
            filterFolders(filter);
        } else {
            // Go back to folders with new filter
            goBackToFolders();
            filterFolders(filter);
        }
    });
});

// Folder click handlers
document.querySelectorAll('.portfolio-folder').forEach(folder => {
    folder.addEventListener('click', () => {
        const folderId = folder.dataset.folder;
        openFolder(folderId);
    });
});

// Modal close handlers
if (modalClose) modalClose.addEventListener('click', closeModal);
if (modalOverlay) modalOverlay.addEventListener('click', closeModal);

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        if (modal && modal.classList.contains('active')) {
            closeModal();
        } else if (currentView === 'contents') {
            goBackToFolders();
        }
        if (navMenu && navMenu.classList.contains('active')) {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    }
});

// PDF Zoom buttons
if (pdfZoomIn) {
    pdfZoomIn.addEventListener('click', () => {
        if (currentZoom < maxZoom) {
            currentZoom += zoomStep;
            updateZoomLevel();
        }
    });
}

if (pdfZoomOut) {
    pdfZoomOut.addEventListener('click', () => {
        if (currentZoom > minZoom) {
            currentZoom -= zoomStep;
            updateZoomLevel();
        }
    });
}

if (pdfZoomReset) {
    pdfZoomReset.addEventListener('click', () => {
        currentZoom = 100;
        updateZoomLevel();
    });
}

// Initialize PDF thumbnails on load
document.addEventListener('DOMContentLoaded', () => {
    initPdfThumbnails();
});

console.log('M I V Engineering Portfolio - Website Loaded Successfully');
