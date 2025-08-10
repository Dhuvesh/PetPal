
import { useState, useEffect } from "react"
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
  Linkedin,
  Mail
} from "lucide-react"
import { Link } from "react-router-dom"
// Stripe imports
import { loadStripe } from "@stripe/stripe-js"
import {
  Elements,
  CardElement,
  useStripe,
  useElements
} from "@stripe/react-stripe-js"

// Initialize Stripe with your publishable key
const stripePromise = loadStripe("pk_test_51PrIcxImr0JnGY7OrH0T3yiPBshD3Xy6wIEUyUV8PWdiNqgAqzojVrmfFdVQGr6v58DqzD1mboRl3uV8Uhv8w1dX00TVdQTqG7")

// Payment form component
const DonationPaymentForm = ({ selectedAmount, isMonthly, selectedFund, formData, onPaymentComplete }) => {
  const API_URL = import.meta.env.VITE_API_URL; 
  const stripe = useStripe()
  const elements = useElements()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [clientSecret, setClientSecret] = useState("")
  const [paymentIntentId, setPaymentIntentId] = useState("")

  // Calculate actual amount based on selection
  const amount = selectedAmount === "custom" ? formData.customAmount : selectedAmount;

  useEffect(() => {
    // Only create payment intent if we have a valid amount
    if (amount && amount > 0) {
      const createIntent = async () => {
        try {
          setLoading(true);
          console.log("Creating payment intent for:", { amount, selectedFund, isMonthly });

          const response = await fetch(`${API_URL}/api/donations/create-payment-intent`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              amount: parseFloat(amount),
              fundType: selectedFund,
              isMonthly,
              currency: "inr"
            }),
          });

          const data = await response.json();
          
          if (response.ok) {
            console.log("Payment intent created successfully:", data);
            setClientSecret(data.clientSecret);
            setPaymentIntentId(data.paymentIntentId);
          } else {
            console.error("Payment intent creation failed:", data);
            setError(data.message || "An error occurred while creating payment intent");
          }
        } catch (err) {
          console.error("Network error creating payment intent:", err);
          setError("Network error. Please try again.");
        } finally {
          setLoading(false);
        }
      };

      createIntent();
    }
  }, [amount, selectedFund, isMonthly]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not loaded yet
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Handle one-time donation
      if (!isMonthly) {
        const result = await stripe.confirmCardPayment(clientSecret, {
          payment_method: {
            card: elements.getElement(CardElement),
            billing_details: {
              name: `${formData.firstName} ${formData.lastName}`,
              email: formData.email
            }
          }
        });

        if (result.error) {
          setError(result.error.message);
        } else if (result.paymentIntent.status === "succeeded") {
          // Payment confirmed, now confirm donation on server
          const donationResponse = await fetch(`${API_URL}/api/donations/confirm-donation`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              paymentIntentId,
              firstName: formData.firstName,
              lastName: formData.lastName,
              email: formData.email,
              message: formData.message,
              fundType: selectedFund
            }),
          });

          const donationResult = await donationResponse.json();
          if (donationResponse.ok) {
            // The backend will send the email receipt automatically
            onPaymentComplete({
              ...donationResult.donation, 
              receiptSent: donationResult.receiptSent
            });
          } else {
            setError(donationResult.message || "Error confirming donation");
          }
        }
      } else {
        // Handle subscription/monthly donation
        const paymentMethod = await stripe.createPaymentMethod({
          type: "card",
          card: elements.getElement(CardElement),
          billing_details: {
            name: `${formData.firstName} ${formData.lastName}`,
            email: formData.email
          }
        });

        if (paymentMethod.error) {
          setError(paymentMethod.error.message);
          return;
        }

        // Create subscription
        const subscriptionResponse = await fetch(`${API_URL}/api/donations/create-subscription`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            paymentMethodId: paymentMethod.paymentMethod.id,
            amount: parseFloat(amount),
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            fundType: selectedFund,
            message: formData.message
          }),
        });

        const subscriptionResult = await subscriptionResponse.json();
        
        if (subscriptionResponse.ok) {
          // Confirm subscription payment
          const { error: confirmError } = await stripe.confirmCardPayment(subscriptionResult.clientSecret);
          
          if (confirmError) {
            setError(confirmError.message);
          } else {
            // The backend will send the email receipt automatically
            onPaymentComplete({
              subscriptionId: subscriptionResult.subscriptionId,
              isMonthly: true,
              receiptSent: subscriptionResult.receiptSent
            });
          }
        } else {
          setError(subscriptionResult.message || "Error creating subscription");
        }
      }
    } catch (err) {
      console.error("Payment error:", err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && (
        <div className="alert alert-error mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <span>{error}</span>
        </div>
      )}
      
      <div className="mb-6">
        <label className="block text-base-content font-medium mb-2">Card Details</label>
        <div className="border border-base-300 rounded-lg p-4 bg-white">
          <CardElement 
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#424770',
                  '::placeholder': {
                    color: '#aab7c4',
                  },
                },
                invalid: {
                  color: '#9e2146',
                },
              },
            }}
          />
        </div>
        <p className="text-xs text-base-content/70 mt-2">
          Secure payment processed by Stripe. Your card information is never stored on our servers.
        </p>
      </div>

      <button
        type="submit"
        disabled={!stripe || loading || !clientSecret}
        className={`btn btn-primary btn-lg w-full hover:-translate-y-0.5 transition-transform duration-200 ${loading ? 'loading' : ''}`}
      >
        {!loading && <Heart className="mr-2" />}
        {loading ? 'Processing...' : 
          isMonthly
            ? `Donate ₹${amount} Monthly`
            : `Donate ₹${amount} Now`
        }
      </button>
    </form>
  );
};

const DonationPage = () => {
   const API_URL = import.meta.env.VITE_API_URL;
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
  const [paymentStep, setPaymentStep] = useState("details") // "details", "payment", "success"
  const [donationResult, setDonationResult] = useState(null)
  const [receiptStatus, setReceiptStatus] = useState(null) // To track email receipt status

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

  const handleDetailsSubmit = (e) => {
    e.preventDefault()
    setPaymentStep("payment")
  }

  const handlePaymentComplete = (result) => {
    setDonationResult(result)
    // Track if the receipt was successfully sent
    setReceiptStatus(result.receiptSent)
    setPaymentStep("success")
  }

  const toggleFaq = (id) => {
    setFaqOpen({
      ...faqOpen,
      [id]: !faqOpen[id]
    })
  }

  // Handle manual resending of receipt if it failed initially
  const handleResendReceipt = async () => {
    
    if (!donationResult || !donationResult._id) return;
    
    try {
      const response = await fetch(`${API_URL}/api/donations/${donationResult._id}/resend-receipt`, {
        method: "POST"
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setReceiptStatus(true);
      } else {
        console.error("Failed to resend receipt:", data);
      }
    } catch (error) {
      console.error("Error resending receipt:", error);
    }
  }

  // Helper function to get actual donation amount
  const getActualAmount = () => {
    return selectedAmount === "custom" ? formData.customAmount : selectedAmount
  }

  // Helper function to get fund display name
  const getFundDisplayName = () => {
    switch (selectedFund) {
      case "general": return "Where Most Needed"
      case "medical": return "Emergency Medical Fund"
      case "shelter": return "Shelter Support Program"
      case "rescue": return "Rescue Operations"
      default: return "Spay & Neuter Program"
    }
  }

  const recentDonors = [
    { name: "Sarah J.", amount: "₹100", time: "2 hours ago" },
    { name: "Michael T.", amount: "₹50", time: "4 hours ago" },
    { name: "Anonymous", amount: "₹200", time: "Yesterday" },
    { name: "Emma R.", amount: "₹75", time: "Yesterday" },
    { name: "David K.", amount: "₹150", time: "2 days ago" }
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

  // Render based on the current payment step
  const renderDonationForm = () => {
    if (paymentStep === "details") {
      return (
        <form onSubmit={handleDetailsSubmit}>
          {/* Donation Amount */}
          <div className="mb-8">
            <label className="block text-base-content font-medium mb-3">Select Donation Amount</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
              {["50", "100", "200"].map((amount) => (
                <button
                  key={amount}
                  type="button"
                  className={`btn ${
                    selectedAmount === amount ? "btn-primary" : "btn-outline"
                  } w-full hover:-translate-y-0.5 transition-transform duration-200`}
                  onClick={() => setSelectedAmount(amount)}
                >
                  ₹{amount}
                </button>
              ))}
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Custom Amount (₹)</span>
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
            <p className="text-xs text-base-content/70 mt-2">
              Your email is required to send donation receipt and tax information.
            </p>
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

          {/* Continue to Payment Button */}
          <button
            type="submit"
            className="btn btn-primary btn-lg w-full hover:-translate-y-0.5 transition-transform duration-200"
          >
            <Heart className="mr-2" />
            Continue to Payment
          </button>
        </form>
      )
    } else if (paymentStep === "payment") {
      return (
        <div>
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-bold">Payment Details</h3>
            <button 
              onClick={() => setPaymentStep("details")} 
              className="btn btn-ghost btn-sm"
            >
              ← Back to details
            </button>
          </div>
          
          <div className="bg-base-200/50 p-4 rounded-lg mb-8">
            <div className="flex justify-between mb-2">
              <span>Donation Amount:</span>
              <span className="font-bold">₹{getActualAmount()}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span>Donation Type:</span>
              <span>{isMonthly ? "Monthly recurring" : "One-time"}</span>
            </div>
            <div className="flex justify-between">
              <span>Fund:</span>
              <span>{getFundDisplayName()}</span>
            </div>
          </div>
          
          <Elements stripe={stripePromise}>
            <DonationPaymentForm 
              selectedAmount={selectedAmount}
              isMonthly={isMonthly}
              selectedFund={selectedFund}
              formData={formData}
              onPaymentComplete={handlePaymentComplete}
            />
          </Elements>
        </div>
      )
    } else if (paymentStep === "success") {
      return (
        <div className="text-center py-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-success/20 mb-6">
            <Check className="w-10 h-10 text-success" />
          </div>
          <h2 className="text-2xl font-bold mb-4">Thank You for Your Donation!</h2>
          <p className="text-lg mb-4">
            Your {isMonthly ? "monthly" : "one-time"} donation of ₹{getActualAmount()} has been processed successfully.
          </p>
          
          {/* Email Receipt Status */}
          <div className={`alert ${receiptStatus ? 'alert-success' : 'alert-warning'} mb-6`}>
            <div className="flex items-center">
              {receiptStatus ? (
                <>
                  <Mail className="h-6 w-6 mr-2" />
                  <p>A donation receipt has been sent to <strong>{formData.email}</strong></p>
                </>
              ) : (
                <>
                  <Mail className="h-6 w-6 mr-2" />
                  <div>
                    <p>There was an issue sending your receipt.</p>
                    <button 
                      className="btn btn-sm btn-outline mt-2"
                      onClick={handleResendReceipt}
                    >
                      Resend Receipt
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
          
          <p className="mb-8">
            Your support makes a real difference for animals in need. 
            {isMonthly && " We'll process your monthly donation on this same date each month."}
          </p>
          
          <div className="flex flex-col gap-4 items-center">
            <button className="btn btn-primary" onClick={() => window.location.reload()}>
              Make Another Donation
            </button>
            <Link to="/" className="btn btn-outline">
              Return to Homepage
            </Link>
          </div>
        </div>
      )
    }
  }

  return (
    <div className="min-h-screen bg-base-100">
      {/* Hero Section */}
      <section className="relative bg-base-200 py-28">
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
                    {renderDonationForm()}
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