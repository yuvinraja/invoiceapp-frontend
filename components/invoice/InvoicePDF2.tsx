import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
} from '@react-pdf/renderer';

import { ToWords } from 'to-words';
import type { Invoice } from '@/lib/types/user';

const styles = StyleSheet.create({
  page: {
    padding: 20,
    fontFamily: 'Helvetica',
    fontSize: 10,
    color: '#000000',
  },
  invoiceContainer: {
    border: '2px solid black',
  },
  // Header
  header: {
    backgroundColor: '#952B79',
    color: '#ffffff',
    padding: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoContainer: {
    width: 40,
    height: 40,
    backgroundColor: 'transparent',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  logoPlaceholder: {
    width: 32,
    height: 32,
    backgroundColor: '#2563EB',
    borderRadius: 4,
    color: '#ffffff',
    textAlign: 'center',
    lineHeight: 32,
    fontSize: 12,
    fontWeight: 'bold',
  },
  logo: {
    width: 40,
    height: 40,
    objectFit: 'contain',
  },
  companyBlock: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  companyText: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    width: '100%',
  },
  // Invoice type bar (centered, with borders)
  invoiceTypeBarWrapper: {
    borderLeft: '2px solid black',
    borderRight: '2px solid black',
    borderTop: '2px solid black',
    borderBottom: '2px solid black',
    backgroundColor: '#F9FAFB',
    marginLeft: -2,
    marginRight: -2,
    marginBottom: -1,
    // The marginLeft/Right negative offsets ensure the border lines up with the main container
  },
  invoiceTypeBar: {
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 34,
    justifyContent: 'center',
    width: '100%',
  },
  invoiceTypeCenter: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    display: 'flex',
  },
  invoiceTypeText: {
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#000000',
    letterSpacing: 1,
    marginLeft: 0,
    marginRight: 0,
  },
  // Info Row: Address and Details (new)
  infoRow: {
    flexDirection: 'row',
    backgroundColor: '#F9FAFB',
    borderBottom: '1px solid black',
    alignItems: 'stretch',
  },
  infoLeftCol: {
    width: '50%',
    borderRight: '1px solid black',
    padding: 10,
    justifyContent: 'flex-start',
  },
  infoRightCol: {
    width: '50%',
    padding: 10,
    justifyContent: 'flex-start',
  },
  addressBlock: {
    fontSize: 8,
    marginBottom: 4,
  },
  contactLines: {
    fontSize: 8,
    marginTop: 2,
  },
  gstinText: {
    fontSize: 8,
    marginTop: 2,
  },
  // Invoice Details (right column)
  detailRow: {
    flexDirection: 'row',
    marginBottom: 4,
    fontSize: 8,
  },
  detailLabel: {
    fontWeight: 'bold',
    width: '45%',
  },
  detailValue: {
    width: '55%',
  },
  // Bill To / Ship To
  billShipTo: {
    flexDirection: 'row',
    borderBottom: '1px solid black',
  },
  billTo: {
    width: '50%',
    borderRight: '1px solid black',
    padding: 12,
  },
  shipTo: {
    width: '50%',
    padding: 12,
  },
  billShipTitle: {
    fontWeight: 'bold',
    fontSize: 10,
    marginBottom: 8,
  },
  billShipText: {
    fontSize: 8,
  },
  billShipName: {
    fontWeight: 'bold',
  },
  // Items Table
  tableContainer: {
    borderBottom: '1px solid black',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    borderBottom: '1px solid black',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottom: '1px solid #D1D5DB',
  },
  tableCell: {
    padding: 8,
    borderRight: '1px solid black',
    textAlign: 'left',
  },
  cellCenter: {
    textAlign: 'center',
  },
  cellRight: {
    textAlign: 'right',
  },
  cellSlNo: { width: '8%' },
  cellDesc: { width: '25%' },
  cellHsn: { width: '15%' },
  cellQty: { width: '10%' },
  cellRate: { width: '14%' },
  cellTaxable: { width: '14%' },
  cellTotal: { width: '14%', borderRight: 'none' },
  emptyRow: { height: 24 },
  // Table footer
  tableFooter: {
    flexDirection: 'row',
    backgroundColor: '#F9FAFB',
    borderTop: '2px solid black',
    fontWeight: 'bold',
  },
  footerTotalLabel: {
    flexGrow: 1,
    textAlign: 'center',
    padding: 8,
    borderRight: '1px solid black',
  },
  footerTotalValue: {
    width: '14%',
    textAlign: 'right',
    padding: 8,
    borderRight: '1px solid black',
  },
  footerTotalFinal: {
    width: '14%',
    textAlign: 'right',
    padding: 8,
  },
  // Total Section
  totalSection: {
    flexDirection: 'row',
    borderBottom: '1px solid black',
  },
  wordsSection: {
    width: '50%',
    borderRight: '1px solid black',
    padding: 12,
  },
  taxSection: {
    width: '50%',
    padding: 12,
  },
  totalTitle: {
    fontWeight: 'bold',
    fontSize: 10,
    marginBottom: 8,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 2,
    fontSize: 8,
  },
  totalRowBold: {
    fontWeight: 'bold',
    marginTop: 4,
    paddingTop: 4,
    borderTop: '1px solid black',
  },
  roundedTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    fontWeight: 'bold',
    fontSize: 12,
    marginTop: 4,
  },
  // Bank Details / Signature
  bankSignature: {
    flexDirection: 'row',
    borderBottom: '1px solid black',
  },
  bankDetails: {
    width: '50%',
    borderRight: '1px solid black',
    padding: 12,
  },
  signature: {
    width: '50%',
    padding: 12,
    textAlign: 'right',
  },
  signatureLine: {
    borderBottom: '1px solid black',
    width: 100,
    marginLeft: 'auto',
    marginTop: 40,
  },
  // Footer
  footer: {
    padding: 12,
    fontSize: 8,
  },
  termsText: {
    fontSize: 8,
    whiteSpace: 'pre-line',
  },
});

type Props = {
  data: Invoice;
};

export const InvoicePDF2 = ({ data }: Props) => {
  const {
    invoiceType = 'TAX',
    taxType = 'CGST_SGST',
    items = [],
    client,
    user,
    invoiceNumber = 'INV-001',
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
    shippingName = 'shipping name',
    shippingAddress = 'shipping address',
    shippingCity = 'shipping city',
    shippingState = 'shipping state',
    shippingPincode = 'shipping pincode',
  } = data || {};

  const defaultUser = {
    company: 'Your Company Name',
    address: 'Company Address Line 1',
    city: 'City',
    state: 'State',
    pincode: '123456',
    gstin: 'GSTIN123456789',
    phone: '1234567890',
    mobile: '9876543210',
    logoUrl: '',
    bankDetail: {
      bankName: 'Bank Name',
      branch: 'Branch Name',
      accountNo: '1234567890',
      ifscCode: 'IFSC0001234',
    },
    settings: {
      terms:
        '1. Payment terms: 30 days\n2. Interest @24% p.a. will be charged on delayed payments\n3. Subject to jurisdiction',
    },
  };

  const defaultClient = {
    name: 'Client Name',
    address: 'Client Address',
    city: 'City',
    state: 'State',
    pincode: '123456',
    gstin: 'CLIENT123456789',
  };

  const invoiceUser = { ...defaultUser, ...user };
  const invoiceClient = { ...defaultClient, ...client };

  const toWords = new ToWords();

  const itemsWithTotals = items.map((item) => {
    const itemTotal = item.quantity * item.rate;
    const itemGst =
      taxType === 'CGST_SGST'
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
        <View style={styles.invoiceContainer}>
          {/* Header */}
          <View style={styles.header}>
            {/* Logo */}
            <View style={styles.logoContainer}>
              {invoiceUser.logoUrl ? (
                <Image src={invoiceUser.logoUrl} style={styles.logo} />
              ) : (
                <Text style={styles.logoPlaceholder}>
                  {invoiceUser.company.charAt(0)}
                </Text>
              )}
            </View>
            {/* Company Name - Centered */}
            <View style={styles.companyBlock}>
              <Text style={styles.companyText}>{invoiceUser.company}</Text>
            </View>
          </View>

          {/* Invoice Type Bar */}
          <View style={styles.invoiceTypeBarWrapper}>
            <View style={styles.invoiceTypeBar}>
              <Text style={styles.invoiceTypeText}>
                {invoiceType === 'TAX' ? 'TAX INVOICE' : 'PROFORMA INVOICE'}
              </Text>
            </View>
          </View>

          {/* Info Row: Address (left), Details (right) */}
          <View style={styles.infoRow}>
            {/* Left: Address and Contacts */}
            <View style={styles.infoLeftCol}>
              <View style={styles.addressBlock}>
                <Text>{invoiceUser.address}</Text>
                <Text>{invoiceUser.city}</Text>
                <Text>{invoiceUser.state}</Text>
                <Text>{invoiceUser.pincode}</Text>
              </View>
              <Text style={styles.contactLines}>Tel: {invoiceUser.phone}</Text>
              <Text style={styles.contactLines}>Mob: {invoiceUser.mobile}</Text>
              <Text style={styles.gstinText}>GSTIN: {invoiceUser.gstin}</Text>
            </View>
            {/* Right: Invoice Details + PO/Vehicle/etc. */}
            <View style={styles.infoRightCol}>
              <View style={{ gap: 1 }}>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Invoice No:</Text>
                  <Text style={styles.detailValue}>{invoiceNumber}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Invoice Date:</Text>
                  <Text style={styles.detailValue}>
                    {new Date(invoiceDate).toLocaleDateString('en-IN')}
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>PO NO:</Text>
                  <Text style={styles.detailValue}>{poNumber || '-'}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Vehicle Number:</Text>
                  <Text style={styles.detailValue}>{vehicleNumber || '-'}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Transporter:</Text>
                  <Text style={styles.detailValue}>{transporter || '-'}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>No. of Bundles:</Text>
                  <Text style={styles.detailValue}>{bundleCount}</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Bill To and Ship To */}
          <View style={styles.billShipTo}>
            {/* Bill To */}
            <View style={styles.billTo}>
              <Text style={styles.billShipTitle}>Bill To:</Text>
              <View style={{ gap: 4 }}>
                <Text style={[styles.billShipText, styles.billShipName]}>
                  {invoiceClient.name}
                </Text>
                <Text style={styles.billShipText}>{invoiceClient.address}</Text>
                <Text style={styles.billShipText}>
                  {invoiceClient.city}, {invoiceClient.state} -{' '}
                  {invoiceClient.pincode}
                </Text>
                <Text style={styles.billShipText}>
                  <Text style={styles.billShipName}>GSTIN:</Text>{' '}
                  {invoiceClient.gstin || '-'}
                </Text>
              </View>
            </View>

            {/* Ship To */}
            <View style={styles.shipTo}>
              <Text style={styles.billShipTitle}>Ship To:</Text>
              <View style={{ gap: 4 }}>
                <Text style={[styles.billShipText, styles.billShipName]}>
                  {shippingName || invoiceClient.name}
                </Text>
                <Text style={styles.billShipText}>
                  {shippingAddress || invoiceClient.address}
                </Text>
                <Text style={styles.billShipText}>
                  {shippingCity || invoiceClient.city},{' '}
                  {shippingState || invoiceClient.state} -{' '}
                  {shippingPincode || invoiceClient.pincode}
                </Text>
              </View>
            </View>
          </View>

          {/* Items Table */}
          <View style={styles.tableContainer}>
            <View style={styles.tableHeader}>
              <Text
                style={[styles.tableCell, styles.cellSlNo, styles.cellCenter]}
              >
                Sl. No.
              </Text>
              <Text style={[styles.tableCell, styles.cellDesc]}>
                Item Description
              </Text>
              <Text
                style={[styles.tableCell, styles.cellHsn, styles.cellCenter]}
              >
                HSN Code
              </Text>
              <Text
                style={[styles.tableCell, styles.cellQty, styles.cellCenter]}
              >
                Qty
              </Text>
              <Text
                style={[styles.tableCell, styles.cellRate, styles.cellCenter]}
              >
                Rate
              </Text>
              <Text
                style={[
                  styles.tableCell,
                  styles.cellTaxable,
                  styles.cellCenter,
                ]}
              >
                Taxable Value
              </Text>
              <Text
                style={[
                  styles.tableCell,
                  styles.cellTotal,
                  styles.cellCenter,
                  { borderRight: 'none' },
                ]}
              >
                Total
              </Text>
            </View>

            {itemsWithTotals.map((item, index) => (
              <View key={index} style={styles.tableRow}>
                <Text
                  style={[styles.tableCell, styles.cellSlNo, styles.cellCenter]}
                >
                  {index + 1}
                </Text>
                <Text style={[styles.tableCell, styles.cellDesc]}>
                  {item.description}
                </Text>
                <Text
                  style={[styles.tableCell, styles.cellHsn, styles.cellCenter]}
                >
                  {item.hsnCode}
                </Text>
                <Text
                  style={[styles.tableCell, styles.cellQty, styles.cellCenter]}
                >
                  {item.quantity}
                </Text>
                <Text
                  style={[styles.tableCell, styles.cellRate, styles.cellRight]}
                >
                  {item.rate.toFixed(2)}
                </Text>
                <Text
                  style={[
                    styles.tableCell,
                    styles.cellTaxable,
                    styles.cellRight,
                  ]}
                >
                  {item.itemTotal.toFixed(2)}
                </Text>
                <Text
                  style={[
                    styles.tableCell,
                    styles.cellTotal,
                    styles.cellRight,
                    { borderRight: 'none' },
                  ]}
                >
                  {item.finalAmount.toFixed(2)}
                </Text>
              </View>
            ))}

            {[...Array(Math.max(0, 5 - items.length))].map((_, index) => (
              <View
                key={`empty-${index}`}
                style={[styles.tableRow, styles.emptyRow]}
              >
                <Text style={[styles.tableCell, styles.cellSlNo]}></Text>
                <Text style={[styles.tableCell, styles.cellDesc]}></Text>
                <Text style={[styles.tableCell, styles.cellHsn]}></Text>
                <Text style={[styles.tableCell, styles.cellQty]}></Text>
                <Text style={[styles.tableCell, styles.cellRate]}></Text>
                <Text style={[styles.tableCell, styles.cellTaxable]}></Text>
                <Text
                  style={[
                    styles.tableCell,
                    styles.cellTotal,
                    { borderRight: 'none' },
                  ]}
                ></Text>
              </View>
            ))}

            <View style={styles.tableFooter}>
              <Text
                style={[
                  styles.footerTotalLabel,
                  { width: '48%', borderRight: '1px solid black' },
                  styles.cellCenter,
                ]}
              >
                Total
              </Text>
              <Text
                style={[
                  styles.footerTotalValue,
                  { width: '14%' },
                  styles.cellRight,
                ]}
              >
                {subtotal.toFixed(2)}
              </Text>
              <Text
                style={[
                  styles.footerTotalFinal,
                  { width: '14%' },
                  styles.cellRight,
                ]}
              >
                {total.toFixed(2)}
              </Text>
            </View>
          </View>

          {/* Total Section */}
          <View style={styles.totalSection}>
            <View style={styles.wordsSection}>
              <Text style={styles.totalTitle}>Total in words</Text>
              <Text style={styles.termsText}>
                {toWords.convert(roundedTotal)} rupees only
              </Text>
            </View>
            <View style={styles.taxSection}>
              <View style={styles.totalRow}>
                <Text>Taxable Amount</Text>
                <Text>{subtotal.toFixed(2)}</Text>
              </View>
              {taxType === 'CGST_SGST' ? (
                <>
                  <View style={styles.totalRow}>
                    <Text>CGST @ {(taxRate / 2).toFixed(1)}%</Text>
                    <Text>{cgst.toFixed(2)}</Text>
                  </View>
                  <View style={styles.totalRow}>
                    <Text>SGST @ {(taxRate / 2).toFixed(1)}%</Text>
                    <Text>{sgst.toFixed(2)}</Text>
                  </View>
                </>
              ) : (
                <View style={styles.totalRow}>
                  <Text>IGST @ {taxRate.toFixed(1)}%</Text>
                  <Text>{igst.toFixed(2)}</Text>
                </View>
              )}
              <View style={[styles.totalRow, styles.totalRowBold]}>
                <Text>Total Amount</Text>
                <Text>{total.toFixed(2)}</Text>
              </View>
              <View style={styles.roundedTotalRow}>
                <Text>Rounded Total</Text>
                <Text>{roundedTotal.toFixed(2)}</Text>
              </View>
              <View style={[styles.totalRow, { fontSize: 8 }]}></View>
            </View>
          </View>

          {/* Bank Details */}
          <View style={styles.bankSignature}>
            <View style={styles.bankDetails}>
              <Text style={styles.totalTitle}>Bank Details</Text>
              <View style={{ gap: 1, fontSize: 8 }}>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Bank Name:</Text>
                  <Text style={styles.detailValue}>
                    {invoiceUser.bankDetail.bankName}
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Branch Name:</Text>
                  <Text style={styles.detailValue}>
                    {invoiceUser.bankDetail.branch}
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Bank Account Number:</Text>
                  <Text style={styles.detailValue}>
                    {invoiceUser.bankDetail.accountNo}
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Bank Branch IFSC:</Text>
                  <Text style={styles.detailValue}>
                    {invoiceUser.bankDetail.ifscCode}
                  </Text>
                </View>
              </View>
            </View>
            <View style={styles.signature}>
              <Text style={{ fontSize: 8 }}>For {invoiceUser.company}</Text>
              <View style={styles.signatureLine}></View>
              <Text style={{ marginTop: 8 }}>Authorised Signatory</Text>
            </View>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.totalTitle}>Terms and Conditions</Text>
            <Text style={styles.termsText}>{invoiceUser.settings?.terms}</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default InvoicePDF2;
