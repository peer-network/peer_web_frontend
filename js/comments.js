async function likeComment(commentId) {
  // likeCost is a global variable and updated in global.js -> getActionPrices();
  if (!(await LiquiudityCheck(likeCost, "Like Comment", like))) {
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
document.querySelector("#comments").addEventListener("scroll",async function () {
  const amEnde = this.scrollTop + this.clientHeight >= this.scrollHeight;
  if (amEnde) {
    const container = document.querySelector("#comments");
    // const lastChild = container.lastElementChild;
    const directDivs = container.querySelectorAll(':scope > div');
    const count = directDivs.length;
    // const lastID = lastChild.getAttribute("id");
    const postIDContainer = document.getElementById("cardClicked");
    const postID = postIDContainer.getAttribute("postid");
    const newFetchChildComments = await fetchComments(postID, count);
    newFetchChildComments[0].comments
    .slice()
    .reverse()
    .forEach(function (c) {
      //console.log(c);
      commentToDom(c);
      fetchChildComments(c.commentid).then((result) => {
        if (!result) return;
        result.slice().forEach(function (c2) {
          commentToDom(c2, true);
        });
      });
    });
    // const query= `query ListChildComments2 {
    //     listChildComments(
    //         offset: 1
    //         limit: 10
    //         parent: "974f6aa8-3b29-4991-9d0f-ffaeaa7234de"
    //     ) {
    //         affectedRows {
    //             commentid
    //             userid
    //             postid
    //             parentid
    //             content
    //             createdat
    //             amountlikes
    //             amountreplies
    //             isliked
    //             user {
    //                 id
    //                 username
    //                 slug
    //                 img
    //                 isfollowed
    //                 isfollowing
    //             }
    //         }
    //         ResponseCode
    //     }
    //   }
    // `;
    // console.log("letztes comment:", lastID, "anzahl:", count);
  }
});
function getComments(){
  const container = document.querySelector("#comments");
  
}
function handleReply(comment) {
  const replyContainer = document.createElement("div");
  replyContainer.classList.add("comment_reply_container");
  const textarea = document.createElement("textarea");
  const button = document.createElement("button");
  button.classList.add("fi-ts-arrow-small-right");
  replyContainer.appendChild(textarea);
  replyContainer.appendChild(button);
  const replyBtn = document.getElementById(comment.commentid);
  const isexistreply = replyBtn.querySelector(".comment_reply_container textarea");
  const cBody = replyBtn.querySelector(".comment_reply_container");
  textarea.placeholder = "Write your reply here...";
  button.addEventListener("click", () => {
    const content = textarea.value;
    if (content) {
      createComment(comment.postid, content, comment.commentid).then((result) => {
        if (result && result.data?.createComment?.status === "success") {
          dailyfree();
          commentToDom(result.data.createComment.affectedRows[0], false);
          const textareas = document.querySelectorAll(".comment_reply_container textarea");
          textareas.forEach((textarea) => {
            textarea.remove();
          });
          const buttons = document.querySelectorAll(".comment_reply_container button");
          buttons.forEach((button) => {
            button.remove();
          });
          textarea.value = ""; // Clear textarea
        } else {
          const errorMsg = result?.errors?.[0]?.message || "Failed to post comment.";
          Merror("Error", errorMsg);
        }
      });
    }
  });
  if (!isexistreply) {
    cBody.prepend(replyContainer);
  }
  // console.log("Replying to comment:", comment);
}

async function createComment(postId, content, parentId = null) {
  // commentCost is a global variable and updated in global.js -> getActionPrices();
  if (!(await LiquiudityCheck(commentCost, "Comment Post", 1))) {
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
          amountreplies
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
  //console.log(query);

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
      //console.log("Antwort:", data);
      return data;
    })
    .catch((error) => {
      //console.error("Fehler:", error);
      return error;
    });
}
async function fetchChildComments(parentId, offset = 1) {
  // Definiere den GraphQL-Query mit einer Variablen
  const accessToken = getCookie("authToken");

  // Create headers
  const headers = new Headers({
    "Content-Type": "application/json",
    Authorization: `Bearer ${accessToken}`,
  });

  const query = `
  query listChildComments($parent: ID!, $offset: Int!) {
    listChildComments(parent: $parent, offset: $offset) {
        
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
    offset: offset
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
        console.log('res.data.listChildComments.affectedRows ', res.data.listChildComments.affectedRows)
        return res.data.listChildComments.affectedRows;
      }
    })
    .catch((error) => {
      console.error("Fehler:", error);
      return null;
    });
}
async function fetchComments(postID, commentOffset = 0) {
  // Definiere den GraphQL-Query mit einer Variablen
  const accessToken = getCookie("authToken");

  // Create headers
  const headers = new Headers({
    "Content-Type": "application/json",
    Authorization: `Bearer ${accessToken}`,
  });

  const query = `query ListPosts($postid: ID!, $commentOffset: Int!) {
    listPosts(postid: $postid, commentOffset: $commentOffset) {
        status
        counter
        ResponseCode
        affectedRows {
            title
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
}
`;

  // Setze die Variable für den Request
  const variables = {
    postid: postID,
    commentOffset: commentOffset
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
      if (res.data.listPosts.status === "error") {
        throw new Error(userfriendlymsg(res.data.listPosts.ResponseCode));
      } else {
        return res.data.listPosts.affectedRows;
      }
    })
    .catch((error) => {
      console.error("Fehler:", error);
      return null;
    });
}
// Beispielaufruf der Funktion
// fetchlistChildComments("c85fa56c-262b-464d-a165-3dca9b767605");
