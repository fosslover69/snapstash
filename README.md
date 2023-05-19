<img src="src/assets/img/icon-128.png" width="64"/>

# SnapStash

## _Snap the Moments, Stash the Inspiration, Fuel Your Genius_

SnapStash is a powerful Chrome extension that allows you to capture, store, and transform web content with ease. Whether it's capturing text snippets, saving web conent, or generating creative outputs, SnapStash empowers you to enhance your web browsing experience and fuel your inspiration.

## Features

- Capture and Save: Easily capture and save the content of selected contents from the active webpage.

- Storage: Store all captured elements' text in local storage for easy access.

- Display and Metadata: Display captured text for confirmation and show relevant metadata like timestamp and source URL.

- Creative Generation: Generate creative outputs using the captured text and GPT3 API integration.

- Local Storage Persistence: Store saved captures and generated results in local storage for continued accessibility.

## Installation

- Clone this repository.

- On the root directory of this project run `npm install`

- Once the needed packages are installed, run `npm run build`

- Open the Chrome browser and go to chrome://extensions.

- Enable Developer Mode by toggling the switch on the top right corner.

- Click on "Load unpacked" and select the bulid folder on the project directory.

- The SnapStash extension will be added to your browser, and you can start using it right away.

## Usage

- Activate SnapStash by pressing the keyboard shortcut Ctrl + ;. The extension will enter capture mode.

- Select the desired text on the webpage you want to capture.

- Press Ctrl + Y or right-click and select "Save to Snaps" from the context menu to save the captured text.

- An alert will appear, confirming that the content has been saved. You can review the captured text in the popover menu.

- Access the SnapStash popover menu by clicking on the SnapStash toolbar icon. From there, you can manage your captured elements, view metadata, and utilize the creative generation feature.

- To generate creative outputs, select the captured text you want to use as input and click the "Generate" button in the popover menu. SnapStash will send the text to the GPT3 API along with a relevant prompt and display the results.

- Please note that you need to obtain the necessary keys from the GPT3 API provider and enter them in the SnapStash options page for the creative generation feature to work.

Note: The SnapStash extension requires access to your browser tabs and storage to provide the capturing, storage, and creative generation features.

This project is made from this [boilerplate](https://github.com/lxieyang/chrome-extension-boilerplate-react)
