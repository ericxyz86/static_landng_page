// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
    // Add smooth scrolling to all links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Add animation classes to modern cards
    document.querySelectorAll('.modern-app-card').forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Enhanced Intersection Observer for scroll animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '50px'
    });

    // Observe all elements with animation classes
    const animatedElements = document.querySelectorAll('.fade-in, .scale-in');
    animatedElements.forEach(element => observer.observe(element));

    // Add stagger effect to app cards
    const appCards = document.querySelectorAll('.modern-app-card');
    appCards.forEach((card, index) => {
        setTimeout(() => {
            if (card.getBoundingClientRect().top < window.innerHeight) {
                card.classList.add('visible');
            }
        }, index * 150);
    });

    // Add floating animation to abstract shapes
    const shapes = document.querySelectorAll('.shape');
    shapes.forEach(shape => {
        const randomDelay = Math.random() * 5;
        shape.style.animationDelay = `${randomDelay}s`;
    });

    // Enable drag-and-drop card prioritization (top 4 cards are "large slots").
    initAppCardReorder();
});

function initAppCardReorder() {
    const container = document.getElementById('apps');
    if (!container) return;

    const CARD_ORDER_STORAGE_KEY = 'ailabs_app_card_order_v1';
    let draggedCard = null;
    let placeholder = null;

    const getCards = () => Array.from(container.querySelectorAll('.modern-app-card'));

    const toSlug = value =>
        String(value || '')
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '') || 'card';

    const ensureCardIds = cards => {
        const used = new Set();
        cards.forEach((card, index) => {
            let baseId = card.dataset.cardId;
            if (!baseId) {
                const title = card.querySelector('.app-title')?.textContent?.trim() || `card-${index + 1}`;
                baseId = toSlug(title);
            }

            let uniqueId = baseId;
            let suffix = 2;
            while (used.has(uniqueId)) {
                uniqueId = `${baseId}-${suffix}`;
                suffix += 1;
            }

            used.add(uniqueId);
            card.dataset.cardId = uniqueId;
        });
    };

    const persistOrder = () => {
        const ids = getCards().map(card => card.dataset.cardId).filter(Boolean);
        try {
            localStorage.setItem(CARD_ORDER_STORAGE_KEY, JSON.stringify(ids));
        } catch (_err) {
            // Ignore storage failures to keep drag interaction functional.
        }
    };

    const applySavedOrder = () => {
        const cards = getCards();
        ensureCardIds(cards);

        let savedIds = null;
        try {
            savedIds = JSON.parse(localStorage.getItem(CARD_ORDER_STORAGE_KEY) || 'null');
        } catch (_err) {
            savedIds = null;
        }

        if (!Array.isArray(savedIds) || savedIds.length === 0) {
            return;
        }

        const cardById = new Map(cards.map(card => [card.dataset.cardId, card]));
        const ordered = [];

        savedIds.forEach(id => {
            const card = cardById.get(id);
            if (card) {
                ordered.push(card);
                cardById.delete(id);
            }
        });

        cardById.forEach(card => ordered.push(card));
        ordered.forEach(card => container.appendChild(card));
    };

    const clearDropTargets = () => {
        getCards().forEach(card => card.classList.remove('is-drop-target'));
    };

    const applyDraggableState = () => {
        getCards().forEach(card => {
            card.draggable = true;
            card.classList.add('card-draggable');
        });
    };

    const finishDrag = () => {
        if (!draggedCard) return;

        if (placeholder && placeholder.parentElement === container) {
            container.insertBefore(draggedCard, placeholder);
        }

        draggedCard.classList.remove('is-dragging');
        clearDropTargets();

        if (placeholder && placeholder.parentElement) {
            placeholder.remove();
        }

        draggedCard = null;
        placeholder = null;
        applyDraggableState();
        persistOrder();
    };

    container.addEventListener('dragstart', event => {
        const card = event.target.closest('.modern-app-card');
        if (!card || card.parentElement !== container || !card.draggable) {
            event.preventDefault();
            return;
        }

        draggedCard = card;
        placeholder = document.createElement('div');
        placeholder.className = 'modern-app-card card-drop-placeholder';
        placeholder.setAttribute('aria-hidden', 'true');

        card.classList.add('is-dragging');
        event.dataTransfer.effectAllowed = 'move';
        event.dataTransfer.setData('text/plain', card.querySelector('.app-title')?.textContent?.trim() || 'card');

        requestAnimationFrame(() => {
            if (!draggedCard || !placeholder || placeholder.parentElement) return;
            container.insertBefore(placeholder, draggedCard.nextSibling);
        });
    });

    container.addEventListener('dragover', event => {
        if (!draggedCard || !placeholder) return;
        event.preventDefault();

        const hovered = document
            .elementFromPoint(event.clientX, event.clientY)
            ?.closest('.modern-app-card');

        const dropTarget =
            hovered &&
            hovered !== draggedCard &&
            hovered !== placeholder &&
            hovered.parentElement === container
                ? hovered
                : null;

        clearDropTargets();

        if (!dropTarget) {
            container.appendChild(placeholder);
            return;
        }

        dropTarget.classList.add('is-drop-target');

        const rect = dropTarget.getBoundingClientRect();
        const centerY = rect.top + rect.height / 2;
        const centerX = rect.left + rect.width / 2;
        const placeBefore =
            event.clientY < centerY ||
            (Math.abs(event.clientY - centerY) < rect.height * 0.18 && event.clientX < centerX);

        container.insertBefore(placeholder, placeBefore ? dropTarget : dropTarget.nextSibling);
    });

    container.addEventListener('drop', event => {
        if (!draggedCard) return;
        event.preventDefault();
        finishDrag();
    });

    applySavedOrder();
    container.addEventListener('dragend', finishDrag);
    applyDraggableState();
    persistOrder();
}

// Login functionality
document.addEventListener('DOMContentLoaded', function() {
    const loginOverlay = document.getElementById('loginOverlay');
    const mainContent = document.getElementById('mainContent');
    const loginForm = document.getElementById('loginForm');
    const loginError = document.getElementById('loginError');
    const loginButton = document.getElementById('loginButton');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');

    // Check if user is already logged in
    if (localStorage.getItem('isLoggedIn') === 'true') {
        loginOverlay.style.display = 'none';
        mainContent.classList.remove('hidden');
        // Trigger animations after content is visible
        setTimeout(() => {
            triggerAnimations();
        }, 100);
    } else {
        // Ensure input fields are accessible
        setTimeout(() => {
            if (usernameInput) {
                usernameInput.focus();
                console.log('Username input focused');
            }
        }, 500);
        
        // Add click event listeners to input fields for debugging
        if (usernameInput) {
            usernameInput.addEventListener('click', function() {
                console.log('Username input clicked');
            });
            usernameInput.addEventListener('focus', function() {
                console.log('Username input focused');
            });
        }
        
        if (passwordInput) {
            passwordInput.addEventListener('click', function() {
                console.log('Password input clicked');
            });
            passwordInput.addEventListener('focus', function() {
                console.log('Password input focused');
            });
        }
    }

    // Check credentials
    function checkCredentials() {
        const username = usernameInput.value.trim();
        const password = passwordInput.value.trim();
        console.log('Password entered:', password); // For debugging
        return username === 'agileintel' && password === '16f2worldsquare';
    }

    // Handle login form submission
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (checkCredentials()) {
            localStorage.setItem('isLoggedIn', 'true');
            
            // Smooth transition effect
            loginOverlay.style.opacity = '0';
            loginOverlay.style.transition = 'opacity 0.5s ease';
            
            setTimeout(() => {
                loginOverlay.style.display = 'none';
                mainContent.classList.remove('hidden');
                triggerAnimations();
            }, 500);
            
            loginError.classList.add('hidden');
        } else {
            loginError.classList.remove('hidden');
            // Add shake animation to login form
            loginForm.style.animation = 'shake 0.5s ease-in-out';
            setTimeout(() => {
                loginForm.style.animation = '';
            }, 500);
        }
    });
});

// Function to trigger animations when content loads
function triggerAnimations() {
    // Trigger hero animations
    const heroElements = document.querySelectorAll('.fade-in');
    heroElements.forEach((element, index) => {
        setTimeout(() => {
            element.classList.add('visible');
        }, index * 200);
    });
    
    // Trigger card animations
    const cardElements = document.querySelectorAll('.scale-in');
    cardElements.forEach((element, index) => {
        setTimeout(() => {
            element.classList.add('visible');
        }, 600 + (index * 150));
    });
    
    // Initialize or resume shader background if available
    if (window.aiLabsShader && window.aiLabsShader.resume) {
        window.aiLabsShader.resume();
    }

}

// Add CSS for shake animation
const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-5px); }
        75% { transform: translateX(5px); }
    }
`;
document.head.appendChild(style);

// Enhanced logout functionality with smooth transition
function logout() {
    localStorage.removeItem('isLoggedIn');
    const mainContent = document.getElementById('mainContent');
    const loginOverlay = document.getElementById('loginOverlay');
    
    // Smooth transition effect
    mainContent.style.opacity = '0';
    mainContent.style.transition = 'opacity 0.5s ease';
    
    setTimeout(() => {
        mainContent.classList.add('hidden');
        mainContent.style.opacity = '1';
        loginOverlay.style.display = 'flex';
        loginOverlay.style.opacity = '0';
        
        setTimeout(() => {
            loginOverlay.style.opacity = '1';
        }, 50);
    }, 500);
}

// Add this function to your existing main.js
function navigateToApp(url) {
    if (localStorage.getItem('isLoggedIn') === 'true') {
        window.open(url, '_blank');
    } else {
        alert('Please log in to access this application.');
        window.location.href = '/index.html';
    }
}
