import React from 'react';
import './Popup.css';
import { useState, useEffect } from 'react';

const Popup = () => {
  const [filter, setFilter] = useState('');
  const stashes = [
    {
      id: 1,
      content:
        'The greatest glory in living lies not in never falling, but in rising every time we fall.',
      site: 'google.com',
      date: new Date(),
    },
    {
      id: 2,
      content: 'The way to get started is to quit talking and begin doing.',
      site: 'yetanothersite.com',
      date: new Date(),
    },
    {
      id: 3,
      content:
        'If life were predictable it would cease to be life, and be without flavor.',
      site: 'yetanothersite.com',
      date: new Date(),
    },
  ];
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

  async function getCurrentTab() {
    let queryOptions = {
      active: true,
      lastFocusedWindow: true,
    };
    let [tab] = await chrome.tabs.query(queryOptions);
    return tab;
  }
  const filteredStashes = stashes.filter((stash) => {
    return stash.site.toLowerCase().includes(filter.toLowerCase());
  });
  return (
    <div className="App">
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
        {filteredStashes.map((stash) => (
          <div key={stash.id} className="stash-card">
            <p>{stash.content}</p>
            <div className="stash-details">
              <p>{stash.site}</p>
              <p>{stash.date.toLocaleDateString('in')}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Popup;
