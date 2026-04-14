"use client"

import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { ArrowRight, Shield, Clock, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Card3DList } from "@/components/ui/animated-3d-card"
import { ContainerScroll } from "@/components/ui/container-scroll"

const categories = [
  { name: "Home Cleaning", slug: "cleaning", image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&q=80", count: 24, theme: "primary" as const },
  { name: "Plumbing", slug: "plumbing", image: "https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=400&q=80", count: 18, theme: "info" as const },
  { name: "Electrical", slug: "electrical", image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400&q=80", count: 15, theme: "warning" as const },
  { name: "Painting", slug: "painting", image: "https://images.unsplash.com/photo-1562259929-b4e1fd3aef09?w=400&q=80", count: 12, theme: "accent" as const },
  { name: "Carpentry", slug: "carpentry", image: "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=400&q=80", count: 9, theme: "success" as const },
  { name: "Landscaping", slug: "landscaping", image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&q=80", count: 11, theme: "secondary" as const },
]

const features = [
  { icon: Shield, title: "Verified Professionals", description: "All providers go through a thorough background check and vetting process." },
  { icon: Clock, title: "On-Time Service", description: "Punctual service delivery with real-time booking and tracking updates." },
  { icon: Star, title: "Quality Guaranteed", description: "Satisfaction guaranteed with every booking or your money back." },
]

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] } },
}

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
}

export default function HomePage() {
  const router = useRouter()

  const categoryCards = categories.map((cat) => ({
    id: cat.slug,
    title: cat.name,
    description: `${cat.count} verified providers available`,
    image: cat.image,
    theme: cat.theme,
    onClick: () => router.push(`/services?category=${cat.slug}`),
  }))

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
          <div className="lg:flex lg:items-center lg:gap-12">
            <motion.div
              variants={stagger}
              initial="hidden"
              animate="show"
              className="relative z-10 mx-auto max-w-xl text-center lg:mx-0 lg:w-1/2 lg:text-left"
            >
              <motion.div variants={fadeUp} className="mx-auto flex w-fit items-center gap-2 rounded-lg border p-1 pr-3 lg:mx-0">
                <span className="rounded-md bg-muted px-2 py-1 text-xs font-medium">New</span>
                <span className="text-sm">Same-day service available</span>
                <ArrowRight className="h-4 w-4" />
              </motion.div>

              <motion.h1 variants={fadeUp} className="mt-8 text-balance text-4xl font-bold tracking-tight md:text-5xl xl:text-6xl">
                Professional services at your doorstep
              </motion.h1>
              <motion.p variants={fadeUp} className="mt-6 text-lg text-muted-foreground">
                Book trusted, vetted professionals for home services. From cleaning to repairs, get it done right with SparkAI.
              </motion.p>

              <motion.div variants={fadeUp} className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center lg:justify-start">
                <Button asChild size="lg">
                  <Link href="/services">
                    Browse Services
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="/signup">Get Started</Link>
                </Button>
              </motion.div>

              <motion.ul variants={fadeUp} className="mt-8 flex flex-wrap justify-center gap-x-8 gap-y-2 text-sm text-muted-foreground lg:justify-start">
                <li className="flex items-center gap-2"><Shield className="h-4 w-4 text-emerald-500" />Verified Providers</li>
                <li className="flex items-center gap-2"><Clock className="h-4 w-4 text-emerald-500" />On-Time Guarantee</li>
                <li className="flex items-center gap-2"><Star className="h-4 w-4 text-emerald-500" />4.9★ Average</li>
              </motion.ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40, scale: 0.97 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="mt-12 lg:mt-0 lg:w-1/2"
            >
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-2xl">
                <Image
                  src="https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=800&q=80"
                  alt="Professional service provider at work"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                  priority
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="border-t bg-muted/30 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            className="text-center"
          >
            <motion.h2 variants={fadeUp} className="text-3xl font-bold tracking-tight">Popular Service Categories</motion.h2>
            <motion.p variants={fadeUp} className="mt-2 text-muted-foreground">Choose from a wide range of professional services</motion.p>
          </motion.div>
          <motion.div
            className="mt-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card3DList cards={categoryCards} columns={3} gap="lg" size="md" variant="premium" />
          </motion.div>
        </div>
      </section>

      {/* Scroll reveal demo */}
      <ContainerScroll
        titleComponent={
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">See SparkAI in Action</h2>
            <p className="mt-3 text-lg text-muted-foreground">A seamless booking experience from start to finish</p>
          </motion.div>
        }
      >
        <Image
          src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=80"
          alt="SparkAI dashboard preview"
          fill
          sizes="100vw"
          className="object-cover object-left-top"
        />
      </ContainerScroll>

      {/* Features */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            className="text-center"
          >
            <motion.h2 variants={fadeUp} className="text-3xl font-bold tracking-tight">Why Choose SparkAI?</motion.h2>
            <motion.p variants={fadeUp} className="mt-2 text-muted-foreground">We make booking home services simple and reliable</motion.p>
          </motion.div>
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3"
          >
            {features.map((feature) => (
              <motion.div key={feature.title} variants={fadeUp}>
                <Card className="text-center h-full hover:shadow-md transition-shadow">
                  <CardContent className="pt-6">
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ type: "spring", stiffness: 300 }}
                      className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10"
                    >
                      <feature.icon className="h-6 w-6 text-primary" />
                    </motion.div>
                    <h3 className="mt-4 text-lg font-semibold">{feature.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.5 }}
        className="border-t bg-primary py-20 text-primary-foreground"
      >
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl font-bold"
          >
            Ready to get started?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-4 text-lg text-primary-foreground/80"
          >
            Join thousands of satisfied customers who trust SparkAI for their service needs.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-8 flex justify-center gap-4"
          >
            <Button asChild size="lg" variant="secondary">
              <Link href="/signup">Create Account</Link>
            </Button>
            <Button asChild size="lg" className="bg-primary-foreground text-primary hover:bg-primary-foreground/90">
              <Link href="/services">Explore Services</Link>
            </Button>
          </motion.div>
        </div>
      </motion.section>
    </>
  )
}


