/**
 * Utility functions for working with icons
 */

/**
 * Import a Lucide icon directly to avoid issues with tree-shaking in development
 * @param {string} iconName - The name of the icon to import
 * @returns {Promise<Object>} - The imported icon component
 */
export const importIcon = async (iconName) => {
  try {
    // Use dynamic import with explicit path to avoid tree-shaking issues
    return await import(`lucide-react/icons/${iconName}`).then(module => module.default);
  } catch (error) {
    console.error(`Error importing icon ${iconName}:`, error);
    return null;
  }
};

/**
 * Get the correct path for an icon considering development issues
 * @param {string} iconName - The name of the icon
 * @returns {string} - The path to the icon
 */
export const getIconPath = (iconName) => {
  return `lucide-react/icons/${iconName}`;
}; 