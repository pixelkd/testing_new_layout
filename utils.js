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


