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
    let tempToggle = 0;
    const storyboardsLink = document.getElementById('nav-storyboards');
    //nav-comics
    const comicsLink = document.getElementById('nav-comics');

    if (tempToggle === 0){
        if (storyboardsLink) {
            console.log("Page loaded: Default to Storyboards list.");
            storyboardsLink.click(); // Simulate click event
        } else {
            console.warn("Storyboards link not found in DOM.");
        }
    } else {
        if (storyboardsLink) {
            console.log("Page loaded: Default to Comics list.");
            comicsLink.click(); // Simulate click event
        } else {
            console.warn("Comics link not found in DOM.");
        }
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
/**
 * Loads projects dynamically into the sidebar and auto-selects the first one.
 * @param {string} section - "story_link" or "comics_link".
 */
function loadProjects(section) {
    const articleList = document.querySelector(".article_list_items");

    if (!articleList) {
        console.warn("Sidebar list container is missing.");
        return;
    }

    // Retrieve the correct projects
    const projects = projectData[section]?.projects;

    // Handle empty projects
    if (!projects || projects.length === 0) {
        articleList.innerHTML = `<p>No projects available.</p>`;
        return;
    }

    // Warn if more than 4 projects exist
    if (projects.length > 4) {
        console.warn(`More than 4 projects found in ${section}. Consider reducing.`);
    }

    // Clear existing sidebar content
    articleList.innerHTML = "";

    let firstProjectItem = null; // Store reference to first project

    // Loop through projects and create sidebar elements
    projects.forEach((project, index) => {
        // Create the clickable link wrapper
        const projectLink = document.createElement("a");
        projectLink.href = "#";

        // Create the project container
        const projectItem = document.createElement("div");
        projectItem.classList.add("article_list_item");

        // Create the image element
        const projectImg = document.createElement("img");
        projectImg.classList.add("article_img");
        projectImg.alt = project.title;

        // Set the image source or a placeholder
        if (project.icon) {
            projectImg.src = project.icon;
            projectImg.onerror = () => { projectImg.src = createPlaceholder("failed"); };
        } else {
            projectImg.src = createPlaceholder("no_icon");
        }

        // Create the project title
        const projectTitle = document.createElement("h3");
        projectTitle.textContent = project.title;

        // Attach elements
        projectItem.appendChild(projectImg);
        projectItem.appendChild(projectTitle);
        projectLink.appendChild(projectItem);
        articleList.appendChild(projectLink);

        // Attach click event to apply the "selected" effect
        projectItem.addEventListener("click", function () {
            handleProjectSelection(projectItem, project, section);
        });

        // Store the first project for auto-selection
        if (index === 0) {
            firstProjectItem = projectItem;
        }
    });

    // Auto-select the first project
    if (firstProjectItem) {
        firstProjectItem.click();
    }
}

/**
 * Handles project selection, applying the "selected" effect and triggering content loading.
 * @param {HTMLElement} selectedItem - The clicked project element.
 * @param {Object} project - The project data object.
 * @param {string} section - "story_link" or "comics_link".
 */
function handleProjectSelection(selectedItem, project, section) {
    // Remove "selected" from all sidebar items
    document.querySelectorAll(".article_list_item").forEach(item => {
        item.classList.remove("selected");
    });

    // Apply "selected" effect to the clicked project
    selectedItem.classList.add("selected");

    // Determine which function to call
    if (section === "story_link") {
        load_storyboard(project);
    } else if (section === "comics_link") {
        load_comic(project);
    }
}



