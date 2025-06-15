"use client"

import { useEffect, useState } from "react"
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import {
  User,
  Building2,
  CreditCard,
  FileText,
  Edit,
  CheckCircle,
  AlertCircle,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Settings,
} from "lucide-react"
import api from "@/lib/axios"
import { toast } from "sonner"
import Link from "next/link"
import { format } from "date-fns"

interface UserProfile {
  id: string
  email: string
  name?: string
  company?: string
  gstin?: string
  phone?: string
  mobile?: string
  address?: string
  city?: string
  state?: string
  pincode?: string
  logoUrl?: string
  createdAt: string
  bankDetail?: {
    bankName: string
    branch: string
    accountNo: string
    ifscCode: string
  }
  settings?: {
    terms?: string
  }
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/user/me")
        setProfile(res.data.user)
      } catch (err) {
        toast.error("Failed to load profile")
        console.error("Profile fetch error:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [])

  const isProfileComplete = () => {
    if (!profile) return false
    return !!(
      profile.company &&
      profile.address &&
      profile.city &&
      profile.state &&
      profile.pincode &&
      profile.bankDetail?.bankName &&
      profile.bankDetail?.branch &&
      profile.bankDetail?.accountNo &&
      profile.bankDetail?.ifscCode
    )
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
                      <Skeleton className="h-6 w-full" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Card className="border-2">
            <CardContent className="py-16">
              <div className="text-center">
                <AlertCircle className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">Profile Not Found</h3>
                <p className="text-muted-foreground mb-6">Unable to load your profile information</p>
                <Button asChild>
                  <Link href="/dashboard">Return to Dashboard</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  const profileComplete = isProfileComplete()

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-bold">Profile</h1>
              <Badge variant={profileComplete ? "default" : "secondary"} className="ml-2">
                {profileComplete ? (
                  <>
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Complete
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-3 h-3 mr-1" />
                    Incomplete
                  </>
                )}
              </Badge>
            </div>
            <p className="text-muted-foreground text-lg">View and manage your business profile information</p>
          </div>
          <Button asChild>
            <Link href="/settings">
              <Settings className="w-4 h-4 mr-2" />
              Edit Profile
            </Link>
          </Button>
        </div>

        {/* Profile Completion Alert */}
        {!profileComplete && (
          <Card className="border-2 border-orange-200 bg-orange-50/50">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <AlertCircle className="h-6 w-6 text-orange-600 mt-0.5" />
                <div className="flex-1">
                  <h3 className="font-semibold text-orange-900 mb-2">Profile Incomplete</h3>
                  <p className="text-orange-800 mb-4">
                    Your profile is missing required information. Complete your profile to start creating invoices and
                    access all features.
                  </p>
                  <Button asChild size="sm">
                    <Link href="/settings">
                      <Edit className="w-4 h-4 mr-2" />
                      Complete Profile
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Basic Information */}
        <Card className="border-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted">
                <User className="h-4 w-4" />
              </div>
              Basic Information
            </CardTitle>
            <CardDescription>Your account and personal details</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <div className="text-sm font-medium text-muted-foreground">Email Address</div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{profile.email}</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-sm font-medium text-muted-foreground">Member Since</div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{format(new Date(profile.createdAt), "MMMM dd, yyyy")}</span>
                </div>
              </div>

              {profile.name && (
                <div className="space-y-2">
                  <div className="text-sm font-medium text-muted-foreground">Full Name</div>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{profile.name}</span>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Company Information */}
        <Card className="border-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted">
                <Building2 className="h-4 w-4" />
              </div>
              Company Information
              {!profile.company && <Badge variant="outline">Missing</Badge>}
            </CardTitle>
            <CardDescription>Business details and contact information</CardDescription>
          </CardHeader>
          <CardContent>
            {profile.company ? (
              <div className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-muted-foreground">Company Name</div>
                    <div className="font-medium">{profile.company}</div>
                  </div>

                  {profile.gstin && (
                    <div className="space-y-2">
                      <div className="text-sm font-medium text-muted-foreground">GSTIN</div>
                      <div className="font-medium">{profile.gstin}</div>
                    </div>
                  )}

                  {profile.phone && (
                    <div className="space-y-2">
                      <div className="text-sm font-medium text-muted-foreground">Phone</div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{profile.phone}</span>
                      </div>
                    </div>
                  )}

                  {profile.mobile && (
                    <div className="space-y-2">
                      <div className="text-sm font-medium text-muted-foreground">Mobile</div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{profile.mobile}</span>
                      </div>
                    </div>
                  )}
                </div>

                {profile.address && (
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-muted-foreground">Address</div>
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <div className="font-medium">
                        {profile.address}
                        {(profile.city || profile.state || profile.pincode) && (
                          <div className="text-sm text-muted-foreground mt-1">
                            {[profile.city, profile.state, profile.pincode].filter(Boolean).join(", ")}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <Building2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Company Information</h3>
                <p className="text-muted-foreground mb-4">Add your company details to start creating invoices</p>
                <Button asChild>
                  <Link href="/settings">
                    <Edit className="w-4 h-4 mr-2" />
                    Add Company Info
                  </Link>
                </Button>
              </div>
            )}
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
              {!profile.bankDetail && <Badge variant="outline">Missing</Badge>}
            </CardTitle>
            <CardDescription>Bank details for payment instructions</CardDescription>
          </CardHeader>
          <CardContent>
            {profile.bankDetail ? (
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <div className="text-sm font-medium text-muted-foreground">Bank Name</div>
                  <div className="font-medium">{profile.bankDetail.bankName}</div>
                </div>

                <div className="space-y-2">
                  <div className="text-sm font-medium text-muted-foreground">Branch</div>
                  <div className="font-medium">{profile.bankDetail.branch}</div>
                </div>

                <div className="space-y-2">
                  <div className="text-sm font-medium text-muted-foreground">Account Number</div>
                  <div className="font-medium font-mono">
                    {profile.bankDetail.accountNo.replace(/(.{4})/g, "$1 ").trim()}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-sm font-medium text-muted-foreground">IFSC Code</div>
                  <div className="font-medium font-mono">{profile.bankDetail.ifscCode}</div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <CreditCard className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Banking Information</h3>
                <p className="text-muted-foreground mb-4">Add your bank details for payment instructions on invoices</p>
                <Button asChild>
                  <Link href="/settings">
                    <Edit className="w-4 h-4 mr-2" />
                    Add Bank Details
                  </Link>
                </Button>
              </div>
            )}
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
            <CardDescription>Your default terms for all invoices</CardDescription>
          </CardHeader>
          <CardContent>
            {profile.settings?.terms ? (
              <div className="space-y-2">
                <div className="text-sm font-medium text-muted-foreground">Terms & Conditions</div>
                <div className="p-4 bg-muted/30 rounded-lg">
                  <p className="text-sm whitespace-pre-wrap">{profile.settings.terms}</p>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Default Terms</h3>
                <p className="text-muted-foreground mb-4">Set default terms and conditions for your invoices</p>
                <Button asChild>
                  <Link href="/settings">
                    <Edit className="w-4 h-4 mr-2" />
                    Add Terms
                  </Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
