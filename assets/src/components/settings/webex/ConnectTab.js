import React, { useEffect, useState } from "react";
import '../../../scss/settings/connect-tab.scss';
import Spinner from '../../common/Spinner';
import PassInputField from "../common-fields/PassInputField";
const { __ } = wp.i18n;

const ConnectTab = ({ formData, setFormData }) => {
  const [authUrl, setAuthUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [accessToken, setAccessToken] = useState('');

  const handleInputChange = (field, value) => {
    setFormData(prevState => ({
      ...prevState,
      [field]: value
    }));
  };

  useEffect(() => {
    fetchAccessToken();
  }, []);

  const fetchAccessToken = () => {
    setLoading(true);
    fetch('/wp-json/meetinghub/v1/webex/fetch-token')
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        return response.json();
      })
      .then(data => {
        setAccessToken(data.access_token);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching access token:', error);
        setLoading(false);
      });
  };

  const fetchAuthUrl = () => {
    setLoading(true);
    fetch('/wp-json/meetinghub/v1/webex/auth-url')
      .then(response => response.json())
      .then(data => {
        setAuthUrl(data.auth_url);
        setLoading(false);
        // Redirect to the fetched URL in the current tab
        window.location.href = data.auth_url;
      })
      .catch(error => {
        console.error('Error fetching auth URL:', error);
        setLoading(false);
      });
  };

  const disconnectWebex = () => {
    setLoading(true);
    fetch('/wp-json/meetinghub/v1/webex/revoke-access-token')
      .then(response => response.json())
      .then(data => {
        setLoading(false);
        //Redirect to the fetched URL in the current tab
        window.location.href = data.disconnect_url + '&revoke=true';
      })
      .catch(error => {
        console.error('Error fetching auth URL:', error);
        setLoading(false);
      });
  };


  const { client_id, client_secret } = formData;

  return (
    <div className="meetinghub-connect-tab-content">
      <div className="accordion" id="meetinghub-webex-credentials">
        <div className="webex-credentials-info">
          <h3 className="title">{__('Webex OAuth Credentials', 'meetinghub')}</h3>
            <p className="description">
              {__('For webex "Oauth Credentials" setup, visit the', 'meetinghub')}{' '}
              <a
                href="https://developer.webex.com/"
                target="_blank"
                rel="noreferrer noopener"
              >
                {__('Webex Developer Portal', 'meetinghub')}
              </a>
              . {__('Watch our', 'meetinghub')}{' '}
              <a
                href="https://youtu.be/vV3EwUNJusk"
                target="_blank"
                rel="noreferrer noopener"
              >
                {__('tutorial video', 'meetinghub')}
              </a>{' '}
              {__('for guidance.', 'meetinghub')}
            </p>
        </div>

        {client_id && client_secret && (
          <div className="webx-btn-wrapper">
            {accessToken.hasOwnProperty("access_token") &&
            accessToken.access_token.trim() !== "" ? (
              <a className="mhub-connect-webex" onClick={disconnectWebex}>
               {__('Disconnect Webex Account', 'meetinghub')}
              </a>
            ) : (
              <a className="mhub-connect-webex" onClick={fetchAuthUrl}>
               {__('Connect Webex Account', 'meetinghub')}
              </a>
            )}
          </div>
        )}

        <div className="mhub-section-pannel">
          {/* Client ID */}
          <PassInputField
            label={__('Client ID', 'meetinghub')}
            type="password"
            id="mhub_webex_client_id"
            name="mhub_webex_client_id"
            value={client_id}
            onChange={(value) =>
              handleInputChange('client_id', value)
            }
          />

          {/* Client Secret */}
          <PassInputField
            label={__('Client Secret', 'meetinghub')}
            type="password"
            id="mhub_webex_client_secret"
            name="mhub_webex_client_secret"
            value={client_secret}
            onChange={(value) =>
              handleInputChange('client_secret', value)
            }
          />
        </div>
  
      </div>
    </div>
  );
};

export default ConnectTab;
