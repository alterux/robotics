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
function updateThemeToggleText() {
    const isDarkMode = document.body.classList.contains('dark-mode');
    const toggleText = isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode';
    const toggleIcon = isDarkMode ? '☀️' : '🌙';
    
    const themeToggles = document.querySelectorAll('.theme-toggle');
    themeToggles.forEach(toggle => {
        toggle.innerHTML = `${toggleIcon} <span>${toggleText}</span>`;
    });
}

function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    const theme = document.body.classList.contains('dark-mode') ? 'dark-mode' : 'light-mode';
    localStorage.setItem('theme', theme);
    updateThemeToggleText();
}

document.addEventListener("DOMContentLoaded", function() {
    console.log('DOM fully loaded and parsed');
    
    // Background image rotation
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

    // Start the background animation
    changeBackground();

    // Load header content
    fetch('header.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('header-placeholder').innerHTML = data;
            setupNavigation();
            highlightCurrentPage(); // Add this line to highlight the current page after loading the header
        })
        .catch(error => console.error('Error loading header:', error));

    // Load footer content
    fetch('footer.html')
        .then(response => response.text())
        .then(data => {
            const footer = document.querySelector('footer');
            if (footer) {
                footer.innerHTML = data;
                const themeToggles = document.querySelectorAll('.theme-toggle');
                themeToggles.forEach(toggle => {
                    toggle.addEventListener('click', toggleTheme);
                });
                updateThemeToggleText();
            }
        })
        .catch(error => console.error('Error loading footer:', error));

    // Initial theme setup
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        document.body.classList.add(savedTheme);
    }
    updateThemeToggleText();

    // Add index-page class to body if on index page
    if (window.location.pathname.endsWith('index.html') || window.location.pathname.endsWith('/')) {
        document.body.classList.add('index-page');
    }
});

function setupNavigation() {
    const headerContainer = document.querySelector('header .container');
    if (!headerContainer) {
        console.error('Header container not found');
        return;
    }

    // Create hamburger button
    const hamburger = document.createElement('button');
    hamburger.classList.add('hamburger');
    hamburger.innerHTML = '<div></div><div></div><div></div>';
    document.body.appendChild(hamburger);

    // Create nav overlay
    const navOverlay = document.createElement('div');
    navOverlay.classList.add('nav-overlay');
    document.body.appendChild(navOverlay);

    // Clone nav links and add to overlay
    const navLinks = headerContainer.querySelector('.nav-links');
    if (navLinks) {
        const clonedNavLinks = navLinks.cloneNode(true);
        navOverlay.appendChild(clonedNavLinks);
    }

    // Clone home button and add to overlay
    const homeButton = document.getElementById('home-button');
    if (homeButton) {
        const clonedHomeButton = homeButton.cloneNode(true);
        clonedHomeButton.id = 'overlay-home-button';
        navOverlay.insertBefore(clonedHomeButton, navOverlay.firstChild);
    }

    // Add mobile theme toggle to overlay
    const mobileThemeToggle = document.createElement('button');
    mobileThemeToggle.id = 'mobile-theme-toggle';
    mobileThemeToggle.classList.add('theme-toggle');
    mobileThemeToggle.innerHTML = '🌙 <span>Switch to Dark Mode</span>';
    mobileThemeToggle.addEventListener('click', toggleTheme);
    navOverlay.appendChild(mobileThemeToggle);

    const isIndexPage = document.body.classList.contains('index-page');

    function updateHomeButtonVisibility() {
        const homeButton = document.getElementById('home-button');
        const navLinks = document.querySelector('.nav-links');
        const isIndexPage = document.body.classList.contains('index-page');
        const scrollPosition = window.scrollY;

        if (!homeButton || !navLinks) return;

        if (isIndexPage) {
            if (scrollPosition > 100) {
                homeButton.classList.remove('hidden');
                navLinks.style.transform = 'translateX(0)';
            } else {
                homeButton.classList.add('hidden');
                navLinks.style.transform = `translateX(-${homeButton.offsetWidth}px)`;
            }
        } else {
            homeButton.classList.remove('hidden');
            navLinks.style.transform = 'translateX(0)';
        }
    }

    // Modify home button click behavior on index page
    if (document.body.classList.contains('index-page') && homeButton) {
        homeButton.addEventListener('click', function(e) {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    function toggleMenu() {
        hamburger.classList.toggle('open');
        navOverlay.classList.toggle('open');
        
        if (navOverlay.classList.contains('open')) {
            navOverlay.style.display = 'flex';
            document.body.style.overflow = 'hidden'; // Prevent scrolling when menu is open
            setTimeout(() => {
                navOverlay.style.opacity = '1';
            }, 10);
        } else {
            navOverlay.style.opacity = '0';
            document.body.style.overflow = ''; // Restore scrolling when menu is closed
            setTimeout(() => {
                navOverlay.style.display = 'none';
            }, 300);
        }

        updateHomeButtonVisibility();
        updateThemeToggleText(); // Update theme toggle text when menu is opened/closed
    }

    // Add event listeners
    hamburger.addEventListener('click', toggleMenu);
    navOverlay.addEventListener('click', (event) => {
        if (event.target === navOverlay) {
            toggleMenu();
        }
    });

    function updateHamburgerVisibility() {
        if (window.innerWidth <= 768) {
            hamburger.style.display = 'flex';
        } else {
            hamburger.style.display = 'none';
            navOverlay.classList.remove('open');
            hamburger.classList.remove('open');
        }
    }

    // Initialize visibility and add listeners
    updateHomeButtonVisibility();
    updateHamburgerVisibility();
    window.addEventListener('scroll', updateHomeButtonVisibility);
    window.addEventListener('resize', updateHamburgerVisibility);
}

// Call setupNavigation after the DOM is fully loaded
document.addEventListener('DOMContentLoaded', setupNavigation);

// Add this function outside of any other function
function highlightCurrentPage() {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-links a, .nav-overlay a');
    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentPath.split('/').pop()) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navOverlay = document.querySelector('.nav-overlay');

    hamburger.addEventListener('click', function() {
        navOverlay.classList.toggle('open');
        hamburger.classList.toggle('open');
    });
});