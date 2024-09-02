const backgroundElement = document.querySelector('.background-image');
const images = [
    'media/assembly1.webp',
    'media/assembly2.webp',
    'media/seven.webp',
];
let currentIndex = 0;

function changeBackground() {
    backgroundElement.style.opacity = 0;
    
    setTimeout(() => {
        backgroundElement.style.backgroundImage = `url(${images[currentIndex]})`;
        backgroundElement.style.opacity = 0.5;
        
        currentIndex = (currentIndex + 1) % images.length;
        
        setTimeout(() => {
            backgroundElement.style.opacity = 0;
            
            setTimeout(changeBackground, 1000);
        }, 5000);
    }, 1000);
}

// Start the animation
changeBackground();

// Theme toggle functionality
const themeToggle = document.getElementById('theme-toggle');
const currentTheme = localStorage.getItem('theme');
if (currentTheme) {
    document.body.classList.add(currentTheme);
}

themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    const theme = document.body.classList.contains('dark-mode') ? 'dark-mode' : 'light-mode';
    localStorage.setItem('theme', theme);
});

// Load header content
document.addEventListener("DOMContentLoaded", function() {
    console.log('DOM fully loaded and parsed');
    fetch('header.html')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.text();
        })
        .then(data => {
            console.log('Header content fetched successfully');
            document.getElementById('header-placeholder').innerHTML = data;
        })
        .catch(error => console.error('Error loading header:', error));
});