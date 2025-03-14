document.addEventListener('DOMContentLoaded', function() {
    // Add a simple animation to the header
    const header = document.querySelector('header');
    header.style.opacity = 0;
    
    setTimeout(() => {
        header.style.transition = 'opacity 1s ease-in-out';
        header.style.opacity = 1;
    }, 300);
    
    // Make the CTA button interactive
    const ctaButton = document.querySelector('.cta-button');
    ctaButton.addEventListener('click', function() {
        alert('Welcome to Matcha.fun! Our full experience is coming soon.');
    });
});