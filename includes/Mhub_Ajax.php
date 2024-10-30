<?php //phpcs:ignore

/**
 * File: Mhub_Ajax.php
 *
 * The Mhub_Ajax class handles AJAX requests and provides functionalities for generating referral coupons.
 *
 * @package ECRE
 * @since   1.0.0
 */

namespace SOVLIX\MHUB;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! class_exists( 'Mhub_Ajax' ) ) {
	/**
	 * The Mhub_Ajax class handles AJAX requests and provides functionalities for generating referral coupons.
	 *
	 * @since 1.0.0
	 */
	class Mhub_Ajax {
		/**
		 * Mhub_Ajax constructor.
		 *
		 * Initializes the class and sets up AJAX request handlers.
		 */
		public function __construct() {
			add_action( 'wp_ajax_mhub_zoom_meeting_sign', array( $this, 'mhub_generate_signature' ) );
			add_action( 'wp_ajax_nopriv_mhub_zoom_meeting_sign', array( $this, 'mhub_generate_signature' ) );
			add_action( 'wp_ajax_mhub_meeting_action', array( $this, 'handle_mhub_meeting_action' ) );
			add_action( 'wp_ajax_nopriv_mhub_meeting_action', array( $this, 'handle_mhub_meeting_action' ) );
			add_action( 'wp_ajax_mhub_meeting_list', array( $this, 'mhub_meeting_lists' ) );
			add_action( 'wp_ajax_nopriv_mhub_meeting_list', array( $this, 'mhub_meeting_lists' ) );
		}

		/**
		 * Handles AJAX requests for fetching meeting lists.
		 *
		 * This function verifies the nonce for security, fetches the list of meetings,
		 * and returns the meetings as a JSON response. It is intended to be used as a
		 * callback for AJAX requests in WordPress.
		 *
		 * @since 1.13.1
		 *
		 * @return void
		 */
		public function mhub_meeting_lists() {
			// Verify nonce for security.
			$nonce = isset( $_POST['nonce'] ) ? sanitize_text_field( wp_unslash( $_POST['nonce'] ) ) : '';
			if ( ! wp_verify_nonce( $nonce, 'mhub_frontend_nonce' ) ) {
				wp_send_json_error( 'Invalid nonce.' );
			}

			$meetings = mhub_meetings();

			wp_send_json_success( $meetings );
		}

		/**
		 * Generate Signature
		 */
		public function mhub_generate_signature() {

			$request = file_get_contents( 'php://input' );
			$request = json_decode( $request );
			//phpcs:ignore
			$meeting_number = $request->meetingNumber;
			$role           = $request->role;
			$zoom_settings  = get_option( 'mhub_zoom_settings', true );
			$api_key        = $zoom_settings['sdk_client_id'];
			$api_secret     = $zoom_settings['sdk_client_secret'];

			$time = time() * 1000 - 30000;
			// phpcs:ignore WordPress.PHP.DiscouragedPHPFunctions.obfuscation_base64_encode
			$data = base64_encode( $api_key . $meeting_number . $time . $role );

			$hash = hash_hmac( 'sha256', $data, $api_secret, true );
			// phpcs:ignore WordPress.PHP.DiscouragedPHPFunctions.obfuscation_base64_encode
			$_sig = $api_key . '.' . $meeting_number . '.' . $time . '.' . $role . '.' . base64_encode( $hash );
			// phpcs:ignore WordPress.PHP.DiscouragedPHPFunctions.obfuscation_base64_encode
			$res     = rtrim( strtr( base64_encode( $_sig ), '+/', '-_' ), '=' );
			$results = array( $res );
			echo wp_json_encode( $results );
			wp_die();
		}

		/**
		 * Handle end meeting action
		 */
		public function handle_mhub_meeting_action() {
			// Verify nonce for security.
			$nonce = isset( $_POST['nonce'] ) ? sanitize_text_field( wp_unslash( $_POST['nonce'] ) ) : '';
			if ( ! wp_verify_nonce( $nonce, 'mhub_frontend_nonce' ) ) {
				wp_send_json_error( 'Invalid nonce.' );
			}

			$response = '';

			// Retrieve and sanitize posted data.
			$meeting_id     = isset( $_POST['meeting_id'] ) ? sanitize_text_field( wp_unslash( $_POST['meeting_id'] ) ) : '';
			$post_id        = isset( $_POST['post_id'] ) ? sanitize_text_field( wp_unslash( $_POST['post_id'] ) ) : '';
			$meeting_status = isset( $_POST['meeting_status'] ) ? sanitize_text_field( wp_unslash( $_POST['meeting_status'] ) ) : '';

			if ( 'end' === $meeting_status ) {
				update_post_meta( $post_id, 'mhub_meeting_status', 'end' );
				$response = 'Meeting ended successfully.';
			}

			if ( 'resume' === $meeting_status ) {
				update_post_meta( $post_id, 'mhub_meeting_status', 'resume' );
				$response = 'Meeting resumed successfully.';
			}

			if ( 'start' === $meeting_status ) {
				update_post_meta( $post_id, 'mhub_meeting_start_status', 'start' );
				$response = 'Meeting started successfully.';
			}

			if ( 'stop' === $meeting_status ) {
				update_post_meta( $post_id, 'mhub_meeting_start_status', 'stop' );
				$response = 'Meeting stoped successfully.';
			}

			// Example: Respond with a success message.
			wp_send_json_success( $response );
		}
	}
}
