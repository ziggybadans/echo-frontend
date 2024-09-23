// src/components/ModelList.js
import React, { useContext, useState } from 'react';
import { ChatContext } from '../context/ChatContext';
import { TrashIcon, PlusIcon } from '@heroicons/react/solid';

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

  const handleAddModel = async (e) => {
    e.preventDefault();
    // Validate inputs
    if (!newModel.name || !newModel.type || !newModel.model_identifier) {
      setError('Name, Type, and Model Identifier are required.');
      return;
    }

    // For 'huggingface', API key might not be required depending on usage
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
      const response = await fetch('http://localhost:8000/api/models', {
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
  };

  const handleDeleteModel = async (modelId) => {
    try {
      const response = await fetch(`http://localhost:8000/api/models/${modelId}`, {
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
  };

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
                />
                <span>{model.name} ({model.type})</span>
              </div>
              {!model.id.startsWith('huggingface_') && ( // Prevent deletion of predefined Hugging Face models
                <button
                  onClick={() => handleDeleteModel(model.id)}
                  className="text-red-500 hover:text-red-700"
                  title="Delete Model"
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
        className="mt-4 p-2 bg-green-500 text-white rounded hover:bg-green-600 flex items-center"
      >
        <PlusIcon className="h-5 w-5 mr-2" />
        Add New Model
      </button>

      {showAddForm && (
        <form onSubmit={handleAddModel} className="mt-4 space-y-2">
          {error && <div className="text-red-500">{error}</div>}
          <div>
            <label className="block text-sm font-medium">Name</label>
            <input
              type="text"
              value={newModel.name}
              onChange={(e) => setNewModel({ ...newModel, name: e.target.value })}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Type</label>
            <select
              value={newModel.type}
              onChange={(e) => setNewModel({ ...newModel, type: e.target.value })}
              className="w-full p-2 border rounded"
              required
            >
              <option value="anthropic">Anthropic</option>
              <option value="huggingface">Hugging Face</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium">Model Identifier</label>
            <input
              type="text"
              value={newModel.model_identifier}
              onChange={(e) => setNewModel({ ...newModel, model_identifier: e.target.value })}
              className="w-full p-2 border rounded"
              placeholder="e.g., claude-3-5-sonnet-20240620, yuntian-deng/o1mini"
              required
            />
          </div>
          {(newModel.type === 'anthropic' || newModel.type === 'huggingface') && (
            <>
              <div>
                <label className="block text-sm font-medium">API Key</label>
                <input
                  type="password"
                  value={newModel.api_key}
                  onChange={(e) => setNewModel({ ...newModel, api_key: e.target.value })}
                  className="w-full p-2 border rounded"
                  required={newModel.type !== 'huggingface'}
                />
              </div>
              {newModel.type === 'openai' && ( // Removed since OpenAI is no longer in use
                <>
                  <div>
                    <label className="block text-sm font-medium">Organization ID</label>
                    <input
                      type="text"
                      value={newModel.organization}
                      onChange={(e) => setNewModel({ ...newModel, organization: e.target.value })}
                      className="w-full p-2 border rounded"
                      required={newModel.type === 'openai'}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium">Project ID</label>
                    <input
                      type="text"
                      value={newModel.project_id}
                      onChange={(e) => setNewModel({ ...newModel, project_id: e.target.value })}
                      className="w-full p-2 border rounded"
                      required={newModel.type === 'openai'}
                    />
                  </div>
                </>
              )}
            </>
          )}
          <button
            type="submit"
            className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Save Model
          </button>
        </form>
      )}
    </div>
  );
}

export default ModelList;
