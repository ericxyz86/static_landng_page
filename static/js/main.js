// Theme toggle
function toggleTheme() {
  var isDark = document.documentElement.classList.toggle('dark');
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
  updateThemeIcon(isDark);
}

function updateThemeIcon(isDark) {
  var sun = document.getElementById('icon-sun');
  var moon = document.getElementById('icon-moon');
  if (sun && moon) {
    sun.style.display = isDark ? 'block' : 'none';
    moon.style.display = isDark ? 'none' : 'block';
  }
}

document.addEventListener('DOMContentLoaded', function () {
  updateThemeIcon(document.documentElement.classList.contains('dark'));
});

// Navigate to app in new tab
function navigateToApp(url) {
  window.open(url, '_blank', 'noopener,noreferrer');
}
