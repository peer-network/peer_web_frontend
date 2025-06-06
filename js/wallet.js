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

document.getElementById("openTransferDropdown").addEventListener("click", async () => { renderUsers() });

async function renderUsers() {
  const dropdown = document.getElementById("transferDropdown");
  dropdown.innerHTML = "";
  dropdown.classList.remove("hidden");
  dropdown.classList.add("modal-mode");

  // Backdrop
  const existingBackdrop = document.querySelector(".transfer-backdrop");
  if (!existingBackdrop) {
    const backdrop = document.createElement("div");
    backdrop.className = "transfer-backdrop";
    backdrop.onclick = closeModal;
    document.body.appendChild(backdrop);
  }

  // Wrapper
  const wrapper = document.createElement("div");
  wrapper.className = "transfer-form-screen";

  // Header
  const header = document.createElement("div");
  header.className = "transfer-header";

  const h2 = document.createElement("h2");
  h2.textContent = "Transfer";

  const closeBtn = document.createElement("button");
  closeBtn.className = "close-transfer";
  closeBtn.innerHTML = "&times;";
  closeBtn.onclick = closeModal;

  header.append(h2, closeBtn);
  wrapper.appendChild(header);

  // Always-visible Search Input
  const searchInput = document.createElement("input");
  searchInput.type = "text";
  searchInput.placeholder = "@Search User";
  searchInput.className = "search-user-input";
  wrapper.appendChild(searchInput);

  // User results container
  const userList = document.createElement("div");
  userList.className = "user-list";
  wrapper.appendChild(userList);

  // Add new recipient button
  // const addNew = document.createElement("button");
  // addNew.className = "btn-new-user";
  // addNew.textContent = "Add new recipient +";
  // addNew.onclick = () => {
  //   console.log("Custom logic for adding new recipient...");
  // };
  // wrapper.appendChild(addNew);

  // Search logic on input
  searchInput.addEventListener("input", async () => {
    const search = searchInput.value.trim();
    
    userList.innerHTML = "";

    if (!search) return;

    const results = await searchUser(search);
    if (!results.length) return;

    results.forEach(user => {
      const item = document.createElement("div");
      item.className = "user-item";

      const avatar = document.createElement("img");
      avatar.src = tempMedia(user.img.replace("media/", ""));
      avatar.onerror = () => (avatar.src = "./svg/noname.svg");

      const info = document.createElement("div");
      info.className = "info";

      const name = document.createElement("strong");
      name.textContent = user.username;

      const slug = document.createElement("span");
      slug.textContent = `#${user.slug}`;

      info.append(name, slug);
      item.append(avatar, info);

      item.onclick = () => renderTransferFormView(user);
      userList.appendChild(item);
    });
  });

  dropdown.appendChild(wrapper);
}

async function searchUser(username = null) {
  const accessToken = getCookie("authToken");
  const headers = new Headers({
    "Content-Type": "application/json",
    Authorization: `Bearer ${accessToken}`,
  });

  const graphql = JSON.stringify({
    query: `
      query SearchUser($username: String) {
        searchUser(username: $username) {
          affectedRows {
            id
            username
            slug
            img
            status
            biography
          }
        }
      }
    `,
    variables: { username },
  });

  try {
    const res = await fetch(GraphGL, {
      method: "POST",
      headers,
      body: graphql,
    });

    const json = await res.json();
    return json?.data?.searchUser?.affectedRows || [];
  } catch (err) {
    console.error("searchUser() failed:", err);
    return [];
  }
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
  //const slug = document.createElement("span");
  //slug.textContent = "#" + user.slug;
  // meta.append(name, slug);
  meta.append(name);
  
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
  img.src = "svg/logo_sw.svg";
  const meta = document.createElement("div");
  const name = document.createElement("strong");
  name.textContent = user.username;
  meta.append(name);
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
      // Show loader first
      renderLoaderScreen();

      // Attempt transfer
      const res = await resolveTransfer(user.id, totalAmount);

      if (res.status === "success") {
        renderFinalScreen(totalAmount, user);
      } else {
        alert(`Transfer failed: ${res.ResponseCode}`);
        closeModal();
      }
    } catch (err) {
      alert("Transfer error occurred.");
      console.error(err);
      closeModal();
    }
  };

  actions.append(backBtn, transferBtn);

  // Final render
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

function renderLoaderScreen() {
  const dropdown = document.getElementById("transferDropdown");
  dropdown.innerHTML = "";
  dropdown.classList.add("modal-mode");

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

  const loaderSvg = document.getElementById("loaderSvg");
  loaderSvg.className = "loaderSvg";
  header.appendChild(loaderSvg);
  wrapper.appendChild(header);

  const content = document.createElement("div");
  content.className = "loader-screen-contents";

  const p1 = document.createElement("p");
  p1.className = "loader-screen-contents-p1";
  p1.textContent = "Approving your transaction";

  const p2 = document.createElement("p");
  p2.className = "loader-screen-contents-p2";
  p2.textContent = "This may take some time...";

  content.appendChild(p1);
  content.appendChild(p2);
  wrapper.appendChild(content);
  dropdown.appendChild(wrapper);
}

function renderFinalScreen(transferredAmount, user) {
  const dropdown = document.getElementById("transferDropdown");
  dropdown.innerHTML = "";
  dropdown.classList.add("modal-mode");
  dropdown.classList.add("modal-mode");
  dropdown.classList.remove("hidden");

  // Backdrop
  if (!document.querySelector(".transfer-backdrop")) {
    const backdrop = document.createElement("div");
    backdrop.className = "transfer-backdrop";
    backdrop.onclick = closeModal;
    document.body.appendChild(backdrop);
  }

  // Main wrapper
  const wrapper = document.createElement("div");
  wrapper.className = "transfer-form-screen final-screen";

  // Header with tick
  const header = document.createElement("div");
  header.className = "transfer-header";

  const img = document.createElement("img");
  img.className = "tick-true";
  img.src = "./svg/tick.svg";
  header.appendChild(img);
  wrapper.appendChild(header);

  const content = document.createElement("div");
  content.className = "loader-screen-contents";

  const transferredAmountDiv = document.createElement("div");
  transferredAmountDiv.className = "transferred-amount";

  const amountSpan = document.createElement("span");
  amountSpan.textContent = `- ${transferredAmount} `;
  transferredAmountDiv.appendChild(amountSpan);

  const coinIcon = document.createElement("img");
  coinIcon.src = "./svg/logo_sw.svg";
  coinIcon.alt = "coin";
  coinIcon.onerror = () => (coinIcon.src = "./svg/noname.svg");

  transferredAmountDiv.appendChild(coinIcon);

  const euro = document.createElement("small");
  euro.textContent = ` ~ ${balance}€ `;
  transferredAmountDiv.appendChild(euro);

  content.appendChild(transferredAmountDiv);

  const userInfo = document.createElement("div");
  userInfo.className = "user-info";

  const label = document.createElement("span");
  label.className = "label";
  label.textContent = "Where to";

  const avatar = document.createElement("img");
  avatar.className = "user-avatar";
  avatar.src = tempMedia(user?.img.replace("media/", ""));
  avatar.onerror = () => { this.src = "./svg/noname.svg" };

  const username = document.createElement("span");
  username.innerHTML = `<strong>${user.username}</strong> #${user.slug}`;

  const nameWrapper = document.createElement("div");
  nameWrapper.style.display = "flex";
  nameWrapper.style.alignItems = "center";
  nameWrapper.style.gap = "10px";
  nameWrapper.appendChild(label);
  nameWrapper.appendChild(avatar);
  nameWrapper.appendChild(username);

  const infoWrap = document.createElement("div");
  infoWrap.style.display = "flex";
  infoWrap.style.flexDirection = "column";
  infoWrap.style.alignItems = "center";
  infoWrap.appendChild(nameWrapper);

  userInfo.appendChild(infoWrap);
  content.appendChild(userInfo);

  wrapper.appendChild(content);

  // Action Buttons
  const actions = document.createElement("div");
  actions.className = "action-buttons";

  // Repeat Button
  const repeatBtn = document.createElement("button");
  repeatBtn.className = "repeat";

  const repeatIcon = document.createElement("img");
  repeatIcon.src = "./svg/repeat.svg";
  repeatIcon.alt = "Repeat";

  repeatBtn.textContent = "Repeat";
  repeatBtn.appendChild(repeatIcon);
  repeatBtn.onclick = () => renderUsers(true);

  // Receipt Button
  const receiptBtn = document.createElement("button");
  receiptBtn.className = "receipt";

  const receiptIcon = document.createElement("img");
  receiptIcon.src = "./svg/download.svg";
  receiptIcon.alt = "Download";
  receiptIcon.style.height = "18px";
  receiptIcon.style.marginLeft = "6px";

  receiptBtn.textContent = "Get the receipt";
  receiptBtn.appendChild(receiptIcon);
  receiptBtn.onclick = () => alert("Download receipt");

  // Append buttons
  actions.appendChild(repeatBtn);
  actions.appendChild(receiptBtn);
  wrapper.appendChild(actions);

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