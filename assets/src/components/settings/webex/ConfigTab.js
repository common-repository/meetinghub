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

  const { meeting_timezone, hide_sidebar, hide_header_footer, auto_record, breakout_sessions, automatic_lock, lock_minutes, enable_should_register, enable_recurring_meeting, join_before_host } = formData;

  	//Lock data
	  const lockOptions = [
		{ value: '0', label: __('0', 'meetinghub') },
		{ value: '5', label: __('5', 'meetinghub') },
		{ value: '10', label: __('10', 'meetinghub') },
		{ value: '15', label: __('15', 'meetinghub') },
		{ value: '20', label: __('20', 'meetinghub') },
	];
	

  return (
    <div>
		<div className="mhub-col-lg-12">
			<MhSwitcher
				label={__('Recurring Meeting', 'meetinghub')}
				description={__('Enable recurring meeting.', 'meetinghub')}				
				checked={enable_recurring_meeting}
				onChange={(name, value) => handleChange(name, value)}
				name="enable_recurring_meeting"
				disabled={true}
				isUpcomming={true}
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
				label={__('Join Before Host', 'meetinghub')}
				description={__('Whether or not to allow any attendee to join the meeting before the host joins the meeting', 'meetinghub')}				
				checked={join_before_host}
				onChange={(name, value) => handleChange(name, value)}
				name="join_before_host"
			/>
		</div>

		<div className="mhub-col-lg-12">
			<MhSwitcher
				label={__('Auto Record Meeting', 'meetinghub')}
				description={__('Whether or not meeting is recorded automatically', 'meetinghub')}				
				checked={auto_record}
				onChange={(name, value) => handleChange(name, value)}
				name="auto_record"
			/>
		</div>

		<div className="mhub-col-lg-12">
			<MhSwitcher
				label={__('Enable Breakout sessions', 'meetinghub')}
				description={__('Whether or not breakout sessions is enabled', 'meetinghub')}				
				checked={breakout_sessions}
				onChange={(name, value) => handleChange(name, value)}
				name="breakout_sessions"
			/>
		</div>

		<div className="mhub-col-lg-12">
			<MhSwitcher
				label={__('Enable Automatic Lock', 'meetinghub')}
				description={__('Whether or not automatic lock is enabled', 'meetinghub')}				
				checked={automatic_lock}
				onChange={(name, value) => handleChange(name, value)}
				name="automatic_lock"
			/>
		</div>

		<div className="mhub-col-lg-12">
			<MhSelect
				label={__('Meetings Lock After', 'meetinghub')}
				description={__('Automatically lock my meeting after the meeting starts', 'meetinghub')}					
				options={lockOptions}
				value={lock_minutes}
				onChange={(name, value) => handleChange(name, value)}
				name="lock_minutes"
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
