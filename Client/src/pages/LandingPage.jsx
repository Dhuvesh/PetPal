import { useState, useEffect, useMemo } from "react"
import {
  PawPrint,
  Dog,
  Cat,
  Heart,
  MapPin,
  Rabbit,
  Home,
  Stethoscope,
  ArrowRight,
  Shield,
  Clock,
  Globe,
  Building,
  Star,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Search,
  FileText,
  PhoneCall,
  Check,
  MessageCircle,
  Send,
  Circle,
  Zap,
  Weight,
  Sparkles,
  HandHeart,
  Users,
  CalendarCheck,
  ClipboardList,
  Stamp,
  Syringe,
  CalendarClock,
  FileHeart,
  HeartIcon,
  FilterIcon,
  Navigation,
} from "lucide-react"
import { Link } from "react-router-dom"

const DUMMY_PETS = [
  {
    _id: "dummy-dog-1",
    name: "Buddy",
    species: "dog",
    breed: "Golden Retriever",
    age: "3 years",
    location: "Portland, OR",
    weight: "28 kg",
    photo: "https://images.unsplash.com/photo-1552053831-71594a27632d?w=800&q=80",
    description:
      "Buddy greets every person like they're the best part of his day. Gentle with kids, endlessly patient, and always up for a walk in the park.",
    traits: ["Affectionate", "Great with kids", "Well-trained"],
  },
  {
    
    name: "Luna",
    species: "cat",
    breed: "British Shorthair",
    age: "2 years",
    location: "Austin, TX",
    weight: "4.5 kg",
    photo: "https://images.unsplash.com/photo-1533738363-b7f9aef128ce?w=800&q=80",
    description:
      "Luna is equal parts elegant and silly — she'll nap in a sunbeam for hours, then chase a feather toy like her life depends on it. A calm, loving presence in any home.",
    traits: ["Calm & cuddly", "Litter trained", "Loves laps"],
  },
  {
    
    name: "Coco",
    species: "rabbit",
    breed: "Holland Lop",
    age: "1 year",
    location: "Denver, CO",
    weight: "1.8 kg",
    photo: "https://www.orangepet.in/cdn/shop/articles/close-up-rabbit-field_1024x.jpg?v=1763017572",
    description:
      "Coco is a gentle little bundle of curiosity, perfect for a quiet, loving household. She'll happily hop over for head scratches the moment you sit down.",
    traits: ["Gentle", "Easy first pet", "Loves attention"],
  },
]

const typeIcon = (type) => {
  switch (type) {
    case "dog":
      return <Dog className="w-4 h-4" />
    case "cat":
      return <Cat className="w-4 h-4" />
    case "rabbit":
      return <Rabbit className="w-4 h-4" />
    default:
      return <PawPrint className="w-4 h-4" />
  }
}

const LandingPage = () => {
  const [selectedPetType, setSelectedPetType] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [animatedPets, setAnimatedPets] = useState([])

  useEffect(() => {
    const petIcons = [
      { icon: <Dog className="w-16 h-16 text-primary animate-bounce" />, delay: 100 },
      { icon: <Dog className="w-16 h-16 text-primary animate-bounce" />, delay: 100 },
      { icon: <Dog className="w-16 h-16 text-primary animate-bounce" />, delay: 100 },
      { icon: <Dog className="w-16 h-16 text-primary animate-bounce" />, delay: 100 },
      { icon: <Cat className="w-16 h-16 text-secondary animate-bounce" />, delay: 300 },
      { icon: <Cat className="w-16 h-16 text-secondary animate-bounce" />, delay: 300 },
      { icon: <Cat className="w-16 h-16 text-secondary animate-bounce" />, delay: 300 },
      { icon: <Rabbit className="w-16 h-16 text-accent animate-bounce" />, delay: 500 },
      { icon: <Rabbit className="w-16 h-16 text-accent animate-bounce" />, delay: 500 },
      { icon: <Rabbit className="w-16 h-16 text-accent animate-bounce" />, delay: 500 },
    ]
    setAnimatedPets(petIcons)
  }, [])


  const filteredPets = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()
    return DUMMY_PETS.filter((pet) => {
      const matchesType = selectedPetType === "all" || pet.species === selectedPetType
      const matchesQuery =
        !query ||
        pet.name.toLowerCase().includes(query) ||
        pet.breed.toLowerCase().includes(query) ||
        pet.location.toLowerCase().includes(query)
      return matchesType && matchesQuery
    })
  }, [selectedPetType, searchQuery])

  return (
    <div className="min-h-screen bg-base-100">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-base-200 min-h-screen flex items-center">
        <div className="absolute inset-0 overflow-hidden opacity-10">
          {animatedPets.map((pet, index) => (
            <div
              key={index}
              className="absolute animate-pet-float"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${pet.delay}ms`,
              }}
            >
              {pet.icon}
            </div>
          ))}
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-extrabold text-base-content mb-8 relative">
              <span className="block transform transition-all duration-500 hover:scale-105 hover:text-primary">
                Find Your
                <span className="text-primary ml-3 inline-block">
                  Perfect Pet
                  <Heart className="inline-block ml-2 text-error animate-pulse" />
                </span>
              </span>
            </h1>
            <p className="max-w-3xl mx-auto text-xl text-base-content/70 mb-10 typing-animation">
              Connecting Loving Pets with Caring Families - Your Journey Starts Here
            </p>
            <div className="flex justify-center space-x-5">
              <Link to="/adopt">
                <button className="btn btn-primary btn-lg hover:-translate-y-0.5 transition-transform duration-200">
                  <PawPrint className="mr-2" />
                  Explore Pets
                </button>
              </Link>
              <Link to="/rehome">
                <button className="btn btn-outline btn-lg btn-primary hover:-translate-y-0.5 transition-transform duration-200">
                  Rehome a Pet
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Pets Section — static showcase pets */}
      <section className="py-16 bg-base-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-4 text-base-content">Meet Some of Our Beautiful Pets</h2>
          <p className="text-center text-base-content/60 mb-10 max-w-2xl mx-auto">
            Every pet deserves a loving home — and every adoption is a small act that makes the world a little kinder.
            Here are a few sweethearts who'd love to be part of your story.
          </p>

          {filteredPets.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {filteredPets.map((pet) => (
                <div
                  key={pet._id}
                  className="card bg-base-200 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
                >
                  <figure className="px-10 pt-10">
                    <img
                      src={pet.photo}
                      alt={pet.name}
                      className="rounded-xl h-48 w-full object-cover"
                    />
                  </figure>
                  <div className="card-body items-center text-center">
                    <div className="flex items-center gap-2">
                      <h3 className="card-title">{pet.name}</h3>
                      <span className="badge badge-primary badge-outline gap-1">
                        {typeIcon(pet.species)}
                        {pet.species}
                      </span>
                    </div>
                    <p className="text-base-content/70">
                      {pet.breed} • {pet.age}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-base-content/60">
                      
                      <span className="inline-flex items-center gap-1">
                        <Weight className="w-3.5 h-3.5" /> {pet.weight}
                      </span>
                    </div>
                    <p className="text-sm text-base-content/80 mt-2 line-clamp-3">{pet.description}</p>
                    <div className="flex flex-wrap justify-center gap-1 mt-2">
                      {pet.traits.map((trait, i) => (
                        <span key={i} className="badge badge-ghost badge-sm">
                          {trait}
                        </span>
                      ))}
                    </div>
                    
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="text-center mt-10">
            <p className="text-base-content/60 text-sm max-w-2xl mx-auto">
              Every dog, cat, and rabbit here is more than a pet — they're a companion waiting to give someone
              unconditional love. Choosing to adopt means choosing compassion over convenience, and giving an animal
              the home it deserves.
            </p>
          </div>
        </div>
      </section>

      {/* Adoption Process Section */}
      <section className="py-16 bg-base-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12 text-base-content">
            Our Simple Adoption Process
            <div className="w-24 h-1 bg-primary mx-auto mt-4"></div>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 relative overflow-hidden">
              <div className="absolute -top-2 -left-2 bg-primary text-primary-content rounded-br-lg w-12 h-12 flex items-center justify-center font-bold text-2xl">1</div>
              <div className="card-body items-center text-center pt-10">
                <Search className="w-16 h-16 text-primary mb-4" />
                <h3 className="card-title">Choose Your Pet</h3>
                <p className="text-base-content/70 text-sm mt-2">
                  Browse our available pets and find the perfect match for your home and lifestyle.
                </p>
              </div>
            </div>

            <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 relative overflow-hidden">
              <div className="absolute -top-2 -left-2 bg-primary text-primary-content rounded-br-lg w-12 h-12 flex items-center justify-center font-bold text-2xl">2</div>
              <div className="card-body items-center text-center pt-10">
                <FileText className="w-16 h-16 text-primary mb-4" />
                <h3 className="card-title">Fill The Form</h3>
                <p className="text-base-content/70 text-sm mt-2">
                  Complete our adoption application with your details and home environment information.
                </p>
              </div>
            </div>

            <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 relative overflow-hidden">
              <div className="absolute -top-2 -left-2 bg-primary text-primary-content rounded-br-lg w-12 h-12 flex items-center justify-center font-bold text-2xl">3</div>
              <div className="card-body items-center text-center pt-10">
                <MessageCircle className="w-16 h-16 text-primary mb-4" />
                <h3 className="card-title">Chat With The Owner</h3>
                <p className="text-base-content/70 text-sm mt-2">
                  Message the current owner directly, in real time, to ask questions before you commit.
                </p>
              </div>
            </div>

            <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 relative overflow-hidden">
              <div className="absolute -top-2 -left-2 bg-primary text-primary-content rounded-br-lg w-12 h-12 flex items-center justify-center font-bold text-2xl">4</div>
              <div className="card-body items-center text-center pt-10">
                <Check className="w-16 h-16 text-primary mb-4" />
                <h3 className="card-title">Welcome Home</h3>
                <p className="text-base-content/70 text-sm mt-2">
                  Complete the adoption process and welcome your new family member home!
                </p>
              </div>
            </div>
          </div>

          <div className="mt-12 text-center">
            <Link to="/adopt">
              <button className="btn btn-primary btn-lg hover:-translate-y-0.5 transition-transform duration-200">
                Start Your Adoption Journey Today
              </button>
            </Link>
            <p className="mt-4 text-base-content/70 text-sm max-w-2xl mx-auto">
              Our adoption counselors are ready to help you find the perfect companion and guide you through each step of the process. We're committed to making sure every pet finds the right forever home.
            </p>
          </div>
        </div>
      </section>

      {/* Real-Time Chat Feature Showcase */}
      <section className="py-16 bg-base-100 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="badge badge-primary gap-2 py-3 px-4 mb-4">
                <Zap className="w-4 h-4" />
                Flagship Feature
              </span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-base-content mb-4">
                Real-Time Chat With Pet Owners
              </h2>
              <p className="text-base-content/70 text-lg mb-6">
                No more waiting on email replies. PetPal has a built-in, real-time messaging system so adopters and
                current owners can talk instantly — ask about temperament, vet history, or arrange a meet-and-greet,
                all inside the platform.
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-3">
                  <span className="bg-primary/20 p-2 rounded-full">
                    <Zap className="w-5 h-5 text-primary" />
                  </span>
                  <span className="text-base-content/80">Instant, socket-based delivery — no page refresh needed</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="bg-primary/20 p-2 rounded-full">
                    <Circle className="w-5 h-5 text-success fill-success" />
                  </span>
                  <span className="text-base-content/80">Live online/offline presence indicators</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="bg-primary/20 p-2 rounded-full">
                    <Shield className="w-5 h-5 text-primary" />
                  </span>
                  <span className="text-base-content/80">Conversations tied securely to verified accounts</span>
                </li>
              </ul>
              <Link to="/chat">
                <button className="btn btn-primary btn-lg gap-2 hover:-translate-y-0.5 transition-transform duration-200">
                  <MessageCircle className="w-5 h-5" />
                  Try the Live Chat
                </button>
              </Link>
            </div>

            <div className="mockup-window border border-base-300 bg-base-200 shadow-2xl">
              <div className="flex flex-col bg-base-100 px-4 py-6 gap-4 min-h-[380px]">
                <div className="flex items-center gap-3 pb-3 border-b border-base-300">
                  <div className="avatar online placeholder">
                    <div className="bg-primary text-primary-content rounded-full w-10">
                      <span>SM</span>
                    </div>
                  </div>
                  <div>
                    <p className="font-semibold text-base-content">Sarah M. (Buddy's Owner)</p>
                    <p className="text-xs text-success flex items-center gap-1">
                      <Circle className="w-2 h-2 fill-success" /> Online now
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-3 flex-1">
                  <div className="chat chat-start">
                    <div className="chat-bubble">Hi! Is Buddy still up for adoption?</div>
                  </div>
                  <div className="chat chat-end">
                    <div className="chat-bubble chat-bubble-primary">
                      Yes he is! He's great with kids and loves the park 🐾
                    </div>
                  </div>
                  <div className="chat chat-start">
                    <div className="chat-bubble">That's perfect, can we set up a meet-and-greet this weekend?</div>
                  </div>
                  <div className="chat chat-end">
                    <div className="chat-bubble chat-bubble-primary flex items-center gap-1">
                      <span className="loading loading-dots loading-xs"></span>
                      typing...
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-base-300">
                  <input
                    type="text"
                    disabled
                    placeholder="Message Sarah..."
                    className="input input-bordered input-sm w-full"
                  />
                  <button className="btn btn-primary btn-sm btn-circle">
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Adopt a Pet — Showcase Feature */}
        <section className="py-16 bg-base-200 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1 mockup-window border border-base-300 bg-base-100 shadow-2xl">
              <div className="flex flex-col gap-4 p-6 min-h-[340px]">
                <div className="flex items-center gap-2">
                  <FilterIcon className="w-4 h-4 text-primary" />
                  <span className="text-sm font-semibold text-base-content">Filter Pets</span>
                </div>
 
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: "Dog", icon: <Dog className="w-4 h-4" />, active: true },
                    { label: "Cat", icon: <Cat className="w-4 h-4" />, active: false },
                    { label: "Rabbit", icon: <Rabbit className="w-4 h-4" />, active: false },
                  ].map((t) => (
                    <button
                      key={t.label}
                      type="button"
                      className={`btn btn-sm gap-1 ${t.active ? "btn-primary" : "btn-outline"}`}
                      tabIndex={-1}
                    >
                      {t.icon}
                      {t.label}
                    </button>
                  ))}
                </div>
 
                <div>
                  <p className="text-xs font-semibold text-base-content/70 mb-2">Age Range: 1 – 8 yrs</p>
                  <input type="range" min="0" max="20" defaultValue="8" className="range range-primary range-xs" disabled />
                </div>
 
                <div className="relative">
                  <input
                    type="text"
                    disabled
                    placeholder="Search by name or breed..."
                    className="input input-bordered input-sm w-full pl-8"
                  />
                  <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-base-content/40" />
                </div>
 

 
              </div>
            </div>
 
            <div className="order-1 lg:order-2">
              <span className="badge badge-primary gap-2 py-3 px-4 mb-4">
                <PawPrint className="w-4 h-4" />
                Adopt a Pet
              </span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-base-content mb-4">
                Browse Pets With Filters That Actually Help
              </h2>
              <p className="text-base-content/70 text-lg mb-6">
                Narrow down listings by type, age range, and special needs, search by name or breed, sort by what
                matters to you, and save favorites as you go — so finding the right pet takes minutes, not hours.
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-3">
                  <span className="bg-primary/20 p-2 rounded-full">
                    <FilterIcon className="w-5 h-5 text-primary" />
                  </span>
                  <span className="text-base-content/80">Filter by type, age range, and special needs</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="bg-primary/20 p-2 rounded-full">
                    <Search className="w-5 h-5 text-primary" />
                  </span>
                  <span className="text-base-content/80">Instant search by name or breed, sort by name, age, or fee</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="bg-primary/20 p-2 rounded-full">
                    <HeartIcon className="w-5 h-5 text-primary" />
                  </span>
                  <span className="text-base-content/80">Save pets to your favorites as you browse</span>
                </li>
              </ul>
              <Link to="/adopt">
                <button className="btn btn-primary btn-lg gap-2 hover:-translate-y-0.5 transition-transform duration-200">
                  <PawPrint className="w-5 h-5" />
                  Browse Adoptable Pets
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Rehome a Pet — Showcase Feature */}
      <section className="py-16 bg-base-100 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="badge badge-secondary gap-2 py-3 px-4 mb-4">
                <Home className="w-4 h-4" />
                Rehome a Pet
              </span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-base-content mb-4">
                Give Your Pet a Second Chapter, With Care
              </h2>
              <p className="text-base-content/70 text-lg mb-6">
                Life circumstances change — your love for your pet doesn't have to be interrupted by them. Our
                rehoming process screens every applicant so your pet lands somewhere just as loving as home.
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-3">
                  <span className="bg-secondary/20 p-2 rounded-full">
                    <Shield className="w-5 h-5 text-secondary" />
                  </span>
                  <span className="text-base-content/80">Vetted, screened adopters only</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="bg-secondary/20 p-2 rounded-full">
                    <Users className="w-5 h-5 text-secondary" />
                  </span>
                  <span className="text-base-content/80">Direct messaging with prospective families</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="bg-secondary/20 p-2 rounded-full">
                    <CalendarCheck className="w-5 h-5 text-secondary" />
                  </span>
                  <span className="text-base-content/80">Support at every step, from listing to hand-off</span>
                </li>
              </ul>
              <Link to="/rehome">
                <button className="btn btn-secondary btn-lg gap-2 hover:-translate-y-0.5 transition-transform duration-200">
                  <Home className="w-5 h-5" />
                  Start Rehoming
                </button>
              </Link>
            </div>

            <div className="mockup-window border border-base-300 bg-base-200 shadow-2xl">
              <div className="flex flex-col gap-4 p-6 min-h-[340px]">
                <p className="font-semibold text-base-content mb-1">Rehoming request status</p>
                {[
                  { label: "Listing submitted", done: true },
                  { label: "Photos & details verified", done: true },
                  { label: "Matching with adopters", done: true },
                  { label: "Meet-and-greet scheduled", done: false },
                ].map((step) => (
                  <div key={step.label} className="flex items-center gap-3 bg-base-100 rounded-lg p-3">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center ${
                        step.done ? "bg-secondary text-secondary-content" : "bg-base-300"
                      }`}
                    >
                      {step.done && <Check className="w-4 h-4" />}
                    </div>
                    <span className={step.done ? "text-base-content" : "text-base-content/50"}>{step.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vet Services — Showcase Feature */}
 <section className="py-16 bg-base-200 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1 mockup-window border border-base-300 bg-base-100 shadow-2xl">
              <div className="flex flex-col gap-4 p-6 min-h-[340px]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-accent" />
                    <span className="font-semibold text-base-content">Vet Clinics Near You</span>
                  </div>
                  <button className="btn btn-accent btn-xs gap-1" tabIndex={-1}>
                    <Navigation className="w-3.5 h-3.5" />
                    My Location
                  </button>
                </div>
 
                {[
                  { name: "Companion Animal Clinic", distance: "0.6 mi", rating: 4.8 },
                  { name: "Riverside Veterinary Hospital", distance: "1.2 mi", rating: 4.6 },
                  { name: "Paws & Claws Vet Care", distance: "2.1 mi", rating: 4.9 },
                ].map((clinic) => (
                  <div key={clinic.name} className="bg-base-200 rounded-lg p-3 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-base-content">{clinic.name}</p>
                      <div className="flex items-center gap-2 text-xs text-base-content/60 mt-1">
                        <span className="inline-flex items-center gap-1">
                          <MapPin className="w-3 h-3" /> {clinic.distance}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <Star className="w-3 h-3 fill-warning text-warning" /> {clinic.rating}
                        </span>
                      </div>
                    </div>
                    <button className="btn btn-ghost btn-xs gap-1" tabIndex={-1}>
                      <Navigation className="w-3.5 h-3.5" />
                      Directions
                    </button>
                  </div>
                ))}
 
                <p className="text-[11px] text-base-content/40 text-center mt-1">Powered by Google Places API</p>
              </div>
            </div>
 
            <div className="order-1 lg:order-2">
              <span className="badge badge-accent gap-2 py-3 px-4 mb-4">
                <Stethoscope className="w-4 h-4" />
                Vet Services
              </span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-base-content mb-4">
                Find Nearby Vet Clinics, In Real Time
              </h2>
              <p className="text-base-content/70 text-lg mb-6">
                Using your live location and the Google Places API, PetPal instantly surfaces veterinary clinics near
                you — complete with distance, ratings, and one-tap directions — so help is never far away, before or
                after adoption.
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-3">
                  <span className="bg-accent/20 p-2 rounded-full">
                    <MapPin className="w-5 h-5 text-accent" />
                  </span>
                  <span className="text-base-content/80">Live results based on your current location</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="bg-accent/20 p-2 rounded-full">
                    <Star className="w-5 h-5 text-accent" />
                  </span>
                  <span className="text-base-content/80">See ratings and distance at a glance</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="bg-accent/20 p-2 rounded-full">
                    <Navigation className="w-5 h-5 text-accent" />
                  </span>
                  <span className="text-base-content/80">One tap to get directions to any clinic</span>
                </li>
              </ul>
              <Link to="/vet-services">
                <button className="btn btn-accent btn-lg gap-2 hover:-translate-y-0.5 transition-transform duration-200">
                  <MapPin className="w-5 h-5" />
                  Find Vet Clinics Near Me
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>
 

      {/* Why Choose Us Section */}
      <section className="py-16 bg-base-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12 text-base-content">Why Choose Pet Pal</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Shield className="w-12 h-12 text-primary" />,
                title: "Trusted Process",
                description: "Rigorous screening and support to ensure perfect pet-family matches.",
              },
              {
                icon: <Clock className="w-12 h-12 text-secondary" />,
                title: "Quick Adoption",
                description: "Streamlined process to help you find your new companion faster.",
              },
              {
                icon: <Heart className="w-12 h-12 text-accent" />,
                title: "Compassionate Care",
                description: "Dedicated to the well-being of every pet before, during, and after adoption.",
              },
              {
                icon: <Globe className="w-12 h-12 text-primary" />,
                title: "Community Impact",
                description: "Supporting local shelters and rescue initiatives across the country.",
              },
              {
                icon: <Building className="w-12 h-12 text-secondary" />,
                title: "Professional Network",
                description: "Partnered with top veterinarians, trainers, and animal welfare experts.",
              },
              {
                icon: <Star className="w-12 h-12 text-accent" />,
                title: "Ongoing Support",
                description: "Continued guidance and resources for successful pet parenting.",
              },
            ].map((item, index) => (
              <div
                key={index}
                className="card bg-base-200 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 hover:bg-base-100"
              >
                <div className="card-body items-center text-center">
                  {item.icon}
                  <h3 className="card-title mt-4">{item.title}</h3>
                  <p className="text-base-content/70 text-sm mt-2">{item.description}</p>
                </div>
              </div>
            ))}
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
            © {new Date().getFullYear()} Pet Pal. All rights reserved. Designed with{" "}
            <Heart className="inline-block text-error" size={16} /> by Our Dedicated Team
          </p>
        </div>
      </div>
    </div>
  )
}

export default LandingPage