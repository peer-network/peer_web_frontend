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
  fetch("https://peer-network.eu/graphql", requestOptions)
    .then((response) => response.text())
    .then((result) => console.log(result))
    .catch((error) => console.log("error", error));
}
async function addComment(postid, content) {
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
  fetch("https://peer-network.eu/graphql", requestOptions)
    .then((response) => response.text())
    .then((result) => console.log(result))
    .catch((error) => console.log("error", error));
}
function createComment(postid, content) {
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
      parentid: null,
      content: content,
    },
  };

  fetch(url, {
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
    })
    .catch((error) => {
      console.error("Fehler:", error);
    });
}
