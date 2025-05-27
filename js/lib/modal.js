let responsecodes = [];
function createModal({ title = "", message = "", buttons = [], type = "info", textarea = false }) {
  return new Promise((resolve) => {
    const modal = document.createElement("div");
    modal.classList.add("modal-container");

    // Erstelle den HTML-Inhalt des Modals, optional mit Textarea
    modal.innerHTML = `
            <div class="modal-content ${type}">
                <span class="modal-close">&times;</span>
                <h2 class="modal-title">${title}</h2>
                <p class="modal-message">${message}</p>
                ${textarea ? `<textarea class="modal-textarea" placeholder="${typeof textarea === "object" && textarea.placeholder ? textarea.placeholder : ""}">${typeof textarea === "object" && textarea.value ? textarea.value : ""}</textarea>` : ""}
                <div class="modal-buttons">
                    ${buttons.map((btn, index) => `<button class="modal-button" data-index="${index}">${btn}</button>`).join("")}
                </div>
            </div>
        `;

    document.body.appendChild(modal);

    setTimeout(() => modal.classList.add("modal-show"), 10);

    const buttonElements = modal.querySelectorAll(".modal-button");
    buttonElements.forEach((btn) => {
      btn.addEventListener("click", (event) => {
        const index = event.target.getAttribute("data-index");
        const textareaElement = modal.querySelector(".modal-textarea");
        if (textareaElement) {
          resolve({ button: Number(index), value: textareaElement.value });
        } else {
          resolve(Number(index));
        }
        closeModal(modal);
      });
    });

    const closeButton = modal.querySelector(".modal-close");
    closeButton.addEventListener("click", () => {
      resolve(null);
      closeModal(modal);
    });

    modal.addEventListener("click", (event) => {
      if (event.target === modal) {
        resolve(null);
        closeModal(modal);
      }
    });
    const tarea = document.querySelector(".modal-content textarea");

    if (tarea) {
      setTimeout(() => {
        tarea.focus();
      }, 10);
    }
  });

  function closeModal(modalElement) {
    modalElement.classList.add("modal-fade-out");
    setTimeout(() => {
      modalElement.innerHTML = "";
      modalElement.remove();
    }, 300);
  }
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
function info(title, text = "") {
  return createModal({
    title: title,
    message: userfriendlymsg(text),
    buttons: ["OK"],
    type: "info",
  });
}

function Merror(title, text = "") {
  return createModal({
    title: title,
    message: userfriendlymsg(text),
    buttons: ["OK"],
    type: "error",
  });
}

function warnig(title, text = "") {
  return createModal({
    title: title,
    message: userfriendlymsg(text),
    buttons: ["OK"],
    type: "warning",
  });
}
function confirm(title, text = "") {
  return createModal({
    title: title,
    message: userfriendlymsg(text),
    buttons: ["Cancel", "Confirm"],
    type: "warning",
  });
}
