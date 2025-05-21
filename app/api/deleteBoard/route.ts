import {NextResponse} from "next/server";
import {db} from "../../lib/drizzle";
import {BoardTable} from "../../lib/BoardTable";
import {and, eq} from "drizzle-orm";

export async function POST(req: Request) {
  const body = await req.json();
  const {ownerId, boardId} = body;

  try {
    await db
      .delete(BoardTable)
      .where(and(eq(BoardTable.ownerId, ownerId), eq(BoardTable.id, boardId)));

    return NextResponse.json({status: 200});
  } catch (error) {
    console.error(error);
    return NextResponse.json({error: "Failed to insert board"}, {status: 500});
  }
}
