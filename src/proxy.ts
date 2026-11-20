import { NextResponse } from 'next/server';

// Аналог middleware в Next.js 15 и ниже.
// Сейчас сквозная логика не нужна — пропускаем все запросы как есть
export function proxy() {
	return NextResponse.next();
}
