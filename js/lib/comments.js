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
  return fetch(GraphGL, requestOptions)
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

async function createComment(postid, content, parentId = null) {
  const accessToken = getCookie("authToken");

  // Create headers
  const headers = new Headers({
    "Content-Type": "application/json",
    Authorization: `Bearer ${accessToken}`,
  });

  const mutation = `mutation CreateComment($input: CreateCommentInput!) {
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

  return fetch(GraphGL, {
    method: "POST",
    headers: headers,
    body: JSON.stringify({
      query: mutation,
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
async function fetchChildComments(parentId) {
  // Definiere den GraphQL-Query mit einer Variablen
  const accessToken = getCookie("authToken");

  // Create headers
  const headers = new Headers({
    "Content-Type": "application/json",
    Authorization: `Bearer ${accessToken}`,
  });

  const query = `
  query Parentcomments($parent: ID!) {
    parentcomments(parent: $parent) {
        status
        counter
        ResponseCode
        affectedRows {
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
  }`;
  // Setze die Variable für den Request
  const variables = { parent: parentId };

  // Ersetze die URL mit der deines GraphQL-Endpunkts
  return fetch(GraphGL, {
    method: "POST",
    headers: headers,
    body: JSON.stringify({ query, variables }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Antwort vom Server:", data);
      if (data.data.parentcomments.status === "error") {
        throw new Error(data.data.parentcomments.ResponseCode);
      } else {
        return data.data.parentcomments.affectedRows;
      }
    })
    .catch((error) => {
      console.error("Fehler:", error);
      return null;
    });
}

// Beispielaufruf der Funktion
// fetchParentcomments("c85fa56c-262b-464d-a165-3dca9b767605");
