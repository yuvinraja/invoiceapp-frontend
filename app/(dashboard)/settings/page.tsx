"use client"

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import * as z from "zod"
import api from "@/lib/axios"
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { Building2, CreditCard, FileText, Settings, Save, Loader2 } from "lucide-react"

const companySchema = z.object({
  name: z.string().optional(),
  company: z.string().min(1, "Company name is required"),
  gstin: z.string().optional(),
  phone: z.string().optional(),
  mobile: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  pincode: z.string().optional(),
  logoUrl: z.string().optional(),
})

const bankSchema = z.object({
  bankName: z.string().min(1, "Bank name is required"),
  branch: z.string().min(1, "Branch is required"),
  accountNo: z.string().min(1, "Account number is required"),
  ifscCode: z.string().min(1, "IFSC code is required"),
})

const termsSchema = z.object({
  terms: z.string().optional(),
})

export default function SettingsPage() {
  const [loading, setLoading] = useState(true)
  const [companyLoading, setCompanyLoading] = useState(false)
  const [bankLoading, setBankLoading] = useState(false)
  const [termsLoading, setTermsLoading] = useState(false)

  const companyForm = useForm({
    resolver: zodResolver(companySchema),
    defaultValues: {
      name: "",
      company: "",
      gstin: "",
      phone: "",
      mobile: "",
      address: "",
      city: "",
      state: "",
      pincode: "",
      logoUrl: "",
    },
  })

  const bankForm = useForm({
    resolver: zodResolver(bankSchema),
    defaultValues: {
      bankName: "",
      branch: "",
      accountNo: "",
      ifscCode: "",
    },
  })

  const termsForm = useForm({
    resolver: zodResolver(termsSchema),
    defaultValues: {
      terms: "",
    },
  })

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get("/user/me")
        const user = res.data.user

        // Ensure all values are strings, not null
        companyForm.reset({
          name: user.name || "",
          company: user.company || "",
          gstin: user.gstin || "",
          phone: user.phone || "",
          mobile: user.mobile || "",
          address: user.address || "",
          city: user.city || "",
          state: user.state || "",
          pincode: user.pincode || "",
          logoUrl: user.logoUrl || "",
        })

        if (user.bankDetail) {
          bankForm.reset({
            bankName: user.bankDetail.bankName || "",
            branch: user.bankDetail.branch || "",
            accountNo: user.bankDetail.accountNo || "",
            ifscCode: user.bankDetail.ifscCode || "",
          })
        }

        if (user.settings) {
          termsForm.reset({
            terms: user.settings.terms || "",
          })
        }
      } catch (err) {
        toast.error("Failed to load user settings.")
        console.error("Settings fetch error:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [bankForm, companyForm, termsForm])

  const handleCompanySubmit = async (data: z.infer<typeof companySchema>) => {
    setCompanyLoading(true)
    try {
      await api.patch("/user/me", data)
      toast.success("Company information updated successfully")
    } catch {
      toast.error("Failed to update company information")
    } finally {
      setCompanyLoading(false)
    }
  }

  const handleBankSubmit = async (data: z.infer<typeof bankSchema>) => {
    setBankLoading(true)
    try {
      await api.patch("/user/me/bank", data)
      toast.success("Bank details updated successfully")
    } catch {
      toast.error("Failed to update bank details")
    } finally {
      setBankLoading(false)
    }
  }

  const handleTermsSubmit = async (data: z.infer<typeof termsSchema>) => {
    setTermsLoading(true)
    try {
      await api.patch("/user/me/settings", data)
      toast.success("Terms & conditions updated successfully")
    } catch {
      toast.error("Failed to update terms & conditions")
    } finally {
      setTermsLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="space-y-2">
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-4 w-64" />
          </div>

          {[...Array(3)].map((_, i) => (
            <Card key={i} className="border-2">
              <CardHeader>
                <Skeleton className="h-6 w-40" />
                <Skeleton className="h-4 w-64" />
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  {[...Array(4)].map((_, j) => (
                    <div key={j} className="space-y-2">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-10 w-full" />
                    </div>
                  ))}
                </div>
                <Skeleton className="h-10 w-32" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold">Settings</h1>
            <Badge variant="secondary" className="ml-2">
              <Settings className="w-3 h-3 mr-1" />
              Configuration
            </Badge>
          </div>
          <p className="text-muted-foreground text-lg">
            Manage your business profile, banking details, and default settings
          </p>
        </div>

        {/* Company Information */}
        <Card className="border-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted">
                <Building2 className="h-4 w-4" />
              </div>
              Company Information
            </CardTitle>
            <CardDescription>Update your business details that appear on invoices</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...companyForm}>
              <form onSubmit={companyForm.handleSubmit(handleCompanySubmit)} className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <FormField
                    name="company"
                    control={companyForm.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">Company Name *</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter company name" className="h-11" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    name="gstin"
                    control={companyForm.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">GSTIN</FormLabel>
                        <FormControl>
                          <Input placeholder="22AAAAA0000A1Z5" className="h-11" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    name="phone"
                    control={companyForm.control}
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
                    name="mobile"
                    control={companyForm.control}
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

                  <FormField
                    name="address"
                    control={companyForm.control}
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel className="text-sm font-medium">Address</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Enter complete business address"
                            className="min-h-[80px] resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    name="city"
                    control={companyForm.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">City</FormLabel>
                        <FormControl>
                          <Input placeholder="Mumbai" className="h-11" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    name="state"
                    control={companyForm.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">State</FormLabel>
                        <FormControl>
                          <Input placeholder="Maharashtra" className="h-11" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    name="pincode"
                    control={companyForm.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">Pincode</FormLabel>
                        <FormControl>
                          <Input placeholder="400001" className="h-11" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    name="logoUrl"
                    control={companyForm.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">Company Logo URL</FormLabel>
                        <FormControl>
                          <Input placeholder="https://example.com/logo.png" className="h-11" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Button type="submit" disabled={companyLoading} className="min-w-[150px]">
                  {companyLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Company Info
                    </>
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Bank Details */}
        <Card className="border-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted">
                <CreditCard className="h-4 w-4" />
              </div>
              Banking Information
            </CardTitle>
            <CardDescription>Bank details for payment instructions on invoices</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...bankForm}>
              <form onSubmit={bankForm.handleSubmit(handleBankSubmit)} className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <FormField
                    name="bankName"
                    control={bankForm.control}
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
                    name="branch"
                    control={bankForm.control}
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
                    name="accountNo"
                    control={bankForm.control}
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
                    name="ifscCode"
                    control={bankForm.control}
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

                <Button type="submit" disabled={bankLoading} className="min-w-[150px]">
                  {bankLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Bank Details
                    </>
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Terms & Conditions */}
        <Card className="border-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted">
                <FileText className="h-4 w-4" />
              </div>
              Default Terms & Conditions
            </CardTitle>
            <CardDescription>Set default terms and conditions for all your invoices</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...termsForm}>
              <form onSubmit={termsForm.handleSubmit(handleTermsSubmit)} className="space-y-6">
                <FormField
                  name="terms"
                  control={termsForm.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">Terms & Conditions</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Payment due within 30 days. Late payments may incur additional charges..."
                          className="min-h-[120px] resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" disabled={termsLoading} className="min-w-[150px]">
                  {termsLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Terms
                    </>
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
