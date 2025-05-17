
import { donationStats, recentDonations } from '../../data/MockData';
import StatusBadge from '../../components/StatusBadge';

const AdminDonationPage = () => {
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
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase">
              <th className="px-4 py-2">Donor</th>
              <th className="px-4 py-2">Amount</th>
              <th className="px-4 py-2">Date</th>
              <th className="px-4 py-2">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {recentDonations.map((donation, index) => (
              <tr key={index}>
                <td className="px-4 py-3">{donation.donor}</td>
                <td className="px-4 py-3">{donation.amount}</td>
                <td className="px-4 py-3">{donation.date}</td>
                <td className="px-4 py-3">
                  <StatusBadge status={donation.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDonationPage;