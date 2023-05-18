import React, { useState, useEffect } from 'react';
import './Options.css';

interface Props {
  title: string;
}

const Options: React.FC<Props> = ({ title }: Props) => {
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [input, setInput] = useState('');

  useEffect(() => {
    chrome.storage.local.get(['apiKey'], (result) => {
      setApiKey(result.apiKey);
    });
  }, []);

  function saveApiKey() {
    setApiKey(input);
    chrome.storage.local.set({ apiKey: input }, () => {
      chrome.runtime.sendMessage({
        type: 'notification',
        title: 'API Key Saved',
        message: 'Your API Key has been saved.',
      });
      console.log('Value is set to ' + input);
    });
  }

  function removeApiKey() {
    chrome.storage.local.set({ apiKey: null }, () => {
      setApiKey(null);
      chrome.runtime.sendMessage({
        type: 'notification',
        title: 'API Key Removed',
        message: 'Your API Key has been removed.',
      });
    });
  }

  return (
    <div className="options">
      <h1 className="options-title">{title}</h1>
      <div className="options-content">
        <div>
          <h1>Options:</h1>
          <div className="options-field">
            OpenAI API Key
            {apiKey !== null ? (
              <div className="options-field">
                <input
                  type="text"
                  value={apiKey}
                  className="options-field-api"
                  disabled
                />
                <button onClick={removeApiKey}>Remove</button>
              </div>
            ) : (
              <div className="options-field">
                <input
                  type="text"
                  value={input}
                  className="options-field-api"
                  placeholder="Enter your API Key"
                  onChange={(e) => setInput(e.target.value)}
                />
                <button onClick={saveApiKey}>Save</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Options;
