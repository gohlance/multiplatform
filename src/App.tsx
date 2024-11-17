import React, { useState } from 'react';
import { Upload, Store, ShoppingBag, Music2, AlertCircle } from 'lucide-react';
import ProductForm from './components/ProductForm';
import PlatformSelector from './components/PlatformSelector';
import Header from './components/Header';
import { Platform, Product } from './types';

function App() {
  const [selectedPlatforms, setSelectedPlatforms] = useState<Platform[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = async (product: Product) => {
    setIsUploading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsUploading(false);
    alert('This is a demo. In production, this would connect to the respective platform APIs.');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-2xl font-semibold mb-6">Product Details</h2>
              <ProductForm onSubmit={handleUpload} isUploading={isUploading} />
            </div>
          </div>
          
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
              <h2 className="text-2xl font-semibold mb-6">Target Platforms</h2>
              <PlatformSelector 
                selectedPlatforms={selectedPlatforms}
                onSelect={setSelectedPlatforms}
              />
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
              <div className="flex items-start space-x-3">
                <AlertCircle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-medium text-amber-800">Important Note</h3>
                  <p className="text-sm text-amber-700 mt-1">
                    This is a demo interface. In a production environment, you would need to:
                  </p>
                  <ul className="text-sm text-amber-700 mt-2 list-disc list-inside">
                    <li>Configure API keys for each platform</li>
                    <li>Implement platform-specific validation</li>
                    <li>Handle rate limits and quotas</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;