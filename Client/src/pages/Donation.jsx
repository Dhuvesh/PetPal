import { useState } from "react"
import {
  Heart,
  PawPrint,
  Shield,
  Star,
  Check,
  Coffee,
  Home,
  
  DollarSign,
  Calendar,

  Users,
  
  Facebook,
  Twitter,
  Instagram,
  Linkedin
} from "lucide-react"
import { Link } from "react-router-dom"

const DonationPage = () => {
  const [selectedAmount, setSelectedAmount] = useState("50")
  const [isMonthly, setIsMonthly] = useState(false)
  const [selectedFund, setSelectedFund] = useState("general")
  const [activeTab, setActiveTab] = useState("donate")
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    customAmount: "",
    message: ""
  })
  const [faqOpen, setFaqOpen] = useState({})

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })

    if (name === "customAmount") {
      setSelectedAmount("custom")
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Handle form submission logic here
    alert("Thank you for your donation! Your support means the world to our furry friends.")
  }

  const toggleFaq = (id) => {
    setFaqOpen({
      ...faqOpen,
      [id]: !faqOpen[id]
    })
  }

  const recentDonors = [
    { name: "Sarah J.", amount: "$100", time: "2 hours ago" },
    { name: "Michael T.", amount: "$50", time: "4 hours ago" },
    { name: "Anonymous", amount: "$200", time: "Yesterday" },
    { name: "Emma R.", amount: "$75", time: "Yesterday" },
    { name: "David K.", amount: "$150", time: "2 days ago" }
  ]

  const impactData = [
    { 
      title: "Emergency Medical Care", 
      description: "Your donation helps us provide emergency medical treatment for injured street animals.",
      icon: <Shield className="w-12 h-12 text-primary" />,
      stat: "520+ animals treated"
    },
    { 
      title: "Shelter Support", 
      description: "We provide food, supplies, and resources to local animal shelters in need.",
      icon: <Home className="w-12 h-12 text-secondary" />,
      stat: "32 shelters supported"
    },
    { 
      title: "Rescue Missions", 
      description: "Fund our rescue teams who save animals from dangerous situations.",
      icon: <Heart className="w-12 h-12 text-accent" />,
      stat: "1,200+ rescues completed"
    },
    { 
      title: "Spay & Neuter Programs", 
      description: "Help reduce pet overpopulation through our spay/neuter initiatives.",
      icon: <PawPrint className="w-12 h-12 text-primary" />,
      stat: "3,000+ procedures funded"
    }
  ]

  const faqs = [
    {
      id: 1,
      question: "Is my donation tax-deductible?",
      answer: "Yes! Pet Haven is a registered 501(c)(3) nonprofit organization, so all donations are tax-deductible to the extent allowed by law. You will receive a tax receipt for your records."
    },
    {
      id: 2,
      question: "How is my donation used?",
      answer: "Your donation directly supports our mission to help pets in need. Funds are allocated to emergency medical care, shelter support, rescue operations, pet food, supplies, and our spay/neuter programs. We maintain full transparency with our financial reports available on our website."
    },
    {
      id: 3,
      question: "Can I specify where my donation goes?",
      answer: "Absolutely! You can choose a specific fund for your donation using the dropdown menu on our donation form. Whether you want to support medical care, shelter operations, or our rescue teams, you can direct your gift accordingly."
    },
    {
      id: 4,
      question: "Do you accept non-monetary donations?",
      answer: "Yes, we gratefully accept pet food, supplies, toys, beds, and other items. Please contact us directly to arrange for drop-off or pickup of these donations. We also have an Amazon Wishlist with our most-needed items."
    },
    {
      id: 5,
      question: "How can I set up a monthly donation?",
      answer: "Setting up a monthly donation is easy! Simply select the 'Make this a monthly donation' option on our donation form. You can change or cancel your recurring donation at any time by contacting our donor support team."
    }
  ]

  return (
    <div className="min-h-screen bg-base-100">
      {/* Hero Section */}
      <section className="relative bg-base-200 py-20">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-extrabold text-base-content mb-6">
              Your Gift Makes a <span className="text-primary">Difference</span>
            </h1>
            <p className="max-w-2xl mx-auto text-xl text-base-content/70 mb-10">
              Every donation helps us rescue, rehabilitate, and rehome pets in need. Join us in creating a world where every pet has a loving home.
            </p>
            <div className="flex justify-center space-x-4 mb-8">
              <button 
                className={`btn ${activeTab === "donate" ? "btn-primary" : "btn-ghost"} btn-lg hover:-translate-y-0.5 transition-transform duration-200`}
                onClick={() => setActiveTab("donate")}
              >
                <Heart className="mr-2" /> Make a Donation
              </button>
              <button 
                className={`btn ${activeTab === "impact" ? "btn-primary" : "btn-ghost"} btn-lg hover:-translate-y-0.5 transition-transform duration-200`}
                onClick={() => setActiveTab("impact")}
              >
                <Star className="mr-2" /> See Your Impact
              </button>
            </div>
          </div>
        </div>
      </section>

      {activeTab === "donate" ? (
        <>
          {/* Donation Form Section */}
          <section className="py-16 bg-base-100">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Form */}
                <div className="lg:col-span-2">
                  <div className="bg-base-200 rounded-xl shadow-xl p-8">
                    <h2 className="text-2xl font-bold mb-6 text-base-content">Make Your Donation</h2>
                    <form onSubmit={handleSubmit}>
                      {/* Donation Amount */}
                      <div className="mb-8">
                        <label className="block text-base-content font-medium mb-3">Select Donation Amount</label>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                          {["25", "50", "100", "200"].map((amount) => (
                            <button
                              key={amount}
                              type="button"
                              className={`btn ${
                                selectedAmount === amount ? "btn-primary" : "btn-outline"
                              } w-full hover:-translate-y-0.5 transition-transform duration-200`}
                              onClick={() => setSelectedAmount(amount)}
                            >
                              ${amount}
                            </button>
                          ))}
                        </div>
                        <div className="form-control">
                          <label className="label">
                            <span className="label-text">Custom Amount ($)</span>
                          </label>
                          <input
                            type="number"
                            name="customAmount"
                            placeholder="Enter amount"
                            className="input input-bordered w-full"
                            value={formData.customAmount}
                            onChange={handleInputChange}
                            onClick={() => setSelectedAmount("custom")}
                          />
                        </div>
                      </div>

                      {/* Recurring Donation Toggle */}
                      <div className="form-control mb-8">
                        <label className="label cursor-pointer justify-start gap-4">
                          <input 
                            type="checkbox" 
                            className="toggle toggle-primary" 
                            checked={isMonthly}
                            onChange={() => setIsMonthly(!isMonthly)}
                          />
                          <span className="label-text text-base font-medium">
                            Make this a monthly donation
                          </span>
                        </label>
                        {isMonthly && (
                          <p className="text-sm text-base-content/70 mt-2 ml-14">
                            Your recurring gift provides consistent support for animals in need.
                            You can cancel or change your monthly donation at any time.
                          </p>
                        )}
                      </div>

                      {/* Fund Allocation */}
                      <div className="form-control mb-8">
                        <label className="label">
                          <span className="label-text font-medium">Direct My Donation To</span>
                        </label>
                        <select 
                          className="select select-bordered w-full" 
                          value={selectedFund}
                          onChange={(e) => setSelectedFund(e.target.value)}
                        >
                          <option value="general">Where Most Needed</option>
                          <option value="medical">Emergency Medical Fund</option>
                          <option value="shelter">Shelter Support Program</option>
                          <option value="rescue">Rescue Operations</option>
                          <option value="spay">Spay & Neuter Program</option>
                        </select>
                      </div>

                      {/* Personal Info */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                        <div className="form-control">
                          <label className="label">
                            <span className="label-text">First Name</span>
                          </label>
                          <input
                            type="text"
                            name="firstName"
                            placeholder="First Name"
                            className="input input-bordered w-full"
                            value={formData.firstName}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                        <div className="form-control">
                          <label className="label">
                            <span className="label-text">Last Name</span>
                          </label>
                          <input
                            type="text"
                            name="lastName"
                            placeholder="Last Name"
                            className="input input-bordered w-full"
                            value={formData.lastName}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                      </div>

                      <div className="form-control mb-8">
                        <label className="label">
                          <span className="label-text">Email Address</span>
                        </label>
                        <input
                          type="email"
                          name="email"
                          placeholder="email@example.com"
                          className="input input-bordered w-full"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                        />
                      </div>

                      {/* Message */}
                      <div className="form-control mb-8">
                        <label className="label">
                          <span className="label-text">Leave a Message (Optional)</span>
                        </label>
                        <textarea
                          name="message"
                          placeholder="Your message of support"
                          className="textarea textarea-bordered h-24"
                          value={formData.message}
                          onChange={handleInputChange}
                        ></textarea>
                      </div>

                      {/* Submit Button */}
                      <button
                        type="submit"
                        className="btn btn-primary btn-lg w-full hover:-translate-y-0.5 transition-transform duration-200"
                      >
                        <Heart className="mr-2" />
                        {isMonthly
                          ? `Donate $${selectedAmount === "custom" ? formData.customAmount || "0" : selectedAmount} Monthly`
                          : `Donate $${selectedAmount === "custom" ? formData.customAmount || "0" : selectedAmount} Now`}
                      </button>
                    </form>
                  </div>
                </div>

                {/* Sidebar */}
                <div>
                  {/* Recent Donors */}
                  <div className="bg-base-200 rounded-xl shadow-xl p-6 mb-8">
                    <h3 className="text-lg font-bold mb-4 text-base-content">Recent Supporters</h3>
                    <ul className="space-y-4">
                      {recentDonors.map((donor, index) => (
                        <li key={index} className="flex justify-between items-center border-b border-base-300 pb-2">
                          <div>
                            <p className="font-medium">{donor.name}</p>
                            <p className="text-xs text-base-content/60">{donor.time}</p>
                          </div>
                          <span className="text-primary font-semibold">{donor.amount}</span>
                        </li>
                      ))}
                    </ul>
                    <p className="text-sm text-center mt-4 text-base-content/70">
                      Join these amazing supporters in making a difference!
                    </p>
                  </div>

                  {/* Other Ways to Help */}
                  <div className="bg-base-200 rounded-xl shadow-xl p-6">
                    <h3 className="text-lg font-bold mb-4 text-base-content">Other Ways to Help</h3>
                    <ul className="space-y-4">
                      <li className="flex items-start">
                        <div className="bg-primary/20 p-2 rounded-lg mr-3">
                          <Coffee className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">Become a Monthly Supporter</p>
                          <p className="text-sm text-base-content/70">Provide consistent help with recurring donations</p>
                        </div>
                      </li>
                      <li className="flex items-start">
                        <div className="bg-secondary/20 p-2 rounded-lg mr-3">
                          <Users className="w-6 h-6 text-secondary" />
                        </div>
                        <div>
                          <p className="font-medium">Volunteer Your Time</p>
                          <p className="text-sm text-base-content/70">Help at our shelters or events</p>
                        </div>
                      </li>
                      <li className="flex items-start">
                        <div className="bg-accent/20 p-2 rounded-lg mr-3">
                          <Calendar className="w-6 h-6 text-accent" />
                        </div>
                        <div>
                          <p className="font-medium">Corporate Partnership</p>
                          <p className="text-sm text-base-content/70">Create a partnership with your company</p>
                        </div>
                      </li>
                    </ul>
                    <button className="btn btn-outline btn-primary w-full mt-6 hover:-translate-y-0.5 transition-transform duration-200">
                      Learn More
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </>
      ) : (
        <>
          {/* Impact Section */}
          <section className="py-16 bg-base-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-3xl font-bold text-center mb-16 text-base-content">
                Your Donations at Work
                <div className="w-24 h-1 bg-primary mx-auto mt-4"></div>
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
                {impactData.map((item, index) => (
                  <div 
                    key={index} 
                    className="card bg-base-200 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
                  >
                    <div className="card-body items-center text-center">
                      {item.icon}
                      <h3 className="card-title mt-4">{item.title}</h3>
                      <p className="text-base-content/70 text-sm">{item.description}</p>
                      <div className="mt-4 badge badge-primary badge-lg">{item.stat}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Impact Stories */}
              <h3 className="text-2xl font-bold text-center mb-8 text-base-content">Success Stories</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Story 1 */}
                <div className="card bg-base-200 shadow-xl">
                  <figure className="px-5 pt-5">
                    <img 
                      src="/api/placeholder/400/300" 
                      alt="Rescued dog before and after" 
                      className="rounded-xl" 
                    />
                  </figure>
                  <div className="card-body">
                    <h3 className="card-title">Max's Miracle Recovery</h3>
                    <p className="text-base-content/70 text-sm">
                      Found abandoned with severe injuries, Max received emergency medical care funded by donations like yours. 
                      Today, he's thriving in his forever home with the Johnson family.
                    </p>
                    <div className="card-actions justify-end mt-2">
                      <button className="btn btn-primary btn-sm">Read Story</button>
                    </div>
                  </div>
                </div>

                {/* Story 2 */}
                <div className="card bg-base-200 shadow-xl">
                  <figure className="px-5 pt-5">
                    <img 
                      src="/api/placeholder/400/300" 
                      alt="Rescued cat before and after" 
                      className="rounded-xl" 
                    />
                  </figure>
                  <div className="card-body">
                    <h3 className="card-title">Luna's Transformation</h3>
                    <p className="text-base-content/70 text-sm">
                      Luna was found in a hoarding situation with 30 other cats. Your donations helped fund her rescue, 
                      medical treatment, and rehoming to a loving family.
                    </p>
                    <div className="card-actions justify-end mt-2">
                      <button className="btn btn-primary btn-sm">Read Story</button>
                    </div>
                  </div>
                </div>

                {/* Story 3 */}
                <div className="card bg-base-200 shadow-xl">
                  <figure className="px-5 pt-5">
                    <img 
                      src="/api/placeholder/400/300" 
                      alt="Shelter renovation" 
                      className="rounded-xl" 
                    />
                  </figure>
                  <div className="card-body">
                    <h3 className="card-title">Paws County Shelter Upgrade</h3>
                    <p className="text-base-content/70 text-sm">
                      Your donations helped renovate this overcrowded shelter, providing better living conditions for 
                      over 200 animals and increasing adoption rates by 45%.
                    </p>
                    <div className="card-actions justify-end mt-2">
                      <button className="btn btn-primary btn-sm">Read Story</button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-center mt-12">
                <button 
                  className="btn btn-primary btn-lg hover:-translate-y-0.5 transition-transform duration-200"
                  onClick={() => setActiveTab("donate")}
                >
                  <Heart className="mr-2" /> Make a Donation Now
                </button>
              </div>
            </div>
          </section>
        </>
      )}

      {/* FAQ Section */}
      <section className="py-16 bg-base-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12 text-base-content">
            Frequently Asked Questions
            <div className="w-24 h-1 bg-primary mx-auto mt-4"></div>
          </h2>

          <div className="space-y-4">
            {faqs.map((faq) => (
              <div key={faq.id} className="collapse collapse-plus bg-base-100 shadow-md">
                <input 
                  type="checkbox" 
                  checked={faqOpen[faq.id]} 
                  onChange={() => toggleFaq(faq.id)}
                  className="peer" 
                />
                <div className="collapse-title text-xl font-medium peer-checked:text-primary">
                  {faq.question}
                </div>
                <div className="collapse-content">
                  <p className="text-base-content/80">{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-base-content/70 mb-4">
              Have other questions about donating? We're here to help!
            </p>
            <Link to="/contact">
              <button className="btn btn-outline btn-primary hover:-translate-y-0.5 transition-transform duration-200">
                Contact Our Support Team
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Our Commitment Section */}
      <section className="py-16 bg-base-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6 text-base-content">Our Commitment to Transparency</h2>
              <p className="text-base-content/70 mb-6">
                At Pet Haven, we believe in complete transparency with how we use your generous donations. 
                We're committed to maximizing the impact of every dollar you entrust to us.
              </p>
              <ul className="space-y-4">
                {[
                  "85% of donations go directly to animal care and programs",
                  "Quarterly financial reports published on our website",
                  "Annual third-party audits to ensure accountability",
                  "Detailed impact reports sent to all donors"
                ].map((item, index) => (
                  <li key={index} className="flex items-center">
                    <Check className="w-5 h-5 text-primary mr-2" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-8">
                <button className="btn btn-outline btn-primary hover:-translate-y-0.5 transition-transform duration-200">
                  View Our Financial Reports
                </button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="stats shadow">
                <div className="stat">
                  <div className="stat-figure text-primary">
                    <DollarSign className="w-8 h-8" />
                  </div>
                  <div className="stat-title">Funds Raised</div>
                  <div className="stat-value text-primary">$1.2M</div>
                  <div className="stat-desc">Last year</div>
                </div>
              </div>
              <div className="stats shadow">
                <div className="stat">
                  <div className="stat-figure text-secondary">
                    <PawPrint className="w-8 h-8" />
                  </div>
                  <div className="stat-title">Pets Helped</div>
                  <div className="stat-value text-secondary">4,280</div>
                  <div className="stat-desc">Last year</div>
                </div>
              </div>
              <div className="stats shadow">
                <div className="stat">
                  <div className="stat-figure text-accent">
                    <Home className="w-8 h-8" />
                  </div>
                  <div className="stat-title">Shelter Partners</div>
                  <div className="stat-value text-accent">32</div>
                  <div className="stat-desc">Across the country</div>
                </div>
              </div>
              <div className="stats shadow">
                <div className="stat">
                  <div className="stat-figure text-primary">
                    <Users className="w-8 h-8" />
                  </div>
                  <div className="stat-title">Monthly Donors</div>
                  <div className="stat-value text-primary">720</div>
                  <div className="stat-desc">Growing every day</div>
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
    </div>
  )
}

export default DonationPage