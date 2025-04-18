import { ClipboardList, Github } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <ClipboardList className="h-6 w-6 mr-2" />
            <span className="text-lg font-semibold">Saxon Scout</span>
          </div>
          
          <div className="text-sm text-gray-400">
            <p>© {new Date().getFullYear()} Saxon Scout. All rights reserved.</p>
            <p>Data provided by The Blue Alliance and FIRST® Robotics Competition.</p>
          </div>
          
          <div className="mt-4 md:mt-0">
            <a 
              href="https://github.com/yourusername/saxon-scout" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center text-gray-400 hover:text-white transition-colors"
            >
              <Github className="h-5 w-5 mr-1" />
              <span>GitHub</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 