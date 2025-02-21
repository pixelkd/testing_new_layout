/**
 * Create an SVG placeholder rectangle with an optional custom aspect ratio.
 * Defaults to a 16:9 ratio (160x90) if width and height are not specified.
 *
 * @param {string} type - The type of placeholder ("no_icon", "failed", "category_missing", "placeholder").
 * @param {number} [width=160] - Optional width of the SVG (default: 160).
 * @param {number} [height=90] - Optional height of the SVG (default: 90).
 * @param {string} [color="#000000"] - Optional background color for card element.
 * @param {string} [text=""] - Optional text input to place on card element background.
 * @returns {string} - A data URI string representing the SVG placeholder.
 */
function createPlaceholder (type, width = 160, height = 90, color = "#1a1a1a", text = "") {
    // Ensure width and height are numbers and positive
    width = Math.max(1, width);
    height = Math.max(1, height);

    color = color;

    switch (type) {
        case "no_icon":
            color = "#808080"; // Gray
            text = "No icon";
            break;
        case "failed":
            color = "#B22222"; // Red
            text = "Failed";
            break;
        case "category_missing":
            color = "#FFD700"; // Yellow
            text = "Missing catagory";
            break;
        case "placeholder":
            color = "#1E90FF"; // Blue (testing)
            text = "placeholder";
            break;
        case "custom":
            color = color; // user defined
            text = text;
            break;
        default:
            color = "#000000"; // Black (fallback)
    }

        // Generate the SVG string with dynamic width and height
        const svgString = `
        <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
            <rect width="100%" height="100%" fill="${color}" />
            <text x="50%" y="50%" font-size="${Math.min(width, height) * 0.12}" fill="#ffffff" text-anchor="middle" dominant-baseline="middle">
                ${text.toUpperCase()}
            </text>
        </svg>
    `;

    // Convert SVG string to Base64 and return as a data URI
    return `data:image/svg+xml;base64,${btoa(svgString)}`;
}

// Utility function to prevent double-tap zoom
function preventDoubleTapZoom(element) {
    let lastTouchTime = 0;
    element.addEventListener('touchend', (event) => {
        const currentTime = new Date().getTime();
        const timeDifference = currentTime - lastTouchTime;
        lastTouchTime = currentTime;

        // If the time between touches is short, prevent default behavior
        if (timeDifference < 300 && timeDifference > 0) {
            event.preventDefault();
        }
    });
}

const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;
if (isTouchDevice) {
    // Show swipe instructions
    console.log("This is a touch-enabled device.");
} else {
    // Show scroll wheel instructions
    console.log("This is not a touch-enabled device.");
}