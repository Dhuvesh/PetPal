import { useState, useEffect } from "react";
import { Eye, Check, X } from "lucide-react";
import { toast } from "react-hot-toast";

const StatusBadge = ({ status }) => {
  const getStatusStyles = () => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "approved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "withdrawn":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-blue-100 text-blue-800";
    }
  };

  return (
    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusStyles()}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

const AdoptionPage = () => {
  const [adoptions, setAdoptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedAdoption, setSelectedAdoption] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [statusAction, setStatusAction] = useState(null);
  const [adminNotes, setAdminNotes] = useState("");
  const [processingStatus, setProcessingStatus] = useState(false);

  useEffect(() => {
    fetchAdoptions();
  }, []);

  const fetchAdoptions = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:3000/api/adoptions/get-requests");
      
      if (!response.ok) {
        throw new Error("Failed to fetch adoption requests");
      }
      
      const data = await response.json();
      setAdoptions(data);
    } catch (err) {
      setError(err.message);
      toast.error("Failed to load adoption requests");
    } finally {
      setLoading(false);
    }
  };

  const openViewModal = (adoption) => {
    setSelectedAdoption(adoption);
    setIsViewModalOpen(true);
  };

  const openStatusModal = (adoption, action) => {
    setSelectedAdoption(adoption);
    setStatusAction(action);
    setAdminNotes("");
    setIsStatusModalOpen(true);
  };

  const closeViewModal = () => {
    setIsViewModalOpen(false);
    setSelectedAdoption(null);
  };

  const closeStatusModal = () => {
    setIsStatusModalOpen(false);
    setSelectedAdoption(null);
    setStatusAction(null);
    setAdminNotes("");
  };

  const updateAdoptionStatus = async () => {
    if (!selectedAdoption || !statusAction) return;
    
    try {
      setProcessingStatus(true);
      
      const response = await fetch(`http://localhost:3000/api/adoptions/update-status/${selectedAdoption._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: statusAction,
          adminNotes,
        }),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to ${statusAction} adoption request`);
      }
      
      // Update local state to reflect the change
      setAdoptions(adoptions.map(adoption => 
        adoption._id === selectedAdoption._id 
          ? { ...adoption, status: statusAction } 
          : adoption
      ));
      
      toast.success(`Adoption request ${statusAction} successfully`);
      closeStatusModal();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setProcessingStatus(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loader">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="bg-base-100 p-6 rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-primary">Adoption Applications</h1>
        <button 
          className="btn btn-sm btn-outline"
          onClick={fetchAdoptions}
        >
          Refresh
        </button>
      </div>

      {adoptions.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-500">No adoption applications found</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr>
                <th>ID</th>
                <th>Applicant</th>
                <th>Pet</th>
                <th>Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {adoptions.map((adoption) => (
                <tr key={adoption._id} className="hover">
                  <td className="font-mono">{adoption._id.substring(0, 8)}...</td>
                  <td>{adoption.fullName}</td>
                  <td>
                    {adoption.petId ? (
                      typeof adoption.petId === 'object' ? adoption.petId.name : 'Pet data loading...'
                    ) : 'Unknown Pet'}
                  </td>
                  <td>{formatDate(adoption.createdAt)}</td>
                  <td>
                    <StatusBadge status={adoption.status} />
                  </td>
                  <td className="flex space-x-2">
                    <button 
                      className="btn btn-sm btn-ghost text-primary"
                      onClick={() => openViewModal(adoption)}
                    >
                      <Eye size={16} />
                    </button>
                    
                    {adoption.status === "pending" && (
                      <>
                        <button 
                          className="btn btn-sm btn-ghost text-success"
                          onClick={() => openStatusModal(adoption, "approved")}
                        >
                          <Check size={16} />
                        </button>
                        <button 
                          className="btn btn-sm btn-ghost text-error"
                          onClick={() => openStatusModal(adoption, "rejected")}
                        >
                          <X size={16} />
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* View Modal */}
      {isViewModalOpen && selectedAdoption && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-base-100 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-base-100 p-4 border-b flex justify-between items-center">
              <h3 className="text-xl font-bold">
                Application from {selectedAdoption.fullName}
              </h3>
              <button className="btn btn-sm btn-circle" onClick={closeViewModal}>✕</button>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Pet Information */}
              {selectedAdoption.petId && typeof selectedAdoption.petId === 'object' && (
                <div className="bg-base-200 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Applying to adopt:</h4>
                  <div className="flex items-center space-x-4">
                    {selectedAdoption.petId.photos && selectedAdoption.petId.photos[0] && (
                      <img 
                        src={selectedAdoption.petId.photos[0]} 
                        alt={selectedAdoption.petId.name}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                    )}
                    <div>
                      <p className="font-bold">{selectedAdoption.petId.name}</p>
                      <p className="text-sm opacity-75">
                        {selectedAdoption.petId.breed} • {selectedAdoption.petId.age}
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Application Status */}
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-semibold">Application Status:</h4>
                  <StatusBadge status={selectedAdoption.status} />
                </div>
                <div className="text-sm opacity-75">
                  Submitted on {formatDate(selectedAdoption.createdAt)}
                </div>
              </div>
              
              {/* Admin Notes if any */}
              {selectedAdoption.adminNotes && (
                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                  <h4 className="font-semibold text-blue-800">Admin Notes:</h4>
                  <p className="text-blue-700">{selectedAdoption.adminNotes}</p>
                </div>
              )}
              
              {/* Personal Information */}
              <div>
                <h4 className="font-semibold border-b pb-2 mb-3">Personal Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm opacity-75">Full Name</p>
                    <p>{selectedAdoption.fullName}</p>
                  </div>
                  <div>
                    <p className="text-sm opacity-75">Email</p>
                    <p>{selectedAdoption.email}</p>
                  </div>
                  <div>
                    <p className="text-sm opacity-75">Phone</p>
                    <p>{selectedAdoption.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm opacity-75">Occupation</p>
                    <p>{selectedAdoption.occupation}</p>
                  </div>
                </div>
              </div>
              
              {/* Living Situation */}
              <div>
                <h4 className="font-semibold border-b pb-2 mb-3">Living Situation</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <p className="text-sm opacity-75">Address</p>
                    <p>{selectedAdoption.address}</p>
                  </div>
                  <div>
                    <p className="text-sm opacity-75">Housing Type</p>
                    <p className="capitalize">{selectedAdoption.housingType}</p>
                  </div>
                  <div>
                    <p className="text-sm opacity-75">Own or Rent</p>
                    <p className="capitalize">{selectedAdoption.ownRent}</p>
                  </div>
                  <div>
                    <p className="text-sm opacity-75">Has Children</p>
                    <p className="capitalize">{selectedAdoption.hasChildren}</p>
                  </div>
                  {selectedAdoption.hasChildren === "yes" && (
                    <div>
                      <p className="text-sm opacity-75">Children's Ages</p>
                      <p>{selectedAdoption.childrenAges}</p>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Pet Experience */}
              <div>
                <h4 className="font-semibold border-b pb-2 mb-3">Pet Experience</h4>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm opacity-75">Has Current Pets</p>
                    <p className="capitalize">{selectedAdoption.hasPets}</p>
                  </div>
                  
                  {selectedAdoption.hasPets === "yes" && (
                    <div>
                      <p className="text-sm opacity-75">Current Pets</p>
                      <p>{selectedAdoption.currentPets}</p>
                    </div>
                  )}
                  
                  <div>
                    <p className="text-sm opacity-75">Previous Pet Experience</p>
                    <p>{selectedAdoption.experience}</p>
                  </div>
                </div>
              </div>
              
              {/* Adoption Details */}
              <div>
                <h4 className="font-semibold border-b pb-2 mb-3">Adoption Details</h4>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm opacity-75">Reason for Adopting</p>
                    <p>{selectedAdoption.reasonForAdopting}</p>
                  </div>
                  <div>
                    <p className="text-sm opacity-75">Care Arrangements</p>
                    <p>{selectedAdoption.careArrangements}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="sticky bottom-0 bg-base-100 p-4 border-t flex justify-end space-x-2">
              {selectedAdoption.status === "pending" && (
                <>
                  <button 
                    className="btn btn-error"
                    onClick={() => {
                      closeViewModal();
                      openStatusModal(selectedAdoption, "rejected");
                    }}
                  >
                    Reject
                  </button>
                  <button 
                    className="btn btn-success"
                    onClick={() => {
                      closeViewModal();
                      openStatusModal(selectedAdoption, "approved");
                    }}
                  >
                    Approve
                  </button>
                </>
              )}
              <button className="btn" onClick={closeViewModal}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Status Update Modal */}
      {isStatusModalOpen && selectedAdoption && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-base-100 rounded-lg shadow-xl max-w-md w-full">
            <div className="p-4 border-b">
              <h3 className="text-lg font-bold">
                {statusAction === "approved" ? "Approve" : "Reject"} Application
              </h3>
            </div>
            
            <div className="p-6">
              <p className="mb-4">
                {statusAction === "approved" 
                  ? `Are you sure you want to approve ${selectedAdoption.fullName}'s application?` 
                  : `Are you sure you want to reject ${selectedAdoption.fullName}'s application?`
                }
              </p>
              
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Admin Notes (optional)</span>
                </label>
                <textarea 
                  className="textarea textarea-bordered h-24"
                  placeholder="Add any notes about this decision..."
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                ></textarea>
              </div>
            </div>
            
            <div className="p-4 border-t flex justify-end space-x-2">
              <button 
                className="btn btn-ghost"
                onClick={closeStatusModal}
                disabled={processingStatus}
              >
                Cancel
              </button>
              <button 
                className={`btn ${statusAction === "approved" ? "btn-success" : "btn-error"}`}
                onClick={updateAdoptionStatus}
                disabled={processingStatus}
              >
                {processingStatus 
                  ? "Processing..." 
                  : statusAction === "approved" 
                    ? "Confirm Approval" 
                    : "Confirm Rejection"
                }
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdoptionPage;