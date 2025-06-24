window.ChatApp = window.ChatApp || {};

ChatApp.graphql = {
  LIST_CHATS: `
    query ListChats {
      listChats (limit: 20, offset: 0) {
        affectedRows {
          id
          image
          name
          createdat
          updatedat
          chatmessages {
            id
            senderid
            chatid
            content
            createdat
          }
          chatparticipants {
            userid
            img
            username
            slug
            hasaccess
          }
        }
      }
    }`,

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

  SEND_MESSAGE: `
    mutation sendChatMessage($chatid: ID!, $content: String!) {
      sendChatMessage(chatid: $chatid, content: $content) {
        status
        ResponseCode
        affectedRows {
          content
          createdat
        }
      }
    }`,

  CREATE_CHAT: `
    mutation CreateChat($name: String!, $recipients: [String!]!, $image: String) {
      createChat(input: { name: $name, recipients: $recipients, image: $image }) {
        status
        ResponseCode
        affectedRows {
          chatid
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