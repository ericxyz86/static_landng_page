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

    // Add animation classes to cards
    document.querySelectorAll('.bg-white.rounded-lg').forEach(card => {
        card.classList.add('app-card');
    });

    // Add custom button classes
    document.querySelectorAll('.bg-blue-500').forEach(button => {
        button.classList.add('launch-btn');
    });

    // Intersection Observer for scroll animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1
    });

    // Observe all elements with fade-in class
    const fadeElements = document.querySelectorAll('.fade-in');
    fadeElements.forEach(element => observer.observe(element));
});

// Dark mode functionality
document.addEventListener('DOMContentLoaded', () => {
    const darkModeToggle = document.getElementById('darkModeToggle');
    const lightIcon = document.getElementById('lightIcon');
    const darkIcon = document.getElementById('darkIcon');
    
    // Check for saved dark mode preference
    const darkMode = localStorage.getItem('darkMode') === 'enabled';
    if (darkMode) {
        document.documentElement.classList.add('dark');
        lightIcon.classList.add('hidden');
        darkIcon.classList.remove('hidden');
    }

    darkModeToggle.addEventListener('click', () => {
        // Toggle dark mode
        document.documentElement.classList.toggle('dark');
        
        // Toggle icons
        lightIcon.classList.toggle('hidden');
        darkIcon.classList.toggle('hidden');
        
        // Save preference
        const isDarkMode = document.documentElement.classList.contains('dark');
        localStorage.setItem('darkMode', isDarkMode ? 'enabled' : 'disabled');
    });
});

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
    }

    // Check credentials
    function checkCredentials() {
        const username = usernameInput.value;
        const password = passwordInput.value;
        return username === 'agileintel' && password === '16f2WorldSquare';
    }

    // Handle login form submission
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (checkCredentials()) {
            localStorage.setItem('isLoggedIn', 'true');
            loginOverlay.style.display = 'none';
            mainContent.classList.remove('hidden');
            loginError.classList.add('hidden');
        } else {
            loginError.classList.remove('hidden');
        }
    });
});

// Update logout functionality
function logout() {
    localStorage.removeItem('isLoggedIn');
    const mainContent = document.getElementById('mainContent');
    const loginOverlay = document.getElementById('loginOverlay');
    mainContent.classList.add('hidden');
    loginOverlay.style.display = 'flex';
}
