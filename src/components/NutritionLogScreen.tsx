import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const NutritionLogScreen: React.FC = () => {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('Search')

  const tabs = ['Search', 'My Meals', 'Recipes']
  
  const recentItems = [
    { name: 'Scrambled Eggs', calories: 250 },
    { name: 'Whole Wheat Toast', calories: 150 },
    { name: 'Black Coffee', calories: 5 },
    { name: 'Greek Yogurt', calories: 120 }
  ]

  return (
    <div className="min-h-screen bg-[#1A1A1A] font-sans">
      <div className="max-w-sm mx-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 pt-8">
          <button onClick={() => navigate('/')} className="p-2">
            {/* Back Arrow Icon (Heroicons) */}
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <h1 className="text-white text-lg font-semibold">Log Nutrition</h1>
          <div className="w-10"></div> {/* Spacer for center alignment */}
        </div>

        {/* Search Bar & Barcode Button */}
        <div className="px-6 py-4">
          <div className="flex items-center space-x-3">
            {/* Search Input */}
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                {/* Magnifying Glass Icon (Heroicons) */}
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                className="w-full bg-gray-700 text-white placeholder-gray-400 rounded-lg py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="Search for a food..."
              />
            </div>
            
            {/* Barcode Button */}
            <button className="bg-gray-700 hover:bg-gray-600 p-3 rounded-lg transition-colors">
              {/* Barcode Icon (Custom SVG) */}
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M2 6h2v12H2V6zm4 0h1v12H6V6zm3 0h1v12H9V6zm2 0h2v12h-2V6zm4 0h1v12h-1V6zm3 0h2v12h-2V6zm-8 0h1v12h-1V6z"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="px-6">
          <div className="flex space-x-1 bg-gray-800 rounded-lg p-1">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  activeTab === tab
                    ? 'bg-emerald-600 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Recently Logged Section */}
        <div className="px-6 py-6">
          <h2 className="text-white text-lg font-semibold mb-4">Recently Logged</h2>
          
          <div className="space-y-3">
            {recentItems.map((item, index) => (
              <div
                key={index}
                className="bg-gray-800 rounded-lg p-4 border border-gray-700 hover:bg-gray-750 transition-colors cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {/* Food Icon */}
                    <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                      </svg>
                    </div>
                    
                    <div>
                      <h3 className="text-white font-medium">{item.name}</h3>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <span className="text-emerald-400 font-bold text-lg">{item.calories}</span>
                    <span className="text-gray-400 text-sm ml-1">kcal</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Add some bottom padding for mobile navigation */}
        <div className="h-20"></div>
      </div>
    </div>
  )
}

export default NutritionLogScreen