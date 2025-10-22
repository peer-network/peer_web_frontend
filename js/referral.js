"use strict"

/*------------ Start : Referral Page js -------------*/
document.addEventListener('DOMContentLoaded', () => {

  /**
   * Detect environment and set baseUrl accordingly
   */
  const baseUrl = `${window.location.protocol}//${window.location.host}/`;

  /**
   * Fetch referral link from GraphQL API
   */
  async function fetchReferralLink() {
    const linkElement = document.getElementById('referralLink');
    const accessToken = getCookie("authToken");

    const headers = new Headers({
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
    });

    const graphql = JSON.stringify({
        query: `query GetReferralInfo {
            getReferralInfo {
                status
                ResponseCode
                referralUuid
                referralLink
            }
        }`,
    });

    const requestOptions = {
        method: "POST",
        headers: headers,
        body: graphql
    };
    
    try {
        const response = await fetch(GraphGL, requestOptions);
        const result = await response.json();

        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

        if (result.errors) {
            throw new Error(result.errors[0].message);
        }

        const referralInfo = result?.data?.getReferralInfo || null;
        
        if (referralInfo && referralInfo.status === 'success' && referralInfo.referralLink) {
          if (linkElement) {
            const finalLink = referralInfo.referralLink.replace(/^(https?:\/\/)[^/]+\//, baseUrl);
            linkElement.textContent = finalLink;
          }
        } else {
          if (linkElement) {
            linkElement.textContent = 'Failed to load referral link';
          }
        }
    } catch (error) {
        console.error('Error fetching referral link:', error);
        linkElement.textContent = 'Error loading link';
    }

  }

  /**
   * Copy referral link to clipboard
   */
  function copyReferralLink() {
    const linkText = document.getElementById('referralLink').textContent;
    const toast = document.getElementById('toast');
    
    if (linkText === 'Loading...' || linkText.includes('Error') || linkText.includes('Failed')) {
        return;
    }
    
    // Copy to clipboard using modern API
    navigator.clipboard.writeText(linkText)
      .then(() => {
          showToast(toast);
      })
      .catch(err => {
          console.error('Failed to copy:', err);
      });
  }

  /**
   * Show toast notification
   */
  function showToast(toast) {
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
  }
  const container = document.querySelector('.referral_link_container');
  if (container) container.addEventListener('click', copyReferralLink);

  /**
   * Referral data and async fetch function
   */

  let currentTab = 'invited';
  let referralData = {
      invitedBy: [],
      iInvited: []
  };


  async function fetchReferralList() {
    const accessToken = getCookie("authToken");

    const headers = new Headers({
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
    });

    const graphql = JSON.stringify({
        query: `query ReferralList {
            referralList(offset: 0, limit: 20) {
                status
                counter
                ResponseCode
                affectedRows {
                    invitedBy {
                        id
                        username
                        slug
                        img
                    }
                    iInvited {
                        id
                        username
                        slug
                        img
                    }
                }
            }
        }`,
    });

    const requestOptions = {
        method: "POST",
        headers: headers,
        body: graphql
    };

    try {
      const response = await fetch(GraphGL, requestOptions);
      const result = await response.json();

      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

      if (result.errors) {
          throw new Error(result.errors[0].message);
      }

      const referralList = result?.data?.referralList;

      if (referralList && referralList.status === 'success') {
        const affectedRows = referralList.affectedRows || {};
        const responseCode = String(referralList.ResponseCode);
        
        const isEmptyResponse = responseCode.startsWith('2');
        
        if (isEmptyResponse) {
            referralData.invitedBy = [];
        } else if (Array.isArray(affectedRows.invitedBy)) {
            referralData.invitedBy = affectedRows.invitedBy;
        } else if (affectedRows.invitedBy) {
            referralData.invitedBy = [affectedRows.invitedBy];
        } else {
            referralData.invitedBy = [];
        }
        
        if (isEmptyResponse) {
            referralData.iInvited = [];
        } else if (Array.isArray(affectedRows.iInvited)) {
            referralData.iInvited = affectedRows.iInvited;
        } else if (affectedRows.iInvited) {
            referralData.iInvited = [affectedRows.iInvited];
        } else {
            referralData.iInvited = [];
        }
        // updateCounts();
        renderTab(currentTab);
      } else {
        throw new Error('Failed to load referral data');
      }
    } catch (error) {
      console.error('Error fetching referral list:', error);
      showError(currentTab);
    }
  }

  /**
   * Update tab counts
   */
  // function updateCounts() {
  //   document.getElementById('invitedCount').textContent = referralData.iInvited.length;
  //   document.getElementById('inviterCount').textContent = referralData.invitedBy.length;
  // }

  /**
   * Switch between tabs
   */
  function switchTab(tab) {
    currentTab = tab;

    // Update tab buttons
    const tabsContainer = document.querySelector('.referral_tabs');
    tabsContainer.setAttribute('data-active', tab);

    const tabs = document.querySelectorAll('.referral_tab');
    tabs.forEach(t => {
      if (t.dataset.tab === tab) {
        t.classList.add('active');
      } else {
        t.classList.remove('active');
      }
    });

    // Update content visibility
    const lists = document.querySelectorAll('.referral_list');
    lists.forEach(list => {
      list.classList.remove('active');

      const usersGrid = list.querySelector('.users_grid');
      if (usersGrid) {
        usersGrid.innerHTML = '';
        usersGrid.classList.add('none');
      }
      
      const loading = list.querySelector('.loading_state');
      const empty = list.querySelector('.empty_state');
      if (loading) loading.classList.add('none');
      if (empty) empty.classList.add('none');

    });

    const activeList = document.getElementById(`${tab}List`);
    if (activeList) {
        activeList.classList.add('active');
    }

    // Render the selected tab
    renderTab(tab);
  }

  /**
   * Render tab content
   */
  function renderTab(tab) {
    const loadingEl = document.getElementById(`${tab}Loading`);
    const emptyEl = document.getElementById(`${tab}Empty`);
    const usersEl = document.getElementById(`${tab}Users`);

    // Show loading first
    if (loadingEl) loadingEl.classList.remove('none');
    if (emptyEl) emptyEl.classList.add('none');
    if (usersEl) usersEl.classList.add('none');

    // Get data based on tab
    const users = tab === 'invited' ? referralData.iInvited : referralData.invitedBy;

    // Small delay to show loading state, then hide it and show content
    setTimeout(() => {
        if (loadingEl) loadingEl.classList.add('none');

        // Show empty state or users
        if (users.length === 0) {
            if (emptyEl) emptyEl.classList.remove('none');
            if (usersEl) usersEl.classList.add('none');
        } else {
            if (emptyEl) emptyEl.classList.add('none');
            if (usersEl) usersEl.classList.remove('none');
            renderUsers(users, usersEl);
        }
    }, 300); // 300ms loading display
  }

  document.querySelectorAll('.referral_tab').forEach(tab => {
    tab.addEventListener('click', () => {
      switchTab(tab.dataset.tab);
    });
  });


  /**
   * Render users grid
   */
  function renderUsers(users, container) {
    container.innerHTML = '';

    users.forEach(user => {
      const userCard = createUserCard(user);
      container.appendChild(userCard);
    });
  }

  /** Create user card element
   */
  function createUserCard(user) {
    const userId = user.id || user.userid;
    const userimg = user.img ? tempMedia(user.img.replace("media/", "")) : "svg/noname.svg";

    const card = document.createElement('div');
    card.className = 'user_card button';
    
    card.innerHTML = `
      <div class="ref_user_info">
        <img src="${userimg}" alt="${user.username || 'User'}" class="user_avatar" />
        <div class="user_info">
          <span class="user_name">${user.username || 'Unknown'}</span>
          <span class="user_slug">#${user.slug || 'unknown'}</span>
        </div>
      </div>
    `;

    const imgElement = card.querySelector("img");
    imgElement.onerror = () => {
      imgElement.src = "svg/noname.svg";
    };

    card.addEventListener("click", () => {
      window.location.href = `view-profile.php?user=${userId}`;
    });

    return card;
  }

  /**
   * Show error state
   */
  function showError(tab) {
    const loadingEl = document.getElementById(`${tab}Loading`);
    const emptyEl = document.getElementById(`${tab}Empty`);
    const usersEl = document.getElementById(`${tab}Users`);

    loadingEl.classList.add('none');
    usersEl.classList.add('none');

    // Update empty state to show error
    emptyEl.classList.remove('none');
    emptyEl.textContent = 'Failed to load data';
    emptyEl.textContent = 'Please try again later';
  }

  fetchReferralLink();
  fetchReferralList();
});