<?php
/**
 * MeetingHub webex single Template sidebar
 *
 * @package MeetingHub
 */

?>

<div class="mhub-sidebar-col">
	<div class="mhub-sidebar">
		<div class="mhub-single-widget mhub-single-widget-countdown">
			<h4 class="mhub-widget-title"><?php esc_html_e( 'Time to go', 'meetinghub' ); ?></h4>
			<div class="mhub-widget-inner">
				<?php if ( ! isset( $webex_response['errors'] ) ) { ?>
					<?php if ( 'end' !== $meeting_status ) { ?>
						<?php if ( $is_schedule ) { ?>
							<div class="meetinghub_start_time" data-meeting-start-time="<?php echo esc_attr( $next_meeting_time ); ?>" data-meeting-time-offset="<?php echo esc_attr( $gmt_offset_val ); ?>" > </div>
							<?php } else { ?>
								<span class="mhub-countdown-wrapper">
									<span class="mhub-countdown-value"><?php esc_html_e( 'Meeting is running', 'meetinghub' ); ?></span>
									<span class="mhub-countdown-label"><?php esc_html_e( 'The meeting is started and running', 'meetinghub' ); ?></span>
								</span>
							<?php } ?>
					<?php } else { ?>
						<span class="mhub-countdown-wrapper">
							<span class="mhub-countdown-value"><?php esc_html_e( 'Meeting is finished', 'meetinghub' ); ?></span>
							<span class="mhub-countdown-label"><?php esc_html_e( 'This meeting has been ended by the host.', 'meetinghub' ); ?></span>
						</span>
					<?php } ?>
				<?php } else { ?>
					<span class="mhub-countdown-wrapper">
							<span class="mhub-countdown-label"><?php echo esc_html( $response_message ); ?></span>
					</span>

				<?php } ?>
			</div>
		</div>

		<?php if ( ! isset( $webex_response['errors'] ) ) { ?>
			<?php if ( current_user_can( 'manage_options' ) ) { ?>
				<div class="mhub-single-widget mhub-single-widget-host-actions">
					<div class="mhub-widget-inner">
						<?php if ( 'end' !== $meeting_status ) { ?>
						<button  class="mhub-meeting-status" data-meeting-status="end" data-post-id="<?php echo esc_attr( $post->ID ); ?>" data-meeting-id="<?php echo esc_attr( $meeting_id ); ?>"><?php esc_html_e( 'End Meeting ?', 'meetinghub' ); ?>
						</button>
					<?php } else { ?>
						<button  class="mhub-meeting-status" data-meeting-status="resume" data-post-id="<?php echo esc_attr( $post->ID ); ?>" data-meeting-id="<?php echo esc_attr( $meeting_id ); ?>"><?php esc_html_e( 'Enable Meeting Join ?', 'meetinghub' ); ?>
						</button>
					<?php } ?>
						<p><?php esc_html_e( 'You are seeing this because you are the author of this meeting', 'meetinghub' ); ?></p>
					</div>
				</div>
			<?php } ?>
		<?php } ?>
			
		<div class="mhub-single-widget mhub-single-widget-detail">
			<h4 class="mhub-widget-title"><?php esc_html_e( 'Details', 'meetinghub' ); ?></h4>
			<div class="mhub-widget-inner">
				<dl>
					<dt><?php esc_html_e( 'Topic:', 'meetinghub' ); ?></dt>
					<dd><?php echo esc_html( the_title() ); ?></dd>
					<dt><?php esc_html_e( 'Hosted By:', 'meetinghub' ); ?></dt>
					<dd>
					<?php
						echo esc_html( $current_user_name );
					?>
					</dd>

					<dt><?php esc_html_e( 'Start Time:', 'meetinghub' ); ?></dt>
					<dd>
					<?php

					echo esc_html( gmdate( 'l, F j, Y g:i A', strtotime( $start_time ) ) );

					?>
					</dd>

					<dt><?php esc_html_e( 'Duration:', 'meetinghub' ); ?></dt>
					<dd>
						<?php
						if ( 60 <= $meeting_duration ) {
							$hours   = floor( $meeting_duration / 60 );
							$minutes = $meeting_duration % 60;

							printf(
								esc_html(
								/* translators: %s: Number of hours */
									_n(
										'%s hour',
										'%s hours',
										$hours,
										'meetinghub'
									)
								),
								esc_html( number_format_i18n( $hours ) )
							);
							echo ' ' . sprintf(
								esc_html(
								/* translators: %s: Number of hours */
									_n(
										'%s minute',
										'%s minutes',
										$minutes,
										'meetinghub'
									)
								),
								esc_html( number_format_i18n( $minutes ) )
							);
						} else {
							printf(
								esc_html(
								/* translators: %s: Number of hours */
									_n(
										'%s minute',
										'%s minutes',
										$meeting_duration,
										'meetinghub'
									)
								),
								esc_html( number_format_i18n( $meeting_duration ) )
							);
						}
						?>
					</dd>

					<dt><?php esc_html_e( 'Current Timezone:', 'meetinghub' ); ?></dt>
					<dd>
					<?php
						echo esc_html( $time_zone );
					?>
					</dd>
					
				</dl>
			</div>
		</div>

		<?php
		if ( $mhub_is_pro_active ) {
				require_once MHUB_PRO_INCLUDES . '/Templates/mhub-calander.php';
		}
		?>

		<div class="mhub-buy-btn-wpapper">
			<?php
			if ( ! empty( $product_id ) && 'yes' === $meeting_as_product && ! current_user_can( 'manage_options' ) ) {
				$product_link = get_permalink( $product_id );
				?>
				<a href="<?php echo esc_url( $product_link ); ?>" class="mhub-buy-button" target="__blank"> <?php esc_attr_e( 'Buy Now !', 'meetinghub' ); ?></a>
			
			<?php } ?>
		</div>
	</div>
</div>
