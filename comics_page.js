

/**
 * Loads a comics project into the hero section.
 *
 * This function checks if a comics project is already loaded. If the requested
 * project is already active, it exits early. Otherwise, it initializes or replaces the
 * the stage material and starts the brings in the project.
 *
 * @param {Object} project - JSON object containing the project data.
 *    @property {string} project.title - The title of the storyboard project.
 */
function load_comic(project) {
    console.log(`Comic project ${project.title} selected.`);
    
    // Select the hero section where the comic is displayed
    const heroSection = document.querySelector(".hero");
    
    // Clear all child elements of the hero section (removes previous project content)
    heroSection.replaceChildren();

    initializeComicsLayout(project)

}

function initializeComicsLayout(project){
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
    instructions_p.textContent = "If we need instructions they go here.";
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

    // ---------------------- Controls ----------------------
    const page_navigation = document.createElement("div");
    page_navigation.classList.add("controls");
    
    // Previous page button
    const prev_page_bttn = document.createElement("button");
    prev_page_bttn.id = "prev-page";
    prev_page_bttn.textContent = "◀--- Prev";
    // ** TO DO: Attach event listeners as functionality is defined
    page_navigation.appendChild(prev_page_bttn);

    // Next page buton
    const next_page_bttn = document.createElement("button");
    next_page_bttn.id = "next-page";
    next_page_bttn.textContent = "Next ---▶";
    // ** TO DO: Attach event listeners as functionality is defined
    page_navigation.appendChild(next_page_bttn);

    // ---------------------- Append Elements to DOM ----------------------
    heroSection.appendChild(projectTitle);
    heroSection.appendChild(comics_container);

    comics_container.appendChild(instructions_div);
    comics_container.appendChild(comic_stage);
    comics_container.appendChild(page_navigation);

}