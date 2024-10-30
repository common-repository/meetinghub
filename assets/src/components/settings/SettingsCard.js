import React from "react";
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import SettingIcons from './SettingIcons';
const { __ } = wp.i18n;

function SettingsCard({ title, description, isUpcoming, settingsType }) {
	const getIcon = () => {
		switch (settingsType) {
			case 'jitsi':
				return SettingIcons.jitsi;
			case 'zoom':
				return SettingIcons.zoom;
			case 'webex':
				return SettingIcons.webex;
			case 'google_meet':
				return SettingIcons.google_meet;
			default:
				break;
		}
	};

	return (
		<div className="settings-card">
			<div className="card-top">
				<div className="card-left">
					{getIcon()} 
					<h3 className="card-title">{title}</h3>
					<p className="card-description">{description}</p>
				</div>
				
				<div className="card-right">
					{settingsType === 'jitsi' && 'connected' == mhubMeetingsData.jitsi_active_status && <p className="account-status">{__('Account connected', 'meetinghub')}</p>}
					{ settingsType === 'zoom'  && 'connected' == mhubMeetingsData.oauthData && <p className="account-status">{__('Account connected', 'meetinghub')}</p>}
					{ settingsType === 'webex'  && 'connected' == mhubMeetingsData.webex_auth && <p className="account-status">{__('Account connected', 'meetinghub')}</p>}
				</div>
			</div>
			<div className="card-bottom">
				{isUpcoming ? (
					<span className="upcoming">{__('Upcoming', 'meetinghub')}</span>
				) : (
					<Link to={`/${settingsType}`} className="settings-button">
						{__('Settings', 'meetinghub')}
					</Link>
				)}
			</div>
		</div>
	);
}

SettingsCard.propTypes = {
	title: PropTypes.string.isRequired,
	description: PropTypes.string.isRequired,
	isUpcoming: PropTypes.bool,
	settingsType: PropTypes.string.isRequired,
};

export default SettingsCard;
