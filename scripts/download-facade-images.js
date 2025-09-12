const fs = require('fs')
const path = require('path')
const https = require('https')

// Carlisle Homes facade images URLs (these are example URLs - you may need to update with actual URLs)
const facadeImages = {
  'hyatt-facade.jpg':
    'https://www.carlislehomes.com.au/wp-content/uploads/2023/01/hyatt-facade-exterior.jpg',
  'hamptons-facade.jpg':
    'https://www.carlislehomes.com.au/wp-content/uploads/2023/01/hamptons-facade-exterior.jpg',
  'modern-minimalist-facade.jpg':
    'https://www.carlislehomes.com.au/wp-content/uploads/2023/01/modern-facade-exterior.jpg',
  'traditional-classic-facade.jpg':
    'https://www.carlislehomes.com.au/wp-content/uploads/2023/01/traditional-facade-exterior.jpg',
}

// Create facades directory if it doesn't exist
const facadesDir = path.join(__dirname, '..', 'public', 'facades')
if (!fs.existsSync(facadesDir)) {
  fs.mkdirSync(facadesDir, { recursive: true })
}

// Function to download image
function downloadImage(url, filename) {
  return new Promise((resolve, reject) => {
    const filePath = path.join(facadesDir, filename)
    const file = fs.createWriteStream(filePath)

    https
      .get(url, (response) => {
        if (response.statusCode === 200) {
          response.pipe(file)
          file.on('finish', () => {
            file.close()
            console.log(`✅ Downloaded: ${filename}`)
            resolve()
          })
        } else {
          console.log(`❌ Failed to download ${filename}: ${response.statusCode}`)
          reject(new Error(`HTTP ${response.statusCode}`))
        }
      })
      .on('error', (err) => {
        console.log(`❌ Error downloading ${filename}:`, err.message)
        reject(err)
      })
  })
}

// Download all facade images
async function downloadFacadeImages() {
  console.log('🏠 Downloading Carlisle Homes facade images...')

  for (const [filename, url] of Object.entries(facadeImages)) {
    try {
      await downloadImage(url, filename)
    } catch (error) {
      console.log(`⚠️  Could not download ${filename}, keeping placeholder`)
    }
  }

  console.log('✅ Facade image download complete!')
}

// Run the download
downloadFacadeImages().catch(console.error)
