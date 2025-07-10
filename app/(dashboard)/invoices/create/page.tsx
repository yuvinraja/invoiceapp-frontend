/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { invoiceSchema, type InvoiceInput } from "@/lib/validation/invoice";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Trash2,
  Plus,
  FileText,
  Calculator,
  User,
  Package,
  Download,
  Eye,
  ArrowLeft,
  Truck,
  Hash,
  Loader2,
} from "lucide-react";
import api from "@/lib/axios";
import { useState } from "react";
import { PDFDownloadLink, PDFViewer } from "@react-pdf/renderer";
import { InvoicePDF } from "@/components/invoice/InvoicePDF";
import Link from "next/link";

import type { Invoice } from "@/lib/types/user";
import ProfileGuard from "@/components/profile-guard";

import { getInvoiceById } from "@/lib/invoices";
import { toast } from "sonner";

export default function CreateInvoicePage() {
  const form = useForm<InvoiceInput>({
    resolver: zodResolver(invoiceSchema),
    defaultValues: {
      invoiceType: "TAX",
      taxType: "CGST_SGST",
      invoiceDate: new Date().toISOString().split("T")[0],
      taxRate: 18,
      items: [{ description: "", hsnCode: "", quantity: 1, rate: 0 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });

  const [loading, setLoading] = useState(false);
  const [submittedData, setSubmittedData] = useState<Invoice | null>(null);

  const onSubmit = async (data: InvoiceInput) => {
    setLoading(true);
    try {
      const calculatedData = {
        ...data,
        subtotal,
        cgst,
        sgst,
        igst,
        total,
        roundedTotal,
      };

      const response = await api.post("/invoices", calculatedData);

      const invoiceId = response.data.invoice.id;
      const fullInvoice = await getInvoiceById(invoiceId);
      setSubmittedData(fullInvoice);
      toast.success("Invoice created successfully!");
    } catch (err) {
      // console.error(err);
      toast.error("Failed to create invoice");
    } finally {
      setLoading(false);
    }
  };

  // Watch form values for calculations
  const items = form.watch("items") || [];
  const taxType = form.watch("taxType");
  const taxRate = form.watch("taxRate") || 18;
  const invoiceType = form.watch("invoiceType");

  // Calculate totals
  const subtotal = items.reduce((sum, item) => {
    const quantity = Number(item.quantity) || 0;
    const rate = Number(item.rate) || 0;
    return sum + quantity * rate;
  }, 0);

  const cgst = taxType === "CGST_SGST" ? (subtotal * taxRate) / 200 : 0;
  const sgst = taxType === "CGST_SGST" ? (subtotal * taxRate) / 200 : 0;
  const igst = taxType === "IGST" ? (subtotal * taxRate) / 100 : 0;
  const total = subtotal + cgst + sgst + igst;
  const roundedTotal = Math.round(total);

  return (
    <ProfileGuard>
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
                <Separator orientation="vertical" className="h-6" />
                <div>
                  <h1 className="text-2xl font-bold">Create Invoice</h1>
                  <p className="text-muted-foreground">
                    Generate professional GST-compliant invoices
                  </p>
                </div>
              </div>
              <Badge variant="secondary" className="flex items-center gap-1">
                <FileText className="h-3 w-3" />
                Draft
              </Badge>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
              >
                {/* Invoice Configuration */}
                <Card className="border-2">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted">
                        <FileText className="h-4 w-4" />
                      </div>
                      Invoice Configuration
                    </CardTitle>
                    <CardDescription>
                      Set up the basic invoice type and tax configuration
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid gap-6 md:grid-cols-3">
                      <FormField
                        control={form.control}
                        name="invoiceType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium">
                              Invoice Type
                            </FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger className="h-11">
                                  <SelectValue placeholder="Select invoice type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="TAX">Tax Invoice</SelectItem>
                                <SelectItem value="PROFORMA">
                                  Proforma Invoice
                                </SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="taxType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium">
                              Tax Type
                            </FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger className="h-11">
                                  <SelectValue placeholder="Select tax type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="CGST_SGST">
                                  CGST + SGST
                                </SelectItem>
                                <SelectItem value="IGST">IGST</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="taxRate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium">
                              Tax Rate (%)
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                step="0.01"
                                min="0"
                                max="100"
                                placeholder="18"
                                className="h-11"
                                {...field}
                                onChange={(e) =>
                                  field.onChange(
                                    Number.parseFloat(e.target.value)
                                  )
                                }
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Invoice Details */}
                <Card className="border-2">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted">
                        <Hash className="h-4 w-4" />
                      </div>
                      Invoice Details
                    </CardTitle>
                    <CardDescription>
                      Basic invoice information and reference numbers
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                      <FormField
                        control={form.control}
                        name="invoiceNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium">
                              Invoice Number *
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="Enter invoice number"
                                className="h-11"
                                {...field}
                                onChange={(e) =>
                                  field.onChange(
                                    Number.parseInt(e.target.value)
                                  )
                                }
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="invoiceDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium">
                              Invoice Date *
                            </FormLabel>
                            <FormControl>
                              <Input type="date" className="h-11" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {invoiceType === "TAX" && (
                        <>
                          <FormField
                            control={form.control}
                            name="poNumber"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-sm font-medium">
                                  PO Number
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="Purchase order number"
                                    className="h-11"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="vehicleNumber"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-sm font-medium">
                                  Vehicle Number
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="MH01AB1234"
                                    className="h-11"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="transporter"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-sm font-medium">
                                  Transporter
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="Transporter name"
                                    className="h-11"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="bundleCount"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-sm font-medium">
                                  No. of Bundles
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    type="number"
                                    min="0"
                                    placeholder="0"
                                    className="h-11"
                                    {...field}
                                    onChange={(e) =>
                                      field.onChange(
                                        Number.parseInt(e.target.value)
                                      )
                                    }
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Client Details */}
                <Card className="border-2">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted">
                        <User className="h-4 w-4" />
                      </div>
                      Client Details
                    </CardTitle>
                    <CardDescription>
                      Customer information and billing address
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                      <FormField
                        control={form.control}
                        name="client.name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium">
                              Client Name *
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Enter client name"
                                className="h-11"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="client.gstin"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium">
                              GSTIN
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="22AAAAA0000A1Z5"
                                className="h-11"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="client.address"
                        render={({ field }) => (
                          <FormItem className="md:col-span-2 lg:col-span-1">
                            <FormLabel className="text-sm font-medium">
                              Address *
                            </FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Enter complete address"
                                className="min-h-[44px] resize-none"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="client.city"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium">
                              City *
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Mumbai"
                                className="h-11"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="client.state"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium">
                              State *
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Maharashtra"
                                className="h-11"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="client.pincode"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium">
                              Pincode *
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="400001"
                                className="h-11"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {invoiceType === "TAX" && (
                      <>
                        <Separator />
                        <div>
                          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                            <Truck className="h-5 w-5" />
                            Shipping Details
                          </h3>
                          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            <FormField
                              control={form.control}
                              name="shippingName"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-sm font-medium">
                                    Shipping Name
                                  </FormLabel>
                                  <FormControl>
                                    <Input
                                      placeholder="Shipping contact name"
                                      className="h-11"
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name="shippingAddress"
                              render={({ field }) => (
                                <FormItem className="md:col-span-2 lg:col-span-1">
                                  <FormLabel className="text-sm font-medium">
                                    Shipping Address
                                  </FormLabel>
                                  <FormControl>
                                    <Textarea
                                      placeholder="Enter shipping address"
                                      className="min-h-[44px] resize-none"
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name="shippingCity"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-sm font-medium">
                                    Shipping City
                                  </FormLabel>
                                  <FormControl>
                                    <Input
                                      placeholder="Mumbai"
                                      className="h-11"
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name="shippingState"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-sm font-medium">
                                    Shipping State
                                  </FormLabel>
                                  <FormControl>
                                    <Input
                                      placeholder="Maharashtra"
                                      className="h-11"
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name="shippingPincode"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-sm font-medium">
                                    Shipping Pincode
                                  </FormLabel>
                                  <FormControl>
                                    <Input
                                      placeholder="400001"
                                      className="h-11"
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>

                {/* Items */}
                <Card className="border-2">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted">
                        <Package className="h-4 w-4" />
                      </div>
                      Invoice Items
                    </CardTitle>
                    <CardDescription>
                      Add products or services to your invoice
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      {fields.map((field, index) => (
                        <div
                          key={field.id}
                          className="p-6 border-2 rounded-lg bg-muted/20"
                        >
                          <div className="grid gap-4 md:grid-cols-6 items-end">
                            <div className="md:col-span-2">
                              <FormField
                                control={form.control}
                                name={`items.${index}.description`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel className="text-sm font-medium">
                                      Description *
                                    </FormLabel>
                                    <FormControl>
                                      <Input
                                        placeholder="Item description"
                                        className="h-11"
                                        {...field}
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>

                            <FormField
                              control={form.control}
                              name={`items.${index}.hsnCode`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-sm font-medium">
                                    HSN Code
                                  </FormLabel>
                                  <FormControl>
                                    <Input
                                      placeholder="HSN Code"
                                      className="h-11"
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name={`items.${index}.quantity`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-sm font-medium">
                                    Quantity *
                                  </FormLabel>
                                  <FormControl>
                                    <Input
                                      type="number"
                                      min="0"
                                      step="0.01"
                                      placeholder="1"
                                      className="h-11"
                                      {...field}
                                      onChange={(e) =>
                                        field.onChange(
                                          Number.parseFloat(e.target.value)
                                        )
                                      }
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name={`items.${index}.rate`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-sm font-medium">
                                    Rate *
                                  </FormLabel>
                                  <FormControl>
                                    <Input
                                      type="number"
                                      min="0"
                                      step="0.01"
                                      placeholder="0.00"
                                      className="h-11"
                                      {...field}
                                      onChange={(e) =>
                                        field.onChange(
                                          Number.parseFloat(e.target.value)
                                        )
                                      }
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <div className="flex items-end gap-2">
                              <div className="flex-1">
                                <FormLabel className="text-sm font-medium">
                                  Amount
                                </FormLabel>
                                <div className="h-11 px-3 py-2 bg-muted rounded-md border flex items-center justify-end font-medium">
                                  ₹
                                  {(
                                    (items[index]?.quantity || 0) *
                                    (items[index]?.rate || 0)
                                  ).toFixed(2)}
                                </div>
                              </div>
                              <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                onClick={() => remove(index)}
                                disabled={fields.length === 1}
                                className="h-11 w-11 text-muted-foreground hover:text-destructive"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}

                      <Button
                        type="button"
                        variant="outline"
                        onClick={() =>
                          append({
                            description: "",
                            hsnCode: "",
                            quantity: 1,
                            rate: 0,
                          })
                        }
                        className="w-full h-12 border-2 border-dashed"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Another Item
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Invoice Summary */}
                <Card className="border-2">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted">
                        <Calculator className="h-4 w-4" />
                      </div>
                      Invoice Summary
                    </CardTitle>
                    <CardDescription>
                      Calculated totals and tax breakdown
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="bg-muted/30 p-6 rounded-lg">
                        <div className="space-y-3">
                          <div className="flex justify-between text-base">
                            <span className="text-muted-foreground">
                              Subtotal:
                            </span>
                            <span className="font-medium">
                              ₹{subtotal.toFixed(2)}
                            </span>
                          </div>

                          {taxType === "CGST_SGST" ? (
                            <>
                              <div className="flex justify-between text-base">
                                <span className="text-muted-foreground">
                                  CGST ({(taxRate / 2).toFixed(1)}%):
                                </span>
                                <span className="font-medium">
                                  ₹{cgst.toFixed(2)}
                                </span>
                              </div>
                              <div className="flex justify-between text-base">
                                <span className="text-muted-foreground">
                                  SGST ({(taxRate / 2).toFixed(1)}%):
                                </span>
                                <span className="font-medium">
                                  ₹{sgst.toFixed(2)}
                                </span>
                              </div>
                            </>
                          ) : (
                            <div className="flex justify-between text-base">
                              <span className="text-muted-foreground">
                                IGST ({taxRate.toFixed(1)}%):
                              </span>
                              <span className="font-medium">
                                ₹{igst.toFixed(2)}
                              </span>
                            </div>
                          )}

                          <Separator />

                          <div className="flex justify-between text-lg font-semibold">
                            <span>Total:</span>
                            <span>₹{total.toFixed(2)}</span>
                          </div>

                          <div className="flex justify-between text-xl font-bold">
                            <span>Rounded Total:</span>
                            <span>₹{roundedTotal}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Submit Button */}
                <div className="flex justify-center pt-6">
                  <Button
                    type="submit"
                    disabled={loading || items.length === 0}
                    size="lg"
                    className="min-w-[200px] h-12"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generating Invoice...
                      </>
                    ) : (
                      <>
                        <FileText className="mr-2 h-4 w-4" />
                        Generate Invoice
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </Form>

            {/* Generated Invoice Preview */}
            {submittedData && (
              <Card className="border-2 mt-8">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted">
                      <Eye className="h-4 w-4" />
                    </div>
                    Generated Invoice
                    <Badge variant="secondary" className="ml-2">
                      Ready
                    </Badge>
                  </CardTitle>
                  <CardDescription>
                    Your invoice has been generated successfully
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex gap-4">
                    <PDFDownloadLink
                      document={<InvoicePDF data={submittedData} />}
                      fileName={`invoice-${submittedData.invoiceNumber}.pdf`}
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
                  </div>

                  <div
                    className="border-2 rounded-lg overflow-hidden"
                    style={{ height: "80vh" }}
                  >
                    <PDFViewer style={{ width: "100%", height: "100%" }}>
                      <InvoicePDF data={submittedData} />
                    </PDFViewer>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </ProfileGuard>
  );
}
