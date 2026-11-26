import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const companies = await prisma.company.findMany({
      orderBy: { name: 'asc' },
    });

    return NextResponse.json({ success: true, companies });
  } catch (error) {
    console.error('Error getting companies:', error);
    return NextResponse.json({ success: false, message: 'Error interno' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, nit, contactPerson, phone, address, city, sector } = body;

    if (!name || !nit || !contactPerson || !phone || !address || !city || !sector) {
      return NextResponse.json(
        { success: false, message: 'Todos los campos son obligatorios' },
        { status: 400 }
      );
    }

    const company = await prisma.company.create({
      data: {
        name,
        nit,
        contactPerson,
        phone,
        address,
        city,
        sector,
      },
    });

    return NextResponse.json({ success: true, company }, { status: 201 });
  } catch (error) {
    console.error('Error creating company:', error);
    return NextResponse.json({ success: false, message: 'Error interno' }, { status: 500 });
  }
}