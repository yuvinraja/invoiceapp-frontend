import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { CheckCircle, FileText, BarChart3, Shield, ArrowRight, Zap } from "lucide-react"
import { ModeToggle } from "@/components/theme-switcher";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <FileText className="h-6 w-6" />
              <span className="text-xl font-bold">InvoiceGST</span>
            </div>
            <div className="flex items-center space-x-4">
              <ModeToggle />
              <Button variant="ghost" asChild>
                <Link href="/login">Sign In</Link>
              </Button>
              <Button asChild>
                <Link href="/signup">Get Started</Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4">
        {/* Hero Section */}
        <section className="py-20 text-center">
          <div className="mx-auto max-w-4xl">
            <Badge variant="secondary" className="mb-6">
              <Zap className="mr-1 h-3 w-3" />
              GST Compliant Platform
            </Badge>

            <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
              Simple. <span className="text-muted-foreground">GST-Compliant.</span>
              <br />
              <span className="bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
                Hassle-Free Invoicing.
              </span>
            </h1>

            <p className="mx-auto mb-10 max-w-2xl text-lg text-muted-foreground sm:text-xl">
              Streamline your business operations with our comprehensive GST invoice management platform. Create,
              manage, and track invoices with enterprise-grade precision.
            </p>

            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Button size="lg" className="text-base" asChild>
                <Link href="/signup">
                  Start Free Trial
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" className="text-base bg-transparent" asChild>
                <Link href="/login">Sign In</Link>
              </Button>
            </div>
          </div>
        </section>

        <Separator className="my-16" />

        {/* Features Section */}
        <section className="py-16">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Everything you need to manage GST invoices</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Built for businesses of all sizes, from startups to enterprises
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <Card className="relative overflow-hidden border-2 transition-all hover:shadow-lg hover:-translate-y-1">
              <CardHeader className="pb-4">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-muted">
                  <FileText className="h-6 w-6" />
                </div>
                <CardTitle className="text-xl">GST Compliant</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">
                  Generate TAX and PROFORMA invoices that fully comply with GST regulations and government standards
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden border-2 transition-all hover:shadow-lg hover:-translate-y-1">
              <CardHeader className="pb-4">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-muted">
                  <BarChart3 className="h-6 w-6" />
                </div>
                <CardTitle className="text-xl">Advanced Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">
                  Track business performance with detailed analytics, reports, and insights to drive growth
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden border-2 transition-all hover:shadow-lg hover:-translate-y-1">
              <CardHeader className="pb-4">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-muted">
                  <Shield className="h-6 w-6" />
                </div>
                <CardTitle className="text-xl">Enterprise Security</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">
                  Your sensitive business data is protected with bank-grade security and encryption protocols
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden border-2 transition-all hover:shadow-lg hover:-translate-y-1">
              <CardHeader className="pb-4">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-muted">
                  <CheckCircle className="h-6 w-6" />
                </div>
                <CardTitle className="text-xl">Intuitive Design</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">
                  Clean, modern interface designed for efficiency and ease of use across all business sizes
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16">
          <Card className="bg-muted/50">
            <CardContent className="p-12">
              <div className="grid gap-8 md:grid-cols-3 text-center">
                <div>
                  <div className="text-4xl font-bold mb-2">100+</div>
                  <div className="text-muted-foreground">Invoices Generated</div>
                </div>
                <div>
                  <div className="text-4xl font-bold mb-2">5+</div>
                  <div className="text-muted-foreground">Happy Businesses</div>
                </div>
                <div>
                  <div className="text-4xl font-bold mb-2">99.9%</div>
                  <div className="text-muted-foreground">Uptime Guarantee</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* CTA Section */}
        <section className="py-20 text-center">
          <div className="mx-auto max-w-2xl">
            <h2 className="mb-6 text-3xl font-bold sm:text-4xl">Ready to streamline your invoicing?</h2>
            <p className="mb-8 text-lg text-muted-foreground">
              Join thousands of businesses already using our platform to manage their GST invoices efficiently.
            </p>
            <Button size="lg" className="text-base" asChild>
              <Link href="/signup">
                Start Your Free Trial
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="border-t bg-muted/30">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center text-sm text-muted-foreground">© 2024 InvoiceGST. All rights reserved.</div>
        </div>
      </footer>
    </div>
  )
}
