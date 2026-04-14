import Link from "next/link"

const footerLinks = [
  {
    title: "Company",
    links: [
      { name: "About", href: "#" },
      { name: "Careers", href: "#" },
      { name: "Contact", href: "#" },
    ],
  },
  {
    title: "Services",
    links: [
      { name: "Cleaning", href: "/services?category=cleaning" },
      { name: "Plumbing", href: "/services?category=plumbing" },
      { name: "Electrical", href: "/services?category=electrical" },
    ],
  },
  {
    title: "Support",
    links: [
      { name: "Help Center", href: "#" },
      { name: "Terms", href: "#" },
      { name: "Privacy", href: "#" },
    ],
  },
]

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <div>
            <Link href="/" className="flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <span className="text-sm font-bold text-primary-foreground">S</span>
              </div>
              <span className="text-xl font-bold">SparkAI</span>
            </Link>
            <p className="mt-4 text-sm text-muted-foreground">
              On-demand services at your fingertips. Book trusted professionals for any task.
            </p>
          </div>
          {footerLinks.map((section) => (
            <div key={section.title}>
              <h3 className="text-sm font-semibold">{section.title}</h3>
              <ul className="mt-4 space-y-2">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link href={link.href} className="text-sm text-muted-foreground hover:text-foreground">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-8 border-t pt-8">
          <p className="text-center text-sm text-muted-foreground">&copy; 2026 SparkAI. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
