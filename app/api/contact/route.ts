import { type NextRequest, NextResponse } from "next/server"
import { MongoClient } from "mongodb"
import nodemailer from "nodemailer"

// MongoDB connection caching
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

// Nodemailer transporter setup
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
})

export async function POST(request: NextRequest) {
  try {
    const { name, email, message } = await request.json()

    // Input validation
    if (!name || !email || !message) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 })
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 })
    }

    // Connect to MongoDB and save contact
    const client = await connectToDatabase()
    const db = client.db("portfolio")
    const contacts = db.collection("contacts")

    const contactData = {
      name,
      email,
      message,
      createdAt: new Date(),
      status: "new",
    }

    await contacts.insertOne(contactData)

    // Prepare email to admin
    const adminMailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.ADMIN_EMAIL,
      subject: `New Contact Form Submission from ${name}`,
      html: `
        <h3>New Contact Form Submission</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
        <p><strong>Submitted:</strong> ${new Date().toLocaleString()}</p>
      `,
    }

    // Prepare auto-reply email to user
    const autoReplyOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Thank you for contacting me!",
      html: `
        <h3>Thank you for your message, ${name}!</h3>
        <p>I have received your message and will get back to you soon.</p>
        <p>Best regards,<br>John Developer</p>
      `,
    }

    // Send both emails simultaneously
    await Promise.all([
      transporter.sendMail(adminMailOptions),
      transporter.sendMail(autoReplyOptions),
    ])

    // Success response
    return NextResponse.json(
      {
        success: true,
        message: "Message sent successfully! You'll receive a confirmation email shortly.",
      },
      { status: 200 }
    )
  } catch (error) {
    console.error("Error processing contact form:", error)
    return NextResponse.json(
      { error: "Failed to send message. Please try again later." },
      { status: 500 }
    )
  }
}
