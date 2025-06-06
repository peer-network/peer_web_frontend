async function likeComment(commentId) {
  if (!(await LiquiudityCheck(10, "Like Comment", like))) {
    return false;
  }
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
      if (result.data.likeComment.status == "error") {
        throw new Error(userfriendlymsg(result.data.likeComment.ResponseCode));
      } else {
        return true;
      }
    })
    .catch((error) => {
      // Merror("Like failed", error);
      Merror(userfriendlymsg(result.data.likeComment.ResponseCode));
      return false;
    });
}

async function createComment(postId, content, parentId = null) {
  if (!(await LiquiudityCheck(3, "Comment Post", 1))) {
    return false;
  }
  const accessToken = getCookie("authToken");

  // Create headers
  const headers = new Headers({
    "Content-Type": "application/json",
    Authorization: `Bearer ${accessToken}`,
  });

  const query = `
    mutation CreateComment($postId: ID!, $content: String!, $parentId: ID) {
      createComment(action: COMMENT, postid: $postId, content: $content, parentid: $parentId) {
        status
        counter
        ResponseCode
        affectedRows {
          commentid
          userid
          content
          createdat
          amountlikes
          isliked
          postid
          parentid
          user {
              id
              username
              slug
              img
              isfollowed
              isfollowing
          }
        }
      }
    }
  `;
  const variables = {
    postId,
    content,
    parentId,
  };

  return fetch(GraphGL, {
    method: "POST",
    headers: headers,
    body: JSON.stringify({
      query,
      variables,
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
  query listChildComments($parent: ID!) {
    listChildComments(parent: $parent) {
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
  const variables = {
    parent: parentId,
  };

  // Ersetze die URL mit der deines GraphQL-Endpunkts
  return fetch(GraphGL, {
    method: "POST",
    headers: headers,
    body: JSON.stringify({
      query,
      variables,
    }),
  })
    .then((response) => response.json())
    .then((res) => {
      // if (res.data.listChildComments.status === "error" && res.data.listChildComments.ResponseCode !== "This is not a commentId") {
      if (res.data.listChildComments.status === "error") {
        throw new Error(userfriendlymsg(res.data.listChildComments.ResponseCode));
      } else {
        return res.data.listChildComments.affectedRows;
      }
    })
    .catch((error) => {
      console.error("Fehler:", error);
      return null;
    });
}

// Beispielaufruf der Funktion
// fetchlistChildComments("c85fa56c-262b-464d-a165-3dca9b767605");
