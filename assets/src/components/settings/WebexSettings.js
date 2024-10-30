import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../../scss/settings/tab.scss";
import Spinner from "../common/Spinner";
import SettingIcons from "./SettingIcons";
import ConnectTab from "./webex/ConnectTab";
import ConfigTab from "./webex/ConfigTab";
import { toast } from 'react-toastify';
const { __ } = wp.i18n;
import ShortcodesTab from "./webex/ShortcodesTab";

function WebexSettings() {
  const storedTab = localStorage.getItem("mhub_webex_settings_active_tab");
  const [activeTab, setActiveTab] = useState(
    storedTab ? storedTab : "ConnectTab"
  );

  const [formData, setFormData] = useState({
    client_id: "",
    client_secret: "",
    meeting_timezone: mhubMeetingsData.mhub_timezone,
		hide_sidebar: false,
		hide_header_footer: false,
		auto_record: false,
		breakout_sessions: false,
		automatic_lock: false,
		lock_minutes: 15,
		enable_should_register: false,
		enable_recurring_meeting: false,
    join_before_host: false,

  });

  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveButtonText, setSaveButtonText] = useState(__('Save Changes', 'meetinghub'));
  const [saveButtonClass, setSaveButtonClass] = useState("");

  useEffect(() => {
    // Retrieve active tab from localStorage on component mount
    if (storedTab) {
      setActiveTab(storedTab);
    }
  }, []);

    // UseEffect to fetch Webex settings when the component mounts
    useEffect(() => {
      const fetchWebexSettings = async () => {
        setIsLoading(true);
        try {
          const settingsResponse = await wp.apiFetch({
            path: 'meetinghub/v2/settings/webex',
            method: 'GET',
          });
  
          setFormData({
            client_id: settingsResponse.client_id || formData.client_id,
            client_secret: settingsResponse.client_secret || formData.client_secret,
            meeting_timezone: settingsResponse.meeting_timezone || formData.meeting_timezone,
            hide_sidebar: settingsResponse.hide_sidebar || formData.hide_sidebar,
            hide_header_footer: settingsResponse.hide_header_footer || formData.hide_header_footer,
            auto_record: settingsResponse.auto_record || formData.auto_record,
            breakout_sessions: settingsResponse.breakout_sessions || formData.breakout_sessions,
            automatic_lock: settingsResponse.automatic_lock || formData.automatic_lock,
            lock_minutes: settingsResponse.lock_minutes || formData.lock_minutes,
            enable_should_register: settingsResponse.enable_should_register || formData.enable_should_register,
            enable_recurring_meeting: settingsResponse.enable_recurring_meeting || formData.enable_recurring_meeting,
            join_before_host: settingsResponse.join_before_host || formData.join_before_host,
          });
        } catch (error) {
          console.error('API Error:', error);
        } finally {
          setIsLoading(false);
        }
      };
  
      fetchWebexSettings();
    }, []);


  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
    // Store active tab in localStorage
    localStorage.setItem("mhub_webex_settings_active_tab", tabName);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSaving(true);
    try {
      const response = await wp.apiFetch({
        path: "meetinghub/v2/settings/webex",
        method: "POST",
        data: {
          client_id: formData.client_id,
          client_secret: formData.client_secret,
          meeting_timezone: formData.meeting_timezone,
          hide_sidebar: formData.hide_sidebar,
          hide_header_footer: formData.hide_header_footer,
          auto_record: formData.auto_record,
          breakout_sessions:  formData.breakout_sessions,
          automatic_lock:  formData.automatic_lock,
          lock_minutes:  formData.lock_minutes,
          enable_should_register: formData.enable_should_register,
          enable_recurring_meeting: formData.enable_recurring_meeting,
          join_before_host: formData.join_before_host,
        },
      });

      if (response && response.webex_settings_saved) {
        toast.success(__('Settings Saved Successfully.', 'meetinghub'));
        setSaveButtonText(__('Saved', 'meetinghub'));
        setSaveButtonClass("saved");
        setTimeout(() => {
          setSaveButtonText(__('Save Changes', 'meetinghub'));
          setSaveButtonClass("");
        }, 2000);
      } else {
        toast.error(__('Failed to Update Settings !', 'meetinghub'));
      }
    } catch (error) {
      console.error("API Error:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const renderTabContent = () => {
    // Map tab names to corresponding components
    const tabComponents = {
      ConnectTab: (
        <ConnectTab formData={formData} setFormData={setFormData} />
      ),
      Configurations: (
        <ConfigTab formData={formData} setFormData={setFormData} />
      ),
    };

    // Render the component for the active tab
    return tabComponents[activeTab] || null;
  };

  return (
    <div className="webex-settings-container">
      <Link to="/" className="back-button">
        &lt; {__('Back to main settings', 'meetinghub')}
      </Link>

      <div className="main-wrapper">
        <div className="header">
          {SettingIcons.webex}
          <div className="title">{__('Webex', 'meetinghub')}</div>
        </div>

        <div className="tab-wrapper">
          <div className="tab">
            <div
              className={`tab-item ${activeTab === "ConnectTab" ? "active" : ""
                }`}
              onClick={() => handleTabClick("ConnectTab")}
            >
             {__('Connect', 'meetinghub')}

            </div>
            <div
              className={`tab-item ${activeTab === "Configurations" ? "active" : ""
                }`}
              onClick={() => handleTabClick("Configurations")}
            >
              {__('Configurations', 'meetinghub')}
            </div>
            <div
              className={`tab-item ${activeTab === "Shortcodes" ? "active" : ""
                }`}
              onClick={() => handleTabClick("Shortcodes")}
            >
              {__('Shortcodes', 'meetinghub')}
            </div>

          </div>
          <a
            className="create-meeting-btn"
            href={mhubMeetingsData.createMeetingUrl}
          >
            <span className="dashicons dashicons-plus-alt2"></span>
            {__('Create Meeting', 'meetinghub')}
          </a>
        </div>

        {isLoading ? (
          <Spinner />
        ) : (
          <div className="webex-meeting-form ">
            <div className="form-wrapper">
            {activeTab !== "Shortcodes" && (
              <form onSubmit={handleSubmit}>
                {renderTabContent()}
                <div className="mhub-save-actions">
                  <button
                    type="submit"
                    className={`setting-save-button ${saveButtonClass}`}
                    disabled={isSaving}
                  >
                    {isSaving ? __('Saving...', 'meetinghub') : saveButtonText}
                  </button>
                </div>
              </form>
            )}

            {activeTab === "Shortcodes" && (
                <ShortcodesTab />
            )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default WebexSettings;
