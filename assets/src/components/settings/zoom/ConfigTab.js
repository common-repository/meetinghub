import React from "react";
import MhInput from "../../common/fields/MhInput";
import MhSwitcher from "../../common/fields/MhSwitcher";
import TimezoneList from "../../common/fields/TimezoneList";
import MhSelect from "../../common/fields/MhSelect";
import { isProActive } from "../../../Helpers";
const { __ } = wp.i18n;

const ConfigTab = ({ formData, setFormData }) => {

	const handleChange = (name, value) => {
		setFormData({ ...formData, [name]: value });
	};

	//timezones
	const Timezones = TimezoneList();

	//Auto recording
	const autoRecording = [
		{ value: 'none', label: __('No Recordings', 'meetinghub') },
		{ value: 'local', label: __('Local', 'meetinghub') },
		{ value: 'cloud', label: __('Cloud', 'meetinghub') },
	];
	
	const { enable_recurring_meeting, meeting_timezone, enable_should_register, disable_waiting_room, meeting_authentication, join_before_host,  option_mute_participants, practice_session, allow_multiple_devices, auto_recording, hide_sidebar, hide_header_footer } = formData;

	return (
		<div>
			<div className="mhub-col-lg-12">
				<MhSwitcher
					label={__('Recurring Meeting', 'meetinghub')}
					description={__('Enable recurring meeting.', 'meetinghub')}
					checked={enable_recurring_meeting}
					onChange={(name, value) => handleChange(name, value)}
					name="enable_recurring_meeting"
					disabled={!isProActive()} 
					isLocked={ !isProActive()}
				/>
			</div>

			<div className="mhub-col-lg-12">
				<MhSelect
					label={__('Timezone', 'meetinghub')}
					description={__('Meeting Timezone.', 'meetinghub')}
					options={Timezones}
					value={meeting_timezone}
					onChange={(name, value) => handleChange(name, value)}
					name="meeting_timezone"
				/>
			</div>

			<div className="mhub-col-lg-12">
				<MhSwitcher
					label={__('Should Register', 'meetinghub')}
					description={__('If user should be register to join the meeting', 'meetinghub')}
					checked={enable_should_register}
					onChange={(name, value) => handleChange(name, value)}
					name="enable_should_register"
					disabled={!isProActive()} 
					isLocked={ !isProActive()}
				/>
			</div>

			<div className="mhub-col-lg-12">
				<MhSwitcher
					label={__('Disable Waiting Room', 'meetinghub')}
					description={__('Waiting Room is enabled by default - if you want users to skip the waiting room and join the meeting directly - enable this option.', 'meetinghub')}
					checked={disable_waiting_room}
					onChange={(name, value) => handleChange(name, value)}
					name="disable_waiting_room"
				/>
			</div>

			<div className="mhub-col-lg-12">
				<MhSwitcher
					label={__('Meeting Authentication', 'meetinghub')}
					description={__('Only loggedin users in Zoom App can join this Meeting.', 'meetinghub')}
					checked={meeting_authentication}
					onChange={(name, value) => handleChange(name, value)}
					name="meeting_authentication"
				/>
			</div>

			<div className="mhub-col-lg-12">
				<MhSwitcher
					label={__('Join Before Host', 'meetinghub')}
					description={__('Allow users to join meeting before host start/joins the meeting. Only for scheduled or recurring meetings. If the waiting room is enabled, this setting will not work.', 'meetinghub')}
					checked={join_before_host}
					onChange={(name, value) => handleChange(name, value)}
					name="join_before_host"
				/>
			</div>

			<div className="mhub-col-lg-12">
				<MhSwitcher
					label={__('Mute Participants upon entry', 'meetinghub')}
					description={__('Mutes Participants when entering the meeting.', 'meetinghub')}
					checked={option_mute_participants}
					onChange={(name, value) => handleChange(name, value)}
					name="option_mute_participants"
				/>
			</div>

			<div className="mhub-col-lg-12">
				<MhSwitcher
					label={__('Practise Session', 'meetinghub')}
					description={__('Enable Practise Session.', 'meetinghub')}
					checked={practice_session}
					onChange={(name, value) => handleChange(name, value)}
					name="practice_session"
				/>
			</div>

			<div className="mhub-col-lg-12">
				<MhSwitcher
					label={__('Allow Multiple Devices', 'meetinghub')}
					description={__('Allow attendees to join from multiple devices.', 'meetinghub')}
					checked={allow_multiple_devices}
					onChange={(name, value) => handleChange(name, value)}
					name="allow_multiple_devices"
				/>
			</div>

			<div className="mhub-col-lg-12">
				<MhSelect
					label={__('Auto Recording', 'meetinghub')}
					description={__('Set what type of auto recording feature you want to add. Default is none.', 'meetinghub')}
					options={autoRecording}
					value={auto_recording}
					onChange={(name, value) => handleChange(name, value)}
					name="auto_recording"
				/>
			</div>

			<div className="mhub-col-lg-12">
				<MhSwitcher
					label={__('Hide Sidebar', 'meetinghub')}
					description={__('Hide meeting page right sidebar', 'meetinghub')}
					name="hide_sidebar"
					checked={hide_sidebar}
					onChange={(name, value) => handleChange(name, value)}
				/>
			</div>

			<div className="mhub-col-lg-12">
				<MhSwitcher
					label={__('Hide Header & Footer', 'meetinghub')}
					description={__('Hide header & footer on meeting page', 'meetinghub')}
					name="hide_header_footer"
					checked={hide_header_footer}
					onChange={(name, value) => handleChange(name, value)}
				/>
			</div>
		</div>
	);
};

export default ConfigTab;
