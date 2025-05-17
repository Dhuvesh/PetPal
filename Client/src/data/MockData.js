// Dashboard stats
export const dashboardStats = [
  { label: 'Total Pets', value: '238', change: '+14' },
  { label: 'Active Owners', value: '143', change: '+12' },
  { label: 'Pending Verifications', value: '27', change: '+4' },
  { label: 'Adoption Rate', value: '68%', change: '+2%' }
];

// Recent activity data
export const recentActivities = [
  { title: 'New pet added', details: 'Max, Golden Retriever · 10 minutes ago' },
  { title: 'Owner verification approved', details: 'Sarah Williams · 1 hour ago' },
  { title: 'Donation received', details: '$150 from John Smith · 3 hours ago' }
];

// Verification requests data
export const verificationRequests = [
  { id: 1, name: 'Emma Johnson', date: 'May 15, 2025', status: 'pending' },
  { id: 2, name: 'Michael Chen', date: 'May 14, 2025', status: 'pending' },
  { id: 3, name: 'Sophia Rodriguez', date: 'May 13, 2025', status: 'pending' },
  { id: 4, name: 'James Wilson', date: 'May 12, 2025', status: 'pending' },
  { id: 5, name: 'Olivia Davis', date: 'May 11, 2025', status: 'pending' },
];

// Donation data
export const donationStats = [
  { label: 'Total Donations', value: '$8,245' },
  { label: 'This Month', value: '$1,280' },
  { label: 'Average Donation', value: '$58' }
];

export const recentDonations = [
  { donor: 'John Smith', amount: '$150', date: 'May 15, 2025', status: 'Completed' },
  { donor: 'Maria Garcia', amount: '$75', date: 'May 14, 2025', status: 'Completed' },
  { donor: 'David Lee', amount: '$200', date: 'May 13, 2025', status: 'Completed' }
];

// Adoption applications data
export const adoptionApplications = [
  { id: '104', applicant: 'Rebecca Johnson', pet: 'Bella (Cat)', date: 'May 15, 2025', status: 'In Review' },
  { id: '103', applicant: 'Thomas Wright', pet: 'Max (Dog)', date: 'May 14, 2025', status: 'Approved' },
  { id: '102', applicant: 'Sarah Miller', pet: 'Daisy (Dog)', date: 'May 13, 2025', status: 'Rejected' }
];

// User management data
export const users = [
  { name: 'Admin User', email: 'admin@petpal.com', role: 'Administrator', status: 'Active' },
  { name: 'Emily Davis', email: 'emily@petpal.com', role: 'Volunteer', status: 'Active' },
  { name: 'Mark Wilson', email: 'mark@petpal.com', role: 'Volunteer', status: 'Inactive' }
];

// Menu items for sidebar
export const menuItems = [
  { name: 'Dashboard', path: '/ngo-panel/dashboard', icon: 'LayoutDashboard' },
  { name: 'Add Pet', path: '/ngo-panel/add-pet', icon: 'PlusCircle' },
  { name: 'Donation Management', path: '/ngo-panel/donations', icon: 'Heart' },
  { name: 'Adoption Applications', path: '/ngo-panel/adoptions', icon: 'ClipboardList' },
  { name: 'User Management', path: '/ngo-panel/users', icon: 'Users' }
];