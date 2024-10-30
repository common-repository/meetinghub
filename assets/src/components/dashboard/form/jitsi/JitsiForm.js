import React, { useState, useRef } from 'react';
import Datetime from 'react-datetime';
import 'react-datetime/css/react-datetime.css';
import { useNavigate } from "react-router-dom";
import MhSwitcher from '../../../common//fields/MhSwitcher';
import MhInput from '../../../common/fields/MhInput';
import { getRandomDomain } from '../../RandomDomainGenerator';
import { generateRandomRoom } from '../../RandomRoomGenerator';
import MhSelect from '../../../common/fields/MhSelect';
import TimezoneList from '../../../common/fields/TimezoneList';
import Editor from 'react-simple-wysiwyg';
import { isProActive } from '../../../../Helpers';
import moment from 'moment';
import TimePicker from 'react-time-picker';
import { toast } from 'react-toastify';
const { __ } = wp.i18n;
import ImageUploader from '../../../common/ImageUploader';


const meetingVideoResolution = [
	{ value: "480", label: __('480p', 'meetinghub') },
	{ value: "720", label: __('720p', 'meetinghub') },
	{ value: "1080", label: __('1080p', 'meetinghub') },
	{ value: "1440", label: __('1440p', 'meetinghub') },
	{ value: "2160", label: __('2160p', 'meetinghub') },
	{ value: "4320", label: __('4320p', 'meetinghub') },
];

//Recurrence Options
const recurrenceOptions = [
	{ value: 'daily', label: __('Daily', 'meetinghub') },
	{ value: 'weekly', label: __('Weekly', 'meetinghub') },
	{ value: 'monthly', label: __('Monthly', 'meetinghub') },
	{ value: 'yearly', label: __('Yearly', 'meetinghub') },
];

// Set Monthly Weekday
const Weekdays = [
	{ value: 'sunday', label: __('Sunday', 'meetinghub') },
	{ value: 'monday', label: __('Monday', 'meetinghub') },
	{ value: 'tuesday', label: __('Tuesday', 'meetinghub') },
	{ value: 'wednesday', label: __('Wednesday', 'meetinghub') },
	{ value: 'thursday', label: __('Thursday', 'meetinghub') },
	{ value: 'friday', label: __('Friday', 'meetinghub') },
	{ value: 'saturday', label: __('Saturday', 'meetinghub') },
];

// Set Yearly Months
const yearlyMonths = [
	{ value: 1, label: __('January', 'meetinghub') },
	{ value: 2, label: __('February', 'meetinghub') },
	{ value: 3, label: __('March', 'meetinghub') },
	{ value: 4, label: __('April', 'meetinghub') },
	{ value: 5, label: __('May', 'meetinghub') },
	{ value: 6, label: __('June', 'meetinghub') },
	{ value: 7, label: __('July', 'meetinghub') },
	{ value: 8, label: __('August', 'meetinghub') },
	{ value: 9, label: __('September', 'meetinghub') },
	{ value: 10, label: __('October', 'meetinghub') },
	{ value: 11, label: __('November', 'meetinghub') },
	{ value: 12, label: __('December', 'meetinghub') },
];

//Timezone
const Timezones = TimezoneList();

//Repeat Day
const repeatDay = [];
for (let i = 1; i <= 31; i++) {
	repeatDay.push({ value: String(i), label: i });
}

const JitsiForm = ({ selectedPlatform }) => {
	const navigate = useNavigate();
	const formRef = useRef(null);
	const hiddenSubmitRef = useRef(null);
	const [imageUrl, setImageUrl] = useState('');
	const [imageId, setImageID] = useState('');

	const [meetingDescription, setMeetingDescription] = useState('');

	function handleMeetingDescription(e) {
		setMeetingDescription(e.target.value);
	}

	const handleBack = () => {
		navigate('/');
	};

	var mhub_jitsi_settings = mhubMeetingsData.mhub_jitsi_settings;

	const [formData, setFormData] = useState({
		title: generateRandomRoom(10),
		height: 720,
		width: 1080,
		startDateTime: new Date(),
		start_with_audio_muted: mhub_jitsi_settings ? mhub_jitsi_settings.yourself_muted : false,
		start_with_video_muted: mhub_jitsi_settings ? mhub_jitsi_settings.start_with_video_muted : true,
		start_with_screen_sharing: mhub_jitsi_settings ? mhub_jitsi_settings.start_with_screen_sharing : false,
		enable_inviting: mhub_jitsi_settings ? mhub_jitsi_settings.enable_inviting : true,
		audio_muted: mhub_jitsi_settings ? mhub_jitsi_settings.audio_muted : "",
		audio_only: mhub_jitsi_settings ? mhub_jitsi_settings.audio_only : false,
		start_silent: mhub_jitsi_settings ? mhub_jitsi_settings.start_silent : false,
		video_resolution: mhub_jitsi_settings ? mhub_jitsi_settings.video_resolution : "",
		max_full_resolution: mhub_jitsi_settings ? mhub_jitsi_settings.max_full_resolution : "",
		video_muted_after: mhub_jitsi_settings ? mhub_jitsi_settings.video_muted_after : "",
		enable_recording: mhub_jitsi_settings ? mhub_jitsi_settings.enable_recording : false,
		enable_simulcast: mhub_jitsi_settings ? mhub_jitsi_settings.enable_simulcast : false,
		enable_livestreaming: mhub_jitsi_settings ? mhub_jitsi_settings.enable_livestreaming : false,
		enable_welcome_page: mhub_jitsi_settings ? mhub_jitsi_settings.enable_welcome_page : false,
		enable_transcription: mhub_jitsi_settings ? mhub_jitsi_settings.enable_transcription : false,
		enable_outbound: mhub_jitsi_settings ? mhub_jitsi_settings.enable_outbound : false,
		enable_recurring_meeting: mhub_jitsi_settings ? mhub_jitsi_settings.enable_recurring_meeting : false,
		recurrence_option: 'daily',
		recurrence_time: '17:00',
		set_weekday: 'sunday',
		repeat_day: 1,
		set_yearly_month: 1,
		meeting_timezone: mhub_jitsi_settings ? mhub_jitsi_settings.meeting_timezone : mhubMeetingsData.mhub_timezone,
		enable_should_register: mhub_jitsi_settings ? mhub_jitsi_settings.enable_should_register : false,
		password: mhubMeetingsData.mhub_password,
		hide_sidebar: mhub_jitsi_settings ? mhub_jitsi_settings.hide_sidebar : false,
		hide_header_footer: mhub_jitsi_settings ? mhub_jitsi_settings.hide_header_footer : false,
	});

	const [isSaving, setIsSaving] = useState(false);

	const handleChange = (name, value) => {
		setFormData({ ...formData, [name]: value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		// Disable the button
		setIsSaving(true);

		try {
			// Make an API request using wp.apiFetch
			const response = await wp.apiFetch({
				path: 'mhub/v1/meetings',
				method: 'POST',
				data: {
					title: formData.title,
					height: formData.height,
					width: formData.width,
					startDateTime: formData.startDateTime.toISOString(),
					selected_platform: selectedPlatform,
					domain: getRandomDomain(),
					room_name: formData.title,
					start_with_audio_muted: formData.start_with_audio_muted,
					start_with_video_muted: formData.start_with_video_muted,
					start_with_screen_sharing: formData.start_with_screen_sharing,
					enable_inviting: formData.enable_inviting,
					audio_muted: formData.audio_muted,
					audio_only: formData.audio_only,
					start_silent: formData.start_silent,
					video_resolution: formData.video_resolution,
					max_full_resolution: formData.max_full_resolution,
					video_muted_after: formData.video_muted_after,
					enable_recording: formData.enable_recording,
					enable_simulcast: formData.enable_simulcast,
					enable_livestreaming: formData.enable_livestreaming,
					enable_welcome_page: formData.enable_welcome_page,
					enable_transcription: formData.enable_transcription,
					enable_outbound: formData.enable_outbound,
					enable_recurring_meeting: formData.enable_recurring_meeting,
					recurrence_option: formData.recurrence_option,
					recurrence_time: formData.recurrence_time,
					set_weekday: formData.set_weekday,
					repeat_day: formData.repeat_day,
					set_yearly_month: formData.set_yearly_month,
					meeting_timezone: formData.meeting_timezone,
					enable_should_register: formData.enable_should_register,
					password: formData.password,
					hide_sidebar: formData.hide_sidebar,
					hide_header_footer: formData.hide_header_footer,
					meeting_description: JSON.stringify({ content: meetingDescription }),
					image_url: imageUrl,
					image_id: imageId,
				},

			});

			// Redirect to the home URL after successful submission
			if (response && response.meeting_inserted) {
				toast.success(__('Meeting Created Successfully.', 'meetinghub'));
				navigate('/');

			} else {
				toast.error(__('Failed to Create Meeting !', 'meetinghub'));
			}

		} catch (error) {
			// Handle errors
			console.error('API Error:', error);
		} finally {
			// Enable the button after API request is complete (success or error)
			setIsSaving(false);
		}
	};

	const handleStickySaveClick = () => {
		// Trigger form submission by calling submit() method on the form
		hiddenSubmitRef.current.click();
	};


	return (
		<div className="mhub-jitsi-meeting-form">
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
				<form className="form" onSubmit={handleSubmit} ref={formRef}>
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
						<MhSwitcher
							label={__('Recurring Meeting', 'meetinghub')}
							description={__('Enable recurring meeting', 'meetinghub')}
							checked={formData.enable_recurring_meeting}
							onChange={(name, value) => handleChange(name, value)}
							name="enable_recurring_meeting"
							disabled={!isProActive()}
							isLocked={!isProActive()}
						/>
					</div>


					{
						formData.enable_recurring_meeting && isProActive() && (
							<div className="mhub-col-lg-12">
								<MhSelect
									label={__('Recurrence', 'meetinghub')}
									description={__('Select recurrence option', 'meetinghub')}
									options={recurrenceOptions}
									value={formData.recurrence_option}
									onChange={(name, value) => handleChange(name, value)}
									name="recurrence_option"
								/>
							</div>
						)
					}

					{
						formData.enable_recurring_meeting && 'weekly' == formData.recurrence_option && isProActive() && (
							<div className="mhub-col-lg-12">
								<MhSelect
									label={__('Set weekday', 'meetinghub')}
									description={__('Select which day on the week', 'meetinghub')}
									options={Weekdays}
									value={formData.set_weekday}
									onChange={(name, value) => handleChange(name, value)}
									name="set_weekday"
								/>
							</div>
						)
					}

					{
						formData.enable_recurring_meeting && 'yearly' == formData.recurrence_option && isProActive() && (
							<div className="mhub-col-lg-12">
								<MhSelect
									label={__('Repeat Month', 'meetinghub')}
									description={__('Define the month at which the meeting should recur', 'meetinghub')}
									options={yearlyMonths}
									value={formData.set_yearly_month}
									onChange={(name, value) => handleChange(name, value)}
									name="set_yearly_month"
								/>
							</div>

						)
					}

					{
						formData.enable_recurring_meeting &&
						(['monthly', 'yearly'].includes(formData.recurrence_option)) && isProActive() && (
							<div className="mhub-col-lg-12">
								<MhSelect
									label={__('Repeat Every', 'meetinghub')}
									description={__('Define the day at which the meeting should recur', 'meetinghub')}
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
						formData.enable_recurring_meeting && isProActive() && (

							<div className="mhub-col-lg-12">
								<div className="mhub-form-group">
									<label>
										{__('Recurrence time', 'meetinghub')}
										<small className="description">{__('Time when the meeting will start', 'meetinghub')}</small>
									</label>

									<div className="input-wrapper">
										<TimePicker
											onChange={(time) => handleChange('recurrence_time', time)}
											value={formData.recurrence_time}
											disableClock={true}
										/>
									</div>
								</div>
							</div>

						)
					}

					{
						!formData.enable_recurring_meeting && (
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

						)
					}

					<div className="mhub-col-lg-12">
						<MhSwitcher
							label={__('Should Register', 'meetinghub')}
							description={__('If user should be register to join the meeting', 'meetinghub')}
							checked={formData.enable_should_register}
							onChange={(name, value) => handleChange(name, value)}
							name="enable_should_register"
							disabled={!isProActive()}
							isLocked={!isProActive()}
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
							disabled={!isProActive()}
							isLocked={!isProActive()}
						/>
					</div>

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
						<MhInput
							label={__('Height', 'meetinghub')}
							description={__('Meeting height in pixels', 'meetinghub')}
							type="number"
							value={formData.height}
							onChange={(name, value) => handleChange(name, value)}
							name="height"
							required="no"
						/>
					</div>

					<div className="mhub-col-lg-12">
						<MhInput
							label={__('Width', 'meetinghub')}
							description={__('Meeting width in pixels', 'meetinghub')}
							type="number"
							value={formData.width}
							onChange={(name, value) => handleChange(name, value)}
							name="width"
							required="no"
						/>
					</div>

					<div className="mhub-col-lg-12">
						<MhSwitcher
							label={__('Yourself Muted', 'meetinghub')}
							description={__('Start with audio muted', 'meetinghub')}
							checked={formData.start_with_audio_muted}
							onChange={(name, value) => handleChange(name, value)}
							name="start_with_audio_muted"
						/>
					</div>

					<div className="mhub-col-lg-12">
						<MhSwitcher
							label={__('Start Video Muted', 'meetinghub')}
							description={__('Start with video muted', 'meetinghub')}
							checked={formData.start_with_video_muted}
							onChange={(name, value) => handleChange(name, value)}
							name="start_with_video_muted"
						/>
					</div>

					<div className="mhub-col-lg-12">
						<MhSwitcher
							label={__('Screen Sharing', 'meetinghub')}
							description={__("By enabling this feature, you're able to share your screen while attending a meeting", 'meetinghub')}
							checked={formData.start_with_screen_sharing}
							onChange={(name, value) => handleChange(name, value)}
							name="start_with_screen_sharing"
						/>
					</div>

					<div className="mhub-col-lg-12">
						<MhSwitcher
							label={__('Enable Inviting', 'meetinghub')}
							description={__('Attendee can invite people', 'meetinghub')}
							checked={formData.enable_inviting}
							onChange={(name, value) => handleChange(name, value)}
							name="enable_inviting"
						/>
					</div>

					<div className="mhub-col-lg-12">
						<MhSwitcher
							label={__('Audio Only', 'meetinghub')}
							description={__('Start conference on audio only', 'meetinghub')}
							name="audio_only"
							checked={formData.audio_only}
							onChange={(name, value) => handleChange(name, value)}
							disabled={!isProActive()}
							isLocked={!isProActive()}
						/>
					</div>

					<div className="mhub-col-lg-12">
						<MhSwitcher
							label={__('Start Silent', 'meetinghub')}
							description={__('Disable local audio output', 'meetinghub')}
							name="start_silent"
							checked={formData.start_silent}
							onChange={(name, value) => handleChange(name, value)}
							disabled={!isProActive()}
							isLocked={!isProActive()}
						/>
					</div>

					<div className="mhub-col-lg-12">
						<MhSelect
							label={__('Video Resolution', 'meetinghub')}
							description={__('Start with preferred resolution.', 'meetinghub')}
							options={meetingVideoResolution}
							value={formData.video_resolution}
							onChange={(name, value) => handleChange(name, value)}
							name="video_resolution"
							disabled={!isProActive()}
							isLocked={!isProActive()}
						/>
					</div>

					<div className="mhub-col-lg-12">
						<MhInput
							label={__('Max Full Resolution', 'meetinghub')}
							description={__('Number of participants with default resolution', 'meetinghub')}
							type="number"
							value={formData.max_full_resolution}
							onChange={(name, value) => handleChange(name, value)}
							name="max_full_resolution"
							required="no"
							disabled={!isProActive()}
							isLocked={!isProActive()}
						/>
					</div>

					<div className="mhub-col-lg-12">
						<MhInput
							label={__('Video Muted After', 'meetinghub')}
							description={__('Every participant after nth will start video muted', 'meetinghub')}
							type="number"
							value={formData.video_muted_after}
							onChange={(name, value) => handleChange(name, value)}
							name="video_muted_after"
							required="no"
							disabled={!isProActive()}
							isLocked={!isProActive()}
						/>
					</div>

					<div className="mhub-col-lg-12">
						<MhInput
							label={__('Start Audio Muted', 'meetinghub')}
							description={__('Participant after nth will be muted', 'meetinghub')}
							type="number"
							value={formData.audio_muted}
							onChange={(name, value) => handleChange(name, value)}
							name="audio_muted"
							required="no"
							disabled={!isProActive()}
							isLocked={!isProActive()}
						/>
					</div>

					<div className="mhub-col-lg-12">
						<MhSwitcher
							label={__('Enable Recording', 'meetinghub')}
							description={__('Turn on to record the meeting', 'meetinghub')}
							name="enable_recording"
							checked={formData.enable_recording}
							onChange={(name, value) => handleChange(name, value)}
							disabled={!isProActive()}
							isLocked={!isProActive()}
						/>
					</div>

					<div className="mhub-col-lg-12">
						<MhSwitcher
							label={__('Simulcast', 'meetinghub')}
							description={__('Enable/Disable simulcast', 'meetinghub')}
							name="enable_simulcast"
							checked={formData.enable_simulcast}
							onChange={(name, value) => handleChange(name, value)}
							disabled={!isProActive()}
							isLocked={!isProActive()}
						/>
					</div>

					<div className="mhub-col-lg-12">
						<MhSwitcher
							label={__('Enable Livestream', 'meetinghub')}
							description={__('Turn on livestreaming', 'meetinghub')}
							name="enable_livestreaming"
							checked={formData.enable_livestreaming}
							onChange={(name, value) => handleChange(name, value)}
							disabled={!isProActive()}
							isLocked={!isProActive()}
						/>
					</div>

					<div className="mhub-col-lg-12">
						<MhSwitcher
							label={__('Welcome Page', 'meetinghub')}
							description={__('Enable/Disable welcome page', 'meetinghub')}
							name="enable_welcome_page"
							checked={formData.enable_welcome_page}
							onChange={(name, value) => handleChange(name, value)}
							disabled={!isProActive()}
							isLocked={!isProActive()}
						/>
					</div>

					<div className="mhub-col-lg-12">
						<MhSwitcher
							label={__('Enable Transcription', 'meetinghub')}
							description={__('Transcript the meeting', 'meetinghub')}
							name="enable_transcription"
							checked={formData.enable_transcription}
							onChange={(name, value) => handleChange(name, value)}
							disabled={!isProActive()}
							isLocked={!isProActive()}
						/>
					</div>

					<div className="mhub-col-lg-12">
						<MhSwitcher
							label={__('Enable Outbound', 'meetinghub')}
							description={__('Allow outbound on the meeting', 'meetinghub')}
							name="enable_outbound"
							checked={formData.enable_outbound}
							onChange={(name, value) => handleChange(name, value)}
							disabled={!isProActive()}
							isLocked={!isProActive()}
						/>
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
	);
};

export default JitsiForm;
