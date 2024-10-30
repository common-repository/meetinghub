import React from "react";
import MhSwitcher from "../../common/fields/MhSwitcher";
const { __ } = wp.i18n;

const VideoSettingsTab = ({ formData, setFormData }) => {

  const handleChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const { option_host_video, option_participants_video, panelists_video, hd_video } = formData;

  return (
    <div>
		<div className="mhub-col-lg-12">
			<MhSwitcher
				label={__('Start When Host Joins', 'meetinghub')}
				description={__('Start video when host join meeting.', 'meetinghub')}		 
				checked={option_host_video}
				onChange={(name, value) => handleChange(name, value)}
				name="option_host_video"
			/>
		</div>

		<div className="mhub-col-lg-12">
			<MhSwitcher
				label={__('Participants Video', 'meetinghub')}
				description={__('Start video when participants join meeting.', 'meetinghub')}					
				checked={option_participants_video}
				onChange={(name, value) => handleChange(name, value)}
				name="option_participants_video"
			/>
		</div>

		<div className="mhub-col-lg-12">
			<MhSwitcher
				label={__('When Panelists Join', 'meetinghub')}
				description={__('Start video when panelists join webinar.', 'meetinghub')}
				checked={panelists_video}
				onChange={(name, value) => handleChange(name, value)}
				name="panelists_video"
			/>
		</div>

		<div className="mhub-col-lg-12">
			<MhSwitcher
				label={__('HD Video', 'meetinghub')}
				description={__('Defaults to HD video.', 'meetinghub')}				
				checked={hd_video}
				onChange={(name, value) => handleChange(name, value)}
				name="hd_video"
			/>
		</div>
    </div>
  );
};

export default VideoSettingsTab;
