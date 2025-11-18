window.moderationModule = window.moderationModule || {};

moderationModule.service = {
  async fetchGraphQL(query, variables = {}) {
    const token = helpers.getCookie?.("authToken"); // optional if auth
    const headers = new Headers({
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    });

    const response = await fetch(GraphGL, {
      method: "POST",
      headers,
      cache: "no-store",
      body: JSON.stringify({ query, variables }),
    });

    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const json = await response.json();

    if (json.errors) throw new Error(json.errors[0].message);
    return json.data;
  },
};