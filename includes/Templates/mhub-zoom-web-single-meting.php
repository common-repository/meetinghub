<?php
/**
 * MeetingHub Zoom WebSDK Template
 *
 * Description: This template is used to embed Zoom WebSDK for displaying Zoom meetings or webinars on a specific post or page.
 * It handles user registration and meeting configuration based on the Zoom settings.
 *
 * @package SOVLIX\MHUB
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$mhub_post_id   = get_the_ID();
$mhub_post_type = get_post_type( $mhub_post_id );
$zoom_settings  = get_option( 'mhub_zoom_settings', true );

$api_key    = $zoom_settings['sdk_client_id'];
$api_secret = $zoom_settings['sdk_client_secret'];
$meeting_id = get_post_meta( get_the_ID(), 'meetinghub_zoom_meeting_id', true );

$username         = esc_attr__( 'Guest', 'meetinghub' );
$email            = '';
$meeting_password = get_post_meta( get_the_ID(), 'meetinghub_zoom_meeting_password', true );

$lang              = 'en-US';
$registration_form = false;

if ( is_user_logged_in() ) {
	$registration_form = false;
	$user              = wp_get_current_user();
	$username          = $user->user_login;
	$email             = $user->user_email;
}

?>

<!DOCTYPE html>

<head>
	<title>Zoom WebSDK CDN</title>
	<meta charset="utf-8" />
	<meta name="format-detection" content="telephone=no">
	<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">

</head>

<body>

<style>
	#zmmtg-root{
		background-color: unset !important;
	}
	header{
		display: none;
	}
</style>

<script>
	var API_KEY = '<?php echo esc_js( $api_key ); ?>';
	var SECRET_KEY = '<?php echo esc_js( $api_secret ); ?>';
	var leaveUrl = '<?php echo esc_url( get_home_url( '/' ) ); ?>';
	var endpoint = '<?php echo esc_url( get_site_url() ); ?>/wp-admin/admin-ajax.php?action=mhub_zoom_meeting_sign';
	var meeting_id = '<?php echo esc_attr( $meeting_id ); ?>';
	var meeting_password = '<?php echo esc_attr( $meeting_password ); ?>';
	var username = '<?php echo esc_attr( $username ); ?>';
	var email = '<?php echo esc_attr( $email ); ?>';
	var lang = '<?php echo esc_attr( $lang ); ?>';
	var role = 0;
</script>

<?php // phpcs:ignore ?>
<script src="https://source.zoom.us/3.1.6/lib/vendor/react.min.js"></script>
<?php // phpcs:ignore ?>
<script src="https://source.zoom.us/3.1.6/lib/vendor/react-dom.min.js"></script>
<?php // phpcs:ignore ?>
<script src="https://source.zoom.us/3.1.6/lib/vendor/redux.min.js"></script>
<?php // phpcs:ignore ?>
<script src="https://source.zoom.us/3.1.6/lib/vendor/redux-thunk.min.js"></script>
<?php // phpcs:ignore ?>
<script src="https://source.zoom.us/3.1.6/lib/vendor/lodash.min.js"></script>
<?php // phpcs:ignore ?>
<script src="https://source.zoom.us/zoom-meeting-3.1.6.min.js"></script>
<?php // phpcs:ignore ?>
<script src="<?php echo esc_url( MHUB_ASSETS . '/js/zoom/vconsole.min.js' ); ?>"></script>
<?php // phpcs:ignore ?>
<script src="<?php echo esc_url( MHUB_ASSETS . '/js/zoom/tool.js' ); ?>"></script>
<?php // phpcs:ignore ?>
<script src="<?php echo esc_url( MHUB_ASSETS . '/js/zoom/meeting.js' ); ?>"></script>
</body>

</html>
