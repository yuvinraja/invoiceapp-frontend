"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { useRouter } from "next/navigation"
import { FileText, Plus, Search, Eye, Trash2, Calendar, User, DollarSign, Filter, Download } from "lucide-react"
import { format } from "date-fns"
import api from "@/lib/axios"
import Protected from "@/components/auth/Protected"
import Link from "next/link"

type InvoiceSummary = {
  id: string
  invoiceNumber: string
  invoiceDate: string
  invoiceType: "TAX" | "PROFORMA"
  taxType: "CGST_SGST" | "IGST"
  total: number
  clientName: string
}

export default function InvoiceListPage() {
  const [invoices, setInvoices] = useState<InvoiceSummary[]>([])
  const [filteredInvoices, setFilteredInvoices] = useState<InvoiceSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState<"ALL" | "TAX" | "PROFORMA">("ALL")
  const router = useRouter()

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const res = await api.get("/invoices")
        setInvoices(res.data)
        setFilteredInvoices(res.data)
      } catch (err) {
        console.error("Error fetching invoices", err)
      } finally {
        setLoading(false)
      }
    }

    fetchInvoices()
  }, [])

  useEffect(() => {
    let filtered = invoices

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (invoice) =>
          invoice.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          invoice.invoiceNumber.toString().includes(searchTerm),
      )
    }

    // Filter by type
    if (filterType !== "ALL") {
      filtered = filtered.filter((invoice) => invoice.invoiceType === filterType)
    }

    setFilteredInvoices(filtered)
  }, [invoices, searchTerm, filterType])

  const handleView = (id: string) => {
    router.push(`/invoices/${id}`)
  }

  const handleDelete = async (id: string) => {
    const confirm = window.confirm("Are you sure you want to delete this invoice?")
    if (!confirm) return

    try {
      await api.delete(`/invoices/${id}`)
      setInvoices((prev) => prev.filter((inv) => inv.id !== id))
    } catch (err) {
      console.error("Delete failed", err)
      alert("Failed to delete invoice")
    }
  }

  const totalRevenue = filteredInvoices.reduce((sum, invoice) => sum + invoice.total, 0)

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Header Skeleton */}
          <div className="space-y-4">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-96" />
          </div>

          {/* Stats Skeleton */}
          <div className="grid gap-6 md:grid-cols-3">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="border-2">
                <CardHeader className="pb-2">
                  <Skeleton className="h-4 w-24" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-16 mb-2" />
                  <Skeleton className="h-3 w-32" />
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Invoice List Skeleton */}
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <Card key={i} className="border-2">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <Skeleton className="h-5 w-32" />
                      <Skeleton className="h-4 w-48" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                    <div className="flex items-center gap-3">
                      <Skeleton className="h-6 w-16" />
                      <Skeleton className="h-9 w-16" />
                      <Skeleton className="h-9 w-16" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <Protected>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Invoice Management</h1>
              <p className="text-muted-foreground text-lg">Manage and track all your GST-compliant invoices</p>
            </div>
            <Button asChild size="lg" className="flex items-center gap-2">
              <Link href="/invoices/create">
                <Plus className="h-4 w-4" />
                Create Invoice
              </Link>
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid gap-6 md:grid-cols-3">
            <Card className="border-2">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Invoices</CardTitle>
                <div className="p-2 bg-muted rounded-lg">
                  <FileText className="h-4 w-4" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{filteredInvoices.length}</div>
                <p className="text-xs text-muted-foreground">
                  {filterType === "ALL" ? "All invoices" : `${filterType} invoices`}
                </p>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
                <div className="p-2 bg-muted rounded-lg">
                  <DollarSign className="h-4 w-4" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">₹{totalRevenue.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">From filtered invoices</p>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Average Value</CardTitle>
                <div className="p-2 bg-muted rounded-lg">
                  <Calendar className="h-4 w-4" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  ₹
                  {filteredInvoices.length > 0
                    ? Math.round(totalRevenue / filteredInvoices.length).toLocaleString()
                    : 0}
                </div>
                <p className="text-xs text-muted-foreground">Per invoice</p>
              </CardContent>
            </Card>
          </div>

          {/* Filters and Search */}
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Filters & Search
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by client name or invoice number..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 h-11"
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    variant={filterType === "ALL" ? "default" : "outline"}
                    onClick={() => setFilterType("ALL")}
                    size="sm"
                  >
                    All
                  </Button>
                  <Button
                    variant={filterType === "TAX" ? "default" : "outline"}
                    onClick={() => setFilterType("TAX")}
                    size="sm"
                  >
                    Tax Invoice
                  </Button>
                  <Button
                    variant={filterType === "PROFORMA" ? "default" : "outline"}
                    onClick={() => setFilterType("PROFORMA")}
                    size="sm"
                  >
                    Proforma
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Invoice List */}
          <div className="space-y-4">
            {filteredInvoices.length === 0 ? (
              <Card className="border-2">
                <CardContent className="py-16">
                  <div className="text-center">
                    <FileText className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-xl font-semibold mb-2">
                      {searchTerm || filterType !== "ALL" ? "No matching invoices" : "No invoices yet"}
                    </h3>
                    <p className="text-muted-foreground mb-6">
                      {searchTerm || filterType !== "ALL"
                        ? "Try adjusting your search or filter criteria"
                        : "Create your first invoice to get started with GST-compliant billing"}
                    </p>
                    {!searchTerm && filterType === "ALL" && (
                      <Button asChild size="lg">
                        <Link href="/invoices/create">
                          <Plus className="h-4 w-4 mr-2" />
                          Create Your First Invoice
                        </Link>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ) : (
              filteredInvoices.map((invoice) => (
                <Card key={invoice.id} className="border-2 transition-all hover:shadow-lg hover:-translate-y-1">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <h3 className="text-xl font-semibold">#{invoice.invoiceNumber}</h3>
                          <Badge variant={invoice.invoiceType === "TAX" ? "default" : "secondary"}>
                            {invoice.invoiceType}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {invoice.taxType === "CGST_SGST" ? "CGST+SGST" : "IGST"}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {invoice.clientName}
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {format(new Date(invoice.invoiceDate), "dd MMM yyyy")}
                          </div>
                        </div>
                        <div className="flex items-center gap-1 text-lg font-semibold">
                          <DollarSign className="h-4 w-4" />₹{invoice.total.toLocaleString()}
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <Button variant="outline" size="sm" onClick={() => handleView(invoice.id)}>
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(invoice.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    </Protected>
  )
}
