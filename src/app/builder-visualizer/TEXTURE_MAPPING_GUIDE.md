# Realistic 3D Model Texture Mapping Guide

## Overview

This guide explains the enhanced texture mapping system for realistic 3D house models with detailed materials, normal maps, ambient occlusion, and displacement mapping.

## Texture Map Types

### 1. Diffuse Maps (Base Color)

- **Purpose**: Primary color and pattern of the material
- **Format**: JPG/PNG
- **Resolution**: 1024x1024 or 2048x2048 recommended
- **Example**: `/textures/red_brick_diffuse.jpg`

### 2. Normal Maps

- **Purpose**: Surface detail and depth information
- **Format**: JPG/PNG (RGB channels)
- **Usage**: Creates realistic surface bumps and indentations
- **Example**: `/textures/red_brick_normal.jpg`

### 3. Ambient Occlusion (AO) Maps

- **Purpose**: Shadow and contact information
- **Format**: JPG/PNG (Grayscale)
- **Usage**: Adds realistic shadowing in crevices and joints
- **Example**: `/textures/red_brick_ao.jpg`

### 4. Displacement Maps

- **Purpose**: Actual geometry displacement
- **Format**: JPG/PNG (Grayscale)
- **Usage**: Physically moves vertices for extreme detail
- **Example**: `/textures/red_brick_displacement.jpg`

## Material Properties

### Physical Properties

- **Roughness**: 0.0 (mirror) to 1.0 (completely rough)
- **Metalness**: 0.0 (non-metal) to 1.0 (metal)
- **Reflection**: 0.0 (no reflection) to 1.0 (full reflection)

### Material Categories

#### Brick Materials

- **Red Brick**: Traditional clay brick with mortar lines
- **White Brick**: Clean modern brick finish
- **Properties**: High roughness (0.85-0.9), low metalness (0.0), low reflection (0.1)

#### Wood Materials

- **Oak Hardwood**: Natural wood grain with knots
- **Cedar Cladding**: Weather-resistant wood siding
- **Weathered Wood**: Aged, distressed wood finish
- **Properties**: Medium roughness (0.7-0.9), low metalness (0.0), low reflection (0.1-0.3)

#### Metal Materials

- **Stainless Steel**: Polished metal finish
- **Copper Metal**: Patina copper with green oxidation
- **Aluminum Metal**: Brushed aluminum finish
- **Properties**: Low roughness (0.1-0.4), high metalness (0.8-0.9), high reflection (0.6-0.9)

#### Stone Materials

- **Marble**: Polished natural stone
- **Limestone**: Natural rough stone
- **Granite**: Speckled natural stone
- **Slate**: Layered stone roofing
- **Properties**: Variable roughness (0.3-0.9), low metalness (0.0), low-medium reflection (0.1-0.6)

#### Glass Materials

- **Clear Glass**: Transparent window glass
- **Tinted Glass**: Colored architectural glass
- **Properties**: Low roughness (0.05-0.1), low metalness (0.0), high reflection (0.8-0.95)

#### Concrete Materials

- **Charcoal Concrete**: Raw concrete finish
- **Properties**: Very high roughness (0.95-0.98), low metalness (0.0), very low reflection (0.02-0.05)

## Preset Configurations

### 1. Modern Minimalist

- **Walls**: Cream Render (smooth finish)
- **Roof**: Stainless Steel (reflective metal)
- **Trim**: White Brick (clean lines)
- **Doors**: White Brick (minimal design)
- **Windows**: Clear Glass (transparency)

### 2. Traditional Family Home

- **Walls**: Red Brick (classic texture)
- **Roof**: Terracotta Tiles (clay finish)
- **Trim**: Oak Wood (natural grain)
- **Doors**: Oak Wood (warm finish)
- **Windows**: Clear Glass (traditional)

### 3. Contemporary Luxury

- **Walls**: Charcoal Concrete (raw finish)
- **Roof**: Polished Steel (high-end metal)
- **Trim**: White Marble (premium stone)
- **Doors**: Premium Oak (refined wood)
- **Windows**: Premium Glass (crystal clear)

### 4. Rustic Countryside

- **Walls**: Weathered Red Brick (aged texture)
- **Roof**: Clay Tiles (natural finish)
- **Trim**: Weathered Wood (distressed)
- **Doors**: Rustic Wood (aged finish)
- **Windows**: Traditional Glass (slightly imperfect)

### 5. Industrial Modern

- **Walls**: Raw Concrete (unfinished)
- **Roof**: Industrial Steel (exposed metal)
- **Trim**: Steel (metal accents)
- **Doors**: Steel (industrial design)
- **Windows**: Industrial Glass (clear)

## Implementation Notes

### Texture Loading

```javascript
// Example material configuration
const material = {
  id: 'Red_Brick',
  name: 'Red Brick',
  color: '#9B2C2C',
  texture_url: '/textures/red_brick_diffuse.jpg',
  normalMapUrl: '/textures/red_brick_normal.jpg',
  aoMapUrl: '/textures/red_brick_ao.jpg',
  displacementMapUrl: '/textures/red_brick_displacement.jpg',
  roughness: 0.85,
  metalness: 0.0,
  reflection: 0.1,
  properties: {
    finish: 'matte',
    texture: 'brick',
    durability: 'high',
  },
}
```

### Performance Considerations

- Use appropriate texture resolutions (1024x1024 for most materials)
- Implement texture compression for web delivery
- Consider LOD (Level of Detail) for distant objects
- Use texture atlasing for similar materials

### Quality Settings

- **High**: All texture maps enabled, 2048x2048 resolution
- **Medium**: Diffuse + Normal maps, 1024x1024 resolution
- **Low**: Diffuse maps only, 512x512 resolution

## File Structure

```
/public/textures/
├── brick/
│   ├── red_brick_diffuse.jpg
│   ├── red_brick_normal.jpg
│   ├── red_brick_ao.jpg
│   └── red_brick_displacement.jpg
├── wood/
│   ├── oak_hardwood_diffuse.jpg
│   ├── oak_hardwood_normal.jpg
│   └── oak_hardwood_ao.jpg
├── metal/
│   ├── stainless_steel_diffuse.jpg
│   └── stainless_steel_normal.jpg
├── stone/
│   ├── marble_white_diffuse.jpg
│   ├── marble_white_normal.jpg
│   └── marble_white_ao.jpg
└── glass/
    └── clear_glass_diffuse.jpg
```

## Best Practices

1. **Consistent Naming**: Use descriptive, consistent naming conventions
2. **Proper UV Mapping**: Ensure textures align correctly with geometry
3. **Seamless Textures**: Use tileable textures for large surfaces
4. **Color Accuracy**: Maintain realistic color values
5. **Performance**: Optimize texture sizes for target devices
6. **Fallbacks**: Provide fallback materials for missing textures

This enhanced texture system provides photorealistic materials with proper PBR (Physically Based Rendering) properties for professional architectural visualization.
