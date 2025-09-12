const fs = require('fs')
const path = require('path')

// Create a simple placeholder image as base64 encoded PNG
const placeholderImage = `iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==`

// Create facades directory if it doesn't exist
const facadesDir = path.join(__dirname, '..', 'public', 'facades')
if (!fs.existsSync(facadesDir)) {
  fs.mkdirSync(facadesDir, { recursive: true })
}

// Write placeholder image
const placeholderPath = path.join(facadesDir, 'placeholder.jpg')
fs.writeFileSync(placeholderPath, Buffer.from(placeholderImage, 'base64'))

console.log('✅ Created placeholder facade image')
