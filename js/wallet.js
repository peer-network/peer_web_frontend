// getLiquiuditygetUser();
dailyfree();
// balance();
currentliquidity();
nextmint();
dailywin();
dailypays();

async function getLiquiudity() {
  const accessToken = getCookie("authToken");

  // Create headers
  const headers = new Headers({
    "Content-Type": "application/json",
    Authorization: `Bearer ${accessToken}`,
  });

  // Define the GraphQL mutation with variables
  const graphql = JSON.stringify({
    query: `query Balance {
    balance {
        status
        ResponseCode
        currentliquidity
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
    const response = await fetch(GraphGL, requestOptions);

    // Check for errors in response
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    const result = await response.json();
    // Check for errors in GraphQL response
    if (result.errors) throw new Error(result.errors[0].message);
    return result.data.balance.currentliquidity;
  } catch (error) {
    console.error("Error:", error.message);
    throw error;
  }
}
async function currentliquidity() {
  const token = await getLiquiudity();

  if (token !== null) {
    document.getElementById("token").innerText = token;
    const formatted = (token * 0.1).toFixed(2).replace(".", ",") + " €";
    document.getElementById("money").innerText = formatted;
  }
}
async function getDailyFreeStatus() {
  const accessToken = getCookie("authToken");

  // Create headers
  const headers = new Headers({
    "Content-Type": "application/json",
    Authorization: `Bearer ${accessToken}`,
  });

  // Define the GraphQL mutation with variables
  const graphql = JSON.stringify({
    query: `query Dailyfreestatus {
    getDailyFreeStatus {
      status
      ResponseCode
      affectedRows {
        name
        used
        available
      }
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
    const response = await fetch(GraphGL, requestOptions);
    const result = await response.json();

    // Check for errors in response
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    if (result.errors) throw new Error(result.errors[0].message);
    return result.data.getDailyFreeStatus.affectedRows;
  } catch (error) {
    console.error("Error:", error.message);
    throw error;
  }
}
async function dailyfree() {
  const result = await getDailyFreeStatus();

  if (result !== null) {
    result.forEach((entry) => {
      document.getElementById(entry.name + "used").innerText = entry.used;
      document.getElementById(entry.name + "available").innerText = entry.available;
      const percentage = entry.available === 0 ? 0 : 100 - (entry.used / (entry.available + entry.used)) * 100;
      document.getElementById(entry.name + "Stat").style.setProperty("--progress", percentage + "%");
      // console.log(`Name: ${entry.name}, Used: ${entry.used}, Available: ${entry.available}`);
    });
    return result;
  }
}
function nextmint() {
  const now = new Date();
  const nextMintDate = getNext0930(); // Funktion aufrufen, um das nächste 09:30 zu erhalten
  const dif = nextMintDate - now; // Differenz in Millisekunden
  const seconds = Math.floor((dif / 1000) % 60);
  document.getElementById("nextmintseconds").innerText = String(seconds).padStart(2, "0");
  const minutes = Math.floor((dif / (1000 * 60)) % 60);
  document.getElementById("nextmintminutes").innerText = String(minutes).padStart(2, "0");
  const hours = Math.floor((dif / (1000 * 60 * 60)) % 24);
  document.getElementById("nextminthours").innerText = String(hours).padStart(2, "0");
  document.getElementById("nextminttime").innerText = String(hours).padStart(2, "0") + ":" + String(minutes).padStart(2, "0") + ":" + String(seconds).padStart(2, "0");
  document.getElementById("nextmintRadial").style.setProperty("--progress", percentageOfDayFromDates(now, nextMintDate));
}
function percentageOfDayFromDates(startDate, endDate) {
  const diffMs = endDate - startDate;
  const oneDayMs = 24 * 60 * 60 * 1000;
  return (diffMs / oneDayMs) * 100;
}
function getNext0930() {
  const now = new Date();

  const next0930 = new Date(now);
  next0930.setHours(9, 30, 0, 0); // heute um 09:30

  if (now >= next0930) {
    // Wenn 09:30 heute schon vorbei ist → morgen
    next0930.setDate(next0930.getDate() + 1);
  }

  return next0930;
}

async function dailywin() {
  const accessToken = getCookie("authToken");

  // Create headers
  const headers = new Headers({
    "Content-Type": "application/json",
    Authorization: `Bearer ${accessToken}`,
  });

  // Define the GraphQL mutation with variables
  const graphql = JSON.stringify({
    query: `query ListWinLogs {
      listWinLogs(day: D0) {
        affectedRows {
            from
            token
            userid
            postid
            action
            numbers
            createdat
        }
        status
        counter
        ResponseCode
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
    const response = await fetch(GraphGL, requestOptions);
    const result = await response.json();

    // Check for errors in response
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    if (result.errors) throw new Error(result.errors[0].message);
    const sortedDescending = result.data.listWinLogs.affectedRows.slice().sort((a, b) => new Date(b.createdat).getTime() - new Date(a.createdat).getTime());
    sortedDescending.forEach((entry) => {
      const historyItem = document.createElement("div");
      historyItem.className = "history-item";

      const typeDiv = document.createElement("div");
      typeDiv.className = "type";
      typeDiv.textContent = entry.action == 2 ? "Like" : entry.action == 5 ? "Post create" : entry.action == 4 ? "Comment" : "unknown";

      const dateDiv = document.createElement("div");
      dateDiv.className = "date";
      dateDiv.textContent = adjustForDSTAndFormat(entry.createdat); // Formatieren des Datums

      const centerDiv = document.createElement("div");
      centerDiv.className = "center";

      const amountSpan = document.createElement("span");
      amountSpan.className = "amount";
      amountSpan.textContent = entry.numbers.toString().replace(/,/g, ".");

      const logoImg = document.createElement("img");
      logoImg.src = "svg/logo_sw.svg";
      logoImg.alt = "";

      centerDiv.appendChild(amountSpan);
      centerDiv.appendChild(logoImg);

      historyItem.appendChild(typeDiv);
      historyItem.appendChild(dateDiv);
      historyItem.appendChild(centerDiv);

      // Füge das Element z. B. zu einem Container im DOM hinzu

      document.getElementById("history-container").appendChild(historyItem);
    });

    return result.data.fetchwinslog;
  } catch (error) {
    console.error("Error:", error.message);
    throw error;
  }
}
async function dailypays() {
  const accessToken = getCookie("authToken");

  // Create headers
  const headers = new Headers({
    "Content-Type": "application/json",
    Authorization: `Bearer ${accessToken}`,
  });

  // Define the GraphQL mutation with variables
  const graphql = JSON.stringify({
    query: `query ListPaymentLogs {
      listPaymentLogs(day: D0) {
        status
        counter
        ResponseCode
        affectedRows {
            from
            token
            userid
            postid
            action
            numbers
            createdat
        }
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
    const response = await fetch(GraphGL, requestOptions);
    const result = await response.json();

    // Check for errors in response
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    if (result.errors) throw new Error(result.errors[0].message);
    result.data.listPaymentLogs.affectedRows.forEach((entry) => {
      const historyItem = document.createElement("div");
      historyItem.className = "history-item";

      const typeDiv = document.createElement("div");
      typeDiv.className = "type";
      typeDiv.textContent = "Withdraw";

      const dateDiv = document.createElement("div");
      dateDiv.className = "date";
      dateDiv.textContent = "3 Feb 00:00";

      const centerDiv = document.createElement("div");
      centerDiv.className = "center";

      const amountSpan = document.createElement("span");
      amountSpan.className = "amount";
      amountSpan.textContent = "-1234";

      const logoImg = document.createElement("img");
      logoImg.src = "svg/logo_sw.svg";
      logoImg.alt = "";

      centerDiv.appendChild(amountSpan);
      centerDiv.appendChild(logoImg);

      historyItem.appendChild(typeDiv);
      historyItem.appendChild(dateDiv);
      historyItem.appendChild(centerDiv);

      // Füge das Element z. B. zu einem Container im DOM hinzu

      document.getElementById("history-container").appendChild(historyItem);
    });

    return result.data.listPaymentLogs;
  } catch (error) {
    console.error("Error:", error.message);
    throw error;
  }
}
