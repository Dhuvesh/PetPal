import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import { Heart, MapPin, Weight, Ruler, ArrowLeft, ArrowRight, PawPrint, Calendar, User } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

const PetDetailsPage = () => {
  const { id } = useParams()
  const [pet, setPet] = useState(null)
  const [loading, setLoading] = useState(true)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isLiked, setIsLiked] = useState(false)

  useEffect(() => {
    const fetchPetDetails = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/pets/get-pet/${id}`)
        if (!response.ok) {
          throw new Error("Failed to fetch pet details")
        }
        const data = await response.json()
        setPet(data)
        setLoading(false)
      } catch (error) {
        console.error("Error fetching pet details:", error)
        setLoading(false)
      }
    }

    fetchPetDetails()
  }, [id])

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  if (!pet) {
    return <div className="min-h-screen flex items-center justify-center">Pet not found</div>
  }

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % pet.photos.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? pet.photos.length - 1 : prev - 1))
  }

  return (
    <div className="min-h-screen bg-base-200 py-12 px-4 sm:px-6 lg:px-8 pt-20   ">
      <div className="container mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-base-100 shadow-xl rounded-3xl overflow-hidden"
        >
          {/* Image Slider */}
          <div className="relative h-[500px] sm:h-[600px] overflow-hidden ">
            <AnimatePresence initial={false}>
              <motion.img
                key={currentImageIndex}
                src={pet.photos[currentImageIndex]}
                alt={`${pet.name} - Photo ${currentImageIndex + 1}`}
                className="w-full h-full object-contain"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              />
            </AnimatePresence>

            {/* Slider Controls */}
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 
                         bg-base-100/80 hover:bg-base-100 p-3 rounded-full shadow-lg 
                         transition-all duration-300 group focus:outline-none focus:ring-2 focus:ring-primary"
              aria-label="Previous image"
            >
              <ArrowLeft className="text-base-content group-hover:text-primary transition-colors" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 
                         bg-base-100/80 hover:bg-base-100 p-3 rounded-full shadow-lg 
                         transition-all duration-300 group focus:outline-none focus:ring-2 focus:ring-primary"
              aria-label="Next image"
            >
              <ArrowRight className="text-base-content group-hover:text-primary transition-colors" />
            </button>

            {/* Image Indicators */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
              {pet.photos.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary
                    ${index === currentImageIndex ? "bg-primary scale-125" : "bg-base-300 hover:bg-primary-focus"}`}
                  aria-label={`Go to image ${index + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Pet Details */}
          <div className="p-8 sm:p-10">
            <div className="flex justify-between items-center mb-6">
              <motion.h1
                className="text-4xl sm:text-5xl font-bold text-base-content"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                {pet.name}
              </motion.h1>
              <motion.button
                className={`text-error hover:text-error-focus transition-colors focus:outline-none focus:ring-2 focus:ring-error rounded-full p-2`}
                onClick={() => setIsLiked(!isLiked)}
                whileTap={{ scale: 0.9 }}
                aria-label={isLiked ? "Unlike" : "Like"}
              >
                <Heart
                  size={32}
                  className={`${isLiked ? "fill-current" : "stroke-current"} transition-all duration-300`}
                />
              </motion.button>
            </div>

            {/* Basic Info Grid */}
            <motion.div
              className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              {[
                { icon: Calendar, label: "Age", value: pet.age },
                { icon: Weight, label: "Weight", value: pet.weight },
                { icon: PawPrint, label: "Breed", value: pet.breed },
                { icon: MapPin, label: "Location", value: pet.location },
                { icon: Ruler, label: "Size", value: "Large" },
                { icon: User, label: "Gender", value: pet.gender },
              ].map((item, index) => (
                <div
                  key={index}
                  className="bg-base-200 p-4 rounded-xl flex items-center space-x-3 transition-all duration-300 hover:bg-base-300 hover:shadow-md"
                >
                  <item.icon className="text-primary" size={24} />
                  <div>
                    <p className="text-sm text-base-content/70">{item.label}</p>
                    <p className="font-semibold text-base-content">{item.value}</p>
                  </div>
                </div>
              ))}
            </motion.div>

            {/* Description */}
            <motion.div
              className="mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <h2 className="text-2xl font-semibold mb-3 text-base-content">About {pet.name}</h2>
              <p className="text-base-content/70 leading-relaxed">{pet.description}</p>
            </motion.div>

            {/* Traits and Characteristics */}
            <motion.div
              className="grid sm:grid-cols-2 gap-6 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              <div>
                <h3 className="text-xl font-semibold mb-3 text-base-content">Traits</h3>
                <div className="flex flex-wrap gap-2">
                  {pet.traits.map((trait, index) => (
                    <span
                      key={index}
                      className="bg-primary/20 text-primary px-3 py-1 rounded-full text-sm transition-all duration-300 hover:bg-primary/30 hover:shadow-md"
                    >
                      {trait}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-3 text-base-content">Characteristics</h3>
                <div className="flex flex-wrap gap-2">
                  {pet.characteristics.map((char, index) => (
                    <span
                      key={index}
                      className="bg-secondary/20 text-secondary px-3 py-1 rounded-full text-sm transition-all duration-300 hover:bg-secondary/30 hover:shadow-md"
                    >
                      {char}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Adoption Button */}
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              <button className="btn btn-primary btn-lg font-bold py-4 px-8 rounded-full text-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50">
                Adopt {pet.name}
              </button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default PetDetailsPage

