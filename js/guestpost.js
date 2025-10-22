document.addEventListener("DOMContentLoaded", async  function () {
  const postID = getPostIdFromURL(); // define in global.js
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
     if (isAndroid) {
          //console.log("Android device detected");
          // Try to open the app
            window.location = deepLink;
            mainContainer.querySelector('.signup-button-container a').textContent="Download App";
             mainContainer.querySelector('.signup-button-container a').href=androidFallback;
      } else if (isIOS) {
           window.location = deepLink;
            mainContainer.querySelector('.signup-button-container a').textContent="Download App";
            mainContainer.querySelector('.signup-button-container a').href=iosFallback;
      } else {
          //console.log("desktop device detected");
      }

   if (postID) {
        const objekt = await fetchPostByID(postID);
        if (objekt) {
            postdetail(objekt, null);
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
        


      
     
       
});