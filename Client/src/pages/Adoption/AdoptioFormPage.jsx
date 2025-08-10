import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { User, Home,  PawPrint,  Heart } from "lucide-react"
import { motion } from "framer-motion"
import { toast } from "react-hot-toast"

const AdoptionFormPage = () => {
   const API_URL = import.meta.env.VITE_API_URL;
  const { id } = useParams()
  const navigate = useNavigate()
  const [pet, setPet] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    occupation: "",
    housingType: "apartment",
    ownRent: "own",
    hasChildren: "no",
    childrenAges: "",
    hasPets: "no",
    currentPets: "",
    experience: "",
    reasonForAdopting: "",
    careArrangements: "",
    agreeToTerms: false,
  })

  useEffect(() => {
    const fetchPetDetails = async () => {
      try {
        const response = await fetch(`${API_URL}/api/pets/get-pet/${id}`)
        if (!response.ok) {
          throw new Error("Failed to fetch pet details")
        }
        const data = await response.json()
        setPet(data)
        setLoading(false)
      } catch (error) {
        console.error("Error fetching pet details:", error)
        setLoading(false)
        toast.error("Failed to load pet details")
      }
    }

    fetchPetDetails()
  }, [id])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const handleChildrenChange = (e) => {
    const { value } = e.target
    setFormData((prev) => ({
      ...prev,
      hasChildren: value,
      // Reset children ages if "no" is selected
      childrenAges: value === "no" ? "" : prev.childrenAges,
    }))
  }

  const handlePetsChange = (e) => {
    const { value } = e.target
    setFormData((prev) => ({
      ...prev,
      hasPets: value,
      // Reset current pets if "no" is selected
      currentPets: value === "no" ? "" : prev.currentPets,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validate form
    if (!formData.agreeToTerms) {
      toast.error("Please agree to the terms and conditions")
      return
    }

    try {
      setSubmitting(true)
      
      // Create the adoption request object
      const adoptionRequest = {
        petId: id,
        ...formData
      }

      const response = await fetch(`${API_URL}/api/adoptions/submit-request`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(adoptionRequest),
      })

      if (!response.ok) {
        throw new Error("Failed to submit adoption request")
      }

      toast.success("Adoption request submitted successfully! We'll contact you shortly.")
      // Redirect to pet details page after 2 seconds
      setTimeout(() => {
        navigate(`/pets/${id}`)
      }, 2000)
      
    } catch (error) {
      console.error("Error submitting adoption request:", error)
      toast.error("Failed to submit adoption request. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  if (!pet) {
    return <div className="min-h-screen flex items-center justify-center">Pet not found</div>
  }

  return (
    <div className="min-h-screen bg-base-200 py-12 px-4 sm:px-6 lg:px-8 pt-20">
      <div className="container mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-base-100 shadow-xl rounded-3xl overflow-hidden"
        >
          {/* Header */}
          <div className="p-8 bg-primary text-primary-content">
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 rounded-full overflow-hidden bg-base-100 p-1">
                <img
                  src={pet.photos[0]}
                  alt={pet.name}
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Adopt {pet.name}</h1>
                <p className="opacity-80">
                  {pet.breed} • {pet.age} • {pet.location}
                </p>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="p-8">
            <motion.form
              onSubmit={handleSubmit}
              className="space-y-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              {/* Personal Information */}
              <div>
                <h2 className="text-2xl font-semibold mb-4 flex items-center">
                  <User className="mr-2 text-primary" />
                  Personal Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Full Name</span>
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      placeholder="Enter your full name"
                      className="input input-bordered"
                      required
                    />
                  </div>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Email</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter your email"
                      className="input input-bordered"
                      required
                    />
                  </div>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Phone Number</span>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Enter your phone number"
                      className="input input-bordered"
                      required
                    />
                  </div>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Occupation</span>
                    </label>
                    <input
                      type="text"
                      name="occupation"
                      value={formData.occupation}
                      onChange={handleChange}
                      placeholder="Enter your occupation"
                      className="input input-bordered"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Living Situation */}
              <div>
                <h2 className="text-2xl font-semibold mb-4 flex items-center">
                  <Home className="mr-2 text-primary" />
                  Living Situation
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Full Address</span>
                    </label>
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="Enter your full address"
                      className="textarea textarea-bordered"
                      required
                    ></textarea>
                  </div>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Housing Type</span>
                    </label>
                    <select
                      name="housingType"
                      value={formData.housingType}
                      onChange={handleChange}
                      className="select select-bordered w-full"
                      required
                    >
                      <option value="apartment">Apartment</option>
                      <option value="house">House</option>
                      <option value="townhouse">Townhouse</option>
                      <option value="rural">Rural Property</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Do you own or rent?</span>
                    </label>
                    <select
                      name="ownRent"
                      value={formData.ownRent}
                      onChange={handleChange}
                      className="select select-bordered w-full"
                      required
                    >
                      <option value="own">Own</option>
                      <option value="rent">Rent</option>
                    </select>
                  </div>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Do you have children?</span>
                    </label>
                    <select
                      name="hasChildren"
                      value={formData.hasChildren}
                      onChange={handleChildrenChange}
                      className="select select-bordered w-full"
                      required
                    >
                      <option value="no">No</option>
                      <option value="yes">Yes</option>
                    </select>
                  </div>
                  {formData.hasChildren === "yes" && (
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Children's Ages</span>
                      </label>
                      <input
                        type="text"
                        name="childrenAges"
                        value={formData.childrenAges}
                        onChange={handleChange}
                        placeholder="e.g., 5, 8, 12"
                        className="input input-bordered"
                        required
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Pet Experience */}
              <div>
                <h2 className="text-2xl font-semibold mb-4 flex items-center">
                  <PawPrint className="mr-2 text-primary" />
                  Pet Experience
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Do you currently have pets?</span>
                    </label>
                    <select
                      name="hasPets"
                      value={formData.hasPets}
                      onChange={handlePetsChange}
                      className="select select-bordered w-full"
                      required
                    >
                      <option value="no">No</option>
                      <option value="yes">Yes</option>
                    </select>
                  </div>
                  {formData.hasPets === "yes" && (
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Describe your current pets</span>
                      </label>
                      <textarea
                        name="currentPets"
                        value={formData.currentPets}
                        onChange={handleChange}
                        placeholder="Type, breed, age, temperament"
                        className="textarea textarea-bordered"
                        required
                      ></textarea>
                    </div>
                  )}
                  <div className="form-control md:col-span-2">
                    <label className="label">
                      <span className="label-text">Previous pet experience</span>
                    </label>
                    <textarea
                      name="experience"
                      value={formData.experience}
                      onChange={handleChange}
                      placeholder="Describe your experience with pets"
                      className="textarea textarea-bordered"
                      required
                      rows={3}
                    ></textarea>
                  </div>
                </div>
              </div>

              {/* Adoption Details */}
              <div>
                <h2 className="text-2xl font-semibold mb-4 flex items-center">
                  <Heart className="mr-2 text-primary" />
                  Adoption Details
                </h2>
                <div className="space-y-6">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Reason for adopting {pet.name}</span>
                    </label>
                    <textarea
                      name="reasonForAdopting"
                      value={formData.reasonForAdopting}
                      onChange={handleChange}
                      placeholder={`Why do you want to adopt ${pet.name}?`}
                      className="textarea textarea-bordered"
                      required
                      rows={3}
                    ></textarea>
                  </div>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Care arrangements</span>
                    </label>
                    <textarea
                      name="careArrangements"
                      value={formData.careArrangements}
                      onChange={handleChange}
                      placeholder={`How will you care for ${pet.name}? Include daily routines, exercise plans, and arrangements when you're away.`}
                      className="textarea textarea-bordered"
                      required
                      rows={3}
                    ></textarea>
                  </div>
                </div>
              </div>

              {/* Agreement */}
              <div className="form-control">
                <label className="label cursor-pointer justify-start gap-2">
                  <input
                    type="checkbox"
                    name="agreeToTerms"
                    checked={formData.agreeToTerms}
                    onChange={handleChange}
                    className="checkbox checkbox-primary"
                    required
                  />
                  <span className="label-text">
                    I agree to home visits, follow-up checks, and understand that providing false information may result in my application being rejected.
                  </span>
                </label>
              </div>

              {/* Submit Button */}
              <div className="pt-6">
                <button
                  type="submit"
                  className={`btn btn-primary btn-lg w-full font-bold py-4 rounded-full text-lg transition-all duration-300 transform hover:scale-105 ${
                    submitting ? "loading" : ""
                  }`}
                  disabled={submitting}
                >
                  {submitting ? "Submitting..." : `Submit Application for ${pet.name}`}
                </button>
              </div>
            </motion.form>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default AdoptionFormPage