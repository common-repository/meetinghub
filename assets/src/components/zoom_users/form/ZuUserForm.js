import React, { useState, useRef } from 'react';
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import MhInput from '../../common/fields/MhInput';
import MhSelect from '../../common/fields/MhSelect';
const { __ } = wp.i18n;

const zoomUserType = [
	{ value: 1, label: __('Basic User', 'meetinghub') },
	{ value: 2, label: __('Pro User', 'meetinghub') },
  ];
  

  const zoomActionType = [
	{ value: 'create', label: __('Create', 'meetinghub') },
	{ value: 'autoCreate', label: __('Auto Create', 'meetinghub') },
	{ value: 'custCreate', label: __('Cust Create', 'meetinghub') },
	{ value: 'ssoCreate', label: __('SSO Create', 'meetinghub') },
  ];
  
const ZuUserForm = () => {
	const [isSaving, setIsSaving] = useState(false);
	const [errorMessage, setErrorMessage] = useState('');
	const navigate = useNavigate();

	const handleBack = () => {
		navigate('/');
	};


	const [formData, setFormData] = useState({
		email: '',
		first_name: '',
		last_name: '',
		type: 1,
		zoom_user_action: 'create',
	});


	const handleChange = (name, value) => {
		setFormData({ ...formData, [name]: value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		// Disable the button
		setIsSaving(true);

		try {
			//Make an API request using wp.apiFetch
			const response = await wp.apiFetch({
				path: 'meetinghub/v2/zoom/users',
				method: 'POST',
				data: {
					email: formData.email,
					first_name: formData.first_name,
					last_name: formData.last_name,
					type: formData.type,
					zoom_user_action: formData.zoom_user_action,
				},
			});


			if (response && (response.code || response.message)) {
				toast.error(__('Failed to Create User !', 'meetinghub'));
				if (response.code === 201) {
					// Reset error message
					setErrorMessage('');
					navigate('/');
				} else if (response.message && response.message !== 'No privilege.') {
					// Error message from response
					setErrorMessage(response.message);
				} else {
					// Other error
					setErrorMessage('Error');
				}

				if (response.message === 'No privilege.') {
					// No privilege error
					setErrorMessage(__("You don't have permission to add a new user", 'meetinghub'));
				}
			} else {
				toast.success(__('User Created Successfully.', 'meetinghub'));
				navigate('/');
			}

		} catch (error) {
			// Handle errors
			console.error('API Error:', error);
		} finally {
			// Enable the button after API request is complete (success or error)
			setIsSaving(false);
		}
	};

	const handleCloseError = () => {
        setErrorMessage('');
    };

	return (
		<div className="meeting-wrapper">
			<button className='back-btn' onClick={handleBack}><span className="dashicons dashicons-arrow-left-alt"></span>{__('Back', 'meetinghub')}</button>
			<h2 className='title'>{__('Add User', 'meetinghub')}</h2>
			<p className='mhub-zoom-user-dec'>
			{__('What does this do? Check out', 'meetinghub')} {' '}
			<a href="https://support.zoom.us/hc/en-us/articles/201363183-Managing-users" target="_blank" rel="noreferrer noopener">
				{__('Zoom website', 'meetinghub')}
			</a>. {' '}
			{__('Please note this requires a PRO Zoom account or Higher.', 'meetinghub')}
			</p>


			{errorMessage && (
				<div className="mhub_zoom_error error">
					<h3>{errorMessage}</h3>
					<span className="close-icon" onClick={handleCloseError}>✕</span>
				</div>
            )}

			<div className="zoom-user-form">
				<div className="form-wrapper">
					<form className="form" onSubmit={handleSubmit} >

						<div className="mhub-col-lg-12">
							<MhSelect
								label={__('Action', 'meetinghub')}
								description={__('Type of Action', 'meetinghub')}
								options={zoomActionType}
								value={formData.zoom_user_action}
								onChange={(name, value) => handleChange(name, value)}
								name="zoom_user_action"
							/>
						</div>

						<div className="mhub-col-lg-12">
							<MhInput
								label={__('Email Address', 'meetinghub')}
								description={__('This address is used for zoom', 'meetinghub')}
								type="email"
								value={formData.email}
								onChange={(name, value) => handleChange(name, value)}
								name="email"
								required="yes"
							/>
						</div>

						<div className="mhub-col-lg-12">
							<MhInput
								label={__('First Name', 'meetinghub')}
								description={__('First Name of the User', 'meetinghub')}
								type="text"
								value={formData.first_name}
								onChange={(name, value) => handleChange(name, value)}
								name="first_name"
								required="yes"
							/>
						</div>

						<div className="mhub-col-lg-12">
							<MhInput
								label={__('Last Name', 'meetinghub')}
								description={__('Last Name of the User', 'meetinghub')}
								type="text"
								value={formData.last_name}
								onChange={(name, value) => handleChange(name, value)}
								name="last_name"
								required="yes"
							/>
						</div>

						<div className="mhub-col-lg-12">
							<MhSelect
								label={__('User Type', 'meetinghub')}
								description={__('Type of User', 'meetinghub')}
								options={zoomUserType}
								value={formData.type}
								onChange={(name, value) => handleChange(name, value)}
								name="type"
							/>
						</div>

						<div className="mhub-form-actions">
							<button type="submit" className="save-meeting" disabled={isSaving}>
								{__('Create User', 'meetinghub')}
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
};

export default ZuUserForm;
