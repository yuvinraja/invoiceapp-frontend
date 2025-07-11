/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { PDFDownloadLink, PDFViewer } from "@react-pdf/renderer";
import { InvoicePDF } from "@/components/invoice/InvoicePDF";
import {
  ArrowLeft,
  Download,
  Eye,
  FileText,
  Loader2,
  Share,
  Printer,
  Edit,
  Calendar,
  User,
  IndianRupee,
  Hash,
} from "lucide-react";
import Link from "next/link";
import api from "@/lib/axios";
import { toast } from "sonner";
import { format } from "date-fns";
import type { Invoice } from "@/lib/types/user";

interface InvoiceViewerPageProps {
  invoiceId: string;
}

export default function InvoiceViewerPage({
  invoiceId,
}: InvoiceViewerPageProps) {
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(true);
  // const [pdfLoading, setPdfLoading] = useState(false)

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        const res = await api.get(`/invoices/${invoiceId}`);
        setInvoice(res.data);
      } catch (err) {
        // console.error("Error fetching invoice:", err);
        toast.error("Failed to load invoice");
      } finally {
        setLoading(false);
      }
    };

    if (invoiceId) {
      fetchInvoice();
    }
  }, [invoiceId]);

  const handlePrint = () => {
    window.print();
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Invoice #${invoice?.invoiceNumber}`,
          text: `Invoice for ${invoice?.client?.name}`,
          url: window.location.href,
        });
      } catch (err) {
        // console.error("Error sharing:", err);
        toast.error("Failed to share invoice");
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      toast.success("Invoice link copied to clipboard");
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Header Skeleton */}
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-4 w-64" />
            </div>
            <div className="flex gap-2">
              <Skeleton className="h-10 w-24" />
              <Skeleton className="h-10 w-24" />
              <Skeleton className="h-10 w-24" />
            </div>
          </div>

          {/* Invoice Details Skeleton */}
          <div className="grid gap-6 md:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <Card key={i} className="border-2">
                <CardHeader className="pb-2">
                  <Skeleton className="h-4 w-20" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-6 w-16 mb-2" />
                  <Skeleton className="h-3 w-24" />
                </CardContent>
              </Card>
            ))}
          </div>

          {/* PDF Viewer Skeleton */}
          <Card className="border-2">
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-96 w-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Card className="border-2">
            <CardContent className="py-16">
              <div className="text-center">
                <FileText className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">
                  Invoice Not Found
                </h3>
                <p className="text-muted-foreground mb-6">
                  The invoice you&apos;re looking for doesn&apos;t exist or has
                  been deleted
                </p>
                <Button asChild>
                  <Link href="/invoices">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Invoices
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/invoices" className="flex items-center">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Invoices
                </Link>
              </Button>
              <div className="h-6 w-px bg-border" />
              <div>
                <h1 className="text-2xl font-bold">
                  Invoice #{invoice.invoiceNumber}
                </h1>
                <p className="text-muted-foreground">
                  {invoice.client?.name} •{" "}
                  {format(new Date(invoice.invoiceDate), "MMMM dd, yyyy")}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge
                variant={
                  invoice.invoiceType === "TAX" ? "default" : "secondary"
                }
              >
                {invoice.invoiceType}
              </Badge>
              <Badge variant="outline">
                {invoice.taxType === "CGST_SGST" ? "CGST+SGST" : "IGST"}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Invoice Summary Cards */}
          <div className="grid gap-6 md:grid-cols-4">
            <Card className="border-2">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Invoice Number
                </CardTitle>
                <div className="p-2 bg-muted rounded-lg">
                  <Hash className="h-4 w-4" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  #{invoice.invoiceNumber}
                </div>
                <p className="text-xs text-muted-foreground">
                  {invoice.invoiceType} Invoice
                </p>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Client
                </CardTitle>
                <div className="p-2 bg-muted rounded-lg">
                  <User className="h-4 w-4" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold truncate">
                  {invoice.client?.name}
                </div>
                <p className="text-xs text-muted-foreground">
                  {invoice.client?.city}, {invoice.client?.state}
                </p>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Invoice Date
                </CardTitle>
                <div className="p-2 bg-muted rounded-lg">
                  <Calendar className="h-4 w-4" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {format(new Date(invoice.invoiceDate), "dd")}
                </div>
                <p className="text-xs text-muted-foreground">
                  {format(new Date(invoice.invoiceDate), "MMM yyyy")}
                </p>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Amount
                </CardTitle>
                <div className="p-2 bg-muted rounded-lg">
                  <IndianRupee className="h-4 w-4" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ₹{invoice.roundedTotal?.toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">
                  Including all taxes
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Action Buttons */}
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted">
                  <FileText className="h-4 w-4" />
                </div>
                Invoice Actions
              </CardTitle>
              <CardDescription>
                Download, print, or share this invoice
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4">
                <PDFDownloadLink
                  document={<InvoicePDF data={invoice} />}
                  fileName={`invoice-${invoice.invoiceNumber}.pdf`}
                >
                  {({ loading }) => (
                    <Button
                      disabled={loading}
                      className="flex items-center gap-2"
                    >
                      {loading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Download className="h-4 w-4" />
                      )}
                      {loading ? "Preparing PDF..." : "Download PDF"}
                    </Button>
                  )}
                </PDFDownloadLink>

                <Button
                  variant="outline"
                  onClick={handlePrint}
                  className="flex items-center gap-2 bg-transparent"
                >
                  <Printer className="h-4 w-4" />
                  Print Invoice
                </Button>

                <Button
                  variant="outline"
                  onClick={handleShare}
                  className="flex items-center gap-2 bg-transparent"
                >
                  <Share className="h-4 w-4" />
                  Share Invoice
                </Button>

                <Button
                  variant="outline"
                  asChild
                  className="flex items-center gap-2 bg-transparent"
                >
                  <Link href={`/invoices/${invoiceId}/edit`}>
                    <Edit className="h-4 w-4" />
                    Edit Invoice
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* PDF Preview */}
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted">
                  <Eye className="h-4 w-4" />
                </div>
                Invoice Preview
                <Badge variant="secondary" className="ml-2">
                  PDF Format
                </Badge>
              </CardTitle>
              <CardDescription>
                Preview of your GST-compliant invoice document
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div
                className="border-2 rounded-lg overflow-hidden bg-muted/20"
                style={{ height: "80vh" }}
              >
                <PDFViewer style={{ width: "100%", height: "100%" }}>
                  <InvoicePDF data={invoice} />
                </PDFViewer>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
