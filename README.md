## EquityPath

EquityPath is a Next.js 15 (App Router) app with shadcn/ui, Tailwind v4, and Framer Motion. It provides calculators and reports for property and finance:

- Build ROI: Knockdown/Rebuild & construction feasibility
- Rental ROI: Rental income, yield and cashflow
- Gearing: Negative & positive gearing simulator
- Pathways: Financial roadmap and savings strategy
- Compare: Compare suburbs, builders or projects
- Reports: Lender-/investor-ready PDFs

### Tech

- Next.js 15 App Router, React 19
- TypeScript, Zod + react-hook-form
- Tailwind CSS v4 with `@theme inline`
- shadcn/ui, Radix primitives
- Framer Motion (page transitions)

### Getting Started

```bash
npm install
npm run dev
# App runs on http://localhost:3030
```

### Project Structure

```
src/
  app/
    build-roi/            # Build ROI calculator (main)
    rental-roi/
    negative-gearing/
    pathways/
    compare/
    reports/
    api/
      calculate/         # POST calc endpoint
      export/{pdf,csv}/  # Exports
  components/
    site/                # Header, footer
    ui/                  # shadcn components
    calculator/          # Calculator fields
  lib/
    build-roi-calc.ts    # Core feasibility logic
```

### Branding

- Master brand: EquityPath
- Logo: `public/assets/equaty-path-logo.png`

### Notes

- Authentication is coming soon; login/sign up buttons are disabled with explanatory copy
- Page transitions are disabled on first render and respect reduced motion
- Mobile: layouts use responsive paddings and grids; Build ROI snapshot is size-optimized for small screens

### Scripts

```bash
npm run dev       # Start dev server (port 3030)
npm run build     # Production build
npm run start     # Start production server
npm run format    # Prettier format
```
