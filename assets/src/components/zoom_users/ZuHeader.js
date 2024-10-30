import React from "react";
import { Link } from 'react-router-dom';
const { __ } = wp.i18n;

function ZuHeader() {
	return (
		<div className="header-area">
			<div className="header-wrapper">
				<h1>{__('All Users', 'meetinghub')}</h1>
				<div className="create-btn-wrapper">
					<Link className="create-user-btn" to="/user/create"> <span className="dashicons dashicons-plus-alt mr-2"></span>{__('Add a User', 'meetinghub')}</Link>
				</div>
			</div>
		</div>
	);
}

export default ZuHeader;
