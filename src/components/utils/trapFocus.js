export function trapFocus(popup) {
  function removePopupFocusListener() {
    popup.querySelectorAll("input").forEach((input) => {
      input.removeEventListener("keydown", handleInputKeydown);
      input.removeEventListener("pointerdown", handleInputPointerDown);
    });
  }

  function focusOut() {
    let pressedKeyName = this.getAttribute("data-button-key");
    this.value += pressedKeyName;
    this.focus();
    window.inputHasFocusOutListener = false;
    window.keyPressedOnInput = false;
    this.removeEventListener("focusout", focusOut);
  }

  function handleInputKeydown(e) {
    let key = e.key;
    if (key?.length > 1) return;
    this.setAttribute("data-button-key", key);
    if (!window.inputHasFocusOutListener) {
      window.inputHasFocusOutListener = true;
      this.addEventListener("focusout", focusOut);
    }
  }

  function handleInputPointerDown(e) {
    const currentInput = e.target;
    if (currentInput.tagName !== "INPUT") {
      removePopupFocusListener();
      return;
    }
    popup.querySelectorAll("input").forEach((input) => {
      if (input !== currentInput) {
        window.inputHasFocusOutListener = false;
        input.removeEventListener("focusout", focusOut);
      }
    });
  }

  popup.querySelectorAll("input").forEach((input) => {
    input.addEventListener("keydown", handleInputKeydown);
    input.addEventListener("pointerdown", handleInputPointerDown);
  });
}
