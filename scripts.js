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

            // Add these lines to handle the hamburger menu
            const headerContainer = document.querySelector('header .container');
            if (headerContainer) {
                const hamburger = document.createElement('button');
                hamburger.classList.add('hamburger');
                hamburger.innerHTML = '<div></div><div></div><div></div>';
                headerContainer.appendChild(hamburger);

                const navOverlay = document.createElement('div');
                navOverlay.classList.add('nav-overlay');
                document.body.appendChild(navOverlay);

                const navLinks = document.querySelector('.nav-links').cloneNode(true);
                navOverlay.appendChild(navLinks);

                // Add a close button inside the overlay
                const closeButton = document.createElement('button');
                closeButton.classList.add('close-button');
                closeButton.innerHTML = '&times;';
                navOverlay.appendChild(closeButton);

                console.log('Hamburger, nav overlay, and close button added to DOM'); // Debugging line

                hamburger.addEventListener('click', () => {
                    console.log('Hamburger clicked'); // Debugging line
                    hamburger.classList.toggle('open');
                    navOverlay.classList.toggle('open');
                });

                closeButton.addEventListener('click', () => {
                    console.log('Close button clicked'); // Debugging line
                    hamburger.classList.remove('open');
                    navOverlay.classList.remove('open');
                });
            } else {
                console.error('header .container not found in the DOM');
            }
        })
        .catch(error => console.error('Error loading header:', error));
});

// Add index-page class to body if on index page
document.addEventListener('DOMContentLoaded', () => {
    if (window.location.pathname.endsWith('index.html')) {
        document.body.classList.add('index-page');
    }
});