document.addEventListener("DOMContentLoaded", () => {
    const params = new URLSearchParams(window.location.search);
    const userID = params.get('user');

    const reportButton = document.querySelector('.report_profile');
    const modalOverlay = document.getElementById('modal_Overlay');

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

    // Check if user is already reported on page load
    async function checkReportedStatus() {
        try {
            // TEMPORARY: Using localStorage as dummy storage
            // REPLACE THIS ENTIRE SECTION when backend API is ready
            const reportedUsers = JSON.parse(localStorage.getItem('reportedUsers') || '[]');
            const isReported = reportedUsers.includes(userID);
            
            if (isReported) {
            addReportedBadge();
            }
            
            /* 
            // I will uncomment this and delete the localStorage code above
            const accessToken = getCookie("authToken");
            
            const headers = new Headers({
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
            });
            
            const graphql = JSON.stringify({
            query: `query CheckReportedUser {
                checkReportedUser(userid: "${userID}") {
                isReported
                }
            }`,
            });
            
            const requestOptions = {
            method: "POST",
            headers: headers,
            body: graphql,
            redirect: "follow",
            };
            
            const response = await fetch(GraphQL, requestOptions);
            const result = await response.json();
            
            if (result.data?.checkReportedUser?.isReported) {
            addReportedBadge();
            }
            */
        } catch (error) {
            console.error('Error checking reported status:', error);
        }
    }

    // Add reported badge to profile
    function addReportedBadge() {
        const profileInfo = document.querySelector('.profile_info');
        const slug = profileInfo.querySelector('.profile_no');
        
        // Check if already reported
        if (!document.querySelector('.reported_badge')) {
            const reportedBadge = document.createElement('span');
            reportedBadge.className = 'reported_badge';
            reportedBadge.textContent = 'Reported';
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
    async function submitReport(objekt) {

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
                reportUser(userid: "${objekt.user.id}") {
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
            
            const response = await fetch(GraphQL, requestOptions);
            const result = await response.json();
            
            if (result.data?.reportUser?.status === 'success' || result.data?.reportUser?.ResponseCode === 11012) {
                // TEMPORARY: Stored in localStorage (Will remove when backend API is ready)
                const reportedUsers = JSON.parse(localStorage.getItem('reportedUsers') || '[]');
                if (!reportedUsers.includes(userID)) {
                    reportedUsers.push(userID);
                    localStorage.setItem('reportedUsers', JSON.stringify(reportedUsers));
                }
                
                // Add "Reported" badge
                addReportedBadge();
                
                // Show success toast inside modal
                showModalToast('Profile reported successfully', 'success');
                
                // Close modal after toast is shown (give time to read the message)
                setTimeout(() => {
                    closeReportModal();
                }, 2000);
            } else {
            throw new Error(result.data?.reportUser?.ResponseMessage || 'Failed to report profile');
            }
        } catch (error) {
            // Show error toast inside modal
            showModalToast('User has already been reported by you!', 'error');
            confirmBtn.disabled = false;
            confirmBtn.textContent = 'Report';
        }
    }

    // Report button click event
    reportButton.addEventListener('click', showReportModal);

    // Check reported status on page load
    checkReportedStatus();

});