import React from 'react';

const ReportSection = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Report submitted! (mock)');
    e.target.reset();
  };

  return (
    <section id="reports" className="bg-white rounded-none shadow-lg p-8 border-b border-blue-100 w-full">
      <h2 className="text-3xl font-extrabold mb-4 text-blue-800">Submit a Report</h2>
      <form onSubmit={handleSubmit} className="max-w-xl space-y-4">
        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700">Report Content</label>
          <textarea id="content" name="content" rows="4" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" required></textarea>
        </div>
        <div>
          <label htmlFor="image_url" className="block text-sm font-medium text-gray-700">Image URL (Optional)</label>
          <input type="url" id="image_url" name="image_url" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" />
        </div>
        <button type="submit" className="bg-blue-600 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 transition-colors">
          Submit Report
        </button>
      </form>
    </section>
  );
};

export default ReportSection; 