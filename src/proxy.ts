import { NextResponse, type NextRequest } from 'next/server';

export async function proxy(_: NextRequest) {
	return NextResponse.next();
}
