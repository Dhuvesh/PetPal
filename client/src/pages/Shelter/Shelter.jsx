import React from 'react';
import { Heart, PawPrint, AlertCircle, Clock } from 'lucide-react';

const StrayCausePage = () => {
  return (
    <div className="min-h-screen bg-green-50">
      {/* Urgent Banner */}
      <div className="bg-orange-100 border-b border-orange-200">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="flex items-center justify-center text-orange-700">
            <AlertCircle className="h-5 w-5 mr-2" />
            <span>Urgent: We need foster homes for 5 newly rescued puppies</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Current Needs Section */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex items-center mb-4">
            <Clock className="h-6 w-6 text-green-600 mr-2" />
            <h2 className="text-xl font-semibold text-gray-800">Immediate Needs</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-red-50 p-4 rounded-lg border border-red-100">
              <h3 className="font-semibold text-red-700 mb-2">Critical</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Emergency medical supplies</li>
                <li>• Puppy formula</li>
                <li>• Heating pads</li>
              </ul>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100">
              <h3 className="font-semibold text-yellow-700 mb-2">Needed Soon</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Dog food (all ages)</li>
                <li>• Clean blankets</li>
                <li>• Leashes and collars</li>
              </ul>
            </div>
            <div className="bg-green-50 p-4 rounded-lg border border-green-100">
              <h3 className="font-semibold text-green-700 mb-2">Ongoing Needs</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Volunteers for walks</li>
                <li>• Foster homes</li>
                <li>• Transportation help</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Recent Rescues */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Recent Rescues Needing Help</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((rescue) => (
              <div key={rescue} className="bg-white rounded-xl shadow-sm overflow-hidden">
                <img 
                  src={`/api/placeholder/400/300`} 
                  alt="Rescued dog" 
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-gray-800">Max</h3>
                    <span className="bg-green-100 text-green-700 text-sm py-1 px-2 rounded">Medical Care</span>
                  </div>
                  <p className="text-gray-600 text-sm mb-4">
                    Found injured on the street. Needs surgery and recovery care.
                  </p>
                  <div className="space-y-3">
                    <div className="bg-gray-100 rounded-lg p-3">
                      <div className="text-sm text-gray-600 mb-1">Medical Fund Progress</div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div className="bg-green-600 h-2.5 rounded-full" style={{width: '45%'}}></div>
                      </div>
                      <div className="text-sm text-gray-600 mt-1">$450 of $1,000 raised</div>
                    </div>
                    <button className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors">
                      Help Max
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <div className="bg-green-600 rounded-xl p-6 text-white">
            <h3 className="text-xl font-semibold mb-4">Become a Foster Parent</h3>
            <p className="mb-6">Open your heart and home to a dog in need. We provide all supplies and medical care.</p>
            <button className="bg-white text-green-600 px-6 py-2 rounded-lg hover:bg-green-50 transition-colors">
              Apply Now
            </button>
          </div>
          <div className="bg-white rounded-xl p-6 border-2 border-green-600">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Make a Donation</h3>
            <div className="grid grid-cols-3 gap-3 mb-6">
              <button className="bg-green-50 text-green-700 py-2 rounded hover:bg-green-100 transition-colors">
                $25
              </button>
              <button className="bg-green-50 text-green-700 py-2 rounded hover:bg-green-100 transition-colors">
                $50
              </button>
              <button className="bg-green-50 text-green-700 py-2 rounded hover:bg-green-100 transition-colors">
                $100
              </button>
            </div>
            <button className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors">
              Custom Amount
            </button>
          </div>
        </div>

        {/* Urgent Cases */}
        <div className="bg-orange-50 rounded-xl p-6 mb-12">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Emergency Cases</h2>
          <div className="space-y-4">
            {[1, 2].map((emergency) => (
              <div key={emergency} className="bg-white rounded-lg p-4 flex items-center gap-4">
                <img 
                  src={`/api/placeholder/100/100`} 
                  alt="Emergency case" 
                  className="w-20 h-20 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-gray-800">Luna</h3>
                    <span className="bg-red-100 text-red-700 text-sm py-1 px-2 rounded">Urgent</span>
                  </div>
                  <p className="text-sm text-gray-600">Needs immediate surgery for broken leg</p>
                  <div className="mt-2">
                    <button className="text-green-600 hover:text-green-700 text-sm font-semibold">
                      Help Now →
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Impact Stats */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-800 mb-6 text-center">Your Impact This Month</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-1">23</div>
              <div className="text-gray-600">Dogs Rescued</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-1">15</div>
              <div className="text-gray-600">Adoptions</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-1">45</div>
              <div className="text-gray-600">Medical Treatments</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-1">$8.2k</div>
              <div className="text-gray-600">Donations Received</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StrayCausePage;