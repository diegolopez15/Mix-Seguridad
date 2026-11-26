import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { status } = body;

    const report = await prisma.report.update({
      where: { id: params.id },
      data: { status },
    });

    return NextResponse.json({ success: true, report });
  } catch (error) {
    console.error('Error updating report:', error);
    return NextResponse.json({ success: false, message: 'Error interno' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.report.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true, message: 'Reporte eliminado' });
  } catch (error) {
    console.error('Error deleting report:', error);
    return NextResponse.json({ success: false, message: 'Error interno' }, { status: 500 });
  }
}