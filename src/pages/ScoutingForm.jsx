import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import FormInput from '../components/common/FormInput';
import Alert from '../components/common/Alert';
import Spinner from '../components/common/Spinner';
import { ScoutingContext } from '../context/ScoutingContext';
import { AuthContext } from '../context/AuthContext';
import { v4 as uuidv4 } from 'uuid';

const ScoutingForm = () => {
  const { 
    currentSeason,
    scoutingConfig,
    teams,
    matches,
    saveScoutingEntry,
    loading,
    error: contextError
  } = useContext(ScoutingContext);
  
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({});
  const [formErrors, setFormErrors] = useState({});
  const [step, setStep] = useState(0);
  const [formStatus, setFormStatus] = useState({
    isSubmitting: false,
    isSubmitted: false,
    error: null
  });
  
  // Steps in the scouting form
  const formSteps = [
    { id: 'match-info', title: 'Match Information' },
    { id: 'auto-period', title: 'Autonomous Period' },
    { id: 'teleop-period', title: 'Teleop Period' },
    { id: 'endgame', title: 'Endgame' },
    { id: 'overall', title: 'Overall Performance' }
  ];

  // Reset form if config changes
  useEffect(() => {
    if (scoutingConfig) {
      // Initialize form data based on config
      const initialData = {
        id: uuidv4(),
        scoutName: currentUser?.username || '',
        timestamp: new Date().toISOString(),
        seasonId: currentSeason?.id || '',
        synced: false,
        teamNumber: '',
        matchNumber: '',
        alliance: 'red',
      };
      
      // Add fields for each category in the config
      if (scoutingConfig.categories) {
        scoutingConfig.categories.forEach(category => {
          category.fields.forEach(field => {
            // Default values based on field type
            switch (field.type) {
              case 'number':
                initialData[field.id] = 0;
                break;
              case 'boolean':
                initialData[field.id] = false;
                break;
              case 'enum':
                initialData[field.id] = field.options[0]?.value || '';
                break;
              default:
                initialData[field.id] = '';
            }
          });
        });
      }
      
      setFormData(initialData);
    }
  }, [scoutingConfig, currentUser, currentSeason]);
  
  const validateStep = (stepIndex) => {
    const errors = {};
    let isValid = true;
    
    // Validation for match info step
    if (stepIndex === 0) {
      if (!formData.teamNumber) {
        errors.teamNumber = 'Team number is required';
        isValid = false;
      }
      
      if (!formData.matchNumber) {
        errors.matchNumber = 'Match number is required';
        isValid = false;
      }
    }
    
    setFormErrors(errors);
    return isValid;
  };
  
  const handleInputChange = (e) => {
    const { id, value, type, checked } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [id]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error for this field
    if (formErrors[id]) {
      setFormErrors(prev => ({ ...prev, [id]: null }));
    }
  };
  
  const handleNumberChange = (id, increment) => {
    setFormData(prev => ({
      ...prev,
      [id]: Math.max(0, parseInt(prev[id] || 0) + increment)
    }));
  };
  
  const nextStep = () => {
    if (validateStep(step)) {
      setStep(prev => Math.min(prev + 1, formSteps.length - 1));
    }
  };
  
  const prevStep = () => {
    setStep(prev => Math.max(prev - 1, 0));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateStep(step)) {
      return;
    }
    
    setFormStatus({ isSubmitting: true, isSubmitted: false, error: null });
    
    try {
      const success = await saveScoutingEntry(formData);
      
      if (success) {
        setFormStatus({ 
          isSubmitting: false,
          isSubmitted: true, 
          error: null
        });
        
        // Clear form and return to first step after 2 seconds
        setTimeout(() => {
          if (scoutingConfig) {
            // Re-initialize with a new ID
            setFormData(prev => ({
              ...prev,
              id: uuidv4(),
              timestamp: new Date().toISOString(),
              teamNumber: '',
              matchNumber: '',
              alliance: 'red',
            }));
          }
          
          setStep(0);
          setFormStatus(prev => ({ ...prev, isSubmitted: false }));
        }, 2000);
      } else {
        setFormStatus({
          isSubmitting: false,
          isSubmitted: false,
          error: 'Failed to save entry. Please try again.'
        });
      }
    } catch (err) {
      setFormStatus({
        isSubmitting: false,
        isSubmitted: false,
        error: err.message
      });
    }
  };
  
  // Render fields for current step based on config
  const renderFields = () => {
    if (!scoutingConfig || !scoutingConfig.categories) {
      return <p>No scouting configuration available</p>;
    }
    
    // Match Info Step
    if (step === 0) {
      return (
        <div className="space-y-4">
          <FormInput
            id="teamNumber"
            label="Team Number"
            type="select"
            value={formData.teamNumber || ''}
            onChange={handleInputChange}
            placeholder="Select a team"
            options={teams.map(team => ({ value: team.number, label: `${team.number} - ${team.name}` }))}
            error={formErrors.teamNumber}
            required
          />
          
          <FormInput
            id="matchNumber"
            label="Match Number"
            type="select"
            value={formData.matchNumber || ''}
            onChange={handleInputChange}
            placeholder="Select a match"
            options={matches.map(match => ({ value: match.number, label: `Match ${match.number}` }))}
            error={formErrors.matchNumber}
            required
          />
          
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-200 mb-2">Alliance</label>
            <div className="flex space-x-4">
              <div 
                className={`flex-1 p-4 rounded-md text-center cursor-pointer border ${
                  formData.alliance === 'red' 
                  ? 'bg-red-800 border-red-600' 
                  : 'bg-gray-700 border-gray-600'
                }`}
                onClick={() => setFormData(prev => ({ ...prev, alliance: 'red' }))}
              >
                <span className="text-white font-medium">Red Alliance</span>
              </div>
              <div 
                className={`flex-1 p-4 rounded-md text-center cursor-pointer border ${
                  formData.alliance === 'blue' 
                  ? 'bg-blue-800 border-blue-600' 
                  : 'bg-gray-700 border-gray-600'
                }`}
                onClick={() => setFormData(prev => ({ ...prev, alliance: 'blue' }))}
              >
                <span className="text-white font-medium">Blue Alliance</span>
              </div>
            </div>
          </div>
        </div>
      );
    }
    
    // Other steps based on scouting config
    const categoryIndex = step - 1;
    if (categoryIndex >= 0 && categoryIndex < scoutingConfig.categories.length) {
      const category = scoutingConfig.categories[categoryIndex];
      
      return (
        <div className="space-y-4">
          {category.fields.map((field) => {
            // Render different field types based on configuration
            switch (field.type) {
              case 'number':
                return (
                  <div key={field.id} className="mb-4">
                    <label className="block text-sm font-medium text-gray-200 mb-2">
                      {field.label}
                    </label>
                    <div className="flex items-center">
                      <Button 
                        variant="outline" 
                        onClick={() => handleNumberChange(field.id, -1)}
                        disabled={formData[field.id] <= 0}
                        className="px-3 py-1"
                      >
                        -
                      </Button>
                      <input
                        type="number"
                        id={field.id}
                        value={formData[field.id] || 0}
                        onChange={handleInputChange}
                        min="0"
                        className="mx-3 px-3 py-2 rounded-md border bg-gray-700 text-gray-100 border-gray-600 text-center w-16"
                      />
                      <Button 
                        variant="outline" 
                        onClick={() => handleNumberChange(field.id, 1)}
                        className="px-3 py-1"
                      >
                        +
                      </Button>
                    </div>
                  </div>
                );
                
              case 'boolean':
                return (
                  <div key={field.id} className="mb-4">
                    <FormInput
                      id={field.id}
                      label={field.label}
                      type="checkbox"
                      checked={!!formData[field.id]}
                      onChange={handleInputChange}
                    />
                  </div>
                );
                
              case 'enum':
                return (
                  <div key={field.id} className="mb-4">
                    <FormInput
                      id={field.id}
                      label={field.label}
                      type="select"
                      value={formData[field.id] || ''}
                      onChange={handleInputChange}
                      options={field.options.map(opt => ({ 
                        value: opt.value, 
                        label: opt.label 
                      }))}
                    />
                  </div>
                );
                
              case 'rating':
                return (
                  <div key={field.id} className="mb-4">
                    <label className="block text-sm font-medium text-gray-200 mb-2">
                      {field.label}
                    </label>
                    <div className="flex justify-between">
                      {[1, 2, 3, 4, 5].map((rating) => (
                        <button
                          key={rating}
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, [field.id]: rating }))}
                          className={`w-12 h-12 rounded-full flex items-center justify-center text-lg
                            ${formData[field.id] === rating 
                              ? 'bg-blue-600 text-white' 
                              : 'bg-gray-700 text-gray-300'}`}
                        >
                          {rating}
                        </button>
                      ))}
                    </div>
                  </div>
                );
                
              case 'text':
              default:
                return (
                  <div key={field.id} className="mb-4">
                    <FormInput
                      id={field.id}
                      label={field.label}
                      type={field.type === 'text' ? 'text' : field.type === 'longtext' ? 'textarea' : 'text'}
                      value={formData[field.id] || ''}
                      onChange={handleInputChange}
                      placeholder={field.placeholder || ''}
                      rows={4}
                    />
                  </div>
                );
            }
          })}
        </div>
      );
    }
    
    return <p>Invalid step</p>;
  };
  
  if (loading) {
    return <Spinner size="large" />;
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl md:text-3xl font-bold text-white">Scouting Form</h1>
        <Button variant="outline" onClick={() => navigate('/dashboard')}>
          Back to Dashboard
        </Button>
      </div>
      
      {/* Progress Indicator */}
      <div className="bg-gray-800 p-4 rounded-lg">
        <div className="flex overflow-x-auto pb-2">
          {formSteps.map((formStep, index) => (
            <div key={formStep.id} className="flex items-center">
              <div
                className={`flex flex-col items-center ${
                  index > 0 ? 'ml-4 sm:ml-12' : ''
                } ${index !== 0 ? 'flex-shrink-0' : ''}`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    step === index
                      ? 'bg-blue-600 text-white'
                      : step > index
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-700 text-gray-400'
                  }`}
                >
                  {step > index ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    index + 1
                  )}
                </div>
                <div className="text-xs mt-1 text-center whitespace-nowrap">
                  {formStep.title}
                </div>
              </div>
              
              {/* Connector Line */}
              {index < formSteps.length - 1 && (
                <div className={`hidden sm:block h-0.5 w-12 ${step > index ? 'bg-green-600' : 'bg-gray-700'}`}></div>
              )}
            </div>
          ))}
        </div>
      </div>

      {contextError && <Alert type="error" message={contextError} />}
      {formStatus.error && <Alert type="error" message={formStatus.error} onClose={() => setFormStatus(prev => ({ ...prev, error: null }))} />}
      {formStatus.isSubmitted && <Alert type="success" message="Scouting entry saved successfully!" />}
      
      <Card>
        <form onSubmit={handleSubmit}>
          {/* Form content based on current step */}
          <div className="mb-6">
            {renderFields()}
          </div>
          
          {/* Navigation/submission buttons */}
          <div className="flex justify-between pt-4 border-t border-gray-700">
            <Button
              type="button"
              variant="outline"
              onClick={prevStep}
              disabled={step === 0}
            >
              Previous
            </Button>
            
            {step < formSteps.length - 1 ? (
              <Button
                type="button"
                variant="primary"
                onClick={nextStep}
              >
                Next
              </Button>
            ) : (
              <Button
                type="submit"
                variant="success"
                disabled={formStatus.isSubmitting}
              >
                {formStatus.isSubmitting ? 'Saving...' : 'Save Entry'}
              </Button>
            )}
          </div>
        </form>
      </Card>
    </div>
  );
};

export default ScoutingForm;