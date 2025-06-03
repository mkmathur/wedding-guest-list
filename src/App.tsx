import React, { useState } from 'react'

function App() {
  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="px-4 py-3">
          <h1 className="text-xl font-semibold">Wedding Guest List</h1>
        </div>
        <div className="px-4 py-2 border-t flex items-center gap-4">
          <button className="px-3 py-1.5 bg-blue-500 text-white rounded-md hover:bg-blue-600">
            + New Household
          </button>
          <div className="flex-1">
            <input
              type="search"
              placeholder="Search guests..."
              className="w-full px-3 py-1.5 border rounded-md"
            />
          </div>
          <button className="px-3 py-1.5 border rounded-md hover:bg-gray-50">
            Export ⬇️
          </button>
          <div className="text-sm text-gray-600">
            Total Guests: <span className="font-medium">0</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Categories & Tiers */}
        <div className="w-64 border-r bg-gray-50 p-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-medium">Categories</h2>
            <button className="text-blue-500 hover:text-blue-600">+</button>
          </div>
          <div className="mb-6">
            {/* Category list will go here */}
            <div className="text-gray-400 text-sm">No categories yet</div>
          </div>

          <div className="flex items-center justify-between mb-2">
            <h2 className="font-medium">Tiers</h2>
            <button className="text-blue-500 hover:text-blue-600">+</button>
          </div>
          <div>
            {/* Tier list will go here */}
            <div className="text-gray-400 text-sm">No tiers yet</div>
          </div>
        </div>

        {/* Middle Panel - Household List */}
        <div className="flex-1 overflow-auto p-4">
          <div className="text-gray-400 text-center mt-8">
            Add some households to get started
          </div>
        </div>

        {/* Right Panel - Scenarios */}
        <div className="w-64 border-l bg-gray-50 p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-medium">Scenarios</h2>
            <button className="text-blue-500 hover:text-blue-600">+</button>
          </div>
          <div className="text-gray-400 text-sm">
            Create scenarios to try different guest list combinations
          </div>
        </div>
      </div>
    </div>
  )
}

export default App 