import { useState } from "react"
import { X, PlusCircle, Upload, PawPrint, ChevronRight, ChevronLeft, Camera, UserCircle, FileCheck } from "lucide-react"
import axios from "axios" // Make sure axios is installed and imported

const EnhancedPetRehomingForm = () => {
  const [step, setStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState("")
  const [submitSuccess, setSubmitSuccess] = useState(false)
  
  // Pet details
  const [petFormData, setPetFormData] = useState({
    name: "",
    age: "",
    location: "",
    weight: "",
    breed: "",
    gender: "",
    description: "",
    traits: [],
    characteristics: [],
    photos: [],
  })
  
  // Owner details
  const [ownerFormData, setOwnerFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    reason: "",
    acceptTerms: false
  })
  
  const [currentTrait, setCurrentTrait] = useState("")
  const [currentCharacteristic, setCurrentCharacteristic] = useState("")

  const handlePetChange = (e) => {
    const { name, value } = e.target
    setPetFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }))
  }
  
  const handleOwnerChange = (e) => {
    const { name, value, type, checked } = e.target
    setOwnerFormData((prevState) => ({
      ...prevState,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files)
    if (petFormData.photos.length + files.length > 5) {
      alert("You can only upload up to 5 photos")
      return
    }
    
    setPetFormData((prevState) => ({
      ...prevState,
      photos: [...prevState.photos, ...files],
    }))
  }

  const addItem = (type) => {
    const currentValue = type === "traits" ? currentTrait : currentCharacteristic
    const currentSetter = type === "traits" ? setCurrentTrait : setCurrentCharacteristic

    if (currentValue && !petFormData[type].includes(currentValue)) {
      if (petFormData[type].length >= 5) {
        alert(`You can only add up to 5 ${type}`)
        return
      }
      setPetFormData((prevState) => ({
        ...prevState,
        [type]: [...prevState[type], currentValue],
      }))
      currentSetter("")
    } else if (petFormData[type].includes(currentValue)) {
      alert(`This ${type.slice(0, -1)} has already been added`)
    } else {
      alert(`Please enter a valid ${type.slice(0, -1)}`)
    }
  }

  const removeItem = (type, itemToRemove) => {
    setPetFormData((prevState) => ({
      ...prevState,
      [type]: prevState[type].filter((item) => item !== itemToRemove),
    }))
  }
  
  const validatePetDetails = () => {
    const errors = []
    if (!petFormData.name.trim()) errors.push("Pet name is required")
    if (!petFormData.age.trim()) errors.push("Pet age is required")
    if (!petFormData.location.trim()) errors.push("Location is required")
    if (!petFormData.weight.trim()) errors.push("Weight is required")
    if (!petFormData.breed.trim()) errors.push("Breed is required")
    if (!petFormData.gender) errors.push("Gender is required")
    if (!petFormData.description.trim()) errors.push("Description is required")
    if (petFormData.traits.length === 0) errors.push("At least one trait is required")
    if (petFormData.characteristics.length === 0) errors.push("At least one characteristic is required")
    if (petFormData.photos.length === 0) errors.push("At least one photo is required")
    
    return errors
  }
  
  const validateOwnerDetails = () => {
    const errors = []
    if (!ownerFormData.fullName.trim()) errors.push("Full name is required")
    if (!ownerFormData.email.trim()) errors.push("Email is required")
    if (!ownerFormData.phone.trim()) errors.push("Phone number is required")
    if (!ownerFormData.address.trim()) errors.push("Address is required")
    if (!ownerFormData.reason.trim()) errors.push("Reason for rehoming is required")
    if (!ownerFormData.acceptTerms) errors.push("You must accept the terms and conditions")
    
    return errors
  }

  const nextStep = () => {
    if (step === 1) {
      const errors = validatePetDetails()
      if (errors.length > 0) {
        alert(errors.join("\n"))
        return
      }
    }
    
    setStep(step + 1)
  }

  const prevStep = () => {
    setStep(step - 1)
  }

  const showToast = (message, isSuccess = true) => {
    // Create toast element
    const toast = document.createElement("div")
    toast.className = `fixed top-4 right-4 p-4 rounded-lg shadow-lg ${
      isSuccess ? "bg-green-500" : "bg-red-500"
    } text-white font-bold z-50 flex items-center justify-between min-w-[300px]`
    
    // Add message and close button
    toast.innerHTML = `
      <span>${message}</span>
      <button class="ml-4 hover:text-gray-200">✕</button>
    `
    
    // Add to document
    document.body.appendChild(toast)
    
    // Add event listener to close button
    toast.querySelector("button").addEventListener("click", () => {
      document.body.removeChild(toast)
    })
    
    // Auto remove after 5 seconds
    setTimeout(() => {
      if (document.body.contains(toast)) {
        document.body.removeChild(toast)
      }
    }, 5000)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    const petErrors = validatePetDetails()
    const ownerErrors = validateOwnerDetails()
    
    if (petErrors.length > 0 || ownerErrors.length > 0) {
      alert([...petErrors, ...ownerErrors].join("\n"))
      return
    }

    setIsSubmitting(true)
    setSubmitMessage("")

    try {
      // Create FormData object to send both text fields and files
      const formData = new FormData()
      
      // Add pet details
      formData.append("name", petFormData.name)
      formData.append("age", petFormData.age)
      formData.append("location", petFormData.location)
      formData.append("weight", petFormData.weight)
      formData.append("breed", petFormData.breed)
      formData.append("gender", petFormData.gender)
      formData.append("description", petFormData.description)
      
      // Add traits and characteristics as JSON strings
      formData.append("traits", JSON.stringify(petFormData.traits))
      formData.append("characteristics", JSON.stringify(petFormData.characteristics))
      
      // Add photos
      petFormData.photos.forEach((photo, index) => {
        formData.append(`photo${index}`, photo)
      })
      
      // Add owner details
      formData.append("fullName", ownerFormData.fullName)
      formData.append("email", ownerFormData.email)
      formData.append("phone", ownerFormData.phone)
      formData.append("address", ownerFormData.address)
      formData.append("reason", ownerFormData.reason)
      
      // Make API call using axios - use the correct endpoint path
      // This fix ensures we're using the correct endpoint that matches your backend routes
      const response = await axios.post("http://localhost:3000/api/pets/post-pet", formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      
      // Check if the request was successful
      if (response.status === 201) {
        // Show success toast message
        showToast("Pet added successfully!", true)
        
        setSubmitSuccess(true)
        setSubmitMessage("Pet rehoming request submitted successfully!")
        
        // Reset form after successful submission
        setPetFormData({
          name: "",
          age: "",
          location: "",
          weight: "",
          breed: "",
          gender: "",
          description: "",
          traits: [],
          characteristics: [],
          photos: [],
        })
        
        setOwnerFormData({
          fullName: "",
          email: "",
          phone: "",
          address: "",
          reason: "",
          acceptTerms: false
        })
        
        setStep(1)
      }
    } catch (error) {
      console.error("Error submitting form:", error)
      
      // Show error toast message with more details
      const errorMessage = error.response?.data?.message || "Failed to submit pet rehoming request. Please try again.";
      showToast(errorMessage, false)
      
      setSubmitMessage(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Render pet details step
  const renderPetDetailsStep = () => (
    <>
      <div className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="form-control">
            <label className="label">
              <span className="label-text">Pet Name</span>
            </label>
            <input
              type="text"
              name="name"
              value={petFormData.name}
              onChange={handlePetChange}
              required
              className="input input-bordered w-full"
              placeholder="Enter pet's name"
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Age</span>
            </label>
            <input
              type="text"
              name="age"
              value={petFormData.age}
              onChange={handlePetChange}
              required
              className="input input-bordered w-full"
              placeholder="Pet's age (e.g., 3 years)"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="form-control">
            <label className="label">
              <span className="label-text">Location</span>
            </label>
            <input
              type="text"
              name="location"
              value={petFormData.location}
              onChange={handlePetChange}
              required
              className="input input-bordered w-full"
              placeholder="City, State"
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Weight</span>
            </label>
            <input
              type="text"
              name="weight"
              value={petFormData.weight}
              onChange={handlePetChange}
              required
              className="input input-bordered w-full"
              placeholder="Weight (e.g., 10 lbs)"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="form-control">
            <label className="label">
              <span className="label-text">Breed</span>
            </label>
            <input
              type="text"
              name="breed"
              value={petFormData.breed}
              onChange={handlePetChange}
              required
              className="input input-bordered w-full"
              placeholder="Pet's breed"
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Gender</span>
            </label>
            <select
              name="gender"
              value={petFormData.gender}
              onChange={handlePetChange}
              required
              className="select select-bordered w-full"
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text">Description</span>
          </label>
          <textarea
            name="description"
            value={petFormData.description}
            onChange={handlePetChange}
            required
            className="textarea textarea-bordered w-full"
            rows="4"
            placeholder="Tell us about your pet's personality, habits, and special needs"
          ></textarea>
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text">Pet Traits</span>
          </label>
          <div className="flex items-center mb-4">
            <input
              type="text"
              value={currentTrait}
              onChange={(e) => setCurrentTrait(e.target.value)}
              className="input input-bordered flex-grow rounded-r-none"
              placeholder="Add a trait (e.g., friendly, playful)"
            />
            <button type="button" onClick={() => addItem("traits")} className="btn btn-primary rounded-l-none">
              <PlusCircle className="w-5 h-5" />
            </button>
          </div>
          <div className="flex flex-wrap gap-2 mb-4">
            {petFormData.traits.map((trait, index) => (
              <span key={index} className="badge badge-primary badge-lg">
                {trait}
                <button
                  type="button"
                  onClick={() => removeItem("traits", trait)}
                  className="ml-2 text-primary-content hover:text-error"
                >
                  <X className="w-4 h-4" />
                </button>
              </span>
            ))}
          </div>
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text">Characteristics</span>
          </label>
          <div className="flex items-center mb-4">
            <input
              type="text"
              value={currentCharacteristic}
              onChange={(e) => setCurrentCharacteristic(e.target.value)}
              className="input input-bordered flex-grow rounded-r-none"
              placeholder="Add a characteristic (e.g., good with kids)"
            />
            <button
              type="button"
              onClick={() => addItem("characteristics")}
              className="btn btn-secondary rounded-l-none"
            >
              <PlusCircle className="w-5 h-5" />
            </button>
          </div>
          <div className="flex flex-wrap gap-2 mb-4">
            {petFormData.characteristics.map((characteristic, index) => (
              <span key={index} className="badge badge-secondary badge-lg">
                {characteristic}
                <button
                  type="button"
                  onClick={() => removeItem("characteristics", characteristic)}
                  className="ml-2 text-secondary-content hover:text-error"
                >
                  <X className="w-4 h-4" />
                </button>
              </span>
            ))}
          </div>
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text">Pet Photos</span>
          </label>
          
          {/* Photo upload area */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-4">
            {/* Existing photos */}
            {petFormData.photos.map((photo, index) => (
              <div key={index} className="card bg-base-200 shadow-lg overflow-hidden">
                <figure className="relative h-48">
                  <img
                    src={URL.createObjectURL(photo)}
                    alt={`Pet photo ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeItem("photos", photo)}
                    className="absolute top-2 right-2 btn btn-circle btn-sm btn-error"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </figure>
                <div className="card-body p-3">
                  <p className="text-sm text-center">Photo {index + 1}</p>
                </div>
              </div>
            ))}
            
            {/* Upload new photo card (if less than 5 photos) */}
            {petFormData.photos.length < 5 && (
              <div className="card bg-base-200 shadow-lg overflow-hidden">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                  id="photo-upload"
                />
                <label 
                  htmlFor="photo-upload" 
                  className="h-48 flex flex-col items-center justify-center cursor-pointer hover:bg-base-300 transition-colors"
                >
                  <Camera className="w-12 h-12 text-base-content/60 mb-2" />
                  <p className="text-base-content/60 text-center px-4">Add Photo</p>
                </label>
                <div className="card-body p-3">
                  <p className="text-sm text-center">Upload Photo</p>
                </div>
              </div>
            )}
          </div>
          
          <p className="text-sm text-base-content/70 text-center">Upload up to 5 photos of your pet (PNG or JPEG)</p>
        </div>
      </div>
      
      <div className="mt-8 flex justify-end">
        <button type="button" onClick={nextStep} className="btn btn-primary btn-lg">
          Proceed Further <ChevronRight className="w-5 h-5 ml-1" />
        </button>
      </div>
    </>
  )
  
  // Render owner details step
  const renderOwnerDetailsStep = () => (
    <>
      <div className="space-y-6">
        <div className="bg-primary/10 rounded-lg p-4 mb-6">
          <h3 className="font-bold text-lg mb-2 flex items-center">
            <UserCircle className="w-5 h-5 mr-2" /> Owner Information
          </h3>
          <p className="text-sm">Please provide your contact details so potential adopters can reach you.</p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="form-control">
            <label className="label">
              <span className="label-text">Full Name</span>
            </label>
            <input
              type="text"
              name="fullName"
              value={ownerFormData.fullName}
              onChange={handleOwnerChange}
              required
              className="input input-bordered w-full"
              placeholder="Your full name"
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Email Address</span>
            </label>
            <input
              type="email"
              name="email"
              value={ownerFormData.email}
              onChange={handleOwnerChange}
              required
              className="input input-bordered w-full"
              placeholder="Your email address"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="form-control">
            <label className="label">
              <span className="label-text">Phone Number</span>
            </label>
            <input
              type="tel"
              name="phone"
              value={ownerFormData.phone}
              onChange={handleOwnerChange}
              required
              className="input input-bordered w-full"
              placeholder="Your phone number"
            />
          </div>
          
          <div className="form-control">
            <label className="label">
              <span className="label-text">Address</span>
            </label>
            <input
              type="text"
              name="address"
              value={ownerFormData.address}
              onChange={handleOwnerChange}
              required
              className="input input-bordered w-full"
              placeholder="Your address"
            />
          </div>
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text">Reason for Rehoming</span>
          </label>
          <textarea
            name="reason"
            value={ownerFormData.reason}
            onChange={handleOwnerChange}
            required
            className="textarea textarea-bordered w-full"
            rows="4"
            placeholder="Please explain why you need to find a new home for your pet"
          ></textarea>
        </div>
        
        <div className="bg-warning/10 rounded-lg p-6 border border-warning/30">
          <h3 className="font-bold text-lg mb-3 flex items-center">
            <FileCheck className="w-5 h-5 mr-2" /> Terms and Conditions
          </h3>
          <div className="text-sm mb-4 space-y-2">
            <p>By submitting this form, you agree to the following terms:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>All information provided is accurate and truthful</li>
              <li>You are the legal owner of the pet being rehomed</li>
              <li>You understand that we will share your contact information with potential adopters</li>
              <li>You will participate in our screening process to ensure the pet goes to a suitable home</li>
              <li>You will be available to answer questions about your pet from interested adopters</li>
            </ul>
          </div>
          <div className="form-control">
            <label className="label cursor-pointer justify-start gap-2">
              <input 
                type="checkbox" 
                name="acceptTerms"
                checked={ownerFormData.acceptTerms}
                onChange={handleOwnerChange}
                className="checkbox checkbox-primary" 
              />
              <span className="label-text">I accept the terms and conditions</span>
            </label>
          </div>
        </div>
      </div>
      
      <div className="mt-8 flex justify-between">
        <button type="button" onClick={prevStep} className="btn btn-outline btn-lg">
          <ChevronLeft className="w-5 h-5 mr-1" /> Back
        </button>
        <button type="button" onClick={nextStep} className="btn btn-primary btn-lg">
          Proceed Further <ChevronRight className="w-5 h-5 ml-1" />
        </button>
      </div>
    </>
  )
  
  // Render confirmation step
  const renderConfirmationStep = () => (
    <div className="text-center py-12">
      <h3 className="text-2xl font-bold mb-6">Are you ready to submit your rehoming request?</h3>
      <div className="bg-base-200 p-6 rounded-lg mb-8 max-w-lg mx-auto">
        <h4 className="font-bold text-lg mb-4">Review your information:</h4>
        
        <div className="mb-4">
          <h5 className="font-semibold">Pet Details</h5>
          <p className="text-sm">Name: {petFormData.name}</p>
          <p className="text-sm">Breed: {petFormData.breed}</p>
          <p className="text-sm">Age: {petFormData.age}</p>
        </div>
        
        <div>
          <h5 className="font-semibold">Owner Details</h5>
          <p className="text-sm">Name: {ownerFormData.fullName}</p>
          <p className="text-sm">Email: {ownerFormData.email}</p>
          <p className="text-sm">Phone: {ownerFormData.phone}</p>
        </div>
      </div>
      
      {submitSuccess && (
        <div className="alert alert-success mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <span>{submitMessage}</span>
        </div>
      )}
      
      <div className="flex justify-center gap-4">
        <button 
          type="button" 
          onClick={prevStep} 
          className="btn btn-outline btn-lg"
        >
          Go Back
        </button>
        <button 
          type="submit" 
          className="btn btn-primary btn-lg"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Submitting..." : "Submit Rehoming Request"}
        </button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center p-6 pt-16 pb-16 mt-16">
      <div className="w-full max-w-4xl bg-base-100 shadow-xl rounded-3xl overflow-hidden transition-all duration-300 hover:shadow-2xl">
        <div className="bg-primary p-6">
          <h2 className="text-4xl font-extrabold text-primary-content text-center">
            <span>
              <PawPrint className="inline-block w-10 h-10 items-center justify-center" />{" "}
            </span>
            Find a New Home for Your Pet
          </h2>
        </div>
        
        {/* Progress indicator */}
        <div className="p-4 bg-base-200 flex justify-center">
          <ul className="steps">
            <li className={`step ${step >= 1 ? "step-primary" : ""}`}>Pet Details</li>
            <li className={`step ${step >= 2 ? "step-primary" : ""}`}>Owner Information</li>
            <li className={`step ${step >= 3 ? "step-primary" : ""}`}>Confirmation</li>
          </ul>
        </div>

        <form onSubmit={handleSubmit} className="p-8">
          {step === 1 && renderPetDetailsStep()}
          {step === 2 && renderOwnerDetailsStep()}
          {step === 3 && renderConfirmationStep()}
        </form>
      </div>
    </div>
  )
}

export default EnhancedPetRehomingForm