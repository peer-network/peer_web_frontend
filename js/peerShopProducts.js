let peerShopProducts = {};

// Preload peer shop products from Firestore
loadPeerShopProducts();

function loadPeerShopProducts() {
  db.collection("shop")
    .get()
    .then((snapshot) => {
      snapshot.forEach((doc) => {
        peerShopProducts[doc.id] = doc.data();
      });
    })
    .catch((err) => console.error("Error loading peer shop products:", err));
}

function getProductByPostId(postId) {
  return peerShopProducts[postId] || null;
}

function renderFaqPopup() {
  const faqPopup = document.getElementById('faqPopup');
  const faqContainer = faqPopup.querySelector('.faq-popup');

  if (!faqContainer) return;

  faqContainer.innerHTML = '';

  const faqContent = document.createElement('div');
  faqContent.className = 'faq-content';

  const faqHeader = document.createElement('div');
  faqHeader.className = 'faq-header';

  const faqTitle = document.createElement('h2');
  faqTitle.className = 'faq-title xxl_font_size';
  faqTitle.textContent = "FAQ's";

  const closeBtn = document.createElement('span');
  closeBtn.className = 'close-checkout';
  closeBtn.innerHTML = '&times;';
  closeBtn.onclick = () => faqPopup.classList.add('none');

  faqHeader.append(faqTitle, closeBtn);

  const faqScroll = document.createElement('div');
  faqScroll.className = 'faq-scroll';

  const faqSections = [
    {
      title: 'Order Processing',
      content: "Your order is processed as soon as your payment is confirmed. You'll receive a confirmation email with delivery details within 1–3 days.",
      highlighted: false
    },
    {
      title: 'Delivery information & time',
      items: [
        'Delivery costs are already included in the item price.',
        "Shipping times depend on the delivery provider and your location. You'll receive full delivery details by email once your order has been dispatched."
      ],
      highlighted: true
    },
    {
      title: 'Return policy',
      items: [
        "If you'd like to return an item, we can offer an exchange.",
        'Please note: Peer Tokens cannot be refunded.'
      ],
      highlighted: false
    },
    {
      title: 'Delivery area',
      content: 'Delivery is currently available only within Germany.',
      highlighted: false
    },
    {
      title: 'Need help?',
      content: 'If you have any issues with your order, delivery, or product, feel free to reach out to us:',
      items: [
        { type: 'email', text: 'Email: ', link: 'help.peernetwork@gmail.com' }
      ],
      highlighted: false
    }
  ];

  // Create sections
  faqSections.forEach(section => {
    const sectionEl = document.createElement('section');
    sectionEl.className = section.highlighted ? 'faq-section faq-highlighted' : 'faq-section';

    const heading = document.createElement('h3');
    heading.className = 'md_font_size bold';
    heading.textContent = section.title;
    sectionEl.appendChild(heading);

    if (section.content) {
      const paragraph = document.createElement('p');
      paragraph.className = 'md_font_size txt-color-gray';
      paragraph.textContent = section.content;
      sectionEl.appendChild(paragraph);
    }

    if (section.items) {
      const list = document.createElement('ul');
      list.className = section.highlighted ? 'md_font_size' : 'md_font_size txt-color-gray';

      section.items.forEach(item => {
        const listItem = document.createElement('li');

        if (typeof item === 'string') {
          listItem.textContent = item;
        } else if (item.type === 'email') {
          listItem.textContent = item.text;
          const link = document.createElement('a');
          link.href = `mailto:${item.link}`;
          link.className = 'faq-link';
          link.textContent = item.link;
          listItem.appendChild(link);
        }

        list.appendChild(listItem);
      });

      sectionEl.appendChild(list);
    }

    faqScroll.appendChild(sectionEl);
  });

  faqContent.append(faqHeader, faqScroll);
  faqContainer.appendChild(faqContent);
}

function initFaqPopup() {
  const infoBtn = document.getElementById('info');
  const faqPopupContainer = document.getElementById('faqPopup');

  if (infoBtn && faqPopupContainer) {
    renderFaqPopup();

    infoBtn.addEventListener('click', (e) => {
      e.preventDefault();
      faqPopupContainer.classList.remove('none');
    });

    faqPopupContainer.addEventListener('click', (e) => {
      if (e.target === faqPopupContainer) {
        faqPopupContainer.classList.add('none');
      }
    });
  }
}

document.addEventListener('DOMContentLoaded', initFaqPopup);


/** shop popup */
/* ================= GLOBAL VARIABLES ================= */
let checkoutPopup, checkoutDropdown, wrapper, checkoutNextBtn, checkoutBackBtn, header, h2, closeBtn, productHeader, product_media,
  arrayMedia = [], productinfo, title, desc, price, SelectedSize, productSize, sizeLabel, sizes,
  arraySizes = [], deliveryInfo, deliveryLabel, deliveryShortinfo, deliveryMessage, deliveryInfoVerify, deliveryinfoLabel,
  verifyList, verifyFields = [], checkoutForm, paying_to, amountBreakdown;


function renderCheckoutProductScreen(objekt) {
  initCheckoutScreen();
  createHeader();

  createProductHeader(objekt);
  createSizeSelection(objekt);
  createDeliveryInfo();

  createDeliveryVerify();
  createCheckoutForm();
  createPayingTo();
  createAmountBreakdown(objekt);

  const actionsElement = createActions(objekt);

  createFinalScreen(actionsElement);
}

/* ================= COMPONENT FUNCTIONS ================= */
function initCheckoutScreen() {
  checkoutPopup = document.getElementById("checkoutPopup");
  checkoutPopup.classList.remove("none");
  checkoutDropdown = checkoutPopup.querySelector(".checkout-popup");
  checkoutDropdown.innerHTML = "";

  wrapper = document.createElement("div");
  wrapper.className = "checkout-form-screen";
}

function createHeader() {
  header = document.createElement("div");
  header.className = "checkout-header";

  h2 = document.createElement("h2");
  h2.className = "xxl_font_size";
  h2.textContent = "Shipping";

  closeBtn = document.createElement("button");
  closeBtn.className = "close-checkout";
  closeBtn.innerHTML = "&times;";
  closeBtn.onclick = () => {
    checkoutDropdown.innerHTML = "";
    checkoutPopup.classList.add("none");
  };

  header.append(h2, closeBtn);
  wrapper.appendChild(header);
}

function createProductHeader(objekt) {
  productHeader = document.createElement("div");
  productHeader.className = "product_header";

  product_media = document.createElement("div");
  product_media.className = "product_media";

  if (objekt.media) {
    arrayMedia = JSON.parse(objekt.media);
    arrayMedia.forEach((item) => {
      const img = document.createElement("img");
      img.src = tempMedia(item.path);
      img.alt = objekt.name;
      product_media.appendChild(img);
    });
  }

  productinfo = document.createElement("div");
  productinfo.className = "productinfo";

  title = document.createElement("h3");
  title.className = "md_font_size bold";
  title.textContent = objekt.title;

  desc = document.createElement("p");
  desc.className = "txt-color-gray md_font_size";
  desc.textContent = objekt.mediadescription;

  price = document.createElement("div");
  price.className = "product_price bold xxl_font_size";
  price.innerHTML = `<span class="product_price_label txt-color-gray md_font_size">Price</span> ${objekt.productprice}`;

  SelectedSize = document.createElement("div");
  SelectedSize.className = "selected_size step_2 none";
  SelectedSize.innerHTML = `<span class="product_price_label txt-color-gray md_font_size">Size</span> <span class="size"></span>`;

  productinfo.append(title, desc, price, SelectedSize);
  productHeader.append(product_media, productinfo);
}

function createSizeSelection(objekt) {
  productSize = document.createElement("div");
  productSize.className = "product_size step_1";

  sizeLabel = document.createElement("h3");
  sizeLabel.className = "md_font_size";
  sizeLabel.textContent = "Select size";

  sizes = document.createElement("div");
  sizes.className = "product_sizes";

  let arraySizes = [];
  let hasFirebaseSizeData = false;

  if (objekt.sizes && typeof objekt.sizes === 'object' && !Array.isArray(objekt.sizes)) {
    arraySizes = Object.entries(objekt.sizes).map(([size, stock]) => ({
      size: size,
      inStock: stock > 0
    }));
    hasFirebaseSizeData = true;
  } 

  else if (objekt.one_size_stock !== undefined && objekt.one_size_stock !== null) {
    arraySizes = [{ 
      size: "One Size", 
      inStock: Number(objekt.one_size_stock) > 0 
    }];
    hasFirebaseSizeData = true;
  }

  else if (Array.isArray(objekt.sizes) && objekt.sizes.length > 0) {
    arraySizes = objekt.sizes.map(s => {
      if (typeof s === 'string') return { size: s, inStock: true };
      return s;
    });
    hasFirebaseSizeData = true;
  } 
 
  if (!hasFirebaseSizeData) {
    productSize.classList.add('none');
    productSize.dataset.sizeOptional = 'true';
    return;
  }

  arraySizes.forEach(({ size, inStock }) => {
    const label = document.createElement("label");
    label.className = "psize_label";

    const input = document.createElement("input");
    input.type = "radio";
    input.name = "product_size";
    input.value = size;
    input.disabled = !inStock;

    if (arraySizes.length === 1 && inStock) {
      input.checked = true;
      SelectedSize.querySelector(".size").innerHTML = size;
    }

    const span = document.createElement("span");
    span.className = "md_font_size";
    span.textContent = size;

    if (!inStock) label.classList.add("out_of_stock");
    input.onclick = () => {
      SelectedSize.querySelector(".size").innerHTML = input.value;
      const sizeError = productSize.querySelector(".response_msg");
      if (sizeError) sizeError.classList.add("none");

      validateForm();
    };

    label.append(input, span);
    sizes.appendChild(label);
  });

  if (arraySizes.length === 1) {
    productSize.classList.add('none');
  }

  const sizeError = document.createElement("span");
  sizeError.className = "response_msg error cutom-style none";
  sizeError.textContent = "Please select a size";

  productSize.append(sizeLabel, sizes, sizeError);
}

function createDeliveryInfo() {
  deliveryInfo = document.createElement("div");
  deliveryInfo.className = "delivery_info step_1 close";
  deliveryLabel = document.createElement("h3");
  deliveryLabel.className = "md_font_size dtitle";
  deliveryLabel.textContent = "Delivery information";

  deliveryShortinfo = document.createElement("span");
  deliveryShortinfo.className = "small_font_size txt-color-gray";
  deliveryShortinfo.innerHTML =
    "1-3 working days, <strong>only within Germany</strong>";
  deliveryLabel.appendChild(deliveryShortinfo);

  deliveryLabel.addEventListener("click", () => {
    deliveryInfo.classList.toggle("close");
  });

  deliveryMessage = document.createElement("div");
  deliveryMessage.className = "delivery_message txt-color-gray ";

  deliveryMessage.innerHTML =
    "We'll email your delivery details within 1–3 days after your payment is confirmed. Please make sure your email address is correct; they can't be changed after you place the order. Delivery is available only within Germany.";
  deliveryInfo.append(deliveryLabel, deliveryMessage);
}

function createDeliveryVerify() {
  deliveryInfoVerify = document.createElement("div");
  deliveryInfoVerify.className = "delivery_info_verify step_2 none";

  deliveryinfoLabel = document.createElement("h3");
  deliveryinfoLabel.className = "md_font_size bold dinfotitle";
  deliveryinfoLabel.textContent = "Delivery information";

  verifyList = document.createElement("div");
  verifyList.className = "delivery_verify_list";

  verifyFields = [
    { label: "Name", class: "full_name" },
    { label: "E-mail", class: "email" },
    { label: "Address line 1", class: "address" },
    { label: "Address line 2", class: "address2" },
    { label: "City", class: "city" },
    { label: "ZIP code", class: "zip" },
    { label: "Country", class: "country", default: "Germany" },
  ];

  verifyFields.forEach((f) => {
    const row = document.createElement("div");
    row.className = `verify_row verify_row_${f.class}`;

    const label = document.createElement("span");
    label.className = "verify_label txt-color-gray";
    label.textContent = f.label;

    const value = document.createElement("span");
    value.className = `verify_value verify_${f.class}`;
    value.textContent = f.default || "—";

    row.append(label, value);
    verifyList.appendChild(row);
  });

  deliveryInfoVerify.append(deliveryinfoLabel, verifyList);
}

function createCheckoutForm() {
  checkoutForm = document.createElement("form");
  checkoutForm.className = "checkout-form step_1";

  const fields = [
    { placeholder: "Full name", type: "text", class: "full_name" },
    { placeholder: "Email address", type: "email", class: "email" },
    { placeholder: "Address line 1", type: "text", class: "address" },
    {
      placeholder: "Address line 2 (optional)",
      type: "text",
      class: "address2",
    },
  ];

  fields.forEach((f) => {
    const input = document.createElement("input");
    input.type = f.type;
    input.className = f.class;
    input.placeholder = f.placeholder;

    input.addEventListener("blur", () => validateInput(input));

    const fieldWrap = document.createElement("div");
    fieldWrap.className = `form_field field_${f.class}`;

    const error = document.createElement("span");
    error.className = "response_msg error";
    error.classList.add("none");

    fieldWrap.append(input, error);
    checkoutForm.appendChild(fieldWrap);
  });


  const cityZip = document.createElement("div");
  cityZip.className = "city_zip";

  const city = document.createElement("input");
  city.type = "text";
  city.className = "city";
  city.placeholder = "City";
  city.addEventListener("blur", () => validateInput(city));

  const zip = document.createElement("input");
  zip.className = "zip";
  zip.type = "text";
  zip.placeholder = "ZIP";
  zip.addEventListener("blur", () => validateInput(zip));

  cityZip.append(wrapField(city, "city"), wrapField(zip, "zip"));

  checkoutForm.appendChild(cityZip);

  checkoutForm.addEventListener("submit", (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    document.querySelectorAll('.step_1').forEach(el => el.classList.add('none'));
    document.querySelectorAll('.step_2').forEach(el => el.classList.remove('none'));
  });
}

function createPayingTo() {
  paying_to = document.createElement("div");
  paying_to.className = "paying_to step_2 none";

  const paying_to_label = document.createElement("span");
  paying_to_label.className = "paying_to_label bold";
  paying_to_label.textContent = "Paying to";

  const paying_to_store = document.createElement("span");
  paying_to_store.className = `paying_to_store md_font_size`;
  paying_to_store.textContent = "@Peer_Shop";

  const paying_to_store_slug = document.createElement("span");
  paying_to_store_slug.className = `store_slug txt-color-gray`;
  paying_to_store_slug.textContent = "#12445";
  paying_to_store.append(paying_to_store_slug);

  paying_to.append(paying_to_label, paying_to_store);
}

function createAmountBreakdown(objekt) {
  amountBreakdown = document.createElement("div");
  amountBreakdown.className = "amount_detail step_2 none";

  const total = parseFloat(objekt.productprice);
  const data = getCommissionBreakdown(total);

  const feePanel = document.createElement("div");
  feePanel.classList.add("feePanel");

  feePanel.innerHTML = `<div class="fee-section close">
      <div class="total_amount bold  md_font_size">
        Total amount 
        <span class="final-total bold xl_font_size">${formatAmount(data.totalUsed)}</span>
      </div>
      <div class="product-price ">
        <div class="price-item txt-color-gray md_font_size">
            <span class="label">Item Price</span>
            <span class="value xl_font_size bold">${formatAmount(data.sentToFriend)}</span>
          </div>
      </div>
      <div class="fee-title  md_font_size txt-color-gray">
        Fees included
        <span class="fee-total bold xl_font_size">${formatAmount(data.totalCommission)}</span>
      </div>
    
      <div class="fee-breakdowns">
        ${data.breakdown
      .map(
        (item) => `
          <div class="fee-item txt-color-gray">
            <span class="label">${item.label}</span>
            <span class="value">${formatAmount(item.amount)}</span>
          </div>
        `
      )
      .join("")}
      </div>
    </div>`;

  const feeSection = feePanel.querySelector(".fee-section");
  const feeTitle = feePanel.querySelector(".fee-title");

  feeTitle.addEventListener("click", () => {
    feeSection.classList.toggle("close");
  });
  amountBreakdown.append(feePanel);
}

function createActions(objekt) {
  const actions = document.createElement("div");
  actions.className = "checkout-actions";

  checkoutBackBtn = document.createElement("button");
  checkoutBackBtn.className = "btn-back btn-transparent";
  checkoutBackBtn.type = "button";
  checkoutBackBtn.innerHTML = `<i class="peer-icon peer-icon-arrow-left"></i> Back`;

  checkoutBackBtn.onclick = () => {
    const step1Hidden = document.querySelector('.step_1.none');
    if (step1Hidden) {
      document.querySelectorAll('.step_1').forEach(el => el.classList.remove('none'));
      document.querySelectorAll('.step_2').forEach(el => el.classList.add('none'));

      checkoutNextBtn.innerHTML = `Next <i class="peer-icon peer-icon-arrow-right"></i>`;
      checkoutNextBtn.classList.remove('btn-pay');
    } else {
      checkoutDropdown.innerHTML = "";
      checkoutPopup.classList.add("none");
    }
  };

  checkoutNextBtn = document.createElement("button");
  checkoutNextBtn.className = "btn-next btn-blue bold";
  checkoutNextBtn.type = "submit";
  // checkoutNextBtn.disabled = true;
  checkoutNextBtn.innerHTML = `Next <i class="peer-icon peer-icon-arrow-right"></i>`;

  actions.append(checkoutBackBtn, checkoutNextBtn);

  checkoutNextBtn.addEventListener("click", (e) => {
    e.preventDefault();

    // Check if delivery info (always in step 1) is visible
    const isStep1Visible = deliveryInfo && !deliveryInfo.classList.contains('none');

    if (isStep1Visible) {
      const formValid = validateForm();
      if (formValid) {
        document.querySelectorAll('.step_1').forEach(el => el.classList.add('none'));
        document.querySelectorAll('.step_2').forEach(el => el.classList.remove('none'));

        checkoutNextBtn.innerHTML = `Pay <i class="peer-icon peer-icon-arrow-right"></i>`;
        checkoutNextBtn.classList.add('btn-pay');
      }
    } else {
      handlePayment(objekt);
    }
  });

  return actions;
}

function createFinalScreen(actionsElement) {
  const ScrollWrap = document.createElement("div");
  ScrollWrap.className = "scroll_wrap";
  ScrollWrap.append(checkoutForm, deliveryInfoVerify, paying_to, amountBreakdown);
  wrapper.append(productHeader, productSize, deliveryInfo, ScrollWrap, actionsElement);
  checkoutDropdown.appendChild(wrapper);

  ["full_name", "email", "address", "address2", "city", "zip"].forEach((cls) =>
    bindInputToVerify(wrapper, cls)
  );
}

/* ================= HELPER FUNCTIONS ================= */
function wrapField(input, name) {
  const wrap = document.createElement("div");
  wrap.className = `form_field field_${name}`;
  wrap.appendChild(input);

  const error = document.createElement("span");
  error.className = "response_msg error";
  error.classList.add("none");
  wrap.appendChild(error);

  return wrap;
}

function bindInputToVerify(wrapper, inputClass) {
  const input = wrapper.querySelector(`.${inputClass}`);
  const output = wrapper.querySelector(`.verify_${inputClass}`);
  const row = wrapper.querySelector(`.verify_row_${inputClass}`);

  if (!input || !output) return;

  const update = () => {
    if (!input.value.trim()) {
      output.textContent = "—";
      if (inputClass === "address2" && row) row.classList.add("none");
    } else {
      output.textContent = input.value;
      if (row) row.classList.remove("none");
    }
  };

  input.addEventListener("input", update);
  input.addEventListener("blur", update);

  update();
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidZip(zip) {
  return /^\d{5}$/.test(zip);
}

function markField(input, isValid, message) {
  const fieldWrap = input.closest('.form_field');
  const errorSpan = fieldWrap ? fieldWrap.querySelector(".response_msg") : null;

  if (!errorSpan) return;

  if (isValid) {
    errorSpan.classList.add("none");
    input.classList.remove("error");
  } else {
    input.classList.add("error");
    errorSpan.textContent = message;
    errorSpan.classList.remove("none");
  }
}

function validateInput(input) {
  const val = input.value.trim();
  let isValid = true;
  let msg = "";

  if (input.classList.contains("full_name")) {
    isValid = val.length >= 2;
    msg = "Name is required";
  } else if (input.classList.contains("email")) {
    isValid = isValidEmail(val);
    msg = "Enter a valid email";
  } else if (input.classList.contains("address")) {
    isValid = val.length >= 5;
    msg = "Address is required";
  } else if (input.classList.contains("city")) {
    isValid = val.length >= 2;
    msg = "City is required";
  } else if (input.classList.contains("zip")) {
    isValid = isValidZip(val);
    msg = "Enter valid ZIP code";
  } else if (input.classList.contains("address2")) {
    return true;
  }

  markField(input, isValid, msg);
  return isValid;
}

function validateForm() {
  if (!checkoutForm) return false;

  const name = checkoutForm.querySelector(".full_name");
  const email = checkoutForm.querySelector(".email");
  const address = checkoutForm.querySelector(".address");
  const city = checkoutForm.querySelector(".city");
  const zip = checkoutForm.querySelector(".zip");
  const sizeChecked = wrapper.querySelector(
    'input[name="product_size"]:checked'
  );

  const v1 = validateInput(name);
  const v2 = validateInput(email);
  const v3 = validateInput(address);
  const v4 = validateInput(city);
  const v5 = validateInput(zip);
  

  const isSizeOptional = productSize?.dataset?.sizeOptional === 'true';
  const v6 = isSizeOptional ? true : !!sizeChecked;

  const isValid = v1 && v2 && v3 && v4 && v5 && v6;
  const sizeError = document.querySelector(".product_size .response_msg");
  if (sizeError && !isSizeOptional) {
    if (!sizeChecked) {
      sizeError.classList.remove('none');
    } else {
      sizeError.classList.add('none');
    }
  }

  return isValid;
}

async function performShopOrder(shopItemId, orderDetails, tokenAmount) {
  const accessToken = getCookie("authToken");
  if (!accessToken) {
    if (typeof Merror === 'function') Merror("Error", "You must be logged in to make a purchase.");
    return;
  }

  const addressLine2Part = orderDetails.addressline2
    ? `addressline2: "${orderDetails.addressline2}"`
    : `addressline2: null`;

  const query = `
    mutation PerformShopOrder {
      performShopOrder(
        tokenAmount: "${tokenAmount}"
        shopItemId: "${shopItemId}"
        orderDetails: {
          name: "${orderDetails.name}"
          email: "${orderDetails.email}"
          addressline1: "${orderDetails.addressline1}"
          ${addressLine2Part}
          city: "${orderDetails.city}"
          zipcode: "${orderDetails.zipcode}"
          country: GERMANY
          shopItemSpecs: { size: "${orderDetails.shopItemSpecs.size}" }
        }
      ) {
        status
        RequestId
        ResponseCode
        ResponseMessage
      }
    }
  `;

  try {
    const response = await fetch(GraphGL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ query }),
    });

    return await response.json();
  } catch (error) {
    console.error("Payment Request Failed:", error);
    return { errors: [{ message: "Network error occurred. Please try again." }] };
  }
}

async function handlePayment(objekt) {
  const name = checkoutForm.querySelector(".full_name").value.trim();
  const email = checkoutForm.querySelector(".email").value.trim();
  const address1 = checkoutForm.querySelector(".address").value.trim();
  const address2 = checkoutForm.querySelector(".address2").value.trim();
  const city = checkoutForm.querySelector(".city").value.trim();
  const zip = checkoutForm.querySelector(".zip").value.trim();
  const sizeInput = wrapper.querySelector('input[name="product_size"]:checked');
  const size = sizeInput ? sizeInput.value : "";

  const orderDetails = {
    shopItemSpecs: { size: size },
    country: "GERMANY",
    zipcode: zip,
    city: city,
    addressline1: address1,
    addressline2: address2,
    email: email,
    name: name
  };

  const originalBtnContent = checkoutNextBtn.innerHTML;
  checkoutNextBtn.disabled = true;
  checkoutNextBtn.innerHTML = `Processing... <i class="peer-icon peer-icon-loader spin"></i>`;

  const result = await performShopOrder(objekt.id, orderDetails, objekt.productprice);

  if (result && result.data && result.data.performShopOrder) {
    const orderData = result.data.performShopOrder;
    if (orderData.status === "success") {
      checkoutDropdown.innerHTML = "";
      checkoutPopup.classList.add("none");

      if (typeof ordersuccess === 'function') {
        ordersuccess("Order successfully placed!", "Your order has been confirmed. You’ll receive an email with delivery details within 1–3 days.", false, '<i class="peer-icon peer-icon-order-success"></i>')
          .then(res => {
            if (res.button === 1) {
              window.location.href = 'wallet.php';
            }
          });
      }
      if (typeof currentliquidity === 'function') currentliquidity();
    } else {
      //if (typeof Merror === 'function') Merror("Order Failed", orderData.ResponseMessage || "Something went wrong.");
      await warnig("Order Failed", "Something went wrong. Please try again in a moment.", false, '<i class="peer-icon peer-icon-order-failed"></i>', 'Try again');
      checkoutNextBtn.disabled = false;
      checkoutNextBtn.innerHTML = originalBtnContent;
    }
  } else {
    const errorMsg = result?.errors?.[0]?.message || "An unexpected error occurred.";
    if (typeof Merror === 'function') Merror("Error", errorMsg);
    checkoutNextBtn.disabled = false;
    checkoutNextBtn.innerHTML = originalBtnContent;
  }
}
