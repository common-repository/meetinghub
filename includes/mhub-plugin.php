<?php //phpcs:ignore
/**
 * Main Plugin File
 *
 * The primary entry point for the Meeting Hub plugin.
 *
 * @package SOVLIX\MHUB
 */

namespace SOVLIX\MHUB;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Check if the main class already exists.
 *
 * @since 1.0.0
 */
if ( ! class_exists( 'Meeting_Hub' ) ) {
	/**
	 * Meeting Hub Plugin Main Class
	 *
	 * Sets up and initializes the Meeting Hub plugin.
	 *
	 * @since 1.0.0
	 */
	class Meeting_Hub {
		/**
		 * Class constructor.
		 *
		 * Hooks into the 'plugins_loaded' action to initiate the plugin.
		 */
		private function __construct() {
			add_action( 'plugins_loaded', array( $this, 'init_plugin' ) );
			add_action( 'init', array( $this, 'mhub_localization_setup' ) );
		}

		/**
		 * Initialize a singleton instance of the plugin.
		 *
		 * @return Meeting_Hub An instance of the Meeting_Hub class.
		 * @since  1.0.0
		 */
		public static function init() {
			static $instance = false;

			if ( ! $instance ) {
				$instance = new self();
			}

			return $instance;
		}

		/**
		 * Initialize the Meeting Hub plugin.
		 *
		 * Initiates the necessary components for the plugin, such as Assets,
		 * and either the Admin or Frontend components based on the current context.
		 *
		 * @return void
		 * @since  1.0.0
		 */
		public function init_plugin() {

			// Initialize Ajax component for asynchronous actions.
			if ( defined( 'DOING_AJAX' ) && DOING_AJAX ) {
				new Mhub_Ajax();
			}

			new Mhub_Assets();

			if ( is_admin() ) {
				new Mhub_Admin();
			} else {
				new Mhub_Frontend();
			}
			new Mhub_Post_Types();

			new Mhub_API();
			new Mhub_Shortcodes();
			new Mhub_Gutenberg();

			// Get the list of active plugins.
			$active_plugins = get_option( 'active_plugins' );

			// Check if the Elementor plugin is active.
			if ( in_array( 'elementor/elementor.php', $active_plugins, true ) ) {
				new Elementor\Mhub_Elementor_Integrator();
			}
		}

		/**
		 * Sets up localization for the Meeting Hub plugin.
		 *
		 * This function loads the plugin text domain for translation purposes.
		 * Text domain: meetinghub
		 *
		 * @since 1.12.0
		 */
		public function mhub_localization_setup() {
			load_plugin_textdomain( 'meetinghub', false, MHUB_PATH . '/languages/' );
		}
	}

	// Kick-off the Meeting Hub plugin.
	Meeting_Hub::init();
}
