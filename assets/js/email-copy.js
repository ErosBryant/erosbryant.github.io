(function () {
  "use strict";
  var hideTimer;
  function notify(message) {
    var toast = document.getElementById("email-toast");
    clearTimeout(hideTimer);
    toast.textContent = message;
    toast.classList.add("is-visible");
    hideTimer = setTimeout(function () { toast.classList.remove("is-visible"); }, 3000);
  }
  function legacyCopy(email) {
    var previous = document.activeElement;
    var field = document.createElement("textarea");
    field.value = email;
    field.setAttribute("readonly", "");
    field.style.cssText = "position:fixed;left:-9999px;top:0;font-size:16px;";
    document.body.appendChild(field);
    try {
      field.select();
      field.setSelectionRange(0, email.length);
      return document.execCommand("copy");
    } finally {
      field.remove();
      if (previous && previous.focus) previous.focus({ preventScroll: true });
    }
  }
  async function copy(email) {
    if (navigator.clipboard && window.isSecureContext) {
      try {
        await navigator.clipboard.writeText(email);
        return true;
      } catch (error) { /* Try the browser's legacy copy path. */ }
    }
    return legacyCopy(email);
  }
  document.addEventListener("click", async function (event) {
    var button = event.target.closest(".copy-email");
    if (!button) return;
    var email = button.getAttribute("data-email");
    if (!email) return;
    button.disabled = true;
    try {
      var copied = await copy(email);
      notify(copied ? "Email copied!" : "Unable to copy. Please copy manually: " + email);
    } catch (error) {
      notify("Unable to copy. Please copy manually: " + email);
    } finally {
      button.disabled = false;
    }
  });
}());
