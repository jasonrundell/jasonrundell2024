/**
 * Empty stylesheet module to replace jsdom's default-stylesheet.css
 * This prevents the ENOENT error when jsdom tries to read the file.
 * Webpack will use this as a replacement for default-stylesheet.css imports.
 */
module.exports = '';

