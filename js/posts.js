  const post = 2;
  const like = 0;
  const dislike = 3;
  const comment = 1;

  //
  let isFetchAd = true;

  /*-- End : handling profile visibility----*/

  //   async function getPosts(offset, limit, filterBy, title = "", tag = null, sortby = "NEWEST", userID = null) {

  //     const accessToken = getCookie("authToken");

  //     // LocalStorage -> userData :: setting in getUserInfo() -> global.js
  //    const savedUserData = localStorage.getItem("userData");
  //    let severityLevel = null;

  //    if (savedUserData) {
  //      const parsedData = JSON.parse(savedUserData);
  //      severityLevel = parsedData.userPreferences?.contentFilteringSeverityLevel || null;
  //    }

  //     // Create headers
  //     const headers = new Headers({
  //       "Content-Type": "application/json",
  //       Authorization: `Bearer ${accessToken}`,
  //     });
  //     if (typeof title === "string") {
  //       title = sanitizeString(title);
  //     } else {
  //       title = "";
  //     }
  //     // tag = sanitizeString(tag);
  //     // tag = typeof tag === "string" ? sanitizeString(tag) : "";
  //     if (!sortby) sortby = "NEWEST";
  //     let postsList = `query ListPosts {
  //       listPosts(
  //         sortBy: ${sortby},
  //         limit: ${limit},
  //         offset: ${offset},
  //         filterBy: [${filterBy}]
  //         ${severityLevel ? `, contentFilterBy: ${severityLevel}` : ""}`;

  //     postsList += tag && tag.length >= 2 ? `, tag: "${tag}"` : "";
  //     postsList += title && title.length >= 1 ? `, title: "${title}"` : "";
  //     postsList += userID !== null ? `, userid: "${userID}"` : "";
  //     postsList += `) {
  //           status
  //           ResponseCode
  //           counter
  //           affectedRows {
  //               id
  //               contenttype
  //               title
  //               media
  //               cover
  //               mediadescription
  //               createdat
  //               amountlikes
  //               amountviews
  //               amountcomments
  //               amountdislikes
  //               amounttrending
  //               isliked
  //               isviewed
  //               isreported
  //               isdisliked
  //               issaved
  //               tags
  //               user {
  //                   id
  //                   username
  //                   slug
  //                   img
  //                   isfollowed
  //                   isfollowing
  //               }
  //               comments {
  //                   commentid
  //                   userid
  //                   postid
  //                   parentid
  //                   content
  //                   amountlikes
  //                   amountreplies
  //                   isliked
  //                   createdat
  //                   user {
  //                       id
  //                       username
  //                       slug
  //                       img
  //                       isfollowed
  //                       isfollowing
  //                   }
  //               }
  //           }
  //       }
  //   }
  //   `;
  //     //console.log(postsList);
  //     var graphql = JSON.stringify({
  //       query: postsList,
  //       variables: {},
  //     });

  //     var requestOptions = {
  //       method: "POST",
  //       headers: headers,
  //       body: graphql,
  //       redirect: "follow",
  //     };

  //     return fetch(GraphGL, requestOptions)
  //       .then((response) => response.json())
  //       .then((result) => {
  //         console.log('result ', result)
  //         return result;
  //       })
  //       .catch((error) => {
  //         Merror("error", error);
  //         throw error;
  //       });
  //   }

  // getPosts function are modified

  async function getPosts(offset, limit, filterBy, title = "", tag = null, sortby = "NEWEST", userID = null) {
    const accessToken = getCookie("authToken");
    const headers = getHeaders(accessToken);

    //console.log("Title:", title);
    // Fetch advertisement posts
    const adsQuery = await getAdvertisementPosts(userID, offset, limit, title , tag );
    let result = await fetchGraphQL(adsQuery, headers);
    if (result.listAdvertisementPosts.status == "error") {
      throw new Error(userfriendlymsg(result.listAdvertisementPosts.ResponseCode));
      // return false;
    }

    // If ads are less than limit, fetch normal posts
    const adsCount = result.listAdvertisementPosts ?.affectedRows ?.length || 0;
    if (adsCount < limit) {
      // const remainingLimit = limit - adsCount;
      const savedUserData = localStorage.getItem("userData");
      let severityLevel = null;

      if (savedUserData) {
        const parsedData = JSON.parse(savedUserData);
        severityLevel = parsedData.userPreferences ?.contentFilteringSeverityLevel || null;
      }

      const listQuery = await getListPosts(offset, limit, filterBy, title, tag, sortby, userID, severityLevel);
      const postsResult = await fetchGraphQL(listQuery, headers);
      // Merge ads and normal posts
      const mergedRows = [
            ...(result.listAdvertisementPosts?.affectedRows.map(a => ({ ...a.post, startdate: a.advertisement.startdate, isAd: true })) || []),
            ...(postsResult.listPosts?.affectedRows.map(p => ({ ...p, isAd: false })) || [])];
      return {
        listPosts: {
          status: "success",
          ResponseCode: "11501",
          counter: mergedRows.length,
          affectedRows: mergedRows
        }
      };
    }

    // If ads greater than limit then return only ads (flagged)
    const adRows = result.listAdvertisementPosts ?.affectedRows.map(a => ({...a.post, isAd: true })) || [];
    return {
      listPosts: {
        status: "success",
        ResponseCode: "11501",
        counter: adRows.length,
        affectedRows: adRows
      }
    };
  }

  async function getAdvertisementPosts(userID, offset, limit, title, tag) {
    
    const savedUserData = localStorage.getItem("userData");
    let contentFilterBy = null;

    if (savedUserData) {
      const parsedData = JSON.parse(savedUserData);
      contentFilterBy =
        parsedData.userPreferences?.contentFilteringSeverityLevel || null;
    }

    const query = `query ListAdvertisementPosts {
    listAdvertisementPosts(
          offset: ${offset}, 
          limit: ${limit},
          contentFilterBy: ${contentFilterBy}
          ${userID !== null ? `, userid: "${userID}"` : ""}   
          ${tag && tag.length >= 2 ? `, tag: "${tag}"` : ""}
          ${title && title.length >= 1 ? `, title: "${title}"` : ""}  
          
        ) {  
        status
        ResponseCode
        counter
        affectedRows {
            post {
                id
                contenttype
                title
                media
                cover
                mediadescription
                createdat
                amountlikes
                amountviews
                amountcomments
                amountdislikes
                amounttrending
                hasActiveReports
                visibilityStatus
                isHiddenForUsers
                isliked
                isviewed
                isreported
                isdisliked
                issaved
                tags
                url
                user {
                    id
                    username
                    slug
                    img
                    isfollowed
                    isfollowing
                    isfriend
                    hasActiveReports
                    visibilityStatus
                    isHiddenForUsers
                }
                comments {
                    commentid
                    userid
                    postid
                    parentid
                    content
                    createdat
                    amountlikes
                    amountreplies
                    hasActiveReports
                    visibilityStatus
                    isHiddenForUsers
                    isliked
                    user {
                        id
                        username
                        slug
                        img
                        isfollowed
                        isfollowing
                        isfriend
                        hasActiveReports
                        visibilityStatus
                        isHiddenForUsers
                    }
                }
            }
            advertisement {
                advertisementid
                postid
                advertisementtype
                startdate
                enddate
                createdat
                user {
                    id
                    username
                    slug
                    img
                    isfollowed
                    isfollowing
                    isfriend
                    hasActiveReports
                    visibilityStatus
                    isHiddenForUsers
                }
            }
        }
    }
}
`;

    return query;
  }

  // === Helper 1: Build GraphQL query
  function getListPosts(offset, limit, filterBy, title, tag, sortby, userID, severityLevel) {
    let query = `
    query ListPosts {
      listPosts(
        sortBy: ${sortby},
        limit: ${limit},
        offset: ${offset},
        filterBy: [${filterBy}]
        ${severityLevel ? `, contentFilterBy: ${severityLevel}` : ""}
        ${tag && tag.length >= 2 ? `, tag: "${tag}"` : ""}
        ${title && title.length >= 1 ? `, title: "${title}"` : ""}
        ${userID !== null ? `, userid: "${userID}"` : ""}
      ) {
        status
        ResponseCode
        counter
          affectedRows {
                 id
                 contenttype
                 title
                 media
                 cover
                 mediadescription
                 createdat
                 amountlikes
                 amountviews
                 amountcomments
                 amountdislikes
                 amounttrending
                 hasActiveReports
                 visibilityStatus
                 isHiddenForUsers
                 isliked
                 isviewed
                 isreported
                 isdisliked
                 issaved
                 tags
                 user {
                     id
                     username
                     slug
                     img
                     isfollowed
                     isfollowing
                     hasActiveReports
                     visibilityStatus
                     isHiddenForUsers
                 }
             comments {
                   commentid
                     userid
                     postid
                     parentid
                     content
                     visibilityStatus
                     hasActiveReports
                     isHiddenForUsers
                     amountlikes
                     amountreplies
                     isliked
                     createdat
                     user {
                         id
                         username
                         slug
                         img
                         isfollowed
                         isfollowing
                         hasActiveReports
                         visibilityStatus
                         isHiddenForUsers
                    }
                 }
             }
      }
    }
  `;
   
    return query;
  }


  // === Helper 2: Build headers ===
  function getHeaders(accessToken) {
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    }
  }

  // === Helper 3: Fetch GraphQL ===
  async function fetchGraphQL(query, headers) {
    const response = await fetch(GraphGL, {
      method: "POST",
      headers,
      body: JSON.stringify({
        query
      }),
      // redirect: "follow",
    });

    const result = await response.json();
    if (result.errors) {
      // console.error("GraphQL error:", result.errors);
      throw new Error(result.errors[0].message);
    }
    return result.data;
  }
  // End 

  async function viewPost(postid) {
    const accessToken = getCookie("authToken");
    // Create headers
    const headers = new Headers({
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    });

    var graphql = JSON.stringify({
      query: `mutation ResolvePostAction {
          resolvePostAction(postid: "${postid}", action: VIEW) {
            status
            ResponseCode
          }
        }`,

      variables: {},
    });

    var requestOptions = {
      method: "POST",
      headers: headers,
      body: graphql,
      redirect: "follow",
    };

    return fetch(GraphGL, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        if (result.data.resolvePostAction.status == "error") {
          throw new Error(userfriendlymsg(result.data.resolvePostAction.ResponseCode));
        } else {
          return true;
        }
      })
      .catch((error) => {
        // Merror("View Post failed", error);
        // console.log("error", error);
        console.error("View Post failed", error);
        return false;
      });
  }

  async function likePost(postid) {

    // likeCost is a global variable and updated in global.js -> getActionPrices();
    if (!(await LiquiudityCheck(likeCost, "Like Post", like))) {
      return false;
    }

    const accessToken = getCookie("authToken");

    // Create headers
    const headers = new Headers({
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    });
    //   mutation ResolveActionPost {
    //     resolveActionPost(postid: null, action: LIKE) {
    //         status
    //         ResponseCode
    //         affectedRows
    //     }
    // }
    var graphql = JSON.stringify({
      query: `mutation ResolvePostAction {
          resolvePostAction(postid: "${postid}", action: LIKE) {
            status
            ResponseCode
          }
        }`,

      variables: {},
    });

    var requestOptions = {
      method: "POST",
      headers: headers,
      body: graphql,
      redirect: "follow",
    };

    return fetch(GraphGL, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        if (result.data.resolvePostAction.status == "error") {
          throw new Error(userfriendlymsg(result.data.resolvePostAction.ResponseCode));
        } else {
          dailyfree();
          return true;
        }
      })
      .catch((error) => {
        Merror("Like Post failed", error);
        console.log("error", error);
        return false;
      });
  }
  async function dislikePost(postid) {

    // dislikeCost is a global variables and updated in global.js -> getActionPrices();

    if (!(await LiquiudityCheck(dislikeCost, "Dislike Post", dislike))) {
      return false;
    }
    const accessToken = getCookie("authToken");

    // Create headers
    const headers = new Headers({
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    });

    var graphql = JSON.stringify({
      query: `mutation ResolvePostAction {
          resolvePostAction(postid: "${postid}", action: DISLIKE) {
            status
            ResponseCode
          }
        }`,

      variables: {},
    });

    var requestOptions = {
      method: "POST",
      headers: headers,
      body: graphql,
      redirect: "follow",
    };

    return fetch(GraphGL, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        if (result.data.resolvePostAction.status == "error") {
          throw new Error(userfriendlymsg(result.data.resolvePostAction.ResponseCode));
        } else {
          return true;
        }
      })
      .catch((error) => {
        Merror("DisLike Post failed", error);
        //console.log("error", error);
        return false;
      });
  }

  async function reportPostAPIcall(postid) {

    const accessToken = getCookie("authToken");
    const cancel = 0;
    const answer = await warnig("Are you sure you want to report this post?", ``, (dontShowOption = false),`<i class="peer-icon peer-icon-warning red-text"></i>`);
    if (answer === null || answer.button === cancel) {
      return false;
    }

    // Create headers
    const headers = new Headers({
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    });

    var graphql = JSON.stringify({
      query: `mutation ResolvePostAction {
          resolvePostAction(postid: "${postid}", action: REPORT) {
            status
            ResponseCode
          }
        }`,

      variables: {},
    });

    var requestOptions = {
      method: "POST",
      headers: headers,
      body: graphql,
      redirect: "follow",
    };

    return fetch(GraphGL, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        if (result.data.resolvePostAction.status == "error") {
          throw new Error(userfriendlymsg(result.data.resolvePostAction.ResponseCode));
        } else {
          return true;
        }
      })
      .catch((error) => {
        Merror("Report Post failed", error, (dontShowOption = false),`<i class="peer-icon peer-icon-warning red-text"></i>`);
        //console.log("error", error);
        return false;
      });
  }

  // ============================================
  // POST INTERACTIONS MODAL
  // Displays users who liked, disliked, or viewed a post/comment
  // Supports infinite scroll pagination
  // ============================================

  async function postInteractionsModal(postid, startType = "VIEW", counts = {}) {
    const accessToken = getCookie("authToken");
    const modal = document.getElementById("interactionsModal");
    const LIMIT = 20;

    // ============================================
    // BUILD MODAL HTML
    // ============================================

    let tabsHTML = "";
    if (startType === "COMMENTLIKE") {
      tabsHTML = `<div class="tab-btn active" data-type="COMMENTLIKE">Comment Likes <i class="peer-icon peer-icon-like"></i><span class="count">${counts.amountlikes || 0}</span></div>`;
    } else {
      tabsHTML = `
        <div class="tab-btn" data-type="LIKE">Likes <i class="peer-icon peer-icon-like"></i><span class="count">${counts.amountlikes || 0}</span></div>
        <div class="tab-btn" data-type="DISLIKE">Dislikes <i class="peer-icon peer-icon-dislike"></i><span class="count">${counts.amountdislikes || 0}</span></div>
        <div class="tab-btn" data-type="VIEW">Views <i class="peer-icon peer-icon-eye-open"></i><span class="count">${counts.amountviews || 0}</span></div>
      `;
    }

    modal.innerHTML = `
      <div class="modal-content">
        <span class="close-btn"><img class="interactions-close" src="svg/arrow-left.svg"></span>
        <div class="tabs">
          ${tabsHTML}
        </div>
        <div id="interactionResults" class="results"></div>
      </div>
    `;

    showModal();

    // ============================================
    // API CALL - FETCH INTERACTIONS
    // ============================================

    async function getPostInteractions(type = "VIEW", offset = 0) {
      const query = `
        query PostInteractions {
          postInteractions(
            postOrCommentId: "${postid}", 
            getOnly: ${type},
            limit: ${LIMIT},
            offset: ${offset}) {
              status
              ResponseCode
              affectedRows {
                id
                username
                slug
                img
                isfollowed
                isfollowing
              }
          }
        }
      `;

      try {
        const response = await fetch(GraphGL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`
          },
          body: JSON.stringify({ query })
        });

        const json = await response.json();
        return json?.data?.postInteractions?.affectedRows || [];
      } catch (error) {
        console.error(`Error loading ${type} interactions:`, error);
        return [];
      }
    }

    // ============================================
    // STATE MANAGEMENT
    // ============================================

    let currentType = startType;
    
    let cachedResults = {
      VIEW: [],
      LIKE: [],
      DISLIKE: [],
      COMMENTLIKE: []
    };

    let pagination = {
      VIEW: { offset: 0, hasMore: true, loading: false },
      LIKE: { offset: 0, hasMore: true, loading: false },
      DISLIKE: { offset: 0, hasMore: true, loading: false },
      COMMENTLIKE: { offset: 0, hasMore: true, loading: false }
    };

    let interactionObserver = null;

    // ============================================
    // MODAL CONTROLS
    // ============================================

    function openModal(type) {
      modal.querySelectorAll(".tab-btn").forEach(btn => {
        btn.classList.toggle("active", btn.dataset.type === type);
      });
    }

    function showModal() {
      modal.classList.remove("none");
      modal.classList.add("open");
    }

    function hideModal() {
      modal.classList.remove("open");
      modal.classList.add("none");
      disconnectObserver();
    }

    // ============================================
    // INTERSECTION OBSERVER MANAGEMENT
    // ============================================

    function disconnectObserver() {
      if (interactionObserver) {
        interactionObserver.disconnect();
        interactionObserver = null;
      }
      
      const oldSentinel = modal.querySelector("#interactionSentinel");
      if (oldSentinel) oldSentinel.remove();
    }

    // ============================================
    // USER RENDERING
    // ============================================

    function appendMoreUsers(newUsers, container) {
      const sentinel = container.querySelector("#interactionSentinel");
      const currentUserId = getCookie("userID");

      newUsers.forEach(user => {
        const el = createUserItem(user, currentUserId);
        if (sentinel) container.insertBefore(el, sentinel);
        else container.appendChild(el);
      });
    }

    // ============================================
    // LOAD INTERACTIONS 
    // ============================================

    async function loadInteractions(type) {
      currentType = type;
      const container = modal.querySelector("#interactionResults");

      pagination[type].offset = 0;
      pagination[type].hasMore = true;
      pagination[type].loading = false;

      disconnectObserver();

      const data = await getPostInteractions(type, 0);
      cachedResults[type] = data || [];
      
      container.innerHTML = "";

      if (!data || data.length === 0) {
        let label = "";
        switch (type) {
          case "LIKE": label = "likes"; break;
          case "DISLIKE": label = "dislikes"; break;
          case "VIEW": label = "views"; break;
          case "COMMENTLIKE": label = "comment likes"; break;
        }
        container.innerHTML = `<div class="empty-message">No ${label} yet!</div>`;
        pagination[type].hasMore = false;
        return;
      }

      renderUsers(data, container);

      pagination[type].offset = data.length;
      pagination[type].hasMore = (data.length === LIMIT);

      const existingLoader = modal.querySelector("#interactionLoader");
      if (existingLoader) existingLoader.remove();
      
      const loader = document.createElement("div");
      loader.id = "interactionLoader";
      loader.className = "loader";
      loader.style.display = "none";
      loader.textContent = "Loading...";
      container.appendChild(loader);

      if (pagination[type].hasMore) {
        const sentinel = document.createElement("div");
        sentinel.id = "interactionSentinel";
        sentinel.style.height = "1px";
        sentinel.style.marginTop = "20px";
        container.appendChild(sentinel);

        if (interactionObserver) {
          interactionObserver.disconnect();
          interactionObserver = null;
        }

        interactionObserver = new IntersectionObserver(async (entries) => {
          const first = entries[0];
          if (!first.isIntersecting) return;
          await loadMore(type);
        }, {
          root: container,
          rootMargin: '100px',
          threshold: 0
        });

        interactionObserver.observe(sentinel);
      } else {
        disconnectObserver();
        const loaderEl = modal.querySelector("#interactionLoader");
        if (loaderEl) loaderEl.style.display = "none";
      }
    }

    // ============================================
    // PRELOAD INTERACTIONS (BACKGROUND)
    // ============================================

    async function preloadInteractions(type) {
      if (!cachedResults[type] || cachedResults[type].length === 0) {
        const data = await getPostInteractions(type);
        cachedResults[type] = data;
      }
    }

    // ============================================
    // LOAD MORE (PAGINATION)
    // ============================================

    async function loadMore(type) {
      const state = pagination[type];
      const container = modal.querySelector("#interactionResults");
      const loader = modal.querySelector("#interactionLoader");

      if (!state.hasMore || state.loading) return;

      state.loading = true;
      if (loader) loader.style.display = "block";

      const newData = await getPostInteractions(type, state.offset);

      if (newData && newData.length > 0) {
        appendMoreUsers(newData, container);
        cachedResults[type] = [...(cachedResults[type] || []), ...newData];
        state.offset += newData.length;
      }

      if (!newData || newData.length < LIMIT) {
        state.hasMore = false;
        disconnectObserver();
        if (loader) loader.style.display = "none";
      }

      if (loader) loader.style.display = "none";
      state.loading = false;
    }

    modal.querySelectorAll(".tab-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const type = btn.dataset.type;
        openModal(type);
        loadInteractions(type);
      });
    });

    modal.querySelector(".close-btn").addEventListener("click", hideModal);

    // ============================================
    // INITIALIZE MODAL
    // ============================================

    openModal(startType);
    await loadInteractions(startType);

    if (startType !== "COMMENTLIKE") {
      ["VIEW", "LIKE", "DISLIKE"].forEach(t => {
        if (t !== startType) preloadInteractions(t);
      });
    }
  }


  async function LiquiudityCheck(postCosts, title, action) {
    // console.log("Liquidity Check for postCosts:", postCosts);
    const limitIDs = [
      ["Likesused", "Likesavailable", "LikesStat"],
      ["Commentsused", "Commentsavailable", "CommentsStat"],
      ["Postsused", "Postsavailable", "PostsStat"],
      ["disLikesused", "disLikesavailable", "disLikesStat"],
    ];
    const msg = ["like", "comment", "post", "dislike"];
    const freeActions = ["3", "4", "1", "0"];
    const cancel = 0;
    const dailyfree = await getDailyFreeStatus();
    //console.log("dailyfree ", dailyfree);
    let dailyPostAvailable = 0;
    //console.log(action);
    if (action != '3') { // 3 means dislike and dislike is paid
      dailyPostAvailable = dailyfree[action].available;
    }

    const bitcoinPrice = await getBitcoinPriceEUR();
    //const tokenPrice = 100000 / bitcoinPrice;
    const tokenPrice = 10;
    const token = await getLiquiudity();
    //console.log(dailyPostAvailable+"---"+dailyfree);
    if (dailyPostAvailable) {

      let answer = await confirm(title, `🎉 This ${msg[action]} is free! You have ${freeActions[action]} free ${msg[action]}${freeActions[action] > 1 ? "s" : ""} available every 24 hours.`, (dontShowOption = true), msg[action]);
      if (answer === null || answer.button === cancel) {
        return false;
      }
      // const freeused = parseInt(document.getElementById(limitIDs[action][0]).innerText) + 1;
      // const freeavailable = parseInt(document.getElementById(limitIDs[action][1]).innerText) - 1;
      // document.getElementById(limitIDs[action][0]).innerText = freeused;
      // document.getElementById(limitIDs[action][1]).innerText = freeavailable;
      // document.getElementById(limitIDs[action][2]).style.setProperty("--progress", (100 * freeavailable) / (freeused + freeavailable) + "%");

      // prevent DOM elements if doesn't exists.
      // let freeused, freeavailable;
      // const usedElem = document.getElementById(limitIDs[action][0]);
      // const availElem = document.getElementById(limitIDs[action][1]);
      // const statElem = document.getElementById(limitIDs[action][2]);
      // if (usedElem && availElem && statElem) {
      //   freeused = parseInt(usedElem.innerText) + 1;
      //   freeavailable = parseInt(availElem.innerText) - 1;

      //   usedElem.innerText = freeused;
      //   availElem.innerText = freeavailable;
      //   statElem.style.setProperty("--progress", (100 * freeavailable) / (freeused + freeavailable) + "%");
      // } 
      ////////////////////////////////////

      let freeused = 0;
      let freeavailable = 0;
      const usedObjID = document.getElementById(limitIDs[action][0]);
      const availableObjID = document.getElementById(limitIDs[action][1]);
      if (usedObjID) {
        freeused = parseInt(usedObjID.innerText) + 1;
        usedObjID.innerText = freeused;
      }
      if (availableObjID) {
        freeavailable = parseInt(availableObjID.innerText) - 1;
        availableObjID.innerText = freeavailable;
      }
      // Safely update progress bar if third ID exists
      const progressBar = document.getElementById(limitIDs[action][2]);
      if (progressBar && (freeused + freeavailable) > 0) {
        const percentage = (100 * freeavailable) / (freeused + freeavailable);
        progressBar.style.setProperty("--progress", percentage + "%");
      }

      if (freeavailable === 0) { // if consumed free then reset popup for paid likes or comments or post
        const settings = JSON.parse(localStorage.getItem("modalDoNotShow")) || {};
        const key_to_remove = msg[action];
        delete settings[key_to_remove];
        localStorage.setItem("modalDoNotShow", JSON.stringify(settings));
        //localStorage.removeItem("modalDoNotShow");
      }


    } else if (!dailyPostAvailable && token * tokenPrice < postCosts) {
      let answer = await confirm(
        title = '<div class="title-char"><img class="title-icon" src="svg/Exclude.svg" ><span>Insufficient Tokens</span></div>',
        `<div class="modal-message">
          <div>Current balance:</div> <div class="pricee"><span>${token}</span> <img src="svg/new_peerLogo.svg" alt="Peer Token" class="peer-token"></div>
        </div>

        <div class="modal-message">
          <div>${msg[action]} cost:</div> <div class="pricee"><span>${(postCosts * tokenPrice).toFixed(2)}</span> <img src="svg/new_peerLogo.svg" alt="Peer Token" class="peer-token"></div>
        </div>`,
        //(dontShowOption = true)
      );
      if (answer === null || answer.button === cancel) {
        return false;
      }
    } else if (!dailyPostAvailable && token * tokenPrice >= postCosts) {
      //console.log(postCosts +'*'+ tokenPrice);
      let answer = await confirm(
        title = `<div class="title-char"><span>Post ${msg[action]}</span></div>`,
        `<div class="modal-message">
          <div>Current balance:</div> <div class="pricee"><span>${token}</span> <img src="svg/new_peerLogo.svg" alt="Peer Token" class="peer-token"></div>
        </div>

        <div class="modal-message">
          <div>${msg[action]} cost:</div> <div class="pricee"><span>${(postCosts * tokenPrice).toFixed(2)}</span> <img src="svg/new_peerLogo.svg" alt="Peer Token" class="peer-token"></div>
        </div>`,
        true, // show "Do not show" checkbox
        msg[action] // this is the typeKey for storage
        //(dontShowOption = true)
      );
      //console.log(answer);
      if (answer === null || answer.button === cancel) {

        return false;
      }

    } else if (!dailyPostAvailable && token * tokenPrice < postCosts) {
      await Merror(title, `You need ${(postCosts * tokenPrice).toFixed(2)} Peer Tokens to ${msg[action]}. Your balance is ${token} Peer Tokens.`); //updated
      return false;
    }

    return true;


  }

  function isVariableNameInArray(variableObj, nameArray) {
    return Object.keys(variableObj).some((key) => key.includes(nameArray));
  }

  // BASE64 approach
  // async function sendCreatePost(variables) {

  //   // postCost is a global variable and updated in global.js -> getActionPrices();
  //   if (!(await LiquiudityCheck(postCost, "Create Post", post))) {
  //     return false;
  //   }
  //   const accessToken = getCookie("authToken");

  //   if (!accessToken) {
  //     throw new Error("Auth token is missing or invalid.");
  //   }

  //   const headers = {
  //     "Content-Type": "application/json",
  //     Authorization: `Bearer ${accessToken}`,
  //   };

  //   let query = `
  //     mutation CreatePost($title: String!, $media: [String!]`;
  //   if (isVariableNameInArray(variables, "cover")) {
  //     query += `, $cover: [String!]`;
  //   }
  //   if (isVariableNameInArray(variables, "mediadescription")) {
  //     query += `, $mediadescription: String!`;
  //   }
  //   query += `, $contenttype: ContentType!, $tags: [String!]) {
  //       createPost(
  //         action: POST
  //         input: {
  //           title: $title
  //           media: $media`;
  //   if (isVariableNameInArray(variables, "cover")) {
  //     query += `\ncover: $cover`;
  //   }
  //   if (isVariableNameInArray(variables, "mediadescription")) {
  //     query += `\nmediadescription: $mediadescription`;
  //   }
  //   query += `
  //           contenttype: $contenttype
  //           tags: $tags
  //         }
  //       ) {
  //         status
  //         ResponseCode
  //         affectedRows {
  //             id
  //             contenttype
  //             title
  //             media
  //             cover
  //             mediadescription
  //             createdat
  //             amountlikes
  //             amountviews
  //             amountcomments
  //             amountdislikes
  //             amounttrending
  //             isliked
  //             isviewed
  //             isreported
  //             isdisliked
  //             issaved
  //             tags
  //         }
  //       }
  //     }
  //   `;
  // //console.log(variables);
  //   // const variables = {
  //   //   title,
  //   //   media,
  //   //   mediadescription,
  //   //   contenttype,
  //   // };


  //   try {
  //     const response = await fetch(GraphGL, {
  //       method: "POST",
  //       headers: headers,
  //       body: JSON.stringify({
  //         query,
  //         variables,
  //       }),
  //     });

  //     if (!response.ok) {
  //       throw new Error(`HTTP error! Status: ${response.status}`);
  //     }

  //     const result = await response.json();
  //     if (result.errors) {
  //       throw new Error(`GraphQL Error: ${JSON.stringify(result.errors)}`);
  //     }
  //     // console.log("Mutation Result:", result.data);
  //     return result.data;

  //   } catch (error) {
  //     Merror("Create Post failed", error);
  //     // console.error("Error create Post:", error);
  //     return false;
  //   }
  // }
  // Beispiel: Hole den Bitcoin‐Preis in EUR von CoinGecko

  //MULTIPART UPDATES:
  //helper function getAccessToken
  async function getAccessToken() {
    const accessToken = getCookie("authToken");
    if (!accessToken) {
      throw new Error("Auth token is missing or invalid.");
    }
    return accessToken;
  }

  async function checkEligibility() {
    const accessToken = await getAccessToken();
    const query = `
          query PostEligibility {
            postEligibility {
              status
              ResponseCode
              eligibilityToken
            }
          }
        `;

    try {
      const response = await fetch(GraphGL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`
        },
        body: JSON.stringify({
          query
        })
      });


      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      const result = await response.json();
      if (result.errors) throw new Error(result.errors[0].message);
      const eligibility = result.data.postEligibility;
      if (!eligibility || eligibility.ResponseCode !== "10901") {
        throw new Error("Eligibility failed");
      }

      return eligibility.eligibilityToken;
    } catch (error) {
      console.error("Error checking eligibility:", error);
      throw error;
    }
  }

  // --- Step 2: /upload-post (multipart/form-data) ---
  async function uploadFiles(eligibilityToken, files) {
    const form = new FormData();
    const accessToken = await getAccessToken();
    form.append("eligibilityToken", eligibilityToken);
    const fileArray = Array.isArray(files) ? files : [files];
    for (const file of fileArray) form.append("file[]", file, file.name);

    const config = getHostConfig();
    //console.log('Domain:', config.domain);
    //console.log('Server:', config.server);

    const uploadUrl = "https://" + config.domain + "/upload-post";
    //console.log("uploadUrl: ",uploadUrl);
    const res = await fetch(uploadUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`
      },
      body: form,
    });
    if (!res.ok) throw new Error(`/upload-post HTTP ${res.status}`);
    const json = await res.json();
    if (json.ResponseCode != "11515") throw new Error(`Upload failed: ${json.status || ""}`);
    return json.uploadedFiles; // z.B. "temp/media/a.png,temp/media/b.png"
  }

  // --- Step 3: createPost (GraphQL) — angepasst an deine neue Mutation ---
  async function sendCreatePost({
    title,
    mediadescription,
    contenttype,
    uploadedFiles,
    cover,
    tags
  }) {

    const modalProcess = document.getElementById('processing_modal');
    if (!(await LiquiudityCheck(postCost, "Create Post", post))) {
      return false;
    }


    const accessToken = await getAccessToken();

    if (!accessToken) {
      throw new Error("Auth token is missing or invalid.");
    }

    try {

      var eligibilitytToken = await checkEligibility();
    } catch (err) {
      //console.error("Eligibility check failed:", err);
      Merror("Eligibility check failed:", err);
      //createPostError.innerHTML = "You are not eligible to create a post.";
      //submitButton.disabled = false;
      return; // stop here
    }

    try {
      modalProcess.showModal();

      uploadedFiles = await uploadFiles(eligibilitytToken, uploadedFiles);
    } catch (err) {
      console.error("File upload failed:", err);
      Merror("File upload failed:", err);
      //createPostError.innerHTML = "Failed to upload files. Please try again.";
      //submitButton.disabled = false;
      return; // stop here
    } finally {
      modalProcess.close();
    }


    const mutation = `
        mutation CreatePost($title: String!, $uploadedFiles: String!, $cover: [String!], $mediadescription: String!, $contenttype: ContentType!, $tags: [String!]) {
          createPost(
            action: POST
            input: {
              title: $title
              uploadedFiles: $uploadedFiles
              cover: $cover
              mediadescription: $mediadescription
              contenttype: $contenttype
              tags: $tags
            }
          ) {
            status
            ResponseCode
            affectedRows {
              id
              contenttype
              title
              media
              cover
              mediadescription
              createdat
              amountlikes
              amountviews
              amountcomments
              amountdislikes
              amounttrending
              isliked
              isviewed
              isreported
              isdisliked
              issaved
              tags
            }
          }
        }
      `;
    const variables = {
      title,
      uploadedFiles,
      cover,
      mediadescription,
      contenttype,
      tags
    };



    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    };

    try {
      const response = await fetch(GraphGL, {
        method: "POST",
        headers: headers,
        body: JSON.stringify({
          query: mutation,
          variables,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();
      if (result.errors) {
        throw new Error(`GraphQL Error: ${JSON.stringify(result.errors)}`);
      }
      // console.log("Mutation Result:", result.data);
      return result.data;

    } catch (error) {
      Merror("Create Post failed", error);
      // console.error("Error create Post:", error);
      return false;
    }
  }

  async function getBitcoinPriceEUR() {
    const url = "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=eur";
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP-Error: ${response.status}`);
      const data = await response.json();
      // console.log(`1 BTC = ${data.bitcoin.eur} EUR`);
      return data.bitcoin.eur;
    } catch (err) {
      console.error("Fehler beim Abrufen des Bitcoin-Kurses:", err);
    }
  }