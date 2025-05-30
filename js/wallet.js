let balance = null;
let userOffset = 1;
let isFetchingUsers = false;
let hasMoreUsers = true;
let isInvited = "";

// getLiquiuditygetUser();
dailyfree();
//balance();
currentliquidity();
nextmint();
dailywin();
dailypays();
getUserInfo();

async function getUserInfo() {
  const accessToken = getCookie("authToken");

  // Create headers
  const headers = new Headers({
    "Content-Type": "application/json",
    Authorization: `Bearer ${accessToken}`,
  });

  // Define the GraphQL mutation with variables
  const graphql = JSON.stringify({
    query: `query GetUserInfo {
    getUserInfo {
        status
        ResponseCode
        affectedRows {
            userid
            liquidity
            amountposts
            amountblocked
            amountfollower
            amountfollowed
            amountfriends
            updatedat
            invited
        }
    }
}`,
  });

  // Define request options
  const requestOptions = {
    method: "POST",
    headers: headers,
    body: graphql
  };

  try {
    // Send the request and handle the response
    const response = await fetch(GraphGL, requestOptions);

    // Check for errors in response
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    const result = await response.json();
    // Check for errors in GraphQL response
    if (result.errors) throw new Error(result.errors[0].message);
    isInvited = result.data.getUserInfo.affectedRows.invited;
  } catch (error) {
    console.error("Error:", error.message);
    throw error;
  }
}

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
  if (balance === null) balance = await getLiquiudity()

  document.getElementById("token").innerText = balance;
  const formatted = (balance * 0.1).toFixed(2).replace(".", ",") + " €";
  document.getElementById("money").innerText = formatted;

  return balance
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

document.getElementById("openTransferDropdown").addEventListener("click", async () => {
  const dropdown = document.getElementById("transferDropdown");

  if (!dropdown.classList.contains("hidden")) {
    closeModal();
    return;
  }

  // Setup modal
  dropdown.classList.remove("hidden");
  dropdown.classList.add("modal-mode");
  if (!document.querySelector(".transfer-backdrop")) {
    const backdrop = document.createElement("div");
    backdrop.className = "transfer-backdrop";
    backdrop.onclick = closeModal;
    document.body.appendChild(backdrop);
  }

  // Reset scroll pagination
  userOffset = 1;
  isFetchingUsers = false;
  hasMoreUsers = true;
  dropdown.innerHTML = "";

  // Create wrapper
  const wrapper = document.createElement("div");
  wrapper.className = "transfer-form-screen";

  // Header
  const header = document.createElement("div");
  header.className = "transfer-header";
  const h2 = document.createElement("h2");
  h2.textContent = "Transfer";
  const closeBtn = document.createElement("button");
  closeBtn.className = "close-transfer btn-white";
  closeBtn.innerHTML = "&times;";
  closeBtn.onclick = closeModal;
  header.append(h2, closeBtn);
  wrapper.appendChild(header);

  // ✅ Create and append search bar FIRST
  const searchBar = document.createElement("input");
  searchBar.type = "text";
  searchBar.id = "userSearch";
  searchBar.placeholder = "Search user...";
  searchBar.style.marginBottom = "10px"; // Optional styling
  wrapper.appendChild(searchBar);

  // ✅ Create and append container AFTER search bar
  const container = document.createElement("div");
  container.className = "user-list";
  container.id = "userListContainer";
  wrapper.appendChild(container);

  // ✅ Hook up the search listener
  searchBar.addEventListener("input", () => {
    searchUser(container, searchBar.value.trim());
  });

  // Append wrapper to dropdown
  dropdown.appendChild(wrapper);

  // Load users
  await loadUsers(container);

  // Scroll pagination
  dropdown.addEventListener("scroll", async () => {
    const nearBottom =
      dropdown.scrollTop + dropdown.clientHeight >= dropdown.scrollHeight - 50;
    if (nearBottom && !isFetchingUsers && hasMoreUsers) {
      await loadUsers(container);
    }
  });
});


function searchUser(container, query) {
  const items = container.querySelectorAll(".user-item");
  const lowerQuery = query.toLowerCase();

  items.forEach(item => {
    const nameEl = item.querySelector(".info strong");
    const name = nameEl ? nameEl.textContent.toLowerCase() : "";

    item.style.display = name.includes(lowerQuery) ? "" : "none";
  });
}

function renderTransferFormView(user) {
  const dropdown = document.getElementById("transferDropdown");
  dropdown.innerHTML = "";

  // Enable modal mode
  dropdown.classList.add("modal-mode");
  dropdown.classList.remove("hidden");

  // Add backdrop
  if (!document.querySelector(".transfer-backdrop")) {
    const backdrop = document.createElement("div");
    backdrop.className = "transfer-backdrop";
    backdrop.onclick = closeModal;
    document.body.appendChild(backdrop);
  }

  const wrapper = document.createElement("div");
  wrapper.className = "transfer-form-screen";

  const header = document.createElement("div");
  header.className = "transfer-header";
  const h2 = document.createElement("h2");
  h2.textContent = "Transfer";
  const closeBtn = document.createElement("button");
  closeBtn.className = "close-transfer";
  closeBtn.innerHTML = "&times;";
  closeBtn.onclick = closeModal;
  header.append(h2, closeBtn);

  const recipientLabel = document.createElement("label");
  recipientLabel.textContent = "Recipient";
  const recipientInfo = document.createElement("div");
  recipientInfo.className = "recipient-info";
  const infoWrap = document.createElement("div");
  infoWrap.className = "info";
  const img = document.createElement("img");
  img.src = "svg/logo_sw.svg";
  const meta = document.createElement("div");
  const name = document.createElement("strong");
  name.textContent = user.username;
  const slug = document.createElement("span");
  slug.textContent = "#" + user.slug;
  meta.append(name, slug);
  infoWrap.append(img, meta);
  const check = document.createElement("div");
  check.className = "check-circle";
  check.textContent = "✓";
  recipientInfo.append(infoWrap, check);

  const amountLabel = document.createElement("label");
  amountLabel.textContent = "Amount";
  const amountWrap = document.createElement("div");
  amountWrap.className = "amount-input";
  const input = document.createElement("input");
  input.type = "number";
  input.placeholder = "1234";
  input.id = "transferAmount";
  const icon = document.createElement("img");
  icon.src = "svg/logo_sw.svg";
  amountWrap.append(input, icon);

  const feeLabel = document.createElement("div");
  feeLabel.className = "fee-label";
  feeLabel.textContent = "Price fee: 0.4% would apply";

  const actions = document.createElement("div");
  actions.className = "modal-actions";
  const backBtn = document.createElement("button");
  backBtn.className = "btn-back";
  backBtn.textContent = "Back";
  backBtn.onclick = () => {
    closeModal();
    document.getElementById("openTransferDropdown").click();
  };
  const nextBtn = document.createElement("button");
  nextBtn.className = "btn-next btn-blue";
  nextBtn.textContent = "Next";
  nextBtn.onclick = () => {
    const raw = input.value.trim();
    if (!raw) return alert("Enter an amount");
    const amount = parseFloat(raw);
    if (isNaN(amount)) return alert("Invalid amount");
    renderCheckoutScreen(user, amount);
  };

  actions.append(backBtn, nextBtn);
  wrapper.append(header, recipientLabel, recipientInfo, amountLabel, amountWrap, feeLabel, actions);
  dropdown.appendChild(wrapper);
}

function renderCheckoutScreen(user, amount) {
  const dropdown = document.getElementById("transferDropdown");
  dropdown.innerHTML = "";
  dropdown.classList.add("modal-mode");

  if (!document.querySelector(".transfer-backdrop")) {
    const backdrop = document.createElement("div");
    backdrop.className = "transfer-backdrop";
    backdrop.onclick = closeModal;
    document.body.appendChild(backdrop);
  }

  const totalAmount = calculateTotalWithFee(amount, isInvited);
  const { breakdown } = getCommissionBreakdown(amount);

  const wrapper = document.createElement("div");
  wrapper.className = "transfer-form-screen";

  // Header
  const header = document.createElement("div");
  header.className = "transfer-header";
  const h2 = document.createElement("h2");
  h2.textContent = "Checkout";
  const closeBtn = document.createElement("button");
  closeBtn.className = "close-transfer btn-white";
  closeBtn.innerHTML = "&times;";
  closeBtn.onclick = closeModal;
  header.append(h2, closeBtn);

  // Recipient
  const recipientLabel = document.createElement("label");
  recipientLabel.textContent = "Recipient";
  const recipientInfo = document.createElement("div");
  recipientInfo.className = "recipient-info";
  const infoWrap = document.createElement("div");
  infoWrap.className = "info";
  const img = document.createElement("img");
  // img.src = user.img || "svg/logo_sw.svg";
  img.src = "svg/logo_sw.svg";
  const meta = document.createElement("div");
  const name = document.createElement("strong");
  name.textContent = user.username;
  const slug = document.createElement("span");
  slug.textContent = "#" + user.slug;
  meta.append(name, slug);
  infoWrap.append(img, meta);
  recipientInfo.append(infoWrap, recipientLabel);

  // Amount
  const amountLabel = document.createElement("label");
  amountLabel.textContent = "Amount including fees";
  const amountWrap = document.createElement("div");
  amountWrap.className = "amount-input";
  const value = document.createElement("strong");
  value.innerHTML = `${(totalAmount).toFixed(2)} <img src="svg/logo_sw.svg" style="height: 20px;" />`;
  amountWrap.appendChild(value);
  amountWrap.appendChild(amountLabel);

  // Commission Breakdown
  const commissionSection = document.createElement("div");
  commissionSection.className = "commission-breakdown";

  const commissionTitle = document.createElement("div");
  commissionTitle.className = "fee-label";
  commissionTitle.textContent = "Commission";
  commissionSection.appendChild(commissionTitle);

  breakdown.forEach(detail => {
  const row = document.createElement("div");
  row.className = "row";

  const label = document.createElement("span");
  label.textContent = detail.label;

  const amountEl = document.createElement("span");
  amountEl.innerHTML = `${detail.amount.toFixed(2)} <img src="svg/logo_sw.svg" style="height: 16px;" />`;

  row.append(label, amountEl);
  commissionSection.appendChild(row);
});

  // Actions
  const actions = document.createElement("div");
  actions.className = "modal-actions";

  const backBtn = document.createElement("button");
  backBtn.className = "btn-back";
  backBtn.textContent = "Back";
  backBtn.onclick = () => renderTransferFormView(user);

  const transferBtn = document.createElement("button");
  transferBtn.className = "btn-next";
  transferBtn.innerHTML = `Transfer &rarr;`;

  transferBtn.onclick = async () => {
    const totalAmount = calculateTotalWithFee(parseFloat(amount), isInvited);
    if (balance < totalAmount) {
      const confirmContinue = await confirm("You don't have enough balance. Do you still want to try?");
      if (!confirmContinue) return;
      balance = await getLiquiudity();
      if (balance < totalAmount) {
        info("Still insufficient balance.");
        return;
      }
    }

    try {
      const res = await resolveTransfer(user.id, totalAmount);
      if (res.status === "success") {
        alert("Transfer successful!");
      } else {
        alert(`Transfer failed: ${res.ResponseCode}`);
      }
    } catch (err) {
      alert("Transfer error occurred.");
      console.error(err);
    }

    closeModal();
  };

  actions.append(backBtn, transferBtn);

  // Append all elements
  wrapper.append(
    header,
    recipientInfo,
    amountLabel,
    amountWrap,
    commissionSection,
    actions
  );
  dropdown.appendChild(wrapper);
}

async function resolveTransfer(recipientId, numberOfTokens) {
  const accessToken = getCookie("authToken");

  const headers = new Headers({
    "Content-Type": "application/json",
    Authorization: `Bearer ${accessToken}`,
  });

  const graphql = JSON.stringify({
    query: `
      mutation ResolveTransfer($recipient: ID!, $numberoftokens: Int!) {
        resolveTransfer(recipient: $recipient, numberoftokens: $numberoftokens) {
          status
          ResponseCode
        }
      }
    `,
    variables: {
      recipient: recipientId,
      numberoftokens: parseInt(numberOfTokens, 10),
    },
  });

  const response = await fetch(GraphGL, {
    method: "POST",
    headers,
    body: graphql,
  });

  const result = await response.json();

  if (result.errors) {
    console.error("GraphQL Error:", result.errors);
    throw new Error(result.errors[0].message);
  }

  return result.data.resolveTransfer;
}

async function listUsers(offset = 1, limit = 20) {
  const accessToken = getCookie("authToken");

  const headers = new Headers({
    "Content-Type": "application/json",
    Authorization: `Bearer ${accessToken}`,
  });

  const graphql = JSON.stringify({
    query: `query ListUsers($offset: Int, $limit: Int) {
      listUsers(offset: $offset, limit: $limit) {
        affectedRows {
          id
          username
          status
          slug
          img
        }
      }
    }`,
    variables: {
      offset,
      limit
    },
  });

  const res = await fetch(GraphGL, {
    method: "POST",
    headers,
    body: graphql
  });
  const json = await res.json();
  return json ?.data ?.listUsers ?.affectedRows || [];
}

function calculateTotalWithFee(amount, isInvited) {

 const feePercent = isInvited === "" ? 0.04 : 0.05;
  const fee = amount * feePercent;
  return parseFloat(amount + fee);
}

function getCommissionBreakdown(transferAmount, isInvited = "") {
  const baseAmount = transferAmount;
  const breakdown = [];

  // Mandatory fees (always included)
  const platformFee = baseAmount * 0.02;
  const liquidityFee = baseAmount * 0.01;
  const burnFee = baseAmount * 0.01;

  breakdown.push(
    { label: "2% retained by the platform", amount: platformFee },
    { label: "1% is allocated to a liquidity pool", amount: liquidityFee },
    { label: "1% is burned, ensuring deflation", amount: burnFee }
  );

  let inviterFee = 0;
  if (isInvited !== "") {
    inviterFee = baseAmount * 0.01;
    breakdown.push({
      label: "1% is given back to inviter",
      amount: inviterFee
    });
  }

  const totalCommission = platformFee + liquidityFee + burnFee + inviterFee;
  const totalUsed = baseAmount + totalCommission;

  return {
    sentToFriend: baseAmount,
    breakdown,
    totalCommission,
    totalUsed
  };
}

function closeModal() {
  const dropdown = document.getElementById("transferDropdown");
  dropdown.classList.add("hidden");
  dropdown.classList.remove("modal-mode");

  const backdrop = document.querySelector(".transfer-backdrop");
  if (backdrop) backdrop.remove();
}

async function loadUsers(container) {
  isFetchingUsers = true;

  const users = await listUsers(userOffset, 20);
  if (users.length < 20) {
    hasMoreUsers = false;
  }

  users.forEach(user => {
    const item = document.createElement("div");
    item.className = "user-item";

    const avatar = document.createElement("img");
    avatar.src = "svg/logo_sw.svg";
    avatar.alt = user.username;

    const info = document.createElement("div");
    info.className = "info";
    const name = document.createElement("strong");
    name.textContent = user.username;
    // const slug = document.createElement("span");
    // slug.textContent = "#" + user.slug;
    // info.append(name, slug);
    info.append(name);

    item.append(avatar, info);
    item.addEventListener("click", () => {
      renderTransferFormView(user);
    });

    container.appendChild(item);
  });

  userOffset += 20;
  isFetchingUsers = false;
}
