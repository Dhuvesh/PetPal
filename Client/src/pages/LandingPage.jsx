import { useState, useEffect } from "react"
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
} from "lucide-react"
import { Link } from "react-router-dom"

const LandingPage = () => {
  const [selectedPetType, setSelectedPetType] = useState("all")
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

  const pets = [
    {
      id: 1,
      name: "Buddy",
      type: "dog",
      breed: "Labrador",
      age: "3 years",
      image: "https://img.freepik.com/free-photo/labrador-retrieve_155003-150.jpg?t=st=1737830012~exp=1737833612~hmac=8725dbea0d8af5cfa4841c7f2e716f3f25c66ff5a5e08b264698306e1343b92e&w=996",
      description: "Energetic and loving companion, great with kids!",
    },
    {
      id: 2,
      name: "Whiskers",
      type: "cat",
      breed: "Siamese",
      age: "2 years",
      image: "https://img.freepik.com/free-photo/beautiful-pale-blue-eyes-cream-gray-cat_493961-451.jpg?t=st=1737830052~exp=1737833652~hmac=e4112a3fcb0e85ba8db5c1495c3e2ce64e381df526513e8685c661f416bbaca8&w=996",
      description: "Elegant and playful, loves cuddles and sunbathing.",
    },
    {
      id: 3,
      name: "Hoppy",
      type: "rabbit",
      breed: "Holland Lop",
      age: "1 year",
      image: "https://img.freepik.com/free-photo/closeup-shot-cute-rabbit-green-grass-with-blurred-background_181624-4255.jpg?t=st=1737830091~exp=1737833691~hmac=9843cc9b0997e67f90dd260dd5cf609a1961c355dcf6811c46e7b142f0abd0a6&w=996",
      description: "Adorable and gentle, perfect for first-time pet owners.",
    },
    {
      id: 4,
      name: "Luna",
      type: "dog",
      breed: "German Shepherd",
      age: "4 years",
      image: "https://img.freepik.com/free-photo/closeup-german-shepherd-surrounded-by-greenery-sunlight_181624-14212.jpg?t=st=1737830116~exp=1737833716~hmac=0f80459d990c5c949b188ea04ba9797e8b9a725616c46711ff1792b49e2063a8&w=996",
      description: "Intelligent and loyal, excellent guard dog.",
    },
    {
      id: 5,
      name: "Mittens",
      type: "cat",
      breed: "Persian",
      age: "5 years",
      image: "https://img.freepik.com/free-photo/close-up-beautiful-pet-cat_23-2150285612.jpg?t=st=1737830143~exp=1737833743~hmac=d7c42330bf037612b421a947e26c46a6174adf6e95c761a68a0212a1f7130bd8&w=996",
      description: "Calm and regal, loves quiet environments.",
    },
  ]

  const filteredPets = selectedPetType === "all" ? pets : pets.filter((pet) => pet.type === selectedPetType)

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
            <div className="mt-16 grid grid-cols-3 gap-4 max-w-xl mx-auto bg-base-100 rounded-xl p-6 shadow-lg">
              {[
                { number: "10K+", label: "Pets Adopted" },
                { number: "500+", label: "Happy Families" },
                { number: "50+", label: "Vet Partners" },
              ].map((stat, index) => (
                <div key={index} className="text-center transform transition-transform duration-300 hover:scale-105">
                  <div className="text-3xl font-bold text-primary">{stat.number}</div>
                  <div className="text-sm text-base-content/70">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Pets Section */}
      <section className="py-16 bg-base-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12 text-base-content">Our Adorable Pets Waiting for Home</h2>
          <div className="flex justify-center mb-8">
            <div className="btn-group">
              {["all", "dog", "cat", "rabbit"].map((type) => (
                <button
                  key={type}
                  className={`btn ${selectedPetType === type ? "btn-primary" : "btn-outline"} hover:-translate-y-0.5 transition-transform duration-200   ml-2`}
                  onClick={() => setSelectedPetType(type)}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}s
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {filteredPets.map((pet) => (
              <div
                key={pet.id}
                className="card bg-base-200 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
              >
                <figure className="px-10 pt-10">
                  <img src={pet.image || "/placeholder.svg"} alt={pet.name} className="rounded-xl" />
                </figure>
                <div className="card-body items-center text-center">
                  <h3 className="card-title">{pet.name}</h3>
                  <p className="text-base-content/70">
                    {pet.breed} • {pet.age}
                  </p>
                  <p className="text-sm text-base-content/80 mt-2">{pet.description}</p>
                  <div className="card-actions justify-center mt-4">
                    <button className="btn btn-primary hover:-translate-y-0.5 transition-transform duration-200">
                      Adopt {pet.name} <ArrowRight className="ml-2" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 bg-base-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12 text-base-content">Our Comprehensive Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Adopt a Pet",
                icon: <PawPrint className="w-12 h-12" />,
                path: "/adopt",
                description: "Find your perfect furry companion through our careful matching process.",
              },
              {
                title: "Rehome a Pet",
                icon: <Home className="w-12 h-12" />,
                path: "/rehome",
                description: "Compassionate support for pets needing a new loving home.",
              },
              {
                title: "Vet Services",
                icon: <Stethoscope className="w-12 h-12" />,
                path: "/vet-services",
                description: "Comprehensive healthcare for your beloved pets.",
              },
              
            ].map((service, index) => (
              <div
                key={index}
                className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 hover:bg-base-200"
              >
                <div className="card-body items-center text-center">
                  {service.icon}
                  <h3 className="card-title mt-4">{service.title}</h3>
                  <p className="text-base-content/70 text-sm mt-2">{service.description}</p>
                  <div className="card-actions justify-end mt-4">
                    <button
                      className="btn btn-primary hover:-translate-y-0.5 transition-transform duration-200"
                      onClick={() => (window.location.href = service.path)}
                    >
                      Learn More
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Us Section (Previous section remains the same) */}

      {/* Why Choose Us Section */}
      <section className="py-16 bg-base-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12 text-base-content">Why Choose Pet Haven</h2>
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
                className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 hover:bg-base-200"
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

      {/* Contact Section (Previous section remains the same) */}

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

export default LandingPage

