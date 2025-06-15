/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { profileSchema, type ProfileInput } from "@/lib/validation/profile"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useAuth } from "@/context/AuthContext"
import api from "@/lib/axios"
import Protected from "@/components/auth/Protected"
import Link from "next/link"
import {
  FileText,
  Building2,
  Phone,
  MapPin,
  CreditCard,
  ArrowLeft,
  ArrowRight,
  Loader2,
  CheckCircle,
  User,
  Landmark,
} from "lucide-react"

export default function SetupProfilePage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [submitting, setSubmitting] = useState(false)

  const form = useForm<ProfileInput>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      company: user?.company ?? "",
      gstin: "",
      phone: "",
      mobile: "",
      address: "",
      city: "",
      state: "",
      pincode: "",
      logoUrl: "",
      terms: "",
      bank: {
        bankName: "",
        branch: "",
        accountNo: "",
        ifscCode: "",
      },
    },
  })

  const onSubmit = async (values: ProfileInput) => {
    setSubmitting(true)
    try {
      await api.post("/user/setup-profile", values)
      router.push("/invoices/create")
    } catch (err: any) {
      console.error(err)
      alert(err.response?.data?.message || "Failed to save profile")
    } finally {
      setSubmitting(false)
    }
  }

  useEffect(() => {
    if (!loading && user?.bankDetail) {
      router.push("/invoices/create")
    }
  }, [user, loading, router])

  return (
    <Protected>
      <div className="min-h-screen bg-background">
        {/* Navigation */}
        <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
                <FileText className="h-6 w-6" />
                <span className="text-xl font-bold">InvoiceGST</span>
              </Link>
              <div className="flex items-center space-x-4">
                <Badge variant="secondary" className="text-xs">
                  Setup in Progress
                </Badge>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/dashboard" className="flex items-center">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Skip for Now
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </nav>

        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            {/* Header Section */}
            <div className="text-center mb-12">
              <div className="flex items-center justify-center mb-6">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                  <User className="h-8 w-8" />
                </div>
              </div>
              <h1 className="text-4xl font-bold mb-4">Complete Your Business Profile</h1>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Set up your business information to start creating professional GST-compliant invoices
              </p>

              {/* Progress Indicator */}
              <div className="max-w-md mx-auto">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Setup Progress</span>
                  <span className="text-sm text-muted-foreground">Step 1 of 2</span>
                </div>
                <Progress value={50} className="h-2" />
                <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                  <span>Profile Setup</span>
                  <span>Ready to Invoice</span>
                </div>
              </div>
            </div>

            {/* Main Form */}
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                {/* Company Information */}
                <Card className="border-2">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted">
                        <Building2 className="h-4 w-4" />
                      </div>
                      Company Information
                    </CardTitle>
                    <CardDescription>Basic details about your business for invoice generation</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid gap-6 md:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="company"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium">Company Name *</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter your company name" className="h-11" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="gstin"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium">GSTIN *</FormLabel>
                            <FormControl>
                              <Input placeholder="22AAAAA0000A1Z5" className="h-11" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="logoUrl"
                        render={({ field }) => (
                          <FormItem className="md:col-span-2">
                            <FormLabel className="text-sm font-medium">Company Logo URL</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="https://example.com/logo.png (optional)"
                                className="h-11"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Contact Information */}
                <Card className="border-2">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted">
                        <Phone className="h-4 w-4" />
                      </div>
                      Contact Information
                    </CardTitle>
                    <CardDescription>Contact details that will appear on your invoices</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid gap-6 md:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium">Phone Number</FormLabel>
                            <FormControl>
                              <Input placeholder="+91 12345 67890" className="h-11" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="mobile"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium">Mobile Number</FormLabel>
                            <FormControl>
                              <Input placeholder="+91 98765 43210" className="h-11" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Address Information */}
                <Card className="border-2">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted">
                        <MapPin className="h-4 w-4" />
                      </div>
                      Business Address
                    </CardTitle>
                    <CardDescription>Your business address for GST compliance and invoicing</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium">Street Address *</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Enter your complete business address"
                              className="min-h-[80px] resize-none"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid gap-6 md:grid-cols-3">
                      <FormField
                        control={form.control}
                        name="city"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium">City *</FormLabel>
                            <FormControl>
                              <Input placeholder="Mumbai" className="h-11" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="state"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium">State *</FormLabel>
                            <FormControl>
                              <Input placeholder="Maharashtra" className="h-11" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="pincode"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium">Pincode *</FormLabel>
                            <FormControl>
                              <Input placeholder="400001" className="h-11" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Bank Details */}
                <Card className="border-2">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted">
                        <Landmark className="h-4 w-4" />
                      </div>
                      Banking Information
                    </CardTitle>
                    <CardDescription>Bank details for payment instructions on invoices</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid gap-6 md:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="bank.bankName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium">Bank Name *</FormLabel>
                            <FormControl>
                              <Input placeholder="State Bank of India" className="h-11" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="bank.branch"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium">Branch *</FormLabel>
                            <FormControl>
                              <Input placeholder="Mumbai Main Branch" className="h-11" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="bank.accountNo"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium">Account Number *</FormLabel>
                            <FormControl>
                              <Input placeholder="1234567890" className="h-11" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="bank.ifscCode"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium">IFSC Code *</FormLabel>
                            <FormControl>
                              <Input placeholder="SBIN0000123" className="h-11" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Terms & Conditions */}
                <Card className="border-2">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted">
                        <FileText className="h-4 w-4" />
                      </div>
                      Terms & Conditions
                    </CardTitle>
                    <CardDescription>Default terms and conditions for your invoices (optional)</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <FormField
                      control={form.control}
                      name="terms"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium">Terms & Conditions</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Payment due within 30 days. Late payments may incur additional charges..."
                              className="min-h-[100px] resize-none"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-between items-center pt-6">
                  <Button variant="outline" size="lg" asChild>
                    <Link href="/dashboard" className="flex items-center">
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Skip for Now
                    </Link>
                  </Button>

                  <Button type="submit" size="lg" className="min-w-[200px]" disabled={submitting}>
                    {submitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Setting up Profile...
                      </>
                    ) : (
                      <>
                        Complete Setup
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </Form>

            {/* Help Section */}
            <Card className="mt-12 bg-muted/30">
              <CardContent className="p-8">
                <div className="text-center">
                  <CheckCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Need Help?</h3>
                  <p className="text-muted-foreground mb-4">
                    Our setup wizard will guide you through creating your first GST-compliant invoice
                  </p>
                  <div className="flex justify-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <FileText className="h-3 w-3 mr-1" />
                      GST Compliant
                    </div>
                    <div className="flex items-center">
                      <CreditCard className="h-3 w-3 mr-1" />
                      Secure Setup
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Quick & Easy
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Protected>
  )
}
