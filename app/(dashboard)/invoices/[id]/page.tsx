import InvoiceViewerPage from "@/components/invoice-viewer";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function Page({ params }: PageProps) {
  const { id } = await params;
  return <InvoiceViewerPage invoiceId={id} />;
}
