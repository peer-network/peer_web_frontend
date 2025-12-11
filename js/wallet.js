// State variables
let userOffset = 1;
let isFetchingUsers = false;
let hasMoreUsers = true;

// Initialization
function initAppData() {
  
  resetTransactionHistoryList();
  
}

window.addEventListener('DOMContentLoaded', initAppData);



// Holt die Transaktionshistorie und rendert sie in #history-container
// async function getTransactionHistory() {
//   const accessToken = getCookie("authToken");

//   const headers = new Headers({
//     "Content-Type": "application/json",
//     Authorization: `Bearer ${accessToken}`,
//   });

//   // Neue GraphQL-Query (ohne Variablen)
//   const graphql = JSON.stringify({
//     query: `query GetTransactionHistory {
//       getTransactionHistory {
//         status
//         ResponseCode
//         affectedRows {
//           transactionid
//           operationid
//           transactiontype
//           senderid
//           recipientid
//           tokenamount
//           transferaction
//           message
//           createdat
//         }
//       }
//     }`,
//   });

//   const requestOptions = {
//     method: "POST",
//     headers,
//     body: graphql,
//     redirect: "follow",
//   };

//   // optionale Hilfsfunktion für die Typanzeige
//   const actionLabel = (entry) => {
//     // Falls deine API numerische Codes liefert, hier mappen.
//     // Vorher wurde entry.action genutzt; nun gibt es transferaction/transactiontype.
//     const a = Number(entry.transferaction ?? entry.transactiontype);
//     switch (a) {
//       case 2:  return "Like";
//       case 4:  return "Comment";
//       case 5:  return "Post create";
//       case 18: return "Token Transfer";
//       default:
//         // Fallback: zeige vorhandene Strings oder "unknown"
//         return (
//           (typeof entry.transferaction === "string" && entry.transferaction) ||
//           (typeof entry.transactiontype === "string" && entry.transactiontype) ||
//           "unknown"
//         );
//     }
//   };

//   try {
//     const response = await fetch(GraphGL, requestOptions);
//     if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

//     const result = await response.json();
//     if (result.errors) throw new Error(result.errors[0].message);

//     const rows = result?.data?.getTransactionHistory?.affectedRows ?? [];

//     // Neu: nach Datum absteigend sortieren (wie zuvor)
//     const sortedDescending = rows
//       .slice()
//       .sort(
//         (a, b) =>
//           new Date(b.createdat).getTime() - new Date(a.createdat).getTime()
//       );

//     const container = document.getElementById("history-container");
//     // if (container) container.innerHTML = ""; // optional: vorher leeren

//     sortedDescending.forEach((entry) => {
//       const historyItem = document.createElement("div");
//       historyItem.className = "history-item";

//       const typeDiv = document.createElement("div");
//       typeDiv.className = "type";
//       typeDiv.textContent = actionLabel(entry);

//       const dateDiv = document.createElement("div");
//       dateDiv.className = "date";
//       dateDiv.textContent = adjustForDSTAndFormat(entry.createdat);

//       const centerDiv = document.createElement("div");
//       centerDiv.className = "center";

//       const amountSpan = document.createElement("span");
//       amountSpan.className = "amount";
//       // Neue Feldbezeichnung: tokenamount (vormals numbers)
//       const amount =
//         typeof entry.tokenamount === "number"
//           ? entry.tokenamount
//           : Number(String(entry.tokenamount).replace(",", "."));
//       amountSpan.textContent = String(amount).replace(/,/g, ".");

//       const logoImg = document.createElement("img");
//       logoImg.src = "svg/logo_sw.svg";
//       logoImg.alt = "";

//       centerDiv.appendChild(amountSpan);
//       centerDiv.appendChild(logoImg);

//       historyItem.appendChild(typeDiv);
//       historyItem.appendChild(dateDiv);
//       historyItem.appendChild(centerDiv);

//       document.getElementById("history-container")?.appendChild(historyItem);
//     });

//     // Korrigierter Return-Wert passend zur neuen Query
//     return result.data.getTransactionHistory;
//   } catch (error) {
//     console.error("Error:", error?.message || error);
//     throw error;
//   }
// }

// ====== Globale Steuerung ======
const LIMIT = 20;
let txOffset = 0;        // globaler Offset
let txLoading = false;   // verhindert parallele Loads
let txHasMore = true;    // stoppt Observer, wenn nichts mehr da ist
const seenTxIds = new Set(); // Duplikat-Schutz

// Stelle sicher, dass der Container & Sentinel existieren
const historyContainer = document.getElementById("history-container");
let historySentinel = document.getElementById("history-sentinel");
if (!historySentinel) {
  historySentinel = document.createElement("div");
  historySentinel.id = "history-sentinel";
  historySentinel.style.height = "1px";
  historySentinel.style.width = "100%";
  historySentinel.style.pointerEvents = "none";
  historySentinel.innerHTML = '<!-- sentinel -->';
  historyContainer?.appendChild(historySentinel);
}

// ====== Hilfsfunktionen ======
const actionLabel = (entry) => {
  // const a = Number(entry.transferaction ?? entry.transactiontype);
  switch (entry.transferaction) {
    case "BURN_FEE":  return "Burn fee";
    case "PEER_FEE":  return "Peer fee";
    case "POOL_FEE":  return "Pool fee";
    case "CREDIT":    return "Fucking Backend";
    default:
      return (
        (typeof entry.transferaction === "string" && entry.transferaction) ||
        (typeof entry.transactiontype === "string" && entry.transactiontype) ||
        "unknown"
      );
  }
};

function renderRows(rows) {
  rows.forEach((entry) => {
    // Duplikate vermeiden (z. B. bei schnellem mehrfachen Triggern)
    if (entry.operationid && seenTxIds.has(entry.operationid)) return;
    if (entry.operationid) seenTxIds.add(entry.operationid);

    const historyItem = document.createElement("div");
    historyItem.classList.add("tarnsaction_item");

    const amount =
      typeof entry.tokenamount === "number"
        ? entry.tokenamount
        : Number(String(entry.tokenamount).replace(",", "."));
      let transaction_title,transferto,icon_html,shortmessage_html,fullmessage_html;
      transferto='';
      icon_html='';
      shortmessage_html='';
      fullmessage_html='';
        if(entry.transactiontype=='transferForDislike'){
          transaction_title ='Dislike';
          icon_html='<i class="peer-icon peer-icon-dislike-fill red-text"></i>';
        }else if(entry.transactiontype=='transferForLike'){

          transaction_title ='Extra Like';
          icon_html='<i class="peer-icon peer-icon-like-fill red-text"></i>';
        }else if(entry.transactiontype=='transferForComment'){

          transaction_title ='Extra comment';
          icon_html='<i class="peer-icon peer-icon-comment-fill"></i>';
          
        }else if(entry.transactiontype=='transferForPost'){

          transaction_title ='Extra post';
          icon_html='<i class="peer-icon peer-icon-camera-fill"></i>';
        }else if(entry.transactiontype=='transferForAds'){

          transaction_title ='Pinned post promo ';
          icon_html='<i class="peer-icon peer-icon-pinpost"></i>';
        }
        else if(entry.transactiontype=='transferSenderToRecipient'){

          transaction_title ='Transfer to';
          transferto=`<span class="user_name bold italic">@${entry.recipient.username}</span> <span class="user_slug txt-color-gray">#${entry.recipient.slug}</span>`;
          icon_html = `<img class="userimg" src="${entry.recipient.img
                          ? tempMedia(entry.recipient.img.replace("media/", ""))
                          : "svg/noname.svg"
                        }" onerror="this.src='svg/noname.svg'">`;

        }

        
        else{
          transaction_title =entry.transactiontype;
          transferto='';
        }
        let messageText = entry.message || "";
        let shortMessage =
          messageText.length > 60
            ? messageText.slice(0, 60) + "..."
            : messageText;

        if(entry.message!=''){
          shortmessage_html=`<div class="message txt-color-gray"><i class="peer-icon peer-icon-message"></i>${shortMessage}</div>`;

           fullmessage_html=`<div class="message_row">
                    <span class="message_label md_font_size txt-color-gray"><i class="peer-icon peer-icon-message"></i> Message:</span> 
                    <span class="message_body">${messageText}</span>
                  </div>`;
        }
    const record =`<div class="transaction_record">
                <div class="transaction_info">
                  <div class="transaction_media">
                    ${icon_html}
                  </div>
                  <div class="transaction_content">
                    <div class="tinfo md_font_size"><span class="title bold">${transaction_title}</span> ${transferto}</div>
                    ${shortmessage_html}
                  </div>

                </div>
                <div class="transaction_date md_font_size txt-color-gray">${adjustForDSTAndFormat(entry.createdat)}</div>
                <div class="transaction_price xl_font_size bold">${amount}</div>
              </div>
              
              <div class="transaction_detail">
                <div class="transaction_detail_inner">
                  <div class="price_detail_row md_font_size"><span class="price_label txt-color-gray">Transaction amount</span> <span class="price bold">${amount}</span></div>
                  <div class="price_detail_row md_font_size"><span class="price_label txt-color-gray">Base amount</span> <span class="price bold">${entry.netTokenAmount}</span></div>
                  <div class="price_detail_row md_font_size"><span class="price_label txt-color-gray">Fees included</span> <span class="price bold">${entry.fees.total}</span></div>
                  <div class="price_detail_row"><span class="price_label txt-color-gray">2% to Peer Bank (platform fee)</span> <span class="price txt-color-gray">${entry.fees.peer}</span></div>
                  <div class="price_detail_row"><span class="price_label txt-color-gray">1% Burned (removed from supply)</span> <span class="price txt-color-gray">${entry.fees.burn}</span></div>
                  ${entry.fees.inviter
                    ? `<div class="price_detail_row">
                        <span class="price_label txt-color-gray">1% to your Inviter</span>
                        <span class="price txt-color-gray">${entry.fees.inviter}</span>
                      </div>`
                    : ''}
                  ${fullmessage_html}

                </div>
              </div>
              `;
    
 historyItem.insertAdjacentHTML("beforeend", record);

 historyItem.addEventListener("click", () => {
      historyItem.classList.toggle('open');
       
    });
 

    historyContainer?.insertBefore(historyItem, historySentinel);
  });
}

// ====== Core-Loader (lädt 20, nutzt globalen Offset) ======
async function loadMoreTransactionHistory() {
  if (txLoading || !txHasMore) return;
  txLoading = true;

  try {
    const accessToken = getCookie("authToken");
    const headers = new Headers({
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    });

    const graphql = JSON.stringify({
      query: `query TransactionHistory {
        transactionHistory {
            affectedRows {
              operationid
              transactiontype
              tokenamount
              netTokenAmount
              message
              createdat
              sender {
                  userid
                  img
                  username
                  slug
                  biography
                  visibilityStatus
                  hasActiveReports
                  updatedat
              }
              recipient {
                  userid
                  img
                  username
                  slug
                  biography
                  visibilityStatus
                  hasActiveReports
                  updatedat
              }
              fees {
                  total
                  burn
                  peer
                  inviter
              }
          }
          meta {
              status
              RequestId
              ResponseCode
              ResponseMessage
          }
        }
      }`,
    });

    const requestOptions = {
      method: "POST",
      headers,
      body: graphql,
      redirect: "follow",
    };

    const response = await fetch(GraphGL, requestOptions);
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

    const result = await response.json();
    if (result.errors) throw new Error(result.errors[0].message);

    const rows = result?.data?.transactionHistory?.affectedRows ?? [];

    // Server liefert bereits NEWEST. Wenn du magst, kannst du hier noch fallback-sortieren.
    renderRows(rows);

    // Offset erhöhen um tatsächlich geladene Anzahl
    txOffset += rows.length;

    // Wenn weniger als LIMIT kamen -> keine weiteren Daten
    if (rows.length < LIMIT) {
      txHasMore = false;
      // Observer kann abgehängt werden
      if (infiniteObserver && historySentinel) {
        infiniteObserver.unobserve(historySentinel);
      }
    }
  } catch (error) {
    console.error("Error:", error?.message || error);
  } finally {
    txLoading = false;
  }
}

// ====== IntersectionObserver für Infinite Scroll ======
let infiniteObserver = null;

function initHistoryInfiniteScroll() {
  if (!historyContainer || !historySentinel) return;

  // Falls schon vorhanden, erst abklemmen
  if (infiniteObserver) {
    try { infiniteObserver.unobserve(historySentinel); } catch {}
    infiniteObserver.disconnect();
  }

  infiniteObserver = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          // Sentinel sichtbar -> weitere 20 nachladen
          loadMoreTransactionHistory();
        }
      }
    },
    {
      root: historyContainer, // Container scrollt (falls der Container scrollable ist)
      rootMargin: "0px 0px 200px 0px", // früher laden, bevor ganz unten
      threshold: 0.01,
    }
  );

  infiniteObserver.observe(historySentinel);
}

// ====== Reset-Funktion (z. B. beim Tab-Wechsel/Refresh) ======
function resetTransactionHistoryList() {
  txOffset = 0;
  txHasMore = true;
  txLoading = false;
  seenTxIds.clear();

  if (historyContainer) {
    // alles außer Sentinel entfernen
    Array.from(historyContainer.children).forEach((child) => {
      if (child.id !== "history-sentinel") child.remove();
    });
  }
  initHistoryInfiniteScroll();
  // erste Ladung sofort holen
  loadMoreTransactionHistory();
}

// ====== Startpunkt aufrufen, wenn die Seite/der Tab bereit ist ======


// async function dailyPays() {
//   const accessToken = getCookie("authToken");

//   // Create headers
//   const headers = new Headers({
//     "Content-Type": "application/json",
//     Authorization: `Bearer ${accessToken}`,
//   });

//   // Define the GraphQL mutation with variables
//   const graphql = JSON.stringify({
//     query: `query ListPaymentLogs {
//       listPaymentLogs(day: D0) {
//         status
//         counter
//         ResponseCode
//         affectedRows {
//             from
//             token
//             userid
//             postid
//             action
//             numbers
//             createdat
//         }
//       }
//     }`,
//   });

//   // Define request options
//   const requestOptions = {
//     method: "POST",
//     headers: headers,
//     body: graphql,
//     redirect: "follow",
//   };

//   try {
//     // Send the request and handle the response
//     const response = await fetch(GraphGL, requestOptions);
//     const result = await response.json();

//     // Check for errors in response
//     if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
//     if (result.errors) throw new Error(result.errors[0].message);
//     result.data.listPaymentLogs.affectedRows.forEach((entry) => {
//       const historyItem = document.createElement("div");
//       historyItem.className = "history-item";

//       const typeDiv = document.createElement("div");
//       typeDiv.className = "type";
//       typeDiv.textContent = "Withdraw";

//       const dateDiv = document.createElement("div");
//       dateDiv.className = "date";
//       dateDiv.textContent = "3 Feb 00:00";

//       const centerDiv = document.createElement("div");
//       centerDiv.className = "center";

//       const amountSpan = document.createElement("span");
//       amountSpan.className = "amount";
//       amountSpan.textContent = "-1234";

//       const logoImg = document.createElement("img");
//       logoImg.src = "svg/logo_sw.svg";
//       logoImg.alt = "";

//       centerDiv.appendChild(amountSpan);
//       centerDiv.appendChild(logoImg);

//       historyItem.appendChild(typeDiv);
//       historyItem.appendChild(dateDiv);
//       historyItem.appendChild(centerDiv);

//       // Füge das Element z. B. zu einem Container im DOM hinzu
//       document.getElementById("history-container").appendChild(historyItem);
//     });

//     return result.data.listPaymentLogs;
//   } catch (error) {
//     console.error("Error:", error.message);
//     throw error;
//   }
// }

/*-------------- Transnsfer Token Process------------------*/ 

document.getElementById("openTransferDropdown").addEventListener("click", async () => {
  renderUsers()
});

async function renderUsers() {
  const dropdown = document.getElementById("transferDropdown");
  dropdown.innerHTML = "";
  dropdown.classList.remove("hidden");
  //dropdown.classList.add("modal-mode");

  // Backdrop
  const existingBackdrop = document.querySelector(".transfer-backdrop");
  if (!existingBackdrop) {
    const backdrop = document.createElement("div");
    backdrop.className = "transfer-backdrop";
    backdrop.onclick = closeTransferModal;
    document.body.appendChild(backdrop);
  }

  // Wrapper
  const wrapper = document.createElement("div");
  wrapper.className = "transfer-form-screen";

  // Header
  const header = document.createElement("div");
  header.className = "transfer-header";

  const h2 = document.createElement("h2");
  h2.className = "xl_font_size";
  h2.textContent = "Transfer";

  const closeBtn = document.createElement("button");
  closeBtn.className = "close-transfer";
  closeBtn.innerHTML = "&times;";
  closeBtn.onclick = closeTransferModal;

  header.append(h2, closeBtn);
  wrapper.appendChild(header);

  const balance_header = document.createElement("div");
  balance_header.className = "balance-header";

  const sp_bal = document.createElement("span");
  sp_bal.classList.add("md_font_size","txt-color-gray","bal_label");
  sp_bal.textContent = "Your Balance";

  const sp_bal_amt = document.createElement("span");
  sp_bal_amt.classList.add("xl_font_size","bold","tbalance");
  const token_bal = await getLiquiudity();
  sp_bal_amt.textContent = token_bal;


  balance_header.append(sp_bal,sp_bal_amt);

  wrapper.appendChild(balance_header);





  // Always-visible Search Input
  const search_wrapper = document.createElement("div");
  search_wrapper.classList.add("search_wrapper");
  const ru_span = document.createElement("span");
  ru_span.classList.add("md_font_size");
  ru_span.textContent = "Recipient username";
  search_wrapper.appendChild(ru_span);

  const searchInput = document.createElement("input");
  searchInput.type = "text";
  searchInput.placeholder = "Search user...";
  searchInput.className = "search-user-input";

  const s_input_box = document.createElement("div");
  s_input_box.classList.add("search_input_box");
  const search_icon = document.createElement("i");
  search_icon.classList.add("peer-icon","peer-icon-search");
  
  s_input_box.append(searchInput,search_icon);
  search_wrapper.appendChild(s_input_box);

  // User results container
  const userList = document.createElement("div");
  userList.className = "user-list";

  search_wrapper.appendChild(userList);
  wrapper.appendChild(search_wrapper);

  //load/render friends-list
  renderFriendListUI(userList);
  // Search logic on input
  searchInput.addEventListener("input", async () => {
    const search = searchInput.value.trim();


    if (!search) {
      //load/render friends-list
      userList.innerHTML = "";
      renderFriendListUI(userList);
      return;
    }

    const results = await searchUser(search);
    if (!results.length) return;

    // need to make it empty before executing loop
    userList.innerHTML = "";

    results.forEach(user => {
      const item = document.createElement("div");
      item.className = "user-item";

      const avatar = document.createElement("img");
      avatar.src = tempMedia(user.img.replace("media/", ""));
      avatar.onerror = () => (avatar.src = "./svg/noname.svg");

      const info = document.createElement("div");
      info.classList.add("md_font_size","info");

      const name = document.createElement("strong");
      name.classList.add("italic");
      name.textContent = user.username;

      const slug = document.createElement("span");
      slug.classList.add("txt-color-gray");
      slug.textContent = `#${user.slug}`;

      info.append(name, slug);
      item.append(avatar, info);

      item.onclick = () => renderTransferFormView(user);
      userList.appendChild(item);
    });
  });


  dropdown.appendChild(wrapper);
}

async function renderFriendListUI(container) {
  //loadFrinds
  const frindsList = await loadFrinds();
  if (frindsList) {
    frindsList.forEach(user => {
      const item = document.createElement("div");
      item.className = "user-item";

      const avatar = document.createElement("img");
      avatar.src = tempMedia(user.img.replace("media/", ""));
      avatar.onerror = () => (avatar.src = "./svg/noname.svg");

      const info = document.createElement("div");
      info.classList.add("md_font_size","info");

  
     

      const name = document.createElement("strong");
       name.classList.add("italic");
      name.textContent = user.username;

      const slug = document.createElement("span");
       slug.classList.add("txt-color-gray");
      slug.textContent = `#${user.slug}`;

      info.append(name, slug);
      item.append(avatar, info);
      item.onclick = () => renderTransferFormView(user);
      container.appendChild(item);
    });
  }
}

async function loadFrinds() {
  const accessToken = getCookie("authToken");

  // Create headers
  const headers = new Headers({
    "Content-Type": "application/json",
    Authorization: `Bearer ${accessToken}`,
  });

  // Define the GraphQL mutation with variables
  const graphql = JSON.stringify({
    query: `query ListFriends {
                listFriends {
                    status
                    counter
                    ResponseCode
                    affectedRows {
                      userid
                      img
                      username
                      slug
                    }
                }
            }
          `,
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
    const result = await response.json();
    // Check for errors in response
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    if (result.errors) throw new Error(result.errors[0].message);
    return result.data.listFriends.affectedRows;
  } catch (error) {
    console.error("Error:", error.message);
    throw error;
  }
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
          }
        }
      }
    `,
    variables: {
      username
    },
  });

  try {
    const res = await fetch(GraphGL, {
      method: "POST",
      headers,
      body: graphql,
    });

    const json = await res.json();
    return json ?.data ?.searchUser ?.affectedRows || [];
  } catch (err) {
    console.error("searchUser() failed:", err);
    return [];
  }
}

function renderTransferFormView(user) {
  const dropdown = document.getElementById("transferDropdown");
 /*---- This code is when user press back button form checkout scree---*/
    dropdown.querySelector(".search_wrapper")?.remove();
    dropdown.querySelector(".modal-actions")?.remove();
    dropdown.querySelector(".transfer-header h2").innerHTML="Transfer";
    dropdown.querySelector(".balance-header")?.classList.remove("none");
    dropdown.querySelector(".balance-header.summary-header")?.remove();
    
    dropdown.querySelector(".recipient-info")?.remove();
    const oldtransferamopunt = dropdown.querySelector(".amount-input input")?.value?.trim() || "";
    dropdown.querySelector(".amount-input")?.remove();
    const message = dropdown.querySelector(".message-wrap .message_area")?.textContent?.trim() || "";
    dropdown.querySelector(".message-wrap")?.remove();
  /*---- End This code is when user press back button form checkout scree---*/
  const wrapper = dropdown.querySelector(".transfer-form-screen");
  // Enable modal mode
  //dropdown.classList.add("modal-mode");
  //dropdown.classList.remove("hidden");

  // Add backdrop
  if (!document.querySelector(".transfer-backdrop")) {
    const backdrop = document.createElement("div");
    backdrop.className = "transfer-backdrop";
    backdrop.onclick = closeTransferModal;
    document.body.appendChild(backdrop);
  }

 /* const wrapper = document.createElement("div");
  wrapper.className = "transfer-form-screen";

  const header = document.createElement("div");
  header.className = "transfer-header";
  const h2 = document.createElement("h2");
  h2.className = "xl_font_size";
  h2.textContent = "Transfer";
 
  const closeBtn = document.createElement("button");
  closeBtn.className = "close-transfer";
  closeBtn.innerHTML = "&times;";
  closeBtn.onclick = closeTransferModal;
  header.append(h2, closeBtn);*/
  const recipientInfo = document.createElement("div");
  recipientInfo.className = "recipient-info";

  const infoWrap = document.createElement("div");
  infoWrap.classList.add("md_font_size","info");
  
  const recipientLabel = document.createElement("div");
  recipientLabel.classList.add("md_font_size","label");
  recipientLabel.textContent = "Sending to";

  const avatar = document.createElement("img");
  avatar.src = tempMedia(user.img.replace("media/", ""));
  avatar.onerror = () => (avatar.src = "./svg/noname.svg");

  

  const name = document.createElement("strong");
  name.classList.add("italic");
  name.textContent = user.username;

  const slug = document.createElement("span");
  slug.classList.add("txt-color-gray");
  slug.textContent = `#${user.slug}`;

  const edit_btn = document.createElement("span");
  edit_btn.classList.add("edit_btn");
  edit_btn.innerHTML = `<i class="peer-icon peer-icon-edit-pencil"></i>`;

   edit_btn.onclick = () => {
    closeTransferModal();
    document.getElementById("openTransferDropdown").click();
  };

  infoWrap.append(avatar,name, slug,edit_btn);
  recipientInfo.append(recipientLabel,infoWrap);
  

  const amountLabel = document.createElement("div");
  amountLabel.classList.add("md_font_size","label" ,"amtlabel");
  amountLabel.textContent = "Enter amount";

  const amountWrap = document.createElement("div");
  amountWrap.className = "amount-input";
  const input = document.createElement("input");
  input.type = "number";
  input.placeholder = "min: 0.00000001";
  input.id = "transferAmount";
  input.value=oldtransferamopunt;
  input.className = "bold";
  amountWrap.append(amountLabel,input);

  const messageLabel = document.createElement("div");
  messageLabel.classList.add("md_font_size","label");
  messageLabel.textContent = "Add a message (optional)";

  const charCounter = document.createElement("span");
  charCounter.classList.add("txt-color-gray","charCounter", "small_font_size");
  charCounter.textContent = "0/";

  const charCounter_limit = document.createElement("span");
  charCounter_limit.classList.add("charCounter_limit");
  charCounter_limit.innerHTML = "500";

  charCounter.append(charCounter_limit);
  messageLabel.append(charCounter);

  const messageWrap = document.createElement("div");
  messageWrap.className = "message-wrap";

  const textareaCon = document.createElement("div");
  textareaCon.classList.add("message_area");
  const textarea = document.createElement("textarea");
 
  textarea.placeholder = "e.g., Thanks for the coffee! ☕";
  textarea.id = "transferMessage";
  textarea.value=message;
  textareaCon.append(textarea);
 
   const messageInsturction = document.createElement("div");
  messageInsturction.classList.add("txt-color-gray","ins_label");
  messageInsturction.textContent = "You can use letters, numbers, emojis, and special symbols. No links";
  messageWrap.append(messageLabel,textareaCon,messageInsturction);
  const actions = document.createElement("div");
  actions.className = "modal-actions";
  
  const nextBtn = document.createElement("button");
  nextBtn.className = "btn-next btn-white bold";
  nextBtn.textContent = "Continue";
  nextBtn.disabled = true;



  let messagevalidChk=true;
  // === Textarea Live Counter & Validation ===
  textarea.addEventListener("input", () => {
    const limit = 500;
    const currentLength = textarea.value.length;

    // Update counter
    charCounter.textContent = `${currentLength}/`;
    charCounter.append(charCounter_limit);

    // Regex to detect URLs or <a> tags
    const linkRegex = /<a\s+href=("|').*?\1>|https?:\/\/\S+|www\.\S+/gi;

    // If input contains links
    if (linkRegex.test(textarea.value)) {
      messageInsturction.textContent = "Links are not allowed.";
      messageInsturction.classList.add("error");
      nextBtn.disabled = true;
      messagevalidChk=false;
      return;
    }

    // If exceed limit
    if (currentLength > limit) {
      charCounter.classList.add("red-text");
      messageInsturction.textContent = "Message exceeds 500 characters.";
      messageInsturction.classList.add("error");
      nextBtn.disabled = true;
       messagevalidChk=false

      // Optional: prevent further typing
      //textarea.value = textarea.value.substring(0, limit);
      //charCounter.textContent = `${limit}/`;
      //charCounter.append(charCounter_limit);
      
      return;
    }

    // Valid state
    nextBtn.disabled = false;
    charCounter.classList.remove("red-text");
    messageInsturction.textContent = "You can use letters, numbers, emojis, and special symbols. No links";
    messageInsturction.classList.remove("error");
    messagevalidChk=true;
  });

  const balanceAmount = parseFloat(
    dropdown.querySelector(".balance-header .tbalance").textContent
  );

  input.addEventListener("input", () => {

    // Reset always
    nextBtn.onclick = null;
    nextBtn.disabled = true;

    const result = validateAmount(input, balanceAmount);

    if (result.valid) {
      
       // const amount = parseFloat(input.value);
        const amount = input.value;
        
        const finalresult = showTotalAmountUI(input,amount,balanceAmount);   // <-- CALL UI BUILDER

       
      if (finalresult) {
        nextBtn.disabled = false;
        nextBtn.onclick = () => { 
          if(messagevalidChk){ 
            renderCheckoutScreen(user, amount);
          }
        }
      }
        
    }
    
  });
  // If value is not empty → trigger blur
  if (input.value.trim() !== "") {
      input.dispatchEvent(new Event("input"));
  }





  actions.append(nextBtn);
  wrapper.append( recipientInfo, amountWrap, messageWrap, actions);
 // dropdown.appendChild(wrapper);
}

function validateAmount(inputEl, balanceAmount) {
  const value = inputEl.value.trim();

  // Remove previous error message (if any)
  const oldError = inputEl.parentElement.querySelector(".amount_error");
  if (oldError) oldError.remove();

 // Remove previous fee panel  (if any)
  const oldfeePanel = inputEl.parentElement.querySelector(".feePanel");
  if (oldfeePanel) oldfeePanel.remove();

  let message = null;

  // Empty check
  if (!value) {
    message = "Enter valid amount.";
  }

  // Valid number check
  else if (isNaN(parseFloat(value))) {
    message = "Please enter a valid number";
  }
   // Minimum amount check
  else if (parseFloat(value) < 0.00000001) {
    message = "Enter at least 0.00000001 Peer Tokens to continue.";
  }

  // Decimal places check (max 8 allowed)
  else if (value.includes(".")) {
    const decimals = value.split(".")[1];
    if (decimals.length > 8) {
      message = "Invalid format. Use up to 8 decimals.";
    }
  }

 
  // Balance check
 // else if (parseFloat(value) > balanceAmount) {
 //   message = "Amount cannot exceed your balance: " + balanceAmount;
 // }

  // If message exists → show error + return false
  if (message) {
    const amount_error = document.createElement("span");
    amount_error.classList.add("amount_error", "red-text");
    amount_error.innerHTML = message;

    // Insert error message below input
    inputEl.insertAdjacentElement("afterend", amount_error);

    return { valid: false, message };
  }

  // All good
  return { valid: true };
}

function showTotalAmountUI(inputEl,amount,balanceAmount) {

  // Remove previous fee panel  (if any)
  const oldfeePanel = inputEl.parentElement.querySelector(".feePanel");
  if (oldfeePanel) oldfeePanel.remove();

   // Remove previous error message (if any)
  const oldError = inputEl.parentElement.querySelector(".amount_error");
  if (oldError) oldError.remove();


  
  const data = getCommissionBreakdown(amount);
  console.log(data);
  const  total_tokens =data.totalUsed;

  

  const panel =  document.createElement("div");
  panel.classList.add("feePanel");
  panel.innerHTML = `
    

    <div class="fee-section close">
      <div class="fee-title  md_font_size txt-color-gray">
        Transfer fee 
        <span class="fee-total bold xl_font_size">${(data.totalCommission)}</span>
      </div>

      <div class="fee-breakdowns">
        ${data.breakdown.map(item => `
          <div class="fee-item txt-color-gray">
            <span class="label">${item.label}</span>
            <span class="value">${(item.amount)}</span>
          </div>
        `).join("")}
      </div>

      <div class="total_amount  md_font_size">
        Total amount 
        <span class="final-total bold xl_font_size">${(data.totalUsed)}</span>
      </div>
    </div>
  `;
  // After setting panel.innerHTML
  const feeSection = panel.querySelector(".fee-section");
  const feeTitle = panel.querySelector(".fee-title");

  // Toggle on click
  feeTitle.addEventListener("click", () => {
    feeSection.classList.toggle("close");
  });

  // Insert error message below input
  inputEl.insertAdjacentElement("afterend", panel);

  if(total_tokens > balanceAmount ){
    const amount_error = document.createElement("span");
    amount_error.classList.add("amount_error", "red-text");
    amount_error.innerHTML = 'Insufficient tokens.';
    // Insert error message below input
    inputEl.insertAdjacentElement("afterend", amount_error);
     return false;
  }

   return true;

}



function renderCheckoutScreen(user, amount) {
 
  const dropdown = document.getElementById("transferDropdown");
  dropdown.querySelector(".modal-actions").remove();
  dropdown.querySelector(".recipient-info .edit_btn").remove();
  dropdown.querySelector(".transfer-header h2").innerHTML="Summary";
  const clonebalance_header=dropdown.querySelector(".balance-header").cloneNode(true);
  dropdown.querySelector(".balance-header").classList.add("none");

  clonebalance_header.classList.add("summary-header");
  clonebalance_header.querySelector(".bal_label").innerHTML="Remaining balance";

 
  dropdown.querySelector(".amount-input").classList.add("summary-amount");

  dropdown.querySelector(".message-wrap").classList.add("summary-message");
  dropdown.querySelector(".message-wrap .label").innerHTML="Message";
  const message=dropdown.querySelector(".message-wrap .message_area textarea").value;

  if(message==''){
    dropdown.querySelector(".message-wrap").classList.add("none");
  }
  dropdown.querySelector(".message-wrap .message_area").innerHTML=message;
  

  

  const total_tranfer_tokens=parseFloat(
    dropdown.querySelector(".total_amount .final-total").textContent
  );

  const old_balance_tokens = parseFloat(
    dropdown.querySelector(".balance-header .tbalance").textContent
  );

  const balance_tokens =old_balance_tokens - total_tranfer_tokens;
  clonebalance_header.querySelector(".tbalance").textContent=balance_tokens;

  dropdown.querySelector(".balance-header").insertAdjacentElement("afterend", clonebalance_header);
  
   const wrapper = dropdown.querySelector(".transfer-form-screen");

  if (!document.querySelector(".transfer-backdrop")) {
    const backdrop = document.createElement("div");
    backdrop.className = "transfer-backdrop";
    backdrop.onclick = closeTransferModal;
    document.body.appendChild(backdrop);
  }

  const totalAmount = calculateTotalWithFee(amount);
  

  // Actions
  const actions = document.createElement("div");
  actions.className = "modal-actions";

  const backBtn = document.createElement("button");
  backBtn.className = "btn-back btn-transparent";
  backBtn.textContent = "Back";
  backBtn.onclick = () => renderTransferFormView(user);

  const transferBtn = document.createElement("button");
  transferBtn.className = "btn-next btn-blue bold";
  transferBtn.innerHTML = `Submit transfer`;

  transferBtn.onclick = async () => {

    if (balance < totalAmount) {
      const confirmContinue = await warnig("Insufficient balance","You don't have enough balance. Do you still want to try?",false,'<i class="peer-icon peer-icon-warning"></i>');
      if (confirmContinue === null || confirmContinue.button === 0) {
        return false;
      }

      //balance = await getLiquiudity();
      await new Promise(resolve => setTimeout(resolve, 300));
      if (balance < totalAmount) {
        Merror("Still insufficient balance.");
        closeTransferModal();
        return false
      }
    }

    try {
      //renderLoaderScreen();
      const userId = (user ?.userid === undefined) ? user ?.id : user ?.userid;
      const res = await resolveTransfer(userId, amount,message);
      if (res.status === "success") {
        closeTransferModal();
        const confirmContinue = await success("Completed","Your transfer was sent successfully.",false,'<i class="peer-icon peer-icon-good-tick-circle"></i>');
        if (confirmContinue === null || confirmContinue.button === 0) {
          return false;
        }
        //renderFinalScreen(totalAmount, user);
      } else {


        const tryagain = await warnig("Transfer failed",userfriendlymsg(res.ResponseCode),false,'<i class="peer-icon peer-icon-warning"></i>','Try again');
        
      
      if (tryagain === null || tryagain.button === 0) {
       
          closeTransferModal();
          return false;
        }
       
      }
    } catch (err) { 
      const tryagain = await warnig("Something went wrong","We were not able to make your transfer. Please try again later.",false,'<i class="peer-icon peer-icon-warning"></i>','Try again');
        
      
      if (tryagain === null || tryagain.button === 0) {
       
          closeTransferModal();
          return false;
        }
      //alert("Transfer error occurred.");
      console.error(err);
      
    }
  };

  actions.append(backBtn, transferBtn);
  // Final render
  wrapper.append(
    actions
  );

  dropdown.appendChild(wrapper);
}
/*
function renderLoaderScreen() {
  const dropdown = document.getElementById("transferDropdown");
  dropdown.innerHTML = "";
  //dropdown.classList.add("modal-mode");

  if (!document.querySelector(".transfer-backdrop")) {
    const backdrop = document.createElement("div");
    backdrop.className = "transfer-backdrop";
    backdrop.onclick = closeTransferModal;
    document.body.appendChild(backdrop);
  }

  const wrapper = document.createElement("div");
  wrapper.className = "transfer-form-screen";

  const header = document.createElement("div");
  header.className = "transfer-header";

  let loaderSvg = document.getElementById("loaderSvg");

  if (!loaderSvg) {
    loaderSvg = document.createElement("img");
    loaderSvg.id = "loaderSvg";
    loaderSvg.src = "./svg/loader.svg"; // adjust path as needed
    loaderSvg.className = "loaderSvg";
  }

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
  //dropdown.classList.add("modal-mode");
  
  dropdown.classList.remove("hidden");

  // Backdrop
  if (!document.querySelector(".transfer-backdrop")) {
    const backdrop = document.createElement("div");
    backdrop.className = "transfer-backdrop";
    backdrop.onclick = closeTransferModal;
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
  avatar.src = tempMedia(user ?.img.replace("media/", ""));
  avatar.onerror = () => {
    this.src = "./svg/noname.svg"
  };

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
}*/

async function resolveTransfer(recipientId, numberOfTokens,message) {
  const accessToken = getCookie("authToken");

  const headers = new Headers({
    "Content-Type": "application/json",
    Authorization: `Bearer ${accessToken}`,
  });

  const graphql = JSON.stringify({
    query: `
      mutation ResolveTransferV2($recipient: ID!, $numberoftokens: Decimal!, $message: String!) {
        resolveTransferV2(recipient: $recipient, numberoftokens: $numberoftokens,message: $message) {
          status
          ResponseCode
        }
      }
    `,
    variables: {
      recipient: recipientId,
      numberoftokens: numberOfTokens,
      message: message,
    },
  });
 
  const response = await fetch(GraphGL, {
    method: "POST",
    headers,
    body: graphql,
  });

  const result = await response.json();

  if (result.errors) {
    throw new Error(result.errors[0].message);
  }

  return result.data.resolveTransferV2;
}

function calculateTotalWithFee(amount) {
  const feePercent = isInvited === "" ? 0.04 : 0.05;
  const fee = amount * feePercent;
  return parseFloat(amount + fee);
}

function mul(a, b) {
  a = a.toString();
  b = b.toString();

  const aDecimal = (a.split('.')[1] || '').length;
  const bDecimal = (b.split('.')[1] || '').length;

  const aInt = a.replace('.', '');
  const bInt = b.replace('.', '');

  const result = BigInt(aInt) * BigInt(bInt);
  const decimalPlaces = aDecimal + bDecimal;

  const resultStr = result.toString();
  const len = resultStr.length;

  if (decimalPlaces === 0) return resultStr;

  // Insert decimal point
  if (len <= decimalPlaces) {
    return '0.' + '0'.repeat(decimalPlaces - len) + resultStr;
  }

  return resultStr.slice(0, len - decimalPlaces) + '.' + resultStr.slice(len - decimalPlaces);
}


function getCommissionBreakdown(transferAmount) {
  const base = transferAmount.toString(); // keep as string

  const platformFee = mul(base, "0.02");
  const liquidityFee = mul(base, "0.01");
  const burnFee = mul(base, "0.01");

  let breakdown = [
    { label: "2% to Peer Bank (platform fee)", amount: platformFee },
    { label: "1% Burned (removed from supply)", amount: liquidityFee },
    { label: "1% is burned, ensuring deflation", amount: burnFee }
  ];

  let inviterFee = "0";
  if (isInvited !== "") {
    inviterFee = mul(base, "0.01");
    breakdown.push({
      label: "1% to your Inviter",
      amount: inviterFee
    });
  }

  // totalCommission = platformFee + liquidityFee + burnFee + inviterFee
  const totalCommission = [
    platformFee,
    liquidityFee,
    burnFee,
    inviterFee,
  ].reduce(addStrings, "0");

  const totalUsed = addStrings(base, totalCommission);

  return {
    sentToFriend: base,
    breakdown,
    totalCommission,
    totalUsed
  };
}
function addStrings(a, b) {
  // Normalize inputs
  a = a.toString();
  b = b.toString();

  const aDec = (a.split('.')[1] || '').length;
  const bDec = (b.split('.')[1] || '').length;
  const maxDec = Math.max(aDec, bDec);

  const aInt = a.replace('.', '') + '0'.repeat(maxDec - aDec);
  const bInt = b.replace('.', '') + '0'.repeat(maxDec - bDec);

  const sum = (BigInt(aInt) + BigInt(bInt)).toString();

  if (maxDec === 0) return sum;

  const len = sum.length;
  if (len <= maxDec) {
    return "0." + "0".repeat(maxDec - len) + sum;
  }

  return sum.slice(0, len - maxDec) + "." + sum.slice(len - maxDec);
}



function closeTransferModal() {
  const dropdown = document.getElementById("transferDropdown");
  dropdown.classList.add("hidden");
  const backdrop = document.querySelector(".transfer-backdrop");
  if (backdrop) backdrop.remove();  
  //addition
  document.querySelectorAll(".modal-container").forEach(modal => {
    modal.classList.remove("modal-show");
    modal.classList.remove("modal-hide");
});
}
/*-------------- End Transnsfer Token Process------------------*/ 