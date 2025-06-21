import React from 'react';

const mockFeed = [
  { id: 1, user: 'citizen1', post: '#floodrelief Need food and water in Lower East Side. Family of 4.', time: '5m ago' },
  { id: 2, user: 'helper2', post: 'We have a temporary shelter at the community center on 12th St. #NYCShelter', time: '15m ago' },
  { id: 3, user: 'reporter3', post: 'Power lines down near Canal St. Please avoid the area. #safety #NYCFlood', time: '30m ago' },
];

const SocialFeedSection = () => (
  <section id="social-media" className="bg-white rounded-none shadow-lg p-8 border-b border-blue-100 w-full">
    <h2 className="text-3xl font-extrabold mb-4 text-blue-800">Real-Time Social Media Feed</h2>
    <div className="space-y-4">
      {mockFeed.map(item => (
        <div key={item.id} className="p-4 border rounded-lg bg-gray-50">
          <p className="text-gray-800">{item.post}</p>
          <div className="text-sm text-gray-500 mt-2">
            <span>@{item.user}</span> &middot; <span>{item.time}</span>
          </div>
        </div>
      ))}
    </div>
    <p className="text-sm text-gray-500 mt-4">Updates will appear in real-time via WebSockets.</p>
  </section>
);

export default SocialFeedSection; 