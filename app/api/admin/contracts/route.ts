import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const contracts = await prisma.contract.findMany({
      include: {
        company: {
          select: { name: true, nit: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ success: true, contracts });
  } catch (error) {
    console.error('Error getting contracts:', error);
    return NextResponse.json({ success: false, message: 'Error interno' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { companyId, startDate, endDate, monthlyValue, serviceDescription, contractNumber } = body;

    if (!companyId || !startDate || !monthlyValue || !serviceDescription || !contractNumber) {
      return NextResponse.json(
        { success: false, message: 'Todos los campos obligatorios deben estar completos' },
        { status: 400 }
      );
    }

    const contract = await prisma.contract.create({
      data: {
        contractNumber,
        companyId,
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
        monthlyValue: parseFloat(monthlyValue),
        serviceDescription,
        status: 'ACTIVE',
      },
      include: {
        company: {
          select: { name: true },
        },
      },
    });

    return NextResponse.json({ success: true, contract }, { status: 201 });
  } catch (error) {
    console.error('Error creating contract:', error);
    return NextResponse.json({ success: false, message: 'Error interno' }, { status: 500 });
  }
}