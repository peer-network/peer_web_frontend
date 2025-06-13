async function fetchHelloData(userid = null) {
  const accessToken = getCookie("authToken");

  // Create headers
  const headers = new Headers({
    "Content-Type": "application/json",
    Authorization: `Bearer ${accessToken}`,
  });

  let graphql = JSON.stringify({
    query: `query Hello {
      hello {
          currentuserid
      }
<<<<<<< HEAD
      profile(userid: ${userid}) {
=======
      getProfile(userid: ${userid}) {
>>>>>>> 2549ae380ddaa952504a38d8a0151f559b756297
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
    }`,
    variables: {},
  });

  var requestOptions = {
    method: "POST",
    headers: headers,
    body: graphql,
    redirect: "follow",
  };

  try {
    const response = await fetch(GraphGL, requestOptions);
    const result_1 = await response.json();
    console.log(result_1);
    return result_1;
  } catch (error) {
    console.log("error", error);
    throw error;
  }
}
async function hello() {
  const accessToken = getCookie("authToken");

  // Create headers
  const headers = new Headers({
    "Content-Type": "application/json",
    Authorization: `Bearer ${accessToken}`,
  });

  // Define the GraphQL mutation with variables
  const graphql = JSON.stringify({
    query: `query Hello {
      hello {
          currentuserid
      }
  }`,
  });

  // Define request options
  const requestOptions = {
    method: "POST",
    headers: headers,
    body: graphql,
    redirect: "follow",
  };

  try {
    // Send the request and handle the response
    const response = await fetch(GraphGL, requestOptions);
    const result = await response.json();

    // Check for errors in response
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    if (result.errors) throw new Error(result.errors[0].message);

    document.cookie = `userID=${result.data.hello.currentuserid}; path=/; secure; SameSite=Strict`;
    return result.data.hello;
  } catch (error) {
    console.error("Error:", error.message);
    throw error;
  }
}
async function getUser() {
  const profil = await fetchHelloData();
  const id = getCookie("userID");
  if (!id) {
    const profil_container = document.getElementById("profil-container");
    const profil_login = document.getElementById("profil-login");
    profil_container.classList.add("none");
    profil_login.classList.remove("none");
  } else {
    document.getElementById("username").innerText = profil.data.getProfile.affectedRows.username;
    document.getElementById("slug").innerText = "#" + profil.data.getProfile.affectedRows.slug;
    document.getElementById("userPosts").innerText = profil.data.getProfile.affectedRows.amountposts;
    document.getElementById("followers").innerText = profil.data.getProfile.affectedRows.amountfollower;
    document.getElementById("following").innerText = profil.data.getProfile.affectedRows.amountfollowed;
    const img = document.getElementById("profilbild");
    img.onerror = function () {
      this.src = "svg/noname.svg";
    };
    img.src = profil.data.getProfile.affectedRows.img ? tempMedia(profil.data.getProfile.affectedRows.img.replace("media/", "")) : "svg/noname.svg";
  }
  return profil;
}
