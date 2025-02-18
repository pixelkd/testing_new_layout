function load_comic(project) {
    console.log(`Comic project ${project.title} selected.`);
    
    const heroSection = document.querySelector(".hero");
    heroSection.replaceChildren(); 

    emptyStage(project)

}

function emptyStage(project){
    const heroSection = document.querySelector(".hero");

    // Create project title container
    const projectTitle = document.createElement("div");
    projectTitle.classList.add("project_title");
    // Create <h2> for the title
    const title_h2 = document.createElement("h2");
    title_h2.textContent = project.title; // Use actual project title
    // Attach title to container, then add to hero section
    projectTitle.appendChild(title_h2);

    // Create the stage container
    const stageContainer = document.createElement("div");
    stageContainer.classList.add("stage_container");

    // Create slideshow instructions
    const instructions_div = document.createElement("div");
    instructions_div.classList.add("instructions");
    const instructions_p = document.createElement("p");
    instructions_p.textContent = "Use the Navigations buttons, click the image, swipe, or use the scroll wheel to advance through the slideshow.";
    instructions_div.appendChild(instructions_p);

    // Create the stage area
    const stage = document.createElement("div");
    stage.classList.add("stage");
    
    const stageImage = document.createElement("img");
    stageImage.classList.add("project_img");
    stageImage.src = createPlaceholder("placeholder");

    stage.appendChild(stageImage);
    
    heroSection.appendChild(projectTitle);
    heroSection.appendChild(stageContainer);

    stageContainer.appendChild(instructions_div);
}