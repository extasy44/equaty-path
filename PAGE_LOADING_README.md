# Page Loading System

This document explains the comprehensive page loading system implemented in the EquityPath application.

## Overview

The page loading system provides:

1. **Global Loading Context** - Centralized loading state management
2. **Page-Specific Loading** - Custom loading screens for different page types
3. **Route Transitions** - Smooth animations between page changes
4. **Navigation Loading** - Loading states for client-side navigation
5. **Loading.tsx Files** - Automatic loading states for Next.js routes

## Architecture

### Core Components

#### 1. LoadingContext (`src/lib/loading-context.tsx`)

```typescript
const { loadingState, startLoading, stopLoading, updateProgress } = useLoading()
```

#### 2. PageLoading Components (`src/components/ui/page-loading.tsx`)

```typescript
<CalculatorPageLoading message="Loading Build ROI Calculator" />
<VisualizerPageLoading message="Loading AI Builder Visualizer" />
<AnalyzerPageLoading message="Loading AI Property Analyzer" />
```

#### 3. RouteTransition (`src/components/transition/route-transition.tsx`)

```typescript
<RouteTransition animationType="fade">
  {children}
</RouteTransition>
```

#### 4. GlobalLoadingOverlay (`src/components/ui/global-loading-overlay.tsx`)

```typescript
const { showGlobalLoading, hideGlobalLoading } = useGlobalLoading()
```

## Implementation

### 1. Global Setup

The loading system is integrated at the root level in `src/app/layout.tsx`:

```typescript
<LoadingProvider>
  <RouteTransition>
    {children}
  </RouteTransition>
  <GlobalLoadingOverlay />
</LoadingProvider>
```

### 2. Page-Specific Loading

Create `loading.tsx` files in page directories for automatic loading states:

```typescript
// src/app/build-roi/loading.tsx
import { CalculatorPageLoading } from '@/components/ui/page-loading'

export default function BuildRoiLoading() {
  return <CalculatorPageLoading message="Loading Build ROI Calculator" />
}
```

### 3. Component Integration

Components can integrate with the loading system:

```typescript
const { stopLoading } = useLoading()

useEffect(() => {
  // Component ready logic
  stopLoading()
}, [])
```

### 4. Navigation Loading

Use the navigation hook for client-side navigation with loading:

```typescript
const { navigateWithLoading } = useNavigationLoading()

function handleClick() {
  navigateWithLoading('/build-roi', 'Loading Build ROI Calculator...')
}
```

## Available Loading Types

### Page Types

- `calculator` - Financial calculators
- `visualizer` - AI-powered visualization tools
- `analyzer` - Property analysis tools
- `reports` - Premium reports
- `pathways` - Financial pathways
- `dashboard` - Main dashboard

### Loading States

- `page` - General page loading
- `feature` - Feature-specific loading
- `navigation` - Navigation transitions

## Examples

### Basic Page Loading

```typescript
// In a page component
const { stopLoading } = useLoading()

useEffect(() => {
  // Simulate data loading
  setTimeout(() => stopLoading(), 2000)
}, [])
```

### Navigation with Loading

```typescript
// In a navigation component
const { navigateWithLoading } = useNavigationLoading()

<button onClick={() => navigateWithLoading('/dashboard', 'Loading Dashboard...')}>
  Go to Dashboard
</button>
```

### Global Loading Overlay

```typescript
// In any component
const { showGlobalLoading, hideGlobalLoading } = useGlobalLoading()

const handleAsyncAction = async () => {
  showGlobalLoading('Processing...', 'feature')
  try {
    await someAsyncOperation()
  } finally {
    hideGlobalLoading()
  }
}
```

## Loading Components

### PageLoading Variants

- `CalculatorPageLoading` - For financial calculators
- `VisualizerPageLoading` - For AI visualization tools
- `AnalyzerPageLoading` - For property analysis
- `ReportsPageLoading` - For premium reports
- `PathwaysPageLoading` - For financial pathways
- `DashboardPageLoading` - For dashboard

### Feature Loaders (Existing)

- `CalculatorLoader` - Specialized calculator loading
- `VisualizerLoader` - AI visualizer loading
- `AnalyzerLoader` - Property analyzer loading
- `ReportLoader` - Premium reports loading

## Animation Types

The `RouteTransition` component supports different animation types:

- `fade` - Fade in/out (default)
- `slide` - Slide transition
- `scale` - Scale animation
- `none` - No animation

## Best Practices

1. **Always stop loading** when components are ready
2. **Use appropriate page types** for consistent branding
3. **Provide meaningful messages** for better UX
4. **Handle errors gracefully** by stopping loading on failures
5. **Use navigation loading** for client-side transitions

## Loading Files Created

The following pages have loading states:

- `/` - Home/Dashboard
- `/build-roi` - Build ROI Calculator
- `/builder-visualizer` - AI Builder Visualizer
- `/rental-roi` - Rental ROI Calculator
- `/analysis` - AI Property Analyzer
- `/pathways` - Financial Pathways
- `/reports` - Premium Reports
- `/landscaping-visualizer` - Landscaping Visualizer
- `/dashboard` - Dashboard

## Integration Points

- **Layout** - Global loading provider and overlay
- **Navigation** - Header navigation with loading states
- **Pages** - Automatic loading.tsx files
- **Components** - Feature-specific loading states
- **Routes** - Smooth transitions between pages

This system provides a comprehensive, user-friendly loading experience across the entire application.
