import {and, eq} from "drizzle-orm";
import {BoardTable} from "../../lib/BoardTable";
import {db} from "../../lib/drizzle";
import {NextRequest, NextResponse} from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const {nextInterval, newEaseFactor, nextReviewDate, boardId, ownerId} = body;

  try {
    await db
      .update(BoardTable)
      .set({
        currentInterval: nextInterval,
        easeFactor: newEaseFactor,
        lastReviewDate: nextReviewDate,
      })
      .where(and(eq(BoardTable.id, boardId), eq(BoardTable.ownerId, ownerId)));

    return NextResponse.json({status: 200});
  } catch (error) {
    return NextResponse.json({status: 500});
  }
}
