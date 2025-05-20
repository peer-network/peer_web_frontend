async function getPosts(offset, limit, filter, title = "", tag = null, sortby = "NEWEST") {
  const accessToken = getCookie("authToken");

  // Create headers
  const headers = new Headers({
    "Content-Type": "application/json",
    Authorization: `Bearer ${accessToken}`,
  });
  title = sanitizeString(title);
  if (!sortby) sortby = "NEWEST";
  let searchstr = `query ListPosts {
    listPosts(
      sortBy: ${sortby},
      limit: ${limit},
      offset: ${offset},
      filterBy: [${filter}],`;
  searchstr += tag && tag.length >= 3 ? `,tag: "${tag}"` : "";
  searchstr += title && title.length >= 2 ? `,title: "${title}"` : "";
  searchstr += `) {
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
    query: searchstr,
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
      return result;
    })
    .catch((error) => {
      console.log("error", error);
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
    query: `mutation ResolveActionPost {
        resolveActionPost(postid: "${postid}", action: VIEW) {
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
      if (result.data.resolveActionPost.status == "error") {
        throw new Error(result.data.resolveActionPost.ResponseCode);
      } else {
        return true;
      }
    })
    .catch((error) => {
      Merror("Like failed", error);
      console.log("error", error);
      return false;
    });
}

function likePost(postid) {
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
    query: `mutation ResolveActionPost {
        resolveActionPost(postid: "${postid}", action: LIKE) {
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
      if (result.data.resolveActionPost.status == "error") {
        throw new Error(result.data.resolveActionPost.ResponseCode);
      } else {
        return true;
      }
    })
    .catch((error) => {
      Merror("Like failed", error);
      console.log("error", error);
      return false;
    });
}
async function dislikePost(postid) {
  const accessToken = getCookie("authToken");

  // Create headers
  const headers = new Headers({
    "Content-Type": "application/json",
    Authorization: `Bearer ${accessToken}`,
  });

  var graphql = JSON.stringify({
    query: `mutation DislikePost {
        dislikePost(input: { postid: "${postid}" }) {
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
    .catch((error) => console.log("error", error));
}

function isVariableNameInArray(variableObj, nameArray) {
  return Object.keys(variableObj).some((key) => key.includes(nameArray));
}
async function sendCreatePost(variables) {
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
      throw new Error(result.data.createPost.ResponseCode);
    } else return result.data;
  } catch (error) {
    Merror("Create Post failed", error);
    console.error("Error create Post:", error);
    return false;
  }
}
