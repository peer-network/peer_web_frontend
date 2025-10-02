
document.addEventListener("DOMContentLoaded", () => {

  

    const params = new URLSearchParams(window.location.search);
    const userID = params.get('user');
    // let isfollowed, isfollowing = null;
    //console.log(userID); // Outputs: 90fd2510-b682-4fe3-8a3a-2456c5a8d170

    getProfile(userID).then(userprofile => {
      
      if(userprofile.ResponseCode=='30201' && userprofile.status=='error'){
        //No User Found;
        window.location.href = "404.php";
        return;
      }

      const profileimg = document.getElementById("profilbild2");
      const username2 = document.getElementById("username2");
      const slug2 = document.getElementById("slug2");
      const following2 = document.getElementById("following2");
      const followers2 = document.getElementById("followers2");
      const Peers2 = document.getElementById("Peers2");
      const userPosts2 = document.getElementById("userPosts2");
      const biography2 = document.getElementById("biography2");
      const bioPath2 = userprofile.affectedRows.biography;
      // follow btn logic on view-profile
      // isfollowed = userprofile.affectedRows.isfollowed;
      // isfollowing = userprofile.affectedRows.isfollowing;
      // document.getElementById("followbtn").textContent = (isfollowing && isfollowed ? "Peer" : isfollowing ? "Following" : "Follow +");

      profileimg.onerror = function () {
        this.src = "svg/noname.svg";
      };
      profileimg.src = userprofile.affectedRows.img ? tempMedia(userprofile.affectedRows.img.replace("media/", "")) : "svg/noname.svg";

      if(username2){
        username2.innerText=userprofile.affectedRows.username;
      }
      if(slug2){
        slug2.innerText= "#" +userprofile.affectedRows.slug;
      }
      if(userPosts2){
        userPosts2.innerText= userprofile.affectedRows.amountposts;
      }
      if(following2){
        following2.innerText= userprofile.affectedRows.amountfollowed;
      }
      if(followers2){
        followers2.innerText= userprofile.affectedRows.amountfollower;
      }
      if(Peers2){
        Peers2.innerText= userprofile.affectedRows.amountfriends;
      }

      // Check if bioPath is valid
        if (bioPath2 && biography2) {
        const fullPath2 = tempMedia(userprofile.affectedRows.biography);


          fetch(fullPath2, { cache: "no-store" })
            .then(response => {
              if (!response.ok) {
                throw new Error("Failed to fetch biography text file");
              }
              return response.text();
            })
            .then(biographyText => {
              //console.log(biographyText);
              document.getElementById("biography2").innerText = biographyText;
            })
            .catch(error => {
              console.error("Error loading biography:", error);
              document.getElementById("biography2").innerText = "Biography not available";
            });
        } 

      
    });
  
   const post_loader = document.getElementById("post_loader");
  // Funktion erstellen, die aufgerufen wird, wenn der Footer in den Viewport kommt
  const observerCallback = (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        postsLaden(userID);
        // console.log("Der Footer ist jetzt im Viewport sichtbar!");
      }
    });
  };
  const observerOptions = {
    root: null, // null bedeutet, dass der Viewport als root genutzt wird
    rootMargin: "0px 0px 100% 0px",
    threshold: 0.1, // 10% des Footers müssen im Viewport sein, um die Funktion auszulösen
  };

  if (post_loader) {
    const observer = new IntersectionObserver(observerCallback, observerOptions);
    observer.observe(post_loader);
  } else {
    console.warn("⚠️ Post Loader element not found — cannot observe.");
  }

async function getProfile(userID) {
    const accessToken = getCookie("authToken");

    const query = `
      query GetProfile {
        getProfile (userid: "${userID}") {
          status
          ResponseCode
          affectedRows {
              id
              username
              status
              slug
              img
              biography
              isfollowed
              isfollowing
              amountposts
              amounttrending
              amountfollowed
              amountfollower
              amountfriends
              amountblocked
          }
        }
      }
    `;

    try {
      const response = await fetch(GraphGL,{
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`
        },
        body: JSON.stringify({ query })
      });

      const json = await response.json();
      return json?.data?.getProfile || null;
    } catch (error) {
      console.error("Error fetching profile:", error);
      return null;
    }
}

// document.getElementById("followbtn").addEventListener("click", async function () {
//     const followerCountSpan = document.getElementById("following");
//     try {
//       const result = await toggleFollowStatus(userID); 
//       if (result !== null) {
//         // Update class
//         this.classList.toggle("following", result);
//         // Update button text
//         this.textContent = (result && isfollowed ? "Peer" : result ? "Following" : "Follow +");
//         // Update follower count
//         if (followerCountSpan) {
//           let count = parseInt(followerCountSpan.textContent, 10) || 0;
//           count = result ? count + 1 : Math.max(0, count - 1);
//           followerCountSpan.textContent = count;
//         }
//       } else {
//         alert("Failed to update follow status. Please try again.");
//       }
//     } catch (err) {
//       console.error("Error updating follow status:", err);
//       alert("Something went wrong. Try again later.");
//     }
//   });
});