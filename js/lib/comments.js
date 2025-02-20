async function likeComment(commentId) {
  const accessToken = getCookie("authToken");

  // Create headers
  const headers = new Headers({
    "Content-Type": "application/json",
    Authorization: `Bearer ${accessToken}`,
  });

  // 2. GraphQL Body erstellen
  var graphql = JSON.stringify({
    query: `mutation LikeComment {
            likeComment(commentid: "${commentId}") {
                status
                ResponseCode
            }
        }`,
    variables: {},
  });

  // 3. Request-Options definieren
  var requestOptions = {
    method: "POST",
    headers: headers,
    body: graphql,
    redirect: "follow",
  };

  // 4. fetch aufrufen
  return fetch("https://peer-network.eu/graphql", requestOptions)
    .then((response) => response.json())
    .then((result) => {
      console.log(result);
      if (result.data.likeComment.status == "error") {
        throw new Error(result.data.likeComment.ResponseCode);
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
// async function addComment(postid, content) {
//   const accessToken = getCookie("authToken");

//   // Create headers
//   const headers = new Headers({
//     "Content-Type": "application/json",
//     Authorization: `Bearer ${accessToken}`,
//   });

//   // 2. GraphQL Body erstellen
//   var graphql = JSON.stringify({
//     query: `mutation LikeComment {
//               likeComment(commentid: "${commentId}") {
//                   status
//                   ResponseCode
//               }
//           }`,
//     variables: {},
//   });

//   // 3. Request-Options definieren
//   var requestOptions = {
//     method: "POST",
//     headers: headers,
//     body: graphql,
//     redirect: "follow",
//   };

//   // 4. fetch aufrufen
//   fetch("https://peer-network.eu/graphql", requestOptions)
//     .then((response) => response.text())
//     .then((result) => console.log(result))
//     .catch((error) => console.log("error", error));
// }
async function createComment(postid, content, parentId = null) {
  const accessToken = getCookie("authToken");

  // Create headers
  const headers = new Headers({
    "Content-Type": "application/json",
    Authorization: `Bearer ${accessToken}`,
  });
  const url = "https://peer-network.eu/graphql";
  const mutation = `
        mutation CreateComment($input: CreateCommentInput!) {
            createComment(input: $input) {
                status
                ResponseCode
                affectedRows {
                    commentid
                    userid
                    postid
                    parentid
                    content
                    createdat
                }
            }
        }
    `;
  const mutation2 = `mutation CreateComment($input: CreateCommentInput!) {
                      createComment(
                          action: COMMENT
                          input: $input
                      ) {
                          status
                          ResponseCode
                          affectedRows
                      }
                  }`;
  const variables = {
    input: {
      postid: postid,
      parentid: parentId,
      content: content,
    },
  };

  return fetch(url, {
    method: "POST",
    headers: headers,
    body: JSON.stringify({
      query: mutation2,
      variables: variables,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Antwort:", data);
      return data;
    })
    .catch((error) => {
      console.error("Fehler:", error);
      return error;
    });
}
