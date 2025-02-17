// Wait for the DOM to fully load before executing scripts
document.addEventListener("DOMContentLoaded", function () {
    setupMobileMenu();
    setupNavLinkAnimations();
});

/**
 * Toggles mobile menu visibility when the menu icon is clicked.
 * Ensures elements exist before attaching event listeners.
 */
function setupMobileMenu() {
    const mobileMenu = document.getElementById("mobile-menu");
    const navLinks = document.getElementById("nav-links");

    if (!mobileMenu || !navLinks) {
        console.warn("Mobile menu or nav links not found in the DOM.");
        return;
    }

    mobileMenu.addEventListener("click", function () {
        navLinks.classList.toggle("active"); // Toggle menu visibility
        this.classList.toggle("active"); // Toggle icon animation
    });
}

/**
 * Adds a click effect animation to navigation links.
 * Logs the clicked link text to the console.
 */
function setupNavLinkAnimations() {
    const navLinks = document.querySelectorAll(".nav-link");

    navLinks.forEach(link => {
        link.addEventListener("click", function () {
            console.log(`${this.textContent} Clicked`);

            this.classList.add("nav-click-effect"); // Apply animation

            // Remove animation class after 200ms to reset state
            setTimeout(() => {
                this.classList.remove("nav-click-effect");
            }, 200);
        });
    });
}