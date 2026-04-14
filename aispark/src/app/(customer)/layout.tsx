import { Navbar } from "@/components/shared/navbar"
import { Footer } from "@/components/shared/footer"
import { PageTransition } from "@/components/shared/page-transition"

export default function CustomerLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <PageTransition>{children}</PageTransition>
      </main>
      <Footer />
    </>
  )
}
