"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertCircle, Settings, ArrowRight } from "lucide-react"
import api from "@/lib/axios"
import Link from "next/link"

interface ProfileGuardProps {
  children: React.ReactNode
}

interface UserProfile {
  company?: string
  address?: string
  city?: string
  state?: string
  pincode?: string
  bankDetail?: {
    bankName: string
    branch: string
    accountNo: string
    ifscCode: string
  }
}

export default function ProfileGuard({ children }: ProfileGuardProps) {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [isComplete, setIsComplete] = useState(false)

  useEffect(() => {
    const checkProfile = async () => {
      try {
        const res = await api.get("/user/me")
        const user = res.data.user
        setProfile(user)

        // Check if profile is complete
        const complete = !!(
          user.company &&
          user.address &&
          user.city &&
          user.state &&
          user.pincode &&
          user.bankDetail?.bankName &&
          user.bankDetail?.branch &&
          user.bankDetail?.accountNo &&
          user.bankDetail?.ifscCode
        )

        setIsComplete(complete)
      } catch (error) {
        console.error("Profile check error:", error)
      } finally {
        setLoading(false)
      }
    }

    checkProfile()
  }, [])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Card className="border-2">
            <CardContent className="py-16">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-foreground mx-auto mb-4"></div>
                <p className="text-muted-foreground">Checking profile...</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (!isComplete) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Card className="border-2 border-destructive bg-destructive-foreground/50">
            <CardContent className="py-16">
              <div className="text-center">
                <AlertCircle className="h-16 w-16 mx-auto text-destructive mb-6" />
                <h2 className="text-2xl font-bold text-destructive mb-4">Profile Incomplete</h2>
                <p className="text-destructive mb-8 max-w-md mx-auto">
                  You need to complete your business profile before you can create invoices. This includes your company
                  information and banking details.
                </p>
                <div className="space-y-4">
                  <Button asChild size="lg" className="bg-destructive hover:bg-destructive/80">
                    <Link href="/settings">
                      <Settings className="w-4 h-4 mr-2" />
                      Complete Profile Now
                    </Link>
                  </Button>
                  <div className="text-sm text-destructive">
                    <Link href="/profile" className="inline-flex items-center hover:underline">
                      View current profile
                      <ArrowRight className="w-3 h-3 ml-1" />
                    </Link>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
