# InvoiceGST - Professional GST Invoice Management Platform

[![Next.js](https://img.shields.io/badge/Next.js-15.3.5-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19.0.0-61DAFB?style=flat-square&logo=react)](https://reactjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.x-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

> A comprehensive, enterprise-grade GST invoice management platform built with modern web technologies, designed to streamline business operations and ensure complete GST compliance.

## 🚀 Project Overview

InvoiceGST is a full-featured invoice management system specifically designed for Indian businesses requiring GST compliance. The platform enables users to create, manage, track, and analyze professional invoices while maintaining full adherence to GST regulations. Built with scalability and user experience in mind, it demonstrates advanced React patterns, modern TypeScript practices, and enterprise-level architecture.

### 🎯 Key Problem Solved
Traditional invoicing solutions often lack proper GST compliance features or are overly complex for small to medium businesses. This platform bridges that gap by providing a user-friendly interface with robust GST calculation features, PDF generation, and comprehensive business analytics.

## ✨ Core Features

### 📄 GST-Compliant Invoice Generation
- **Dual Invoice Types**: TAX invoices and PROFORMA invoices with distinct formatting
- **Flexible Tax Calculation**: Support for both CGST+SGST and IGST tax structures
- **Dynamic Tax Rates**: Configurable tax percentages with real-time calculations
- **HSN Code Integration**: Proper HSN/SAC code management for goods classification

### 📊 Advanced Analytics Dashboard
- **Revenue Tracking**: Real-time revenue analytics with visual charts using Recharts
- **Invoice Insights**: Comprehensive breakdown by invoice types and tax categories
- **Client Analytics**: Top clients identification and performance metrics
- **Business Intelligence**: Trend analysis and growth indicators

### 🎨 Modern User Interface
- **Responsive Design**: Mobile-first approach using Tailwind CSS
- **Dark/Light Theme**: System-aware theme switching with next-themes
- **Component Library**: Custom UI components built on Radix UI primitives
- **Accessibility**: WCAG-compliant interface design

### 🔐 Authentication & Security
- **JWT-based Authentication**: Secure user sessions with context management
- **Protected Routes**: Route-level security with custom guards
- **Form Validation**: Comprehensive validation using Zod schemas
- **Type Safety**: End-to-end TypeScript for runtime safety

### 📋 Professional PDF Generation
- **React-PDF Integration**: High-quality PDF invoice generation
- **Professional Templates**: Business-ready invoice layouts
- **Dynamic Content**: Automatic calculation integration in PDFs
- **Multi-format Export**: Download and print capabilities

## 🛠️ Technology Stack

### Frontend Framework
- **Next.js 15.3.5** - React framework with App Router
- **React 19.0.0** - Latest React with concurrent features
- **TypeScript 5.x** - Strong typing and enhanced developer experience

### Styling & UI
- **Tailwind CSS 4.x** - Utility-first CSS framework
- **Radix UI** - Headless UI components for accessibility
- **Lucide React** - Modern icon library
- **CSS Variables** - Dynamic theming system

### State Management & Data
- **React Context** - Global state management for authentication
- **React Hook Form** - Performant form handling with validation
- **Zod** - Runtime type validation and schema definition
- **Axios** - HTTP client for API communications

### PDF & Documents
- **@react-pdf/renderer** - React-based PDF generation
- **date-fns** - Modern date utility library
- **to-words** - Number to words conversion for invoices

### Development Tools
- **ESLint** - Code linting with Next.js configuration
- **PostCSS** - CSS post-processing
- **Turbopack** - Ultra-fast bundler for development

## 📁 Project Architecture

```
├── app/                          # Next.js App Router
│   ├── (dashboard)/             # Protected dashboard routes
│   │   ├── dashboard/           # Analytics dashboard
│   │   ├── invoices/           # Invoice management
│   │   │   ├── create/         # Invoice creation form
│   │   │   └── [id]/           # Individual invoice view
│   │   ├── profile/            # User profile management
│   │   └── settings/           # Application settings
│   ├── login/                  # Authentication pages
│   ├── signup/                 
│   └── setup-profile/          
├── components/                  # Reusable UI components
│   ├── ui/                     # Base UI component library
│   ├── auth/                   # Authentication components
│   └── invoice/                # Invoice-specific components
├── context/                    # React Context providers
├── lib/                        # Utility libraries
│   ├── types/                  # TypeScript type definitions
│   └── validation/             # Zod validation schemas
└── hooks/                      # Custom React hooks
```

## 🚀 Installation & Setup

### Prerequisites
- Node.js 18+ 
- npm or yarn package manager
- Modern web browser

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/yuvinraja/invoiceapp-frontend.git
   cd invoiceapp-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Environment Configuration**
   ```bash
   # Create environment file
   cp .env.example .env.local
   
   # Configure your environment variables
   NEXT_PUBLIC_API_URL=your_backend_api_url
   ```

4. **Start development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open in browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
# Create optimized production build
npm run build

# Start production server
npm start
```

## 💻 Usage Examples

### Creating a GST Invoice
```typescript
// Example invoice creation with TypeScript
const invoiceData: InvoiceInput = {
  invoiceType: "TAX",
  taxType: "CGST_SGST",
  taxRate: 18,
  client: {
    name: "ABC Corporation",
    gstin: "22AAAAA0000A1Z5",
    address: "Business District",
    city: "Mumbai",
    state: "Maharashtra",
    pincode: "400001"
  },
  items: [
    {
      description: "Software Development Services",
      hsnCode: "998314",
      quantity: 1,
      rate: 50000
    }
  ]
};
```

### PDF Generation Integration
```typescript
// Generating professional PDFs with React-PDF
<PDFDownloadLink
  document={<InvoicePDF data={invoiceData} />}
  fileName={`invoice-${invoiceNumber}.pdf`}
>
  {({ loading }) => (
    <Button disabled={loading}>
      {loading ? 'Generating...' : 'Download PDF'}
    </Button>
  )}
</PDFDownloadLink>
```

## 🏗️ Key Technical Implementations

### Advanced Form Handling
- **React Hook Form** integration with Zod validation
- **Dynamic field arrays** for invoice items
- **Real-time calculations** with watch functionality
- **Conditional rendering** based on invoice type

### State Management Pattern
- **Context-based authentication** with JWT handling
- **Optimistic updates** for better user experience
- **Error boundary** implementation for graceful error handling

### Performance Optimizations
- **Code splitting** with Next.js dynamic imports
- **Image optimization** with Next.js Image component
- **Bundle analysis** and optimization strategies
- **Lazy loading** for non-critical components

### Type Safety Implementation
```typescript
// Comprehensive type definitions
interface Invoice {
  id: string;
  invoiceNumber: number;
  invoiceType: 'TAX' | 'PROFORMA';
  taxType: 'CGST_SGST' | 'IGST';
  items: InvoiceItem[];
  client: Client;
  calculations: TaxCalculations;
}
```

## 📈 Project Status

- ✅ **Core Features**: Complete invoice management system
- ✅ **GST Compliance**: Full tax calculation and formatting
- ✅ **PDF Generation**: Professional document export
- ✅ **Analytics Dashboard**: Business intelligence features
- ✅ **Responsive Design**: Mobile and desktop optimized
- 🔄 **In Progress**: Advanced reporting features
- 📋 **Planned**: Multi-company support and API integrations

## 🤝 Contributing

This project demonstrates enterprise-level development practices and welcomes contributions from developers interested in:

- **Frontend Architecture**: Advanced React patterns and Next.js features
- **TypeScript Best Practices**: Type-safe development methodologies
- **UI/UX Improvements**: Enhanced user experience and accessibility
- **Performance Optimization**: Bundle size and runtime optimizations
- **Testing Implementation**: Unit and integration testing strategies

### Development Guidelines
1. Follow existing code patterns and TypeScript conventions
2. Ensure all new features include proper type definitions
3. Maintain responsive design principles
4. Update documentation for new features
5. Follow semantic commit message conventions

## 📞 Contact & Portfolio

**Yuvin Raja**
- **GitHub**: [@yuvinraja](https://github.com/yuvinraja)
- **LinkedIn**: [Connect with me](https://linkedin.com/in/yuvinraja)
- **Portfolio**: [View my work](https://yuvinraja.vercel.app)
