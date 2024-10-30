window.$ = window.$ || jQuery;

const MHubFrontend = {
    init() {
        this.bindEvents();
    },
    bindEvents() {
        $(document).on('click', '.mhub-meeting-status', this.handleMeetingStatusButtonClick);
    },
    handleMeetingStatusButtonClick() {
        const meetingId = $(this).data('meeting-id');
        const postId = $(this).data('post-id');
        const meetingStatus = $(this).data('meeting-status');
        MHubFrontend.sendMeetingStatusData(meetingId, postId, meetingStatus);
    },
    sendMeetingStatusData(meetingId, postId, meetingStatus) {
        if (meetingStatus === 'end') {
            // Display a confirmation alert
            if (confirm('Are you sure you want to end this meeting?')) {
                // If user confirms, proceed with AJAX request
                sendAjaxRequest();
            }
        } else {
            // If meeting status is not 'end', proceed with AJAX request directly
            sendAjaxRequest();
        }

        if (meetingStatus === 'start') {
            // Display a confirmation alert
            if (confirm('Are you sure you want to Start this meeting?')) {
                // If user confirms, proceed with AJAX request
                sendAjaxRequest();
            }
        } else {
            // If meeting status is not 'end', proceed with AJAX request directly
            sendAjaxRequest();
        }

        function sendAjaxRequest() {
            $.ajax({
                url: mhub_frontend_params.ajax_url,
                type: 'POST',
                data: {
                    action: 'mhub_meeting_action',
                    nonce: mhub_frontend_params.nonce,
                    meeting_id: meetingId,
                    post_id: postId,
                    meeting_status: meetingStatus
                },
                success: function (response) {
                    console.log(response);
                    // Reload the page upon successful response
                    if (response.success) {
                        location.reload();
                    }
                },
                error: function (xhr, status, error) {
                    console.error(xhr.responseText);
                }
            });
        }
    },
   
};

$(document).ready(function () {
    MHubFrontend.init();
});
