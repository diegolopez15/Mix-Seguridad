'use client';

import { generateQuotationPDF } from '@/lib/utils/pdf';

export default function QuotationActions({ quotation }: { quotation: any }) {
  return (
    <div className="space-x-2">
      <button
        onClick={() => generateQuotationPDF(quotation)}
        className="text-blue-600 hover:text-blue-800 font-medium"
      >
        📄 PDF
      </button>
      <a
        href={`/admin/quotations/${quotation.id}`}
        className="text-blue-600 hover:text-blue-800"
      >
        Ver detalles
      </a>
    </div>
  );
}