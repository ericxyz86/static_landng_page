// Authentication check
function checkAuth() {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    if (!isLoggedIn) {
        window.location.href = '/index.html';
    }
    return isLoggedIn;
}

// Prevent direct URL access
function initAuthCheck() {
    // List of protected paths/domains
    const protectedPaths = [
        'appstore-reviews-extraction.onrender.com',
        'playstore-reviews-extraction.onrender.com',
        'social-media-txt-csv.onrender.com',
        'appscript.html',
        'privacy-policy.html'
    ];

    // Check if current URL is protected
    const currentURL = window.location.href;
    const isProtected = protectedPaths.some(path => currentURL.includes(path));

    if (isProtected) {
        return checkAuth();
    }
    return true;
}

// Run auth check immediately
initAuthCheck(); 