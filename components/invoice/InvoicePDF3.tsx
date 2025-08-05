import React from 'react';
import Image from 'next/image';

import type { Invoice } from '@/lib/types/user';
import { ToWords } from 'to-words';

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

  // Default values for missing data
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

  // Calculate individual item totals
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
    <div className="max-w-4xl mx-auto bg-white shadow-lg">
      {/* Header */}
      <div className="border-2 border-black">
        {/* Company Header */}
        <div className="bg-blue-600 text-white px-4 py-2 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-white rounded flex items-center justify-center">
              {invoiceUser.logoUrl ? (
                <Image
                  src={invoiceUser.logoUrl}
                  alt="Company Logo"
                  width={48}
                  height={48}
                  className="object-contain"
                />
              ) : (
                <div className="w-8 h-8 bg-blue-600 rounded text-white flex items-center justify-center text-xs font-bold">
                  {invoiceUser.company.charAt(0)}
                </div>
              )}
            </div>
            <div>
              <h1 className="text-xl font-bold">{invoiceUser.company}</h1>
              <p className="text-sm">{invoiceUser.gstin}</p>
            </div>
          </div>
          <div className="text-right text-sm">
            <p>Tel: {invoiceUser.phone}</p>
            <p>Mob: {invoiceUser.mobile}</p>
          </div>
        </div>

        {/* Address and Invoice Type */}
        <div className="px-4 py-2 bg-gray-50 border-b border-black flex justify-between items-center">
          <div className="text-sm">
            <p>{invoiceUser.address}</p>
            <p>
              {invoiceUser.city}, {invoiceUser.state} - {invoiceUser.pincode}
            </p>
          </div>
          <div className="text-center">
            <h2 className="text-lg font-bold">
              {invoiceType === 'TAX' ? 'TAX INVOICE' : 'PROFORMA INVOICE'}
            </h2>
            <p className="text-xs">Original/Duplicate/Triplicate</p>
          </div>
        </div>

        {/* Invoice Details Section */}
        <div className="grid grid-cols-2 border-b border-black">
          {/* Left Column - Transport Details */}
          <div className="border-r border-black p-3">
            <div className="space-y-1 text-sm">
              {invoiceType === 'TAX' && (
                <div className="space-y-1">
                  <p>
                    <span className="font-semibold">PO NO:</span>{' '}
                    {poNumber || '-'}
                  </p>
                  <p>
                    <span className="font-semibold">Vehicle Number:</span>{' '}
                    {vehicleNumber || '-'}
                  </p>
                  <p>
                    <span className="font-semibold">Transporter:</span>{' '}
                    {transporter || '-'}
                  </p>
                  <p>
                    <span className="font-semibold">No. of Bundles:</span>{' '}
                    {bundleCount}
                  </p>
                </div>
              )}
            </div>
          </div>
          {/* Right Column - Invoice Details */}
          <div className="p-3 space-y-1 text-sm">
            <div className="grid grid-cols-2 gap-2">
              <span className="font-semibold">Invoice No:</span>
              <span>{invoiceNumber}</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <span className="font-semibold">Invoice Date:</span>
              <span>{new Date(invoiceDate).toLocaleDateString('en-IN')}</span>
            </div>
          </div>
        </div>

        {/* Bill To and Ship To */}
        <div className="grid grid-cols-2 border-b border-black">
          {/* Bill To */}
          <div className="border-r border-black p-3">
            <h3 className="font-semibold text-sm mb-2">Bill To:</h3>
            <div className="text-sm space-y-1">
              <p className="font-semibold">{invoiceClient.name}</p>
              <p>{invoiceClient.address}</p>
              <p>
                {invoiceClient.city}, {invoiceClient.state} -{' '}
                {invoiceClient.pincode}
              </p>
              <p>
                <span className="font-semibold">GSTIN:</span>{' '}
                {invoiceClient.gstin || '-'}
              </p>
            </div>
          </div>

          {/* Ship To */}
          <div className="p-3">
            <h3 className="font-semibold text-sm mb-2">Ship To:</h3>
            <div className="text-sm space-y-1">
              <p className="font-semibold">
                {shippingName || invoiceClient.name}
              </p>
              <p>{shippingAddress || invoiceClient.address}</p>
              <p>
                {shippingCity || invoiceClient.city},{' '}
                {shippingState || invoiceClient.state} -{' '}
                {shippingPincode || invoiceClient.pincode}
              </p>
            </div>
          </div>
        </div>

        {/* Items Table */}
        <div className="border-b border-black">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-gray-100 border-b border-black">
                <th className="border-r border-black p-2 text-center w-12">
                  Sl. No.
                </th>
                <th className="border-r border-black p-2 text-left">
                  Item Description
                </th>
                <th className="border-r border-black p-2 text-center w-16">
                  HSN Code
                </th>
                <th className="border-r border-black p-2 text-center w-16">
                  Qty
                </th>
                <th className="border-r border-black p-2 text-center w-20">
                  Rate
                </th>
                <th className="border-r border-black p-2 text-center w-24">
                  Taxable Value
                </th>
                <th className="p-2 text-center w-20">Total</th>
              </tr>
            </thead>
            <tbody>
              {itemsWithTotals.map((item, index) => (
                <tr key={index} className="border-b border-gray-300">
                  <td className="border-r border-black p-2 text-center">
                    {index + 1}
                  </td>
                  <td className="border-r border-black p-2">
                    {item.description}
                  </td>
                  <td className="border-r border-black p-2 text-center">
                    {item.hsnCode}
                  </td>
                  <td className="border-r border-black p-2 text-center">
                    {item.quantity}
                  </td>
                  <td className="border-r border-black p-2 text-right">
                    {item.rate.toFixed(2)}
                  </td>
                  <td className="border-r border-black p-2 text-right">
                    {item.itemTotal.toFixed(2)}
                  </td>
                  <td className="p-2 text-right">
                    {item.finalAmount.toFixed(2)}
                  </td>
                </tr>
              ))}
              {/* Empty rows for spacing */}
              {[...Array(Math.max(0, 8 - items.length))].map((_, index) => (
                <tr
                  key={`empty-${index}`}
                  className="border-b border-gray-300 h-8"
                >
                  <td className="border-r border-black p-2"></td>
                  <td className="border-r border-black p-2"></td>
                  <td className="border-r border-black p-2"></td>
                  <td className="border-r border-black p-2"></td>
                  <td className="border-r border-black p-2"></td>
                  <td className="border-r border-black p-2"></td>
                  <td className="p-2"></td>
                </tr>
              ))}
              <tr className="bg-gray-50 font-semibold border-t-2 border-black">
                <td
                  className="border-r border-black p-2 text-center"
                  colSpan={5}
                >
                  Total
                </td>
                <td className="border-r border-black p-2 text-right">
                  {subtotal.toFixed(2)}
                </td>
                <td className="p-2 text-right">{total.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Total Section */}
        <div className="grid grid-cols-2 border-b border-black">
          {/* Left - Total in Words */}
          <div className="border-r border-black p-3">
            <h4 className="font-semibold text-sm mb-2">Total in words</h4>
            <p className="text-sm">
              {toWords.convert(roundedTotal)} rupees only
            </p>
          </div>

          {/* Right - Tax Breakdown */}
          <div className="p-3">
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span>Taxable Amount</span>
                <span>{subtotal.toFixed(2)}</span>
              </div>
              {taxType === 'CGST_SGST' ? (
                <>
                  <div className="flex justify-between">
                    <span>CGST @ {(taxRate / 2).toFixed(1)}%</span>
                    <span>{cgst.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>SGST @ {(taxRate / 2).toFixed(1)}%</span>
                    <span>{sgst.toFixed(2)}</span>
                  </div>
                </>
              ) : (
                <div className="flex justify-between">
                  <span>IGST @ {taxRate.toFixed(1)}%</span>
                  <span>{igst.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between border-t border-black pt-1 font-semibold">
                <span>Total Amount</span>
                <span>{total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-base">
                <span>Rounded Total</span>
                <span>{roundedTotal}</span>
              </div>
              <div className="text-xs">
                <span>(₹ {(total - roundedTotal).toFixed(2)})</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bank Details */}
        <div className="grid grid-cols-2 border-b border-black">
          <div className="border-r border-black p-3">
            <h4 className="font-semibold text-sm mb-2">Bank Details</h4>
            <div className="text-sm space-y-1">
              <div className="grid grid-cols-2 gap-2">
                <span className="font-semibold">Bank Name:</span>
                <span>{invoiceUser.bankDetail.bankName}</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <span className="font-semibold">Branch Name:</span>
                <span>{invoiceUser.bankDetail.branch}</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <span className="font-semibold">Bank Account Number:</span>
                <span>{invoiceUser.bankDetail.accountNo}</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <span className="font-semibold">Bank Branch IFSC:</span>
                <span>{invoiceUser.bankDetail.ifscCode}</span>
              </div>
            </div>
          </div>
          <div className="p-3 text-right">
            <div className="text-sm">
              <p>For {invoiceUser.company}</p>
              <div className="mt-12 border-b border-black w-32 ml-auto"></div>
              <p className="mt-2">Authorised Signatory</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 text-xs border-b border-black">
          <h4 className="font-semibold mb-2">Terms and Conditions</h4>
          <div className="text-xs whitespace-pre-line">
            {invoiceUser.settings?.terms}
          </div>
        </div>
      </div>
    </div>
  );
};
