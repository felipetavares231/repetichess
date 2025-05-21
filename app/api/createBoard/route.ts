import {NextResponse} from "next/server";
import {db} from "../../lib/drizzle";
import {BoardTable} from "../../lib/BoardTable";
import {and, eq} from "drizzle-orm";

export async function POST(req: Request) {
  const body = await req.json();
  const {ownerId, board, name, orientation, boardId} = body;

  try {
    if (boardId) {
      console.log("has board id, ", boardId);
      const boardExists = await db.query.BoardTable.findFirst({
        where: and(eq(BoardTable.id, boardId), eq(BoardTable.ownerId, ownerId)),
      });
      if (boardExists) {
        console.log("executing boardtable");
        await db
          .update(BoardTable)
          .set({
            board: board,
            name: name,
            orientation: orientation,
            lastReviewDate: new Date().toISOString(),
          })
          .where(
            and(eq(BoardTable.id, boardId), eq(BoardTable.ownerId, ownerId)),
          );
      }
      return NextResponse.json({status: 200});
    } else {
      const result = await db
        .insert(BoardTable)
        .values({
          ownerId: ownerId,
          board: board,
          name: name,
          orientation: orientation,
          currentInterval: 1,
          easeFactor: 2.5,
          lastReviewDate: new Date().toISOString(),
        }) // board is an array of strings
        .returning();

      return NextResponse.json({board: result[0]}, {status: 200});
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({error: "Failed to insert board"}, {status: 500});
  }
}
