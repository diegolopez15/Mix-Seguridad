import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/utils/auth';
import prisma from '@/lib/prisma';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ success: false, message: 'No autorizado' }, { status: 401 });
    }

    const body = await request.json();
    const { status } = body;

    const contract = await prisma.contract.update({
      where: { id: params.id },
      data: { status },
    });

    return NextResponse.json({ success: true, contract });
  } catch (error) {
    console.error('Error updating contract:', error);
    return NextResponse.json({ success: false, message: 'Error interno' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ success: false, message: 'No autorizado' }, { status: 401 });
    }

    await prisma.contract.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true, message: 'Contrato eliminado' });
  } catch (error) {
    console.error('Error deleting contract:', error);
    return NextResponse.json({ success: false, message: 'Error interno' }, { status: 500 });
  }
}