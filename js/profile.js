
document.addEventListener("DOMContentLoaded", () => {
  const CurrentUserID = getCookie("userID");
  getUser().then(profile2 => {
    const bioPath = profile2.data.getProfile.affectedRows.biography;

    const biography = document.getElementById("biography");

  // Check if bioPath is valid
  if (bioPath && biography) {
  const fullPath = tempMedia(profile2.data.getProfile.affectedRows.biography);


    fetch(fullPath, { cache: "no-store" })
      .then(response => {
        if (!response.ok) {
          throw new Error("Failed to fetch biography text file");
        }
        return response.text();
      })
      .then(biographyText => {
        //console.log(biographyText);
        document.getElementById("biography").innerText = biographyText;
      })
      .catch(error => {
        console.error("Error loading biography:", error);
        document.getElementById("biography").innerText = "Biography not available";
      });
  } else {
    //document.getElementById("biography").innerText = "No biography found";
  }


  });

     
   
  
   const post_loader = document.getElementById("post_loader");
  // Funktion erstellen, die aufgerufen wird, wenn der Footer in den Viewport kommt
  const observerCallback = (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        postsLaden(CurrentUserID);
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
  
});
