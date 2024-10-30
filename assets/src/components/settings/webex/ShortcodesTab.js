import React, { useState } from "react";
const { __ } = wp.i18n;
import '../../../scss/settings/shortcode-tab.scss';

const shortcodes = [
  { title: "Webex Meeting List", description: "Embed a list of upcoming Webex meetings", code: "[mhub-webex-meeting-list]" },
];

const ShortcodesTab = () => {
  const [copiedIndex, setCopiedIndex] = useState(null);

  const handleCopyShortcode = (shortcode, index) => {
    const tempTextArea = document.createElement('textarea');
    tempTextArea.value = shortcode;
    document.body.appendChild(tempTextArea);

    tempTextArea.select();
    document.execCommand('copy');

    document.body.removeChild(tempTextArea);

    setCopiedIndex(index);

    // Reset copy status after a short delay
    setTimeout(() => setCopiedIndex(null), 1500);
  };

  return (
    <div className="shortcodes-tab">
      <h2>{__('Shortcodes', 'meetinghub')}</h2>
      <p>{__('Use these shortcodes to embed various functionalities into your pages with Elementor or Gutenberg', 'meetinghub')}</p>
      <div className="shortcodes-list">
        {shortcodes.map((shortcode, index) => (
          <div key={index} className="shortcode-item">
            <div className="left-content">
              <h3>{__(shortcode.title, 'meetinghub')}</h3>
              <p>{__(shortcode.description, 'meetinghub')}</p>
            </div>
            <div className="right-content">
              <button 
                onClick={() => handleCopyShortcode(shortcode.code, index)} 
                className="copy-shortcode-btn"
              >
                
                {copiedIndex === index ? (<span>Copied !</span>) : (<><i className='dashicons dashicons-admin-page'></i> <span>Copy Shortcode</span> </>)}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ShortcodesTab;
