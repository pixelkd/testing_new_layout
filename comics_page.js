let pairedPages = [];     // Stores paired pages
let activePairIndex = 0;  // Tracks the current pair index
let activePageIndex = 0;  // Tracks the active page in the pair (0 or 1)
let coverStyle = false;

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
        updateComicControls();
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
    updateComicControls();
    
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
    instructions_p.textContent = "";
    instructions_div.appendChild(instructions_p);

    // ---------------------- Comic Stage ----------------------
    const comic_stage = document.createElement("div");
    comic_stage.classList.add("comic_stage");
    // ** TO DO: Attach event listeners as functionality is defined

    // ** Pair Placeholders for Cover-Style Layout **
    const mockSequence = [
        createPlaceholder("custom", 500, 773), // Left placeholder
        createPlaceholder("placeholder", 500, 773) // Right placeholder
    ];

    const pairedPlaceholders = createPagePairs(mockSequence);

    // Create image elements for the placeholder pair
    const leftImage = document.createElement("img");
    leftImage.classList.add("comic_page", "left");
    leftImage.src = pairedPlaceholders[0].pair[0];
    leftImage.alt = "Placeholder Left";

    const rightImage = document.createElement("img");
    rightImage.classList.add("comic_page", "right");
    rightImage.src = pairedPlaceholders[0].pair[1];
    rightImage.alt = "Placeholder Right";

    // Append images to the stage
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
    toggleLabel.textContent = (localStorage.getItem("comicLayout") === "spread") ? "Spread": "Single" ; // Default state

    const toggleInput = document.createElement("input");
    toggleInput.type = "checkbox";
    toggleInput.id = "toggle-view";
    toggleInput.classList.add("toggle_input");
    localStorage.setItem("comicLayout", "spread");

    toggleInput.checked = (localStorage.getItem("comicLayout") === "spread") ? true : false ;
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

    // Previous Page Button
    const prev_page_bttn = document.createElement("button");
    prev_page_bttn.id = "prev-page";
    prev_page_bttn.textContent = "◀ Prev";
    prev_page_bttn.style.visibility = "hidden";
    prev_page_bttn.addEventListener("click", moveToPreviousPage);  // Attach Event Listener
    controlsContainer.appendChild(prev_page_bttn);

    // Next Page Button
    const next_page_bttn = document.createElement("button");
    next_page_bttn.id = "next-page";
    next_page_bttn.textContent = "Next ▶";
    next_page_bttn.addEventListener("click", moveToNextPage);  // Attach Event Listener
    controlsContainer.appendChild(next_page_bttn);


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

function initializeComic(project){
    console.log(`Called to initialize comics project ${project.title}`);

    // ---------------------- Update Project Title ----------------------
    const projectTitle = document.querySelector(".project_title h2");

    if (!projectTitle) {
        console.error("Project title element not found in the DOM.");
        return;
    }

    projectTitle.textContent = project.title || "Untitled Project"; // Use title or fallback

    if (project.type === "cover-style"){
        coverStyle = true;
    } else {coverStyle = false;}

    // Pair pages based on project type
    pairedPages =  createPagePairs(project.imageSequence);

    // Render the first pair
    renderComicPage(activePairIndex);
}

/**
 * Pairs comic pages into spreads with appropriate placeholders.
 * Handles both "cover-style" and "in_medias_res" project types.
 *
 * - Cover Style: Adds a placeholder before the first page and sets activeIndex to 1 for the first pair.
 * - Even Pairing: Ensures all pages are paired, adding a placeholder if needed.
 * - Stores pairs with an activeIndex for precise navigation and view switching.
 * 
 * @param {Array} imageSequence - Array of image URLs for the comic pages.
 * @param {String} type - Type of comic project ("cover-style" or "in_medias_res").
 * @returns {Array} pairedPages - Array of objects containing pairs and activeIndex.
 */
function createPagePairs(imageSequence) {
    let pairedPages = [];
    let sequence = [...imageSequence]; // Create a copy of the image sequence

    // ---------------------- 1. Handle Cover Style ----------------------
    if (coverStyle) {
        // Add placeholder at the beginning for cover-style
        sequence.unshift(createPlaceholder("custom", 500, 773));
    }

    // ---------------------- 2. Ensure Even Number of Pages ----------------------
    if (sequence.length % 2 !== 0) {
        // Add a placeholder to make it even
        sequence.push(createPlaceholder("custom", 500, 773));
    }

    // ---------------------- 3. Pair Pages ----------------------
    for (let i = 0; i < sequence.length; i += 2) {
        // Create a pair of two pages
        let pair = [sequence[i], sequence[i + 1]];

        // Check if it's the first pair for cover-style
        let activeIndex = (coverStyle === true && i === 0) ? 1 : 0;

        // Store pair with activeIndex
        pairedPages.push({
            pair: pair,
            activeIndex: activeIndex
        });
    }

    // ---------------------- 4. Initialize Active Pair ----------------------
    activePairIndex = 0; // Start with the first pair
    activePageIndex = pairedPages[0].activeIndex; // Start with the active index of the first pair

    console.log("📖 Paired Pages:", pairedPages);
    return pairedPages;
}


/**
 * Renders the current pair of comic pages on the stage.
 * 
 * - In Spread Mode: Displays both pages of the active pair.
 * - In Single Page Mode: Displays the active page of the active pair.
 * - Handles placeholders seamlessly for even layout.
 * - Ensures no layout shift occurs during transitions.
 * 
 * @param {Number} toRender - Index of the pair to render.
 */
function renderComicPage(toRender) {
    const comicStage = document.querySelector(".comic_stage");
    if (!comicStage) {
        console.error("❌ .comic_stage element not found.");
        return;
    }

    // Get the pair to render
    const currentPair = pairedPages[toRender];
    if (!currentPair) {
        console.error(`❌ No pair found at index ${toRender}`);
        return;
    }

    // Determine layout mode
    const isSpreadMode = localStorage.getItem("comicLayout") === "spread";

    // ---------------------- Spread Mode ----------------------
    if (isSpreadMode) {
        // Clear and re-render both pages for the spread
        comicStage.innerHTML = "";

        currentPair.pair.forEach((pageSrc, index) => {
            const pageImage = document.createElement("img");
            pageImage.classList.add("comic_page", index === 0 ? "left" : "right");
            pageImage.src = pageSrc;
            comicStage.appendChild(pageImage);
        });
    }

    // ---------------------- Signle Page Mode ------------------------
    else {
        // If active page is already displayed, do nothing
        const currentDisplayed = document.querySelector(".comic_page.centered");
        if (currentDisplayed && currentDisplayed.src === currentPair.pair[activePageIndex]) {
            return;
        }

        // Otherwise, clear and re-render the active page
        comicStage.innerHTML = "";

        const activePageSrc = currentPair.pair[activePageIndex];
        const pageImage = document.createElement("img");
        pageImage.classList.add("comic_page"); // Currently missing class ID "centered", due to css issues with Class
        pageImage.src = activePageSrc;
        comicStage.appendChild(pageImage);

        // ------------------------ Update Navigation Controls ------------

        updateComicControls();

        console.log(`📖 Rendered Pair Index: ${toRender}, Active Index: ${currentPair.activeIndex}`);
    }

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

    // Re-render the current page/pair
    renderComicPage(activePairIndex);
    updateComicControls();
}

/**
 * Moves to the next page or pair in the comic layout.
 * 
 * - In Spread Mode: Advances to the next pair.
 * - In Single Page Mode: Advances to the next page in the pair, then to the next pair.
 */
function moveToNextPage() {
    const isSpreadMode = localStorage.getItem("comicLayout") === "spread";

    if (isSpreadMode) {
        // In Spread Mode, advance to the next pair
        if (activePairIndex < pairedPages.length - 1) {
            activePairIndex++;
            renderComicPage(activePairIndex);
            activePageIndex = 0;
        }
    } else {
        // In Single Page Mode, advance within the current pair first
        if (activePageIndex < 1) {
            activePageIndex++;
        } else if (activePairIndex < pairedPages.length - 1) {
            activePairIndex++;
            activePageIndex = 0;
        }
        renderComicPage(activePairIndex);
    }

    updateComicControls();
}

/**
 * Moves to the previous page or pair in the comic layout.
 * 
 * - In Spread Mode: Moves to the previous pair.
 * - In Single Page Mode: Moves to the previous page in the pair, then to the previous pair.
 */
function moveToPreviousPage() {
    const isSpreadMode = localStorage.getItem("comicLayout") === "spread";

    // ---------------------- Spread Mode ----------------------
    if (isSpreadMode) {
        // Move to Previous Pair if Possible
        if (activePairIndex > 0) {
            activePairIndex--;

            // Check if First Page of Pair is a Placeholder
            const currentPair = pairedPages[activePairIndex];
            if (isSVGPlaceholder(currentPair.pair[0])) {
                activePageIndex = 1; // Skip Placeholder, Show Second Page
            } else {
                activePageIndex = 0; // Otherwise, Show First Page
            }
            renderComicPage(activePairIndex);
        }
    }
    // ---------------------- Single Page Mode ----------------------
    else {
        // Move within the Current Pair First
        if (activePageIndex > 0) {
            activePageIndex--;
        }
        // Otherwise, Move to the Previous Pair
        else if (activePairIndex > 0) {
            activePairIndex--;
            activePageIndex = 1; // Go to Second Page of Previous Pair
        }

        renderComicPage(activePairIndex);
    }

    // Update Navigation Controls
    updateComicControls();
}

/**
 * Updates the visibility of navigation buttons based on the current page state.
 * 
 * - Hides the Prev button on the first page.
 * - Hides the Next button on the last page.
 */
function updateComicControls() {
    const prevButton = document.getElementById("prev-page");
    const nextButton = document.getElementById("next-page");

    // Check if in Spread Mode or Single Page Mode
    const isSpreadMode = localStorage.getItem("comicLayout") === "spread";

    // Get the current spread and page index
    const currentPair = pairedPages[activePairIndex];

    // Helper to check if a page is a placeholder
    const isPlaceholder = (page) => {
        return page && page.includes("data:image/svg+xml;base64");
    };
    
    const rightPlaceholder = isSVGPlaceholder(currentPair.pair[1]);
    const leftPlaceholder = isSVGPlaceholder(currentPair.pair[0]);

    // ---------------------- Spread Mode ----------------------
    console.log(`👩🏽‍🤝‍👩🏻 active pair index ${activePairIndex} `);
    console.log(rightPlaceholder);
        

    // Hide Prev Button on First Page
    if (activePairIndex === 0 && activePageIndex === 0) {
        prevButton.style.visibility = "hidden";
    } else {
        prevButton.style.visibility = "visible";
    }

    // Hide Next Button on Last Page
    if (isSpreadMode) {
        if (activePairIndex >= pairedPages.length - 1) {
            nextButton.style.visibility = "hidden";
        } else {
            nextButton.style.visibility = "visible";
        }
    } else {
        if (activePairIndex >= pairedPages.length - 1 && activePageIndex === 1) {
            nextButton.style.visibility = "hidden";
        } else {
            nextButton.style.visibility = "visible";
        }
    }

    // ------------------------ Dealing with placeholders ------------------------
    if (rightPlaceholder){
            nextButton.style
        .visibility = "hidden";
    }

    if (leftPlaceholder){
        prevButton.style
    .visibility = "hidden";
    }
}



// Run function on page load
// window.addEventListener("load", updateComicStageSize);

// Run function on resize to adapt dynamically
// window.addEventListener("resize", updateComicStageSize);

// Check if a given image source is an SVG placeholder
function isSVGPlaceholder(imageSrc) {
    return imageSrc.includes("data:image/svg+xml;base64");
}

