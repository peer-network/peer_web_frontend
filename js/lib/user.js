async function fetchHelloData(userid = null) {
  const accessToken = getCookie("authToken");

  // Create headers
  const headers = new Headers({
    "Content-Type": "application/json",
    Authorization: `Bearer ${accessToken}`,
  });

  let graphql = JSON.stringify({
    query: `query Hello {
      hello {
          currentuserid
      }
      profile(userid: ${userid}) {
        status
        ResponseCode
        affectedRows {
            id
            username
            slug
            status
            img
            biography
            amountfollower
            amountfollowed
            amountposts
            isfollowed
            isfollowing
        }
      }
    }`,
    variables: {},
  });

  var requestOptions = {
    method: "POST",
    headers: headers,
    body: graphql,
    redirect: "follow",
  };

  try {
    const response = await fetch("https://peer-network.eu/graphql", requestOptions);
    const result_1 = await response.json();
    console.log(result_1);
    return result_1;
  } catch (error) {
    console.log("error", error);
    throw error;
  }
}
async function hello() {
  const accessToken = getCookie("authToken");

  // Create headers
  const headers = new Headers({
    "Content-Type": "application/json",
    Authorization: `Bearer ${accessToken}`,
  });

  // Define the GraphQL mutation with variables
  const graphql = JSON.stringify({
    query: `query Hello {
      hello {
          currentuserid
      }
  }`,
  });

  // Define request options
  const requestOptions = {
    method: "POST",
    headers: headers,
    body: graphql,
    redirect: "follow",
  };

  try {
    // Send the request and handle the response
    const response = await fetch("https://peer-network.eu/graphql", requestOptions);
    const result = await response.json();

    // Check for errors in response
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    if (result.errors) throw new Error(result.errors[0].message);

    document.cookie = `userID=${result.data.hello.currentuserid}; path=/; secure; SameSite=Strict`;
    return result.data.hello;
  } catch (error) {
    console.error("Error:", error.message);
    throw error;
  }
}
