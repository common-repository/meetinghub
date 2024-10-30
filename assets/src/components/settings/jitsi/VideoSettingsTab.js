import React from "react";
import MhInput from "../../common/fields/MhInput";
import MhSelect from "../../common/fields/MhSelect";
import MhSwitcher from "../../common/fields/MhSwitcher";
import { isProActive } from "../../../Helpers";
const { __ } = wp.i18n;

const meetingVideoResolution = [
  { value: "1080", label: __("1080p", "meetinghub") },
  { value: "480", label: __("480p", "meetinghub") },
  { value: "720", label: __("720p", "meetinghub") },
  { value: "1440", label: __("1440p", "meetinghub") },
  { value: "2160", label: __("2160p", "meetinghub") },
  { value: "4320", label: __("4320p", "meetinghub") },
];

const VideoSettingsTab = ({ formData, setFormData }) => {

  const handleChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const { start_with_video_muted, start_with_screen_sharing, video_resolution, max_full_resolution, video_muted_after } = formData;

  return (
    <div>
      <div className="mhub-col-lg-12">
        <MhSwitcher
          label={__('Start Video Muted', 'meetinghub')}
          description={__('Start with video muted', 'meetinghub')}
          checked={start_with_video_muted}
          onChange={(name, value) => handleChange(name, value)}
          name="start_with_video_muted"
        />
      </div>

      <div className="mhub-col-lg-12">
        <MhSwitcher
          label={__('Screen Sharing', 'meetinghub')}
          description={__('By enabling this feature, you\'re able to share your screen while attending a meeting', 'meetinghub')}        
          checked={start_with_screen_sharing}
          onChange={(name, value) => handleChange(name, value)}
          name="start_with_screen_sharing"
        />
      </div>

      <div className="mhub-col-lg-12">
        <MhSelect
          label={__('Video Resolution', 'meetinghub')}
          description={__('Start with preferred resolution.', 'meetinghub')}        
          options={meetingVideoResolution}
          value={video_resolution}
          onChange={(name, value) => handleChange(name, value)}
          name="video_resolution"
          disabled={!isProActive()} 
isLocked={ !isProActive()}
        />
      </div>

      <div className="mhub-col-lg-12">
        <MhInput
          label={__('Max Full Resolution', 'meetinghub')}
          description={__('Number of participants with default resolution', 'meetinghub')}         
          type="number"
          value={max_full_resolution}
          onChange={(name, value) => handleChange(name, value)}
          name="max_full_resolution"
          required="no"
          disabled={!isProActive()} 
isLocked={ !isProActive()}
        />
      </div>

      <div className="mhub-col-lg-12">
        <MhInput
          label={__('Video Muted After', 'meetinghub')}
          description={__('Every participant after nth will start video muted', 'meetinghub')}         
          type="number"
          value={video_muted_after}
          onChange={(name, value) => handleChange(name, value)}
          name="video_muted_after"
          required="no"
          disabled={!isProActive()} 
isLocked={ !isProActive()}
        />
      </div>
    </div>
  );
};

export default VideoSettingsTab;
