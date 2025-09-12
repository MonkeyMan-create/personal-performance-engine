import React from 'react'
import { useNavigate } from 'react-router-dom'

const HomeScreen: React.FC = () => {
  const navigate = useNavigate()
  // Hardcoded values as requested
  const consumed = 1200
  const budget = 2500
  const remaining = budget - consumed
  const progressPercentage = (consumed / budget) * 100

  return (
    <div className="min-h-screen bg-[#1A1A1A] font-sans">
      <div className="max-w-sm mx-auto px-6 py-8 space-y-8">
        
        {/* Calorie Budget Ring */}
        <div className="flex justify-center">
          <div className="relative w-48 h-48">
            <svg className="transform -rotate-90 w-48 h-48">
              {/* Background circle */}
              <circle
                cx="96"
                cy="96"
                r="80"
                stroke="#374151"
                strokeWidth="12"
                fill="none"
              />
              {/* Progress circle */}
              <circle
                cx="96"
                cy="96"
                r="80"
                stroke="#10B981"
                strokeWidth="12"
                fill="none"
                strokeDasharray={`${2 * Math.PI * 80}`}
                strokeDashoffset={`${2 * Math.PI * 80 * (1 - progressPercentage / 100)}`}
                strokeLinecap="round"
                className="transition-all duration-700 ease-out"
              />
            </svg>
            {/* Center content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
              <div className="text-4xl font-bold mb-1">
                {remaining}
              </div>
              <div className="text-sm text-gray-400 uppercase tracking-wide">
                Remaining
              </div>
            </div>
          </div>
        </div>

        {/* Main Action Buttons */}
        <div className="grid grid-cols-2 gap-4">
          <button 
            onClick={() => navigate('/log-nutrition')}
            className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold py-4 px-6 rounded-xl shadow-lg transition-all duration-200 transform hover:scale-105"
          >
            + Log Meal
          </button>
          <button 
            onClick={() => navigate('/log-workout')}
            className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-4 px-6 rounded-xl shadow-lg transition-all duration-200 transform hover:scale-105"
          >
            + Log Workout
          </button>
        </div>

        {/* Chronological Feed */}
        <div className="space-y-4">
          <h2 className="text-white text-lg font-semibold mb-4">Today's Activity</h2>
          
          {/* Breakfast Card */}
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center mb-2">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full mr-2"></div>
                  <span className="text-yellow-400 text-sm font-medium">BREAKFAST</span>
                </div>
                <h3 className="text-white font-medium mb-1">Oats, Berries, Protein Powder</h3>
              </div>
              <div className="text-right">
                <span className="text-emerald-400 font-bold text-lg">450</span>
                <span className="text-gray-400 text-sm ml-1">kcal</span>
              </div>
            </div>
          </div>

          {/* Workout Card */}
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center mb-2">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mr-2"></div>
                  <span className="text-blue-400 text-sm font-medium">WORKOUT</span>
                </div>
                <h3 className="text-white font-medium mb-1">Full Body Strength Training</h3>
              </div>
              <div className="text-right">
                <span className="text-blue-400 font-bold text-lg">60</span>
                <span className="text-gray-400 text-sm ml-1">min</span>
              </div>
            </div>
          </div>

          {/* Lunch Card */}
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center mb-2">
                  <div className="w-2 h-2 bg-orange-400 rounded-full mr-2"></div>
                  <span className="text-orange-400 text-sm font-medium">LUNCH</span>
                </div>
                <h3 className="text-white font-medium mb-1">Grilled Chicken Salad</h3>
              </div>
              <div className="text-right">
                <span className="text-emerald-400 font-bold text-lg">650</span>
                <span className="text-gray-400 text-sm ml-1">kcal</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomeScreen