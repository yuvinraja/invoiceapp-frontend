"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { Upload, ImageIcon, X, Loader2, CheckCircle, AlertCircle } from "lucide-react"
import api from "@/lib/axios"
import Image from "next/image"

interface LogoUploadSectionProps {
  currentLogoUrl?: string
  onLogoUpdate?: (logoUrl: string) => void
  className?: string
  showCard?: boolean
}

export default function LogoUploadSection({
  currentLogoUrl,
  onLogoUpdate,
  className = "",
  showCard = true,
}: LogoUploadSectionProps) {
  const [file, setFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentLogoUrl || null)
  const [uploading, setUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0]
    if (selected) {
      validateAndSetFile(selected)
    }
  }

  const validateAndSetFile = (selectedFile: File) => {
    // Validate file type
    if (!selectedFile.type.startsWith("image/")) {
      toast.error("Please select a valid image file")
      return
    }

    // Validate file size (max 5MB)
    if (selectedFile.size > 5 * 1024 * 1024) {
      toast.error("File size must be less than 5MB")
      return
    }

    setFile(selectedFile)
    setPreviewUrl(URL.createObjectURL(selectedFile))
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0])
    }
  }

  const handleUpload = async () => {
    if (!file) return

    const formData = new FormData()
    formData.append("logo", file)

    try {
      setUploading(true)
      const res = await api.post("/user/upload-logo", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })

      toast.success("Logo uploaded successfully!")

      // Call the callback if provided
      if (onLogoUpdate && res.data.logoUrl) {
        onLogoUpdate(res.data.logoUrl)
      }

      // Reset file state but keep preview
      setFile(null)
    } catch (err) {
      console.error("Logo upload error:", err)
      toast.error("Failed to upload logo. Please try again.")
    } finally {
      setUploading(false)
    }
  }

  const handleRemove = () => {
    setFile(null)
    setPreviewUrl(null)
    if (onLogoUpdate) {
      onLogoUpdate("")
    }
  }

  const content = (
    <div className="space-y-6">
      {/* Upload Area */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Company Logo</Label>
        <div
          className={`relative border-2 border-dashed rounded-lg p-6 transition-colors ${
            dragActive ? "border-foreground bg-muted/50" : "border-muted-foreground/25 hover:border-muted-foreground/50"
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center justify-center space-y-4">
            {previewUrl ? (
              <div className="relative">
                <Image
                  src={previewUrl || "/placeholder.svg"}
                  alt="Logo Preview"
                  className="w-24 h-24 object-contain rounded-lg border-2 bg-background"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute -top-2 -right-2 h-6 w-6"
                  onClick={handleRemove}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ) : (
              <div className="flex h-24 w-24 items-center justify-center rounded-lg bg-muted">
                <ImageIcon className="h-8 w-8 text-muted-foreground" />
              </div>
            )}

            <div className="text-center">
              <p className="text-sm font-medium">{previewUrl ? "Logo Preview" : "Upload Company Logo"}</p>
              <p className="text-xs text-muted-foreground">Drag and drop or click to select</p>
              <p className="text-xs text-muted-foreground">PNG, JPG, GIF up to 5MB</p>
            </div>

            <Input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Upload Status */}
      {file && (
        <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
          <div className="flex items-center space-x-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted">
              <ImageIcon className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm font-medium">{file.name}</p>
              <p className="text-xs text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
            </div>
          </div>
          <Badge variant="secondary" className="flex items-center gap-1">
            <AlertCircle className="h-3 w-3" />
            Ready to upload
          </Badge>
        </div>
      )}

      {/* Current Logo Status */}
      {currentLogoUrl && !file && (
        <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
          <div className="flex items-center space-x-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted">
              <CheckCircle className="h-4 w-4 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium">Current Logo</p>
              <p className="text-xs text-muted-foreground">Logo is set and will appear on invoices</p>
            </div>
          </div>
          <Badge variant="default" className="flex items-center gap-1">
            <CheckCircle className="h-3 w-3" />
            Active
          </Badge>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3">
        {file && (
          <Button onClick={handleUpload} disabled={uploading} className="flex-1">
            {uploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Upload Logo
              </>
            )}
          </Button>
        )}

        {previewUrl && (
          <Button variant="outline" onClick={handleRemove} className="bg-transparent">
            <X className="mr-2 h-4 w-4" />
            Remove
          </Button>
        )}
      </div>
    </div>
  )

  if (!showCard) {
    return <div className={className}>{content}</div>
  }

  return (
    <Card className={`border-2 ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted">
            <ImageIcon className="h-4 w-4" />
          </div>
          Company Logo
        </CardTitle>
        <CardDescription>Upload your company logo to appear on invoices and documents</CardDescription>
      </CardHeader>
      <CardContent>{content}</CardContent>
    </Card>
  )
}
