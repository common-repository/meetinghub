import React, { useEffect, useState, useRef } from 'react';
import Datetime from 'react-datetime';
import 'react-datetime/css/react-datetime.css';
import { useNavigate } from 'react-router-dom';
import Spinner from '../../../common/Spinner';
import MhInput from '../../../common/fields/MhInput';
import MhSelect from '../../../common/fields/MhSelect';
import MhSwitcher from '../../../common/fields/MhSwitcher';
import TimezoneList from '../../../common/fields/TimezoneList';
import MhDurationSelect from '../../../common/fields/MhDurationSelect';
import MhTextArea from '../../../common/fields/MhTextArea';
import Editor from 'react-simple-wysiwyg';
import { isProActive } from '../../../../Helpers';
import { toast } from 'react-toastify';
const { __ } = wp.i18n;
import ImageUploader from '../../../common/ImageUploader';

const WebexEditForm = ({ meetingId, meetingDetails }) => {
	const navigate = useNavigate();
	const [formData, setFormData] = useState({});
	const [errorMessage, setErrorMessage] = useState('');
	const [loading, setLoading] = useState(true);
	const [isSaving, setIsSaving] = useState(false);
	const hiddenSubmitRef = useRef(null);
	const [imageUrl, setImageUrl] = useState('');
	const [imageId, setImageID] = useState('');

	const [meetingDescription, setMeetingDescription] = useState('');

	function handleMeetingDescription(e) {
		setMeetingDescription(e.target.value);
	}

	//Lock data
	const lockOptions = [
		{ value: '0', label: __('0', 'meetinghub') },
		{ value: '5', label: __('5', 'meetinghub') },
		{ value: '10', label: __('10', 'meetinghub') },
		{ value: '15', label: __('15', 'meetinghub') },
		{ value: '20', label: __('20', 'meetinghub') },
	];

	const formatDate = (dateString) => {
		return dateString ? new Date(dateString) : null;
	};

	useEffect(() => {
		if (meetingDetails) {
			setFormData({
				title: meetingDetails.title,
				selected_platform: meetingDetails.settings.selected_platform,
				startDateTime: formatDate(meetingDetails.settings.startDateTime),
				join_before_host: meetingDetails.settings.join_before_host,
				meeting_timezone: meetingDetails.settings.meeting_timezone,
				password: meetingDetails.settings.password,
				duration_hours: meetingDetails.settings.duration_hours,
				duration_minutes: meetingDetails.settings.duration_minutes,
				hide_sidebar: meetingDetails.settings.hide_sidebar,
				hide_header_footer: meetingDetails.settings.hide_header_footer,
				agenda: meetingDetails.settings.agenda,
				auto_record: meetingDetails.settings.auto_record,
				breakout_sessions: meetingDetails.settings.breakout_sessions,
				automatic_lock: meetingDetails.settings.automatic_lock,
				lock_minutes: meetingDetails.settings.lock_minutes,
				enable_should_register: meetingDetails.settings.enable_should_register,
				enable_recurring_meeting: meetingDetails.settings.enable_recurring_meeting,

			});

			setMeetingDescription(meetingDetails.meeting_description);
			setImageUrl(meetingDetails.settings.image_url);
			setImageID(meetingDetails.settings.image_id);
			setLoading(false);
		}
	}, [meetingDetails]);

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
				path: `mhub/v1/meetings/${meetingId}`,
				method: 'PUT',
				data: {
					id: meetingId,
					title: formData.title,
					selected_platform: formData.selected_platform,
					startDateTime: formData.startDateTime.toISOString(),
					join_before_host: formData.join_before_host,
					meeting_timezone: formData.meeting_timezone,
					duration_hours: formData.duration_hours,
					duration_minutes: formData.duration_minutes,
					hide_sidebar: formData.hide_sidebar,
					hide_header_footer: formData.hide_header_footer,
					password: formData.password,
					agenda: formData.agenda,
					auto_record: formData.auto_record,
					breakout_sessions: formData.breakout_sessions,
					automatic_lock: formData.automatic_lock,
					lock_minutes: formData.lock_minutes,
					enable_should_register: formData.enable_should_register,
					enable_recurring_meeting: formData.enable_recurring_meeting,
					meeting_description: JSON.stringify({ content: meetingDescription }),
					image_url: imageUrl,
					image_id: imageId,
				},
			});

			if (response.hasOwnProperty("id")) {
				toast.success(__('Meeting Updated Successfully.', 'meetinghub'));
				setErrorMessage('');
				navigate('/');
			}

			if (response && (response.errors || response.message)) {
				toast.error(__('Failed to Update Meeting !', 'meetinghub'));
				setErrorMessage(response.errors[0].description);
			}

			if (!response) {
				toast.error(__('Failed to Update Meeting !', 'meetinghub'));
				setErrorMessage(__('Check your Webex settings and ensure your OAuth credentials are set up properly.', 'meetinghub'));
			}

		} catch (error) {
			// Handle errors
			console.error('API Error:', error);
		} finally {
			// Enable the button after API request is complete (success or error)
			setIsSaving(false);
		}
	};

	const Timezones = TimezoneList();

	if (loading) {
		return <Spinner />;
	}

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
				{ ! mhubMeetingsData.hide_floating_update_btn  && (
					<div className='mhub-col-lg-12'>
						<div className="mhub-form-actions sticky-save-btn">
							<button type="button" className="save-meeting" disabled={isSaving} onClick={handleStickySaveClick}>
								{isSaving ? __('Updating...', 'meetinghub') : __('Update Meeting', 'meetinghub')}
							</button>
						</div>
					</div>
				)}

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
								disabled={true}
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
								label={__('Join Before Host', 'meetinghub')}
								description={__('Whether or not to allow any attendee to join the meeting before the host joins the meeting', 'meetinghub')}
								checked={formData.join_before_host}
								onChange={(name, value) => handleChange(name, value)}
								name="join_before_host"
							/>
						</div>

						<div className="mhub-col-lg-12">
							<MhSwitcher
								label={__('Auto Record Meeting', 'meetinghub')}
								description={__('Whether or not meeting is recorded automatically', 'meetinghub')}
								checked={formData.auto_record}
								onChange={(name, value) => handleChange(name, value)}
								name="auto_record"
							/>
						</div>

						<div className="mhub-col-lg-12">
							<MhSwitcher
								label={__('Enable Breakout sessions', 'meetinghub')}
								description={__('Whether or not breakout sessions is enabled', 'meetinghub')}
								checked={formData.breakout_sessions}
								onChange={(name, value) => handleChange(name, value)}
								name="breakout_sessions"
							/>
						</div>

						<div className="mhub-col-lg-12">
							<MhSwitcher
								label={__('Enable Automatic Lock', 'meetinghub')}
								description={__('Whether or not automatically lock is enabled', 'meetinghub')}
								checked={formData.automatic_lock}
								onChange={(name, value) => handleChange(name, value)}
								name="automatic_lock"
							/>
						</div>

						{formData.automatic_lock && (
							<div className="mhub-col-lg-12">
								<MhSelect
									label={__('Meetings Lock After', 'meetinghub')}
									description={__('Automatically lock my meeting after the meeting starts', 'meetinghub')}
									options={lockOptions}
									value={formData.lock_minutes}
									onChange={(name, value) => handleChange(name, value)}
									name="lock_minutes"
								/>
							</div>
						)}

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
								{isSaving ? __('Updating...', 'meetinghub') : __('Update Meeting', 'meetinghub')}
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
};

export default WebexEditForm;
