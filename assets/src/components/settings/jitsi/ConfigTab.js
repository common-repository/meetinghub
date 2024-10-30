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

  const { height, width, enable_inviting, enable_recording, enable_simulcast, enable_livestreaming, enable_welcome_page, enable_transcription, enable_outbound, hide_sidebar, enable_should_register, meeting_timezone, enable_recurring_meeting, hide_header_footer } = formData;

  return (
    <div>
      <div className="mhub-col-lg-12">
        <MhInput
          label={__('Meeting Height', 'meetinghub')}
          description={__('Meeting height in pixels', 'meetinghub')}
          type="number"
          name="height"
          required="no"
          value={height}
          onChange={(name, value) => handleChange(name, value)}
        />
      </div>

      <div className="mhub-col-lg-12">
        <MhInput
          label={__('Meeting Width', 'meetinghub')}
          description={__('Meeting width in pixels', 'meetinghub')}
          type="number"
          name="width"
          required="no"
          value={width}
          onChange={(name, value) => handleChange(name, value)}
        />
      </div>

      <div className="mhub-col-lg-12">
        <MhSwitcher
          label={__('Should Register', 'meetinghub')}
          description={__('If user should be registered to join the meeting', 'meetinghub')}         
          checked={enable_should_register}
          onChange={(name, value) => handleChange(name, value)}
          name="enable_should_register"
          disabled={!isProActive()} 
isLocked={ !isProActive()}
        />
      </div>

      <div className="mhub-col-lg-12">
        <MhSwitcher
          label={__('Recurring Meeting', 'meetinghub')}
          description={__('Enable recurring meeting', 'meetinghub')}         
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
          description={__('Meeting Timezone', 'meetinghub')}        
          options={Timezones}
          value={meeting_timezone}
          onChange={(name, value) => handleChange(name, value)}
          name="meeting_timezone"
        />
      </div>

      <div className="mhub-col-lg-12">
        <MhSwitcher
          label={__('Enable Inviting', 'meetinghub')}
          description={__('Attendee can invite people', 'meetinghub')}         
          name="enable_inviting"
          checked={enable_inviting}
          onChange={(name, value) => handleChange(name, value)}
        />
      </div>

      <div className="mhub-col-lg-12">
        <MhSwitcher
          label={__('Enable Recording', 'meetinghub')}
          description={__('Turn on to record the meeting', 'meetinghub')}         
          name="enable_recording"
          checked={enable_recording}
          onChange={(name, value) => handleChange(name, value)}
          disabled={!isProActive()} 
isLocked={ !isProActive()}
        />
      </div>

      <div className="mhub-col-lg-12">
        <MhSwitcher
          label={__('Simulcast', 'meetinghub')}
          description={__('Enable/Disable simulcast', 'meetinghub')}          
          name="enable_simulcast"
          checked={enable_simulcast}
          onChange={(name, value) => handleChange(name, value)}
          disabled={!isProActive()} 
isLocked={ !isProActive()}
        />
      </div>

      <div className="mhub-col-lg-12">
        <MhSwitcher
          label={__('Enable Livestream', 'meetinghub')}
          description={__('Turn on livestreaming', 'meetinghub')}         
          name="enable_livestreaming"
          checked={enable_livestreaming}
          onChange={(name, value) => handleChange(name, value)}
          disabled={!isProActive()} 
isLocked={ !isProActive()}
        />
      </div>

      <div className="mhub-col-lg-12">
        <MhSwitcher
          label={__('Welcome Page', 'meetinghub')}
          description={__('Enable/Disable welcome page', 'meetinghub')}         
          name="enable_welcome_page"
          checked={enable_welcome_page}
          onChange={(name, value) => handleChange(name, value)}
          disabled={!isProActive()} 
isLocked={ !isProActive()}
        />
      </div>

      <div className="mhub-col-lg-12">
        <MhSwitcher
          label={__('Enable Transcription', 'meetinghub')}
          description={__('Transcript the meeting', 'meetinghub')}
          name="enable_transcription"
          checked={enable_transcription}
          onChange={(name, value) => handleChange(name, value)}
          disabled={!isProActive()} 
isLocked={ !isProActive()}
        />
      </div>

      <div className="mhub-col-lg-12">
        <MhSwitcher
          label={__('Enable Outbound', 'meetinghub')}
          description={__('Allow outbound on the meeting', 'meetinghub')}         
          name="enable_outbound"
          checked={enable_outbound}
          onChange={(name, value) => handleChange(name, value)}
          disabled={!isProActive()} 
isLocked={ !isProActive()}
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
