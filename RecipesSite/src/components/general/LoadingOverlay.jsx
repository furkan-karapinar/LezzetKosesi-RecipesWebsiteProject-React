// components/LoadingOverlay.jsx
import React from 'react';
import { ChefHat } from 'lucide-react';

const LoadingOverlay = () => {
    return (
        <div className="fixed inset-0 z-50 bg-white bg-op-50 flex flex-col items-center justify-center">
            <div className='flex flex-col items-center justify-center bg-white p-10 rounded-lg shadow-2xl'>
                <ChefHat className="w-16 h-16 text-red-500 animate-wiggle" />
                <p className="mt-4 text-lg text-red-700 font-medium">Yükleniyor...</p>
            </div>

        </div>
    );
};

export default LoadingOverlay;
