import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="shell site-header__inner">
        <Link href="/" className="brand">
          Xpert Mind
        </Link>
        <nav className="site-nav" aria-label="Primary">
          <Link href="/">Blog</Link>
          <Link href="/admin">Dashboard</Link>
        </nav>
      </div>
    </header>
  );
}
