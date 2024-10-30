// ConnectTab.js
import React from 'react';
import '../../../scss/settings/connect-tab.scss';
import Spinner from '../../common/Spinner';
import PassInputField from '../common-fields/PassInputField';
const { __ } = wp.i18n;

const ConnectTab = ({ formData, setFormData }) => {

  const { oauth_account_id, oauth_client_id, oauth_client_secret, sdk_client_id, sdk_client_secret } = formData;

  const handleInputChange = (field, value) => {
    setFormData(prevState => ({
      ...prevState,
      [field]: value
    }));
  };

  return (
    <div className="meetinghub-connect-tab-content">
        {/* Server to Server Oauth Credentials */}
        <div className="accordion" id="meetinghub_s2sOauth-credentials">
          <div className="server-auth-credentials-info">
            <h3 className="title">{__('Server to Server OAuth Credentials', 'meetinghub')}</h3>
            <p className="description">
                {__('For Zoom "Server-to-Server OAuth" setup, visit the', 'meetinghub')}{' '}
                <a
                  href="https://marketplace.zoom.us/"
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  {__('Zoom Developer Portal', 'meetinghub')}
                </a>
                . {__('Watch our', 'meetinghub')}{' '}
                <a
                  href="https://youtu.be/ApSm4QJXLGc"
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  {__('tutorial video', 'meetinghub')}
                </a>{' '}
                {__('for guidance.', 'meetinghub')}
            </p>

          </div>
          <div className="mhub-section-pannel">
            {/* Oauth Account ID */}
            <PassInputField
              label={__('Oauth Account ID', 'meetinghub')}
              type="password"
              id="meetinghub_oauth_account_id"
              name="oauth_account_id"
              value={oauth_account_id}
              onChange={(value) =>
                handleInputChange('oauth_account_id', value)
              }
            />

            {/* Oauth Client ID */}
            <PassInputField
              label={__('Oauth Client ID', 'meetinghub')}
              type="password"
              id="meetinghub_oauth_client_id"
              name="oauth_client_id"
              value={oauth_client_id}
              onChange={(value) =>
                 handleInputChange('oauth_client_id', value)
              }
            />

            {/* Oauth Client Secret */}
            <PassInputField
              label={__('Oauth Client Secret', 'meetinghub')}
              type="password"
              id="meetinghub_oauth_client_secret"
              name="oauth_client_secret"
              value={oauth_client_secret}
              onChange={(value) =>
               handleInputChange('oauth_client_secret', value)
              }
            />
          </div>
        </div>

        {/* Meeting SDK App Credentials */}
        <div
          className="accordion"
          id="meetinghub_s2sOauth-app-sdk-credentials"
        >
          <div className="server-auth-credentials-info">
            <h3 className="title">{__('Meeting SDK App Credentials', 'meetinghub')}</h3>
            <p className="description">
              {__('To configure SDK App Credentials, go to the ', 'meetinghub')}
              <a
                href="https://marketplace.zoom.us/"
                target="_blank"
                rel="noreferrer noopener"
              >
                {__('Zoom Developer Portal', 'meetinghub')}
              </a>
              {'. '}
              {__('View our ')}
              <a
                href="https://youtu.be/Q0Zt80PjvTE"
                target="_blank"
                rel="noreferrer noopener"
              >
                {__('video tutorial', 'meetinghub')}
              </a>
              {' '}
              {__('for assistance.', 'meetinghub')}
            </p>

          </div>

          <div className="mhub-section-pannel">
            {/* SDK Client ID */}
            <PassInputField
              label={__('Client ID', 'meetinghub')}
              type="password"
              id="meetinghub_sdk_key"
              name="sdk_client_id"
              value={sdk_client_id}
              onChange={(value) =>
                handleInputChange('sdk_client_id', value)
              }
            />

            {/* SDK Client Secret */}
            <PassInputField
              label={__('Client Secret', 'meetinghub')}
              type="password"
              id="meetinghub_sdk_secret_key"
              name="sdk_client_secret"
              value={sdk_client_secret}
              onChange={(value) =>
                handleInputChange('sdk_client_secret', value)
              }
            />
          </div>
        </div>

    </div>
  );
};

export default ConnectTab;
