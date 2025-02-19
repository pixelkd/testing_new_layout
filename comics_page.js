

/**
 * Loads a comic project into the hero section.
 *
 * - If the comics area already exists, checks whether the correct project is loaded.
 * - If the correct project is already loaded, it does nothing.
 * - If the comics layout is set but a different project is needed, it replaces the comic.
 * - If the comics layout does not exist, it clears the hero section, creates the layout, and initializes the project.
 *
 * @param {Object} project - JSON object containing the project data.
 *    @property {string} project.title - The title of the comic project.
 */
function load_comic(project) {
    console.log(`Comic project "${project.title}" selected.`);

    // ---------------------- Check Hero Section ----------------------
    const heroSection = document.querySelector(".hero");
    if (!heroSection) {
        console.error("❌ Hero section not found in the DOM. Cannot load comic.");
        return;
    }

    // Ensure the project title is properly formatted
    const projectTitle = project.title?.trim();
    if (!projectTitle) {
        console.error("❌ Invalid project title. Cannot load comic.");
        return;
    }

    // ---------------------- Check for Existing Comics Layout ----------------------
    const existingLayout = document.querySelector(".comics_container");

    if (existingLayout) {
        // If the layout already contains this project, do nothing
        if (existingLayout.dataset.activeProject === projectTitle) {
            console.log(`Comics project "${projectTitle}" is already loaded. No action taken.`);
            return;
        }

        // Otherwise, replace the existing comic project
        const previousProject = existingLayout.dataset.activeProject || "None";
        console.log(`Replacing existing comic ("${previousProject}") with "${projectTitle}".`);
        
        existingLayout.dataset.activeProject = projectTitle; // Update active project

        // Initialize the new comic project
        initializeComic(project);
        return;
    }

    // ---------------------- Proceed with Comics Layout Creation ----------------------
    console.log(`Setting up new comics layout for "${projectTitle}".`);

    // Clear all child elements of the hero section (removes previous project content)
    heroSection.replaceChildren();

    // Create the comics layout and initialize the project
    createComicsLayout(project);

    // Ensure the new layout exists before modifying the dataset
    const newLayout = document.querySelector(".comics_container");
    if (!newLayout) {
        console.error("❌ Comics layout was not created properly.");
        return;
    }

    newLayout.dataset.activeProject = projectTitle; // Set active project

    // Load the comic project
    initializeComic(project);

    console.log(`Comics project "${projectTitle}" successfully loaded.`);
}


/**
 * Creates and initializes the slideshow stage inside the hero section.
 * 
 * This function dynamically generates the necessary elements for displaying
 * a comic project's layout, including title, stage, instructions, and controls.
 *
 * @param {Object} project - JSON object containing project data.
 */
function createComicsLayout(project){
    // Select the hero section where the slideshow will be added
    const heroSection = document.querySelector(".hero");
    if (!heroSection) {
        console.error("Hero section not found in the DOM.");
        return;
    }

    // ---------------------- Project Title ----------------------
    const projectTitle = document.createElement("div");
    projectTitle.classList.add("project_title");

    // Create <h2> for the project title
    const title_h2 = document.createElement("h2");
    title_h2.textContent = "Project Title";
    projectTitle.appendChild(title_h2);

    // ---------------------- Stage Container ----------------------
    const comics_container = document.createElement('div');
    comics_container.classList.add("comics_container");
    
    // ---------------------- Instructions ----------------------
    const instructions_div = document.createElement("div");
    instructions_div.classList.add("instructions");

    const instructions_p = document.createElement("p");
    instructions_p.textContent = "Tap/click edges to turn pages. Use arrow keys or buttons.";
    instructions_div.appendChild(instructions_p);

    // ---------------------- Comic Stage ----------------------
    const comic_stage = document.createElement("div");
    comic_stage.classList.add("comic_stage");
    // ** TO DO: Attach event listeners as functionality is defined

    // Create the comic book images (initially set to a placeholder)
    const leftImage = document.createElement("img");
    leftImage.classList.add("comic_page", "left");
    leftImage.id = "page1";
    leftImage.src = createPlaceholder("placeholder", 500, 773);

    const rightImage = document.createElement("img");
    rightImage.classList.add("comic_page", "right");
    rightImage.id = "page1";
    rightImage.src = createPlaceholder("placeholder", 500, 773);

    comic_stage.appendChild(leftImage);
    comic_stage.appendChild(rightImage);

    // ---------------------- Controls Section ----------------------
    const controlsContainer = document.createElement("div");
    controlsContainer.classList.add("controls", "comic");

    // ** Toggle Switch Container **
    const toggleContainer = document.createElement("div");
    toggleContainer.classList.add("toggle_container", "comic_toggle");

    const toggleLabel = document.createElement("label");
    toggleLabel.classList.add("toggle_label");
    toggleLabel.textContent = "Spread"; // Default state

    const toggleInput = document.createElement("input");
    toggleInput.type = "checkbox";
    toggleInput.id = "toggle-view";
    toggleInput.classList.add("toggle_input");
    toggleInput.checked = true; // Default to Spread mode
    toggleInput.addEventListener("change", toggleComicLayout);

    const toggleSwitch = document.createElement("span");
    toggleSwitch.classList.add("toggle_slider");

    const toggleWrapper = document.createElement("label");
    toggleWrapper.classList.add("toggle_wrapper");
    toggleWrapper.appendChild(toggleInput);
    toggleWrapper.appendChild(toggleSwitch);

    toggleContainer.appendChild(toggleLabel);
    toggleContainer.appendChild(toggleWrapper);

    // ** Navigation Buttons Container **
    const navButtonsContainer = document.createElement("div");
    navButtonsContainer.classList.add("nav_buttons");

    const prev_page_bttn = document.createElement("button");
    prev_page_bttn.id = "prev-page";
    prev_page_bttn.textContent = "◀ Prev";
    navButtonsContainer.appendChild(prev_page_bttn);

    const next_page_bttn = document.createElement("button");
    next_page_bttn.id = "next-page";
    next_page_bttn.textContent = "Next ▶";
    navButtonsContainer.appendChild(next_page_bttn);


    // ---------------------- Append Elements to DOM ----------------------
    controlsContainer.appendChild(toggleContainer);
    controlsContainer.appendChild(navButtonsContainer);

    heroSection.appendChild(projectTitle);
    heroSection.appendChild(comics_container);

    comics_container.appendChild(instructions_div);
    comics_container.appendChild(comic_stage);

    comics_container.appendChild(controlsContainer);

    // ---------------------- Apply User’s Preferred Layout ----------------------
    const preferredLayout = localStorage.getItem("comicLayout") || "spread";
    //applyComicLayout(preferredLayout);
}


function toggleComicLayout(event) {
    const comicStage = document.querySelector(".comic_stage");
    const toggleLabel = document.querySelector(".toggle_label");
    const toggleInput = event.target;

    if (!comicStage || !toggleLabel) return;

    if (toggleInput.checked) {
        // Switch to Spread Mode
        comicStage.classList.remove("single-page");
        comicStage.classList.add("spread");
        toggleLabel.textContent = "Spread";
        localStorage.setItem("comicLayout", "spread");
    } else {
        // Switch to Single Page Mode
        comicStage.classList.remove("spread");
        comicStage.classList.add("single-page");
        toggleLabel.textContent = "Single";
        localStorage.setItem("comicLayout", "single-page");
    }
}

function initializeComic(project){
    console.log(`Called to initialize comics project ${project.title}`);
}


function updateComicStageSize() {
    const comicStage = document.querySelector(".comic_stage");
    if (!comicStage) {
        console.error("❌ .comic_stage element not found.");
        return;
    }

    // Get window dimensions
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    // Define max percentage values based on screen size
    let maxHeightPercentage, maxWidthPercentage;

    if (windowWidth >= 768) {
        // Standard desktop layout
        maxHeightPercentage = 0.50; // 60% of height
        maxWidthPercentage = 0.75;  // 80% of width
    } else {
        // Mobile layout (aside moves to the top)
        maxHeightPercentage = 1; // 50% of height
        maxWidthPercentage = 0.9;   // 90% of width
    }

    // Compute the maximum height allowed for comic_stage
    const maxStageHeight = windowHeight * maxHeightPercentage;

    // Compute width based on 16:9 aspect ratio constraint
    const widthBasedOnHeight = maxStageHeight * (16 / 9);

    // Compute the maximum width allowed
    const maxStageWidth = windowWidth * maxWidthPercentage;

    // Use the smaller value to ensure it fits within both constraints
    const finalWidth = Math.min(widthBasedOnHeight, maxStageWidth);

    // Apply the new width dynamically
    comicStage.style.width = `${finalWidth}px`;

    console.log(`📏 .comic_stage width updated: ${finalWidth}px (Window: ${windowWidth}x${windowHeight}, Mode: ${windowWidth < 768 ? "Mobile" : "Desktop"})`);
}

// Run function on page load
window.addEventListener("load", updateComicStageSize);

// Run function on resize to adapt dynamically
window.addEventListener("resize", updateComicStageSize);
