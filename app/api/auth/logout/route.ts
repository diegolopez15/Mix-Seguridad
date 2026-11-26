import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
  const cookieStore = await cookies();
  cookieStore.delete('token');
  
  return NextResponse.redirect(new URL('/login', 'http://localhost:3000'));
}