import { NextResponse } from 'next/server';
import { db } from '../../lib/drizzle';
import { BoardTable } from '../../lib/BoardTable';
import { and, eq } from 'drizzle-orm';

export async function GET(req: Request) {
  const {searchParams} = new URL(req.url)

  const ownerId = searchParams.get("ownerId")
  const boardId = Number(searchParams.get("boardId"))

  if(!ownerId) return;
  if(isNaN(boardId)) return;

  try {
    const result = await db.query.BoardTable.findFirst({
        where: and(
            eq(BoardTable.ownerId, ownerId),
            eq(BoardTable.id, boardId)
        )
    })

    return NextResponse.json({ result }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to insert board' }, { status: 500 });
  }
}
