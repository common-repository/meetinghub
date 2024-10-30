// MhSelect.js
import React from 'react';
const { __ } = wp.i18n;
import { useMhubAdmin } from "../../../App/MhubAdminContext";


const MhSelect = ({ label, description, options, value, onChange, name, disabled, isLocked }) => {
  const { openProModal } = useMhubAdmin();

  return (
    <div className="mhub-form-group">
      <label>
        {label}
        {description && <small className="description">{description}</small>}
      </label>
      <div className="input-wrapper">
        <select value={value} onChange={(e) => onChange(name, e.target.value)} disabled={disabled} className={`${isLocked ? 'mhub-locked' : ''}`}> 
          {options.map(
            (option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            )
          )}
        </select>
      
        { disabled && ( <div className="mhub_disabled" onClick={openProModal}></div>)}

        {name === 'host_id' && (
            <p className="mhub-field_right_dec">{__('Note: Did not find any hosts here ? Please check zoom settings to verify your API keys are working correctly.', 'meetinghub')}</p>
        )}

        {name === 'meeting_type' && (
            <p className="mhub-field_right_dec">{__('Note: Webinar requires Zoom Webinar Plan enabled in your account', 'meetinghub')}</p>
        )}

        {name === 'zoom_user_action' && (
           <div className="mhub-hint-wrapper">
            <ol>
                <li className="hint">
                    <strong>{__('"Create"', 'meetinghub')}</strong> - {__('Users will receive an email from Zoom containing a confirmation link. Clicking this link will activate their Zoom account. Users can then set or change their password within Zoom.', 'meetinghub')}
                </li>

                <li className="hint">
                    <strong>{__('"Automated Create"', 'meetinghub')}</strong> - {__('This feature is intended for enterprise customers with managed domains. It is disabled by default due to the security risks associated with creating a user without their explicit notification.', 'meetinghub')}
                </li>

                <li className="hint">
                    <strong>{__('"Custom Create"', 'meetinghub')}</strong> - {__('This feature is only available for API partners. Users created in this manner do not have passwords and cannot log into the Zoom website or client.', 'meetinghub')}
                </li>

                <li className="hint">
                    <strong>{__('"SSO Create"', 'meetinghub')}</strong> - {__('This feature is available for users with the "Pre-provisioning SSO User" option enabled. Users created in this manner do not have passwords. If the user is not a basic user, a Personal Vanity URL will be generated using their username (without domain) from the provisioning email. If the username or PMI is invalid or already in use, a random number/random personal vanity URL will be assigned.', 'meetinghub')}
                </li>
            </ol>
          </div>
        )}
        
        {isLocked ? (<span className="mhub-pro-tag select-pro" onClick={openProModal}>{__('Pro', 'meetinghub')}</span>) : ''}
      </div>
    </div>
  );
};

export default MhSelect;
