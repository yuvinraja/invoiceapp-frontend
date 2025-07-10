import InvoiceViewerPage from "@/components/invoice-viewer";

interface PageProps {
  params: {
    id: string;
  };
}

export default function Page({ params }: PageProps) {
  return <InvoiceViewerPage invoiceId={params.id} />;
}
