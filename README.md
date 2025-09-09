## EquityPath

EquityPath is a Next.js App Router app with shadcn/ui, Tailwind v4, and Framer Motion. It provides calculators and reports for property and finance:

- Build ROI: Knockdown/Rebuild & construction feasibility
- Rental ROI: Rental income, yield and cashflow
- Gearing: Negative & positive gearing simulator
- Pathways: Financial roadmap and savings strategy
- Compare: Compare suburbs, builders or projects
- Reports: Lender-/investor-ready PDFs

### Highlights (recent updates)

- Build ROI: configurable New Home Premium (`new_home_premium_pct`) and deep feasibility inputs
- Upgrades Guide: integrated as a tab on Build ROI
- Landscaping Calculator: per-category editable costs, include/exclude switches, grouped breakdown, CSV export
- Compare: live inputs (A/B/C) with matrix + bars and CSV export
- Pathways: Savings, Strategy, Loan Readiness simulators with live recalculation and snapshot sharing to Financial Roadmap (PDF)
- Dark mode: token-based colors driven by `prefers-color-scheme`

### Tech

- Next.js App Router, React 19
- TypeScript, Zod + react-hook-form
- Tailwind CSS v4 with `@theme inline` and CSS tokens
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

### Theming / Dark mode

- Tokens in `src/app/globals.css` (`--background`, `--foreground`, `--bg1`, `--bg2`, `--color-primary`, etc.)
- Gradient uses `--bg1`/`--bg2` (switch in dark mode)
- Layout and Cards use token-based backgrounds (no hard-coded white)

### API Endpoints

- Build ROI: `POST /api/build-roi/calculate` (includes `new_home_premium_pct`)
- Rental ROI: `POST /api/rental-roi/calculate`
- Export: `POST /api/export/pdf`, `POST /api/export/csv`

### CSV / PDF Exports

- Compare page: Export current A/B/C comparison to CSV
- Landscaping Calculator: Export estimate breakdown to CSV
- Financial Roadmap: Client-side PDF via `pdf-lib` with live snapshots
