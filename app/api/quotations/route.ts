import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('Datos recibidos:', body);

    const quotation = await prisma.quotation.create({
      data: {
        prospectName: body.prospectName,
        prospectEmail: body.prospectEmail,
        prospectPhone: body.prospectPhone,
        prospectCompany: body.prospectCompany || null,
        serviceType: body.serviceType,
        propertyType: body.propertyType,
        propertySize: body.propertySize ? parseInt(body.propertySize) : null,
        location: body.location,
        requiredSchedule: body.requiredSchedule,
        estimatedGuards: body.estimatedGuards ? parseInt(body.estimatedGuards) : null,
        additionalNotes: body.additionalNotes || null,
        status: 'PENDING',
      },
    });

    console.log('Cotización creada:', quotation.id);

    return NextResponse.json(
      {
        success: true,
        message: 'Cotización recibida. Nos pondremos en contacto en menos de 24 horas.',
        quotationId: quotation.id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creando cotización:', error);
    return NextResponse.json(
      { success: false, message: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}