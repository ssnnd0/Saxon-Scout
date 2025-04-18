import React, { useState } from 'react';
import { Plus, Minus, Save, RotateCcw } from 'lucide-react';

function ScoutingPage() {
  const [formData, setFormData] = useState({
    matchNumber: '',
    teamNumber: '',
    alliance: 'red',
    autoLower: 0,
    autoUpper: 0,
    autoMissed: 0,
    teleopLower: 0,
    teleopUpper: 0,
    teleopMissed: 0,
    climbed: false,
    climbTime: '',
    defense: 0,
    penalties: 0,
    notes: ''
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleIncrement = (field) => {
    setFormData({
      ...formData,
      [field]: formData[field] + 1
    });
  };

  const handleDecrement = (field) => {
    if (formData[field] > 0) {
      setFormData({
        ...formData,
        [field]: formData[field] - 1
      });
    }
  };

  const handleReset = () => {
    setFormData({
      matchNumber: '',
      teamNumber: '',
      alliance: 'red',
      autoLower: 0,
      autoUpper: 0,
      autoMissed: 0,
      teleopLower: 0,
      teleopUpper: 0,
      teleopMissed: 0,
      climbed: false,
      climbTime: '',
      defense: 0,
      penalties: 0,
      notes: ''
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Submitted scouting data:', formData);
    // In a real app, you would send this data to your backend
    alert('Scouting data submitted successfully!');
    handleReset();
  };

  const Counter = ({ name, value, label }) => (
    <div className="flex items-center justify-between py-3 border-b border-gray-200">
      <span className="text-sm font-medium text-gray-700">{label}</span>
      <div className="flex items-center">
        <button
          type="button"
          onClick={() => handleDecrement(name)}
          className="p-1 rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300"
        >
          <Minus className="h-4 w-4" />
        </button>
        <span className="mx-4 text-lg font-medium">{value}</span>
        <button
          type="button"
          onClick={() => handleIncrement(name)}
          className="p-1 rounded-full bg-blue-100 text-blue-700 hover:bg-blue-200"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="md:flex md:items-center md:justify-between md:space-x-5 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Match Scouting Form</h1>
          <p className="mt-1 text-sm text-gray-500">
            Collect match data for analysis and strategy
          </p>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              <div className="sm:col-span-3">
                <label htmlFor="matchNumber" className="block text-sm font-medium text-gray-700">
                  Match Number
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="matchNumber"
                    id="matchNumber"
                    required
                    value={formData.matchNumber}
                    onChange={handleChange}
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="teamNumber" className="block text-sm font-medium text-gray-700">
                  Team Number
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="teamNumber"
                    id="teamNumber"
                    required
                    value={formData.teamNumber}
                    onChange={handleChange}
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <div className="sm:col-span-6">
                <label className="block text-sm font-medium text-gray-700">Alliance</label>
                <div className="mt-2">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <input
                        id="alliance-red"
                        name="alliance"
                        type="radio"
                        value="red"
                        checked={formData.alliance === 'red'}
                        onChange={handleChange}
                        className="focus:ring-red-500 h-4 w-4 text-red-600 border-gray-300"
                      />
                      <label htmlFor="alliance-red" className="ml-2 block text-sm font-medium text-gray-700">
                        Red Alliance
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        id="alliance-blue"
                        name="alliance"
                        type="radio"
                        value="blue"
                        checked={formData.alliance === 'blue'}
                        onChange={handleChange}
                        className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                      />
                      <label htmlFor="alliance-blue" className="ml-2 block text-sm font-medium text-gray-700">
                        Blue Alliance
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Autonomous Period</h3>
          </div>
          <div className="px-4 py-5 sm:p-6 border-t border-gray-200">
            <Counter name="autoLower" value={formData.autoLower} label="Lower Hub Scored" />
            <Counter name="autoUpper" value={formData.autoUpper} label="Upper Hub Scored" />
            <Counter name="autoMissed" value={formData.autoMissed} label="Shots Missed" />
          </div>
        </div>

        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Teleop Period</h3>
          </div>
          <div className="px-4 py-5 sm:p-6 border-t border-gray-200">
            <Counter name="teleopLower" value={formData.teleopLower} label="Lower Hub Scored" />
            <Counter name="teleopUpper" value={formData.teleopUpper} label="Upper Hub Scored" />
            <Counter name="teleopMissed" value={formData.teleopMissed} label="Shots Missed" />
          </div>
        </div>

        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Endgame</h3>
          </div>
          <div className="px-4 py-5 sm:p-6 border-t border-gray-200">
            <div className="flex items-start py-3 border-b border-gray-200">
              <div className="flex items-center h-5">
                <input
                  id="climbed"
                  name="climbed"
                  type="checkbox"
                  checked={formData.climbed}
                  onChange={handleChange}
                  className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="climbed" className="font-medium text-gray-700">
                  Successfully Climbed
                </label>
              </div>
            </div>

            <div className="py-3 border-b border-gray-200">
              <label htmlFor="climbTime" className="block text-sm font-medium text-gray-700">
                Climb Time (seconds)
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="climbTime"
                  id="climbTime"
                  value={formData.climbTime}
                  onChange={handleChange}
                  className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                />
              </div>
            </div>

            <Counter name="defense" value={formData.defense} label="Defense Rating (0-5)" />
            <Counter name="penalties" value={formData.penalties} label="Penalties" />
          </div>
        </div>

        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
              Notes
            </label>
            <div className="mt-1">
              <textarea
                id="notes"
                name="notes"
                rows={3}
                value={formData.notes}
                onChange={handleChange}
                className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
              />
            </div>
            <p className="mt-2 text-sm text-gray-500">
              Add any additional observations about the team's performance.
            </p>
          </div>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset
          </button>
          <button
            type="submit"
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Save className="h-4 w-4 mr-2" />
            Save
          </button>
        </div>
      </form>
    </div>
  );
}

export default ScoutingPage; 