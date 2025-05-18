import {NextResponse} from "next/server";
import {db} from "../../lib/drizzle";
import {BoardTable} from "../../lib/BoardTable";

export async function POST(req: Request) {
  const body = await req.json();
  const {ownerId, board, name, orientation} = body;

  try {
    const result = await db
      .insert(BoardTable)
      .values({
        ownerId: ownerId,
        board: board,
        name: name,
        orientation: orientation,
        currentInterval: 1,
        easeFactor: 2.5,
        lastReviewDate: new Date(),
      }) // board is an array of strings
      .returning();

    return NextResponse.json({board: result[0]}, {status: 200});
  } catch (error) {
    console.error(error);
    return NextResponse.json({error: "Failed to insert board"}, {status: 500});
  }
}
