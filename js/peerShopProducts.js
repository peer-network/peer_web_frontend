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

function renderCheckoutProductScreen(objekt) {
  let nextBtn;
  const checkoutPopup = document.getElementById("checkoutPopup");
  checkoutPopup.classList.remove("none");
  const checkoutDropdown = checkoutPopup.querySelector(".checkout-popup");

  checkoutDropdown.innerHTML = "";

  // Wrapper
  const wrapper = document.createElement("div");
  wrapper.className = "checkout-form-screen";

  /* ================= HEADER ================= */
  const header = document.createElement("div");
  header.className = "checkout-header";

  const h2 = document.createElement("h2");
  h2.className = "xxl_font_size";
  h2.textContent = "Shipping";

  const closeBtn = document.createElement("button");
  closeBtn.className = "close-checkout";
  closeBtn.innerHTML = "&times;";
  closeBtn.onclick = () => {
    checkoutDropdown.innerHTML = "";
    checkoutPopup.classList.add("none");
  };

  header.append(h2, closeBtn);
  wrapper.appendChild(header);

  /* ================= PRODUCT HEADER ================= */
  const productHeader = document.createElement("div");
  productHeader.className = "product_header";

  const product_media = document.createElement("div");
  product_media.className = "product_media";
  const arrayMedia = JSON.parse(objekt.media);
  arrayMedia.forEach((item) => {
    const img = document.createElement("img");
    img.src = tempMedia(item.path);
    img.alt = objekt.title;
    product_media.appendChild(img);
  });

  const productinfo = document.createElement("div");
  productinfo.className = "productinfo";

  const title = document.createElement("h3");
  title.className = "md_font_size bold";
  title.textContent = objekt.title;

  const desc = document.createElement("p");
  desc.className = "txt-color-gray md_font_size";
  desc.textContent = objekt.mediadescription;

  const price = document.createElement("div");
  price.className = "product_price bold xxl_font_size";
  price.innerHTML = `<span class="product_price_label txt-color-gray md_font_size">Price</span> ${objekt.productprice}`;

  const SelectedSize = document.createElement("div");
  SelectedSize.className = "selected_size step_2 none";
  SelectedSize.innerHTML = `<span class="product_price_label txt-color-gray md_font_size">Size</span> <span class="size"></span>`;

  productinfo.append(title, desc, price, SelectedSize);
  productHeader.append(product_media, productinfo);

  /* ================= SIZE SELECTION ================= */
  const productSize = document.createElement("div");
  productSize.className = "product_size";

  const sizeLabel = document.createElement("h3");
  sizeLabel.className = "md_font_size";
  sizeLabel.textContent = "Select size";

  const sizes = document.createElement("div");
  sizes.className = "product_sizes";

  const arraySizes = [
    { size: "XS", inStock: true },
    { size: "S", inStock: false },
    { size: "M", inStock: true },
    { size: "L", inStock: true },
    { size: "XL", inStock: false },
    { size: "XXL", inStock: true },
  ];

  arraySizes.forEach(({ size, inStock }) => {
    const label = document.createElement("label");
    label.className = "psize_label";

    const input = document.createElement("input");
    input.type = "radio";
    input.name = "product_size";
    input.value = size;
    input.disabled = !inStock;

    const span = document.createElement("span");
    span.className = "md_font_size";
    span.textContent = size;

    if (!inStock) label.classList.add("out_of_stock");
    input.onclick = () => {
      SelectedSize.querySelector(".size").innerHTML = input.value;
      validateForm();
    };

    label.append(input, span);
    sizes.appendChild(label);
  });

  productSize.append(sizeLabel, sizes);

  /* ================= DELIVERY INFO ================= */
  const deliveryInfo = document.createElement("div");
  deliveryInfo.className = "delivery_info close";
  const deliveryLabel = document.createElement("h3");
  deliveryLabel.className = "md_font_size dtitle";
  deliveryLabel.textContent = "Delivery information";

  const deliveryShortinfo = document.createElement("span");
  deliveryShortinfo.className = "small_font_size txt-color-gray";
  deliveryShortinfo.innerHTML =
    "1-3 working days, <strong>only within Germany</strong>";
  deliveryLabel.appendChild(deliveryShortinfo);

  // Toggle on click
  deliveryLabel.addEventListener("click", () => {
    deliveryInfo.classList.toggle("close");
  });

  const deliveryMessage = document.createElement("div");
  deliveryMessage.className = "delivery_message txt-color-gray ";

  deliveryMessage.innerHTML =
    "We'll email your delivery details within 1–3 days after your payment is confirmed. Please make sure your email address is correct; they can't be changed after you place the order. Delivery is available only within Germany.";
  deliveryInfo.append(deliveryLabel, deliveryMessage);

  /* ================= DELIVERY INFO Verify ================= */
  /**  STEP 2  */
  const deliveryInfoVerify = document.createElement("div");
  deliveryInfoVerify.className = "delivery_info_verify step_2 none";

  const deliveryinfoLabel = document.createElement("h3");
  deliveryinfoLabel.className = "md_font_size bold dinfotitle";
  deliveryinfoLabel.textContent = "Delivery information";

  const verifyList = document.createElement("div");
  verifyList.className = "delivery_verify_list";

  const verifyFields = [
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

  /* ================= FORM ================= */
  const form = document.createElement("form");
  form.className = "checkout-form";

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

  // fields.forEach((f) => {
  //   const input = document.createElement("input");
  //   input.type = f.type;
  //   input.className = f.class;
  //   input.placeholder = f.placeholder;

  //   const fieldWrap = document.createElement("div");
  //   fieldWrap.className = `form_field field_${f.class}`;
  //   fieldWrap.appendChild(input);

  //   form.appendChild(fieldWrap);
  // });

  fields.forEach((f) => {
    const input = document.createElement("input");
    input.type = f.type;
    input.className = f.class;
    input.placeholder = f.placeholder;

    const fieldWrap = document.createElement("div");
    fieldWrap.className = `form_field field_${f.class}`;

    const error = document.createElement("span");
    error.className = "response_msg error";
    error.style.display = "none";

    fieldWrap.append(input, error);
    form.appendChild(fieldWrap);
  });


  const cityZip = document.createElement("div");
  cityZip.className = "city_zip";

  const city = document.createElement("input");
  city.type = "text";
  city.className = "city";
  city.placeholder = "City";

  const zip = document.createElement("input");
  zip.className = "zip";
  zip.type = "text";
  zip.placeholder = "ZIP";

  cityZip.append(wrapField(city, "city"), wrapField(zip, "zip"));

  form.appendChild(cityZip);

  function wrapField(input, name) {
    const wrap = document.createElement("div");
    wrap.className = `form_field field_${name}`;
    wrap.appendChild(input);
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
        if (inputClass === "address2" && row) row.style.display = "none";
      } else {
        output.textContent = input.value;
        if (row) row.style.display = "flex";
      }
    };

    input.addEventListener("input", update);
    input.addEventListener("blur", update);

    update(); // initial sync
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function isValidZip(zip) {
    return /^\d{5}$/.test(zip); // Germany ZIP
  }

  // function markField(input, isValid) {
  //   console.log("markField", input.className, isValid);
  //   input.classList.toggle("response_msg", !isValid);
  //   input.classList.toggle("error", !isValid);
  // }

  function markField(input, isValid, message) {
    const errorSpan = input.parentElement.querySelector(".response_msg");

    if (!errorSpan) return;

    if (isValid) {
      errorSpan.style.display = "none";
    } else {
      errorSpan.textContent = message;
      errorSpan.style.display = "block";
    }
  }


  function validateForm() {
    console.log("validateForm called");
    const name = form.querySelector(".full_name");
    const email = form.querySelector(".email");
    const address = form.querySelector(".address");
    const city = form.querySelector(".city");
    const zip = form.querySelector(".zip");
    const sizeChecked = wrapper.querySelector(
      'input[name="product_size"]:checked'
    );

    const validations = [
      name.value.trim().length >= 2,
      isValidEmail(email.value),
      address.value.trim().length >= 5,
      city.value.trim().length >= 2,
      isValidZip(zip.value),
      !!sizeChecked,
    ];

    // markField(name, validations[0]);
    // markField(email, validations[1]);
    // markField(address, validations[2]);
    // markField(city, validations[3]);
    // markField(zip, validations[4]);

    markField(name, validations[0], "Name is required");
    markField(email, validations[1], "Enter a valid email");
    markField(address, validations[2], "Address is required");
    markField(city, validations[3], "City is required");
    markField(zip, validations[4], "Enter valid ZIP code");


    const isValid = validations.every(Boolean);
    nextBtn.disabled = !isValid;

    return isValid;
  }

  wrapper.append(deliveryInfoVerify, form);

  ["full_name", "email", "address", "address2", "city", "zip"].forEach((cls) =>
    bindInputToVerify(wrapper, cls)
  );

  /* ================= PAYING TO ================= */
  const paying_to = document.createElement("div");
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

  /* ================= Total Amount ================= */
  const amountBreakdown = document.createElement("div");
  amountBreakdown.className = "amount_detail step_2 none";

  const feePanel = document.createElement("div");
  feePanel.classList.add("feePanel");
  let breakdown = [
    { label: "2% to Peer Bank (platform fee)", amount: 4 },
    { label: "1% Burned (removed from supply)", amount: 5 },
  ];
  let inviterFee = "0";
  /*if (isInvited !== "") { 
  need to check luqman
    inviterFee = mul(base, "0.01");
    breakdown.push({
      label: "1% to your Inviter",
      amount: inviterFee
    });
  }*/

  feePanel.innerHTML = `<div class="fee-section close">
      <div class="total_amount bold  md_font_size">
        Total amount 
        <span class="final-total bold xl_font_size">${
          objekt.productprice
        }</span>
      </div>
      <div class="product-price ">
        <div class="price-item txt-color-gray md_font_size">
            <span class="label">Item Price</span>
            <span class="value xl_font_size bold">${objekt.productprice}</span>
          </div>
      </div>
      <div class="fee-title  md_font_size txt-color-gray">
        Fees included
        <span class="fee-total bold xl_font_size">${objekt.productprice}</span>
      </div>
    
      <div class="fee-breakdowns">
        ${breakdown
          .map(
            (item) => `
          <div class="fee-item txt-color-gray">
            <span class="label">${item.label}</span>
            <span class="value">${item.amount}</span>
          </div>
        `
          )
          .join("")}
      </div>
    </div>`;

  // After setting panel.innerHTML
  const feeSection = feePanel.querySelector(".fee-section");
  const feeTitle = feePanel.querySelector(".fee-title");

  // Toggle on click
  feeTitle.addEventListener("click", () => {
    feeSection.classList.toggle("close");
  });
  amountBreakdown.append(feePanel);

  /* ================= BUTTONS ================= */
  const actions = document.createElement("div");
  actions.className = "checkout-actions";

  const backBtn = document.createElement("button");
  backBtn.className = "btn-back btn-transparent";
  backBtn.type = "button";
  backBtn.innerHTML = `<i class="peer-icon peer-icon-arrow-left"></i> Back`;

  backBtn.onclick = () => {
    checkoutDropdown.innerHTML = "";
    checkoutPopup.classList.add("none");
  };

  nextBtn = document.createElement("button");
  nextBtn.className = "btn-next btn-blue bold";
  nextBtn.type = "submit";
  // nextBtn.disabled = true;
  nextBtn.innerHTML = `Next <i class="peer-icon peer-icon-arrow-right"></i>`;

  actions.append(backBtn, nextBtn);
  nextBtn.addEventListener("click", validateForm);

  const ScrollWrap = document.createElement("div");
  ScrollWrap.className = "scroll_wrap";
  ScrollWrap.append(form, deliveryInfoVerify, paying_to, amountBreakdown);

  /* ================= APPEND ALL ================= */
  wrapper.append(productHeader, productSize, deliveryInfo, ScrollWrap, actions);

  checkoutDropdown.appendChild(wrapper);

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    // move to step 2
    deliveryInfoVerify.classList.remove("none");
    paying_to.classList.remove("none");
    amountBreakdown.classList.remove("none");
    SelectedSize.classList.remove("none");
  });
}
