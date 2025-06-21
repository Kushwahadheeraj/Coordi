import React from 'react';

const mockReports = [
  { id: 1, content: 'Major bridge collapse reported, image seems to be from a movie scene.', image_url: 'http://example.com/fake.jpg', status: 'Manipulated' },
  { id: 2, content: 'Flooding at 5th and Main. Image confirmed by multiple sources.', image_url: 'http://example.com/real.jpg', status: 'Verified' },
  { id: 3, content: 'Request for shelter at high school gym. Image analysis in progress.', image_url: 'http://example.com/pending.jpg', status: 'Pending' },
];

const VerificationSection = () => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'Verified': return 'bg-green-100 text-green-800';
      case 'Manipulated': return 'bg-red-100 text-red-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  return (
    <section id="verification-status" className="bg-white rounded-none shadow-lg p-8 w-full">
      <h2 className="text-3xl font-extrabold mb-4 text-blue-800">Image Verification Status</h2>
      <div className="space-y-4">
        {mockReports.map(report => (
          <div key={report.id} className="p-4 border rounded-lg bg-gray-50 flex justify-between items-center">
            <div>
              <p className="text-gray-800">{report.content}</p>
              <a href={report.image_url} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-500 hover:underline">View Image</a>
            </div>
            <span className={`text-sm font-semibold px-3 py-1 rounded-full ${getStatusColor(report.status)}`}>
              {report.status}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default VerificationSection; 