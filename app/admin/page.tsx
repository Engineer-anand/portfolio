"use client"

import { useState, useEffect } from "react"
import "../globals.css"

interface Contact {
  _id: string
  name: string
  email: string
  message: string
  createdAt: string
  status: "new" | "read" | "replied"
}

export default function AdminDashboard() {
  const [contacts, setContacts] = useState<Contact[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null)

  useEffect(() => {
    fetchContacts()
  }, [])

  const fetchContacts = async () => {
    try {
      const response = await fetch("/api/admin/contacts")
      if (response.ok) {
        const data = await response.json()
        setContacts(data.contacts)
      }
    } catch (error) {
      console.error("Error fetching contacts:", error)
    } finally {
      setLoading(false)
    }
  }

  const updateContactStatus = async (id: string, status: string) => {
    try {
      const response = await fetch(`/api/admin/contacts/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      })

      if (response.ok) {
        setContacts(contacts.map((contact) => (contact._id === id ? { ...contact, status: status as any } : contact)))
      }
    } catch (error) {
      console.error("Error updating contact:", error)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "new":
        return "#e74c3c"
      case "read":
        return "#f39c12"
      case "replied":
        return "#27ae60"
      default:
        return "#95a5a6"
    }
  }

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="loading-spinner"></div>
        <p>Loading contacts...</p>
      </div>
    )
  }

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <h1>Contact Management Dashboard</h1>
        <div className="admin-stats">
          <div className="stat-card">
            <h3>{contacts.length}</h3>
            <p>Total Contacts</p>
          </div>
          <div className="stat-card">
            <h3>{contacts.filter((c) => c.status === "new").length}</h3>
            <p>New Messages</p>
          </div>
          <div className="stat-card">
            <h3>{contacts.filter((c) => c.status === "replied").length}</h3>
            <p>Replied</p>
          </div>
        </div>
      </div>

      <div className="admin-content">
        <div className="contacts-list">
          <h2>Contact Messages</h2>
          {contacts.length === 0 ? (
            <p className="no-contacts">No contact messages yet.</p>
          ) : (
            <div className="contacts-grid">
              {contacts.map((contact) => (
                <div
                  key={contact._id}
                  className={`contact-card ${selectedContact?._id === contact._id ? "selected" : ""}`}
                  onClick={() => setSelectedContact(contact)}
                >
                  <div className="contact-header">
                    <h3>{contact.name}</h3>
                    <span className="status-badge" style={{ backgroundColor: getStatusColor(contact.status) }}>
                      {contact.status}
                    </span>
                  </div>
                  <p className="contact-email">{contact.email}</p>
                  <p className="contact-preview">{contact.message.substring(0, 100)}...</p>
                  <p className="contact-date">{new Date(contact.createdAt).toLocaleDateString()}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {selectedContact && (
          <div className="contact-details">
            <div className="details-header">
              <h2>Message Details</h2>
              <button className="close-btn" onClick={() => setSelectedContact(null)}>
                ×
              </button>
            </div>

            <div className="details-content">
              <div className="detail-row">
                <strong>Name:</strong> {selectedContact.name}
              </div>
              <div className="detail-row">
                <strong>Email:</strong>
                <a href={`mailto:${selectedContact.email}`}>{selectedContact.email}</a>
              </div>
              <div className="detail-row">
                <strong>Date:</strong> {new Date(selectedContact.createdAt).toLocaleString()}
              </div>
              <div className="detail-row">
                <strong>Status:</strong>
                <select
                  value={selectedContact.status}
                  onChange={(e) => {
                    updateContactStatus(selectedContact._id, e.target.value)
                    setSelectedContact({ ...selectedContact, status: e.target.value as any })
                  }}
                  className="status-select"
                >
                  <option value="new">New</option>
                  <option value="read">Read</option>
                  <option value="replied">Replied</option>
                </select>
              </div>
              <div className="message-content">
                <strong>Message:</strong>
                <div className="message-text">{selectedContact.message}</div>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .admin-dashboard {
          min-height: 100vh;
          background: #f8f9fa;
          padding: 2rem;
        }

        .admin-header {
          background: white;
          padding: 2rem;
          border-radius: 10px;
          margin-bottom: 2rem;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }

        .admin-header h1 {
          color: #2c3e50;
          margin-bottom: 1.5rem;
        }

        .admin-stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
        }

        .stat-card {
          background: #3498db;
          color: white;
          padding: 1.5rem;
          border-radius: 8px;
          text-align: center;
        }

        .stat-card h3 {
          font-size: 2rem;
          margin-bottom: 0.5rem;
        }

        .admin-content {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
        }

        .contacts-list {
          background: white;
          padding: 1.5rem;
          border-radius: 10px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }

        .contacts-grid {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          max-height: 600px;
          overflow-y: auto;
        }

        .contact-card {
          border: 1px solid #e9ecef;
          border-radius: 8px;
          padding: 1rem;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .contact-card:hover {
          border-color: #3498db;
          transform: translateY(-2px);
        }

        .contact-card.selected {
          border-color: #3498db;
          background: #f8f9ff;
        }

        .contact-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.5rem;
        }

        .contact-header h3 {
          margin: 0;
          color: #2c3e50;
        }

        .status-badge {
          color: white;
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          font-size: 0.8rem;
          font-weight: bold;
        }

        .contact-email {
          color: #666;
          font-size: 0.9rem;
          margin-bottom: 0.5rem;
        }

        .contact-preview {
          color: #555;
          font-size: 0.9rem;
          margin-bottom: 0.5rem;
        }

        .contact-date {
          color: #999;
          font-size: 0.8rem;
        }

        .contact-details {
          background: white;
          border-radius: 10px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          overflow: hidden;
        }

        .details-header {
          background: #3498db;
          color: white;
          padding: 1rem 1.5rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .details-header h2 {
          margin: 0;
        }

        .close-btn {
          background: none;
          border: none;
          color: white;
          font-size: 1.5rem;
          cursor: pointer;
          padding: 0;
          width: 30px;
          height: 30px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .close-btn:hover {
          background: rgba(255,255,255,0.2);
        }

        .details-content {
          padding: 1.5rem;
        }

        .detail-row {
          margin-bottom: 1rem;
          display: flex;
          gap: 0.5rem;
        }

        .detail-row strong {
          min-width: 80px;
          color: #2c3e50;
        }

        .detail-row a {
          color: #3498db;
          text-decoration: none;
        }

        .status-select {
          padding: 0.25rem 0.5rem;
          border: 1px solid #ddd;
          border-radius: 4px;
        }

        .message-content {
          margin-top: 1.5rem;
        }

        .message-text {
          background: #f8f9fa;
          padding: 1rem;
          border-radius: 8px;
          margin-top: 0.5rem;
          white-space: pre-wrap;
          line-height: 1.6;
        }

        .admin-loading {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          gap: 1rem;
        }

        .loading-spinner {
          width: 40px;
          height: 40px;
          border: 4px solid #f3f3f3;
          border-top: 4px solid #3498db;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .no-contacts {
          text-align: center;
          color: #666;
          padding: 2rem;
        }

        @media (max-width: 768px) {
          .admin-content {
            grid-template-columns: 1fr;
          }
          
          .admin-stats {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  )
}
