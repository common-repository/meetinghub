const { __ } = wp.i18n;
import { useMhubAdmin } from "../../../App/MhubAdminContext";

const MhSwitcher = ({ label, description, checked, onChange, name, disabled, isLocked, isUpcomming = false }) => {
	const { openProModal } = useMhubAdmin();

	return (
	  <div className="mhub-form-group">
		<label>
		  {label}
		  {description && <small className="description">{description}</small>}
		</label>
		<div className="input-wrapper">
		  <div className={`mhub-switch-field ${disabled ? 'disabled' : ''}`}>
			<input
			  type="checkbox"
			  id={name}
			  checked={checked}
			  onChange={() => onChange(name, !checked)}
			  disabled={disabled}
			/>
			<label htmlFor={name} className={`${isLocked ? 'mhub-locked' : ''}`}  {...(disabled && !isUpcomming && { onClick: openProModal })}></label>

			{ isLocked ? (<span className="mhub-pro-tag" onClick={openProModal}>{__('Pro', 'meetinghub')}</span>) : ''}
			{ isUpcomming ? (<span className="mhub-upcomming-tag">{__('Upcomming', 'meetinghub')}</span>) : ''}

		  </div>
		</div>
	  </div>
	);
};
  
export default MhSwitcher;
  