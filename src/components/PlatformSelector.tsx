import React from 'react';
import { Store, ShoppingBag, Music2 } from 'lucide-react';
import { Platform } from '../types';

interface PlatformSelectorProps {
  selectedPlatforms: Platform[];
  onSelect: (platforms: Platform[]) => void;
}

const platforms = [
  { id: 'shopee', name: 'Shopee', icon: Store, color: 'text-orange-500' },
  { id: 'lazada', name: 'Lazada', icon: ShoppingBag, color: 'text-blue-500' },
  { id: 'etsy', name: 'Etsy', icon: Store, color: 'text-red-500' },
  { id: 'tiktok', name: 'TikTok Shop', icon: Music2, color: 'text-gray-900' },
];

export default function PlatformSelector({ selectedPlatforms, onSelect }: PlatformSelectorProps) {
  const togglePlatform = (platformId: string) => {
    if (selectedPlatforms.includes(platformId as Platform)) {
      onSelect(selectedPlatforms.filter(id => id !== platformId));
    } else {
      onSelect([...selectedPlatforms, platformId as Platform]);
    }
  };

  return (
    <div className="space-y-3">
      {platforms.map(platform => {
        const isSelected = selectedPlatforms.includes(platform.id as Platform);
        const Icon = platform.icon;
        
        return (
          <button
            key={platform.id}
            onClick={() => togglePlatform(platform.id)}
            className={`
              w-full p-4 rounded-lg border-2 transition-all
              flex items-center space-x-3
              ${isSelected 
                ? 'border-indigo-600 bg-indigo-50' 
                : 'border-gray-200 hover:border-gray-300'}
            `}
          >
            <Icon className={`w-6 h-6 ${platform.color}`} />
            <span className="font-medium text-gray-900">{platform.name}</span>
            {isSelected && (
              <span className="ml-auto text-xs font-medium text-indigo-600">
                Selected
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}