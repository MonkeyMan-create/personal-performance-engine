import React, { useState } from 'react'

const WorkoutLogScreen: React.FC = () => {
  // State for input values - simulating smart pre-filling for first set
  const [sets, setSets] = useState([
    { weight: '100', reps: '8' }, // Pre-filled from previous
    { weight: '', reps: '' },
    { weight: '', reps: '' }
  ])

  const handleInputChange = (setIndex: number, field: 'weight' | 'reps', value: string) => {
    setSets(prev => prev.map((set, index) => 
      index === setIndex ? { ...set, [field]: value } : set
    ))
  }

  return (
    <div className="min-h-screen bg-[#1A1A1A] font-sans flex flex-col">
      <div className="flex-1">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 pt-8">
          <button className="p-2">
            {/* Back Arrow Icon (Heroicons) */}
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <h1 className="text-white text-lg font-semibold">Leg Day</h1>
          <div className="w-10"></div> {/* Spacer for center alignment */}
        </div>

        {/* Exercise List */}
        <div className="px-6 py-4">
          {/* Exercise Card - Barbell Squat */}
          <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
            {/* Exercise Header */}
            <div className="bg-gray-750 px-6 py-4 border-b border-gray-700">
              <h2 className="text-white text-xl font-semibold">Barbell Squat</h2>
            </div>

            {/* Sets Table */}
            <div className="p-6">
              {/* Table Header */}
              <div className="grid grid-cols-4 gap-4 mb-4 pb-3 border-b border-gray-600">
                <div className="text-gray-400 text-sm font-medium text-center">SET</div>
                <div className="text-gray-400 text-sm font-medium text-center">PREVIOUS</div>
                <div className="text-gray-400 text-sm font-medium text-center">WEIGHT</div>
                <div className="text-gray-400 text-sm font-medium text-center">REPS</div>
              </div>

              {/* Set Rows */}
              <div className="space-y-4">
                {[1, 2, 3].map((setNumber, index) => (
                  <div key={setNumber} className="grid grid-cols-4 gap-4 items-center">
                    {/* Set Number */}
                    <div className="text-white text-lg font-semibold text-center">
                      {setNumber}
                    </div>

                    {/* Previous Column */}
                    <div className="text-gray-400 text-sm text-center">
                      100 kg x 8
                    </div>

                    {/* Weight Input */}
                    <div className="flex items-center justify-center">
                      <input
                        type="number"
                        value={sets[index].weight}
                        onChange={(e) => handleInputChange(index, 'weight', e.target.value)}
                        className="w-16 h-12 bg-gray-700 text-white text-center rounded-lg border border-gray-600 focus:border-emerald-500 focus:outline-none text-lg font-medium"
                        placeholder="kg"
                      />
                    </div>

                    {/* Reps Input */}
                    <div className="flex items-center justify-center">
                      <input
                        type="number"
                        value={sets[index].reps}
                        onChange={(e) => handleInputChange(index, 'reps', e.target.value)}
                        className="w-16 h-12 bg-gray-700 text-white text-center rounded-lg border border-gray-600 focus:border-emerald-500 focus:outline-none text-lg font-medium"
                        placeholder="reps"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Spacer to push button to bottom */}
        <div className="flex-1"></div>
      </div>

      {/* 1-Tap Logging Button */}
      <div className="p-6 pt-0">
        <button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-lg py-4 rounded-xl shadow-lg transition-colors active:bg-emerald-800">
          Log Set ✔
        </button>
      </div>

      {/* Bottom padding for mobile navigation */}
      <div className="h-4"></div>
    </div>
  )
}

export default WorkoutLogScreen