import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import '../../scss/dashboard/_common_form_style.scss';
import JitsiForm from './form/jitsi/JitsiForm';
import ZoomForm from './form/zoom/ZoomForm';
import WebexForm from "./form/webex/WebexForm";
const { __ } = wp.i18n;

export default function CreateMeeting() {
	const navigate = useNavigate();
	const [selectedPlatform, setSelectedPlatform] = useState('');


	const handleBack = () => {
		navigate('/');
	};

	const handlePlatformChange = (e) => {
		setSelectedPlatform(e.target.value);
	};


	return (
		<div className="meeting-wrapper">
			<button className='back-btn' onClick={handleBack}><span className="dashicons dashicons-arrow-left-alt"></span>{__('Back', 'meetinghub')}</button>
			
			<h2 className='title'>{__('Add New Meeting', 'meetinghub')}</h2>

			<div className='meeting-platform-wrapper'>
				<label>{__('Select your meeting app:', 'meetinghub')}</label>
				<select className='choice-meeting-platform' value={selectedPlatform} onChange={handlePlatformChange}>
					<option value="">--{__('Select', 'meetinghub')}--</option>
					<option value="jitsi_meet">{__('Jitsi Meet', 'meetinghub')}</option>
					<option value="zoom">{__('Zoom', 'meetinghub')}</option>
					<option value="webex">{__('Webex', 'meetinghub')}</option>
				</select>
			</div>

			{selectedPlatform === 'jitsi_meet' && <JitsiForm selectedPlatform={selectedPlatform} />}
			{selectedPlatform === 'zoom' && <ZoomForm selectedPlatform={selectedPlatform} />}
			{selectedPlatform === 'webex' && <WebexForm selectedPlatform={selectedPlatform} />}
		</div>
	);
}
