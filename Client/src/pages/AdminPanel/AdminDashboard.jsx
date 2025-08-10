import { useState, useEffect } from 'react';
import { Calendar, Users, Heart, CheckCircle, Clock, TrendingUp, Dog, Mail,  AlertCircle } from 'lucide-react';

const Dashboard = () => {
   const API_URL = import.meta.env.VITE_API_URL;
  const [dashboardStats, setDashboardStats] = useState({
    totalPets: 0,
    activeOwners: 0,
    pendingVerification: 0,
    adoptionRate: 0
  });
  
  const [adoptionStats, setAdoptionStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    withdrawn: 0
  });
  
  const [donationStats, setDonationStats] = useState({
    total: 0,
    totalAmount: 0,
    recent: 0
  });
  const [recentActivities, setRecentActivities] = useState([]);
  const [recentAdoptions, setRecentAdoptions] = useState([]);
  const [recentPets, setRecentPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [apiErrors, setApiErrors] = useState({});

  // Helper function to make API calls with error handling
  const fetchWithErrorHandling = async (url, errorKey) => {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`Error fetching ${errorKey}:`, error);
      setApiErrors(prev => ({ ...prev, [errorKey]: error.message }));
      return null;
    }
  };

  // Fetch data from your backend APIs
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);
        setApiErrors({});
        
        // Fetch adoption statistics
        const adoptionData = await fetchWithErrorHandling(`${API_URL}/api/adoptions/stats`, 'adoptions');
        if (adoptionData) {
          setAdoptionStats(adoptionData);
        }
        
        // Fetch all pets
        const petsData = await fetchWithErrorHandling(`${API_URL}/api/pets/get-pet`, 'pets');
        const pets = petsData || [];
        
        // Fetch recent adoption requests
        const recentAdoptionsData = await fetchWithErrorHandling(`${API_URL}/api/adoptions/get-requests?limit=5`, 'recentAdoptions');
        const recentAdoptions = recentAdoptionsData || [];
        
        // Fetch donation statistics (optional - won't break if not available)
        const donationData = await fetchWithErrorHandling(`${API_URL}/api/donations/stats`, 'donations');
        if (donationData) {
          setDonationStats(donationData);
        }
        
        // Calculate dashboard statistics
        const totalPets = pets.length;
        const activeOwners = pets.length > 0 ? new Set(pets.map(pet => pet.owner?.email).filter(Boolean)).size : 0;
        const pendingVerification = adoptionData?.pending || 0;
        const adoptionRate = adoptionData?.total > 0 ? 
          Math.round((adoptionData.approved / adoptionData.total) * 100) : 0;
        
        setDashboardStats({
          totalPets,
          activeOwners,
          pendingVerification,
          adoptionRate
        });
        
        setRecentAdoptions(recentAdoptions);
        setRecentPets(pets.slice(0, 5));
        
        // Create recent activities from different sources
        const activities = [];
        
        // Add recent adoptions to activities
        recentAdoptions.forEach(adoption => {
          activities.push({
            title: `New Adoption Request for ${adoption.petId?.name || 'Unknown Pet'}`,
            details: `${adoption.fullName} applied to adopt`,
            time: new Date(adoption.createdAt).toLocaleDateString(),
            type: 'adoption',
            status: adoption.status
          });
        });
        
        // Add recent pet listings to activities
        pets.slice(0, 3).forEach(pet => {
          activities.push({
            title: `New Pet Listed: ${pet.name}`,
            details: `${pet.breed} from ${pet.location}`,
            time: new Date(pet.createdAt).toLocaleDateString(),
            type: 'pet',
            status: 'active'
          });
        });
        
        // Sort activities by date and take latest 6
        activities.sort((a, b) => new Date(b.time) - new Date(a.time));
        setRecentActivities(activities.slice(0, 6));
        
      } catch (err) {
        setError('Failed to fetch dashboard data');
        console.error('Dashboard fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-white p-6 rounded-lg shadow-sm">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
              <div className="text-red-800 font-medium">Error Loading Dashboard</div>
            </div>
            <div className="text-red-600 text-sm mt-1">{error}</div>
          </div>
          
          {/* Show specific API errors */}
          {Object.keys(apiErrors).length > 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="text-yellow-800 font-medium mb-2">API Connection Issues:</div>
              <ul className="text-yellow-700 text-sm space-y-1">
                {Object.entries(apiErrors).map(([key, error]) => (
                  <li key={key}>• {key}: {error}</li>
                ))}
              </ul>
              <div className="text-yellow-600 text-xs mt-2">
                Please ensure your backend server is running and the API endpoints are accessible.
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  const statCards = [
    {
      label: 'Total Pets',
      value: dashboardStats.totalPets,
      change: `+${Math.floor(Math.random() * 10) + 1}`,
      icon: Dog,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50'
    },
    {
      label: 'Active Owners',
      value: dashboardStats.activeOwners,
      change: `+${Math.floor(Math.random() * 5) + 1}`,
      icon: Users,
      color: 'bg-green-500',
      bgColor: 'bg-green-50'
    },
    {
      label: 'Pending Verification',
      value: dashboardStats.pendingVerification,
      change: `${Math.floor(Math.random() * 5) + 1}`,
      icon: Clock,
      color: 'bg-yellow-500',
      bgColor: 'bg-yellow-50'
    },
    {
      label: 'Adoption Rate',
      value: `${dashboardStats.adoptionRate}%`,
      change: `+${Math.floor(Math.random() * 5) + 1}%`,
      icon: TrendingUp,
      color: 'bg-purple-500',
      bgColor: 'bg-purple-50'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'withdrawn': return 'bg-gray-100 text-gray-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case 'adoption': return Heart;
      case 'pet': return Dog;
      case 'donation': return CheckCircle;
      default: return Calendar;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Pet Adoption Dashboard</h1>
          <p className="text-gray-600 mt-2">Monitor your pet adoption platform's performance</p>
        </div>

        {/* Show API warnings if any */}
        {Object.keys(apiErrors).length > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-yellow-500 mr-2" />
              <div className="text-yellow-800 font-medium">Some data may be incomplete</div>
            </div>
            <div className="text-yellow-600 text-sm mt-1">
              {Object.keys(apiErrors).join(', ')} endpoints are not responding properly.
            </div>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <div key={index} className={`${stat.bgColor} p-6 rounded-lg shadow-sm border border-gray-200`}>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-gray-600">{stat.label}</div>
                    <div className="mt-2 flex items-end justify-between">
                      <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {stat.change} this week
                    </div>
                  </div>
                  <div className={`${stat.color} p-3 rounded-full`}>
                    <IconComponent className="h-6 w-6 text-white" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Activities */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Recent Activities</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {recentActivities.length > 0 ? (
                  recentActivities.map((activity, index) => {
                    const ActivityIcon = getActivityIcon(activity.type);
                    return (
                      <div key={index} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                        <div className="p-2 bg-white rounded-full shadow-sm">
                          <ActivityIcon className="h-4 w-4 text-gray-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-gray-900">{activity.title}</div>
                          <div className="text-sm text-gray-500 mt-1">{activity.details}</div>
                          <div className="flex items-center mt-2 space-x-2">
                            <span className="text-xs text-gray-400">{activity.time}</span>
                            {activity.status && (
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(activity.status)}`}>
                                {activity.status}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No recent activities to display
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Adoption Statistics */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Adoption Statistics</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Total Requests</span>
                  <span className="font-semibold">{adoptionStats.total}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Pending</span>
                  <span className="font-semibold text-yellow-600">{adoptionStats.pending}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Approved</span>
                  <span className="font-semibold text-green-600">{adoptionStats.approved}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Rejected</span>
                  <span className="font-semibold text-red-600">{adoptionStats.rejected}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Withdrawn</span>
                  <span className="font-semibold text-gray-600">{adoptionStats.withdrawn}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Adoptions */}
        <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Recent Adoption Requests</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Applicant
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Pet
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentAdoptions.length > 0 ? (
                  recentAdoptions.map((adoption, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-gray-300 rounded-full flex items-center justify-center">
                            <Users className="h-5 w-5 text-gray-600" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{adoption.fullName}</div>
                            <div className="text-sm text-gray-500 flex items-center">
                              <Mail className="h-3 w-3 mr-1" />
                              {adoption.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {adoption.petId?.name || 'Unknown Pet'}
                        </div>
                        <div className="text-sm text-gray-500">
                          {adoption.petId?.breed || 'Unknown Breed'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(adoption.status)}`}>
                          {adoption.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(adoption.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
                      No recent adoptions to display
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Donation Statistics (if available) */}
        {donationStats.total > 0 && (
          <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Donation Statistics</h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">₹{donationStats.totalAmount.toLocaleString()}</div>
                  <div className="text-sm text-gray-600">Total Raised</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{donationStats.total}</div>
                  <div className="text-sm text-gray-600">Total Donations</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{donationStats.recent}</div>
                  <div className="text-sm text-gray-600">Recent (30 days)</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;