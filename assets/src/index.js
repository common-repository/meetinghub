import { createRoot } from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import DashboardApp from './App/DashboardApp';
import SettingsApp from './App/SettingsApp';
import ZoomUsersApp from './App/ZoomUsersApp';
import ZoomReportsApp from './App/ZoomReportsApp';
import ZoomRecordingsApp from './App/ZoomRecordingsApp';
import MeetingListApp from './App/MeetingListApp';

document.addEventListener(
	'DOMContentLoaded', function () {
		var rootElementDashboard        = document.getElementById('meeting_hub_admin_dasboard');
		var rootElementLmsDashboard     = document.getElementById('meetingHub_lms_dashboard');
		var rootElementDokanDashboard   = document.getElementById('mhub_dokan_dasboard');
		const rootElementSettings       = document.getElementById('meeting_hub_admin_settings');
		const rootElementZoomUsers      = document.getElementById('meetinghub_zoom_users');
		const rootElementZoomReports    = document.getElementById('meetinghub_zoom_reports');
		const rootElementZoomRecordings = document.getElementById('meetinghub_zoom_recordings');

		if(rootElementDashboard ) {
			const dashboardRoot = createRoot(rootElementDashboard);
			dashboardRoot.render(<HashRouter> <DashboardApp /></HashRouter>);
		}
		
		if(rootElementDokanDashboard  ) {
			const DokanDashboardRoot = createRoot(rootElementDokanDashboard );
			if( mhubMeetingsData.active ){
				DokanDashboardRoot.render(<HashRouter> <DashboardApp /></HashRouter>);
			}
		}

		if(rootElementLmsDashboard ) {
			const lmsDashboardRoot = createRoot(rootElementLmsDashboard);
			if( mhubMeetingsData.active ){
				lmsDashboardRoot.render(<HashRouter> <DashboardApp /></HashRouter>);
			}
		}

		if (rootElementSettings) {
			const settingsRoot = createRoot(rootElementSettings);
			settingsRoot.render(<HashRouter><SettingsApp /></HashRouter>);
		}

		if (rootElementZoomUsers) {
			const usersRoot = createRoot(rootElementZoomUsers);
			usersRoot.render(<HashRouter><ZoomUsersApp /></HashRouter>);
		}

		if (rootElementZoomReports) {
			const reportsRoot = createRoot(rootElementZoomReports);
			reportsRoot.render(<HashRouter><ZoomReportsApp /></HashRouter>);
		}

		if (rootElementZoomRecordings) {
			const reportsRoot = createRoot(rootElementZoomRecordings);
			reportsRoot.render(<HashRouter><ZoomRecordingsApp /></HashRouter>);
		}
	
	} 
);

