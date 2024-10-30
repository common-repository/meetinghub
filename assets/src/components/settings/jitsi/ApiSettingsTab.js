import React from "react";
import InputField from "./InputField";
import TextAreaField from "./TextAreaField";
import { isProActive } from "../../../Helpers";
import { Tooltip } from 'react-tooltip'
import 'react-tooltip/dist/react-tooltip.css'
const { __ } = wp.i18n;
import PassInputField from "../common-fields/PassInputField";

const ApiSettingsTab = ({ formData, setFormData }) => {
  const handleDomainChange = (event) => {
    setFormData({
      ...formData,
      domain_type: event.target.value
    });
  };

  const handleInputChange = (field, value) => {
    setFormData(prevState => ({
      ...prevState,
      [field]: value
    }));
  };

  const { domain_type, custom_domain, app_id, api_key, private_key } = formData;

  return (
    <div className="api-settings-tab">
      <div className="jitsi-section-pannel">
        <div className="select-domain-title">
          <h3>{__('Select your hosted domain', 'meetinghub')}</h3>
        </div>
        <div className="select-domain-description">
          <p>{__('Select a domain where your Jitsi meetings will be hosted.', 'meetinghub')}</p>
        </div>

        <div className="radio-field">
          <input
            type="radio"
            id="jitsi_random_public"
            value="jitsi_random_public"
            checked={domain_type === "jitsi_random_public"}
            onChange={handleDomainChange}
          />
          <label htmlFor="jitsi_random_public">
            {__('Random public domain', 'meetinghub')}
            <a className="mhub-info" data-tooltip-id="jitsi_random_public" data-tooltip-content={__('Selecting \'Random public domain\' will join you to a randomly selected public room.', 'meetinghub')}>𝒊</a>
          </label>

          <Tooltip id="jitsi_random_public" place="right" type="info" effect="float" style={{ fontSize: '14px', width: '400px' }} />
        </div>

        <div className={`radio-field`}>
          <input
            type="radio"
            id="jitsi_jass_premium"
            value="jitsi_jass_premium"
            checked={domain_type === "jitsi_jass_premium"}
            onChange={handleDomainChange}
          />
         <label htmlFor="jitsi_jass_premium">
            {__('JaaS 8x8', 'meetinghub')}
            <a className="mhub-info" data-tooltip-id="jitsi_jass_premium" data-tooltip-content={__('Configure JaaS 8x8 API integration credentials.', 'meetinghub')}>𝒊</a>
          </label>

          <Tooltip id="jitsi_jass_premium" place="right" type="info" effect="float" style={{ fontSize: '14px', width: '400px' }} />
        </div>

        <div className={`radio-field`}>
          <input
            type="radio"
            id="jitsi_self_hosted"
            value="jitsi_self_hosted"
            checked={domain_type === "jitsi_self_hosted"}
            onChange={handleDomainChange}
          />
         <label htmlFor="jitsi_self_hosted">
            {__('I will use my own domain', 'meetinghub')}
            <a className="mhub-info" data-tooltip-id="jitsi_self_hosted" data-tooltip-content={__('This option will allow you to enter a specific domain for hosting Jitsi. You can use a self-hosted domain or any other domain.', 'meetinghub')}>𝒊</a>
          </label>

          <Tooltip id="jitsi_self_hosted" place="right" type="info" effect="float" style={{ fontSize: '14px', width: '400px' }} />

        </div>

        {domain_type === "jitsi_self_hosted" && (
          <div className={`sefl-hosted-wrapper`}>
             <p className="description">
                {__('You can use any valid domain here. To setup', 'meetinghub')}{' '}
                <a
                  href="https://jitsi.github.io/handbook/docs/devops-guide/"
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  {__('selfhosted server', 'meetinghub')}
                </a>{' '}
                {__('follow the guidance.', 'meetinghub')}
              </p>

            <div className={`field-wrapper`}>
              <InputField
                label={__('Hosted Domain', 'meetinghub')}
                type="text"
                id="meetinghub_hosted_domain"
                value={custom_domain}
                onChange={(value) => handleInputChange("custom_domain", value)}
                placeholder={__('Example: 8x8.vc', 'meetinghub')}
                tooltip={__('You can use a self-hosted domain or any other domain.', 'meetinghub')}
              />
            </div>
          </div>
        )}

        {domain_type === "jitsi_jass_premium" && (
        <div className={`jass-wrapper`}>
          <p className="description">
              {__('For "8x8 Jitsi as a Service" setup, please', 'meetinghub')}{' '}
              <a
                href="https://jaas.8x8.vc/#/"
                target="_blank"
                rel="noreferrer noopener"
              >
                {__('Login to your Jass Account', 'meetinghub')}
              </a>
              . {__('Watch our', 'meetinghub')}{' '}
              <a
                href="https://youtu.be/YqQ7Kcap5vo"
                target="_blank"
                rel="noreferrer noopener"
              >
                {__('tutorial video', 'meetinghub')}
              </a>{' '}
              {__('for guidance.', 'meetinghub')}
            </p>

          <div className={`field-wrapper`}>
              <PassInputField
                label={__('App Id', 'meetinghub')}
                type="password"
                id="jass_app_id"
                name="app_id"
                value={app_id}
                onChange={(value) => handleInputChange("app_id", value)}
                tooltip={__('Retrieve the App ID from your JaaS admin console', 'meetinghub')}
              />

              <PassInputField
                label={__('Api Key', 'meetinghub')}
                type="password"
                id="jass_api_key"
                name="api_key"
                value={api_key}
                onChange={(value) => handleInputChange("api_key", value)}
                tooltip={__('Obtain the API Key from your JaaS admin console', 'meetinghub')}
              />

              <TextAreaField
                label={__('Private Key', 'meetinghub')}
                id="jass_private_key"
                value={private_key}
                onChange={(value) => handleInputChange("private_key", value)}
                rows='6'
                tooltip={__('Generate a new private key and download it', 'meetinghub')}
              />

          </div>
        </div>
        )}

      </div>
    </div>
  );
};

export default ApiSettingsTab;