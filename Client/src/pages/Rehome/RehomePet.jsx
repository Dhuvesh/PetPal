import { useState } from "react"
import { X, PlusCircle, Upload, PawPrint } from "lucide-react"
import { axiosInstance } from "../../lib/axios"
import { Toaster, toast } from "react-hot-toast"

const PetRehomingForm = () => {
  const [formData, setFormData] = useState({
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

  const [currentTrait, setCurrentTrait] = useState("")
  const [currentCharacteristic, setCurrentCharacteristic] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState("")

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }))
  }

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files)
    setFormData((prevState) => ({
      ...prevState,
      photos: [...prevState.photos, ...files],
    }))
  }

  const addItem = (type) => {
    const currentValue = type === "traits" ? currentTrait : currentCharacteristic
    const currentSetter = type === "traits" ? setCurrentTrait : setCurrentCharacteristic

    if (currentValue && !formData[type].includes(currentValue)) {
      if (formData[type].length >= 5) {
        toast.error(`You can only add up to 5 ${type}`)
        return
      }
      setFormData((prevState) => ({
        ...prevState,
        [type]: [...prevState[type], currentValue],
      }))
      currentSetter("")
      toast.success(`${type.slice(0, -1)} added successfully`)
    } else if (formData[type].includes(currentValue)) {
      toast.error(`This ${type.slice(0, -1)} has already been added`)
    } else {
      toast.error(`Please enter a valid ${type.slice(0, -1)}`)
    }
  }

  const removeItem = (type, itemToRemove) => {
    setFormData((prevState) => ({
      ...prevState,
      [type]: prevState[type].filter((item) => item !== itemToRemove),
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validate all fields
    const errors = []
    if (!formData.name.trim()) errors.push("Pet name is required")
    if (!formData.age.trim()) errors.push("Pet age is required")
    if (!formData.location.trim()) errors.push("Location is required")
    if (!formData.weight.trim()) errors.push("Weight is required")
    if (!formData.breed.trim()) errors.push("Breed is required")
    if (!formData.gender) errors.push("Gender is required")
    if (!formData.description.trim()) errors.push("Description is required")
    if (formData.traits.length === 0) errors.push("At least one trait is required")
    if (formData.characteristics.length === 0) errors.push("At least one characteristic is required")
    if (formData.photos.length === 0) errors.push("At least one photo is required")

    if (errors.length > 0) {
      errors.forEach((error) => toast.error(error))
      return
    }

    setIsSubmitting(true)
    setSubmitMessage("")

    try {
      const formDataToSend = new FormData()

      // Append all text fields
      Object.keys(formData).forEach((key) => {
        if (key !== "photos" && key !== "traits" && key !== "characteristics") {
          formDataToSend.append(key, formData[key])
        }
      })

      // Append arrays as JSON strings
      formDataToSend.append("traits", JSON.stringify(formData.traits))
      formDataToSend.append("characteristics", JSON.stringify(formData.characteristics))

      // Append each photo
      formData.photos.forEach((photo, index) => {
        formDataToSend.append(`photo${index}`, photo)
      })

      const response = await axiosInstance.post("/pets/post-pet", formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })

      toast.success("Pet rehoming request submitted successfully!")
      console.log(response.data)
      // Reset form after successful submission
      setFormData({
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
    } catch (error) {
      console.error("Error submitting form:", error)
      if (error.response && error.response.data) {
        if (error.response.data.errors) {
          error.response.data.errors.forEach((err) => toast.error(err))
        } else {
          toast.error(error.response.data.message || "Failed to submit pet rehoming request")
        }
      } else {
        toast.error("Failed to submit pet rehoming request. Please try again.")
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center p-6 pt-20">
      {/* <Toaster position="top-right" toastOptions={{ duration: 4000 }} /> */}
      <div className="w-full max-w-3xl bg-base-100 shadow-xl rounded-3xl overflow-hidden transition-all duration-300 hover:shadow-2xl">
        <div className="bg-primary p-6">
          <h2 className="text-4xl font-extrabold text-primary-content text-center">
            <span>
              <PawPrint className="inline-block w-10 h-10 items-center justify-center" />{" "}
            </span>
            Find a New Home for Your Pet
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Pet Name</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
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
                value={formData.age}
                onChange={handleChange}
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
                value={formData.location}
                onChange={handleChange}
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
                value={formData.weight}
                onChange={handleChange}
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
                value={formData.breed}
                onChange={handleChange}
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
                value={formData.gender}
                onChange={handleChange}
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
              value={formData.description}
              onChange={handleChange}
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
              {formData.traits.map((trait, index) => (
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
              {formData.characteristics.map((characteristic, index) => (
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
              <span className="label-text">Upload Photos</span>
            </label>
            <div className="border-2 border-dashed border-base-300 rounded-lg p-6 text-center">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                id="photo-upload"
              />
              <label htmlFor="photo-upload" className="cursor-pointer flex flex-col items-center justify-center">
                <Upload className="w-12 h-12 text-base-content mb-4" />
                <p className="text-base-content mb-2">Drag and drop or click to upload photos</p>
                <p className="text-sm text-base-content/70">(Maximum 5 photos, PNG or JPEG)</p>
              </label>
            </div>
            {formData.photos.length > 0 && (
              <div className="flex flex-wrap gap-4 mt-4">
                {formData.photos.map((photo, index) => (
                  <div key={index} className="relative w-32 h-32 rounded-lg overflow-hidden shadow-md">
                    <img
                      src={URL.createObjectURL(photo) || "/placeholder.svg"}
                      alt={`Pet photo ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeItem("photos", photo)}
                      className="absolute top-2 right-2 btn btn-circle btn-xs btn-error"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="text-center mt-8">
            <button type="submit" className="btn btn-primary btn-lg" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit Rehoming Request"}
            </button>
          </div>

          {submitMessage && (
            <div
              className={`mt-4 p-4 rounded ${submitMessage.includes("successfully") ? "bg-success text-success-content" : "bg-error text-error-content"}`}
            >
              {submitMessage}
            </div>
          )}
        </form>
      </div>
    </div>
  )
}

export default PetRehomingForm

