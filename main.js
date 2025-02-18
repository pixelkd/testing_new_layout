// Wait for the DOM to fully load before executing scripts
document.addEventListener("DOMContentLoaded", function () {
    setupMobileMenu();
    NavLinkActivated();

    loadDefaultSection();
});

/**
 * Simulate clicking the "Storyboards" link on page load.
 * Ensures all related functions execute as if manually clicked.
 */
function loadDefaultSection() {
    const storyboardsLink = document.getElementById('nav-storyboards');

    if (storyboardsLink) {
        console.log("Page loaded: Default to Storyboards list.");
        storyboardsLink.click(); // Simulate click event
    } else {
        console.warn("Storyboards link not found in DOM.");
    }
}


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
        this.classList.toggle("active"); // Toggle menu icon state
    });
}

/**
 * Adds a click effect animation to navigation links.
 * Logs the clicked link text to the console.
 */
function NavLinkActivated() {
    const navLinks = document.querySelectorAll(".nav-link");

    navLinks.forEach(link => {
        link.addEventListener("click", function () {
            console.log(`${this.textContent} clicked`); // Log clicked link text

            this.classList.add("nav-click-effect"); // Apply animation

            // Remove animation class after the animation duration (200ms)
            setTimeout(() => {
                this.classList.remove("nav-click-effect");
            }, 200);

            // Update the list label when clicking Storyboards or Comics links
            if (this.id === "nav-storyboards"){
                loadProjects("story_link");
                updateListLabel("Storyboards List");

            } else if (this.id === "nav-comics") {
                loadProjects("comics_link");
                updateListLabel("Comics List");
            }
        });
    });
}

/**
 * Updates the list label (h2) inside .list_label when switching sections.
 * - Only updates if the current text is different.
 * - Clears existing content before inserting new text.
 */
function updateListLabel(newText){
    const listLabel = document.querySelector(".list_label h2");

    if (!listLabel){
        console.warn("List label element not found in DOM.");
        return;
    }

    // Check if the label already matches the intended text
    if (listLabel.textContent === newText) {
        console.log(`List label is already set to: ${newText}`);
        return;
    }

    // Update the text content
    listLabel.textContent = newText;
    console.log(`Updated list label to: ${newText}`);
}


/**
 * Loads projects dynamically into the sidebar.
 * @param {string} section - "stroy_link" or "comics_link".
 */
function loadProjects(section) {
    console.log(`${section} passed to loadProjects`);

    const listLabel = document.querySelector(".list_label h2");

    //Determine what the label should be based on the type - ternary (conditional) operator
    const expectedLabel = section === "story_link" ? "Storyboards List" : "Comics List";

    const articleList = document.querySelector(".article_list_items");
    
    if (listLabel.textContent === expectedLabel) {
        console.log(`Sidebar already showing: ${expectedLabel}`);
        return;
    }

    //Otherwise, clear the sidebar
    articleList.innerHTML = "";
    console.log(`Cleared the sidebar and prepaired to load ${expectedLabel} projects.`);

    const projects = projectData[section]?.projects;

    if (!projects || projects.length === 0) {
        articleList.innerHTML = `<p>No projects available.</p>`;
        return;
    } else {
        console.log('Projects located.'); // Debugging
    }

    // Warn if more than 4 projects exist
    if (projects.length > 4) {
        console.warn(`More than 4 projects found in ${section}. Consider reducing.`);
    }

    // ::: Loop through each project and create a sidebar element.
    projects.forEach(project => {
        // Create an <a> tag to wrap the project item in
        const projectLink = document.createElement("a");
        projectLink.href = "#"; // Prevent page reloads

        // Create the project container div
        const projectItem = document.createElement("div");
        projectItem.classList.add("article_list_item");

        // Create image element
        const projectImg = document.createElement("img");
        projectImg.classList.add("article_img");
        projectImg.alt = project.title;

        // Set image source or apply placeholder if missing
        if (project.icon) {
            projectImg.src = project.icon;
            projectImg.onerror = () => { projectImg.src = createPlaceholder("failed")};
        } else {
            projectImg.src = createPlaceholder("no_icon");
        }

        // Create title element
        const projectTitle = document.createElement("h3");
        projectTitle.textContent = project.title;

        // Attach elements
        projectItem.appendChild(projectImg);
        projectItem.appendChild(projectTitle);
        projectLink.appendChild(projectItem);
        articleList.appendChild(projectLink);

        projectItem.addEventListener('click', function() {
            console.log(`Project selected: ${project.title}`);
        });
    });

}


/**
 * Create a 16x9 SVG placeholder rectange.
 * @param {string} type - the type of placeholder ("no_icon", "failed", "category_missing", "placeholder").
 * @returns {string} - an SVG string representing the placeholder.
 */
function createPlaceholder(type){
    let color;

    switch (type){
        case "no_icon":
            color = "#808080"; // Gray
            break;
        case "failed":
            color = "#B22222"; // Red
            break;
        case "category_missing":
            color = "#FFD700" // Yellow
            break;
        case "placeholder":
            color = "#1E90FF" // Blue (testing)
            break;
        default:
            color = "#000000" // Black (fallback)
    }

    // Return an SVG element as a data URI
    return `data:image/svg+xml;base64,${btoa(`
        <svg xmlns="http://www.w3.org/2000/svg" width="160" height="90" viewBox="0 0 160 90">
            <rect width="100%" height="100%" fill="${color}" />
            <text x="50%" y="50%" font-size="12" fill="#ffffff" text-anchor="middle" dominant-baseline="middle">${type.toUpperCase()}</text>
        </svg>
    `)}`;    
}

