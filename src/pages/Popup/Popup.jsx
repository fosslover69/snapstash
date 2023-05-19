import React from 'react';
import './Popup.css';
import { useState, useEffect } from 'react';
import { Configuration, OpenAIApi } from 'openai';
import icon from '../../assets/img/icon-128.png';

const Popup = () => {
  // Stash States
  const [filter, setFilter] = useState('');
  const [stashes, setStashes] = useState([]);

  // GPT States
  const [gptText, setGptText] = useState('');
  const [userInput, setUserInput] = useState('');
  const [enhancedText, setEnhancedText] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [orgKey, setOrgKey] = useState('');

  // GPT API
  const configuration = new Configuration({
    organization: orgKey,
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
    setEnhancedText('Loading...');
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
    chrome.storage.local.get(['orgKey'], function (result) {
      result.orgKey ? setOrgKey(result.orgKey) : setOrgKey('');
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
          {apiKey && orgKey ? (
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
                Head over to Options page, Enter your API and Org keys and
                reload the Extension to continue
              </p>
            </div>
          )}
        </div>
      ) : null}

      {/* Extension Popup */}
      <header className="App-header">
        <img src={icon} width={'40px'} alt="logo" />
        <h1>SnapStash</h1>
      </header>
      <div className="stash">
        <div className="stash-header">
          <h2>Your Stashes:</h2>
          <button
            id="idkbutton"
            className={`stash-header-button stash-enhance-button ${
              filter !== '' ? 'stash-header-active-button' : ''
            }`}
            onClick={() => filterStash()}
          >
            <svg
              width="20px"
              height="20px"
              viewBox="0 0 64 64"
              xmlns="http://www.w3.org/2000/svg"
              stroke-width="2"
              stroke="#ffffff"
              fill="none"
            >
              <path d="M39.93,55.72A24.86,24.86,0,1,1,56.86,32.15a37.24,37.24,0,0,1-.73,6" />
              <path d="M37.86,51.1A47,47,0,0,1,32,56.7" />
              <path d="M32,7A34.14,34.14,0,0,1,43.57,30a34.07,34.07,0,0,1,.09,4.85" />
              <path d="M32,7A34.09,34.09,0,0,0,20.31,32.46c0,16.2,7.28,21,11.66,24.24" />
              <line x1="10.37" y1="19.9" x2="53.75" y2="19.9" />
              <line x1="32" y1="6.99" x2="32" y2="56.7" />
              <line x1="11.05" y1="45.48" x2="37.04" y2="45.48" />
              <line x1="7.14" y1="32.46" x2="56.86" y2="31.85" />
              <path d="M53.57,57,58,52.56l-8-8,4.55-2.91a.38.38,0,0,0-.12-.7L39.14,37.37a.39.39,0,0,0-.46.46L42,53.41a.39.39,0,0,0,.71.13L45.57,49Z" />
            </svg>
            <p>Current Site</p>
          </button>
        </div>
        {filter !== '' ? <p>Showing stashes from {filter}</p> : null}
        {filteredStashes.length === 0 && (
          <div className="stash-card">No stashes yet!</div>
        )}
        <div className="stash-items">
          {filteredStashes.map((stash) => (
            <div key={stash.id} className="stash-card">
              <a
                href={stash.url}
                className="stash-url"
                target="_blank"
                rel="noreferrer"
              >
                <p className="clamped-text">{stash.content}</p>
              </a>
              <div className="stash-details">
                <p>{stash.site}</p>
                <button
                  className="stash-header-button stash-header-active-button stash-enhance-button"
                  style={{ fontSize: '0.7rem' }}
                  onClick={() => setGptText(stash.content)}
                >
                  <svg
                    fill="#ffffff"
                    width="20px"
                    height="20px"
                    viewBox="0 0 32 32"
                    version="1.1"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <title>magic</title>
                    <path d="M9.5 9.625l-0.906 2.906-0.875-2.906-2.906-0.906 2.906-0.875 0.875-2.938 0.906 2.938 2.906 0.875zM14.563 8.031l-0.438 1.469-0.5-1.469-1.438-0.469 1.438-0.438 0.5-1.438 0.438 1.438 1.438 0.438zM0.281 24l17.906-17.375c0.125-0.156 0.313-0.25 0.531-0.25 0.281-0.031 0.563 0.063 0.781 0.281 0.094 0.063 0.219 0.188 0.406 0.344 0.344 0.313 0.719 0.688 1 1.063 0.125 0.188 0.188 0.344 0.188 0.5 0.031 0.313-0.063 0.594-0.25 0.781l-17.906 17.438c-0.156 0.156-0.344 0.219-0.563 0.25-0.281 0.031-0.563-0.063-0.781-0.281-0.094-0.094-0.219-0.188-0.406-0.375-0.344-0.281-0.719-0.656-0.969-1.063-0.125-0.188-0.188-0.375-0.219-0.531-0.031-0.313 0.063-0.563 0.281-0.781zM14.656 11.375l1.313 1.344 4.156-4.031-1.313-1.375zM5.938 13.156l-0.406 1.438-0.438-1.438-1.438-0.469 1.438-0.438 0.438-1.469 0.406 1.469 1.5 0.438zM20.5 12.063l0.469 1.469 1.438 0.438-1.438 0.469-0.469 1.438-0.469-1.438-1.438-0.469 1.438-0.438z"></path>
                  </svg>
                  <p>Enhance</p>
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
