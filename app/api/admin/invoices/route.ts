import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const invoices = await prisma.invoice.findMany({
      include: {
        contract: {
          include: {
            company: {
              select: { name: true, nit: true },
            },
          },
        },
        payments: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ success: true, invoices });
  } catch (error) {
    console.error('Error getting invoices:', error);
    return NextResponse.json({ success: false, message: 'Error interno' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { contractId, dueDate, value } = body;

    if (!contractId || !dueDate || !value) {
      return NextResponse.json(
        { success: false, message: 'Todos los campos obligatorios deben estar completos' },
        { status: 400 }
      );
    }

    // Generar número de factura automático
    const invoiceCount = await prisma.invoice.count();
    const invoiceNumber = `FAC-${new Date().getFullYear()}-${String(invoiceCount + 1).padStart(4, '0')}`;

    const invoice = await prisma.invoice.create({
      data: {
        invoiceNumber,
        contractId,
        dueDate: new Date(dueDate),
        value: parseFloat(value),
        status: 'PENDING',
      },
      include: {
        contract: {
          include: {
            company: {
              select: { name: true, nit: true },
            },
          },
        },
      },
    });

    return NextResponse.json({ success: true, invoice }, { status: 201 });
  } catch (error) {
    console.error('Error creating invoice:', error);
    return NextResponse.json({ success: false, message: 'Error interno' }, { status: 500 });
  }
}