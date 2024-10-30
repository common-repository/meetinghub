<?php // phpcs:ignore
/**
 * Mhub_Admin Class
 *
 * This class defines the administration functionality for the Meeting Hub plugin.
 *
 * @package SOVLIX\MHUB
 */

namespace SOVLIX\MHUB;

use Firebase\JWT\JWT;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! class_exists( 'Mhub_Admin' ) ) {
	/**
	 * Mhub_Admin Class
	 *
	 * Responsible for handling administration-related tasks for the Meeting Hub plugin.
	 *
	 * @since 1.0.0
	 */
	class Mhub_Admin {
		/**
		 * Zoom Api class.
		 *
		 * @var Mhub_Zoom_Api
		 */
		private $zoom_api;

		/**
		 * Webex Api class.
		 *
		 * @var Mhub_Webex_Api
		 */
		private $webex_api;

		/**
		 * Mhub_Admin constructor.
		 *
		 * Initializes the admin class.
		 */
		public function __construct() {
			new Admin\Mhub_Menu();
			$this->zoom_api  = \SOVLIX\MHUB\Zoom\Mhub_Zoom_Api::instance();
			$this->webex_api = \SOVLIX\MHUB\API\Webex_Api::get_instance();

			$sdk_prepared        = $this->mhub_is_sdk_prepare();
			$auth_prepared       = $this->mhub_is_server_auth_prepare();
			$webex_auth_prepared = $this->mhub_webex_auth_prepare();

			$code   = filter_input( INPUT_GET, 'code' );
			$revoke = filter_input( INPUT_GET, 'revoke' );
			$page   = filter_input( INPUT_GET, 'page' );
			$state  = filter_input( INPUT_GET, 'state' );

			if ( ! empty( $code ) && ! empty( $state ) ) {
				$this->webex_api->fetch_access_token();
			} elseif ( ! empty( $code ) ) {
				wp_safe_redirect( admin_url( 'admin.php?page=meetinghub-settings#/zoom' ) );
			}

			if ( ! empty( $revoke ) ) {
				$this->webex_api->revoke_access_token();
			}

			$current_user_id = get_current_user_id();

			// Check if the current page is meetinghub-settings.
			if ( 'meetinghub-settings' === $page ) {

				if ( ! $auth_prepared ) {
					add_action( 'admin_notices', array( $this, 'mhub_display_auth_notice' ) );
				}

				if ( ! $sdk_prepared ) {
					add_action( 'admin_notices', array( $this, 'mhub_display_sdk_notice' ) );
				}

				$webex_access_token = get_user_meta( $current_user_id, 'mhub_webex_access_token', true );

				if ( ! $webex_auth_prepared ) {
					add_action( 'admin_notices', array( $this, 'mhub_display_webex_auth_notice' ) );
				}
			}

			add_filter( 'plugin_action_links', array( $this, 'mhub_settings_link' ), 11, 2 );

			if ( ! $sdk_prepared ) {
				update_option( 'mhub_zoom_global_oauth_data', '' );
			}

			if ( ! $webex_auth_prepared ) {
				update_user_meta( $current_user_id, 'mhub_webex_access_token', '' );
			}

			$mhub_zoom_global_oauth = get_option( 'mhub_zoom_global_oauth_data' );

			if ( empty( $mhub_zoom_global_oauth ) ) {
				$this->mhub_store_users();
			}

			$this->mhub_jitsi_jwt();
		}

		/**
		 * Display admin notice to inform about the need to add Meeting SDK for Zoom functionalities.
		 */
		public function mhub_display_sdk_notice() {
			?>	
				<div class="notice notice-warning is-dismissible">
					<p>
						<?php esc_html_e( 'Please configure the Zoom Meeting SDK to enable additional Zoom Client functionalities and ensure "Join In Browser" functionality works correctly. ', 'meetinghub' ); ?>
						<a href="<?php echo esc_url( 'https://youtu.be/Q0Zt80PjvTE' ); ?>" target="_blank"><?php esc_html_e( 'Configure Zoom SDK Settings', 'meetinghub' ); ?></a>
					</p>
				</div>
			<?php
		}

		/**
		 * Display admin notice to inform about the need to add webex auth functionalities.
		 */
		public function mhub_display_webex_auth_notice() {
			?>
				
				<div class="notice notice-warning is-dismissible">
					<p>
						<?php esc_html_e( 'Please configure the Webex  Auth credentails to enable additional Webex Client. ', 'meetinghub' ); ?>
						<a href="<?php echo esc_url( 'https://youtu.be/vV3EwUNJusk' ); ?>" target="_blank"><?php esc_html_e( 'Configure Webex Settings', 'meetinghub' ); ?></a>
					</p>
				</div>
			<?php
		}

		/**
		 * Display admin notice to inform about the need to add Server to Server OAuth Credentials for Zoom functionalities.
		 */
		public function mhub_display_auth_notice() {
			?>
			<div class="notice notice-warning is-dismissible">
				<p>
					<?php esc_html_e( 'Please configure Server to Server OAuth Credentials to enable the creation of Zoom meetings and webinars, along with additional functionalities.', 'meetinghub' ); ?>
					<a href="<?php echo esc_url( 'https://youtu.be/ApSm4QJXLGc' ); ?>" target="_blank"><?php esc_html_e( 'Configure OAuth Credentials', 'meetinghub' ); ?></a>
				</p>
			</div>
			<?php
		}

		/**
		 * Check if the Zoom SDK is prepared by verifying the presence of API key and the absence of API secret.
		 *
		 * @return bool Whether the Zoom SDK is prepared or not.
		 */
		public function mhub_is_sdk_prepare() {
			$status = false;

			// Get Zoom settings from options.
			$zoom_settings = get_option( 'mhub_zoom_settings', true );

			if ( is_array( $zoom_settings ) && ! empty( $zoom_settings ) ) {
				// Extract API key and API secret from settings.
				$api_key    = $zoom_settings['sdk_client_id'];
				$api_secret = $zoom_settings['sdk_client_secret'];

				// Check if API key is not empty and API secret is empty.
				if ( ! empty( $api_key ) && ! empty( $api_secret ) ) {
					$status = true;
					update_option( 'mhub_is_sdk_prepare', 'yes' );
				} else {
					update_option( 'mhub_is_sdk_prepare', 'no' );
				}
			}
			return $status;
		}

		/**
		 * Check if the server authentication for Zoom is prepared by verifying the presence
		 * of OAuth account ID, OAuth client ID, and OAuth client secret in the Zoom settings.
		 *
		 * @return bool Whether the server authentication is prepared or not.
		 */
		public function mhub_is_server_auth_prepare() {
			$status = false;

			// Get Zoom settings from options.
			$zoom_settings = get_option( 'mhub_zoom_settings' );

			if ( is_array( $zoom_settings ) && ! empty( $zoom_settings ) ) {
				// Extract API key and API secret from settings.
				$account_id    = isset( $zoom_settings['oauth_account_id'] ) ? $zoom_settings['oauth_account_id'] : '';
				$client_id     = isset( $zoom_settings['oauth_client_id'] ) ? $zoom_settings['oauth_client_id'] : '';
				$client_secret = isset( $zoom_settings['oauth_client_secret'] ) ? $zoom_settings['oauth_client_secret'] : '';

				// Check if API key is not empty and API secret is empty.
				if ( ! empty( $account_id ) && ! empty( $client_id ) && ! empty( $client_secret ) ) {
					update_option( 'mhub_is_server_auth_prepare', 'yes' );
					$status = true;
				} else {
					update_option( 'mhub_is_server_auth_prepare', 'no' );
				}
			}

			return $status;
		}

		/**
		 * Prepare Webex authentication.
		 *
		 * This function retrieves Webex settings from the WordPress options, checks if the client ID and client secret are present,
		 * and updates the 'mhub_webex_auth_prepare' option accordingly. If both the client ID and client secret are present,
		 * it sets the option to 'yes' and returns true. Otherwise, it sets the option to 'no' and returns false.
		 *
		 * @return bool True if the client ID and client secret are both present, false otherwise.
		 */
		public function mhub_webex_auth_prepare() {
			$status = false;

			// Get webex settings from options.
			$webex_settings = get_option( 'mhub_webex_settings', true );

			if ( is_array( $webex_settings ) && ! empty( $webex_settings ) ) {
				// Extract API key and API secret from settings.
				$client_id     = $webex_settings['client_id'] ? $webex_settings['client_id'] : '';
				$client_secret = $webex_settings['client_secret'] ? $webex_settings['client_secret'] : '';

				// Check if API key is not empty and API secret is empty.
				if ( ! empty( $client_id ) && ! empty( $client_secret ) ) {
					update_option( 'mhub_webex_auth_prepare', 'yes' );
					$status = true;
				} else {
					update_option( 'mhub_webex_auth_prepare', 'no' );
				}
			}

			return $status;
		}

		/**
		 * Adds a "Settings" link to the plugin actions on the WordPress Plugins page.
		 *
		 * This function is a WordPress filter function that specifically targets the "Meeting Hub" plugin.
		 *
		 * @param array  $actions     The existing array of action links for the plugin.
		 * @param string $plugin_file The file path of the plugin being processed.
		 *
		 * @return array The modified array of action links, including the additional "Settings" link if the plugin is "Meeting Hub".
		 *
		 * @since 1.2.0
		 */
		public function mhub_settings_link( $actions, $plugin_file ) {
			if ( 'meetinghub/meetinghub.php' === $plugin_file ) {
				$settings_link = '<a href="' . admin_url( 'admin.php?page=meetinghub-settings' ) . '">' . esc_html__( 'Settings', 'meetinghub' ) . '</a>';
				if ( ! in_array( $settings_link, $actions, true ) ) {
					array_push( $actions, $settings_link );
				}
			}

			return $actions;
		}

		/**
		 * Retrieves user data from the Zoom API and stores it in the WordPress options table.
		 *
		 * This function retrieves user data from the Zoom API using the provided Zoom API instance,
		 * decodes the JSON response, and stores the user data in the WordPress options table.
		 * User data includes user ID, email, and display name.
		 * If the retrieved user data is not empty and in the expected format, it is stored in the options table.
		 *
		 * @since 1.0.0
		 */
		public function mhub_store_users() {
			$page      = 1;
			$user_data = $this->zoom_api->list_users( $page );
			$user_data = json_decode( $user_data, true );

			if ( ! empty( $user_data ) && isset( $user_data['users'] ) && is_array( $user_data['users'] ) && count( $user_data['users'] ) > 0 ) {
				$users_data = array();
				foreach ( $user_data['users'] as $user ) {
					$user_id      = $user['id'];
					$email        = $user['email'];
					$display_name = $user['display_name'];

					$users_data[] = array(
						'id'           => $user_id,
						'email'        => $email,
						'display_name' => $display_name,
					);
				}

				update_option( 'mhub_zoom_users', $users_data );
			} else {
				update_option( 'mhub_zoom_users', array() );
			}
		}

		/**
		 * Generate a JSON Web Token (JWT) for Jitsi integration.
		 *
		 * This function generates a JWT token for use in integrating with Jitsi, a video conferencing platform.
		 * The JWT token includes user information, such as name, email, and avatar, along with permissions and features settings.
		 * If the user is logged in, their information is included in the JWT payload. Otherwise, default values are used.
		 *
		 * @return string The generated JWT token.
		 */
		public function mhub_jitsi_jwt() {
			// Retrieve Jitsi settings from options.
			$jitsi_settings_serialized = get_option( 'mhub_jitsi_settings' );
			$jitsi_settings            = maybe_unserialize( $jitsi_settings_serialized );

			// Check if Jitsi settings are empty or not configured properly.
			if ( empty( $jitsi_settings ) ) {
				delete_transient( 'mhub_jitsi_jwt_token' );
				return '';
			}

			if ( 'jitsi_jass_premium' !== $jitsi_settings['domain_type'] ) {
				delete_transient( 'mhub_jitsi_jwt_token' );
				return '';
			}

			if ( empty( $jitsi_settings['app_id'] ) || empty( $jitsi_settings['api_key'] ) || empty( $jitsi_settings['private_key'] ) ) {
				delete_transient( 'mhub_jitsi_jwt_token' );
				return '';
			}

			// Check if a token is already stored.
			$stored_token = get_transient( 'mhub_jitsi_jwt_token' );

			if ( ! empty( $stored_token ) ) {
				return $stored_token;
			}

			// Initialize user variables.
			$user_avatar_url = '';
			$user_name       = '';
			$user_email      = '';
			$user_id         = '';

			// Get user information if user is logged in.
			if ( is_user_logged_in() ) {
				$current_user    = wp_get_current_user();
				$user_id         = $current_user->ID;
				$user_avatar_url = get_avatar_url( $current_user->ID );
				$user_name       = $current_user->display_name;
				$user_email      = $current_user->user_email;
			}

			// Extract Jitsi settings.
			$api_key                  = $jitsi_settings['api_key'];
			$api_id                   = $jitsi_settings['app_id'];
			$private_key              = trim( $jitsi_settings['private_key'] );
			$livestreaming_is_enabled = $jitsi_settings['enable_livestreaming'];
			$recording_is_enabled     = $jitsi_settings['enable_recording'];
			$outbound_is_enabled      = $jitsi_settings['enable_outbound'];
			$transcription_is_enabled = $jitsi_settings['enable_transcription'];
			$user_is_moderator        = true;
			$exp_delay_sec            = 7200;
			$nbf_delay_sec            = 0;

			/**
			 * Generate a Jitsi JWT token.
			 *
			 * @param string $api_key The API key for Jitsi integration.
			 * @param string $app_id The App ID for Jitsi integration.
			 * @param string $user_email The email address of the user.
			 * @param string $user_name The name of the user.
			 * @param bool   $user_is_moderator Whether the user is a moderator or not.
			 * @param string $user_avatar_url The URL of the user's avatar.
			 * @param string $user_id The unique ID of the user.
			 * @param bool   $live_streaming_enabled Whether livestreaming is enabled for the user.
			 * @param bool   $recording_enabled Whether recording is enabled for the user.
			 * @param bool   $outbound_enabled Whether outbound calls are enabled for the user.
			 * @param bool   $transcription_enabled Whether transcription is enabled for the user.
			 * @param int    $exp_delay The expiration delay in seconds for the JWT token.
			 * @param int    $nbf_delay The not before delay in seconds for the JWT token.
			 * @param string $private_key The private key used for encoding the JWT token.
			 *
			 * @return string|null The generated JWT token or null if generation fails.
			 */
			function create_jaas_token(
				$api_key,
				$app_id,
				$user_email,
				$user_name,
				$user_is_moderator,
				$user_avatar_url,
				$user_id,
				$live_streaming_enabled,
				$recording_enabled,
				$outbound_enabled,
				$transcription_enabled,
				$exp_delay,
				$nbf_delay,
				$private_key
			) {
				try {
					// Validate private key.
					$private_key_resource = openssl_pkey_get_private( $private_key );

					if ( ! $private_key_resource ) {
						return null; // Return null if the private key is invalid.
					}

					$payload = array(
						'iss'     => 'chat',
						'aud'     => 'jitsi',
						'exp'     => time() + $exp_delay,
						'nbf'     => time() - $nbf_delay,
						'room'    => '*',
						'sub'     => $app_id,
						'context' => array(
							'user'     => current_user_can( 'edit_posts' ) ? array(
								'moderator' => $user_is_moderator ? 'true' : 'false',
								'email'     => $user_email,
								'name'      => $user_name,
								'avatar'    => $user_avatar_url,
								'id'        => $user_id,
							) : array(
								'moderator' => 'false',
							),
							'features' => array(
								'recording'     => $recording_enabled ? 'true' : 'false',
								'livestreaming' => $live_streaming_enabled ? 'true' : 'false',
								'transcription' => $transcription_enabled ? 'true' : 'false',
								'outbound-call' => $outbound_enabled ? 'true' : 'false',
							),
						),
					);

					$payload_json = wp_json_encode( $payload );
					// Attempt to sign the payload.
					$success = openssl_sign( $payload_json, $signature, $private_key_resource, OPENSSL_ALGO_SHA256 );

					// Conditionally free the private key resource if PHP version is less than 8.0.
					if ( version_compare( PHP_VERSION, '8.0.0', '<' ) ) {
						openssl_free_key( $private_key_resource );
					}

					// Check if signing was successful.
					if ( ! $success ) {
						// Return null if signing failed.
						return null;
					}

					return JWT::encode( $payload, $private_key, 'RS256', $api_key );
				} catch ( Exception $e ) {
					// Log the error or handle it in an appropriate manner.
					// Returning null for now.
					return null;
				}
			}

			// Generate the JWT token.
			$token = create_jaas_token(
				$api_key,
				$api_id,
				$user_email,
				$user_name,
				$user_is_moderator,
				$user_avatar_url,
				$user_id,
				$livestreaming_is_enabled,
				$recording_is_enabled,
				$outbound_is_enabled,
				$transcription_is_enabled,
				$exp_delay_sec,
				$nbf_delay_sec,
				$private_key
			);

			// Check if token generation failed.
			if ( null === $token ) {
				// Token generation failed, handle the error appropriately.
				// For now, return an empty string.
				return '';
			}

			// Store the token in the options table.
			set_transient( 'mhub_jitsi_jwt_token', $token, $exp_delay_sec );

			// Return the JWT token.
			return $token;
		}
	}
}
