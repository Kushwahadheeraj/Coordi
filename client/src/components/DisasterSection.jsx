import React, { useState } from 'react';

const mockDisasters = [
  { id: 1, title: 'NYC Flood', location_name: 'Manhattan, NYC', description: 'Heavy flooding in Manhattan', tags: ['flood', 'urgent'], owner_id: 'netrunnerX' },
  { id: 2, title: 'California Wildfire', location_name: 'Napa Valley, CA', description: 'Large wildfire spreading across Napa Valley.', tags: ['fire', 'evacuation'], owner_id: 'reliefAdmin' },
];

const DisasterSection = () => {
  const [disasters, setDisasters] = useState(mockDisasters);
  const [selectedDisaster, setSelectedDisaster] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const handleSelectDisaster = (disaster) => {
    setSelectedDisaster(disaster);
    setIsFormOpen(true);
  };

  const handleAddNew = () => {
    setSelectedDisaster(null);
    setIsFormOpen(true);
  };

  const handleDelete = (id) => {
    setDisasters(disasters.filter(d => d.id !== id));
    // In a real app: await fetch(`/api/disasters/${id}`, { method: 'DELETE' });
  };

  const handleSave = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const updatedDisaster = {
      title: formData.get('title'),
      location_name: formData.get('location_name'),
      description: formData.get('description'),
      tags: formData.get('tags').split(',').map(t => t.trim()),
    };

    if (selectedDisaster) {
      // Update
      const newDisasters = disasters.map(d => d.id === selectedDisaster.id ? { ...d, ...updatedDisaster } : d);
      setDisasters(newDisasters);
    } else {
      // Create
      const newDisaster = { ...updatedDisaster, id: Date.now(), owner_id: 'currentUser' };
      setDisasters([...disasters, newDisaster]);
    }
    setIsFormOpen(false);
    setSelectedDisaster(null);
  };

  return (
    <section id="disaster-management" className="bg-white rounded-none shadow-lg p-8 border-b border-blue-100 w-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-extrabold text-blue-800">Disaster Management</h2>
        <button onClick={handleAddNew} className="bg-blue-600 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 transition-colors">
          Add New Disaster
        </button>
      </div>

      {isFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-lg">
            <h3 className="text-2xl font-bold mb-4">{selectedDisaster ? 'Edit Disaster' : 'Create New Disaster'}</h3>
            <form onSubmit={handleSave}>
              <div className="space-y-4">
                <input name="title" placeholder="Title" defaultValue={selectedDisaster?.title} className="w-full p-2 border rounded" required />
                <input name="location_name" placeholder="Location Name (e.g., Manhattan, NYC)" defaultValue={selectedDisaster?.location_name} className="w-full p-2 border rounded" required />
                <textarea name="description" placeholder="Description" defaultValue={selectedDisaster?.description} className="w-full p-2 border rounded" rows="4" required />
                <input name="tags" placeholder="Tags (comma-separated, e.g., flood,urgent)" defaultValue={selectedDisaster?.tags.join(', ')} className="w-full p-2 border rounded" />
              </div>
              <div className="flex justify-end gap-4 mt-6">
                <button type="button" onClick={() => setIsFormOpen(false)} className="bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded">Cancel</button>
                <button type="submit" className="bg-green-500 text-white font-bold py-2 px-4 rounded">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {disasters.map(d => (
          <div key={d.id} className="bg-gray-50 p-4 rounded-lg shadow border">
            <h4 className="font-bold text-lg text-blue-900">{d.title}</h4>
            <p className="text-sm text-gray-600">{d.location_name}</p>
            <p className="my-2 text-gray-800">{d.description}</p>
            <div className="flex flex-wrap gap-2 my-2">
              {d.tags.map(tag => <span key={tag} className="bg-blue-100 text-blue-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded-full">{tag}</span>)}
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button onClick={() => handleSelectDisaster(d)} className="text-sm text-blue-600 hover:underline">Edit</button>
              <button onClick={() => handleDelete(d.id)} className="text-sm text-red-600 hover:underline">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default DisasterSection; 