const https = require('https')
const fs = require('fs')
const path = require('path')

// Create textures directory if it doesn't exist
const texturesDir = path.join(__dirname, '..', 'public', 'textures')
if (!fs.existsSync(texturesDir)) {
  fs.mkdirSync(texturesDir, { recursive: true })
}

// Free texture URLs from various sources
const textures = {
  // Wall textures
  'australian_weatherboard_diffuse.jpg':
    'https://www.textures.com/system/gallery/photos/Large/1000/1000_1_1000x1000.jpg',
  'premium_white_marble_diffuse.jpg':
    'https://www.textures.com/system/gallery/photos/Large/1000/1000_1_1000x1000.jpg',
  'charcoal_concrete_panel_diffuse.jpg':
    'https://www.textures.com/system/gallery/photos/Large/1000/1000_1_1000x1000.jpg',
  'red_brick_veneer_diffuse.jpg':
    'https://www.textures.com/system/gallery/photos/Large/1000/1000_1_1000x1000.jpg',
  'cream_render_finish_diffuse.jpg':
    'https://www.textures.com/system/gallery/photos/Large/1000/1000_1_1000x1000.jpg',
  'cedar_cladding_diffuse.jpg':
    'https://www.textures.com/system/gallery/photos/Large/1000/1000_1_1000x1000.jpg',

  // Roof textures
  'terracotta_tiles_diffuse.jpg':
    'https://www.textures.com/system/gallery/photos/Large/1000/1000_1_1000x1000.jpg',
  'patina_copper_diffuse.jpg':
    'https://www.textures.com/system/gallery/photos/Large/1000/1000_1_1000x1000.jpg',
  'colorbond_steel_diffuse.jpg':
    'https://www.textures.com/system/gallery/photos/Large/1000/1000_1_1000x1000.jpg',
  'natural_slate_diffuse.jpg':
    'https://www.textures.com/system/gallery/photos/Large/1000/1000_1_1000x1000.jpg',
  'solar_panel_integrated_diffuse.jpg':
    'https://www.textures.com/system/gallery/photos/Large/1000/1000_1_1000x1000.jpg',

  // Floor textures
  'spotted_gum_hardwood_diffuse.jpg':
    'https://www.textures.com/system/gallery/photos/Large/1000/1000_1_1000x1000.jpg',
  'polished_concrete_diffuse.jpg':
    'https://www.textures.com/system/gallery/photos/Large/1000/1000_1_1000x1000.jpg',
  'italian_porcelain_tiles_diffuse.jpg':
    'https://www.textures.com/system/gallery/photos/Large/1000/1000_1_1000x1000.jpg',
  'bamboo_engineered_diffuse.jpg':
    'https://www.textures.com/system/gallery/photos/Large/1000/1000_1_1000x1000.jpg',

  // Window textures
  'double_glazed_clear_diffuse.jpg':
    'https://www.textures.com/system/gallery/photos/Large/1000/1000_1_1000x1000.jpg',
  'tinted_glass_diffuse.jpg':
    'https://www.textures.com/system/gallery/photos/Large/1000/1000_1_1000x1000.jpg',
  'frosted_glass_diffuse.jpg':
    'https://www.textures.com/system/gallery/photos/Large/1000/1000_1_1000x1000.jpg',

  // Door textures
  'solid_timber_door_diffuse.jpg':
    'https://www.textures.com/system/gallery/photos/Large/1000/1000_1_1000x1000.jpg',
  'aluminum_sliding_door_diffuse.jpg':
    'https://www.textures.com/system/gallery/photos/Large/1000/1000_1_1000x1000.jpg',
  'glass_panel_door_diffuse.jpg':
    'https://www.textures.com/system/gallery/photos/Large/1000/1000_1_1000x1000.jpg',

  // Trim textures
  'primed_pine_trim_diffuse.jpg':
    'https://www.textures.com/system/gallery/photos/Large/1000/1000_1_1000x1000.jpg',
  'hardwood_trim_diffuse.jpg':
    'https://www.textures.com/system/gallery/photos/Large/1000/1000_1_1000x1000.jpg',
  'aluminum_trim_diffuse.jpg':
    'https://www.textures.com/system/gallery/photos/Large/1000/1000_1_1000x1000.jpg',
}

// Alternative free texture sources
const freeTextures = {
  // Using placeholder images for now - replace with actual free texture URLs
  'australian_weatherboard_diffuse.jpg':
    'https://via.placeholder.com/512x512/F5F1E8/8B4513?text=Weatherboard',
  'premium_white_marble_diffuse.jpg':
    'https://via.placeholder.com/512x512/F8F8F8/696969?text=Marble',
  'charcoal_concrete_panel_diffuse.jpg':
    'https://via.placeholder.com/512x512/2F3133/FFFFFF?text=Concrete',
  'red_brick_veneer_diffuse.jpg': 'https://via.placeholder.com/512x512/9B2C2C/FFFFFF?text=Brick',
  'cream_render_finish_diffuse.jpg':
    'https://via.placeholder.com/512x512/F5F1E8/8B4513?text=Render',
  'cedar_cladding_diffuse.jpg': 'https://via.placeholder.com/512x512/8B4513/FFFFFF?text=Cedar',

  'terracotta_tiles_diffuse.jpg':
    'https://via.placeholder.com/512x512/B85450/FFFFFF?text=Terracotta',
  'patina_copper_diffuse.jpg': 'https://via.placeholder.com/512x512/B87333/FFFFFF?text=Copper',
  'colorbond_steel_diffuse.jpg': 'https://via.placeholder.com/512x512/2F4F4F/FFFFFF?text=Steel',
  'natural_slate_diffuse.jpg': 'https://via.placeholder.com/512x512/2F4F4F/FFFFFF?text=Slate',
  'solar_panel_integrated_diffuse.jpg':
    'https://via.placeholder.com/512x512/1E3A8A/FFFFFF?text=Solar',

  'spotted_gum_hardwood_diffuse.jpg':
    'https://via.placeholder.com/512x512/8B4513/FFFFFF?text=Hardwood',
  'polished_concrete_diffuse.jpg':
    'https://via.placeholder.com/512x512/696969/FFFFFF?text=Concrete',
  'italian_porcelain_tiles_diffuse.jpg':
    'https://via.placeholder.com/512x512/F8F8F8/696969?text=Porcelain',
  'bamboo_engineered_diffuse.jpg': 'https://via.placeholder.com/512x512/D4B08A/FFFFFF?text=Bamboo',

  'double_glazed_clear_diffuse.jpg': 'https://via.placeholder.com/512x512/FFFFFF/000000?text=Glass',
  'tinted_glass_diffuse.jpg': 'https://via.placeholder.com/512x512/87CEEB/000000?text=Tinted',
  'frosted_glass_diffuse.jpg': 'https://via.placeholder.com/512x512/F0F0F0/000000?text=Frosted',

  'solid_timber_door_diffuse.jpg': 'https://via.placeholder.com/512x512/8B4513/FFFFFF?text=Door',
  'aluminum_sliding_door_diffuse.jpg':
    'https://via.placeholder.com/512x512/C0C0C0/000000?text=Aluminum',
  'glass_panel_door_diffuse.jpg':
    'https://via.placeholder.com/512x512/FFFFFF/000000?text=Glass+Door',

  'primed_pine_trim_diffuse.jpg': 'https://via.placeholder.com/512x512/FFFFFF/000000?text=Pine',
  'hardwood_trim_diffuse.jpg': 'https://via.placeholder.com/512x512/8B4513/FFFFFF?text=Hardwood',
  'aluminum_trim_diffuse.jpg': 'https://via.placeholder.com/512x512/C0C0C0/000000?text=Aluminum',
}

function downloadTexture(filename, url) {
  return new Promise((resolve, reject) => {
    const filePath = path.join(texturesDir, filename)
    const file = fs.createWriteStream(filePath)

    https
      .get(url, (response) => {
        response.pipe(file)
        file.on('finish', () => {
          file.close()
          console.log(`Downloaded: ${filename}`)
          resolve()
        })
      })
      .on('error', (err) => {
        fs.unlink(filePath, () => {}) // Delete the file on error
        console.error(`Error downloading ${filename}:`, err.message)
        reject(err)
      })
  })
}

async function downloadAllTextures() {
  console.log('Starting texture downloads...')

  for (const [filename, url] of Object.entries(freeTextures)) {
    try {
      await downloadTexture(filename, url)
      // Add small delay to avoid overwhelming servers
      await new Promise((resolve) => setTimeout(resolve, 100))
    } catch (error) {
      console.error(`Failed to download ${filename}:`, error.message)
    }
  }

  console.log('Texture download completed!')
}

// Run the download
downloadAllTextures().catch(console.error)
