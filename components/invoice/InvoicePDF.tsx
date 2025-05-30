import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer"
import { InvoiceInput } from "@/lib/validation/invoice"

// Optional custom fonts
// Font.register({ family: "Roboto", src: "/fonts/Roboto-Regular.ttf" })

const styles = StyleSheet.create({
  page: { padding: 30, fontSize: 12, fontFamily: "Helvetica" },
  section: { marginBottom: 10 },
  header: { fontSize: 16, fontWeight: "bold", marginBottom: 10 },
  table: { width: "auto", borderStyle: "solid", borderWidth: 1 },
  row: { flexDirection: "row" },
  cell: { padding: 5, borderRightWidth: 1, flexGrow: 1 }
})

type Props = {
  data: InvoiceInput
}

export const InvoicePDF = ({ data }: Props) => {
  const items = data.items
  const subtotal = items.reduce((sum, i) => sum + i.quantity * i.rate, 0)
  const taxRate = data.taxRate
  const cgst = data.taxType === "CGST_SGST" ? (subtotal * taxRate) / 200 : 0
  const sgst = cgst
  const igst = data.taxType === "IGST" ? (subtotal * taxRate) / 100 : 0
  const total = subtotal + cgst + sgst + igst

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <Text style={styles.header}>
            {data.invoiceType === "TAX" ? "Tax Invoice" : "Proforma Invoice"}
          </Text>
          <Text>Invoice Date: {data.invoiceDate}</Text>
          <Text>Client: {data.client.name}</Text>
          <Text>GSTIN: {data.client.gstin || "N/A"}</Text>
        </View>

        <View style={[styles.table, styles.section]}>
          <View style={styles.row}>
            <Text style={styles.cell}>Description</Text>
            <Text style={styles.cell}>HSN</Text>
            <Text style={styles.cell}>Qty</Text>
            <Text style={styles.cell}>Rate</Text>
            <Text style={styles.cell}>Amount</Text>
          </View>
          {items.map((item, i) => (
            <View style={styles.row} key={i}>
              <Text style={styles.cell}>{item.description}</Text>
              <Text style={styles.cell}>{item.hsnCode}</Text>
              <Text style={styles.cell}>{item.quantity}</Text>
              <Text style={styles.cell}>{item.rate}</Text>
              <Text style={styles.cell}>{item.quantity * item.rate}</Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text>Subtotal: ₹{subtotal.toFixed(2)}</Text>
          {data.taxType === "CGST_SGST" && (
            <>
              <Text>CGST: ₹{cgst.toFixed(2)}</Text>
              <Text>SGST: ₹{sgst.toFixed(2)}</Text>
            </>
          )}
          {data.taxType === "IGST" && <Text>IGST: ₹{igst.toFixed(2)}</Text>}
          <Text style={{ fontWeight: "bold" }}>Total: ₹{Math.round(total)}</Text>
        </View>
      </Page>
    </Document>
  )
}
