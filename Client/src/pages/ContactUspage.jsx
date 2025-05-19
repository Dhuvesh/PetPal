import { useState } from "react"
import {
  PhoneCall,
  Mail,
  MapPin,
  Clock,
  Send,
  MessageSquare,
  Users,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Heart,
  AlertCircle,
  CheckCircle,
  X
} from "lucide-react"
import { Link } from "react-router-dom"
import axios from "axios"

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  })
  
  const [openFaq, setOpenFaq] = useState(null)
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success", // success or error
  })
  
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const response = await axios.post('http://localhost:3000/api/contacts', formData)
      
      // Show success toast
      showToast("Thank you for your message! We'll get back to you shortly.", "success")
      
      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      })
    } catch (error) {
      console.error('Error submitting form:', error)
      
      // Determine error message based on error response
      let errorMessage = "There was a problem sending your message. Please try again."
      
      if (error.response && error.response.data && error.response.data.error) {
        if (Array.isArray(error.response.data.error)) {
          errorMessage = error.response.data.error.join(", ")
        } else {
          errorMessage = error.response.data.error
        }
      }
      
      // Show error toast
      showToast(errorMessage, "error")
    } finally {
      setLoading(false)
    }
  }
  
  const showToast = (message, type) => {
    setToast({
      show: true,
      message,
      type
    })
    
    // Auto-hide toast after 5 seconds
    setTimeout(() => {
      setToast(prev => ({ ...prev, show: false }))
    }, 5000)
  }
  
  const hideToast = () => {
    setToast(prev => ({ ...prev, show: false }))
  }
  
  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index)
  }
  
  const faqs = [
    {
      question: "What information do I need to provide when adopting a pet?",
      answer: "You'll need to provide identification, proof of address, information about your living situation, and references. Our adoption counselors will guide you through the process to ensure the best match."
    },
    {
      question: "How long does the adoption process take?",
      answer: "The adoption process typically takes 1-5 days depending on the pet and your specific situation. We work to make it as smooth and quick as possible while ensuring proper matches."
    },
    {
      question: "Do you offer post-adoption support?",
      answer: "Yes! We provide ongoing support including training resources, veterinary referrals, and behavior advice. Our team remains available to help you and your pet adjust to your new life together."
    },
    {
      question: "Can I visit the pets before deciding to adopt?",
      answer: "Absolutely! We encourage meet-and-greets to ensure you and your potential pet are a good match. Please schedule an appointment through our website or by calling our office."
    },
    {
      question: "What are the adoption fees?",
      answer: "Adoption fees vary depending on the animal, age, and medical needs. The fee typically covers vaccinations, microchipping, and spay/neuter procedures. Contact us for specific information about the pet you're interested in."
    }
  ]
  
  const contactInfo = [
    {
      icon: <PhoneCall className="h-6 w-6 text-primary" />,
      title: "Phone",
      details: ["+1 (555) 123-4567", "+1 (555) 987-6543"],
      action: "Call us"
    },
    {
      icon: <Mail className="h-6 w-6 text-primary" />,
      title: "Email",
      details: ["contact@pethaven.com", "support@pethaven.com"],
      action: "Email us"
    },
    {
      icon: <MapPin className="h-6 w-6 text-primary" />,
      title: "Visit Us",
      details: ["123 Pet Avenue", "Pawsville, CA 90210"],
      action: "Get directions"
    },
    {
      icon: <Clock className="h-6 w-6 text-primary" />,
      title: "Hours",
      details: ["Mon-Fri: 9AM - 6PM", "Sat-Sun: 10AM - 4PM"],
      action: "See holidays"
    }
  ]
  
  const locations = [
    {
      name: "Main Adoption Center",
      address: "123 Pet Avenue, Pawsville, CA 90210",
      phone: "+1 (555) 123-4567",
      hours: "Mon-Fri: 9AM - 6PM, Sat-Sun: 10AM - 4PM"
    },
    {
      name: "Downtown Office",
      address: "456 Central Street, Pawsville, CA 90211",
      phone: "+1 (555) 987-6543",
      hours: "Mon-Fri: 10AM - 5PM, Sat: 11AM - 3PM, Sun: Closed"
    },
    {
      name: "West Side Shelter",
      address: "789 Sunset Blvd, Pawsville, CA 90212",
      phone: "+1 (555) 456-7890",
      hours: "Mon-Sat: 11AM - 7PM, Sun: 12PM - 5PM"
    }
  ]

  return (
    <div className="min-h-screen bg-base-100">
      {/* Toast Notification */}
      {toast.show && (
        <div className={`fixed top-4 right-4 z-50 w-96 shadow-lg rounded-lg overflow-hidden transition-all duration-300 ${toast.type === "success" ? "bg-success text-success-content" : "bg-error text-error-content"}`}>
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center">
              {toast.type === "success" ? (
                <CheckCircle className="h-6 w-6 mr-3" />
              ) : (
                <AlertCircle className="h-6 w-6 mr-3" />
              )}
              <p className="font-medium">{toast.message}</p>
            </div>
            <button 
              onClick={hideToast}
              className="p-1 rounded-full hover:bg-black/10 transition-colors duration-200"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <div 
            className={`h-1 ${toast.type === "success" ? "bg-success-content/30" : "bg-error-content/30"}`}
            style={{
              width: "100%",
              animation: "shrink 5s linear forwards"
            }}
          ></div>
        </div>
      )}

      {/* Hero Section */}
      <section className="bg-base-200 py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold text-base-content mb-4">
              <span className="block transform transition-all duration-500 hover:scale-105">
                Get in <span className="text-primary">Touch</span>
              </span>
            </h1>
            <p className="max-w-3xl mx-auto text-lg text-base-content/70 mb-8">
              We're here to answer your questions and help you find your perfect pet companion
            </p>
          </div>
          
          {/* Contact Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
            {contactInfo.map((item, index) => (
              <div key={index} className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                <div className="card-body items-center text-center">
                  <div className="bg-base-200 p-3 rounded-full mb-4">
                    {item.icon}
                  </div>
                  <h3 className="card-title text-xl">{item.title}</h3>
                  {item.details.map((detail, i) => (
                    <p key={i} className="text-base-content/80">{detail}</p>
                  ))}
                  <button className="btn btn-primary btn-sm mt-4 hover:-translate-y-0.5 transition-transform duration-200">
                    {item.action}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form and Map Section */}
      <section className="py-16 bg-base-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="card bg-base-200 shadow-xl">
              <div className="card-body">
                <h2 className="text-2xl font-bold mb-6 flex items-center">
                  <MessageSquare className="mr-2 text-primary" />
                  Send Us a Message
                </h2>
                <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Your Name</span>
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="John Doe"
                        className="input input-bordered w-full"
                        required
                        disabled={loading}
                      />
                    </div>
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Your Email</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="john@example.com"
                        className="input input-bordered w-full"
                        required
                        disabled={loading}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Phone Number</span>
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="(555) 123-4567"
                        className="input input-bordered w-full"
                        disabled={loading}
                      />
                    </div>
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Subject</span>
                      </label>
                      <select
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        className="select select-bordered w-full"
                        required
                        disabled={loading}
                      >
                        <option value="" disabled>Select a subject</option>
                        <option value="adoption">Pet Adoption</option>
                        <option value="rehoming">Rehoming a Pet</option>
                        <option value="volunteer">Volunteering</option>
                        <option value="donation">Donations</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>
                  <div className="form-control mb-4">
                    <label className="label">
                      <span className="label-text">Your Message</span>
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      className="textarea textarea-bordered h-32"
                      placeholder="How can we help you?"
                      required
                      disabled={loading}
                    ></textarea>
                  </div>
                  <div className="form-control mt-6">
                    <button
                      type="submit"
                      className={`btn btn-primary hover:-translate-y-0.5 transition-transform duration-200 ${loading ? "loading" : ""}`}
                      disabled={loading}
                    >
                      {loading ? (
                        "Sending..."
                      ) : (
                        <>
                          <Send className="mr-2 h-4 w-4" /> Send Message
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Map placeholder */}
            <div className="card bg-base-200 shadow-xl overflow-hidden">
              <div className="h-64 bg-gray-300 relative">
                {/* This would be replaced with an actual map in a real application */}
                <div className="absolute inset-0 flex items-center justify-center bg-base-300">
                  <p className="text-base-content/70 text-center px-4">
                    Interactive map would be displayed here.<br />
                    Find our locations across the city!
                  </p>
                </div>
              </div>
              <div className="card-body">
                <h2 className="text-2xl font-bold mb-4 flex items-center">
                  <MapPin className="mr-2 text-primary" />
                  Our Locations
                </h2>
                <div className="space-y-4">
                  {locations.map((location, index) => (
                    <div key={index} className="border-b border-base-300 pb-4 last:border-0 last:pb-0">
                      <h3 className="font-bold text-lg">{location.name}</h3>
                      <p className="text-base-content/80 text-sm">{location.address}</p>
                      <p className="text-base-content/80 text-sm">{location.phone}</p>
                      <p className="text-base-content/80 text-sm">{location.hours}</p>
                    </div>
                  ))}
                </div>
                <div className="card-actions justify-end mt-4">
                  <button className="btn btn-outline btn-primary btn-sm hover:-translate-y-0.5 transition-transform duration-200">
                    View All Locations
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-base-200">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-base-content">
              Frequently Asked Questions
              <div className="w-24 h-1 bg-primary mx-auto mt-4"></div>
            </h2>
            <p className="mt-4 text-base-content/70">
              Find answers to common questions about our adoption process and services
            </p>
          </div>
          
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div 
                key={index} 
                className="card bg-base-100 shadow-md hover:shadow-lg transition-all duration-300"
              >
                <div 
                  className="card-body p-4 cursor-pointer"
                  onClick={() => toggleFaq(index)}
                >
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium text-lg flex items-center">
                      <HelpCircle className="w-5 h-5 mr-2 text-primary" />
                      {faq.question}
                    </h3>
                    {openFaq === index ? (
                      <ChevronUp className="w-5 h-5 text-primary" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-primary" />
                    )}
                  </div>
                  {openFaq === index && (
                    <div className="mt-4 text-base-content/80 pl-7">
                      {faq.answer}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-8">
            <p className="text-base-content/70">
              Still have questions? Contact our support team directly.
            </p>
            <button className="btn btn-primary mt-4 hover:-translate-y-0.5 transition-transform duration-200">
              <PhoneCall className="mr-2 h-4 w-4" />
              Contact Support
            </button>
          </div>
        </div>
      </section>
      
      {/* Call to Action */}
      <section className="py-16 bg-base-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-primary text-primary-content rounded-xl p-8 md:p-12 shadow-xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-4">Ready to Find Your Perfect Pet?</h2>
                <p className="mb-6">
                  Start your journey to pet adoption today. Our team is ready to help you find your new best friend.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link to="/adopt">
                    <button className="btn bg-white text-primary border-white hover:bg-white/90 hover:-translate-y-0.5 transition-all duration-200">
                      Explore Available Pets
                    </button>
                  </Link>
                  <Link to="/volunteer">
                    <button className="btn btn-outline border-white text-white hover:bg-white hover:text-primary hover:-translate-y-0.5 transition-all duration-200">
                      <Users className="mr-2 h-4 w-4" />
                      Volunteer With Us
                    </button>
                  </Link>
                </div>
              </div>
              <div className="flex justify-center">
                {/* This would be an illustration in a real application */}
                <div className="w-48 h-48 bg-white/20 rounded-full flex items-center justify-center">
                  <Heart className="w-24 h-24 text-white animate-pulse" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer p-10 bg-base-300 text-base-content border-t border-base-content/10">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <span className="footer-title">Quick Links</span>
            <ul className="mt-3 space-y-2">
              <li>
                <a className="link link-hover">Adopt a Pet</a>
              </li>
              <li>
                <a className="link link-hover">Rehome a Pet</a>
              </li>
              <li>
                <a className="link link-hover">Vet Services</a>
              </li>
              <li>
                <a className="link link-hover">Our Mission</a>
              </li>
            </ul>
          </div>
          <div>
            <span className="footer-title">Support</span>
            <ul className="mt-3 space-y-2">
              <li>
                <a className="link link-hover">Contact Us</a>
              </li>
              <li>
                <a className="link link-hover">FAQ</a>
              </li>
              <li>
                <a className="link link-hover">Donation</a>
              </li>
              <li>
                <a className="link link-hover">Volunteer</a>
              </li>
            </ul>
          </div>
          <div>
            <span className="footer-title">Legal</span>
            <ul className="mt-3 space-y-2">
              <li>
                <a className="link link-hover">Terms of Service</a>
              </li>
              <li>
                <a className="link link-hover">Privacy Policy</a>
              </li>
              <li>
                <a className="link link-hover">Cookie Policy</a>
              </li>
              <li>
                <a className="link link-hover">Accessibility</a>
              </li>
            </ul>
          </div>
          <div>
            <span className="footer-title">Connect With Us</span>
            <div className="flex space-x-4 mt-3">
              <a href="#" className="text-primary hover:text-primary-focus">
                <Facebook size={24} />
              </a>
              <a href="#" className="text-primary hover:text-primary-focus">
                <Twitter size={24} />
              </a>
              <a href="#" className="text-primary hover:text-primary-focus">
                <Instagram size={24} />
              </a>
              <a href="#" className="text-primary hover:text-primary-focus">
                <Linkedin size={24} />
              </a>
            </div>
            <div className="mt-4">
              <p className="text-sm text-base-content/70">Subscribe to our newsletter for updates</p>
              <div className="form-control w-full max-w-xs mt-2">
                <div className="input-group">
                  <input type="email" placeholder="Email address" className="input input-bordered w-full pr-16" />
                  <button className="btn btn-primary hover:-translate-y-0.5 transition-transform duration-200">
                    Subscribe
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Copyright Section */}
      <div className="footer footer-center p-4 bg-base-200 text-base-content">
        <div>
          <p>
            © {new Date().getFullYear()} Pet Haven. All rights reserved. Designed with{" "}
            <Heart className="inline-block text-error" size={16} /> by Our Dedicated Team
          </p>
        </div>
      </div>
      
      {/* Custom CSS for toast animation */}
      <style jsx>{`
        @keyframes shrink {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
    </div>
  )
}

export default ContactPage