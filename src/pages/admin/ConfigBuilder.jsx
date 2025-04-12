import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import FormInput from '../../components/common/FormInput';
import Alert from '../../components/common/Alert';
import Spinner from '../../components/common/Spinner';
import { ScoutingContext } from '../../context/ScoutingContext';
import { v4 as uuidv4 } from 'uuid';

const ConfigBuilder = () => {
  const { 
    currentSeason, 
    scoutingConfig, 
    updateScoutingConfig,
    loading, 
    error: contextError 
  } = useContext(ScoutingContext);
  
  const navigate = useNavigate();
  const [configData, setConfigData] = useState(null);
  const [activeCategory, setActiveCategory] = useState(null);
  const [activeField, setActiveField] = useState(null);
  const [formStatus, setFormStatus] = useState({
    isSubmitting: false,
    isSubmitted: false,
    error: null
  });

  // Initialize config data from context
  useEffect(() => {
    if (scoutingConfig) {
      setConfigData(JSON.parse(JSON.stringify(scoutingConfig))); // Deep copy
      
      if (scoutingConfig.categories && scoutingConfig.categories.length > 0) {
        setActiveCategory(0);
      }
    } else {
      // Create default config if none exists
      const defaultConfig = {
        id: uuidv4(),
        seasonId: currentSeason?.id || '',
        name: currentSeason?.name || 'New Scouting Config',
        version: '1.0',
        categories: [
          {
            id: uuidv4(),
            title: 'Autonomous Period',
            description: 'Robot performance during the autonomous phase',
            fields: []
          },
          {
            id: uuidv4(),
            title: 'Teleop Period',
            description: 'Robot performance during the teleop phase',
            fields: []
          },
          {
            id: uuidv4(),
            title: 'Endgame',
            description: 'Robot performance during the endgame phase',
            fields: []
          },
          {
            id: uuidv4(),
            title: 'Overall Performance',
            description: 'Overall robot assessment and comments',
            fields: []
          }
        ]
      };
      
      setConfigData(defaultConfig);
      setActiveCategory(0);
    }
  }, [scoutingConfig, currentSeason]);

  const handleNameChange = (e) => {
    setConfigData({ ...configData, name: e.target.value });
  };

  const handleCategoryChange = (categoryIndex, field, value) => {
    const updatedCategories = [...configData.categories];
    updatedCategories[categoryIndex][field] = value;
    setConfigData({ ...configData, categories: updatedCategories });
  };

  const handleFieldChange = (categoryIndex, fieldIndex, field, value) => {
    const updatedCategories = [...configData.categories];
    updatedCategories[categoryIndex].fields[fieldIndex][field] = value;
    setConfigData({ ...configData, categories: updatedCategories });
  };

  const handleOptionChange = (categoryIndex, fieldIndex, optionIndex, field, value) => {
    const updatedCategories = [...configData.categories];
    updatedCategories[categoryIndex].fields[fieldIndex].options[optionIndex][field] = value;
    setConfigData({ ...configData, categories: updatedCategories });
  };

  const addCategory = () => {
    const newCategory = {
      id: uuidv4(),
      title: 'New Category',
      description: 'Description for the new category',
      fields: []
    };
    
    const updatedCategories = [...configData.categories, newCategory];
    setConfigData({ ...configData, categories: updatedCategories });
    setActiveCategory(updatedCategories.length - 1);
  };

  const deleteCategory = (index) => {
    if (configData.categories.length <= 1) {
      setFormStatus({
        isSubmitting: false,
        isSubmitted: false,
        error: "Cannot delete the last category"
      });
      return;
    }
    
    const updatedCategories = [...configData.categories];
    updatedCategories.splice(index, 1);
    setConfigData({ ...configData, categories: updatedCategories });
    
    if (activeCategory >= updatedCategories.length) {
      setActiveCategory(Math.max(0, updatedCategories.length - 1));
    }
    
    setActiveField(null);
  };

  const addField = (categoryIndex) => {
    const newField = {
      id: uuidv4(),
      type: 'number',
      label: 'New Field',
      placeholder: '',
      required: false,
      options: []
    };
    
    const updatedCategories = [...configData.categories];
    updatedCategories[categoryIndex].fields.push(newField);
    setConfigData({ ...configData, categories: updatedCategories });
    setActiveField(updatedCategories[categoryIndex].fields.length - 1);
  };

  const deleteField = (categoryIndex, fieldIndex) => {
    const updatedCategories = [...configData.categories];
    updatedCategories[categoryIndex].fields.splice(fieldIndex, 1);
    setConfigData({ ...configData, categories: updatedCategories });
    
    if (activeField === fieldIndex || fieldIndex >= updatedCategories[categoryIndex].fields.length) {
      setActiveField(null);
    }
  };

  const addOption = (categoryIndex, fieldIndex) => {
    const updatedCategories = [...configData.categories];
    const field = updatedCategories[categoryIndex].fields[fieldIndex];
    
    if (!field.options) {
      field.options = [];
    }
    
    field.options.push({
      value: `option_${field.options.length + 1}`,
      label: `Option ${field.options.length + 1}`
    });
    
    setConfigData({ ...configData, categories: updatedCategories });
  };

  const deleteOption = (categoryIndex, fieldIndex, optionIndex) => {
    const updatedCategories = [...configData.categories];
    updatedCategories[categoryIndex].fields[fieldIndex].options.splice(optionIndex, 1);
    setConfigData({ ...configData, categories: updatedCategories });
  };

  const handleSubmit = async () => {
    setFormStatus({ isSubmitting: true, isSubmitted: false, error: null });
    
    try {
      // Validate config
      if (!configData.name || configData.name.trim() === '') {
        throw new Error('Configuration name is required');
      }
      
      if (!configData.categories || configData.categories.length === 0) {
        throw new Error('At least one category is required');
      }
      
      for (const category of configData.categories) {
        if (!category.title || category.title.trim() === '') {
          throw new Error('All categories must have a title');
        }
      }
      
      const success = await updateScoutingConfig(configData);
      
      if (success) {
        setFormStatus({ 
          isSubmitting: false,
          isSubmitted: true, 
          error: null
        });
        
        // Clear success message after 3 seconds
        setTimeout(() => {
          setFormStatus(prev => ({ ...prev, isSubmitted: false }));
        }, 3000);
      } else {
        throw new Error('Failed to update configuration');
      }
    } catch (err) {
      setFormStatus({
        isSubmitting: false,
        isSubmitted: false,
        error: err.message
      });
    }
  };

  if (loading || !configData) {
    return <Spinner size="large" />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <h1 className="text-2xl md:text-3xl font-bold text-white">Scouting Form Builder</h1>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => navigate('/dashboard')}>
            Back to Dashboard
          </Button>
          <Button 
            variant="primary" 
            onClick={handleSubmit}
            disabled={formStatus.isSubmitting}
          >
            {formStatus.isSubmitting ? 'Saving...' : 'Save Configuration'}
          </Button>
        </div>
      </div>
      
      {contextError && <Alert type="error" message={contextError} />}
      {formStatus.error && <Alert type="error" message={formStatus.error} onClose={() => setFormStatus(prev => ({ ...prev, error: null }))} />}
      {formStatus.isSubmitted && <Alert type="success" message="Configuration saved successfully!" />}
      
      <Card>
        <FormInput
          id="configName"
          label="Configuration Name"
          type="text"
          value={configData.name || ''}
          onChange={handleNameChange}
          placeholder="Enter configuration name"
          required
        />
      </Card>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Category Sidebar */}
        <div className="lg:col-span-1">
          <Card title="Categories">
            <div className="space-y-4">
              {configData.categories.map((category, index) => (
                <div 
                  key={category.id || index}
                  className={`cursor-pointer p-3 rounded-md ${activeCategory === index ? 'bg-blue-900 border-l-4 border-blue-500' : 'bg-gray-700 hover:bg-gray-650'}`}
                  onClick={() => {
                    setActiveCategory(index);
                    setActiveField(null);
                  }}
                >
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium text-gray-100">{category.title || 'Untitled Category'}</h3>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteCategory(index);
                      }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </Button>
                  </div>
                  <p className="text-sm text-gray-400 truncate mt-1">{category.description || 'No description'}</p>
                  <div className="mt-2 text-xs text-gray-500">{category.fields?.length || 0} fields</div>
                </div>
              ))}
              
              <Button variant="secondary" onClick={addCategory} fullWidth>
                Add Category
              </Button>
            </div>
          </Card>
        </div>
        
        {/* Category Details and Fields */}
        <div className="lg:col-span-2">
          {activeCategory !== null && configData.categories[activeCategory] && (
            <>
              <Card title="Category Details">
                <div className="space-y-4">
                  <FormInput
                    id="categoryTitle"
                    label="Title"
                    type="text"
                    value={configData.categories[activeCategory].title || ''}
                    onChange={(e) => handleCategoryChange(activeCategory, 'title', e.target.value)}
                    placeholder="Enter category title"
                    required
                  />
                  
                  <FormInput
                    id="categoryDescription"
                    label="Description"
                    type="textarea"
                    value={configData.categories[activeCategory].description || ''}
                    onChange={(e) => handleCategoryChange(activeCategory, 'description', e.target.value)}
                    placeholder="Enter category description"
                    rows={2}
                  />
                </div>
              </Card>
              
              <div className="mt-6">
                <Card title="Fields" 
                  footerContent={
                    <Button variant="primary" onClick={() => addField(activeCategory)} fullWidth>
                      Add New Field
                    </Button>
                  }
                >
                  <div className="space-y-4">
                    {configData.categories[activeCategory].fields?.length > 0 ? (
                      configData.categories[activeCategory].fields.map((field, fieldIndex) => (
                        <div 
                          key={field.id || fieldIndex}
                          className={`p-4 rounded-md border ${activeField === fieldIndex ? 'border-blue-500 bg-gray-750' : 'border-gray-700 bg-gray-800'}`}
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex items-center">
                              <div className={`px-2 py-1 text-xs rounded ${getFieldTypeColor(field.type)}`}>
                                {getFieldTypeLabel(field.type)}
                              </div>
                              <h3 className="ml-2 font-medium text-gray-100">{field.label || 'Unnamed Field'}</h3>
                            </div>
                            <div className="flex space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setActiveField(activeField === fieldIndex ? null : fieldIndex)}
                              >
                                {activeField === fieldIndex ? (
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                                  </svg>
                                ) : (
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                  </svg>
                                )}
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => deleteField(activeCategory, fieldIndex)}
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </Button>
                            </div>
                          </div>
                          
                          {activeField === fieldIndex && (
                            <div className="mt-4 pt-4 border-t border-gray-700 space-y-4">
                              <FormInput
                                id={`field-${fieldIndex}-label`}
                                label="Field Label"
                                type="text"
                                value={field.label || ''}
                                onChange={(e) => handleFieldChange(activeCategory, fieldIndex, 'label', e.target.value)}
                                placeholder="Enter field label"
                                required
                              />
                              
                              <FormInput
                                id={`field-${fieldIndex}-type`}
                                label="Field Type"
                                type="select"
                                value={field.type || 'text'}
                                onChange={(e) => handleFieldChange(activeCategory, fieldIndex, 'type', e.target.value)}
                                options={[
                                  { value: 'text', label: 'Text Input' },
                                  { value: 'textarea', label: 'Text Area' },
                                  { value: 'number', label: 'Number' },
                                  { value: 'boolean', label: 'Checkbox' },
                                  { value: 'enum', label: 'Dropdown' },
                                  { value: 'radio', label: 'Radio Buttons' },
                                  { value: 'rating', label: 'Rating (1-5)' }
                                ]}
                              />
                              
                              {field.type !== 'boolean' && field.type !== 'rating' && (
                                <FormInput
                                  id={`field-${fieldIndex}-placeholder`}
                                  label="Placeholder"
                                  type="text"
                                  value={field.placeholder || ''}
                                  onChange={(e) => handleFieldChange(activeCategory, fieldIndex, 'placeholder', e.target.value)}
                                  placeholder="Enter placeholder text"
                                />
                              )}
                              
                              <FormInput
                                id={`field-${fieldIndex}-required`}
                                label="Required Field"
                                type="checkbox"
                                checked={!!field.required}
                                onChange={(e) => handleFieldChange(activeCategory, fieldIndex, 'required', e.target.checked)}
                              />
                              
                              {/* Options for enum and radio field types */}
                              {(field.type === 'enum' || field.type === 'radio') && (
                                <div className="pt-2 border-t border-gray-700">
                                  <div className="flex justify-between items-center mb-4">
                                    <h4 className="text-gray-300">Options</h4>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => addOption(activeCategory, fieldIndex)}
                                    >
                                      Add Option
                                    </Button>
                                  </div>
                                  
                                  {field.options?.map((option, optionIndex) => (
                                    <div key={optionIndex} className="flex items-center space-x-2 mb-2">
                                      <div className="flex-1">
                                        <FormInput
                                          id={`field-${fieldIndex}-option-${optionIndex}-label`}
                                          label={`Option ${optionIndex + 1} Label`}
                                          type="text"
                                          value={option.label || ''}
                                          onChange={(e) => handleOptionChange(activeCategory, fieldIndex, optionIndex, 'label', e.target.value)}
                                          placeholder="Option label"
                                        />
                                      </div>
                                      <div className="flex-1">
                                        <FormInput
                                          id={`field-${fieldIndex}-option-${optionIndex}-value`}
                                          label="Value"
                                          type="text"
                                          value={option.value || ''}
                                          onChange={(e) => handleOptionChange(activeCategory, fieldIndex, optionIndex, 'value', e.target.value)}
                                          placeholder="Option value"
                                        />
                                      </div>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => deleteOption(activeCategory, fieldIndex, optionIndex)}
                                        className="mt-6"
                                      >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                      </Button>
                                    </div>
                                  ))}
                                  
                                  {(!field.options || field.options.length === 0) && (
                                    <div className="text-center p-4 bg-gray-700 rounded-md">
                                      <p className="text-gray-400">No options added yet</p>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => addOption(activeCategory, fieldIndex)}
                                        className="mt-2"
                                      >
                                        Add First Option
                                      </Button>
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-gray-400">No fields added to this category yet</p>
                        <Button
                          variant="primary"
                          onClick={() => addField(activeCategory)}
                          className="mt-4"
                        >
                          Add First Field
                        </Button>
                      </div>
                    )}
                  </div>
                </Card>
              </div>
            </>
          )}
          
          {activeCategory === null && (
            <div className="bg-gray-800 p-8 rounded-lg text-center">
              <p className="text-gray-400">Select a category to edit or create a new one</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Helper functions
function getFieldTypeColor(type) {
  switch (type) {
    case 'text':
    case 'textarea':
      return 'bg-blue-900 text-blue-200';
    case 'number':
      return 'bg-green-900 text-green-200';
    case 'boolean':
      return 'bg-yellow-900 text-yellow-200';
    case 'enum':
    case 'radio':
      return 'bg-purple-900 text-purple-200';
    case 'rating':
      return 'bg-red-900 text-red-200';
    default:
      return 'bg-gray-700 text-gray-200';
  }
}

function getFieldTypeLabel(type) {
  switch (type) {
    case 'text':
      return 'Text';
    case 'textarea':
      return 'Text Area';
    case 'number':
      return 'Number';
    case 'boolean':
      return 'Checkbox';
    case 'enum':
      return 'Dropdown';
    case 'radio':
      return 'Radio';
    case 'rating':
      return 'Rating';
    default:
      return type;
  }
}

export default ConfigBuilder;