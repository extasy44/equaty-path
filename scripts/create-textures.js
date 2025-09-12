const fs = require('fs')
const path = require('path')

// Create textures directory if it doesn't exist
const texturesDir = path.join(__dirname, '..', 'public', 'textures')
if (!fs.existsSync(texturesDir)) {
  fs.mkdirSync(texturesDir, { recursive: true })
}

// Material definitions with colors
const materials = {
  // Wall textures
  'australian_weatherboard_diffuse.jpg': '#F5F1E8',
  'premium_white_marble_diffuse.jpg': '#F8F8F8',
  'charcoal_concrete_panel_diffuse.jpg': '#2F3133',
  'red_brick_veneer_diffuse.jpg': '#9B2C2C',
  'cream_render_finish_diffuse.jpg': '#F5F1E8',
  'cedar_cladding_diffuse.jpg': '#8B4513',

  // Roof textures
  'terracotta_tiles_diffuse.jpg': '#B85450',
  'patina_copper_diffuse.jpg': '#B87333',
  'colorbond_steel_diffuse.jpg': '#2F4F4F',
  'natural_slate_diffuse.jpg': '#2F4F4F',
  'solar_panel_integrated_diffuse.jpg': '#1E3A8A',

  // Floor textures
  'spotted_gum_hardwood_diffuse.jpg': '#8B4513',
  'polished_concrete_diffuse.jpg': '#696969',
  'italian_porcelain_tiles_diffuse.jpg': '#F8F8F8',
  'bamboo_engineered_diffuse.jpg': '#D4B08A',

  // Window textures
  'double_glazed_clear_diffuse.jpg': '#FFFFFF',
  'tinted_glass_diffuse.jpg': '#87CEEB',
  'frosted_glass_diffuse.jpg': '#F0F0F0',

  // Door textures
  'solid_timber_door_diffuse.jpg': '#8B4513',
  'aluminum_sliding_door_diffuse.jpg': '#C0C0C0',
  'glass_panel_door_diffuse.jpg': '#FFFFFF',

  // Trim textures
  'primed_pine_trim_diffuse.jpg': '#FFFFFF',
  'hardwood_trim_diffuse.jpg': '#8B4513',
  'aluminum_trim_diffuse.jpg': '#C0C0C0',
}

// Create SVG-based texture images
function createSVGTexture(filename, color) {
  const svgContent = `
<svg width="512" height="512" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <pattern id="texture" patternUnits="userSpaceOnUse" width="64" height="64">
      <rect width="64" height="64" fill="${color}"/>
      <circle cx="32" cy="32" r="2" fill="rgba(255,255,255,0.1)"/>
      <circle cx="16" cy="16" r="1" fill="rgba(0,0,0,0.1)"/>
      <circle cx="48" cy="48" r="1" fill="rgba(0,0,0,0.1)"/>
    </pattern>
  </defs>
  <rect width="512" height="512" fill="url(#texture)"/>
</svg>`

  const filePath = path.join(texturesDir, filename)
  fs.writeFileSync(filePath, svgContent)
  console.log(`Created: ${filename}`)
}

// Create all texture files
console.log('Creating texture files...')
for (const [filename, color] of Object.entries(materials)) {
  createSVGTexture(filename, color)
}

console.log('Texture creation completed!')
