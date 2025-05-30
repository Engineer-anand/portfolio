import { type NextRequest, NextResponse } from "next/server"
import { MongoClient } from "mongodb"

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

export async function GET(request: NextRequest) {
  try {
    const client = await connectToDatabase()
    const db = client.db("portfolio")
    const contacts = db.collection("contacts")

    const contactList = await contacts.find({}).sort({ createdAt: -1 }).toArray()

    return NextResponse.json(
      {
        success: true,
        contacts: contactList,
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Error fetching contacts:", error)
    return NextResponse.json(
      {
        error: "Failed to fetch contacts",
      },
      { status: 500 },
    )
  }
}
