// src/components/ModelList.js

import React, { useContext, useState, useCallback } from 'react';
import { ChatContext } from '../context/ChatContext';
import { TrashIcon, PlusIcon } from '@heroicons/react/solid';

/**
 * Component for listing, adding, and removing AI models.
 *
 * @returns {JSX.Element} The ModelList component.
 */
function ModelList() {
  const { 
    models, 
    addModel, 
    removeModel, 
    selectedModelId, 
    setSelectedModelId 
  } = useContext(ChatContext);
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [newModel, setNewModel] = useState({
    name: '',
    type: 'anthropic', // Default to 'anthropic'
    model_identifier: '',
    api_key: '',
    organization: '',
    project_id: '',
  });
  const [error, setError] = useState(null);

  /**
   * Handles the addition of a new AI model by submitting the form data to the backend.
   *
   * @param {object} e - The event object.
   */
  const handleAddModel = useCallback(async (e) => {
    e.preventDefault();
    // Validate inputs
    if (!newModel.name || !newModel.type || !newModel.model_identifier) {
      setError('Name, Type, and Model Identifier are required.');
      return;
    }

    // For 'anthropic', API key is required
    if (newModel.type === 'anthropic' && !newModel.api_key) {
      setError('API Key is required for Anthropic models.');
      return;
    }

    // Prepare payload
    const payload = {
      name: newModel.name,
      type: newModel.type,
      model_identifier: newModel.model_identifier,
      api_key: newModel.api_key || null,
      organization: newModel.organization || null,
      project_id: newModel.project_id || null,
    };

    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/models`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to add model.');
      }

      const addedModel = await response.json();
      addModel(addedModel);
      setShowAddForm(false);
      setNewModel({
        name: '',
        type: 'anthropic',
        model_identifier: '',
        api_key: '',
        organization: '',
        project_id: '',
      });
      setError(null);
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  }, [newModel, addModel]);

  /**
   * Handles the deletion of an AI model by its ID.
   *
   * @param {string} modelId - The ID of the model to delete.
   */
  const handleDeleteModel = useCallback(async (modelId) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/models/${modelId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to delete model.');
      }

      removeModel(modelId);
    } catch (err) {
      console.error(err);
      alert(`Error: ${err.message}`);
    }
  }, [removeModel]);

  return (
    <div className="p-4 dark:text-white">
      <h2 className="text-xl font-bold mb-4">Available Models</h2>
      
      {Array.isArray(models) && models.length > 0 ? (
        <ul>
          {models.map((model) => (
            <li key={model.id} className="flex justify-between items-center mb-2">
              <div>
                <input
                  type="radio"
                  name="selectedModel"
                  checked={selectedModelId === model.id}
                  onChange={() => setSelectedModelId(model.id)}
                  className="mr-2"
                  aria-label={`Select model ${model.name}`}
                />
                <span>{model.name} ({model.type})</span>
              </div>
              {!model.id.startsWith('huggingface_') && ( // Prevent deletion of predefined Hugging Face models
                <button
                  onClick={() => handleDeleteModel(model.id)}
                  className="text-red-500 hover:text-red-700 focus:outline-none"
                  title="Delete Model"
                  aria-label={`Delete model ${model.name}`}
                >
                  <TrashIcon className="h-5 w-5" />
                </button>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500 dark:text-gray-400">No models available.</p>
      )}

      <button
        onClick={() => setShowAddForm(!showAddForm)}
        className="mt-4 p-2 bg-green-500 text-white rounded hover:bg-green-600 flex items-center focus:outline-none"
        aria-label="Add New Model"
      >
        <PlusIcon className="h-5 w-5 mr-2" />
        Add New Model
      </button>

      {showAddForm && (
        <form onSubmit={handleAddModel} className="mt-4 space-y-2">
          {error && <div className="text-red-500">{error}</div>}
          <div>
            <label className="block text-sm font-medium">Name<span className="text-red-500">*</span></label>
            <input
              type="text"
              value={newModel.name}
              onChange={(e) => setNewModel({ ...newModel, name: e.target.value })}
              className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white focus:outline-none focus:ring focus:border-blue-300"
              required
              aria-required="true"
              aria-label="Model Name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Type<span className="text-red-500">*</span></label>
            <select
              value={newModel.type}
              onChange={(e) => setNewModel({ ...newModel, type: e.target.value })}
              className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white focus:outline-none focus:ring focus:border-blue-300"
              required
              aria-required="true"
              aria-label="Model Type"
            >
              <option value="anthropic">Anthropic</option>
              <option value="huggingface">Hugging Face</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium">Model Identifier<span className="text-red-500">*</span></label>
            <input
              type="text"
              value={newModel.model_identifier}
              onChange={(e) => setNewModel({ ...newModel, model_identifier: e.target.value })}
              className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white focus:outline-none focus:ring focus:border-blue-300"
              placeholder="e.g., claude-3-5-sonnet-20240620, yuntian-deng/o1mini"
              required
              aria-required="true"
              aria-label="Model Identifier"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">
              API Key {newModel.type === 'anthropic' && <span className="text-red-500">*</span>}
            </label>
            <input
              type="password"
              value={newModel.api_key}
              onChange={(e) => setNewModel({ ...newModel, api_key: e.target.value })}
              className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white focus:outline-none focus:ring focus:border-blue-300"
              required={newModel.type === 'anthropic'}
              aria-required={newModel.type === 'anthropic'}
              aria-label="API Key"
            />
          </div>
          {newModel.type === 'anthropic' && (
            <>
              <div>
                <label className="block text-sm font-medium">Organization ID</label>
                <input
                  type="text"
                  value={newModel.organization}
                  onChange={(e) => setNewModel({ ...newModel, organization: e.target.value })}
                  className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white focus:outline-none focus:ring focus:border-blue-300"
                  aria-label="Organization ID"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Project ID</label>
                <input
                  type="text"
                  value={newModel.project_id}
                  onChange={(e) => setNewModel({ ...newModel, project_id: e.target.value })}
                  className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white focus:outline-none focus:ring focus:border-blue-300"
                  aria-label="Project ID"
                />
              </div>
            </>
          )}
          <button
            type="submit"
            className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
            aria-label="Save Model"
          >
            Save Model
          </button>
        </form>
      )}
    </div>
  );
}

export default ModelList;
