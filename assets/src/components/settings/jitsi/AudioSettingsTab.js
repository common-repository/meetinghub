import React from "react";
import MhSwitcher from "../../common/fields/MhSwitcher";
import MhInput from "../../common/fields/MhInput";
import { isProActive } from "../../../Helpers";
const { __ } = wp.i18n;

const AudioSettingsTab = ({ formData, setFormData }) => {

  const handleChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const { yourself_muted, audio_muted, audio_only, start_silent } = formData;

  return (
    <div>
      <div className="mhub-col-lg-12">
        <MhSwitcher
          label={__('Yourself muted', 'meetinghub')}
          description={__('Start with yourself muted', 'meetinghub')}
          name="yourself_muted"
          checked={yourself_muted}
          onChange={(name, value) => handleChange(name, value)}
        />
      </div>
      <div className="mhub-col-lg-12">
        <MhInput
          label={__('Start Audio Muted', 'meetinghub')}
          description={__('Participant after nth will be muted', 'meetinghub')}
          type="number"
          value={audio_muted}
          onChange={(name, value) => handleChange(name, value)}
          name="audio_muted"
          required="no"
        />
      </div> 
      <div className="mhub-col-lg-12">
        <MhSwitcher
          label={__('Audio Only', 'meetinghub')}
          description={__('Start conference on audio only', 'meetinghub')}
          name="audio_only"
          checked={audio_only}
          onChange={(name, value) => handleChange(name, value)}
          disabled={!isProActive()} 
isLocked={ !isProActive()}
        />
      </div>
      <div className="mhub-col-lg-12">
        <MhSwitcher
          label={__('Start Silent', 'meetinghub')}
          description={__('Disable local audio output', 'meetinghub')}          
          name="start_silent"
          checked={start_silent}
          onChange={(name, value) => handleChange(name, value)}
          disabled={!isProActive()} 
isLocked={ !isProActive()}
        />
      </div>
    </div>
  );
};

export default AudioSettingsTab;
