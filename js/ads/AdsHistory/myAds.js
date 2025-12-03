document.addEventListener("DOMContentLoaded", async () => {
  const params = new URLSearchParams(window.location.search);
  const targetPostId = params.get("postid");
  const visibilityStatus = params.get("postvisibility");

  let limit = 20; 
  let offset = 0;
  let isLoading = false;
  let hasMore = true;

  function addHiddenBadge(listItem) {
    const timeFrame = listItem.querySelector('.ad_timeframe_box');
    
    const hiddenBadge = document.createElement('div');
    hiddenBadge.classList.add('ad_hidden_badge', 'small_font_size');
    hiddenBadge.innerHTML = '<i class="peer-icon peer-icon-eye-close"></i><span class="ads_hidden_texts none"> This post is shown as sensitive content</span>';
    
    // Insert badge after ad_info
    timeFrame.parentNode.insertBefore(hiddenBadge, timeFrame.nextSibling);
  }
  
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

  // Function to get the appropriate post image based on content type
  function getPostImage(post) {
    if (!post) return "";
    
    const contentType = post.contenttype?.toUpperCase();

    if (contentType === 'IMAGE' || contentType === 'VIDEO' || contentType === 'AUDIO') {
      if (post.cover) {
        try {
          const coverArray = JSON.parse(post.cover);
          const coverPath = coverArray?.[0]?.path?.replace(/\\\//g, '/'); 
          if (coverPath) {
           
            return tempMedia(coverPath);
          }
        } catch (e) {
          console.error("Error parsing post cover:", e);
        }
      }

      if (contentType === "AUDIO") {
        return "/img/audio-bg.png";
      }
      
      if (post.media) {
        try {
          const mediaArray = JSON.parse(post.media);
          const mediaPath = mediaArray?.[0]?.path?.replace(/\\\//g, '/'); 
          if (mediaPath) {
            return  tempMedia(mediaPath)
          }
        } catch (e) {
          console.error("Error parsing post media:", e);
        }
      }
    }

    // For TEXT - return blank
    return "";
  }

  // Function to get content type icon class
  function getContentTypeIcon(contentType) {
    if (!contentType) return "";
    
    const type = contentType.toUpperCase();
    
    switch(type) {
      case 'TEXT':
        return 'peer-icon-text';
      case 'IMAGE':
        return 'peer-icon-camera';
      case 'VIDEO':
        return 'peer-icon-play-btn';
      case 'AUDIO':
        return 'peer-icon-audio';
      default:
        return '';
    }
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

      const postImage = getPostImage(ad.post);
      const contentTypeIcon = getContentTypeIcon(ad.post?.contenttype);
      const postTitle = (ad.post && ad.post.title && ad.post.title.trim()) || `Advertisement #${ad.id}`;
      const isPinned = ad.type === 'PINNED';
      const postDescription = (ad.post && ad.post.mediadescription && ad.post.mediadescription.trim()) || '....';
      const isTextPost = ad.post?.contenttype?.toUpperCase() === 'TEXT';
      
      const listItem = document.createElement('div');
      listItem.className = `myAds_list_item ${statusClass}${isPinned ? ' PINNED' : ''}`;
      
      /*-- handling post visibility (for testing via URL parameters)----*/
      // Check if this specific post matches the targetPostId from URL
      if (targetPostId && ad.post?.id && targetPostId === String(ad.post.id)) {
        if(visibilityStatus === 'ILLEGAL' || visibilityStatus === 'illegal'){
          listItem.classList.add("illegal_ads_post");
        } else if(visibilityStatus === 'HIDDEN' || visibilityStatus === 'hidden'){
          listItem.classList.add("hidden_ads_post");
        }
      }
      /*-- End : handling post visibility----*/
      
      listItem.innerHTML = `
        <div class="ad_main_info">
          <div class="ad_info">
              <div class="ad_avatar">
                ${isTextPost ? `
                  <div class="post_image_placeholder"></div>
                  <i class="peer-icon ${contentTypeIcon}"></i>
                ` : `
                  <img src="${postImage}" alt="Post image" class="post_image" />
                  ${contentTypeIcon ? `<i class="peer-icon ${contentTypeIcon}"></i>` : ''}
                `}
                ${isPinned ? `<div class="pin_badge"><img src="svg/pin.svg" alt="pin"/></div>` : ''}
              </div>
              <div class="ad_details">
              <h3 class="ad_tiitle">${postTitle}</h3>
              <p class="ad_deescription">${postDescription}</p>
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
                      <h2 class="xxl_font_size">Earnings</h2>
                      <div class="earnings_box header_box">
                          <p>Gems</p>
                          <div class="ads_gems_count">
                              <img src="svg/peer-icon-gems.svg" alt="">
                              <span id="myAdsGemsEarnedDropdown" class="bold xxl_font_size">0</span>
                          </div>
                      </div>
                  </div>
                  <div class="myAds_interactions">
                      <h2 class="xxl_font_size">Interactions</h2>
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
                  <h2 class="xxl_font_size">Campaign details</h2>
                  <div class="campaign_details">
                      <div class="detail_item">
                          <span class="detail_title">Start date</span>
                          <span class="detail_value">${startDate} <em> ${startTime} </em> </span>
                      </div>
                      <div class="detail_item">
                          <span class="detail_title">End date</span>
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

      // Add hidden badge if this post matches the targetPostId and status is HIDDEN
      if (targetPostId && ad.post?.id && targetPostId === String(ad.post.id)) {
        if(visibilityStatus === 'ILLEGAL' || visibilityStatus === 'illegal'){
          const adInfo = listItem.querySelector('.ad_info'); 
          
          if (adInfo) { 
            const illegalAdsPostHTML = `
            <div class="illegal_adsPost_frame xl_font_size">
              <div class="illegal_content">
                <div class="icon_illegal"><i class="peer-icon peer-icon-illegal xxl_font_size"></i></div>
                <div class="illegal_title_description">
                  <div class="illegal_title">Removed as illegal</div>
                  <div class="illegal_description"></div>
                </div>
              </div>
            </div>`;
            adInfo.insertAdjacentHTML("afterbegin", illegalAdsPostHTML);
            listItem.classList.add("illegal_ads_post");
          }
        } else if(visibilityStatus === 'HIDDEN' || visibilityStatus === 'hidden'){
          addHiddenBadge(listItem);
        }
      }

      listItem.addEventListener("click", () => {
        const adDropdown = listItem.querySelector('.ad_dropdown');
        const adFrameBox = listItem.querySelector('.ad_timeframe_box');
        adDropdown.classList.toggle('open');
          if (adDropdown.classList.contains('open')) {
              adFrameBox.classList.add("hidden");
          } else {
              adFrameBox.classList.remove("hidden");
          }
      });

      return listItem;
    }

  function showContent() {
    const mainContainer = document.querySelector('.site-main-myAds');
    mainContainer.classList.add('loaded');
    
    const listItems = document.querySelectorAll('.myAds_list_item:not(.loaded)');
    listItems.forEach((item, index) => {
      setTimeout(() => {
        item.classList.add('loaded');
      }, index * 100);
    });
  }

  async function loadAdvertisementHistory(isLoadMore = false) {
    if (isLoading || !hasMore) return;
    
    isLoading = true;
    
    // Show loading indicator if it exists
    const loadingIndicator = document.getElementById('loadingIndicator');
    if (loadingIndicator) {
      loadingIndicator.style.display = 'block';
    }
    
    const accessToken = getCookie("authToken");
    const payload = JSON.parse(atob(accessToken.split('.')[1]));
    const userId = payload.uid;

    const headers = new Headers({
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    });

    const graphql = JSON.stringify({
      query: `query AdvertisementHistory {
        advertisementHistory(filter: { userId: "${userId}" }, limit: ${limit}, offset: ${offset}, sort: NEWEST) {
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
                media
                cover
                mediadescription
                visibilityStatus
                isHiddenForUsers
                hasActiveReports
                isreported
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
        const advertisements = result.data.advertisementHistory.affectedRows.advertisements;
        const myADs = document.querySelector('.site-main-myAds');
        
        if (advertisements && advertisements.length > 0) {
          if (!isLoadMore) {
            document.getElementById('myAdsGemsEarned').textContent = formatNumber(stats.gemsEarned);
            document.getElementById('myAdsTokensSpent').textContent = formatNumber(stats.tokenSpent);
            document.getElementById('myAdsLikes').textContent = formatNumber(stats.amountLikes);
            document.getElementById('myAdsDislikes').textContent = formatNumber(stats.amountDislikes);
            document.getElementById('myAdsComments').textContent = formatNumber(stats.amountComments);
            document.getElementById('myAdsViews').textContent = formatNumber(stats.amountViews);
            document.getElementById('myAdsReports').textContent = formatNumber(stats.amountReports);
            document.getElementById('myAdsTotalCount').textContent = stats.amountAds;
          }

          const myAdsListsContainer = document.querySelector('.myAds_lists');
          
          // Get references to sentinel and loading indicator (if they exist)
          const sentinel = document.getElementById('sentinel');
          const loadingIndicator = document.getElementById('loadingIndicator');
          
          advertisements.sort((a, b) => {
            const aActive = isActive(a.timeframeEnd);
            const bActive = isActive(b.timeframeEnd);
            
            if (aActive && !bActive) return -1;
            if (!aActive && bActive) return 1;
            
            return 0;
          });
          
          advertisements.forEach(ad => {
            const adElement = createAdListing(ad);
            const adActive = isActive(ad.timeframeEnd);
            
            if (adActive) {
              const existingAds = Array.from(myAdsListsContainer.querySelectorAll('.myAds_list_item'));
              const firstEndedIndex = existingAds.findIndex(item => item.classList.contains('ended'));
              
              if (firstEndedIndex !== -1) {
                myAdsListsContainer.insertBefore(adElement, existingAds[firstEndedIndex]);
              } else if (sentinel) {
                myAdsListsContainer.insertBefore(adElement, sentinel);
              } else {
                myAdsListsContainer.appendChild(adElement);
              }
            } else {
              if (sentinel) {
                myAdsListsContainer.insertBefore(adElement, sentinel);
              } else {
                myAdsListsContainer.appendChild(adElement);
              }
            }
          });

          offset += advertisements.length;
          
          if (advertisements.length < limit || offset >= stats.amountAds) {
            hasMore = false;
            if (sentinel) {
              sentinel.remove();
            }
            if (loadingIndicator) {
              loadingIndicator.remove();
            }
          }

          showContent();
          
          if (!isLoadMore && hasMore && !document.getElementById('sentinel')) {
            const sentinel = document.createElement('div');
            sentinel.id = 'sentinel';
            sentinel.style.height = '1px';
            sentinel.style.marginTop = '20px';
            myAdsListsContainer.appendChild(sentinel); 
            
            const loadingDiv = document.createElement('div');
            loadingDiv.id = 'loadingIndicator';
            loadingDiv.style.textAlign = 'center';
            loadingDiv.style.padding = '20px';
            loadingDiv.style.display = 'none';
            loadingDiv.innerHTML = '<p>Loading more ads...</p>';
            myAdsListsContainer.appendChild(loadingDiv); 
            
            setupIntersectionObserver();
          }
        } else if (!isLoadMore) {
          myADs.innerHTML = `
            <h1 class="myAds_h1">My Ads</h1>
            <div class="myAds_main">
              <h1 class="myAds_h1">All advertisements</h1>
              <div class="myAds_lists">
                <div class="empty_state_container">
                    <p class="empty_state_message">You haven't promoted any posts yet. Start your first promotion to see statistics</p>
                    <a href="profile.php" class="button btn-white">Take me to my posts</a>
                </div>
              </div>
            </div>
          `;
          
          myADs.classList.add('loaded');
          hasMore = false;
        }
      }
    } catch (error) {
      console.error('Error fetching advertisement history:', error);
    } finally {
      isLoading = false;
      
      const loadingIndicator = document.getElementById('loadingIndicator');
      if (loadingIndicator) {
        loadingIndicator.style.display = 'none';
      }
    }
  }

  function setupIntersectionObserver() {
    const sentinel = document.getElementById('sentinel');
    const myAdsListsContainer = document.querySelector('.myAds_lists');
    
    if (!sentinel || !myAdsListsContainer) return;
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !isLoading && hasMore) {
          loadAdvertisementHistory(true);
        }
      });
    }, {
      root: myAdsListsContainer, 
      rootMargin: '100px', 
      threshold: 0 
    });
    
    observer.observe(sentinel);
  }

  await loadAdvertisementHistory();

});