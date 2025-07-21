"use strict";

function scheduleSilentRefresh(accessToken, refreshToken) {
  try {
    const payload = JSON.parse(atob(accessToken.split('.')[1]));
    const exp = payload.exp * 1000;
    const buffer = (3* 60) * 1000; // refresh 1 min before expiry
    const refreshIn = exp - Date.now() - buffer;

    if (refreshIn <= 0) return;

    setTimeout(async () => {
      const newAccessToken = await refreshAccessToken(refreshToken);
      if (newAccessToken) {
        const newRefreshToken = localStorage.getItem("refreshToken") || sessionStorage.getItem("refreshToken");
        scheduleSilentRefresh(newAccessToken, newRefreshToken);
      }
    }, refreshIn);
  } catch (err) {
    console.error("Error in scheduling token refresh:", err);
  }
}

async function refreshAccessToken(refreshToken) {
  const headers = new Headers({
    "Content-Type": "application/json",
  });

  const graphql = JSON.stringify({
    query: `mutation RefreshToken {
      refreshToken(refreshToken: "${refreshToken}") {
        status
        ResponseCode
        accessToken
        refreshToken
      }
    }`,
  });

  const requestOptions = {
    method: "POST",
    headers,
    body: graphql,
    redirect: "follow",
  };

  try {
    const response = await fetch(GraphGL, requestOptions);
    const result = await response.json();

    if (response.ok && result.data && result.data.refreshToken) {
      const {
        status,
        ResponseCode,
        accessToken,
        refreshToken: newRefreshToken
      } = result.data.refreshToken;

      if (status !== "success" || ResponseCode !== "10801") {
        throw new Error("Refresh failed with code: " + ResponseCode);
      }

      // Store updated tokens
      const storage = localStorage.getItem('userEmail') ? localStorage : sessionStorage;
      storage.setItem('accessToken', accessToken);
      storage.setItem('refreshToken', newRefreshToken);

      document.cookie = `authToken=${accessToken}; path=/; secure; SameSite=Strict`;
      document.cookie = `refreshToken=${newRefreshToken}; path=/; secure; SameSite=Strict`;

      return accessToken;
    } else {
      throw new Error("Invalid response from refresh mutation");
    }
  } catch (error) {
    console.error("Refresh token error:", error);
    return null;
  }
}
