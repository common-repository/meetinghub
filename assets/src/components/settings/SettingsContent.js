import React from 'react';
import SettingsCard from './SettingsCard';
const { __ } = wp.i18n;

function SettingsContent() {
	return (
		<div className="settings-container">
			<h1 className="settings-title">{__('Settings', 'meetinghub')}</h1>
			<div className="settings-cards">
				{/* Card 1 */}
				<SettingsCard
					title={__('Jitsi Meet', 'meetinghub')}
					description={__('Configure your Jitsi Meet settings to customize your video conferencing experience. Set up audio, video, and other preferences to suit your needs.', 'meetinghub')}
					settingsType="jitsi"
				/>

				{/* Card 2 */}
				<SettingsCard
					title={__('Zoom', 'meetinghub')}
					description={__('Adjust your Zoom settings to personalize your video conferencing sessions. Customize audio, video, and meeting options according to your preferences.', 'meetinghub')}
					settingsType="zoom"
				/>


				{/* Card 3 */}
				<SettingsCard
					title={__('Webex', 'meetinghub')}
					description={__('Customize your Webex settings, including authentication credentials and preferences for online meetings and collaboration sessions.', 'meetinghub')}
					settingsType="webex"
				/>

				{/* Card 3 */}
				<SettingsCard
					title={__('Google Meet', 'meetinghub')}
					description={__('Set up authentication and customize Google Meet settings for seamless online meetings and collaboration.', 'meetinghub')}
					settingsType="google_meet"
					isUpcoming
				/>

			</div>
		</div>
	);
}

export default SettingsContent;
