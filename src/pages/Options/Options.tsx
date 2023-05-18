import React, { useState, useEffect } from 'react';
import './Options.css';

interface Props {
  title: string;
}

const Options: React.FC<Props> = ({ title }: Props) => {
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [orgKey, setOrgKey] = useState<string | null>(null);
  const [input, setInput] = useState('');
  const [orgInput, setOrgInput] = useState('');

  useEffect(() => {
    chrome.storage.local.get(['apiKey'], (result) => {
      setApiKey(result.apiKey);
    });
    chrome.storage.local.get(['orgKey'], (result) => {
      setOrgKey(result.orgKey);
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

  function saveOrgKey() {
    setOrgKey(orgInput);
    chrome.storage.local.set({ orgKey: orgInput }, () => {
      chrome.runtime.sendMessage({
        type: 'notification',
        title: 'Organization Key Saved',
        message: 'Your Organization Key has been saved.',
      });
      console.log('Value is set to ' + orgInput);
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

  function removeOrgKey() {
    chrome.storage.local.set({ orgKey: null }, () => {
      setOrgKey(null);
      chrome.runtime.sendMessage({
        type: 'notification',
        title: 'Organization Key Removed',
        message: 'Your Organization Key has been removed.',
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
            <p>OpenAI API Key</p>
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
          <div className="options-field">
            <p>OpenAI Org Key</p>
            {orgKey !== null ? (
              <div className="options-field">
                <input
                  type="text"
                  value={orgKey}
                  className="options-field-api"
                  disabled
                />
                <button onClick={removeOrgKey}>Remove</button>
              </div>
            ) : (
              <div className="options-field">
                <input
                  type="text"
                  value={orgInput}
                  className="options-field-api"
                  placeholder="Enter your Org Key"
                  onChange={(e) => setOrgInput(e.target.value)}
                />
                <button onClick={saveOrgKey}>Save</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Options;
