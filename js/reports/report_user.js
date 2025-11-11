document.addEventListener("DOMContentLoaded", () => {

    const reportButton = document.querySelector('.report_profile');
    const modalOverlay = document.getElementById('modal_Overlay');
    const button = document.querySelector('.moreActions_container');
    const dropdown = document.querySelector('.moreActions_wrapper');

    // Toast notification function (for modal)
    function showModalToast(message, type = 'success') {
        if (!modalOverlay) return;
        
        // Remove any existing toast
        const existingToast = modalOverlay.querySelector('.toast-notification');
        if (existingToast) {
            existingToast.remove();
        }
        
        // Create toast element
        const toast = document.createElement('div');
        toast.className = `toast-notification toast-${type}`;
        toast.textContent = message;
        
        // Add to modal content (at the top)
        modalOverlay.insertBefore(toast, modalOverlay.firstChild);
        
        // Trigger slide-in animation
        setTimeout(() => {
            toast.classList.add('show');
        }, 10);
        
        // Auto-hide after 3 seconds
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
            toast.remove();
            }, 300);
        }, 3000);
    }

    // Add reported badge to profile
    function addReportedBadge() {
        const profileInfo = document.querySelector('.profile_info');
        const slug = profileInfo.querySelector('.profile_no');
        
        // Check if already reported
        if (!document.querySelector('.reported_badge')) {
            const reportedBadge = document.createElement('span');
            reportedBadge.className = 'reported_badge';
            reportedBadge.innerHTML = '<i class="peer-icon peer-icon-flag-fill"></i> Reported';
            
            slug.parentNode.insertBefore(reportedBadge, slug.nextSibling);
        }
    }

    // Create and show report modal
    function showReportModal() {
        // Get profile data
        const username = document.getElementById('username2').textContent.trim();
        const slug = document.getElementById('slug2').textContent.trim();
        const profilePic = document.getElementById('profilbild2').src;
        
        // Create modal HTML
        const modalHTML = `
            <div class="report_modal_content">
                <div class="report_user_info">
                <img src="${profilePic}" alt="Profile Picture" class="report_profile_pic">
                <div class="report_user_details">
                    <div class="report_username bold">${username}</div>
                    <div class="report_slug">${slug}</div>
                </div>
                </div>
                <p class="report_message bold">Are you sure you want to report this user?</p>
                <div class="report_actions">
                <button class="button btn-transparent btn-cancel" id="cancelReport">Cancel</button>
                <button class="button btn-blue btn-report" id="confirmReport">Report</button>
                </div>
            </div>
        `;
        
        // Add modal to overlay
        modalOverlay.innerHTML = modalHTML;
        modalOverlay.classList.remove('none');

        button.setAttribute('aria-expanded', 'false');
        dropdown.classList.remove('open');
        dropdown.setAttribute('hidden', '');
        
        // Add event listeners to modal buttons
        document.getElementById('cancelReport').addEventListener('click', closeReportModal);
        document.getElementById('confirmReport').addEventListener('click', submitReport);
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) {
            closeReportModal();
            }
        });
    }

    // Close report modal
    function closeReportModal() {
        modalOverlay.classList.add('none');
        modalOverlay.innerHTML = '';
    }

    // Submit report via API
    async function submitReport() {

        const confirmBtn = document.getElementById('confirmReport');
        confirmBtn.disabled = true;
        confirmBtn.textContent = 'Reporting...';
        
        try {
            const accessToken = getCookie("authToken");
            
            const headers = new Headers({
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
            });
            
            const graphql = JSON.stringify({
            query: `mutation ReportUser {
                reportUser(userid: "${userID}") {
                status
                RequestId
                ResponseCode
                ResponseMessage
                }
            }`,
            });
            
            const requestOptions = {
            method: "POST",
            headers: headers,
            body: graphql,
            redirect: "follow",
            };
            
            const response = await fetch(GraphGL, requestOptions);
            const result = await response.json();
            
            if (result.data?.reportUser?.status === 'success' || result.data?.reportUser?.ResponseCode === 11012) {
                const successMessage = result.data.reportUser.ResponseMessage || 'Profile reported successfully';
                showModalToast(successMessage, 'success');

                const viewProfile = document.querySelector('.view-profile');
                if (viewProfile) {
                    viewProfile.classList.add('REPORTED_PROFILE');
                }
                
                // Close modal after toast is shown (give time to read the message)
                setTimeout(() => {
                    closeReportModal();
                }, 2000);
                
                addReportedBadge();
            } else {
            throw new Error(result.data?.reportUser?.ResponseMessage || 'Failed to report profile');
            }
        } catch (error) {
            const errorMessage = error.message || 'Failed to report profile. Please try again.';
            showModalToast(errorMessage, 'error');
            confirmBtn.disabled = false;
            confirmBtn.textContent = 'Report';
        }
    }

    // Report button click event
    reportButton.addEventListener('click', showReportModal);

});