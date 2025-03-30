import React from "react";

const Packages = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-center mb-6">Our Services</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Card 1 */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-6">
            <h3 className="text-xl font-semibold mb-2">Service 1</h3>
            <p className="text-gray-700">Description of service 1.</p>
          </div>
        </div>
        {/* Card 2 */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-6">
            <h3 className="text-xl font-semibold mb-2">Service 2</h3>
            <p className="text-gray-700">Description of service 2.</p>
          </div>
        </div>
        {/* Card 3 */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-6">
            <h3 className="text-xl font-semibold mb-2">Service 3</h3>
            <p className="text-gray-700">Description of service 3.</p>
          </div>
        </div>
        {/* Add more cards as needed */}
      </div>
    </div>
  );
};

export default Packages;
