

const StatusBadge = ({ status }) => {
  let bgColor = 'bg-gray-100';
  let textColor = 'text-gray-800';
  
  if (status.toLowerCase() === 'approved' || status.toLowerCase() === 'completed' || status.toLowerCase() === 'active') {
    bgColor = 'bg-green-100';
    textColor = 'text-green-800';
  } else if (status.toLowerCase() === 'rejected') {
    bgColor = 'bg-red-100';
    textColor = 'text-red-800';
  } else if (status.toLowerCase() === 'in review') {
    bgColor = 'bg-yellow-100';
    textColor = 'text-yellow-800';
  }
  
  return (
    <span className={`inline-flex px-2 py-0.5 rounded-full text-xs ${bgColor} ${textColor}`}>
      {status}
    </span>
  );
};

export default StatusBadge;