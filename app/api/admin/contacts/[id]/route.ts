import { type NextRequest, NextResponse } from "next/server"
import { MongoClient, ObjectId } from "mongodb"

let cachedClient: MongoClient | null = null

async function connectToDatabase() {
  if (cachedClient) {
    return cachedClient
  }

  const client = new MongoClient(process.env.MONGODB_URI!)
  await client.connect()
  cachedClient = client
  return client
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { status } = await request.json()
    const { id } = params

    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          error: "Invalid contact ID",
        },
        { status: 400 },
      )
    }

    const client = await connectToDatabase()
    const db = client.db("portfolio")
    const contacts = db.collection("contacts")

    const result = await contacts.updateOne({ _id: new ObjectId(id) }, { $set: { status, updatedAt: new Date() } })

    if (result.matchedCount === 0) {
      return NextResponse.json(
        {
          error: "Contact not found",
        },
        { status: 404 },
      )
    }

    return NextResponse.json(
      {
        success: true,
        message: "Contact status updated successfully",
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Error updating contact:", error)
    return NextResponse.json(
      {
        error: "Failed to update contact",
      },
      { status: 500 },
    )
  }
}
