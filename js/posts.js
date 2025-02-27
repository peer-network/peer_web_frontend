async function getPosts(offset, limit, filter, title = "", tag = null) {
  const accessToken = getCookie("authToken");

  // Create headers
  const headers = new Headers({
    "Content-Type": "application/json",
    Authorization: `Bearer ${accessToken}`,
  });

  var graphql = JSON.stringify({
    query: `query Getallposts {
    getallposts(
      sortBy: NEWEST, 
      postLimit: ${limit}, 
      postOffset: ${offset}, 
      filterBy: [${filter}],        
      title: "${title}",
      tag: ${tag}
    ) {
        status
        ResponseCode
        affectedRows {
            id
            contenttype
            title
            media
            mediadescription
            createdat
            amountlikes
            amountviews
            amountcomments
            amountdislikes
            isliked
            isviewed
            isreported
            isdisliked
            issaved
            tags
            user {
                id
                username
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
                isliked
                createdat
                user {
                    id
                    username
                    img
                    isfollowed
                    isfollowing
                }
            }
        }
    }
}
`,
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
          affectedRows
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
          affectedRows
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

async function fetchPostData(postId) {
  const accessToken = getCookie("authToken");
  const query = `
            query getPost($id: ID!) {
                post(id: $id) {
                    comments {
                        commentid
                        userid
                        postid
                        parentid
                        content
                        amountlikes
                        isliked
                        createdat
                    }
                }
            }
        `;

  const variables = { id: postId };

  const headers = new Headers({
    "Content-Type": "application/json",
    Authorization: `Bearer ${accessToken}`,
  });

  return fetch("https://your-graphql-endpoint.com/graphql", {
    method: "POST",
    headers: headers,
    body: JSON.stringify({
      query,
      variables,
    }),
  })
    .then((response) => response.json())
    .then((result) => {
      if (result.errors) {
        console.error("GraphQL Fehler:", result.errors);
        return null;
      }
      return result.data.post;
    })
    .catch((error) => {
      console.error("Netzwerkfehler:", error);
      return null;
    });
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

  const query = `
    mutation CreatePost($title: String!, $media: String!, $mediadescription: String!, $contenttype: String!, $tags: [String!]) {
      createPost(
        action: POST
        input: {
          title: $title
          media: $media
          cover: null
          mediadescription: $mediadescription
          contenttype: $contenttype
          tags: $tags
        }
      ) {
        status
        ResponseCode
        affectedRows
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
