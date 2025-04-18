import React, { useState, useEffect } from 'react';
import LucideIconWrapper from './LucideIconWrapper';
import { importIcon } from './utils/iconUtils';

// Method 1: Direct import - safe for production, but may have issues in development
import { Search, Award, CalendarDays } from 'lucide-react';

// Method 2: Import through the wrapped path - safer for development
import Sun from 'lucide-react/icons/sun';
import Moon from 'lucide-react/icons/moon';

const IconExample = () => {
  const [DynamicIcon, setDynamicIcon] = useState(null);
  
  // Method 3: Dynamic import - useful for icons loaded from configuration
  useEffect(() => {
    const loadIcon = async () => {
      const icon = await importIcon('clipboard-list');
      setDynamicIcon(icon);
    };
    
    loadIcon();
  }, []);
  
  return (
    <div className="p-4 space-y-6">
      <h2 className="text-xl font-bold">Lucide Icon Examples</h2>
      
      <div className="space-y-4">
        <div>
          <h3 className="font-medium mb-2">Method 1: Direct imports</h3>
          <div className="flex space-x-4">
            <Search className="h-6 w-6 text-blue-500" />
            <Award className="h-6 w-6 text-green-500" />
            <CalendarDays className="h-6 w-6 text-purple-500" />
          </div>
        </div>
        
        <div>
          <h3 className="font-medium mb-2">Method 2: Path imports</h3>
          <div className="flex space-x-4">
            <Sun className="h-6 w-6 text-yellow-500" />
            <Moon className="h-6 w-6 text-indigo-500" />
          </div>
        </div>
        
        <div>
          <h3 className="font-medium mb-2">Method 3: Dynamic import with wrapper</h3>
          <div className="flex space-x-4">
            <LucideIconWrapper 
              icon={DynamicIcon} 
              className="h-6 w-6 text-red-500" 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default IconExample; 