import React from "react";
import { Link } from 'react-router-dom';
const { __ } = wp.i18n;

function Header() {
	return (
		<div className="header-area">
			<div className="header-wrapper">
				<h1>{__('All Meetings', 'meetinghub')}</h1>
				<div className="create-btn-wrapper">
					<Link className="create-meeting-btn" to="/meeting/create"> <span className="dashicons dashicons-plus-alt mr-2"></span>{__('Add new', 'meetinghub')} </Link>
				</div>
			</div>
		</div>
	);
}

export default Header;
