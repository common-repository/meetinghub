<?php
/**
 * Template Name: Meeting Hub Template
 *
 * This template is used to display the Meeting Hub content.
 *
 * @package Meeting_Hub
 * @since 1.0.0
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$serialize_options   = get_post_meta( get_the_ID(), 'mhub__meeting_settings', true );
$meeting_description = get_post_meta( get_the_ID(), 'meeting_description', true );
$options             = maybe_unserialize( $serialize_options );
$hide_header_footer  = $options['hide_header_footer'];
$thumbnail_html      = get_the_post_thumbnail( get_the_ID() );
$is_header = true;

if ( ! $hide_header_footer ) {
	if ( file_exists( get_template_directory() . '/footer.php' ) ) {
		get_header();
	} else {
		$is_header = false;
		wp_head();
	}
} else {
	wp_head();
}


// User name.
$user_id           = get_current_user_id();
$current_user_data = get_userdata( $user_id );
$current_user_name = $current_user_data ? $current_user_data->display_name : '';

$meeting_status       = get_post_meta( get_the_ID(), 'mhub_meeting_status', true );
$meeting_start_status = get_post_meta( get_the_ID(), 'mhub_meeting_start_status', true );
$hide_sidebar         = $options['hide_sidebar'];
$time_zone            = $options['meeting_timezone'];

$gmt_array          = mhub_get_gmt_offset( $options['meeting_timezone'] );
$gmt_offset_val     = $gmt_array['gmt_offset_val'];
$gmt_offset         = $gmt_array['gmt_offset'];
$mhub_is_pro_active = mhub_fs()->is_paying() && mhub_fs()->is_premium();
$should_register    = false;
$attendee_login     = false;
$login_status;
$meeting_as_product;
$product_id;
$po_meeting_id = $post->ID;


if ( $mhub_is_pro_active ) {
	$login_status       = isset( $_SESSION[ "mhub_login_status_{$po_meeting_id}" ] ) ? sanitize_text_field( $_SESSION[ "mhub_login_status_{$po_meeting_id}" ] ) : '';
	$meeting_as_product = get_post_meta( get_the_ID(), 'mhub_connect_as_product', true );
	$product_id         = get_post_meta( get_the_ID(), 'mhub_connect_product_id', true );
	$should_register    = isset( $options['enable_should_register'] ) ? $options['enable_should_register'] : false;
}


if ( 'jitsi_meet' === $options ['selected_platform'] ) {
	include_once MHUB_INCLUDES . '/Templates/mhub-jitsi-single-meting.php';
} elseif ( 'zoom' === $options ['selected_platform'] ) {
	$display_meeting = isset( $_GET['display_meeting'] ) ? sanitize_text_field( wp_unslash( $_GET['display_meeting'] ) ) : '';

	if ( ! empty( $display_meeting ) ) {
		include_once MHUB_INCLUDES . '/Templates/mhub-zoom-web-single-meting.php';
	} else {
		include_once MHUB_INCLUDES . '/Templates/mhub-zoom-single-meting.php';
	}
} elseif ( 'webex' === $options ['selected_platform'] ) {
	include_once MHUB_INCLUDES . '/Templates/mhub-webex-singal-meeting.php';
}


if ( file_exists( get_template_directory() . '/footer.php' ) ) {
	get_footer();
} else {
	wp_footer();
}


if ( ! $hide_header_footer ) {
	if ( file_exists( get_template_directory() . '/footer.php' ) ) {
		get_header();
	} else {
		$is_header = false;
		wp_head();
	}
} else {
	wp_head();
}
