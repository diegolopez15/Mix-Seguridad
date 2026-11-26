import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { invoiceId, amount, paymentMethod, reference } = body;

    if (!invoiceId || !amount || !paymentMethod) {
      return NextResponse.json(
        { success: false, message: 'Todos los campos obligatorios deben estar completos' },
        { status: 400 }
      );
    }

    const payment = await prisma.payment.create({
      data: {
        invoiceId,
        amount: parseFloat(amount),
        paymentMethod,
        reference,
      },
    });

    // Actualizar estado de la factura a PAGADA
    await prisma.invoice.update({
      where: { id: invoiceId },
      data: {
        status: 'PAID',
        paidDate: new Date(),
      },
    });

    return NextResponse.json({ success: true, payment }, { status: 201 });
  } catch (error) {
    console.error('Error creating payment:', error);
    return NextResponse.json({ success: false, message: 'Error interno' }, { status: 500 });
  }
}