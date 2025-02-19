/**
 * Create an SVG placeholder rectangle with an optional custom aspect ratio.
 * Defaults to a 16:9 ratio (160x90) if width and height are not specified.
 *
 * @param {string} type - The type of placeholder ("no_icon", "failed", "category_missing", "placeholder").
 * @param {number} [width=160] - Optional width of the SVG (default: 160).
 * @param {number} [height=90] - Optional height of the SVG (default: 90).
 * @returns {string} - A data URI string representing the SVG placeholder.
 */
function createPlaceholder (type, width = 160, height = 90) {
    // Ensure width and height are numbers and positive
    width = Math.max(1, width);
    height = Math.max(1, height);

    let color;

    switch (type) {
        case "no_icon":
            color = "#808080"; // Gray
            break;
        case "failed":
            color = "#B22222"; // Red
            break;
        case "category_missing":
            color = "#FFD700"; // Yellow
            break;
        case "placeholder":
            color = "#1E90FF"; // Blue (testing)
            break;
        default:
            color = "#000000"; // Black (fallback)
    }

        // Generate the SVG string with dynamic width and height
        const svgString = `
        <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
            <rect width="100%" height="100%" fill="${color}" />
            <text x="50%" y="50%" font-size="${Math.min(width, height) * 0.12}" fill="#ffffff" text-anchor="middle" dominant-baseline="middle">
                ${type.toUpperCase()}
            </text>
        </svg>
    `;

    // Convert SVG string to Base64 and return as a data URI
    return `data:image/svg+xml;base64,${btoa(svgString)}`;
}