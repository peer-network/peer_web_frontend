function createModal({
  title = "",
  message = "",
  buttons = [],
  type = "info",
  textarea = false,
  dontShowOption = false, // Neu: Standardmäßig keine Checkbox anzeigen
  typeKey = null, // e.g., 'like', 'dislike', 'post', 'comment'
  svg = null
}) {
  const savedSettings = JSON.parse(localStorage.getItem("modalDoNotShow")) || {};
  if (typeKey && dontShowOption && savedSettings[typeKey] === true) {
    return Promise.resolve({ button: 1, dontShow: true });
  }
  return new Promise((resolve) => {
    const modal = document.createElement("div");
    modal.classList.add("modal-container");
    // Baue das HTML für die Checkbox nur ein, wenn dontShowOption true ist
    const checkboxHTML = dontShowOption
      ? `
        <div class="modal-checkbox">
          <label for="dont-show-checkbox">Do not show this message again</label>
          <input type="checkbox" id="dont-show-checkbox" />
        </div>`
      : "";

    // Erstelle den kompletten innerHTML-String
    modal.innerHTML = `
      <div class="modal-content ${type}">
        <span class="modal-close">&times;</span>
       ${svg ? `<span class="modal-icon">${svg}</span>` : ""}
        <h2 class="modal-title xxl_font_size">${title}</h2>
        ${message ? `<p class="modal-message xl_font_size">${message}</p>` : ""}
        
        ${checkboxHTML}
        ${textarea ? `<textarea class="modal-textarea" placeholder="${typeof textarea === "object" && textarea.placeholder ? textarea.placeholder : ""}">${typeof textarea === "object" && textarea.value ? textarea.value : ""}</textarea>` : ""}
        <div class="modal-buttons">
          ${buttons.map((btn, index) => {
            const label = typeof btn === "string" ? btn : btn.text;
            const extraClass = typeof btn === "object" && btn.className ? ` ${btn.className}` : "";
            return `<button class="modal-button${extraClass}" data-index="${index}">${label}</button>`;
          }).join("")}
        </div>
      </div>
    `;

    document.body.appendChild(modal);
    setTimeout(() => modal.classList.add("modal-show"), 10);

    // Falls Checkbox angezeigt wird: Referenz holen
    const checkboxElement = dontShowOption ? modal.querySelector("#dont-show-checkbox") : null;

    // Falls Textarea vorhanden
    const textareaElement = modal.querySelector(".modal-textarea");

    // Button-Handler
    const buttonElements = modal.querySelectorAll(".modal-button");
   
    buttonElements.forEach((btn) => {
      btn.addEventListener("click", (event) => {
        event.currentTarget.focus();
        const index = Number(event.target.getAttribute("data-index"));
        const isChecked = checkboxElement ? checkboxElement.checked : false;

        // Wenn Checkbox da ist und angehakt, in localStorage speichern
        
        /*if (dontShowOption && isChecked &&  index) {
          localStorage.setItem("modalDoNotShow", "true");
        }*/
        
        if (dontShowOption && isChecked && typeKey && index === 1) {
          savedSettings[typeKey] = true;
          localStorage.setItem("modalDoNotShow", JSON.stringify(savedSettings));
        }

        if (textareaElement) {
          resolve({ button: index, value: textareaElement.value, dontShow: isChecked });
        } else if (dontShowOption) {
          resolve({ button: index, dontShow: isChecked });
        } else {
          // resolve(index);
          resolve({ button: index });
        }
        closeModal(modal);
      });
    });

    // Close-Icon (×)
    const closeButton = modal.querySelector(".modal-close");
    closeButton.addEventListener("click", () => {
      const isChecked = checkboxElement ? checkboxElement.checked : false;

      if (dontShowOption && isChecked) {
        localStorage.setItem("modalDoNotShow", "true");
      }

      if (dontShowOption) {
        resolve({ button: null, dontShow: isChecked });
      } else {
        // resolve(null);
        resolve({ button: null });
      }
      closeModal(modal);
    });

    // Klick auf den Hintergrund schließt ebenfalls
    // khalid commented this out to prevent closing on background click becuase post like and dislike modals should not close on background click.
    /*modal.addEventListener("click", (event) => {
      if (event.target === modal) {
        const isChecked = checkboxElement ? checkboxElement.checked : false;

        if (dontShowOption && isChecked) {
          localStorage.setItem("modalDoNotShow", "true");
        }

        if (dontShowOption) {
          resolve({ button: null, dontShow: isChecked });
        } else {
          resolve(null);
        }
        closeModal(modal);
      }
    });*/

    // Fokus auf Textarea, falls vorhanden
    if (textareaElement) {
      setTimeout(() => {
        textareaElement.focus();
      }, 10);
    }
  });
  
}


function closeModal(modalElement) {
    modalElement.classList.add("modal-fade-out");
    setTimeout(() => {
      modalElement.remove();
    }, 300);
 }

function userfriendlymsg(code) {
  let msg;
  if (code in responsecodes.data) {
    msg = responsecodes.data[code].userFriendlyComment;
  } else {
    msg = code;
  }
  return msg;
}
function info(title, text = "", dontShowOption = false, svg = null) {
  return createModal({
    title: title,
    message: userfriendlymsg(text),
    buttons: [{ text: "Cancel", className: "btn-transparent" }, { text: "Confirm", className: "btn-white" }],
    type: "info",
    dontShowOption: dontShowOption,
    svg: svg
  });
}

function Merror(title, text = "", dontShowOption = false) {
  return createModal({
    title: title,
    message: userfriendlymsg(text),
    buttons: ["OK"],
    type: "error",
    dontShowOption: dontShowOption,
  });
}

function warnig(title, text = "", dontShowOption = false, svg = null) {
  return createModal({
    title: title,
    message: userfriendlymsg(text),
    buttons: [{ text: "Cancel", className: "btn-transparent" }, { text: "Confirm", className: "btn-white bold" }],
    type: "warning",
    dontShowOption: dontShowOption,
     svg: svg
  });
}
function success(title, text = "", dontShowOption = false, svg = null) {
  return createModal({
    title: title,
    message: userfriendlymsg(text),
    buttons: [{ text: "Okay", className: "btn-white bold" }],
    type: "success",
    dontShowOption: dontShowOption,
     svg: svg
  });
}
function confirm(title, text = "", dontShowOption = false, typeKey = null, svg = null) {
  return createModal({
    title: title,
    message: userfriendlymsg(text),
    buttons: [{ text: "No", className: "btn-white" }, { text: "Yes", className: "btn-blue" }],
    type: "warning",
    dontShowOption: dontShowOption,
    typeKey: typeKey, // Pass down to createModal
    svg: svg
  });
}