import { useState } from 'react';

const ScoutingForm = ({ teamNumber, eventKey, matchKey, onSubmit }) => {
  const [scoutName, setScoutName] = useState('');
  const [autoMobility, setAutoMobility] = useState(false);
  const [autoSpeakerNotes, setAutoSpeakerNotes] = useState(0);
  const [autoAmpNotes, setAutoAmpNotes] = useState(0);
  const [teleopSpeakerNotes, setTeleopSpeakerNotes] = useState(0);
  const [teleopAmpNotes, setTeleopAmpNotes] = useState(0);
  const [teleopTrapNotes, setTeleopTrapNotes] = useState(0);
  const [climb, setClimb] = useState(false);
  const [harmony, setHarmony] = useState(false);
  const [driverSkill, setDriverSkill] = useState(3);
  const [robotDefense, setRobotDefense] = useState(3);
  const [robotSpeed, setRobotSpeed] = useState(3);
  const [robotFailure, setRobotFailure] = useState(false);
  const [comments, setComments] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const entry = {
      teamKey: `frc${teamNumber}`,
      eventKey,
      matchKey,
      scoutName,
      timestamp: Date.now(),
      autoMobility,
      autoSpeakerNotes,
      autoAmpNotes,
      teleopSpeakerNotes,
      teleopAmpNotes,
      teleopTrapNotes,
      climb,
      harmony,
      driverSkill,
      robotDefense,
      robotSpeed,
      robotFailure,
      comments
    };
    
    onSubmit(entry);
    
    // Reset form (optionally)
    setScoutName('');
    setAutoMobility(false);
    setAutoSpeakerNotes(0);
    setAutoAmpNotes(0);
    setTeleopSpeakerNotes(0);
    setTeleopAmpNotes(0);
    setTeleopTrapNotes(0);
    setClimb(false);
    setHarmony(false);
    setDriverSkill(3);
    setRobotDefense(3);
    setRobotSpeed(3);
    setRobotFailure(false);
    setComments('');
  };

  const RatingSelector = ({ value, onChange }) => (
    <div className="flex space-x-1">
      {[1, 2, 3, 4, 5].map((rating) => (
        <button
          key={rating}
          type="button"
          className={`w-8 h-8 rounded-full ${
            value === rating 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
          onClick={() => onChange(rating)}
        >
          {rating}
        </button>
      ))}
    </div>
  );
  
  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold mb-6">Scouting Form - Team {teamNumber}</h2>
      
      <div className="mb-4">
        <label className="block text-gray-700 font-semibold mb-2">Scout Name</label>
        <input 
          type="text" 
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={scoutName}
          onChange={(e) => setScoutName(e.target.value)}
          required
        />
      </div>
      
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3 text-blue-800">Autonomous</h3>
        <div className="space-y-4">
          <div className="flex items-center">
            <input 
              type="checkbox" 
              id="autoMobility"
              className="h-5 w-5 text-blue-600 rounded"
              checked={autoMobility}
              onChange={(e) => setAutoMobility(e.target.checked)}
            />
            <label htmlFor="autoMobility" className="ml-2 text-gray-700">Mobility</label>
          </div>
          
          <div>
            <label className="block text-gray-700 mb-1">Speaker Notes</label>
            <div className="flex items-center">
              <button 
                type="button"
                className="bg-gray-200 px-3 py-1 rounded-l"
                onClick={() => setAutoSpeakerNotes(Math.max(0, autoSpeakerNotes - 1))}
              >
                -
              </button>
              <span className="bg-gray-100 px-4 py-1">{autoSpeakerNotes}</span>
              <button 
                type="button"
                className="bg-gray-200 px-3 py-1 rounded-r"
                onClick={() => setAutoSpeakerNotes(autoSpeakerNotes + 1)}
              >
                +
              </button>
            </div>
          </div>
          
          <div>
            <label className="block text-gray-700 mb-1">Amp Notes</label>
            <div className="flex items-center">
              <button 
                type="button"
                className="bg-gray-200 px-3 py-1 rounded-l"
                onClick={() => setAutoAmpNotes(Math.max(0, autoAmpNotes - 1))}
              >
                -
              </button>
              <span className="bg-gray-100 px-4 py-1">{autoAmpNotes}</span>
              <button 
                type="button"
                className="bg-gray-200 px-3 py-1 rounded-r"
                onClick={() => setAutoAmpNotes(autoAmpNotes + 1)}
              >
                +
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3 text-blue-800">Teleop</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-1">Speaker Notes</label>
            <div className="flex items-center">
              <button 
                type="button"
                className="bg-gray-200 px-3 py-1 rounded-l"
                onClick={() => setTeleopSpeakerNotes(Math.max(0, teleopSpeakerNotes - 1))}
              >
                -
              </button>
              <span className="bg-gray-100 px-4 py-1">{teleopSpeakerNotes}</span>
              <button 
                type="button"
                className="bg-gray-200 px-3 py-1 rounded-r"
                onClick={() => setTeleopSpeakerNotes(teleopSpeakerNotes + 1)}
              >
                +
              </button>
            </div>
          </div>
          
          <div>
            <label className="block text-gray-700 mb-1">Amp Notes</label>
            <div className="flex items-center">
              <button 
                type="button"
                className="bg-gray-200 px-3 py-1 rounded-l"
                onClick={() => setTeleopAmpNotes(Math.max(0, teleopAmpNotes - 1))}
              >
                -
              </button>
              <span className="bg-gray-100 px-4 py-1">{teleopAmpNotes}</span>
              <button 
                type="button"
                className="bg-gray-200 px-3 py-1 rounded-r"
                onClick={() => setTeleopAmpNotes(teleopAmpNotes + 1)}
              >
                +
              </button>
            </div>
          </div>
          
          <div>
            <label className="block text-gray-700 mb-1">Trap Notes</label>
            <div className="flex items-center">
              <button 
                type="button"
                className="bg-gray-200 px-3 py-1 rounded-l"
                onClick={() => setTeleopTrapNotes(Math.max(0, teleopTrapNotes - 1))}
              >
                -
              </button>
              <span className="bg-gray-100 px-4 py-1">{teleopTrapNotes}</span>
              <button 
                type="button"
                className="bg-gray-200 px-3 py-1 rounded-r"
                onClick={() => setTeleopTrapNotes(teleopTrapNotes + 1)}
              >
                +
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3 text-blue-800">Endgame</h3>
        <div className="space-y-4">
          <div className="flex items-center">
            <input 
              type="checkbox" 
              id="climb"
              className="h-5 w-5 text-blue-600 rounded"
              checked={climb}
              onChange={(e) => setClimb(e.target.checked)}
            />
            <label htmlFor="climb" className="ml-2 text-gray-700">Successful Climb</label>
          </div>
          
          <div className="flex items-center">
            <input 
              type="checkbox" 
              id="harmony"
              className="h-5 w-5 text-blue-600 rounded"
              checked={harmony}
              onChange={(e) => setHarmony(e.target.checked)}
            />
            <label htmlFor="harmony" className="ml-2 text-gray-700">Harmony with Alliance Partner</label>
          </div>
        </div>
      </div>
      
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3 text-blue-800">Ratings (1-5)</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-1">Driver Skill</label>
            <RatingSelector value={driverSkill} onChange={setDriverSkill} />
          </div>
          
          <div>
            <label className="block text-gray-700 mb-1">Defense</label>
            <RatingSelector value={robotDefense} onChange={setRobotDefense} />
          </div>
          
          <div>
            <label className="block text-gray-700 mb-1">Speed</label>
            <RatingSelector value={robotSpeed} onChange={setRobotSpeed} />
          </div>
        </div>
      </div>
      
      <div className="mb-6">
        <div className="flex items-center mb-4">
          <input 
            type="checkbox" 
            id="robotFailure"
            className="h-5 w-5 text-red-600 rounded"
            checked={robotFailure}
            onChange={(e) => setRobotFailure(e.target.checked)}
          />
          <label htmlFor="robotFailure" className="ml-2 text-gray-700 font-semibold">Robot Failure/Breakdown</label>
        </div>
        
        <div>
          <label className="block text-gray-700 font-semibold mb-2">Comments</label>
          <textarea 
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={4}
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            placeholder="Additional observations, strategy notes, etc."
          ></textarea>
        </div>
      </div>
      
      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        Submit Scouting Data
      </button>
    </form>
  );
};

export default ScoutingForm; 