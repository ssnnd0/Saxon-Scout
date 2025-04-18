import React from 'react';

function IconsPage() {
  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold mb-8">Icon Library</h1>
      
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Loading Icons</h2>
        <p className="mb-4">
          If you're seeing this page, your React Router setup is working correctly! Now we need to fix the
          Lucide icons loading issue.
        </p>
        
        <div className="p-4 bg-gray-100 rounded-lg">
          <p className="text-sm font-mono mb-2">Import icons directly from lucide-react:</p>
          <code className="block bg-gray-900 text-green-400 p-3 rounded text-sm overflow-x-auto mb-4">
            {`import { Home, Search, Settings } from 'lucide-react';`}
          </code>
          
          <p className="text-sm font-mono mb-2">Or use the path import method:</p>
          <code className="block bg-gray-900 text-green-400 p-3 rounded text-sm overflow-x-auto">
            {`import Sun from 'lucide-react/icons/sun';`}
          </code>
        </div>
      </div>
    </div>
  );
}

export default IconsPage; 