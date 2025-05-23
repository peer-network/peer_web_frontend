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
      console.log(json.data);
    return json.data;
  },

  async getCurrentUserId() {
    const cookieMatch = document.cookie.match(/(?:^|;\s*)userID=([^;]+)/);
    if (cookieMatch) return cookieMatch[1];

    const result = await ChatApp.api.fetchGraphQL(`query { currentuserid }`);
    const userId = result?.currentuserid;
    if (userId) document.cookie = `userID=${userId}; path=/; SameSite=Strict`;
    return userId;
  },
};