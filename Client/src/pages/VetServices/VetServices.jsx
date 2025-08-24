import { useState } from "react"
import { MapPin, Phone, Clock, Loader2, Globe, ChevronRight } from "lucide-react"
import { axiosInstance } from "../../lib/axios"

const GOOGLE_API_KEY = import.meta.env.VITE_GOOGLE_API_KEY

const VetServices = () => {
  const [clinics, setClinics] = useState([])
  const [selectedClinic, setSelectedClinic] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [userLocation, setUserLocation] = useState(null)

  // Add the getPlacePhotoUrl function back
  const getPlacePhotoUrl = (photoReference) => {
    if (!photoReference) return "/placeholder-clinic.jpg"
    return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${photoReference}&key=${GOOGLE_API_KEY}`
  }

  const handleFindClinics = () => {
    setLoading(true)
    setError(null)

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const location = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          }
          setUserLocation(location)

          try {
            const { data } = await axiosInstance.get("/api/vet-clinics", {
              params: {
                latitude: location.latitude,
                longitude: location.longitude,
              },
            })
            setClinics(data.results)
          } catch (err) {
            setError("Failed to fetch nearby clinics")
          } finally {
            setLoading(false)
          }
        },
        (error) => {
          setError("Please enable location services to find nearby clinics")
          setLoading(false)
        }
      )
    } else {
      setError("Geolocation is not supported by your browser")
      setLoading(false)
    }
  }

  const handleClinicClick = async (placeId) => {
    try {
      const { data } = await axiosInstance.get(`api/vet-clinics/${placeId}`)
      setSelectedClinic(data)
    } catch (err) {
      setError("Failed to fetch clinic details")
    }
  }

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 3959
    const dLat = ((lat2 - lat1) * Math.PI) / 180
    const dLon = ((lon2 - lon1) * Math.PI) / 180
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return (R * c).toFixed(1)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center ">
        <div className="card bg-base-200 p-8 shadow-xl">
          <Loader2 className="w-12 h-12 animate-spin text-primary" />
          <p className="mt-4 text-base-content/80">Finding nearby clinics...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4 min-h-screen bg-base-100 pt-28">
      <div className="prose max-w-none mb-8">
        <h1 className="text-4xl font-bold text-base-content">Nearby Veterinary Clinics</h1>
        <p className="text-base-content/70">Find the best care for your furry friends</p>
      </div>

      {!userLocation && (
        <div className="hero min-h-[400px] bg-base-200 rounded-box">
          <div className="hero-content text-center">
            <div className="max-w-md">
              <h2 className="text-2xl font-bold text-base-content mb-4">Ready to find pet care?</h2>
              <button
                onClick={handleFindClinics}
                className="btn btn-primary btn-lg gap-2"
              >
                <MapPin className="w-5 h-5" />
                Find Nearby Clinics
              </button>
              {error && (
                <div className="alert alert-error mt-4">
                  <span>{error}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {userLocation && clinics.length === 0 && !loading && (
        <div className="alert alert-info">
          <span>No veterinary clinics found in your area.</span>
        </div>
      )}

      {userLocation && clinics.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Clinics List */}
          <div className="space-y-4">
            {clinics.map((clinic) => (
              <div
                key={clinic.place_id}
                onClick={() => handleClinicClick(clinic.place_id)}
                className="card bg-base-200 hover:bg-base-300 transition-all cursor-pointer"
              >
                <div className="card-body">
                  <div className="flex gap-4">
                    <div className="avatar">
                      <div className="w-24 h-24 rounded-xl">
                        <img
                          src={getPlacePhotoUrl(clinic.photos?.[0]?.photo_reference)}
                          alt={clinic.name}
                          className="object-cover"
                        />
                      </div>
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="card-title text-base-content">{clinic.name}</h3>
                        <ChevronRight className="w-5 h-5 text-base-content/50" />
                      </div>

                      {clinic.rating && (
                        <div className="flex items-center gap-2 mt-2">
                          <div className="rating rating-sm">
                            {[...Array(5)].map((_, i) => (
                              <input
                                key={i}
                                type="radio"
                                className="mask mask-star-2 bg-warning"
                                checked={i + 1 === Math.round(clinic.rating)}
                                readOnly
                              />
                            ))}
                          </div>
                          <span className="text-base-content/70">({clinic.user_ratings_total})</span>
                        </div>
                      )}

                      <div className="flex items-center gap-2 mt-3 text-base-content/70">
                        <MapPin className="w-4 h-4" />
                        <span>
                          {calculateDistance(
                            userLocation.latitude,
                            userLocation.longitude,
                            clinic.geometry.location.lat,
                            clinic.geometry.location.lng
                          )}{" "}
                          miles
                        </span>
                      </div>

                      {clinic.opening_hours?.open_now !== undefined && (
                        <div className="mt-3">
                          <span className={`badge ${clinic.opening_hours.open_now ? "badge-success" : "badge-error"}`}>
                            {clinic.opening_hours.open_now ? "Open Now" : "Closed"}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Clinic Details */}
          {selectedClinic && (
            <div className="card bg-base-200 shadow-xl sticky top-6">
              <figure className="h-48">
                <img
                  src={getPlacePhotoUrl(selectedClinic.photos?.[0]?.photo_reference)}
                  alt={selectedClinic.name}
                  className="w-full object-cover"
                />
              </figure>

              <div className="card-body">
                <h2 className="card-title text-2xl text-base-content">{selectedClinic.name}</h2>

                <div className="flex items-center gap-2">
                  <div className="rating rating-md">
                    {[...Array(5)].map((_, i) => (
                      <input
                        key={i}
                        type="radio"
                        className="mask mask-star-2 bg-warning"
                        checked={i + 1 === Math.round(selectedClinic.rating)}
                        readOnly
                      />
                    ))}
                  </div>
                  <span className="text-base-content/70">({selectedClinic.user_ratings_total})</span>
                </div>

                <div className="divider"></div>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-primary mt-1" />
                    <span className="text-base-content/80">{selectedClinic.formatted_address}</span>
                  </div>

                  {selectedClinic.formatted_phone_number && (
                    <div className="flex items-center gap-3">
                      <Phone className="w-5 h-5 text-primary" />
                      <a href={`tel:${selectedClinic.formatted_phone_number}`} className="link link-primary">
                        {selectedClinic.formatted_phone_number}
                      </a>
                    </div>
                  )}

                  {selectedClinic.website && (
                    <div className="flex items-center gap-3">
                      <Globe className="w-5 h-5 text-primary" />
                      <a
                        href={selectedClinic.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="link link-primary truncate"
                      >
                        {new URL(selectedClinic.website).hostname}
                      </a>
                    </div>
                  )}

                  {selectedClinic.opening_hours?.weekday_text && (
                    <div className="mt-6">
                      <div className="flex items-center gap-2 mb-4">
                        <Clock className="w-5 h-5 text-primary" />
                        <span className="font-semibold text-base-content">Business Hours</span>
                      </div>

                      <div className="ml-7 space-y-2">
                        {selectedClinic.opening_hours.weekday_text.map((hours, index) => {
                          const [day, time] = hours.split(": ")
                          return (
                            <div key={index} className="flex justify-between text-sm">
                              <span className="text-base-content/70 w-20">{day}</span>
                              <span className="text-base-content">{time}</span>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )}

                  {selectedClinic.reviews && (
                    <div className="mt-6">
                      <h3 className="font-semibold text-base-content mb-4">Recent Reviews</h3>
                      <div className="space-y-4">
                        {selectedClinic.reviews.slice(0, 3).map((review, index) => (
                          <div key={index} className="p-4 bg-base-300 rounded-box">
                            <div className="flex items-center gap-3">
                              <div className="avatar">
                                <div className="w-8 h-8 rounded-full">
                                  <img
                                    src={review.profile_photo_url || "/placeholder.svg"}
                                    alt={review.author_name}
                                  />
                                </div>
                              </div>
                              <div>
                                <p className="font-medium text-base-content">{review.author_name}</p>
                                <div className="rating rating-xs">
                                  {[...Array(5)].map((_, i) => (
                                    <input
                                      key={i}
                                      type="radio"
                                      className="mask mask-star-2 bg-warning"
                                      checked={i + 1 === Math.round(review.rating)}
                                      readOnly
                                    />
                                  ))}
                                </div>
                              </div>
                            </div>
                            <p className="mt-3 text-sm text-base-content/80">{review.text}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default VetServices