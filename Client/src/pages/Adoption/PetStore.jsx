import { useState, useEffect } from "react"
import { Heart, Search, X, PawPrint, ArrowRight, FilterIcon, HeartIcon } from "lucide-react"
import { Link } from "react-router-dom"

// Pet Data
// const initialPets = [
//   {
//     id: 1,
//     name: "Buddy",
//     type: "dog",
//     breed: "Labrador Retriever",
//     age: 3,
//     gender: "Male",
//     weight: 55,
//     image: "/api/placeholder/400/300",
//     description: "Friendly and energetic Labrador who loves to play fetch and cuddle.",
//     personality: ["Playful", "Good with kids", "Trained"],
//     specialNeeds: false,
//     adoptionFee: 250,
//   },
//   {
//     id: 2,
//     name: "Whiskers",
//     type: "cat",
//     breed: "Siamese",
//     age: 2,
//     gender: "Female",
//     weight: 10,
//     image: "/api/placeholder/400/300",
//     description: "Elegant Siamese cat with a love for sunbathing and gentle pets.",
//     personality: ["Calm", "Independent", "Affectionate"],
//     specialNeeds: false,
//     adoptionFee: 150,
//   },
//   {
//     id: 3,
//     name: "Hoppy",
//     type: "rabbit",
//     breed: "Holland Lop",
//     age: 1,
//     gender: "Male",
//     weight: 3,
//     image: "/api/placeholder/400/300",
//     description: "Adorable and soft Holland Lop rabbit, perfect for first-time pet owners.",
//     personality: ["Gentle", "Curious", "Playful"],
//     specialNeeds: false,
//     adoptionFee: 100,
//   },
//   {
//     id: 4,
//     name: "Luna",
//     type: "dog",
//     breed: "German Shepherd",
//     age: 4,
//     gender: "Female",
//     weight: 65,
//     image: "/api/placeholder/400/300",
//     description: "Intelligent and loyal German Shepherd looking for an active family.",
//     personality: ["Protective", "Smart", "Trainable"],
//     specialNeeds: false,
//     adoptionFee: 300,
//   },
//   {
//     id: 5,
//     name: "Mittens",
//     type: "cat",
//     breed: "Persian",
//     age: 5,
//     gender: "Female",
//     weight: 12,
//     image: "/api/placeholder/400/300",
//     description: "Regal Persian cat who enjoys quiet environments and gentle attention.",
//     personality: ["Calm", "Elegant", "Low-energy"],
//     specialNeeds: true,
//     adoptionFee: 200,
//   },
// ]

const PetAdoptionStore = () => {
  const [pets, setPets] = useState([])
  const [filteredPets, setFilteredPets] = useState([])
  const [filters, setFilters] = useState({
    type: "",
    minAge: 0,
    maxAge: 20,
    specialNeeds: false,
    search: "",
  })
  const [sortBy, setSortBy] = useState("name")
  const [favorites, setFavorites] = useState([])

  // Filter and Sort Pets
  useEffect(() => {
    const fetchPets = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/pets/get-pet")
        if (!response.ok) {
          throw new Error("Failed to fetch pets")
        }
        const data = await response.json()
        setPets(data)
        setFilteredPets(data)
      } catch (error) {
        console.error("Error fetching pets:", error)
      }
    }

    fetchPets()
  }, [])

  useEffect(() => {
    const result = pets.filter((pet) => {
      const typeMatch = !filters.type || pet.type === filters.type
      const ageMatch = pet.age >= filters.minAge && pet.age <= filters.maxAge
      const specialNeedsMatch = !filters.specialNeeds || pet.specialNeeds
      const searchMatch =
        pet.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        pet.breed.toLowerCase().includes(filters.search.toLowerCase())

      return typeMatch && ageMatch && specialNeedsMatch && searchMatch
    })

    // Sorting
    result.sort((a, b) => {
      switch (sortBy) {
        case "age":
          return a.age - b.age
        case "adoptionFee":
          return a.adoptionFee - b.adoptionFee
        default:
          return a.name.localeCompare(b.name)
      }
    })

    setFilteredPets(result)
  }, [filters, sortBy, pets])

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  const clearFilters = () => {
    setFilters({
      type: "",
      minAge: 0,
      maxAge: 20,
      specialNeeds: false,
      search: "",
    })
    setSortBy("name")
  }

  const toggleFavorite = (petId) => {
    setFavorites((prev) => (prev.includes(petId) ? prev.filter((id) => id !== petId) : [...prev, petId]))
  }

  return (
    <div className="min-h-screen p-8 pt-28">
      <div className="container mx-auto">
        {/* Header */}
        <header className="mb-12 text-center">
          <h1 className="text-5xl font-extrabold text-primary mb-4 flex items-center justify-center">
            <PawPrint className="mr-4 text-blue-500" size={48} />
            Pet Adoption Haven
            <Heart className="ml-4 text-red-500 animate-pulse" size={48} />
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Find your perfect companion and bring love home today!
          </p>
        </header>

        <div className="flex space-x-8">
          {/* Sidebar Filters */}
          <div className="w-1/4 bg-base-200 rounded-2xl shadow-xl p-6 h-fit transition-all duration-300 hover:shadow-2xl">
            <div className="space-y-6">
              {/* Pet Type Filter */}
              <div>
                <label className=" mb-3 font-bold text-gray-700 flex items-center">
                  <FilterIcon className="mr-2 text-blue-500" />
                  Pet Type
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {["dog", "cat", "rabbit"].map((type) => (
                    <button
                      key={type}
                      className={`btn btn-sm w-full transition-all duration-300 
                        ${filters.type === type ? "btn-primary" : "btn-outline"}`}
                      onClick={() => handleFilterChange("type", filters.type === type ? "" : type)}
                    >
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Age Range */}
              <div>
                <label className="block mb-3 font-bold text-gray-700">Age Range</label>
                <div className="space-y-2">
                  <input
                    type="range"
                    min="0"
                    max="20"
                    value={filters.minAge}
                    onChange={(e) => handleFilterChange("minAge", Number(e.target.value))}
                    className="range range-primary"
                  />
                  <input
                    type="range"
                    min="0"
                    max="20"
                    value={filters.maxAge}
                    onChange={(e) => handleFilterChange("maxAge", Number(e.target.value))}
                    className="range range-secondary"
                  />
                  <div className="flex justify-between text-xs px-2 text-gray-600">
                    <span>Min: {filters.minAge}</span>
                    <span>Max: {filters.maxAge}</span>
                  </div>
                </div>
              </div>

              {/* Search */}
              <div>
                <label className=" mb-3 font-bold text-gray-700 flex items-center">
                  <Search className="mr-2 text-blue-500" />
                  Search
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search pets..."
                    className="input input-bordered w-full pl-10 transition-all duration-300"
                    value={filters.search}
                    onChange={(e) => handleFilterChange("search", e.target.value)}
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
              </div>

              {/* Additional Filters */}
              <div className="space-y-2">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="checkbox checkbox-primary"
                    checked={filters.specialNeeds}
                    onChange={(e) => handleFilterChange("specialNeeds", e.target.checked)}
                  />
                  <span>Special Needs Pets</span>
                </label>

                <select
                  className="select select-bordered w-full"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="name">Sort by Name</option>
                  <option value="age">Sort by Age</option>
                  <option value="adoptionFee">Sort by Adoption Fee</option>
                </select>

                <button className="btn btn-ghost w-full flex items-center justify-center" onClick={clearFilters}>
                  <X className="mr-2" /> Clear All Filters
                </button>
              </div>
            </div>
          </div>

          {/* Pet Grid */}
          <div className="w-3/4">
            {filteredPets.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl shadow-lg">
                <p className="text-2xl text-gray-500">No pets match your current filters.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {filteredPets.map((pet) => (
                  <Link
                    to={`/adopt/${pet._id}`}
                    key={pet._id}
                    className="card bg-base-100 rounded-2xl shadow-lg overflow-hidden 
                      transform transition-all duration-300 hover:scale-105 hover:shadow-xl 
                      group relative"
                  >
                    {/* Favorite Button */}
                    <button
                      className={`absolute top-4 right-4 z-10 
                        ${
                          favorites.includes(pet._id)
                            ? "text-error hover:text-error-focus"
                            : "text-base-300 hover:text-error"
                        }`}
                      onClick={(e) => {
                        e.preventDefault()
                        toggleFavorite(pet._id)
                      }}
                    >
                      <HeartIcon
                        className="transition-all duration-300 
                          hover:scale-110 hover:drop-shadow-md"
                        fill={favorites.includes(pet._id) ? "currentColor" : "none"}
                      />
                    </button>

                    <figure className="relative overflow-hidden">
                      <img
                        src={pet.photos && pet.photos.length > 0 ? pet.photos[0] : "/placeholder.svg"}
                        alt={pet.name}
                        className="w-full h-64 object-cover 
                          transition-transform duration-300 
                          group-hover:scale-110"
                      />
                      {pet.specialNeeds && (
                        <div className="absolute top-4 left-4 bg-warning text-warning-content px-2 py-1 rounded-full text-xs">
                          Special Needs
                        </div>
                      )}
                    </figure>

                    <div className="card-body p-6">
                      <h2 className="card-title text-xl font-bold mb-2">{pet.name}</h2>
                      <p className="text-gray-600 mb-4">
                        {pet.breed} • {pet.age} • {pet.gender}
                      </p>
                      <p className="text-gray-500 mb-4 line-clamp-2">{pet.description}</p>

                      <div className="flex justify-between items-center mb-4">
                        <div className="flex space-x-2">
                          {pet.traits &&
                            pet.traits.slice(0, 2).map((trait) => (
                              <span key={trait} className="badge badge-outline hover:bg-blue-50 transition-colors">
                                {trait}
                              </span>
                            ))}
                        </div>
                        {pet.adoptionFee && <div className="font-bold text-primary">${pet.adoptionFee}</div>}
                      </div>

                      <button
                        className="btn btn-primary btn-block group flex items-center justify-center 
                          transition-all duration-300 hover:space-x-4"
                      >
                        View {pet.name}
                        <ArrowRight
                          className="ml-2 transition-transform duration-300 
                            group-hover:translate-x-1"
                        />
                      </button>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default PetAdoptionStore

