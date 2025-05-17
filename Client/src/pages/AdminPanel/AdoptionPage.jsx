
import { adoptionApplications } from '../../data/MockData';
import StatusBadge from '../../components/StatusBadge';

const AdoptionPage = () => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
      <h2 className="font-semibold mb-4">Adoption Applications</h2>
      <table className="w-full">
        <thead>
          <tr className="bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase">
            <th className="px-4 py-2">ID</th>
            <th className="px-4 py-2">Applicant</th>
            <th className="px-4 py-2">Pet</th>
            <th className="px-4 py-2">Date</th>
            <th className="px-4 py-2">Status</th>
            <th className="px-4 py-2">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {adoptionApplications.map((app) => (
            <tr key={app.id} className="hover:bg-gray-50">
              <td className="px-4 py-3 text-sm">#{app.id}</td>
              <td className="px-4 py-3 text-sm">{app.applicant}</td>
              <td className="px-4 py-3 text-sm">{app.pet}</td>
              <td className="px-4 py-3 text-sm text-gray-500">{app.date}</td>
              <td className="px-4 py-3">
                <StatusBadge status={app.status} />
              </td>
              <td className="px-4 py-3 text-sm">
                <button className="text-blue-600 text-xs underline">
                  {app.status === 'In Review' ? 'Review' : 'View'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdoptionPage;