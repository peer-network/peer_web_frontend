document.addEventListener("DOMContentLoaded", async () => {
  
  // Function to format large numbers (e.g., 300000 -> 300K)
  function formatNumber(num) {
    if (num == null || isNaN(num)) return '0';
    if (num >= 1000000) return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
    return num.toString();
  }


  // Function to format date
  function formatDate(dateInput) {
    let date;
    
    if (typeof dateInput === 'string') {
        const cleaned = dateInput.replace(/\.\d+$/, '') + 'Z';
        date = new Date(cleaned);
    } else {
        date = new Date(parseInt(dateInput));
    }
    
    const day = date.getDate();
    const month = date.toLocaleString('en-US', { month: 'short' });
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  }

  function formatTime(dateInput) {
    let date;

    if (typeof dateInput === 'string') {
        const cleaned = dateInput.replace(/\.\d+$/, '') + 'Z';
        date = new Date(cleaned);
    } else {
        date = new Date(parseInt(dateInput));
    }

    return date.toTimeString().split(' ')[0].replace(/:/g, ' : ');
  }

  function isActive(timeframeEnd) {
    const cleaned = timeframeEnd.replace(/\.\d+$/, '') + 'Z';
    const now = new Date();
    const endTime = new Date(cleaned);
    return now < endTime;
  }

  // Function to create ad listing HTML
  function createAdListing(ad) {
    const active = isActive(ad.timeframeEnd);
    const statusClass = active ? 'active' : 'ended';
    const statusText = active ? 'Active' : 'Ended';
    const startDate = formatDate(ad.timeframeStart);
    const endDate = formatDate(ad.timeframeEnd);
    const startTime = formatTime(ad.timeframeStart);
    const endTime = formatTime(ad.timeframeEnd);

    const userId = ad.user?.id || ad.user?.userid;
    const userimg = ad.user?.img ? tempMedia(ad.user.img.replace("media/", "")) : "svg/noname.svg";
    const postTitle = ad.post?.title || `Advertisement #${ad.id}`;
    const isPinned = ad.type === 'PINNED';
    const postDescription = ad.post?.mediadescription || '.....';
    const listItem = document.createElement('div');
    listItem.className = `myAds_list_item ${statusClass}${isPinned ? ' PINNED' : ''}`;
    listItem.innerHTML = `
      <div class="ad_main_info">
        <div class="ad_info">
            <div class="ad_avatar">
            <img src="${userimg}" alt="User ${userId || ''}" class="user_avatar" />
            ${isPinned ? `<div class="pin_badge"><img src="svg/pin.svg" alt="pin"/></div>` : ''}
            </div>
            <div class="ad_details">
            <h3 class="ad_title">${postTitle}</h3>
            <p class="ad_description">${postDescription}</p>
            </div>
        </div>
        <div class="ad_timeframe_box">
            <div><span class="ad_timeframe">${startDate}</span><span class="ad_timer"> ${startTime}</span></div>
            <hr></hr>
            <div><span class="ad_timeframe">${endDate}</span><span class="ad_timer"> ${endTime}</span></div>
        </div>
        <div class="ad_status">
            <span class="status_badge ${statusClass}">
            <span class="status_dot"></span>
            ${statusText}
            </span>
            <div class="ad_timer_count none">${active ? '' : '00 : 00 : 00'}</div>
        </div>
      </div>

      <!-- Dropdown section -->
      <div class="ad_dropdown">
        <div class="ad_dropdown_content">
            <div id="myAds_header_dropdown" class="myAds_header">
                <div class="myAds_earnings">
                    <h1>Earnings</h1>
                    <div class="earnings_box header_box">
                        <p>Gems</p>
                        <div class="ads_gems_count">
                            <img src="svg/peer-icon-gems.svg" alt="">
                            <span id="myAdsGemsEarnedDropdown" class="bold xxl_font_size">0</span>
                        </div>
                    </div>
                </div>
                <div class="myAds_interactions">
                    <h1>Interactions</h1>
                    <div class="interactions_box header_box">
                        <div class="likes">
                        <i class="peer-icon peer-icon-like"></i>
                        <p>Likes</p>
                        <span id="myAdsLikesDropdown" class="bold xxl_font_size">0</span>
                        </div>
                        <div class="vr"></div>
                        <div class="dislikes">
                        <i class="peer-icon peer-icon-dislike"></i>
                        <p>Dislikes</p>
                        <span id="myAdsDislikesDropdown" class="bold xxl_font_size">0</span>
                        </div>
                        <div class="vr"></div>
                        <div class="comments">
                        <i class="peer-icon peer-icon-comment-alt"></i>
                        <p>Comments</p>
                        <span id="myAdsCommentsDropdown" class="bold xxl_font_size">0</span>
                        </div>
                        <div class="vr"></div>
                        <div class="views">
                        <i class="peer-icon peer-icon-eye-open"></i>
                        <p>Views</p>
                        <span id="myAdsViewsDropdown" class="bold xxl_font_size">0</span>
                        </div>
                        <div class="vr"></div>
                        <div class="reports">
                        <i class="peer-icon peer-icon-warning"></i>
                        <p>Reports</p>
                        <span id="myAdsReportsDropdown" class="bold xxl_font_size">0</span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="myAds_main">
                <h1>Campaign details</h1>
                <div class="campaign_details">
                    <div class="detail_item">
                        <span class="detail_title">Start date</span>
                        <span class="detail_value">${startDate} <em> ${startTime} </em> </span>
                    </div>
                    <div class="detail_item">
                        <span class="detail_title">Start date</span>
                        <span class="detail_value">${endDate} <em> ${endTime} </em> </span>
                    </div>
                    <div class="detail_item">
                        <span class="detail_title">Total ad cost</span>
                        <div class="ads_tokens_count">
                            <span id="myAdsTokensSpentDropdown" class="bold xxl_font_size">0</span>
                            <img src="svg/logo_sw.svg" alt="">
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>
    `;

    listItem.querySelector('#myAdsLikesDropdown').textContent = formatNumber(ad.amountLikes);
    listItem.querySelector('#myAdsDislikesDropdown').textContent = formatNumber(ad.amountDislikes);
    listItem.querySelector('#myAdsCommentsDropdown').textContent = formatNumber(ad.amountComments);
    listItem.querySelector('#myAdsViewsDropdown').textContent = formatNumber(ad.amountViews);
    listItem.querySelector('#myAdsReportsDropdown').textContent = formatNumber(ad.amountReports);
    listItem.querySelector('#myAdsTokensSpentDropdown').textContent = ad.totalTokenCost;
    listItem.querySelector('#myAdsGemsEarnedDropdown').textContent = formatNumber(ad.gemsEarned);


    const imgElement = listItem.querySelector("img");
    imgElement.onerror = () => {
      imgElement.src = "svg/noname.svg";
    };

    listItem.addEventListener("click", () => {
      const adDropdown = listItem.querySelector('.ad_dropdown');
      const timerEl = listItem.querySelector('.ad_timer_count');
      const adFrameBox = listItem.querySelector('.ad_timeframe_box');
      adDropdown.classList.toggle('open');
        if (adDropdown.classList.contains('open')) {
            timerEl.classList.remove("none");
            timerEl.classList.add("show");
            adFrameBox.classList.add("hidden");
        } else {
            timerEl.classList.remove("show");
            timerEl.classList.add("none");
            adFrameBox.classList.remove("hidden");
        }
    });

    // --- Countdown logic ---
      const timerEl = listItem.querySelector('.ad_timer_count');
      if (!timerEl) return;

      const cleanedEnd = ad.timeframeEnd.replace(/\.\d+$/, '') + 'Z';
      const endTimer = new Date(cleanedEnd).getTime();
      let timerInterval; 

      const updateTimer = () => {
        const now = new Date().getTime();
        const remaining = endTimer - now;

        if (active) {
            timerEl.classList.add('active');
        }

        if (remaining <= 0) {
          clearInterval(timerInterval);
          timerEl.textContent = '00 : 00 : 00';
          timerEl.classList.remove('warning');
          timerEl.classList.remove('active');
          timerEl.classList.add('ended');
          listItem.classList.remove('active');
          listItem.classList.add('ended');
          return;
        }

        if (remaining <= 60 * 60 * 1000) {
            timerEl.classList.remove('active');
            timerEl.classList.add('warning');
        } 

        const hours = Math.floor((remaining / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((remaining / (1000 * 60)) % 60);
        const seconds = Math.floor((remaining / 1000) % 60);

        const formatted = `${String(hours).padStart(2, '0')} : ${String(minutes).padStart(2, '0')} : ${String(seconds).padStart(2, '0')}`;
        timerEl.textContent = formatted;

      };

      updateTimer();
      timerInterval = setInterval(updateTimer, 1000);

    return listItem;
  }

  async function loadAdvertisementHistory() {
    const accessToken = getCookie("authToken");

    const headers = new Headers({
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    });

    const graphql = JSON.stringify({
      query: `query AdvertisementHistory {
        advertisementHistory(offset: 0, limit: 20) {
          status
          ResponseCode
          affectedRows {
            stats {
              tokenSpent
              euroSpent
              amountAds
              gemsEarned
              amountLikes
              amountViews
              amountComments
              amountDislikes
              amountReports
            }
            advertisements {
              id
              createdAt
              type
              timeframeStart
              timeframeEnd
              totalTokenCost
              totalEuroCost
              gemsEarned
              amountLikes
              amountViews
              amountComments
              amountDislikes
              amountReports
              post {
                id
                contenttype
                title
                mediadescription
              }
              user {
                id
                img
              }
            }
          }
        }
      }`,
    });

    const requestOptions = {
      method: "POST",
      headers: headers,
      body: graphql,
      redirect: "follow",
    };

    try {
      const response = await fetch(GraphGL, requestOptions);
      const result = await response.json();

      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      if (result.errors) throw new Error(result.errors[0].message);

      if (result.data && result.data.advertisementHistory) {
        const stats = result.data.advertisementHistory.affectedRows.stats;

        document.getElementById('myAdsGemsEarned').textContent = formatNumber(stats.gemsEarned);
        document.getElementById('myAdsTokensSpent').textContent = formatNumber(stats.tokenSpent);
        document.getElementById('myAdsLikes').textContent = formatNumber(stats.amountLikes);
        document.getElementById('myAdsDislikes').textContent = formatNumber(stats.amountDislikes);
        document.getElementById('myAdsComments').textContent = formatNumber(stats.amountComments);
        document.getElementById('myAdsViews').textContent = formatNumber(stats.amountViews);
        document.getElementById('myAdsReports').textContent = formatNumber(stats.amountReports);
        document.getElementById('myAdsTotalCount').textContent = stats.amountAds;

        const advertisements = result.data.advertisementHistory.affectedRows.advertisements;
        const myAdsListsContainer = document.querySelector('.myAds_lists');
        
        if (advertisements && advertisements.length > 0) {
          myAdsListsContainer.innerHTML = '';
          
          advertisements.forEach(ad => {
            const adElement = createAdListing(ad);
            myAdsListsContainer.appendChild(adElement);
          });
        } else {
          myAdsListsContainer.innerHTML = '<p class="no_ads">No advertisements found.</p>';
        }
      }
    } catch (error) {
      console.error('Error fetching advertisement history:', error);
    }
  }

  await loadAdvertisementHistory();

});