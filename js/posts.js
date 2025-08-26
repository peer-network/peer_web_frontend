  const post = 2;
  const like = 0;
  const dislike = 3;
  const comment = 1;


  async function getPosts(offset, limit, filterBy, title = "", tag = null, sortby = "NEWEST", userID = null) {

    const accessToken = getCookie("authToken");

    // Create headers
    const headers = new Headers({
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    });
    if (typeof title === "string") {
      title = sanitizeString(title);
    } else {
      title = "";
    }
    // tag = sanitizeString(tag);
    // tag = typeof tag === "string" ? sanitizeString(tag) : "";
    if (!sortby) sortby = "NEWEST";
    let postsList = `query ListPosts {
      listPosts(
        sortBy: ${sortby},
        limit: ${limit},
        offset: ${offset},
        filterBy: [${filterBy}]`;

    postsList += tag && tag.length >= 2 ? `, tag: "${tag}"` : "";

    postsList += title && title.length >= 1 ? `, title: "${title}"` : "";

    postsList += userID !== null ? `, userid: "${userID}"` : "";

    postsList += `) {
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
              }
              comments {
                  commentid
                  userid
                  postid
                  parentid
                  content
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
                  }
              }
          }
      }
  }
  `;
    //console.log(postsList);
    var graphql = JSON.stringify({
      query: postsList,
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
        return result;
      })
      .catch((error) => {
        Merror("error", error);
        throw error;
      });
  }
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
        Merror("View Post failed", error);
        // console.log("error", error);
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

  async function postInteractionsModal(postid, startType = "VIEW") {
    const accessToken = getCookie("authToken");
    const modal = document.getElementById("interactionsModal");

    // build tabs dynamically
    let tabsHTML = "";
    if (startType === "COMMENTLIKE") {
      tabsHTML = `<div class="tab-btn active" data-type="COMMENTLIKE">Comment Likes <i class="fi fi-rr-heart"></i><span class="count">0</span></div>`;
    } else {
      tabsHTML = `
        <div class="tab-btn" data-type="LIKE">Likes <i class="fi fi-rr-heart"></i><span class="count">0</span></div>
        <div class="tab-btn" data-type="DISLIKE">Dislikes <i class="fi fi-rr-heart-crack"></i><span class="count">0</span></div>
        <div class="tab-btn" data-type="VIEW">Views <i class="fi fi-rr-eye"></i><span class="count">0</span></div>
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

    async function getPostInteractions(type = "VIEW") {
      const query = `
        query PostInteractions {
          postInteractions(postOrCommentId: "${postid}", getOnly: ${type}) {
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

    let currentType = startType;
    let cachedResults = { VIEW: [], LIKE: [], DISLIKE: [], COMMENTLIKE: [] };

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
    }

    async function loadInteractions(type) {
      currentType = type;
      const container = modal.querySelector("#interactionResults");

      let data = cachedResults[type];
      if (!data || data.length === 0) {
        data = await getPostInteractions(type);
        cachedResults[type] = data;
      }

      const tab = modal.querySelector(`.tab-btn[data-type="${type}"] .count`);
      if (tab) {
        tab.textContent = data.length;
      }

      if (data.length === 0) {
        let label = "";
        switch (type) {
          case "LIKE":
            label = "likes";
            break;
          case "DISLIKE":
            label = "dislikes";
            break;
          case "VIEW":
            label = "views";
            break;
          case "COMMENTLIKE":
            label = "comment likes";
            break;
        }
        container.innerHTML = `<div class="empty-message">No ${label} yet!</div>`;
        return;
      }
      renderUsers(data, container);
  }


  async function preloadInteractions(type) {
    if (!cachedResults[type] || cachedResults[type].length === 0) {
      const data = await getPostInteractions(type);
      cachedResults[type] = data;

      // only update count, NOT results
      const tab = modal.querySelector(`.tab-btn[data-type="${type}"] .count`);
      if (tab) {
        tab.textContent = data.length;
      }
    }
  }

  // tab switching
  modal.querySelectorAll(".tab-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const type = btn.dataset.type;
      openModal(type);
      loadInteractions(type);
    });
  });

  modal.querySelector(".close-btn").addEventListener("click", hideModal);

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
    const msg = ["like", "comment", "post","dislike"];
    const freeActions = ["3", "4", "1","0"];
    const cancel = 0;
    const dailyfree = await getDailyFreeStatus();
    //console.log("dailyfree ", dailyfree);
    let dailyPostAvailable=0;
    //console.log(action);
    if(action!='3'){ // 3 means dislike and dislike is paid
      dailyPostAvailable = dailyfree[action].available;
    }
    
    const bitcoinPrice = await getBitcoinPriceEUR();
    //const tokenPrice = 100000 / bitcoinPrice;
    const tokenPrice = 10;
    const token = await getLiquiudity();
    //console.log(dailyPostAvailable+"---"+dailyfree);
    if (dailyPostAvailable) {
    
      let answer = await confirm(title, `🎉 This ${msg[action]} is free! You have ${freeActions[action]} free ${msg[action]}${freeActions[action] > 1 ? "s" : ""} available every 24 hours.`, (dontShowOption = true),msg[action] );
      if (answer === null || answer.button  === cancel) {
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
      const usedObjID=document.getElementById(limitIDs[action][0]);
      const availableObjID=document.getElementById(limitIDs[action][1]);
      if (usedObjID ) {
        freeused = parseInt(usedObjID.innerText) + 1;
        usedObjID.innerText = freeused;
      }
      if (availableObjID ) {
        freeavailable = parseInt(availableObjID.innerText) - 1;
        availableObjID.innerText = freeavailable;
      }
      // Safely update progress bar if third ID exists
      const progressBar = document.getElementById(limitIDs[action][2]);
      if (progressBar && (freeused + freeavailable) > 0) {
        const percentage = (100 * freeavailable) / (freeused + freeavailable);
        progressBar.style.setProperty("--progress", percentage + "%");
      }
      
      if(freeavailable===0){ // if consumed free then reset popup for paid likes or comments or post
        const settings = JSON.parse(localStorage.getItem("modalDoNotShow")) || {};
        const key_to_remove=msg[action];
        delete settings[key_to_remove];
        localStorage.setItem("modalDoNotShow", JSON.stringify(settings));
        //localStorage.removeItem("modalDoNotShow");
      }


    } else if (!dailyPostAvailable && token * tokenPrice < postCosts) {
      let answer = await confirm(
        title='<div class="title-char"><img class="title-icon" src="svg/Exclude.svg" ><span>Insufficient Tokens</span></div>',
        `<div class="modal-message">
          <div>Current balance:</div> <div class="pricee"><span>${token}</span> <img src="svg/new_peerLogo.svg" alt="Peer Token" class="peer-token"></div>
        </div>

        <div class="modal-message">
          <div>Like cost:</div> <div class="pricee"><span>${(postCosts * tokenPrice).toFixed(2)}</span> <img src="svg/new_peerLogo.svg" alt="Peer Token" class="peer-token"></div>
        </div>`,
        //(dontShowOption = true)
      );
      if (answer === null || answer.button === cancel) {
        return false;
      }
    } else if (!dailyPostAvailable && token * tokenPrice >= postCosts) {
      //console.log(postCosts +'*'+ tokenPrice);
      let answer = await confirm(
        title=`<div class="title-char"><span>Post ${msg[action]}</span></div>`,
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
      if (answer === null || answer.button === cancel ) {
      
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

  async function sendCreatePost(variables) {
    
    // postCost is a global variable and updated in global.js -> getActionPrices();
    if (!(await LiquiudityCheck(postCost, "Create Post", post))) {
      return false;
    }
    const accessToken = getCookie("authToken");

    if (!accessToken) {
      throw new Error("Auth token is missing or invalid.");
    }

    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    };

    let query = `
      mutation CreatePost($title: String!, $media: [String!]`;
    if (isVariableNameInArray(variables, "cover")) {
      query += `, $cover: [String!]`;
    }
    if (isVariableNameInArray(variables, "mediadescription")) {
      query += `, $mediadescription: String!`;
    }
    query += `, $contenttype: ContentType!, $tags: [String!]) {
        createPost(
          action: POST
          input: {
            title: $title
            media: $media`;
    if (isVariableNameInArray(variables, "cover")) {
      query += `\ncover: $cover`;
    }
    if (isVariableNameInArray(variables, "mediadescription")) {
      query += `\nmediadescription: $mediadescription`;
    }
    query += `
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
  //console.log(variables);
    // const variables = {
    //   title,
    //   media,
    //   mediadescription,
    //   contenttype,
    // };
    

    try {
      const response = await fetch(GraphGL, {
        method: "POST",
        headers: headers,
        body: JSON.stringify({
          query,
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
  // Beispiel: Hole den Bitcoin‐Preis in EUR von CoinGecko

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
