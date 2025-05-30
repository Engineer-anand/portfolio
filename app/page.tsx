"use client"

import type React from "react"

import { useState, useEffect } from "react"
import "./globals.css"

export default function Portfolio() {
  const [activeSection, setActiveSection] = useState("home")
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState("")

  const sections = ["home", "about", "projects", "skills", "contact"]

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100

      sections.forEach((section) => {
        const element = document.getElementById(section)
        if (element) {
          const offsetTop = element.offsetTop
          const offsetHeight = element.offsetHeight

          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section)
          }
        }
      })
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
    setIsMenuOpen(false)
  }

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(contactForm),
      })

      const data = await response.json()

      if (response.ok) {
        setSubmitMessage(data.message || "Message sent successfully!")
        setContactForm({ name: "", email: "", message: "" })
      } else {
        setSubmitMessage(data.error || "Failed to send message. Please try again.")
      }
    } catch (error) {
      setSubmitMessage("Network error. Please check your connection and try again.")
    }

    setIsSubmitting(false)
    setTimeout(() => setSubmitMessage(""), 5000)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setContactForm({
      ...contactForm,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <div className="portfolio">
      {/* Navigation */}
      <nav className="navbar">
        <div className="nav-container">
          <div className="nav-logo">
            <h2>John Developer</h2>
          </div>

          <div className={`nav-menu ${isMenuOpen ? "active" : ""}`}>
            {sections.map((section) => (
              <button
                key={section}
                className={`nav-link ${activeSection === section ? "active" : ""}`}
                onClick={() => scrollToSection(section)}
              >
                {section.charAt(0).toUpperCase() + section.slice(1)}
              </button>
            ))}
          </div>

          <div className="hamburger" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </nav>

      {/* Home Section */}
      <section id="home" className="section home-section">
        <div className="container">
          <div className="home-content slide-in-left">
            <h1>Full Stack Developer</h1>
            <h2>Building Digital Solutions</h2>
            <p>
              Passionate about creating efficient, scalable web applications using modern technologies and best
              practices.
            </p>
            <div className="home-buttons">
              <button className="btn btn-primary" onClick={() => scrollToSection("projects")}>
                View Projects
              </button>
              <button className="btn btn-secondary" onClick={() => scrollToSection("contact")}>
                Get In Touch
              </button>
            </div>
          </div>
          <div className="home-image slide-in-right">
            <div className="developer-avatar">
              <div className="code-lines">
                <div className="line"></div>
                <div className="line"></div>
                <div className="line"></div>
                <div className="line"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="section about-section">
        <div className="container">
          <h2 className="section-title slide-in-up">About Me</h2>
          <div className="about-content">
            <div className="about-text slide-in-left">
              <p>
                I'm a passionate full-stack developer with 5+ years of experience building web applications. I
                specialize in React, Node.js, and modern web technologies.
              </p>
              <p>
                My journey started with a curiosity about how websites work, and it has evolved into a career focused on
                creating meaningful digital experiences. I believe in writing clean, maintainable code and staying
                updated with the latest industry trends.
              </p>
              <div className="about-stats">
                <div className="stat">
                  <h3>50+</h3>
                  <p>Projects Completed</p>
                </div>
                <div className="stat">
                  <h3>5+</h3>
                  <p>Years Experience</p>
                </div>
                <div className="stat">
                  <h3>30+</h3>
                  <p>Happy Clients</p>
                </div>
              </div>
            </div>
            <div className="about-image slide-in-right">
              <div className="tech-stack">
                <div className="tech-item">Frontend</div>
                <div className="tech-item">Backend</div>
                <div className="tech-item">Database</div>
                <div className="tech-item">DevOps</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="section projects-section">
        <div className="container">
          <h2 className="section-title slide-in-up">Featured Projects</h2>
          <div className="projects-grid">
            {[
              {
                title: "E-Commerce Platform",
                description: "Full-stack e-commerce solution with React, Node.js, and MongoDB",
                tech: ["React", "Node.js", "MongoDB", "Stripe"],
              },
              {
                title: "Task Management App",
                description: "Collaborative task management tool with real-time updates",
                tech: ["React", "Socket.io", "Express", "PostgreSQL"],
              },
              {
                title: "Social Media Dashboard",
                description: "Analytics dashboard for social media management",
                tech: ["React", "D3.js", "Node.js", "Redis"],
              },
            ].map((project, index) => (
              <div key={index} className={`project-card slide-in-up delay-${index}`}>
                <div className="project-image">
                  <div className="project-placeholder">
                    <span>Project {index + 1}</span>
                  </div>
                </div>
                <div className="project-content">
                  <h3>{project.title}</h3>
                  <p>{project.description}</p>
                  <div className="project-tech">
                    {project.tech.map((tech, techIndex) => (
                      <span key={techIndex} className="tech-tag">
                        {tech}
                      </span>
                    ))}
                  </div>
                  <div className="project-links">
                    <button className="btn btn-small">Live Demo</button>
                    <button className="btn btn-small btn-secondary">GitHub</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="section skills-section">
        <div className="container">
          <h2 className="section-title slide-in-up">Technical Skills</h2>
          <div className="skills-grid">
            {[
              { category: "Frontend", skills: ["React", "TypeScript", "JavaScript", "HTML/CSS"] },
              { category: "Backend", skills: ["Node.js", "Express", "Python", "REST APIs"] },
              { category: "Database", skills: ["MongoDB", "PostgreSQL", "Redis", "MySQL"] },
              { category: "Tools", skills: ["Git", "Docker", "AWS", "Vercel"] },
            ].map((skillGroup, index) => (
              <div key={index} className={`skill-group slide-in-up delay-${index}`}>
                <h3>{skillGroup.category}</h3>
                <div className="skills-list">
                  {skillGroup.skills.map((skill, skillIndex) => (
                    <div key={skillIndex} className="skill-item">
                      <span>{skill}</span>
                      <div className="skill-bar">
                        <div className="skill-progress"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="section contact-section">
        <div className="container">
          <h2 className="section-title slide-in-up">Get In Touch</h2>
          <div className="contact-content">
            <div className="contact-info slide-in-left">
              <h3>Let's Work Together</h3>
              <p>
                I'm always interested in new opportunities and exciting projects. Feel free to reach out if you'd like
                to collaborate!
              </p>
              <div className="contact-details">
                <div className="contact-item">
                  <strong>Email:</strong> john@developer.com
                </div>
                <div className="contact-item">
                  <strong>Phone:</strong> +1 (555) 123-4567
                </div>
                <div className="contact-item">
                  <strong>Location:</strong> San Francisco, CA
                </div>
              </div>
            </div>

            <form className="contact-form slide-in-right" onSubmit={handleContactSubmit}>
              <div className="form-group">
                <input
                  type="text"
                  name="name"
                  placeholder="Your Name"
                  value={contactForm.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <input
                  type="email"
                  name="email"
                  placeholder="Your Email"
                  value={contactForm.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <textarea
                  name="message"
                  placeholder="Your Message"
                  rows={5}
                  value={contactForm.message}
                  onChange={handleInputChange}
                  required
                ></textarea>
              </div>
              <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                {isSubmitting ? "Sending..." : "Send Message"}
              </button>
              {submitMessage && (
                <div className={`submit-message ${submitMessage.includes("success") ? "success" : "error"}`}>
                  {submitMessage}
                </div>
              )}
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <p>&copy; 2024 John Developer. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
