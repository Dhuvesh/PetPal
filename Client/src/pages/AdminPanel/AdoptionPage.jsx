import { useState, useEffect } from "react";
import { Eye, Check, X } from "lucide-react";

const StatusBadge = ({ status }) => {
  const getStatusStyles = () => {
    switch (status) {
      case "pending":
        return "bg-gray-100 text-black border border-black";
      case "approved":
        return "bg-gray-100 text-black border border-black";
      case "rejected":
        return "bg-gray-100 text-black border border-black";
      case "withdrawn":
        return "bg-gray-100 text-black border border-black";
      default:
        return "bg-gray-100 text-black border border-black";
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
      // Toast would be handled here
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
      
      // Toast would be handled here
      closeStatusModal();
    } catch (err) {
      // Toast error would be handled here
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
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-black">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-black">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-black">Adoption Applications</h1>
        <button 
          className="px-3 py-1 text-sm bg-white border border-black text-black rounded hover:bg-gray-50"
          onClick={fetchAdoptions}
        >
          Refresh
        </button>
      </div>

      {adoptions.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-600">No adoption applications found</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-black">
                <th className="text-left p-2 text-black">ID</th>
                <th className="text-left p-2 text-black">Applicant</th>
                <th className="text-left p-2 text-black">Pet</th>
                <th className="text-left p-2 text-black">Date</th>
                <th className="text-left p-2 text-black">Status</th>
                <th className="text-left p-2 text-black">Actions</th>
              </tr>
            </thead>
            <tbody>
              {adoptions.map((adoption) => (
                <tr key={adoption._id} className="hover:bg-gray-50 border-b border-gray-200">
                  <td className="p-2 font-mono text-black">{adoption._id.substring(0, 8)}...</td>
                  <td className="p-2 text-black">{adoption.fullName}</td>
                  <td className="p-2 text-black">
                    {adoption.petId ? (
                      typeof adoption.petId === 'object' ? adoption.petId.name : 'Pet data loading...'
                    ) : 'Unknown Pet'}
                  </td>
                  <td className="p-2 text-black">{formatDate(adoption.createdAt)}</td>
                  <td className="p-2">
                    <StatusBadge status={adoption.status} />
                  </td>
                  <td className="p-2 flex space-x-2">
                    <button 
                      className="p-1 rounded text-black hover:bg-gray-100"
                      onClick={() => openViewModal(adoption)}
                    >
                      <Eye size={16} />
                    </button>
                    
                    {adoption.status === "pending" && (
                      <>
                        <button 
                          className="p-1 rounded text-black hover:bg-gray-100"
                          onClick={() => openStatusModal(adoption, "approved")}
                        >
                          <Check size={16} />
                        </button>
                        <button 
                          className="p-1 rounded text-black hover:bg-gray-100"
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
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white p-4 border-b border-black flex justify-between items-center">
              <h3 className="text-xl font-bold text-black">
                Application from {selectedAdoption.fullName}
              </h3>
              <button className="w-8 h-8 rounded-full flex items-center justify-center border border-black hover:bg-gray-100 text-black" onClick={closeViewModal}>✕</button>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Pet Information */}
              {selectedAdoption.petId && typeof selectedAdoption.petId === 'object' && (
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <h4 className="font-semibold mb-2 text-black">Applying to adopt:</h4>
                  <div className="flex items-center space-x-4">
                    {selectedAdoption.petId.photos && selectedAdoption.petId.photos[0] && (
                      <img 
                        src={selectedAdoption.petId.photos[0]} 
                        alt={selectedAdoption.petId.name}
                        className="w-16 h-16 rounded-full object-cover border border-black"
                      />
                    )}
                    <div>
                      <p className="font-bold text-black">{selectedAdoption.petId.name}</p>
                      <p className="text-sm text-gray-600">
                        {selectedAdoption.petId.breed} • {selectedAdoption.petId.age}
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Application Status */}
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-semibold text-black">Application Status:</h4>
                  <StatusBadge status={selectedAdoption.status} />
                </div>
                <div className="text-sm text-gray-600">
                  Submitted on {formatDate(selectedAdoption.createdAt)}
                </div>
              </div>
              
              {/* Admin Notes if any */}
              {selectedAdoption.adminNotes && (
                <div className="bg-gray-50 border-l-4 border-black p-4 rounded">
                  <h4 className="font-semibold text-black">Admin Notes:</h4>
                  <p className="text-black">{selectedAdoption.adminNotes}</p>
                </div>
              )}
              
              {/* Personal Information */}
              <div>
                <h4 className="font-semibold border-b border-black pb-2 mb-3 text-black">Personal Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Full Name</p>
                    <p className="text-black">{selectedAdoption.fullName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="text-black">{selectedAdoption.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Phone</p>
                    <p className="text-black">{selectedAdoption.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Occupation</p>
                    <p className="text-black">{selectedAdoption.occupation}</p>
                  </div>
                </div>
              </div>
              
              {/* Living Situation */}
              <div>
                <h4 className="font-semibold border-b border-black pb-2 mb-3 text-black">Living Situation</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <p className="text-sm text-gray-600">Address</p>
                    <p className="text-black">{selectedAdoption.address}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Housing Type</p>
                    <p className="capitalize text-black">{selectedAdoption.housingType}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Own or Rent</p>
                    <p className="capitalize text-black">{selectedAdoption.ownRent}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Has Children</p>
                    <p className="capitalize text-black">{selectedAdoption.hasChildren}</p>
                  </div>
                  {selectedAdoption.hasChildren === "yes" && (
                    <div>
                      <p className="text-sm text-gray-600">Children's Ages</p>
                      <p className="text-black">{selectedAdoption.childrenAges}</p>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Pet Experience */}
              <div>
                <h4 className="font-semibold border-b border-black pb-2 mb-3 text-black">Pet Experience</h4>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600">Has Current Pets</p>
                    <p className="capitalize text-black">{selectedAdoption.hasPets}</p>
                  </div>
                  
                  {selectedAdoption.hasPets === "yes" && (
                    <div>
                      <p className="text-sm text-gray-600">Current Pets</p>
                      <p className="text-black">{selectedAdoption.currentPets}</p>
                    </div>
                  )}
                  
                  <div>
                    <p className="text-sm text-gray-600">Previous Pet Experience</p>
                    <p className="text-black">{selectedAdoption.experience}</p>
                  </div>
                </div>
              </div>
              
              {/* Adoption Details */}
              <div>
                <h4 className="font-semibold border-b border-black pb-2 mb-3 text-black">Adoption Details</h4>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600">Reason for Adopting</p>
                    <p className="text-black">{selectedAdoption.reasonForAdopting}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Care Arrangements</p>
                    <p className="text-black">{selectedAdoption.careArrangements}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="sticky bottom-0 bg-white p-4 border-t border-black flex justify-end space-x-2">
              {selectedAdoption.status === "pending" && (
                <>
                  <button 
                    className="px-4 py-2 bg-white border border-black text-black hover:bg-gray-50 rounded"
                    onClick={() => {
                      closeViewModal();
                      openStatusModal(selectedAdoption, "rejected");
                    }}
                  >
                    Reject
                  </button>
                  <button 
                    className="px-4 py-2 bg-white border border-black text-black hover:bg-gray-50 rounded"
                    onClick={() => {
                      closeViewModal();
                      openStatusModal(selectedAdoption, "approved");
                    }}
                  >
                    Approve
                  </button>
                </>
              )}
              <button className="px-4 py-2 bg-white border border-black text-black hover:bg-gray-50 rounded" onClick={closeViewModal}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Status Update Modal */}
      {isStatusModalOpen && selectedAdoption && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full border border-gray-200">
            <div className="p-4 border-b border-black">
              <h3 className="text-lg font-bold text-black">
                {statusAction === "approved" ? "Approve" : "Reject"} Application
              </h3>
            </div>
            
            <div className="p-6">
              <p className="mb-4 text-black">
                {statusAction === "approved" 
                  ? `Are you sure you want to approve ${selectedAdoption.fullName}'s application?` 
                  : `Are you sure you want to reject ${selectedAdoption.fullName}'s application?`
                }
              </p>
              
              <div className="mb-4">
                <label className="block text-black mb-2">
                  Admin Notes (optional)
                </label>
                <textarea 
                  className="w-full p-2 border border-black rounded h-24 bg-white text-black"
                  placeholder="Add any notes about this decision..."
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                ></textarea>
              </div>
            </div>
            
            <div className="p-4 border-t border-black flex justify-end space-x-2">
              <button 
                className="px-4 py-2 bg-white text-black border border-black rounded hover:bg-gray-50"
                onClick={closeStatusModal}
                disabled={processingStatus}
              >
                Cancel
              </button>
              <button 
                className="px-4 py-2 bg-white text-black border border-black rounded hover:bg-gray-50"
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