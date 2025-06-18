window.ChatApp = window.ChatApp || {};

ChatApp.api = {
  async fetchGraphQL(query, variables = {}) {

    const token = ChatApp.utils.getCookie("authToken");
    const headers = new Headers({
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    });

    const response = await fetch(GraphGL, {
      method: "POST",
      headers,
      cache: "no-store",
      body: JSON.stringify({ query, variables }),
    });

    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    const json = await response.json();
  
    if (json.errors) throw new Error(json.errors[0].message);
    return json.data;
  },
  
  async fetchUserProfile() {
    const result = await ChatApp.api.fetchGraphQL(ChatApp.graphql.GET_PROFILE);
    return result.getProfile.affectedRows;
  }
};