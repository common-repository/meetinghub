import React, { useState, useRef } from 'react';
import Datetime from 'react-datetime';
import 'react-datetime/css/react-datetime.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useNavigate } from "react-router-dom";
import MhInput from '../../../common/fields/MhInput';
import MhSelect from '../../../common/fields/MhSelect';
import MhSwitcher from '../../../common/fields/MhSwitcher';
import MhTextArea from '../../../common/fields/MhTextArea';
import TimezoneList from '../../../common/fields/TimezoneList';
import MhCheckbox from '../../../common/fields/MhCheckbox';
import MhDurationSelect from '../../../common/fields/MhDurationSelect';
import { generateRandomRoom } from '../../RandomRoomGenerator';
import { isProActive } from '../../../../Helpers';
import { zoomUsers } from '../../../../Helpers';
import { zoomDefaultUserId } from '../../../../Helpers';
import Select from 'react-select';
import Editor from 'react-simple-wysiwyg';
import { select2Styles } from '../../../../Helpers';
import { toast } from 'react-toastify';
const { __ } = wp.i18n;
import ImageUploader from '../../../common/ImageUploader';


const ZoomForm = ({ selectedPlatform }) => {
	const [errorMessage, setErrorMessage] = useState('');
	const [isSaving, setIsSaving] = useState(false);
	const navigate = useNavigate();
	const formRef = useRef(null);
	const hiddenSubmitRef = useRef(null);

	const [meetingDescription, setMeetingDescription] = useState('');
	const [imageUrl, setImageUrl] = useState('');
	const [imageId, setImageID] = useState('');

	function handleMeetingDescription(e) {
		setMeetingDescription(e.target.value);
	}

	const weekdays = [
		{ label: __('Sunday', 'meetinghub'), value: 1, checked: false },
		{ label: __('Monday', 'meetinghub'), value: 2, checked: false },
		{ label: __('Tuesday', 'meetinghub'), value: 3, checked: false },
		{ label: __('Wednesday', 'meetinghub'), value: 4, checked: false },
		{ label: __('Thursday', 'meetinghub'), value: 5, checked: false },
		{ label: __('Friday', 'meetinghub'), value: 6, checked: false },
		{ label: __('Saturday', 'meetinghub'), value: 7, checked: false },
	];

	const default_host_id = zoomDefaultUserId();
	var mhub_zoom_settings = mhubMeetingsData.mhub_zoom_settings;

	const [formData, setFormData] = useState({
		title: generateRandomRoom(10),
		startDateTime: new Date(),
		end_date_time: new Date(),
		meeting_type: '2',
		disable_waiting_room: mhub_zoom_settings ? mhub_zoom_settings.disable_waiting_room : false,
		meeting_authentication: mhub_zoom_settings ? mhub_zoom_settings.meeting_authentication : false,
		join_before_host: mhub_zoom_settings ? mhub_zoom_settings.join_before_host : false,
		option_host_video: mhub_zoom_settings ? mhub_zoom_settings.option_host_video : false,
		option_participants_video: mhub_zoom_settings ? mhub_zoom_settings.option_participants_video : false,
		option_mute_participants: mhub_zoom_settings ? mhub_zoom_settings.option_mute_participants : false,
		meeting_timezone: mhub_zoom_settings ? mhub_zoom_settings.meeting_timezone : mhubMeetingsData.mhub_timezone,
		auto_recording: mhub_zoom_settings ? mhub_zoom_settings.auto_recording : '',
		agenda: '',
		password: mhubMeetingsData.mhub_password,
		panelists_video: mhub_zoom_settings ? mhub_zoom_settings.panelists_video : false,
		practice_session: mhub_zoom_settings ? mhub_zoom_settings.practice_session : false,
		hd_video: mhub_zoom_settings ? mhub_zoom_settings.hd_video : false,
		allow_multiple_devices: mhub_zoom_settings ? mhub_zoom_settings.allow_multiple_devices : false,
		enable_recurring_meeting: mhub_zoom_settings ? mhub_zoom_settings.enable_recurring_meeting : false,
		recurrence_option: 1,
		end_type: 'date',
		set_number_of_occurrences: 1,
		repeat_day: 1,
		repeat_weekly: 1,
		repeat_monthly: 1,
		day_of_the_month: 1,
		weekdays: weekdays,
		occurs_on_monthly: 'day',
		set_month_order: 1,
		set_monthly_weekday: 1,
		duration_hours: 0,
		duration_minutes: 40,
		enable_should_register: mhub_zoom_settings ? mhub_zoom_settings.enable_should_register : false,
		hide_sidebar: mhub_zoom_settings ? mhub_zoom_settings.hide_sidebar : false,
		hide_header_footer: mhub_zoom_settings ? mhub_zoom_settings.hide_header_footer : false,
		host_id: default_host_id ? default_host_id : '',
		alternative_host: '',
	});

	const handleChange = (name, value) => {
		setFormData({ ...formData, [name]: value });
	};

	const handleWeekdays = (updatedOptions) => {
		// Extract the names of checked weekdays
		const checkedWeekdays = updatedOptions
			.filter(option => option.checked)
			.map(option => option.label.toLowerCase()); // Convert labels to lowercase

		// Update the formData state with the checked weekdays
		setFormData(prevState => ({
			...prevState,
			weekdays: updatedOptions
		}));
	};


	const handleSubmit = async (e) => {
		e.preventDefault();

		const checkedWeekdays = formData.weekdays
			.filter(day => day.checked)
			.map(day => day.value);

		// Disable the button
		setIsSaving(true);

		try {
			// Make an API request using wp.apiFetch
			const response = await wp.apiFetch({
				path: 'mhub/v1/meetings',
				method: 'POST',
				data: {
					title: formData.title,
					startDateTime: formData.startDateTime.toISOString(),
					meeting_type: formData.meeting_type,
					disable_waiting_room: formData.disable_waiting_room,
					meeting_authentication: formData.meeting_authentication,
					join_before_host: formData.join_before_host,
					option_host_video: formData.option_host_video,
					option_participants_video: formData.option_participants_video,
					option_mute_participants: formData.option_mute_participants,
					meeting_timezone: formData.meeting_timezone,
					auto_recording: formData.auto_recording,
					panelists_video: formData.panelists_video,
					practice_session: formData.practice_session,
					hd_video: formData.hd_video,
					agenda: formData.agenda,
					allow_multiple_devices: formData.allow_multiple_devices,
					password: formData.password,
					enable_recurring_meeting: formData.enable_recurring_meeting,
					recurrence_option: formData.recurrence_option,
					repeat_day: formData.repeat_day,
					end_type: formData.end_type,
					end_date_time: formData.end_date_time.toISOString(),
					set_number_of_occurrences: formData.set_number_of_occurrences,
					repeat_weekly: formData.repeat_weekly,
					weekdays: checkedWeekdays,
					repeat_monthly: formData.repeat_monthly,
					occurs_on_monthly: formData.occurs_on_monthly,
					day_of_the_month: formData.day_of_the_month,
					set_month_order: formData.set_month_order,
					set_monthly_weekday: formData.set_monthly_weekday,
					duration_hours: formData.duration_hours,
					duration_minutes: formData.duration_minutes,
					enable_should_register: formData.enable_should_register,
					selected_platform: selectedPlatform,
					hide_sidebar: formData.hide_sidebar,
					hide_header_footer: formData.hide_header_footer,
					host_id: formData.host_id,
					alternative_host: formData.alternative_host,
					meeting_description: JSON.stringify({ content: meetingDescription }),
					image_url: imageUrl,
					image_id: imageId,
				},
			});

			if (response.hasOwnProperty("uuid")) {
				setErrorMessage('');
				if (2 == formData.meeting_type) {
					toast.success(__('Meeting Created Successfully.', 'meetinghub'));
				}

				if (1 == formData.meeting_type) {
					toast.success(__('Webinar Created Successfully.', 'meetinghub'));
				}

				navigate('/');
			}

			if (response && (response.code || response.message)) {
				if (2 == formData.meeting_type) {
					toast.error(__('Failed to Create Meeting !', 'meetinghub'));
				}

				if (1 == formData.meeting_type) {
					toast.error(__('Failed to Create Webinar  !', 'meetinghub'));
				}

				if (response.message && response.message !== 'No privilege.') {
					// Error message from response
					setErrorMessage(response.message);
				} else {
					// Other error
					setErrorMessage(__('Error', 'meetinghub'));
				}

				if (response.message === 'No privilege.') {
					// No privilege error
					setErrorMessage(__("You don't have permission to add a new user", 'meetinghub'));
				}
			}

		} catch (error) {
			// Handle errors
			console.error('API Error:', error);
		} finally {
			// Enable the button after API request is complete (success or error)
			setIsSaving(false);
		}
	};


	// Define different options for each MhSelect
	const meetingTypeOptions = [
		{ value: '2', label: __('Meeting', 'meetinghub') },
		{ value: '1', label: __('Webinar', 'meetinghub') },
	];

	// Auto recording
	const autoRecording = [
		{ value: 'none', label: __('No Recordings', 'meetinghub') },
		{ value: 'local', label: __('Local', 'meetinghub') },
		{ value: 'cloud', label: __('Cloud', 'meetinghub') },
	];

	// Recurrence Options
	const recurrenceOptions = [
		{ value: '1', label: __('Daily', 'meetinghub') },
		{ value: '2', label: __('Weekly', 'meetinghub') },
		{ value: '3', label: __('Monthly', 'meetinghub') },
		{ value: '4', label: __('No Fixed Time', 'meetinghub') },
	];

	// set_month_order
	const monthOrder = [
		{ value: 1, label: __('First week of the month', 'meetinghub') },
		{ value: 2, label: __('Second week of the month', 'meetinghub') },
		{ value: 3, label: __('Third week of the month', 'meetinghub') },
		{ value: 4, label: __('Fourth week of the month', 'meetinghub') },
		{ value: -1, label: __('Last week of the month', 'meetinghub') },
	];

	// set_monthly_weekday
	const monthlyWeekdays = [
		{ value: 1, label: __('Sunday', 'meetinghub') },
		{ value: 2, label: __('Monday', 'meetinghub') },
		{ value: 3, label: __('Tuesday', 'meetinghub') },
		{ value: 4, label: __('Wednesday', 'meetinghub') },
		{ value: 5, label: __('Thursday', 'meetinghub') },
		{ value: 6, label: __('Friday', 'meetinghub') },
		{ value: 7, label: __('Saturday', 'meetinghub') },
	];

	// Repeat monthly
	const repeatMonthly = [
		{ value: '1', label: __('1', 'meetinghub') },
		{ value: '2', label: __('2', 'meetinghub') },
		{ value: '3', label: __('3', 'meetinghub') },
	];


	// Repeat Day
	const repeatDay = [];
	for (let i = 1; i <= 31; i++) {
		repeatDay.push({ value: String(i), label: String(i) });
	}

	// Number of Occurrences
	const numberOfOccurrences = [];
	for (let i = 1; i <= 20; i++) {
		numberOfOccurrences.push({ value: String(i), label: String(i) });
	}

	// End Type
	const endType = [
		{ value: 'date', label: __('By date', 'meetinghub') },
		{ value: 'occurrences', label: __('By occurrences', 'meetinghub') },
	];

	// Occurs Monthly
	const occursMonthly = [
		{ value: 'day', label: __('Day', 'meetinghub') },
		{ value: 'weekdays', label: __('Weekdays', 'meetinghub') },
	];

	// Repeat Weekly 
	const repeatWeekly = [];
	for (let i = 1; i <= 12; i++) {
		repeatWeekly.push({ value: String(i), label: String(i) });
	}

	const Timezones = TimezoneList();

	const handleStickySaveClick = () => {
		// Trigger form submission by calling submit() method on the form
		hiddenSubmitRef.current.click();
	};

	const handleCloseError = () => {
		setErrorMessage('');
	};

	return (
		<div>
			{errorMessage && (
				<div className="mhub_zoom_error error">
					<h3>{errorMessage}</h3>
					<span className="close-icon" onClick={handleCloseError}>✕</span>
				</div>
			)}
			<div className="mhub-zoom-meeting-form">

			{ ! mhubMeetingsData.hide_floating_create_btn  && (
				<div className='mhub-col-lg-12'>
					<div className="mhub-form-actions sticky-save-btn">
						<button type="button" className="save-meeting" disabled={isSaving} onClick={handleStickySaveClick}>
							{isSaving ? __('Creating...', 'meetinghub') : __('Create Meeting', 'meetinghub')}
						</button>
					</div>
				</div>
			) }

				<div className="form-wrapper">
					<form className="form" onSubmit={handleSubmit}>
						<div className="mhub-col-lg-12">
							<MhInput
								label={__('Meeting Name', 'meetinghub')}
								description={__('Please enter the meeting name', 'meetinghub')}
								type="text"
								value={formData.title}
								onChange={(name, value) => handleChange(name, value)}
								name="title"
								required="yes"
							/>
						</div>

						<div className="mhub-col-lg-12">
							<div className="mhub-form-group">
								<label>Meeting Description<small className="description">Provide the details for your meeting here</small></label>
								<div className="editor-wrapper">
									<Editor
										value={meetingDescription}
										onChange={handleMeetingDescription}
										containerProps={{ style: { resize: 'both' } }}
									/>
								</div>
							</div>
						</div>

						<div className="mhub-col-lg-12">
							<ImageUploader
								imageUrl={imageUrl}
								setImageUrl={setImageUrl}
								setImageID={setImageID}
								label={__('Meeting Thumbnail', 'meetinghub')}
								description={__('Upload an image to represent your meeting visually', 'meetinghub')}
							/>
						</div>

						<div className="mhub-col-lg-12">
							<MhTextArea
								label={__('Meeting agenda', 'meetinghub')}
								description={__('Write agenda for your meeting', 'meetinghub')}
								value={formData.agenda}
								onChange={(name, value) => handleChange(name, value)}
								name="agenda"
							/>
						</div>

						<div className="mhub-col-lg-12">
							<MhSelect
								label={__('Meeting host', 'meetinghub')}
								description={__('This is the meeting host id.', 'meetinghub')}
								options={zoomUsers()}
								value={formData.host_id}
								onChange={(name, value) => handleChange(name, value)}
								name="host_id"
							/>
						</div>

						<div className="mhub-col-lg-12">
							<MhSelect
								label={__('Meeting Type', 'meetinghub')}
								description={__('Which type of meeting do you want to create.', 'meetinghub')}
								options={meetingTypeOptions}
								value={formData.meeting_type}
								onChange={(name, value) => handleChange(name, value)}
								name="meeting_type"
							/>
						</div>

						<div className="mhub-col-lg-12">
							<div className="mhub-form-group">
								<label>
									{__('Start Date & Time', 'meetinghub')}
									<small className="description">{__('Starting date and time of the meeting', 'meetinghub')}</small>
								</label>

								<div className="input-wrapper">
									<Datetime
										value={formData.startDateTime}
										onChange={(date) => handleChange('startDateTime', date)}
										isValidDate={(current) => {
											// Allow today's date and future dates, but disable past dates
											return current.isAfter(moment().subtract(1, 'day'), 'day');
										}}
									/>
								</div>
							</div>
						</div>

						<div className="mhub-col-lg-12">
							<MhDurationSelect
								label={__('Duration', 'meetinghub')}
								description={__('Select meeting duration.', 'meetinghub')}
								hours={formData.duration_hours}
								minutes={formData.duration_minutes}
								onChangeHours={(value) => handleChange('duration_hours', value)}
								onChangeMinutes={(value) => handleChange('duration_minutes', value)}
							/>
						</div>

						<div className="mhub-col-lg-12">
							<MhSwitcher
								label={__('Recurring Meeting', 'meetinghub')}
								description={__('Enable recurring meeting.', 'meetinghub')}
								checked={formData.enable_recurring_meeting}
								onChange={(name, value) => handleChange(name, value)}
								name="enable_recurring_meeting"
								disabled={!isProActive()}
								isLocked={!isProActive()}
								isProActive={isProActive()}
							/>
						</div>

						{
							formData.enable_recurring_meeting && isProActive() && (
								<div className="mhub-col-lg-12">
									<MhSelect
										label={__('Recurrence', 'meetinghub')}
										description={__('Select recurrence option.', 'meetinghub')}
										options={recurrenceOptions}
										value={formData.recurrence_option}
										onChange={(name, value) => handleChange(name, value)}
										name="recurrence_option"
									/>
								</div>
							)
						}


						{
							formData.enable_recurring_meeting && 1 == formData.recurrence_option && isProActive() && (
								<div className="mhub-col-lg-12">
									<MhSelect
										label={__('Repeat Every', 'meetinghub')}
										description={__('Define the interval at which the meeting/webinar should recur.', 'meetinghub')}
										options={repeatDay}
										value={formData.repeat_day}
										onChange={(name, value) => handleChange(name, value)}
										name="repeat_day"
										SelectClass="zoom-recurrence-repeat"
										rightLabel="Day"
									/>
								</div>

							)
						}

						{
							formData.enable_recurring_meeting && 2 == formData.recurrence_option && isProActive() && (
								<div className="mhub-col-lg-12">
									<MhSelect
										label={__('Repeat Every', 'meetinghub')}
										description={__('Define the interval at which the meeting/webinar should recur.', 'meetinghub')}
										options={repeatWeekly}
										value={formData.repeat_weekly}
										onChange={(name, value) => handleChange(name, value)}
										name="repeat_weekly"
										SelectClass="zoom-recurrence-repeat"
										rightLabel="Week"
									/>
								</div>

							)
						}

						{
							formData.enable_recurring_meeting && 3 == formData.recurrence_option && isProActive() && (
								<div className="mhub-col-lg-12">
									<MhSelect
										label={__('Repeat Every', 'meetinghub')}
										description={__('Define the interval at which the meeting/webinar should recur.', 'meetinghub')}
										options={repeatMonthly}
										value={formData.repeat_monthly}
										onChange={(name, value) => handleChange(name, value)}
										name="repeat_monthly"
										SelectClass="zoom-recurrence-repeat"
										rightLabel="Month"
									/>
								</div>

							)
						}

						{
							formData.enable_recurring_meeting && 3 == formData.recurrence_option && isProActive() && (
								<div className="mhub-col-lg-12">
									<MhSelect
										label={__('Occurs On', 'meetinghub')}
										description={__('Select Occurs type.', 'meetinghub')}
										options={occursMonthly}
										value={formData.occurs_on_monthly}
										onChange={(name, value) => handleChange(name, value)}
										name="occurs_on_monthly"
									/>
								</div>
							)
						}

						{
							formData.enable_recurring_meeting && 3 == formData.recurrence_option && 'day' == formData.occurs_on_monthly && isProActive() && (
								<div className="mhub-col-lg-12">
									<MhSelect
										label={__('Day Of The Month', 'meetinghub')}
										description={__('Define the interval at which the meeting/webinar should recur.', 'meetinghub')}
										options={repeatDay}
										value={formData.day_of_the_month}
										onChange={(name, value) => handleChange(name, value)}
										name="day_of_the_month"
									/>
								</div>
							)
						}

						{
							formData.enable_recurring_meeting && 3 == formData.recurrence_option && 'weekdays' == formData.occurs_on_monthly && isProActive() && (
								<div className="mhub-col-lg-12">
									<MhSelect
										label={__('Set Order', 'meetinghub')}
										description={__('Set Order for the month.', 'meetinghub')}
										options={monthOrder}
										value={formData.set_month_order}
										onChange={(name, value) => handleChange(name, value)}
										name="set_month_order"
									/>
								</div>
							)
						}

						{
							formData.enable_recurring_meeting && 3 == formData.recurrence_option && 'weekdays' == formData.occurs_on_monthly && isProActive() && (
								<div className="mhub-col-lg-12">
									<MhSelect
										label={__('Set weekday', 'meetinghub')}
										description={__('Select weekday.', 'meetinghub')}
										options={monthlyWeekdays}
										value={formData.set_monthly_weekday}
										onChange={(name, value) => handleChange(name, value)}
										name="set_monthly_weekday"
									/>
								</div>
							)
						}

						{
							formData.enable_recurring_meeting && 2 == formData.recurrence_option && isProActive() && (
								<div className="mhub-col-lg-12">
									<MhCheckbox
										label={__('Occurs On', 'meetinghub')}
										description={__('Select weekdays.', 'meetinghub')}
										options={formData.weekdays}
										onChange={handleWeekdays}
									/>
								</div>

							)
						}


						{
							formData.enable_recurring_meeting && 4 != formData.recurrence_option && isProActive() && (
								<div className="mhub-col-lg-12">
									<MhSelect
										label={__('End Date', 'meetinghub')}
										description={__('Select end type.', 'meetinghub')}
										options={endType}
										value={formData.end_type}
										onChange={(name, value) => handleChange(name, value)}
										name="end_type"
									/>
								</div>

							)
						}

						{
							formData.enable_recurring_meeting && 'occurrences' == formData.end_type && 4 != formData.recurrence_option && isProActive() && (

								<div className="mhub-col-lg-12">
									<MhSelect
										label={__('Set Number Of Occurrences', 'meetinghub')}
										description={__('Select how many times the meeting/webinar should recur before it is canceled.', 'meetinghub')}
										options={numberOfOccurrences}
										value={formData.set_number_of_occurrences}
										onChange={(name, value) => handleChange(name, value)}
										name="set_number_of_occurrences"
									/>
								</div>

							)
						}

						{
							formData.enable_recurring_meeting && 'date' == formData.end_type && 4 != formData.recurrence_option && isProActive() && (
								<div className="mhub-col-lg-12">
									<div className="mhub-form-group">
										<label>
											{__('Set End Date', 'meetinghub')}
											<small className="description">{__('Select the final date on which meeting/webinar will recur before it is canceled.', 'meetinghub')}</small>
										</label>

										<div className="input-wrapper">
											<DatePicker
												selected={formData.end_date_time}
												onChange={(date) => handleChange('end_date_time', date)}
												dateFormat="MM/dd/yyyy"
												minDate={new Date()}
											/>
										</div>
									</div>
								</div>

							)
						}

						<div className="mhub-col-lg-12">
							<MhSelect
								label={__('Timezone', 'meetinghub')}
								description={__('Meeting Timezone.', 'meetinghub')}
								options={Timezones}
								value={formData.meeting_timezone}
								onChange={(name, value) => handleChange(name, value)}
								name="meeting_timezone"
							/>
						</div>

						<div className="mhub-col-lg-12">
							<MhSwitcher
								label={__('Should Register', 'meetinghub')}
								description={__('If user should be register to join the meeting', 'meetinghub')}
								checked={formData.enable_should_register}
								onChange={(name, value) => handleChange(name, value)}
								name="enable_should_register"
								disabled={!isProActive()}
								isLocked={!isProActive()}
								isProActive={isProActive()}
							/>
						</div>

						<div className="mhub-col-lg-12">
							<MhInput
								label={__('Password', 'meetinghub')}
								description={__('Set a password (max 10 characters, [a-zA-Z0-9])', 'meetinghub')}
								type="text"
								value={formData.password}
								onChange={(name, value) => handleChange(name, value)}
								name="password"
								required="no"
								maxLength={10}
							/>
						</div>

						<div className="mhub-col-lg-12">
							<MhSwitcher
								label={__('Disable Waiting Room', 'meetinghub')}
								description={__('Waiting Room is enabled by default - if you want users to skip the waiting room and join the meeting directly - enable this option.', 'meetinghub')}
								checked={formData.disable_waiting_room}
								onChange={(name, value) => handleChange(name, value)}
								name="disable_waiting_room"
							/>
						</div>

						<div className="mhub-col-lg-12">
							<MhSwitcher
								label={__('Meeting Authentication', 'meetinghub')}
								description={__('Only loggedin users in Zoom App can join this Meeting.', 'meetinghub')}
								checked={formData.meeting_authentication}
								onChange={(name, value) => handleChange(name, value)}
								name="meeting_authentication"
							/>
						</div>

						{
							2 == formData.meeting_type && (

								<div className="mhub-col-lg-12">
									<MhSwitcher
										label={__('Join Before Host', 'meetinghub')}
										description={__('Allow users to join meetin before host start/joins the meeting. Only for scheduled or recurring meetings. If the waiting room is enabled, this setting will not work.', 'meetinghub')}
										checked={formData.join_before_host}
										onChange={(name, value) => handleChange(name, value)}
										name="join_before_host"
									/>
								</div>

							)
						}

						<div className="mhub-col-lg-12">
							<MhSwitcher
								label={__('Start When Host Joins', 'meetinghub')}
								description={__('Start video when host join meeting.', 'meetinghub')}
								checked={formData.option_host_video}
								onChange={(name, value) => handleChange(name, value)}
								name="option_host_video"
							/>
						</div>

						{
							2 == formData.meeting_type && (
								<div className="mhub-col-lg-12">
									<MhSwitcher
										label={__('Participants Video', 'meetinghub')}
										description={__('Start video when participants join meeting.', 'meetinghub')}
										checked={formData.option_participants_video}
										onChange={(name, value) => handleChange(name, value)}
										name="option_participants_video"
									/>
								</div>
							)
						}

						{
							2 == formData.meeting_type && (
								<div className="mhub-col-lg-12">
									<MhSwitcher
										label={__('Mute Participants upon entry', 'meetinghub')}
										description={__('Mutes Participants when entering the meeting.', 'meetinghub')}
										checked={formData.option_mute_participants}
										onChange={(name, value) => handleChange(name, value)}
										name="option_mute_participants"
									/>
								</div>
							)
						}

						{
							1 == formData.meeting_type && (
								<div className="mhub-col-lg-12">
									<MhSwitcher
										label={__('When Panelists Join', 'meetinghub')}
										description={__('Start video when panelists join webinar.', 'meetinghub')}
										checked={formData.panelists_video}
										onChange={(name, value) => handleChange(name, value)}
										name="panelists_video"
									/>
								</div>
							)
						}

						{
							1 == formData.meeting_type && (
								<div className="mhub-col-lg-12">
									<MhSwitcher
										label={__('Practise Session', 'meetinghub')}
										description={__('Enable Practise Session.', 'meetinghub')}
										checked={formData.practice_session}
										onChange={(name, value) => handleChange(name, value)}
										name="practice_session"
									/>
								</div>
							)
						}

						{
							1 == formData.meeting_type && (
								<div className="mhub-col-lg-12">
									<MhSwitcher
										label={__('HD Video', 'meetinghub')}
										description={__('Defaults to HD video.', 'meetinghub')}
										checked={formData.hd_video}
										onChange={(name, value) => handleChange(name, value)}
										name="hd_video"
									/>
								</div>
							)
						}

						{
							1 == formData.meeting_type && (
								<div className="mhub-col-lg-12">
									<MhSwitcher
										label={__('Allow Multiple Devices', 'meetinghub')}
										description={__('Allow attendess to join from multiple devices.', 'meetinghub')}
										checked={formData.allow_multiple_devices}
										onChange={(name, value) => handleChange(name, value)}
										name="allow_multiple_devices"
									/>
								</div>
							)
						}

						<div className="mhub-col-lg-12">
							<MhSelect
								label={__('Auto Recording', 'meetinghub')}
								description={__('Set what type of auto recording feature you want to add. Default is none.', 'meetinghub')}
								options={autoRecording}
								value={formData.auto_recording}
								onChange={(name, value) => handleChange(name, value)}
								name="auto_recording"
							/>
						</div>

						<div className="mhub-col-lg-12">
							<div className="mhub-form-group">
								<label>
									{__('Alternative Host', 'meetinghub')}
									<small className="description">{__('Backup hosts for meeting/webinar', 'meetinghub')}</small>
								</label>

								<div className="input-wrapper">
									<Select
										options={zoomUsers()}
										onChange={(selectedOption) => handleChange('alternative_host', selectedOption)}
										isMulti
										className="mhub-select2"
										placeholder={__('Select alternative hosts..', 'meetinghub')}
										styles={select2Styles()}
									/>
								</div>
							</div>
						</div>

						<div className="mhub-col-lg-12">
							<MhSwitcher
								label={__('Hide Sidebar', 'meetinghub')}
								description={__('Hide meeting page right sidebar', 'meetinghub')}
								name="hide_sidebar"
								checked={formData.hide_sidebar}
								onChange={(name, value) => handleChange(name, value)}
							/>
						</div>

						<div className="mhub-col-lg-12">
							<MhSwitcher
								label={__('Hide Header & Footer', 'meetinghub')}
								description={__('Hide header & footer on meeting page', 'meetinghub')}
								name="hide_header_footer"
								checked={formData.hide_header_footer}
								onChange={(name, value) => handleChange(name, value)}
							/>
						</div>

						<button type="submit" style={{ display: 'none' }} ref={hiddenSubmitRef} />

						<div className="mhub-form-actions">
							<button type="submit" className="save-meeting" disabled={isSaving}>
								{isSaving ? __('Creating...', 'meetinghub') : __('Create Meeting', 'meetinghub')}
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
};

export default ZoomForm;
