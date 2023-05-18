import React from 'react';
import './Popup.css';
import { useState, useEffect } from 'react';
import { Configuration, OpenAIApi } from 'openai';

const Popup = () => {
  // Stash States
  const [filter, setFilter] = useState('');
  const [stashes, setStashes] = useState([]);

  // GPT States
  const [gptText, setGptText] = useState('');
  const [userInput, setUserInput] = useState('');
  const [enhancedText, setEnhancedText] = useState('');
  const [apiKey, setApiKey] = useState('');

  // GPT API
  const configuration = new Configuration({
    organization: 'org-npYkIeyGCgTptmNRGSpAuqTb',
    apiKey: apiKey,
  });
  const openai = new OpenAIApi(configuration);

  // GPT Functions
  // Handle user input
  const handleChange = (event) => {
    setUserInput(event.target.value);
  };

  // Call GPT API
  const enhanceWithAI = async (text) => {
    const response = await openai.createCompletion({
      model: 'text-davinci-003',
      prompt: text,
      max_tokens: 500,
      temperature: 0,
    });
    setEnhancedText(response.data.choices[0].text);
  };

  // Close GPT Overlay
  function closeOverlay() {
    setGptText('');
    setUserInput('');
    setEnhancedText('');
  }

  // Stash Functions
  // Filter stashes by current site
  function filterStash() {
    getCurrentTab().then((tab) => {
      let tabValue = tab.url;
      tabValue = tabValue.match(
        /^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n]+)/
      )[1];
      {
        tabValue === filter ? setFilter('') : setFilter(tabValue);
      }
    });
  }

  const filteredStashes = stashes.filter((stash) => {
    return stash.site.toLowerCase().includes(filter.toLowerCase());
  });

  // Remove stash from local storage
  function removeStash(id) {
    const newStashes = stashes.filter((stash) => stash.id !== id);
    chrome.storage.local.set({ selectedArray: newStashes }, function () {
      setStashes(newStashes);
    });
  }

  // Get current tab
  async function getCurrentTab() {
    let queryOptions = {
      active: true,
      lastFocusedWindow: true,
    };
    let [tab] = await chrome.tabs.query(queryOptions);
    return tab;
  }

  // Get stashes from local storage
  useEffect(() => {
    chrome.storage.local.get(['apiKey'], function (result) {
      result.apiKey ? setApiKey(result.apiKey) : setApiKey('');
    });
    chrome.storage.local.get(['selectedArray'], function (result) {
      result.selectedArray ? setStashes(result.selectedArray) : setStashes([]);
    });
  }, []);

  return (
    <div className="App">
      {/* GPT Overlay */}
      {gptText !== '' ? (
        <div className="gpt-overlay">
          {apiKey ? (
            <div className="gpt-overlay-content">
              <h2>Ask the Genie</h2>
              <p className="clamped-text">Your Selected Text: {gptText}</p>
              <div className="gpt-overlay-content-userinput">
                <input
                  type="text"
                  value={userInput}
                  placeholder="Ask a question"
                  onChange={handleChange}
                />
                <div>
                  <button
                    className="gpt-overlay-button"
                    onClick={() => enhanceWithAI(userInput + ' ' + gptText)}
                  >
                    Ask
                  </button>
                </div>
              </div>
              {enhancedText && (
                <div className="gpt-overlay-output">
                  Output from GPT: <br />
                  {enhancedText}
                </div>
              )}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="close-button"
                onClick={() => {
                  closeOverlay();
                }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          ) : (
            <div className="gpt-overlay-content">
              <p>
                Head over to Options page, Enter your API key and reload the
                Extension to continue
              </p>
            </div>
          )}
        </div>
      ) : null}

      {/* Extension Popup */}
      <header className="App-header">
        <h1>SnapStash</h1>
      </header>
      <div className="stash">
        <div className="stash-header">
          <h2>Your Stashes:</h2>
          <button
            id="idkbutton"
            className={`stash-header-button ${
              filter !== '' ? 'stash-header-active-button' : ''
            }`}
            onClick={() => filterStash()}
          >
            Current Site
          </button>
        </div>
        {filter !== '' ? <p>Showing stashes from {filter}</p> : null}
        {filteredStashes.length === 0 && (
          <div className="stash-card">No stashes yet!</div>
        )}
        <div className="stash-items">
          {filteredStashes.map((stash) => (
            <div key={stash.id} className="stash-card">
              <p className="clamped-text">{stash.content}</p>
              <div className="stash-details">
                <p>{stash.site}</p>
                <button
                  className="stash-header-button stash-header-active-button"
                  onClick={() => setGptText(stash.content)}
                >
                  Enhance
                </button>
                <p>{stash.date}</p>
              </div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="close-button"
                onClick={() => {
                  removeStash(stash.id);
                }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Popup;
