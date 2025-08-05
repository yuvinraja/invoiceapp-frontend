import InvoiceViewerPage from '@/components/invoice-viewer';

type PageProps = {
  params: {
    id: string;
  };
};

export default function Page({ params }: PageProps) {
  const { id } = params;
  return <InvoiceViewerPage invoiceId={id} />;
}
