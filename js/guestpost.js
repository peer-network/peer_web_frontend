document.addEventListener("DOMContentLoaded", async  function () {
  const postID = getPostIdFromURL();
  const postContainer = document.getElementById('cardClicked');
  postContainer.classList.remove('none','scrollable');
  const mainContainer = document.getElementById('nonuser-viewpost');
   const baseUrl = `${location.protocol}//${location.host}/`;
   const accessToken = getCookie("authToken");
    const desktopFallback = baseUrl + "dashboard.php?postid=" + postID;
   if (accessToken) {
   
     window.location = desktopFallback;
    return;
   }
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    const isAndroid = /android/i.test(userAgent);
    const isIOS = /iPad|iPhone|iPod/.test(userAgent) && !window.MSStream;


    const deepLink = "peer://post/" + postID;
    const androidFallback = "https://play.google.com/store/apps/details?id=eu.peernetwork.app";
    const iosFallback = "https://apps.apple.com/app/peer-network/id6744612499";
     

   if (postID) {
        try {

          // Create headers
            const headers = new Headers({
              "Content-Type": "application/json",
             
            });

            // Step 2: GraphQL query banana
            const query = `
                query GuestListPost($postid: ID!) {
                    guestListPost(postid: $postid) {
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
                            url
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
                                createdat
                                amountlikes
                                amountreplies
                                isliked
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

            
            // Step 3: GraphQL fetch request
            
            const response = await fetch(GraphGL, {
                method: "POST",
                headers,
                body: JSON.stringify({
                    query: query,
                    variables: { postid: postID }
                })
            });

            const result = await response.json();
            // Step 4: Object assign karna
            const objekt = result.data.guestListPost.affectedRows;

            // Step 5: Function ko pass karna
            if (objekt) {
                postdetail(objekt, null);
            }

        } catch (error) {
            console.error("GraphQL request failed", error);
        }
    }else{
    const innerContainer = postContainer.querySelector('.inner-container');
    innerContainer.replaceChildren();
    innerContainer.classList.add('no-post-found');
    const noPostDiv = document.createElement("div");
    noPostDiv.classList.add('no-post');
    noPostDiv.innerHTML = `<h2 class="xxl_font_size">No Post Found</h2>
    <p class="md_font_size">The post you are looking for does not exist or has been removed.</p>`;
    innerContainer.appendChild(noPostDiv);
    

  }
  setTimeout(() => {
    mainContainer.querySelector('.site-main-nonuser').classList.remove('postloader');
  }, 3000);
        


      
  function getPostIdFromURL() {
    // Try query param first (?postid=...)
    const urlParams = new URLSearchParams(window.location.search);
    let postid = urlParams.get("postid");

    if (!postid) {
      const pathParts = window.location.pathname.split("/").filter(Boolean);
      // Find "post" in path
      const postIndex = pathParts.indexOf("post");
      if (postIndex !== -1 && pathParts[postIndex + 1]) {
        postid = pathParts[postIndex + 1];
      }
    }

    return postid;
  }      
       
});