window.ChatApp = window.ChatApp || {};

ChatApp.graphql = {


  LIST_FRIENDS: `
    query ListFriends {
      listFriends {
        affectedRows {
          userid
          img
          username
        }
      }
    }`,

  GET_PROFILE: `
    query GetProfile {
      getProfile {
          status
          ResponseCode
          affectedRows {
              id
              img
          }
      }
    }`
  };