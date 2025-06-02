"use client"

import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { invoiceSchema, type InvoiceInput } from "@/lib/validation/invoice"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Trash2, Plus } from "lucide-react"
import api from "@/lib/axios"
import { useState } from "react"

import { PDFDownloadLink, PDFViewer } from "@react-pdf/renderer"
import { InvoicePDF } from "@/components/invoice/InvoicePDF"

export default function CreateInvoicePage() {
  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<InvoiceInput>({
    resolver: zodResolver(invoiceSchema),
    defaultValues: {
      invoiceType: "TAX",
      taxType: "CGST_SGST",
      invoiceDate: new Date().toISOString().split("T")[0],
      taxRate: 18,
      items: [{ description: "", hsnCode: "", quantity: 1, rate: 0 }],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  })

  const [loading, setLoading] = useState(false)
  const [submittedData, setSubmittedData] = useState<InvoiceInput | null>(null)

  const onSubmit = async (data: InvoiceInput) => {
    setLoading(true)
    try {
      // Calculate totals before submitting
      const calculatedData = {
        ...data,
        subtotal,
        cgst,
        sgst,
        igst,
        total,
        roundedTotal,
      }

      await api.post("/invoices", calculatedData)
      setSubmittedData(calculatedData)
      alert("Invoice created successfully!")
    } catch (err) {
      console.error(err)
      alert("Failed to create invoice")
    } finally {
      setLoading(false)
    }
  }

  // Watch form values for calculations
  const items = watch("items") || []
  const taxType = watch("taxType")
  const taxRate = watch("taxRate") || 18
  const invoiceType = watch("invoiceType")

  // Calculate totals
  const subtotal = items.reduce((sum, item) => {
    const quantity = Number(item.quantity) || 0
    const rate = Number(item.rate) || 0
    return sum + quantity * rate
  }, 0)

  const cgst = taxType === "CGST_SGST" ? (subtotal * taxRate) / 200 : 0
  const sgst = taxType === "CGST_SGST" ? (subtotal * taxRate) / 200 : 0
  const igst = taxType === "IGST" ? (subtotal * taxRate) / 100 : 0
  const total = subtotal + cgst + sgst + igst
  const roundedTotal = Math.round(total)

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900">Invoice Generator</h1>
        <p className="text-gray-600 mt-2">Create professional GST invoices</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Invoice Configuration */}
        <Card>
          <CardHeader>
            <CardTitle>Invoice Configuration</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="invoiceType">Invoice Type</Label>
                <Select onValueChange={(val) => setValue("invoiceType", val as any)} defaultValue="TAX">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="TAX">Tax Invoice</SelectItem>
                    <SelectItem value="PROFORMA">Proforma Invoice</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="taxType">Tax Type</Label>
                <Select onValueChange={(val) => setValue("taxType", val as any)} defaultValue="CGST_SGST">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CGST_SGST">CGST + SGST</SelectItem>
                    <SelectItem value="IGST">IGST</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="taxRate">Tax Rate (%)</Label>
                <Input
                  id="taxRate"
                  type="number"
                  step="0.01"
                  min="0"
                  max="100"
                  {...register("taxRate", { valueAsNumber: true })}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Invoice Details */}
        <Card>
          <CardHeader>
            <CardTitle>Invoice Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="invoiceNumber">Invoice Number *</Label>
                <Input
                  id="invoiceNumber"
                  type="number"
                  {...register("invoiceNumber", { valueAsNumber: true })}
                  className={errors.invoiceNumber ? "border-red-500" : ""}
                />
                {errors.invoiceNumber && <p className="text-red-500 text-sm mt-1">{errors.invoiceNumber.message}</p>}
              </div>

              <div>
                <Label htmlFor="invoiceDate">Invoice Date *</Label>
                <Input
                  id="invoiceDate"
                  type="date"
                  {...register("invoiceDate")}
                  className={errors.invoiceDate ? "border-red-500" : ""}
                />
              </div>

              {invoiceType === "TAX" && (
                <>
                  <div>
                    <Label htmlFor="poNumber">PO Number</Label>
                    <Input id="poNumber" {...register("poNumber")} />
                  </div>
                  <div>
                    <Label htmlFor="vehicleNumber">Vehicle Number</Label>
                    <Input id="vehicleNumber" {...register("vehicleNumber")} />
                  </div>
                  <div>
                    <Label htmlFor="transporter">Transporter</Label>
                    <Input id="transporter" {...register("transporter")} />
                  </div>
                  <div>
                    <Label htmlFor="bundleCount">No. of Bundles</Label>
                    <Input
                      id="bundleCount"
                      type="number"
                      min="0"
                      {...register("bundleCount", { valueAsNumber: true })}
                    />
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Client Details */}
        <Card>
          <CardHeader>
            <CardTitle>Client Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="clientName">Client Name *</Label>
                <Input
                  id="clientName"
                  {...register("client.name")}
                  placeholder="Enter client name"
                  className={errors.client?.name ? "border-red-500" : ""}
                />
              </div>
              <div>
                <Label htmlFor="clientGstin">GSTIN</Label>
                <Input id="clientGstin" {...register("client.gstin")} placeholder="Enter GSTIN" />
              </div>
              <div>
                <Label htmlFor="clientAddress">Address *</Label>
                <Input id="clientAddress" {...register("client.address")} placeholder="Enter address" />
              </div>
              <div>
                <Label htmlFor="clientCity">City *</Label>
                <Input id="clientCity" {...register("client.city")} placeholder="Enter city" />
              </div>
              <div>
                <Label htmlFor="clientState">State *</Label>
                <Input id="clientState" {...register("client.state")} placeholder="Enter state" />
              </div>
              <div>
                <Label htmlFor="clientPincode">Pincode *</Label>
                <Input id="clientPincode" {...register("client.pincode")} placeholder="Enter pincode" />
              </div>
            </div>

            {invoiceType === "TAX" && (
              <>
                <Separator />
                <h3 className="text-lg font-semibold">Shipping Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="shippingName">Shipping Name</Label>
                    <Input id="shippingName" {...register("client.shippingName")} placeholder="Enter shipping name" />
                  </div>
                  <div>
                    <Label htmlFor="shippingAddress">Shipping Address</Label>
                    <Input
                      id="shippingAddress"
                      {...register("client.shippingAddress")}
                      placeholder="Enter shipping address"
                    />
                  </div>
                  <div>
                    <Label htmlFor="shippingCity">Shipping City</Label>
                    <Input id="shippingCity" {...register("client.shippingCity")} placeholder="Enter shipping city" />
                  </div>
                  <div>
                    <Label htmlFor="shippingState">Shipping State</Label>
                    <Input
                      id="shippingState"
                      {...register("client.shippingState")}
                      placeholder="Enter shipping state"
                    />
                  </div>
                  <div>
                    <Label htmlFor="shippingPincode">Shipping Pincode</Label>
                    <Input
                      id="shippingPincode"
                      {...register("client.shippingPincode")}
                      placeholder="Enter shipping pincode"
                    />
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Items */}
        <Card>
          <CardHeader>
            <CardTitle>Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {fields.map((field, index) => (
                <div key={field.id} className="grid grid-cols-1 md:grid-cols-6 gap-4 items-end p-4 border rounded-lg">
                  <div className="md:col-span-2">
                    <Label htmlFor={`item-description-${index}`}>Description *</Label>
                    <Input
                      id={`item-description-${index}`}
                      placeholder="Item description"
                      {...register(`items.${index}.description`)}
                    />
                  </div>
                  <div>
                    <Label htmlFor={`item-hsn-${index}`}>HSN Code</Label>
                    <Input id={`item-hsn-${index}`} placeholder="HSN Code" {...register(`items.${index}.hsnCode`)} />
                  </div>
                  <div>
                    <Label htmlFor={`item-quantity-${index}`}>Quantity *</Label>
                    <Input
                      id={`item-quantity-${index}`}
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="Qty"
                      {...register(`items.${index}.quantity`, {
                        valueAsNumber: true,
                      })}
                    />
                  </div>
                  <div>
                    <Label htmlFor={`item-rate-${index}`}>Rate *</Label>
                    <Input
                      id={`item-rate-${index}`}
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="Rate"
                      {...register(`items.${index}.rate`, { valueAsNumber: true })}
                    />
                  </div>
                  <div>
                    <Label>Amount</Label>
                    <div className="p-2 bg-gray-50 rounded border text-right">
                      ₹{((items[index]?.quantity || 0) * (items[index]?.rate || 0)).toFixed(2)}
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => remove(index)}
                    disabled={fields.length === 1}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}

              <Button
                type="button"
                variant="outline"
                onClick={() => append({ description: "", hsnCode: "", quantity: 1, rate: 0 })}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Item
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Totals */}
        <Card>
          <CardHeader>
            <CardTitle>Invoice Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-right">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              {taxType === "CGST_SGST" ? (
                <>
                  <div className="flex justify-between">
                    <span>CGST ({(taxRate / 2).toFixed(1)}%):</span>
                    <span>₹{cgst.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>SGST ({(taxRate / 2).toFixed(1)}%):</span>
                    <span>₹{sgst.toFixed(2)}</span>
                  </div>
                </>
              ) : (
                <div className="flex justify-between">
                  <span>IGST ({taxRate.toFixed(1)}%):</span>
                  <span>₹{igst.toFixed(2)}</span>
                </div>
              )}
              <Separator />
              <div className="flex justify-between text-lg font-semibold">
                <span>Total:</span>
                <span>₹{total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-lg font-bold">
                <span>Rounded Total:</span>
                <span>₹{roundedTotal}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-center">
          <Button type="submit" disabled={loading || items.length === 0} size="lg" className="px-8">
            {loading ? "Generating..." : "Generate Invoice"}
          </Button>
        </div>
      </form>

      {submittedData && (
        <Card>
          <CardHeader>
            <CardTitle>Generated Invoice</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4">
              <PDFDownloadLink
                document={<InvoicePDF data={submittedData} />}
                fileName={`invoice-${submittedData.invoiceNumber}.pdf`}
              >
                {({ loading }) => <Button disabled={loading}>{loading ? "Preparing PDF..." : "Download PDF"}</Button>}
              </PDFDownloadLink>
            </div>
            <div className="border rounded-lg overflow-hidden" style={{ height: "80vh" }}>
              <PDFViewer style={{ width: "100%", height: "100%" }}>
                <InvoicePDF data={submittedData} />
              </PDFViewer>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
