import { useState, useEffect } from 'react';
import { useAuthStore } from '../store/UseAuthStore';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Shield, Phone, Mail, Home, AlertCircle, Check, UserCheck } from 'lucide-react';

const MyApplications = () => {
  const { authUser } = useAuthStore();
  const [applications, setApplications] = useState([]); // Ensure it's initialized as an empty array
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchApplications = async () => {
      if (!authUser) return;
      
      try {
        setLoading(true);
        // Use the dedicated endpoint for user applications
        const response = await axios.get(`/api/adoptions/user-applications?email=${authUser.email}`);
        
        // Ensure the response data is an array before setting the state
        const applicationsData = Array.isArray(response.data) ? response.data : [];
        setApplications(applicationsData);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching applications:', err);
        setError('Failed to load your applications. Please try again later.');
        setLoading(false);
      }
    };

    fetchApplications();
  }, [authUser]);

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'withdrawn':
        return 'bg-gray-100 text-gray-800';
      default: // pending
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const openOwnerInfoModal = (application) => {
    setSelectedApplication(application);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedApplication(null);
    setIsModalOpen(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4">
        <div className="bg-red-100 text-red-700 p-4 rounded-lg">
          <p>{error}</p>
        </div>
        <button 
          onClick={() => window.location.reload()}
          className="mt-4 btn btn-primary"
        >
          Try Again
        </button>
      </div>
    );
  }

  // Debug check - log the applications type and content
  console.log('Applications type:', typeof applications);
  console.log('Is applications an array?', Array.isArray(applications));
  console.log('Applications content:', applications);

  // Ensure applications is an array before rendering
  const applicationsArray = Array.isArray(applications) ? applications : [];

  return (
    <div className="container mx-auto px-4 pt-24 pb-12">
      <h1 className="text-2xl font-bold mb-6">My Adoption Applications</h1>
      
      {applicationsArray.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-lg mb-4">You haven't submitted any adoption applications yet.</p>
          <Link to="/adopt" className="btn btn-primary">
            Browse Pets for Adoption
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {applicationsArray.map((application) => (
            <div key={application._id} className="bg-base-100 border border-base-300 rounded-lg overflow-hidden shadow-sm">
              <div className="p-4">
                <div className="flex justify-between items-start mb-3">
                  <h2 className="text-xl font-semibold">
                    {application.petId?.name || "Pet"}
                  </h2>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(application.status)}`}>
                    {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                  </span>
                </div>
                
                <p className="text-sm mb-3">
                  <span className="font-medium">Submitted:</span> {formatDate(application.createdAt)}
                </p>
                
                {application.updatedAt !== application.createdAt && (
                  <p className="text-sm mb-3">
                    <span className="font-medium">Last Updated:</span> {formatDate(application.updatedAt)}
                  </p>
                )}

                {/* Pet Information */}
                {application.petId && (
                  <div className="border-t border-base-300 pt-3 mt-3">
                    <div className="flex gap-3">
                      {application.petId.photos && application.petId.photos.length > 0 ? (
                        <img 
                          src={application.petId.photos[0]} 
                          alt={application.petId.name}
                          className="w-20 h-20 object-cover rounded-lg"
                        />
                      ) : (
                        <div className="w-20 h-20 bg-base-200 rounded-lg flex items-center justify-center">
                          <span className="text-xs text-base-content/60">No image</span>
                        </div>
                      )}
                      <div>
                        <p className="text-sm"><span className="font-medium">Breed:</span> {application.petId.breed}</p>
                        <p className="text-sm"><span className="font-medium">Age:</span> {application.petId.age}</p>
                        <p className="text-sm"><span className="font-medium">Gender:</span> {application.petId.gender}</p>
                        <p className="text-sm"><span className="font-medium">Location:</span> {application.petId.location}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Status-specific messages */}
                {application.status === 'pending' && (
                  <div className="mt-4 pt-3 border-t border-base-300">
                    <p className="text-sm flex items-center gap-2 text-yellow-600 bg-yellow-50 p-3 rounded-md border border-yellow-100">
                      <AlertCircle size={16} />
                      Your application is currently under review. We'll notify you when there's an update.
                    </p>
                  </div>
                )}
                
                {application.status === 'rejected' && (
                  <div className="mt-4 pt-3 border-t border-base-300">
                    <p className="text-sm flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-md border border-red-100">
                      <AlertCircle size={16} />
                      Unfortunately, your application wasn't approved at this time. Please check any admin notes for more details.
                    </p>
                  </div>
                )}
                
                {application.status === 'withdrawn' && (
                  <div className="mt-4 pt-3 border-t border-base-300">
                    <p className="text-sm flex items-center gap-2 text-gray-600 bg-gray-50 p-3 rounded-md border border-gray-100">
                      <AlertCircle size={16} />
                      This application has been withdrawn. You can submit a new application if you're interested in adopting again.
                    </p>
                  </div>
                )}

                {/* Approved application notification */}
                {application.status === 'approved' && (
                  <div className="mt-4 pt-3 border-t border-base-300">
                    <div className="bg-green-50 p-3 rounded-md border border-green-100">
                      <p className="text-sm flex items-center gap-2 text-green-700 font-medium mb-2">
                        <Check size={16} />
                        Congratulations! Your application has been approved.
                      </p>
                      <p className="text-sm text-green-700">
                        You can now view the owner's contact information and arrange the adoption.
                      </p>
                    </div>
                  </div>
                )}

                {/* Admin Notes (if any) */}
                {application.adminNotes && (
                  <div className="mt-4 pt-3 border-t border-base-300">
                    <h3 className="font-semibold text-sm mb-2">Additional Notes</h3>
                    <p className="text-sm italic">{application.adminNotes}</p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="mt-4 flex gap-2">
                  <Link
                    to={`/pet/${application.petId?._id}`}
                    className="btn btn-outline btn-sm flex-1"
                  >
                    View Pet Details
                  </Link>
                  
                  {application.status === 'pending' && (
                    <button
                      onClick={() => {
                        if (window.confirm('Are you sure you want to withdraw this application?')) {
                          // Implement withdrawal logic here
                          alert('This feature will be implemented soon.');
                        }
                      }}
                      className="btn btn-error btn-sm btn-outline flex-1"
                    >
                      Withdraw
                    </button>
                  )}
                  
                  {application.status === 'approved' && (
                    <button
                      onClick={() => openOwnerInfoModal(application)}
                      className="btn btn-primary btn-sm flex-1 flex items-center gap-1"
                    >
                      <UserCheck size={16} />
                      Contact Owner
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Owner Information Modal */}
      {isModalOpen && selectedApplication && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-4 border-b">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Shield size={20} className="text-green-600" /> 
                Owner Contact Information
              </h3>
            </div>
            
            <div className="p-6">
              {selectedApplication.petId?.owner ? (
                <div className="space-y-4">
                  <p className="text-lg font-medium mb-2">
                    Contact details for {selectedApplication.petId.name}'s owner:
                  </p>
                  
                  <div className="flex items-center gap-3">
                    <UserCheck size={20} className="text-gray-500" />
                    <div>
                      <p className="font-medium">{selectedApplication.petId.owner.fullName}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Mail size={20} className="text-gray-500" />
                    <div>
                      <p>{selectedApplication.petId.owner.email}</p>
                      <p className="text-xs text-gray-500">Email</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Phone size={20} className="text-gray-500" />
                    <div>
                      <p>{selectedApplication.petId.owner.phone}</p>
                      <p className="text-xs text-gray-500">Phone</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Home size={20} className="text-gray-500 mt-1" />
                    <div>
                      <p>{selectedApplication.petId.owner.address}</p>
                      <p className="text-xs text-gray-500">Address</p>
                    </div>
                  </div>
                  
                  <div className="bg-blue-50 p-3 rounded-md text-sm mt-4">
                    <p className="font-medium text-blue-700 mb-1">Next steps:</p>
                    <ol className="list-decimal list-inside text-blue-700 space-y-1">
                      <li>Contact the owner using the information above</li>
                      <li>Arrange a meeting to see the pet again if needed</li>
                      <li>Discuss the adoption process and any requirements</li>
                      <li>Finalize the adoption details</li>
                    </ol>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-red-600">
                    Owner information is not available. Please contact the shelter for assistance.
                  </p>
                </div>
              )}
            </div>
            
            <div className="p-4 border-t flex justify-end">
              <button 
                onClick={closeModal}
                className="btn btn-primary"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyApplications;