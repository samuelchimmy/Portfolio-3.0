import React from 'react';
import { Card } from './Card';
import { Calendar } from 'lucide-react';

export const Availability: React.FC = () => {
  return (
    <Card className="h-full bg-[#ecfdf5]" title="Status">
      <div className="flex flex-col items-center justify-center h-full gap-2 py-4">
        <div className="relative">
          <div className="w-4 h-4 rounded-full bg-green-500 animate-pulse absolute top-0 right-0" />
          <Calendar size={48} className="text-black" />
        </div>
        <div className="text-center">
          <h3 className="font-display text-2xl">Available</h3>
          <p className="font-body text-sm text-gray-600">Open for new projects</p>
          <button className="mt-2 px-4 py-1 bg-black text-white rounded font-body text-sm hover:bg-gray-800 transition-colors">
            Book Call
          </button>
        </div>
      </div>
    </Card>
  );
};