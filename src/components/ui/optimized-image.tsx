import Image from 'next/image'
import { cn } from '@/lib/utils'

interface OptimizedImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  priority?: boolean
  placeholder?: 'blur' | 'empty'
  blurDataURL?: string
  fill?: boolean
  sizes?: string
  quality?: number
  loading?: 'lazy' | 'eager'
  onLoad?: () => void
  onError?: () => void
}

// Default placeholder blur data URL for images
const DEFAULT_BLUR_DATA_URL =
  'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0RJC6VpLx5Xef//Z'

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  className,
  priority = false,
  placeholder = 'blur',
  blurDataURL = DEFAULT_BLUR_DATA_URL,
  fill = false,
  sizes,
  quality = 75,
  loading = 'lazy',
  onLoad,
  onError,
}: OptimizedImageProps) {
  // Handle external URLs vs local images
  const isExternal = src.startsWith('http') || src.startsWith('//')

  // For external images, we need to handle them differently
  if (isExternal) {
    return (
      <div
        className={cn('relative overflow-hidden', className)}
        style={fill && width && height ? { aspectRatio: `${width}/${height}` } : undefined}
      >
        <Image
          src={src}
          alt={alt}
          width={fill ? undefined : width}
          height={fill ? undefined : height}
          fill={fill}
          priority={priority}
          placeholder={placeholder}
          blurDataURL={blurDataURL}
          sizes={sizes}
          quality={quality}
          loading={loading}
          onLoad={onLoad}
          onError={onError}
          className={cn(fill ? 'object-cover' : '')}
        />
      </div>
    )
  }

  // For local images
  return (
    <div
      className={cn('relative overflow-hidden', className)}
      style={fill && width && height ? { aspectRatio: `${width}/${height}` } : undefined}
    >
      <Image
        src={src}
        alt={alt}
        width={fill ? undefined : width}
        height={fill ? undefined : height}
        fill={fill}
        priority={priority}
        placeholder={placeholder}
        blurDataURL={blurDataURL}
        sizes={sizes}
        quality={quality}
        loading={loading}
        onLoad={onLoad}
        onError={onError}
        className={cn(fill ? 'object-cover' : '')}
      />
    </div>
  )
}

// Specialized image components for common use cases
export function HeroImage({
  src,
  alt,
  className,
}: {
  src: string
  alt: string
  className?: string
}) {
  return (
    <OptimizedImage
      src={src}
      alt={alt}
      fill
      priority
      quality={90}
      sizes="100vw"
      className={cn('object-cover', className)}
    />
  )
}

export function CardImage({
  src,
  alt,
  className,
}: {
  src: string
  alt: string
  className?: string
}) {
  return (
    <OptimizedImage
      src={src}
      alt={alt}
      fill
      quality={80}
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      className={cn('object-cover', className)}
    />
  )
}

export function ThumbnailImage({
  src,
  alt,
  width = 150,
  height = 150,
  className,
}: {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
}) {
  return (
    <OptimizedImage
      src={src}
      alt={alt}
      width={width}
      height={height}
      quality={70}
      sizes="150px"
      className={cn('object-cover rounded-md', className)}
    />
  )
}

export function LogoImage({
  src,
  alt,
  width = 120,
  height = 40,
  className,
}: {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
}) {
  return (
    <OptimizedImage
      src={src}
      alt={alt}
      width={width}
      height={height}
      quality={85}
      sizes="120px"
      className={cn('object-contain', className)}
    />
  )
}

// Hook for generating responsive image sizes
export function useResponsiveImageSizes(
  baseSizes: string = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
) {
  return baseSizes
}

// Utility function to generate blur placeholder for images
export function generateBlurPlaceholder(width: number = 10, height: number = 6): string {
  // Create a simple SVG placeholder
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#f3f4f6"/>
      <rect x="20%" y="40%" width="60%" height="20%" fill="#e5e7eb" rx="1"/>
    </svg>
  `

  return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`
}
