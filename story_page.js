let currentImageIndex = 0; // Tracks the currently displayed image
let imageSequence = []; // Stores the current project's image sequence
let preloadedImages = {}; // Buffer for preloaded images


/**
 * Loads a storyboard project into the hero section.
 *
 * This function checks if a storyboard slideshow is already loaded. If the requested
 * project is already active, it exits early. Otherwise, it initializes or replaces the
 * slideshow stage and starts the slideshow.
 *
 * @param {Object} project - JSON object containing the project data.
 *    @property {string} project.title - The title of the storyboard project.
 */
function load_storyboard(project) {
    // console.log(`Storyboard project "${project.title}" selected.`);

    // Select the hero section where the slideshow is displayed
    const heroSection = document.querySelector(".hero");

    // Clear all child elements of the hero section (removes previous project content)
    heroSection.replaceChildren();
    // console.log("Hero section cleared for new project.");

    // Check if a slideshow stage already exists
    const existingStage = document.querySelector(".stage_container");

    if (existingStage) {
        // If the existing stage already contains this project, do nothing
        if (existingStage.dataset.activeProject === project.title) {
            // console.log("This project is already loaded. No changes needed.");
            return; // Exit function since no updates are required
        }

        // Otherwise, reinitialize the slideshow with the new project
        // console.log("Stage exists, but loading a new project. Reinitializing slideshow...");
        initializeSlideshow(project);
        return;
    }

    // No existing stage found, so create a new one and initialize the slideshow
    // console.log("No stage found. Creating a new slideshow stage...");
    createSlideshowStage(project);
    initializeSlideshow(project);

}


/**
 * Creates and initializes the slideshow stage inside the hero section.
 * This function dynamically generates the necessary elements for displaying
 * a project's slideshow, including title, stage, instructions, and controls.
 *
 * @param {Object} project - JSON object containing project data.
 */
function createSlideshowStage(project) {
    // console.log("Initializing slideshow stage for project:", project);

    // Select the hero section where the slideshow will be added
    const heroSection = document.querySelector(".hero");
    if (!heroSection) {
        console.error("Hero section not found in the DOM.");
        return;
    }


    // ---------------------- Project Title ----------------------
    // console.log("Creating project title...");
    const projectTitle = document.createElement("div");
    projectTitle.classList.add("project_title");

    // Create <h2> for the project title
    const title_h2 = document.createElement("h2");
    title_h2.textContent = "Project Title";
    projectTitle.appendChild(title_h2);

    // ---------------------- Stage Container ----------------------
    // console.log("Creating stage container...");
    const stageContainer = document.createElement("div");
    stageContainer.classList.add("stage_container");

    // ---------------------- Instructions ----------------------
    // console.log("Adding slideshow instructions...");
    const instructions_div = document.createElement("div");
    instructions_div.classList.add("instructions");

    const instructions_p = document.createElement("p");
    instructions_p.textContent = "Use the navigation buttons, click the image, swipe, or use the scroll wheel to advance through the slideshow.";
    instructions_div.appendChild(instructions_p);

    // ---------------------- Slideshow Stage ----------------------
    // console.log("Creating slideshow stage...");
    const stage = document.createElement("div");
    stage.classList.add("stage");
    stage.addEventListener("click", moveToNextImage);
    stage.addEventListener("wheel", handleScrollNavigation); // Add scroll event
    stage.addEventListener("touchstart", handleTouchStart, { passive: true });
    stage.addEventListener("touchmove", handleTouchMove, { passive: true });
    stage.addEventListener("touchend", handleTouchEnd, { passive: true });

    // Create the slideshow image (initially set to a placeholder)
    const stageImage = document.createElement("img");
    stageImage.classList.add("project_img");
    stageImage.src = createPlaceholder("placeholder");
    stage.appendChild(stageImage);

    // ---------------------- Controls ----------------------
    // console.log("Creating navigation controls...");
    const controls = document.createElement("div");
    controls.classList.add("controls");

    // Previous button
    // console.log("Adding previous button...");
    const prev_button = document.createElement("button");
    prev_button.id = "prev";
    prev_button.textContent = "← Prev";
    prev_button.addEventListener("click", moveToPreviousImage);
    controls.appendChild(prev_button);

    // Next button
    // console.log("Adding next button...");
    const next_button = document.createElement("button");
    next_button.id = "next";
    next_button.textContent = "Next →";
    next_button.addEventListener("click", moveToNextImage);
    controls.appendChild(next_button);

    // Restart button
    // console.log("Adding restart button...");
    const restart_button = document.createElement("button");
    restart_button.id = "restart";
    restart_button.textContent = "Restart";
    restart_button.addEventListener("click", restartSlideshow);
    controls.appendChild(restart_button);

    // ---------------------- Append Elements to DOM ----------------------
    // console.log("Appending elements to the hero section...");
    heroSection.appendChild(projectTitle);
    heroSection.appendChild(stageContainer);

    stageContainer.appendChild(instructions_div);
    stageContainer.appendChild(stage);
    stageContainer.appendChild(controls);

    // console.log("Slideshow stage successfully created!");
    updateNavigationControls
}


/**
 * Initializes the slideshow for a given project.
 *
 * This function updates the project title, sets the initial slideshow image,
 * and initializes the slideshow's data attributes.
 *
 * @param {Object} project - JSON object containing project data.
 *    @property {string} project.title - The title of the project.
 *    @property {Array} project.imageSequence - An array of image URLs for the slideshow.
 */
function initializeSlideshow(project) {
    // console.log(`Initializing slideshow for: "${project.title}"`);

    // ---------------------- Update Project Title ----------------------
    const projectTitle = document.querySelector(".project_title h2");

    if (!projectTitle) {
        console.error("Project title element not found in the DOM.");
        return;
    }

    projectTitle.textContent = project.title || "Untitled Project"; // Use title or fallback

    // ---------------------- Set Initial Slideshow Image ----------------------
    // Store image sequence globally
    imageSequence = project.imageSequence || [];
    currentImageIndex = 0; // Reset to first image

    // Find the image element inside the slideshow stage
    const stageImage = document.querySelector(".project_img");

    if (!stageImage) {
        console.warn("Slideshow image element not found.");
        return;
    }

    // Load the first image or a placeholder if no images exist
    if (imageSequence.length > 0) {
        stageImage.src = imageSequence[currentImageIndex];
    } else {
        stageImage.src = createPlaceholder("failed");
        console.warn("No images found for this project. Using placeholder.");
    }

    // console.log(`First image loaded: ${stageImage.src}`);

    // Ensure correct button visibility at start
    updateNavigationControls();
    preloadImages(); // Preload nearby images
}


function moveToPreviousImage() {
    if (currentImageIndex <= 0) {
        console.warn("Already at the first image. Cannot move backward.");
        return;
    }

    currentImageIndex--; // Move to the previous image
    document.querySelector(".project_img").src = imageSequence[currentImageIndex];

    // console.log(`Moved to previous image: ${imageSequence[currentImageIndex]}`);

    updateNavigationControls(); // Ensure buttons update correctly
    preloadImages(); // Preload images after moving
}


function moveToNextImage() {
    if (currentImageIndex >= imageSequence.length - 1) {
        console.warn("Already at the last image. Cannot move forward.");
        return;
    }

    currentImageIndex++; // Move to the next image
    document.querySelector(".project_img").src = imageSequence[currentImageIndex];

    // console.log(`Moved to next image: ${imageSequence[currentImageIndex]}`);

    updateNavigationControls(); // Ensure buttons update correctly
    preloadImages(); // Preload images after moving
}


function restartSlideshow() {
    if (currentImageIndex === 0) {
        console.warn("Slideshow is already at the first image. Restart not needed.");
        return;
    }

    currentImageIndex = 0; // Reset to first image
    document.querySelector(".project_img").src = imageSequence[currentImageIndex];

    // console.log("Slideshow restarted.");

    updateNavigationControls(); // Ensure button visibility updates
    preloadImages(); // Preload images after moving
}


function updateNavigationControls() {
    const prevButton = document.getElementById("prev");
    const nextButton = document.getElementById("next");
    const restartButton = document.getElementById("restart");

    // Hide "Prev" & "Restart" on the first image
    if (currentImageIndex === 0) {
        prevButton.style.visibility = "hidden";
        restartButton.style.visibility = "hidden";
    } else {
        prevButton.style.visibility = "visible";
        restartButton.style.visibility = "visible";
    }

    // Hide "Next" on the last image
    if (currentImageIndex >= imageSequence.length - 1) {
        nextButton.style.visibility = "hidden";
    } else {
        nextButton.style.visibility = "visible";
    }
}

/**
 * Handles scroll navigation for the slideshow.
 * Scroll Up moves to the next image, Scroll Down moves to the previous image.
 *
 * @param {Event} event - The scroll event triggered by the user.
 */
function handleScrollNavigation(event) {
    event.preventDefault(); // Prevent page scroll

    if (event.deltaY < 0) {
        moveToNextImage(); // Scroll up → Next Image
    } else if (event.deltaY > 0) {
        moveToPreviousImage(); // Scroll down → Previous Image
    }
}

/**
 * Preloads images to ensure smooth transitions.
 */
function preloadImages() {
    if (!imageSequence.length) return;

    preloadedImages = {}; // Reset buffer

    const preloadLimitForward = Math.min(3, imageSequence.length - currentImageIndex - 1);
    const preloadLimitBackward = Math.min(3, currentImageIndex);

    // Preload forward images
    for (let i = 1; i <= preloadLimitForward; i++) {
        const imgSrc = imageSequence[currentImageIndex + i];
        if (!preloadedImages[imgSrc]) {
            const img = new Image();
            img.src = imgSrc;
            preloadedImages[imgSrc] = img;
        }
    }

    // Preload backward images
    for (let i = 1; i <= preloadLimitBackward; i++) {
        const imgSrc = imageSequence[currentImageIndex - i];
        if (!preloadedImages[imgSrc]) {
            const img = new Image();
            img.src = imgSrc;
            preloadedImages[imgSrc] = img;
        }
    }

    // console.log("Preloaded images:", Object.keys(preloadedImages));
}



let touchStartX = 0;
let accumulatedSwipeDistance = 0;
const SWIPE_SENSITIVITY = 20; // Pixels per frame change

/**
 * Detects the start of a touch event.
 * @param {TouchEvent} event - The touch event.
 */
function handleTouchStart(event) {
    touchStartX = event.touches[0].clientX;
    accumulatedSwipeDistance = 0; // Reset accumulated movement
}

/**
 * Detects movement during a touch event (dragging).
 * Updates frames in real-time as the user moves their finger.
 * @param {TouchEvent} event - The touch event.
 */
function handleTouchMove(event) {
    const currentX = event.touches[0].clientX;
    const deltaX = currentX - touchStartX; // Movement since last frame update
    accumulatedSwipeDistance += deltaX; // Add movement to accumulated total
    touchStartX = currentX; // Reset for continuous tracking

    // Determine the number of frames to move
    let framesToMove = Math.floor(Math.abs(accumulatedSwipeDistance) / SWIPE_SENSITIVITY);

    if (framesToMove > 0) {
        for (let i = 0; i < framesToMove; i++) {
            if (accumulatedSwipeDistance > 0) {
                moveToNextImage(); // Move forward
            } else {
                moveToPreviousImage(); // Move backward
            }
        }

        // Reset accumulatedSwipeDistance while keeping any leftover movement
        accumulatedSwipeDistance %= SWIPE_SENSITIVITY;
    }
}
