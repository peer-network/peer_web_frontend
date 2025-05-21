window.listPosts = async function getPosts(tagName) {
  console.log("Fetching posts for tag:", tagName);

  // Your GraphQL or fetch logic here...
};


async function getPosts(offset, limit, filterBy, title = "", tag = null, sortby = "NEWEST") {
const post = 2;
const like = 0;
const dislike = 3;
const comment = 1;

async function getPosts(offset, limit, filter, title = "", tag = null, sortby = "NEWEST") {
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
      filterBy: [${filterBy}],`;
  postsList += (tag && tag.length >= 2) ? `, tag: "${tag}"` : "";
  postsList += `) {
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
            }
        }
    }
}
`;
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
function viewPost(postid) {
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
  if (!(await LiquiudityCheck(10, "Like Post", like))) {
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
  if (!(await LiquiudityCheck(5, "Dislike Post", dislike))) {
    return false;
  }
  const accessToken = getCookie("authToken");

  // Create headers
  const headers = new Headers({
    "Content-Type": "application/json",
    Authorization: `Bearer ${accessToken}`,
  });

  var graphql = JSON.stringify({
    query: `mutation DeletePost {
        deletePost(input: { postid: "${postid}" }) {
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

  fetch(GraphGL, requestOptions)
    .then((response) => response.text())
    .then((result) => console.log(result))
    .catch((error) =>  Merror("Dislike failed", error));
}

function isVariableNameInArray(variableObj, nameArray) {
  return Object.keys(variableObj).some((key) => key.includes(nameArray));
}
async function LiquiudityCheck(postCosts, title, action) {
  const msg = ["like", "comment", "post"];
  const cancel = 0;
  const dailyfree = await getDailyFreeStatus();
  const dailyPostAvailable = dailyfree[action].available;
  const bitcoinPrice = await getBitcoinPriceEUR();
  const tokenPrice = 100000 / bitcoinPrice;
  const token = await getLiquiudity();
  if (!dailyPostAvailable && token * tokenPrice < postCosts) {
    Merror(
      title,
      `You need ${(postCosts * tokenPrice).toFixed(2)} Peer Tokens to ${msg[action]}.
      You currently have ${token} Peer Tokens.`
    );
    return false;
  } else if (!dailyPostAvailable && token * tokenPrice >= postCosts) {
    let answer = await confirm(
      title,
      `You currently have ${token} Peer Tokens.
       This ${msg[action]} will cost ${(postCosts * tokenPrice).toFixed(2)} Peer Tokens.`
    );
    if (answer === null || answer === cancel) {
      return false;
    }
    return true;
  }
}
async function sendCreatePost(variables) {
  if (!(await LiquiudityCheck(20, "Create Post", post))) {
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
    console.log("Mutation Result:", result.data);

    if (result.data.createPost.status == "error") {
      throw new Error(userfriendlymsg(result.data.createPost.ResponseCode));
    } else return result.data;
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
    console.log(`1 BTC = ${data.bitcoin.eur} EUR`);
    return data.bitcoin.eur;
  } catch (err) {
    console.error("Fehler beim Abrufen des Bitcoin-Kurses:", err);
  }
}
