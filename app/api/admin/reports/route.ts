import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const reports = await prisma.report.findMany({
      include: {
        contract: {
          include: {
            company: {
              select: { name: true },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ success: true, reports });
  } catch (error) {
    console.error('Error getting reports:', error);
    return NextResponse.json({ success: false, message: 'Error interno' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { contractId, reportType, title, description, location, status } = body;

    if (!contractId || !reportType || !title || !description || !location) {
      return NextResponse.json(
        { success: false, message: 'Todos los campos obligatorios deben estar completos' },
        { status: 400 }
      );
    }

    const report = await prisma.report.create({
      data: {
        contractId,
        reportType,
        title,
        description,
        location,
        status: status || 'DRAFT',
      },
      include: {
        contract: {
          include: {
            company: {
              select: { name: true },
            },
          },
        },
      },
    });

    return NextResponse.json({ success: true, report }, { status: 201 });
  } catch (error) {
    console.error('Error creating report:', error);
    return NextResponse.json({ success: false, message: 'Error interno' }, { status: 500 });
  }
}