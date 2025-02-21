let currentImageIndex = 0; // Tracks the currently displayed image
let imageSequence = []; // Stores the current project's image sequence
let preloadedImages = {}; // Buffer for preloaded images

let touchStartX = 0;
let accumulatedSwipeDistance = 0;
const SWIPE_SENSITIVITY = 20; // Pixels per frame change

/**
 * Loads a storyboard project into the hero section.
 *
 * - If the storyboard area already exists, checks whether the correct project is loaded.
 * - If the correct project is already loaded, it does nothing.
 * - If the stage is set but a different project is needed, it reinitializes the slideshow.
 * - If the stage does not exist, it clears the hero section, creates the stage, and initializes the project.
 *
 * @param {Object} project - JSON object containing the project data.
 *    @property {string} project.title - The title of the storyboard project.
 */
function load_storyboard(project) {
    console.log(`Storyboard project ${project.title} selected.`);

    // ---------------------- Check Hero Section ----------------------
    const heroSection = document.querySelector(".hero");

    if (!heroSection) {
        console.error("❌ Hero section not found in the DOM. Cannot load storyboard.");
        return;
    }

    // Ensure the project title is properly formatted
    const projectTitle = project.title?.trim();
    if (!projectTitle) {
        console.error("❌ Invalid project title. Cannot load storyboard.");
        return;
    }

    // ---------------------- Check for Existing Stage ----------------------
    const existingStage = document.querySelector(".stage_container");

    if (existingStage) {
        // If the existing stage already contains this project, do nothing
        if (existingStage.dataset.activeProject === projectTitle) {
            console.log(`Storyboard project "${projectTitle}" is already loaded. No action taken.`);
            return;
        }

        // Otherwise, reinitialize the slideshow with the new project
        const previousProject = existingStage.dataset.activeProject || "None";
        console.log(`Replacing existing storyboard project("${previousProject}") with "${projectTitle}".`);
        existingStage.dataset.activeProject = projectTitle; // Track loaded project
        loadStoryboard(project);
        return;
    }

    // ---------------------- Proceed with Slideshow Creation ----------------------
    console.log(`Setting up new storyboard stage for "${projectTitle}".`);
    
    // Clear hero section to prepare for the new layout
    heroSection.replaceChildren();
    console.log("hero cleared");

    // Create and initialize the slideshow stage
    initializeStoryStage(project);
    console.log("stage created");

    // Load in the storyboard project
    console.log("calling initialize slideshow...");
    loadStoryboard(project);
    console.log("Slideshow loaded");

    

    // Assign the new project to the dataset
    document.querySelector(".stage_container").dataset.activeProject = projectTitle;


    console.log(`🎬 Storyboard "${projectTitle}" successfully loaded.`);
}




/**
 * Creates and initializes the slideshow stage inside the hero section.
 * 
 * This function dynamically generates the necessary elements for displaying
 * a storyboard project's slideshow, including title, stage, instructions, and controls.
 *
 * @param {Object} project - JSON object containing project data.
 */
function initializeStoryStage(project) {
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
    const stageContainer = document.createElement("div");
    stageContainer.classList.add("stage_container");

    stageContainer.addEventListener("wheel", handleScrollNavigation);
    stageContainer.addEventListener("touchstart", handleTouchStart, { passive: true });
    stageContainer.addEventListener("touchmove", handleTouchMove, { passive: true });
    stageContainer.addEventListener("touchend", handleTouchEnd, { passive: true });
    
    document.addEventListener("keydown", handleKeyPress);
    // ---------------------- Instructions ----------------------
    const instructions_div = document.createElement("div");
    instructions_div.classList.add("instructions");

    const instructions_p = document.createElement("p");
    if (isTouchDevice) {
        instructions_p.textContent = "Tap or swip to advance sequence.";
    } else {
        instructions_p.textContent = "Navigate with the buttons, arrow keys, touch, or clicking the image.";
    }

    instructions_div.appendChild(instructions_p);

    // ---------------------- Slideshow Stage ----------------------
    const stage = document.createElement("div");
    stage.classList.add("stage");

    // Add event listeners for interaction
    stage.addEventListener("click", moveToNextImage);
    stage.addEventListener("wheel", handleScrollNavigation);
    stage.addEventListener("touchstart", handleTouchStart, { passive: true });
    stage.addEventListener("touchmove", handleTouchMove, { passive: true });
    stage.addEventListener("touchend", handleTouchEnd, { passive: true });
    document.addEventListener("keydown", handleKeyPress);

    // Create the slideshow image (initially set to a placeholder)
    const stageImage = document.createElement("img");
    stageImage.classList.add("project_img");
    stageImage.src = createPlaceholder("placeholder");
    //preventDoubleTapZoom(stageImage); // <-- Disableing double tap zoom?
    stageImage.addEventListener("touchend", handleTouchEnd, { passive: false });
    stage.appendChild(stageImage);

    // ---------------------- Controls ----------------------
    const controls = document.createElement("div");
    controls.classList.add("controls");
    if (isTouchDevice) { controls.addEventListener("touchend", handleTouchEnd, { passive: false });}
    if (isTouchDevice) { controls.classList.add("mobile");}

    // Previous button
    const prev_button = document.createElement("button");
    prev_button.id = "prev";
    prev_button.textContent = "← Prev";
    prev_button.addEventListener("click", moveToPreviousImage);
    prev_button.style.visibility = "visible";
    prev_button.addEventListener("touchend", handleTouchEnd, { passive: false });
    controls.appendChild(prev_button);
    console.log("appended to controls.");
    console.log("storyboard next panel button created, style visibility set to visible, and appended to controls.");

    // Next button
    const next_button = document.createElement("button");
    next_button.id = "next";
    next_button.textContent = "Next →";
    next_button.addEventListener("click", moveToNextImage);
    next_button.style.visibility = "visible";
    next_button.addEventListener("touchend", handleTouchEnd, { passive: false });
    if (isTouchDevice) { next_button.style.visibility = "hidden";}
    controls.appendChild(next_button);
    console.log("storyboard next panel button created, style visibility set to visible, and appended to controls.");
    
    

    // Restart button
    const restart_button = document.createElement("button");
    restart_button.id = "restart";
    restart_button.textContent = "Restart";
    restart_button.addEventListener("click", restartSlideshow);
    restart_button.style.visibility = "visible";

    if(!isTouchDevice){controls.appendChild(restart_button);}
    console.log("storyboard restart sequence button created, style visibility set to visible, and appended to controls.");

    // ---------------------- Append Elements to DOM ----------------------
    heroSection.appendChild(projectTitle);
    heroSection.appendChild(stageContainer);
    
    console.log("stage container appended to hero section.");
    if(isTouchDevice){heroSection.appendChild(restart_button);}

    stageContainer.appendChild(instructions_div);
    stageContainer.appendChild(stage);
    stageContainer.appendChild(controls);
    console.log("controls appended to stage container.");

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
function loadStoryboard(project) {
    console.log("opening slideshow");
    // ---------------------- Update Project Title ----------------------
    const projectTitle = document.querySelector(".project_title h2");
    
    if (!projectTitle) {
        console.error("Project title element not found in the DOM.");
        return;
    }

    projectTitle.textContent = project.title || "Untitled Project"; // Use title or fallback
    console.log("Project title set");

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
    stageImage.src = imageSequence.length > 0 
        ? imageSequence[currentImageIndex] 
        : createPlaceholder("failed");

    if (imageSequence.length === 0) {
        console.warn("No images found for this project. Using placeholder.");
    }

    // ---------------------- Initialize Navigation and Preloading ----------------------
    preloadImages(); // Preload nearby images
    console.log("Images preloaded. updating controls next....");

    updateStoryControls(); // Ensure correct button visibility at start
    console.log("Update controls completed");
}



/**
 * Moves to the previous image in the slideshow.
 * 
 * If already at the first image, a warning is logged and no action is taken.
 */
function moveToPreviousImage() {
    if (currentImageIndex <= 0) {
        return;
    }

    currentImageIndex--; // Move to the previous image
    updateSlideshowImage();

    updateStoryControls(); // Update button visibility
    preloadImages(); // Preload adjacent images
}

/**
 * Moves to the next image in the slideshow.
 * 
 * If already at the last image, a warning is logged and no action is taken.
 */
function moveToNextImage() {
    if (currentImageIndex >= imageSequence.length - 1) {
        return;
    }

    currentImageIndex++; // Move to the next image
    updateSlideshowImage();

    updateStoryControls(); // Update button visibility
    preloadImages(); // Preload adjacent images
}

/**
 * Restarts the slideshow by resetting to the first image.
 * 
 * If already on the first image, a warning is logged and no action is taken.
 */
function restartSlideshow() {
    if (currentImageIndex === 0) {
        return;
    }

    currentImageIndex = 0; // Reset to first image
    updateSlideshowImage();

    updateStoryControls(); // Update button visibility
    preloadImages(); // Preload images after resetting
}

/**
 * Updates the displayed slideshow image based on the current index.
 */
function updateSlideshowImage() {
    const stageImage = document.querySelector(".project_img");

    if (!stageImage) {
        console.error("Slideshow image element not found.");
        return;
    }

    stageImage.src = imageSequence[currentImageIndex];
}



/**
 * Updates the visibility of slideshow navigation buttons based on the current image index.
 * 
 * - Hides "Prev" and "Restart" when viewing the first image.
 * - Hides "Next" when viewing the last image.
 * - Ensures buttons are visible when needed.
 */
function updateStoryControls() {
    console.log("called update navigation controls");
    
    const prevButton = document.getElementById("prev");
    const nextButton = document.getElementById("next");
    const restartButton = document.getElementById("restart");

    if (!prevButton || !nextButton || !restartButton) {
        console.error("❌ One or more navigation buttons are missing in the DOM.");
        return;
    }

    // Hide "Prev" & "Restart" on the first image
    if (currentImageIndex === 0) {
        prevButton.style.visibility = "hidden";
        restartButton.style.visibility = "hidden";
        console.log("⬅️ 'Prev' & 'Restart' buttons hidden (First Image)");
    } else {
        prevButton.style.visibility = "visible";
        restartButton.style.visibility = "visible";
    }

    // Hide "Next" on the last image
    if (currentImageIndex >= imageSequence.length - 1) {
        nextButton.style.visibility = "hidden";
        console.log("➡️ 'Next' button hidden (Last Image)");
    } else {
        nextButton.style.visibility = "visible";
    }
    if (isTouchDevice) { nextButton.style.visibility = "hidden";}
    if (isTouchDevice) { prevButton.style.visibility = "hidden";}
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

}

/**
 * Handles key press events for slideshow navigation.
 * @param {KeyboardEvent} event - The key event.
 */
function handleKeyPress(event) {
    // Prevent arrow keys from scrolling the page
    if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
        event.preventDefault();
    }

    // Right Arrow → Move forward
    if (event.key === "ArrowRight") {
        moveToNextImage();
    }
    // Left Arrow → Move backward
    else if (event.key === "ArrowLeft") {
        moveToPreviousImage();
    }
}


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
                moveToPreviousImage(); // Move backward
            } else {
                moveToNextImage(); // Move forward
            }
        }

        // Reset accumulatedSwipeDistance while keeping any leftover movement
        accumulatedSwipeDistance %= SWIPE_SENSITIVITY;
    }
}

/**
 * Detects the end of a touch event and determines how many frames to advance.
 * @param {TouchEvent} event - The touch event.
 */
function handleTouchEnd(event) {
    const touchEndTime = Date.now();
    const touchDuration = touchEndTime - touchStartTime; // Time taken for swipe
    const swipeVelocity = Math.abs(accumulatedSwipeDistance) / touchDuration; // Speed

    const framesToAdvance = Math.min(3, Math.floor(Math.abs(accumulatedSwipeDistance) / SWIPE_SENSITIVITY));

    if (accumulatedSwipeDistance > SWIPE_SENSITIVITY) {
        // Move forward multiple frames smoothly
        advanceFrames(framesToAdvance, true);
    } else if (accumulatedSwipeDistance < -SWIPE_SENSITIVITY) {
        // Move backward multiple frames smoothly
        advanceFrames(framesToAdvance, false);
    }
}

/**
 * Advances multiple frames sequentially for smooth dragging.
 * @param {number} frames - Number of frames to move.
 * @param {boolean} forward - True for forward, false for backward.
 */
function advanceFrames(frames, forward) {
    let delay = 50; // Delay between each frame switch (ms)

    for (let i = 0; i < frames; i++) {
        setTimeout(() => {
            if (forward) {
                
                moveToPreviousImage();
            } else {
                moveToNextImage();
            }
        }, i * delay);
    }
}



// Janky Test Region
if(isLandscape && isT){instructions_p.textContent = "Landscape mode detected.";}