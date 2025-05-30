import AdoptionStatusTracker from "../../components/myApplication"

const MyAdoptionsPage = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Adoption Applications</h1>
        <AdoptionStatusTracker />
      </div>
    </div>
  )
}

export default MyAdoptionsPage
