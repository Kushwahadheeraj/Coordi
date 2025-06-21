import React from 'react';

const mockResources = [
  { id: 1, name: 'Red Cross Shelter', location_name: 'Community Center, 12th St', type: 'shelter', distance: '1.2km away' },
  { id: 2, name: 'FEMA Food Distribution', location_name: 'City Hall Park', type: 'food', distance: '2.5km away' },
  { id: 3, name: 'Medical Tent', location_name: 'Corner of Spring St & Mott St', type: 'medical', distance: '3.1km away' },
];

const ResourceSection = () => (
  <section id="resources" className="bg-white rounded-none shadow-lg p-8 border-b border-blue-100 w-full">
    <h2 className="text-3xl font-extrabold mb-4 text-blue-800">Nearby Resources</h2>
    <div className="space-y-4">
      {mockResources.map(resource => (
        <div key={resource.id} className="p-4 border rounded-lg bg-gray-50 flex justify-between items-center">
          <div>
            <h4 className="font-bold text-lg text-blue-900">{resource.name}</h4>
            <p className="text-sm text-gray-600">{resource.location_name}</p>
          </div>
          <div className="text-right">
            <span className="bg-green-100 text-green-800 text-sm font-semibold px-3 py-1 rounded-full">{resource.type}</span>
            <p className="text-sm text-gray-500 mt-1">{resource.distance}</p>
          </div>
        </div>
      ))}
    </div>
  </section>
);

export default ResourceSection; 