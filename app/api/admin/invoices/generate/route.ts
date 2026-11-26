import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST() {
  try {
    // Obtener todos los contratos activos
    const activeContracts = await prisma.contract.findMany({
      where: { status: 'ACTIVE' },
    });

    const generatedInvoices = [];

    for (const contract of activeContracts) {
      // Verificar si ya existe factura para este mes
      const now = new Date();
      const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

      const existingInvoice = await prisma.invoice.findFirst({
        where: {
          contractId: contract.id,
          issueDate: {
            gte: firstDayOfMonth,
            lte: lastDayOfMonth,
          },
        },
      });

      if (!existingInvoice) {
        // Generar número de factura
        const invoiceCount = await prisma.invoice.count();
        const invoiceNumber = `FAC-${now.getFullYear()}-${String(invoiceCount + 1).padStart(4, '0')}`;

        // Fecha de vencimiento: 30 días desde hoy
        const dueDate = new Date();
        dueDate.setDate(dueDate.getDate() + 30);

        const invoice = await prisma.invoice.create({
          data: {
            invoiceNumber,
            contractId: contract.id,
            dueDate,
            value: contract.monthlyValue,
            status: 'PENDING',
          },
        });

        generatedInvoices.push(invoice);
      }
    }

    return NextResponse.json({
      success: true,
      message: `${generatedInvoices.length} facturas generadas`,
      invoices: generatedInvoices,
    });
  } catch (error) {
    console.error('Error generating invoices:', error);
    return NextResponse.json({ success: false, message: 'Error interno' }, { status: 500 });
  }
}