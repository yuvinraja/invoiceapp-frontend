import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
import type { Invoice } from "@/lib/types/user";
import { ToWords } from "to-words";

const styles = StyleSheet.create({
  page: {
    padding: 20,
    fontSize: 9,
    fontFamily: "Helvetica",
    lineHeight: 1.2,
  },
  header: {
    flexDirection: "row",
    marginBottom: 15,
    borderBottom: "2px solid #000",
    paddingBottom: 10,
  },
  headerLeft: {
    flex: 1,
    paddingRight: 10,
  },
  headerRight: {
    flex: 1,
    textAlign: "right",
  },
  logo: {
    width: 50,
    height: 50,
    marginBottom: 5,
  },
  invoiceTitle: {
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 5,
  },
  originalText: {
    fontSize: 8,
    textAlign: "right",
    marginBottom: 5,
  },
  section: {
    marginBottom: 10,
  },
  row: {
    flexDirection: "row",
    marginBottom: 10,
  },
  leftColumn: {
    flex: 1,
    paddingRight: 10,
  },
  rightColumn: {
    flex: 1,
    paddingLeft: 10,
  },
  bold: {
    fontWeight: "bold",
    marginBottom: 3,
  },
  table: {
    marginTop: 10,
    marginBottom: 10,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f0f0f0",
    borderTop: "1px solid #000",
    borderLeft: "1px solid #000",
    borderRight: "1px solid #000",
  },
  tableRow: {
    flexDirection: "row",
    borderLeft: "1px solid #000",
    borderRight: "1px solid #000",
    borderBottom: "1px solid #000",
  },
  tableCell: {
    padding: 4,
    borderRight: "1px solid #000",
    textAlign: "center",
    fontSize: 8,
  },
  tableCellLeft: {
    padding: 4,
    borderRight: "1px solid #000",
    textAlign: "left",
    fontSize: 8,
  },
  tableCellHeader: {
    padding: 4,
    borderRight: "1px solid #000",
    textAlign: "center",
    fontSize: 8,
    fontWeight: "bold",
  },
  totalsSection: {
    flexDirection: "row",
    marginTop: 15,
  },
  totalsLeft: {
    flex: 2,
    paddingRight: 20,
  },
  totalsRight: {
    flex: 1,
    borderLeft: "1px solid #000",
    paddingLeft: 10,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 3,
  },
  footer: {
    flexDirection: "row",
    marginTop: 20,
    borderTop: "1px solid #000",
    paddingTop: 10,
  },
  footerLeft: {
    flex: 1,
  },
  footerRight: {
    flex: 1,
    textAlign: "right",
  },
  signature: {
    marginTop: 30,
    textAlign: "right",
  },
});

type Props = {
  data: Invoice;
};

export const InvoicePDF = ({ data }: Props) => {
  const {
    invoiceType = "TAX",
    taxType = "CGST_SGST",
    items = [],
    client,
    user,
    invoiceNumber = "INV-001",
    invoiceDate = new Date(),
    poNumber,
    vehicleNumber,
    transporter,
    bundleCount = 0,
    subtotal = 0,
    cgst = 0,
    sgst = 0,
    igst = 0,
    total = 0,
    roundedTotal = 0,
    taxRate = 18,
  } = data || {};

  // Default values for missing data
  const defaultUser = {
    company: "Your Company Name",
    address: "Company Address Line 1",
    city: "City",
    state: "State",
    pincode: "123456",
    gstin: "GSTIN123456789",
    phone: "1234567890",
    mobile: "9876543210",
    logoUrl: "",
    bankDetail: {
      bankName: "Bank Name",
      branch: "Branch Name",
      accountNo: "1234567890",
      ifscCode: "IFSC0001234",
    },
    settings: {
      terms:
        "1. Payment terms: 30 days\n2. Interest @24% p.a. will be charged on delayed payments\n3. Subject to jurisdiction",
    },
  };

  const defaultClient = {
    name: "Client Name",
    address: "Client Address",
    city: "City",
    state: "State",
    pincode: "123456",
    gstin: "CLIENT123456789",
    shippingName: "",
    shippingAddress: "",
    shippingCity: "",
    shippingState: "",
    shippingPincode: "",
  };

  const invoiceUser = { ...defaultUser, ...user };
  const invoiceClient = { ...defaultClient, ...client };
  const toWords = new ToWords();

  // Calculate individual item totals
  const itemsWithTotals = items.map((item) => {
    const itemTotal = item.quantity * item.rate;
    const itemGst =
      taxType === "CGST_SGST"
        ? (itemTotal * taxRate) / 100
        : (itemTotal * taxRate) / 100;
    return {
      ...item,
      itemTotal,
      itemGst,
      finalAmount: itemTotal + itemGst,
    };
  });

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            {invoiceUser.logoUrl && (
              <Image
                src={invoiceUser.logoUrl || "/placeholder.svg"}
                style={styles.logo}
              />
            )}
          </View>
          <View style={styles.headerRight}>
            <Text style={styles.originalText}>
              Original/Duplicate/Triplicate
            </Text>
            <Text style={styles.invoiceTitle}>
              {invoiceType === "TAX" ? "TAX INVOICE" : "PROFORMA INVOICE"}
            </Text>
          </View>
        </View>

        {/* Company and Invoice Details */}
        <View style={styles.row}>
          <View style={styles.leftColumn}>
            <Text style={styles.bold}>Consignor:</Text>
            <Text>{invoiceUser.company}</Text>
            <Text>{invoiceUser.address}</Text>
            <Text>
              {invoiceUser.city}, {invoiceUser.state} - {invoiceUser.pincode}
            </Text>
            <Text>Ph: {invoiceUser.phone}</Text>
            <Text>Mob: {invoiceUser.mobile}</Text>
            <Text>GSTIN: {invoiceUser.gstin}</Text>
            <Text>MSME UDYAM NO: (optional)</Text>
          </View>
          <View style={styles.rightColumn}>
            <Text>Invoice Number: {invoiceNumber}</Text>
            <Text>
              Date: {new Date(invoiceDate).toLocaleDateString("en-IN")}
            </Text>
            {invoiceType === "TAX" && (
              <>
                <Text>PO NO: {poNumber || "-"}</Text>
                <Text>Vehicle Number: {vehicleNumber || "-"}</Text>
                <Text>Transporter: {transporter || "-"}</Text>
                <Text>No. of Bundles: {bundleCount}</Text>
              </>
            )}
          </View>
        </View>

        {/* Client and Bank Details */}
        <View style={styles.row}>
          <View style={styles.leftColumn}>
            <Text style={styles.bold}>Consignee - Bill To:</Text>
            <Text>{invoiceClient.name}</Text>
            <Text>{invoiceClient.address}</Text>
            <Text>
              {invoiceClient.city}, {invoiceClient.state} -{" "}
              {invoiceClient.pincode}
            </Text>
            <Text>Client GSTIN: {invoiceClient.gstin || "-"}</Text>

            {invoiceType === "TAX" &&
              (invoiceClient.shippingName || invoiceClient.shippingAddress) && (
                <View style={{ marginTop: 10 }}>
                  <Text style={styles.bold}>Consignee - Ship To:</Text>
                  <Text>
                    {invoiceClient.shippingName || invoiceClient.name}
                  </Text>
                  <Text>
                    {invoiceClient.shippingAddress || invoiceClient.address}
                  </Text>
                  <Text>
                    {invoiceClient.shippingCity || invoiceClient.city},{" "}
                    {invoiceClient.shippingState || invoiceClient.state} -{" "}
                    {invoiceClient.shippingPincode || invoiceClient.pincode}
                  </Text>
                </View>
              )}
          </View>
          <View style={styles.rightColumn}>
            <Text style={styles.bold}>Bank Details</Text>
            <Text>Mode of Payment - NEFT/RTGS</Text>
            <Text>Bank Name: {invoiceUser.bankDetail?.bankName}</Text>
            <Text>Branch: {invoiceUser.bankDetail?.branch}</Text>
            <Text>Account No: {invoiceUser.bankDetail?.accountNo}</Text>
            <Text>IFSC Code: {invoiceUser.bankDetail?.ifscCode}</Text>
          </View>
        </View>

        {/* Items Table */}
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableCellHeader, { flex: 0.5 }]}>Sl. No.</Text>
            <Text style={[styles.tableCellHeader, { flex: 3 }]}>
              Item Description
            </Text>
            <Text style={[styles.tableCellHeader, { flex: 1 }]}>HSN Code</Text>
            <Text style={[styles.tableCellHeader, { flex: 1 }]}>Units</Text>
            <Text style={[styles.tableCellHeader, { flex: 1 }]}>
              Basic Price
            </Text>
            <Text style={[styles.tableCellHeader, { flex: 1 }]}>GST</Text>
            <Text style={[styles.tableCellHeader, { flex: 1 }]}>Amount</Text>
          </View>

          {itemsWithTotals.length > 0
            ? itemsWithTotals.map((item, i) => (
                <View style={styles.tableRow} key={i}>
                  <Text style={[styles.tableCell, { flex: 0.5 }]}>{i + 1}</Text>
                  <Text style={[styles.tableCellLeft, { flex: 3 }]}>
                    {item.description}
                  </Text>
                  <Text style={[styles.tableCell, { flex: 1 }]}>
                    {item.hsnCode}
                  </Text>
                  <Text style={[styles.tableCell, { flex: 1 }]}>
                    {item.quantity}
                  </Text>
                  <Text style={[styles.tableCell, { flex: 1 }]}>
                    {item.rate.toFixed(2)}
                  </Text>
                  <Text style={[styles.tableCell, { flex: 1 }]}>
                    {item.itemGst.toFixed(2)}
                  </Text>
                  <Text style={[styles.tableCell, { flex: 1 }]}>
                    {item.finalAmount.toFixed(2)}
                  </Text>
                </View>
              ))
            : // Empty rows for better presentation
              [...Array(5)].map((_, i) => (
                <View style={styles.tableRow} key={`empty-${i}`}>
                  <Text style={[styles.tableCell, { flex: 0.5 }]}></Text>
                  <Text style={[styles.tableCellLeft, { flex: 3 }]}></Text>
                  <Text style={[styles.tableCell, { flex: 1 }]}></Text>
                  <Text style={[styles.tableCell, { flex: 1 }]}></Text>
                  <Text style={[styles.tableCell, { flex: 1 }]}></Text>
                  <Text style={[styles.tableCell, { flex: 1 }]}></Text>
                  <Text style={[styles.tableCell, { flex: 1 }]}></Text>
                </View>
              ))}
        </View>

        {/* Totals Section */}
        <View style={styles.totalsSection}>
          <View style={styles.totalsLeft}>
            <Text style={styles.bold}>Total Invoice Amount (in words):</Text>
            <Text>{toWords.convert(roundedTotal)} rupees only</Text>

            <View style={{ marginTop: 15 }}>
              <Text style={styles.bold}>Notes:</Text>
              <Text>Thank you for your business!</Text>
            </View>
          </View>

          <View style={styles.totalsRight}>
            <View style={styles.totalRow}>
              <Text>Taxable Amt:</Text>
              <Text>{subtotal.toFixed(2)}</Text>
            </View>

            {taxType === "CGST_SGST" ? (
              <>
                <View style={styles.totalRow}>
                  <Text>CGST @ {(taxRate / 2).toFixed(1)}%:</Text>
                  <Text>{cgst.toFixed(2)}</Text>
                </View>
                <View style={styles.totalRow}>
                  <Text>SGST @ {(taxRate / 2).toFixed(1)}%:</Text>
                  <Text>{sgst.toFixed(2)}</Text>
                </View>
              </>
            ) : (
              <View style={styles.totalRow}>
                <Text>IGST @ {taxRate.toFixed(1)}%:</Text>
                <Text>{igst.toFixed(2)}</Text>
              </View>
            )}

            <View
              style={[
                styles.totalRow,
                {
                  borderTop: "1px solid #000",
                  paddingTop: 3,
                  fontWeight: "bold",
                },
              ]}
            >
              <Text>Total:</Text>
              <Text>{total.toFixed(2)}</Text>
            </View>

            <View style={[styles.totalRow, { fontWeight: "bold" }]}>
              <Text>Rounded Off:</Text>
              <Text>{roundedTotal}</Text>
            </View>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <View style={styles.footerLeft}>
            <Text style={styles.bold}>Terms and Conditions</Text>
            <Text>{invoiceUser.settings?.terms}</Text>
          </View>
          <View style={styles.footerRight}>
            <Text>For {invoiceUser.company}</Text>
            <View style={styles.signature}>
              <Text>Proprietor</Text>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
};
