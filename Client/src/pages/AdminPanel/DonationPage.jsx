import { useState, useEffect } from 'react';
import StatusBadge from '../../components/StatusBadge';

const AdminDonationPage = () => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalDonations: 0,
    totalAmount: 0,
    monthlyDonors: 0
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(10); // Number of items per page

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        setLoading(true);
        // Change this URL to match your API endpoint, adding pagination
        const response = await fetch(`http://localhost:3000/api/donations?page=${currentPage}&limit=${limit}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch donations');
        }
        
        const result = await response.json();
        const data = Array.isArray(result) ? result : result.donations || [];
        
        // If the API returns pagination metadata
        if (result.pagination) {
          setTotalPages(result.pagination.totalPages || 1);
        }
        
        // Set donations data
        setDonations(data);
        
        // For stats, we might need a separate API call to get overall stats
        // or we can calculate from the current page if it's a small dataset
        if (currentPage === 1) {
          // Calculate stats from the actual data or from a separate stats endpoint
          const fetchStats = async () => {
            try {
              const statsResponse = await fetch('http://localhost:3000/api/donations/stats');
              if (statsResponse.ok) {
                const statsData = await statsResponse.json();
                setStats({
                  totalDonations: statsData.totalDonations || 0,
                  totalAmount: statsData.totalAmount?.toLocaleString('en-IN', { 
                    style: 'currency', 
                    currency: 'INR',
                    maximumFractionDigits: 0 
                  }) || '₹0',
                  monthlyDonors: statsData.monthlyDonors || 0
                });
              } else {
                // Fallback to calculating from current page data
                calculateStatsFromData(data);
              }
            } catch (err) {
              console.error('Error fetching stats:', err);
              // Fallback to calculating from current page data
              calculateStatsFromData(data);
            }
          };
          
          fetchStats();
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching donations:', err);
        setError('Failed to load donation data');
        setLoading(false);
      }
    };
    
    const calculateStatsFromData = (data) => {
      const successfulDonations = data.filter(donation => 
        donation.paymentIntentId && !donation.refunded);
      
      const totalAmount = successfulDonations.reduce((sum, donation) => 
        sum + donation.amount, 0);
      
      const monthlyDonors = successfulDonations.filter(donation => 
        donation.isMonthly).length;
      
      setStats({
        totalDonations: successfulDonations.length,
        totalAmount: totalAmount.toLocaleString('en-IN', { 
          style: 'currency', 
          currency: 'INR',
          maximumFractionDigits: 0 
        }),
        monthlyDonors
      });
    };

    fetchDonations();
  }, [currentPage, limit]);

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  // Prepare stats for display
  const donationStats = [
    { label: 'Total Donations', value: stats.totalDonations },
    { label: 'Total Amount', value: stats.totalAmount },
    { label: 'Monthly Donors', value: stats.monthlyDonors }
  ];

  // Show loading state
  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
        <p className="text-center py-8">Loading donation data...</p>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
        <p className="text-center py-8 text-red-500">{error}</p>
        <button 
          className="mx-auto block mt-2 px-4 py-2 bg-blue-500 text-white rounded"
          onClick={() => window.location.reload()}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
      <h2 className="font-semibold mb-4">Donation Management</h2>
      <div className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {donationStats.map((stat, index) => (
            <div key={index} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <div className="text-sm text-gray-500">{stat.label}</div>
              <div className="text-2xl font-bold">{stat.value}</div>
            </div>
          ))}
        </div>
      </div>
      <div>
        <h3 className="font-medium mb-2">Recent Donations</h3>
        {donations.length > 0 ? (
          <>
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase">
                  <th className="px-4 py-2">Donor</th>
                  <th className="px-4 py-2">Amount</th>
                  <th className="px-4 py-2">Fund Type</th>
                  <th className="px-4 py-2">Date</th>
                  <th className="px-4 py-2">Status</th>
                 
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {donations.map((donation) => (
                  <tr key={donation._id}>
                    <td className="px-4 py-3">{`${donation.firstName} ${donation.lastName}`}</td>
                    <td className="px-4 py-3">
                      ₹{donation.amount.toLocaleString('en-IN')}
                      {donation.isMonthly && <span className="ml-1 text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">Monthly</span>}
                    </td>
                    <td className="px-4 py-3 capitalize">{donation.fundType}</td>
                    <td className="px-4 py-3">{formatDate(donation.createdAt)}</td>
                    <td className="px-4 py-3">
                      <StatusBadge status={donation.paymentIntentId ? "successful" : "pending"} />
                    </td>
                   
                  </tr>
                ))}
              </tbody>
            </table>
            
            {/* Pagination Controls */}
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
              <div className="text-sm text-gray-500">
                Showing page {currentPage} of {totalPages}
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className={`px-3 py-1 rounded ${
                    currentPage === 1 
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                      : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                  }`}
                >
                  Previous
                </button>
                <button
                  onClick={() => setCurrentPage(prev => prev + 1)}
                  disabled={currentPage >= totalPages}
                  className={`px-3 py-1 rounded ${
                    currentPage >= totalPages 
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                      : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                  }`}
                >
                  Next
                </button>
              </div>
            </div>
          </>
        ) : (
          <p className="text-center py-4 text-gray-500">No donations found</p>
        )}
      </div>
    </div>
  );
};

export default AdminDonationPage;