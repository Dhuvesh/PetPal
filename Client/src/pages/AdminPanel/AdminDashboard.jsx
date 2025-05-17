
import { dashboardStats, recentActivities } from '../../data/MockData';

const Dashboard = () => {
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {dashboardStats.map((stat, index) => (
          <div key={index} className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
            <div className="text-sm text-gray-500">{stat.label}</div>
            <div className="mt-1 flex items-end justify-between">
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="text-xs text-gray-600">
                {stat.change} this week
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
        <h2 className="font-semibold mb-4">Recent Activity</h2>
        <div className="space-y-4">
          {recentActivities.map((activity, index) => (
            <div key={index} className="p-3 bg-gray-50 rounded-lg">
              <div className="font-medium">{activity.title}</div>
              <div className="text-sm text-gray-500">{activity.details}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;