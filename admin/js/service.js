window.moderationModule = window.moderationModule || {};

// Define GraphGL endpoint from config
const GraphGL = document.getElementById("config")?.dataset?.host + "/graphql";

moderationModule.service = {
  async fetchGraphQL(query, variables = {}) {
    const accessToken = getCookie("authToken");
    const headers = new Headers({
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    });

    const response = await fetch(GraphGL, {
      method: "POST",
      headers,
      cache: "no-store",
      body: JSON.stringify({ query, variables }),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const json = await response.json();

    if (json.errors) {
      throw new Error(json.errors[0].message);
    }

    return json.data;
  },
};

moderationModule.service.performModeration = async function (moderationTicketId, moderationAction) {
  const query = `
    mutation PerformModeration($id: ID!, $action: ModerationStatus!) {
      performModeration(
        moderationTicketId: $id
        moderationAction: $action
      ) {
        status
        RequestId
        ResponseCode
        ResponseMessage
      }
    }
  `;

  const variables = {
    id: moderationTicketId,
    action: moderationAction
  };

  try {
    const data = await moderationModule.service.fetchGraphQL(query, variables);
    return data.performModeration;
  } catch (err) {
    console.error("Moderation API error:", err);
    return null;
  }
};