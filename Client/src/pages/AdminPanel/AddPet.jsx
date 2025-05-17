

const AddPetPage = () => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
      <h2 className="font-semibold mb-4">Add New Pet</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Pet Name</label>
          <input type="text" className="w-full p-2 border border-gray-300 rounded-md" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Species</label>
          <select className="w-full p-2 border border-gray-300 rounded-md">
            <option>Dog</option>
            <option>Cat</option>
            <option>Bird</option>
            <option>Other</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Breed</label>
          <input type="text" className="w-full p-2 border border-gray-300 rounded-md" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
          <input type="number" className="w-full p-2 border border-gray-300 rounded-md" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea className="w-full p-2 border border-gray-300 rounded-md" rows="3"></textarea>
        </div>
        <div className="pt-2">
          <button className="px-4 py-2 bg-black text-white rounded-lg">Add Pet</button>
        </div>
      </div>
    </div>
  );
};

export default AddPetPage;