import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  return NextResponse.json({
    object: 'list',
    data: [
      {
        id: 'titan-pro',
        object: 'model',
        created: 1770000000,
        owned_by: 'zerolabs',
      },
      {
        id: 'titan-ultra',
        object: 'model',
        created: 1770000000,
        owned_by: 'zerolabs',
      },
    ],
  });
}
