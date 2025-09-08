import Link from 'next/link'

export function SiteFooter() {
  return (
    <footer className="border-t bg-white">
      <div className="mx-auto max-w-6xl px-4 py-8 grid gap-4 md:grid-cols-2 text-sm">
        <p className="text-muted-foreground">© {new Date().getFullYear()} EquityPath</p>
        <nav className="flex md:justify-end gap-6">
          <Link href="/about" className="text-muted-foreground hover:text-foreground">
            About
          </Link>
          <Link href="/contact" className="text-muted-foreground hover:text-foreground">
            Contact
          </Link>
          <Link href="/privacy" className="text-muted-foreground hover:text-foreground">
            Privacy
          </Link>
          <Link href="/terms" className="text-muted-foreground hover:text-foreground">
            Terms
          </Link>
        </nav>
      </div>
    </footer>
  )
}

export type SiteFooterProps = object
