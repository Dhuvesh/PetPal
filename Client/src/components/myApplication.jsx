"use client"

import { useState, useEffect } from "react"
import { CheckCircle, XCircle, Clock, AlertCircle, Search, MessageCircle, Eye, Calendar, User } from "lucide-react"
import { useAuthStore } from "../store/UseAuthStore"
import { useChatStore } from "../store/useChatStore"
import { useNavigate } from "react-router-dom"

const AdoptionStatusTracker = ({ onOpenChat }) => {
  const { authUser } = useAuthStore()
  const { getChatByAdoption } = useChatStore()
  const [adoptions, setAdoptions] = useState([])
  const Navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const [statusFilter, setStatusFilter] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [loadingChat, setLoadingChat] = useState({})
  const [withdrawingRequest, setWithdrawingRequest] = useState({})
  const [selectedAdoption, setSelectedAdoption] = useState(null)
  const [showDetails, setShowDetails] = useState(false)
  const [chatRetryAttempts, setChatRetryAttempts] = useState({})
  const limit = 5

  useEffect(() => {
    fetchAdoptions()
  }, [page, statusFilter, searchQuery, authUser])

  const fetchAdoptions = async () => {
    try {
      setLoading(true)

      if (!authUser) {
        setError("Please log in to view your adoption requests")
        setLoading(false)
        return
      }

      console.log("Fetching adoptions for user:", authUser.email)

      // Build query parameters - include user email to filter by user
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        email: authUser.email,
        ...(statusFilter && { status: statusFilter }),
        ...(searchQuery && { search: searchQuery }),
      })

      const response = await fetch(`http://localhost:3000/api/adoptions/get-user-requests?${queryParams}`)

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || "Failed to fetch adoption requests")
      }

      const data = await response.json()
      console.log("Fetched adoptions:", data.length)
      setAdoptions(data)

      // Get total count from headers or response
      const totalCountHeader = response.headers.get("X-Total-Count")
      const calculatedTotal = totalCountHeader ? Number.parseInt(totalCountHeader) : data.length
      setTotalCount(calculatedTotal)
      setTotalPages(Math.ceil(calculatedTotal / limit) || 1)

      setError(null)
    } catch (err) {
      console.error("Error fetching adoption requests:", err)
      setError("Failed to load adoption requests. Please try again later.")
    } finally {
      setLoading(false)
    }
  }

  const handleStartChat = async (adoption, isRetry = false) => {
    if (!authUser) return

    const chatLoadingKey = adoption._id
    setLoadingChat((prev) => ({ ...prev, [chatLoadingKey]: true }))

    try {
      console.log("Attempting to start chat for adoption:", adoption._id, isRetry ? "(retry)" : "")
      Navigate('/chat')
      // Check if chat exists for this adoption
      const existingChat = await getChatByAdoption(adoption._id, authUser.email)

      if (existingChat) {
        console.log("Chat found, opening chat:", existingChat._id)
        
        // Chat exists, open it
        if (onOpenChat) {
          onOpenChat(existingChat)
        }
        // Reset retry attempts on success
        setChatRetryAttempts((prev) => ({ ...prev, [adoption._id]: 0 }))
        setError(null)
      } else {
        console.log("No chat found for approved adoption:", adoption._id)

        // Check retry attempts
        const currentRetries = chatRetryAttempts[adoption._id] || 0

        if (!isRetry && currentRetries < 3) {
          // First attempt or automatic retry
          console.log("Scheduling retry for chat creation, attempt:", currentRetries + 1)
          setChatRetryAttempts((prev) => ({ ...prev, [adoption._id]: currentRetries + 1 }))

          // Show user-friendly message
          setError("Setting up your chat... Please wait a moment.")

          // Wait and retry
          setTimeout(
            () => {
              handleStartChat(adoption, true)
            },
            2000 * (currentRetries + 1),
          ) // Increasing delay

          return // Don't set loading to false yet
        } else {
          // Max retries reached or manual retry
          console.warn("Chat not available after retries for adoption:", adoption._id)
          setError(
            "Chat is not available yet. The system may still be setting it up. Please try again in a few minutes or contact support if the issue persists.",
          )
          setChatRetryAttempts((prev) => ({ ...prev, [adoption._id]: 0 })) // Reset for next time
        }
      }
    } catch (error) {
      console.error("Error accessing chat:", error)
      setError("Failed to access chat. Please try again or contact support if the issue persists.")
      setChatRetryAttempts((prev) => ({ ...prev, [adoption._id]: 0 })) // Reset on error
    } finally {
      setLoadingChat((prev) => ({ ...prev, [chatLoadingKey]: false }))
    }
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case "approved":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle className="w-4 h-4 mr-1" /> Approved
          </span>
        )
      case "rejected":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <XCircle className="w-4 h-4 mr-1" /> Rejected
          </span>
        )
      case "withdrawn":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            <AlertCircle className="w-4 h-4 mr-1" /> Withdrawn
          </span>
        )
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <Clock className="w-4 h-4 mr-1" /> Pending
          </span>
        )
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "approved":
        return "border-l-green-500"
      case "rejected":
        return "border-l-red-500"
      case "withdrawn":
        return "border-l-gray-500"
      default:
        return "border-l-yellow-500"
    }
  }

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage)
    }
  }

  const handleStatusFilterChange = (e) => {
    setStatusFilter(e.target.value)
    setPage(1) // Reset to first page when filter changes
  }

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value)
    if (e.target.value === "") {
      setPage(1) // Reset to first page when search is cleared
    }
  }

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    setPage(1) // Reset to first page when search changes
  }

  const handleWithdrawRequest = async (adoptionId) => {
    try {
      if (!authUser) {
        setError("Please log in to withdraw adoption requests")
        return
      }

      setWithdrawingRequest((prev) => ({ ...prev, [adoptionId]: true }))

      console.log("Withdrawing adoption request:", adoptionId)

      const response = await fetch(
        `http://localhost:3000/api/adoptions/withdraw-request/${adoptionId}?email=${encodeURIComponent(authUser.email)}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
        },
      )

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || "Failed to withdraw adoption request")
      }

      console.log("Adoption request withdrawn successfully")
      // Refresh the adoption requests
      await fetchAdoptions()
      setError(null)
    } catch (err) {
      console.error("Error withdrawing adoption request:", err)
      setError("Failed to withdraw adoption request. Please try again.")
    } finally {
      setWithdrawingRequest((prev) => ({ ...prev, [adoptionId]: false }))
    }
  }

  const handleViewDetails = (adoption) => {
    setSelectedAdoption(adoption)
    setShowDetails(true)
  }

  const getStatusDescription = (status) => {
    switch (status) {
      case "approved":
        return "Your adoption request has been approved! You can now chat with the pet owner."
      case "rejected":
        return "Your adoption request was not approved this time. Don't give up - there are many pets looking for homes!"
      case "withdrawn":
        return "You have withdrawn this adoption request."
      default:
        return "Your adoption request is being reviewed. We'll notify you once there's an update."
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const handleRetryChat = (adoption) => {
    console.log("Manual retry for chat:", adoption._id)
    setChatRetryAttempts((prev) => ({ ...prev, [adoption._id]: 0 })) // Reset retry count
    setError(null)
    handleStartChat(adoption)
  }

  const clearError = () => {
    setError(null)
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      <div className="bg-white rounded-lg shadow-md overflow-hidden w-full">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                <Calendar className="mr-3 h-6 w-6 text-blue-600" />
                My Adoption Requests
              </h2>
              <p className="text-sm text-gray-600 mt-1">Track the status of your pet adoption applications</p>
            </div>
            {totalCount > 0 && (
              <div className="text-right">
                <p className="text-2xl font-bold text-blue-600">{totalCount}</p>
                <p className="text-sm text-gray-500">Total Requests</p>
              </div>
            )}
          </div>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="px-6 py-3 bg-red-50 border-b border-red-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
              <button onClick={clearError} className="text-red-500 hover:text-red-700">
                <XCircle className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Search by pet name..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>
            </div>
            <div className="w-full md:w-48">
              <select
                value={statusFilter}
                onChange={handleStatusFilterChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              >
                <option value="">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
                <option value="withdrawn">Withdrawn</option>
              </select>
            </div>
          </form>
        </div>

        {/* Content */}
        <div className="px-6 py-4">
          {loading ? (
            // Loading skeleton
            <div className="space-y-4">
              {Array(3)
                .fill()
                .map((_, i) => (
                  <div key={i} className="p-4 border rounded-lg animate-pulse">
                    <div className="flex flex-col md:flex-row justify-between gap-4">
                      <div className="flex-1">
                        <div className="h-6 w-48 bg-gray-200 rounded mb-2"></div>
                        <div className="h-4 w-32 bg-gray-200 rounded mb-1"></div>
                        <div className="h-4 w-64 bg-gray-200 rounded"></div>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="h-8 w-24 bg-gray-200 rounded"></div>
                        <div className="h-8 w-16 bg-gray-200 rounded"></div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          ) : error && adoptions.length === 0 ? (
            <div className="text-center py-12">
              <AlertCircle className="mx-auto h-16 w-16 text-red-500 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Something went wrong</h3>
              <p className="text-gray-600 mb-4">{error}</p>
              <button
                onClick={() => {
                  clearError()
                  fetchAdoptions()
                }}
                className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : adoptions.length === 0 ? (
            <div className="text-center py-12">
              <div className="mx-auto h-24 w-24 text-gray-300 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No adoption requests found</h3>
              <p className="text-gray-500">
                {statusFilter || searchQuery
                  ? `No requests match your current filters.`
                  : "You haven't submitted any adoption requests yet."}
              </p>
              {(statusFilter || searchQuery) && (
                <button
                  onClick={() => {
                    setStatusFilter("")
                    setSearchQuery("")
                    setPage(1)
                  }}
                  className="mt-4 px-4 py-2 text-blue-600 hover:text-blue-800 underline"
                >
                  Clear filters
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {adoptions.map((adoption) => (
                <div
                  key={adoption._id}
                  className={`p-4 border-l-4 border border-gray-200 rounded-lg hover:shadow-md transition-all ${getStatusColor(adoption.status)}`}
                >
                  <div className="flex flex-col lg:flex-row justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-lg text-gray-900 flex items-center">
                          <User className="mr-2 h-5 w-5 text-gray-500" />
                          {adoption.petId?.name || "Pet"} Adoption Request
                        </h3>
                        {getStatusBadge(adoption.status)}
                      </div>

                      <div className="space-y-1 text-sm text-gray-600 mb-3">
                        <p className="flex items-center">
                          <Calendar className="mr-2 h-4 w-4" />
                          Submitted on {formatDate(adoption.createdAt)}
                        </p>
                        {adoption.updatedAt !== adoption.createdAt && (
                          <p className="flex items-center">
                            <Clock className="mr-2 h-4 w-4" />
                            Last updated on {formatDate(adoption.updatedAt)}
                          </p>
                        )}
                      </div>

                      <p className="text-sm text-gray-700 mb-3">{getStatusDescription(adoption.status)}</p>

                      {adoption.adminNotes && (
                        <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-md">
                          <p className="text-sm text-blue-800">
                            <span className="font-medium">Admin Notes:</span> {adoption.adminNotes}
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col sm:flex-row lg:flex-col gap-2 lg:items-end">
                      <button
                        onClick={() => handleViewDetails(adoption)}
                        className="flex items-center justify-center px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-1 transition-colors"
                      >
                        <Eye className="mr-1 h-4 w-4" />
                        View Details
                      </button>

                      {adoption.status === "approved" && (
                        <div className="flex flex-col gap-1">
                          <button
                            onClick={() => handleStartChat(adoption)}
                            disabled={loadingChat[adoption._id]}
                            className="flex items-center justify-center px-3 py-2 text-sm bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          >
                            {loadingChat[adoption._id] ? (
                              <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-1"></div>
                                Loading...
                              </>
                            ) : (
                              <>
                                <MessageCircle className="mr-1 h-4 w-4" />
                                Start Chat
                              </>
                            )}
                          </button>

                          {/* Retry button for chat issues */}
                          {(chatRetryAttempts[adoption._id] > 0 || error) && !loadingChat[adoption._id] && (
                            <button
                              onClick={() => handleRetryChat(adoption)}
                              className="flex items-center justify-center px-3 py-1 text-xs bg-orange-100 text-orange-700 rounded-md hover:bg-orange-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-1 transition-colors"
                            >
                              Retry Chat
                            </button>
                          )}
                        </div>
                      )}

                      {adoption.status === "pending" && (
                        <button
                          onClick={() => handleWithdrawRequest(adoption._id)}
                          disabled={withdrawingRequest[adoption._id]}
                          className="flex items-center justify-center px-3 py-2 text-sm bg-red-100 text-red-700 rounded-md hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          {withdrawingRequest[adoption._id] ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-700 mr-1"></div>
                              Withdrawing...
                            </>
                          ) : (
                            <>
                              <XCircle className="mr-1 h-4 w-4" />
                              Withdraw
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer with pagination */}
        {!loading && !error && adoptions.length > 0 && totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center bg-gray-50 gap-4">
            <p className="text-sm text-gray-600">
              Showing {(page - 1) * limit + 1} to {Math.min(page * limit, totalCount)} of {totalCount} results
            </p>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  page === 1
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                }`}
              >
                Previous
              </button>

              <div className="flex items-center space-x-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum
                  if (totalPages <= 5) {
                    pageNum = i + 1
                  } else if (page <= 3) {
                    pageNum = i + 1
                  } else if (page >= totalPages - 2) {
                    pageNum = totalPages - 4 + i
                  } else {
                    pageNum = page - 2 + i
                  }

                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        page === pageNum
                          ? "bg-blue-500 text-white"
                          : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      }`}
                    >
                      {pageNum}
                    </button>
                  )
                })}
              </div>

              <button
                onClick={() => handlePageChange(page + 1)}
                disabled={page === totalPages}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  page === totalPages
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                }`}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Details Modal */}
      {showDetails && selectedAdoption && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-gray-900">Adoption Request Details</h3>
                <button onClick={() => setShowDetails(false)} className="p-1 hover:bg-gray-100 rounded">
                  <XCircle className="h-6 w-6 text-gray-500" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Pet Name</label>
                  <p className="text-gray-900">{selectedAdoption.petId?.name || "N/A"}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  {getStatusBadge(selectedAdoption.status)}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Submitted On</label>
                  <p className="text-gray-900">{formatDate(selectedAdoption.createdAt)}</p>
                </div>

                {selectedAdoption.updatedAt !== selectedAdoption.createdAt && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Last Updated</label>
                    <p className="text-gray-900">{formatDate(selectedAdoption.updatedAt)}</p>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Your Information</label>
                  <div className="bg-gray-50 p-3 rounded border">
                    <p>
                      <span className="font-medium">Name:</span> {selectedAdoption.fullName}
                    </p>
                    <p>
                      <span className="font-medium">Email:</span> {selectedAdoption.email}
                    </p>
                    {selectedAdoption.phone && (
                      <p>
                        <span className="font-medium">Phone:</span> {selectedAdoption.phone}
                      </p>
                    )}
                    {selectedAdoption.address && (
                      <p>
                        <span className="font-medium">Address:</span> {selectedAdoption.address}
                      </p>
                    )}
                  </div>
                </div>

                {selectedAdoption.reasonForAdopting && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Reason for Adopting</label>
                    <div className="bg-gray-50 p-3 rounded border">
                      <p className="whitespace-pre-wrap">{selectedAdoption.reasonForAdopting}</p>
                    </div>
                  </div>
                )}

                {selectedAdoption.experience && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Pet Experience</label>
                    <div className="bg-gray-50 p-3 rounded border">
                      <p className="whitespace-pre-wrap">{selectedAdoption.experience}</p>
                    </div>
                  </div>
                )}

                {selectedAdoption.adminNotes && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Admin Notes</label>
                    <div className="bg-blue-50 border border-blue-200 p-3 rounded">
                      <p className="text-blue-800">{selectedAdoption.adminNotes}</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                {selectedAdoption.status === "approved" && (
                  <button
                    onClick={() => {
                      setShowDetails(false)
                      handleStartChat(selectedAdoption)
                    }}
                    disabled={loadingChat[selectedAdoption._id]}
                    className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 transition-colors"
                  >
                    <MessageCircle className="mr-2 h-4 w-4" />
                    {loadingChat[selectedAdoption._id] ? "Loading..." : "Start Chat"}
                  </button>
                )}
                <button
                  onClick={() => setShowDetails(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdoptionStatusTracker
