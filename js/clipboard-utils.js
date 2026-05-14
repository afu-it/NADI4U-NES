(function (global) {
  function isEmbeddedContext() {
    try {
      return global.top !== global.self;
    } catch (error) {
      return true;
    }
  }

  function isClipboardPolicyBlockedError(error) {
    const message = String(error && error.message ? error.message : "").toLowerCase();
    return message.includes("clipboard api has been blocked") || message.includes("permissions policy applied");
  }

  function legacyCopyText(text) {
    if (!global.document || typeof global.document.createElement !== "function" || !global.document.body) {
      return false;
    }

    const textarea = global.document.createElement("textarea");
    textarea.value = String(text || "");
    textarea.setAttribute("readonly", "");
    textarea.setAttribute("aria-hidden", "true");
    textarea.style.position = "fixed";
    textarea.style.top = "0";
    textarea.style.left = "-9999px";
    textarea.style.opacity = "0";
    textarea.style.pointerEvents = "none";

    global.document.body.appendChild(textarea);

    try {
      if (typeof textarea.focus === "function") textarea.focus({ preventScroll: true });
      if (typeof textarea.select === "function") textarea.select();
      if (typeof textarea.setSelectionRange === "function") {
        textarea.setSelectionRange(0, textarea.value.length);
      }

      return typeof global.document.execCommand === "function"
        ? !!global.document.execCommand("copy")
        : false;
    } finally {
      textarea.remove();
    }
  }

  function showManualCopyPrompt(text) {
    if (typeof global.prompt !== "function") return false;
    global.prompt("Clipboard blocked in this embed. Copy title manually:", String(text || ""));
    return true;
  }

  async function copyText(text) {
    const value = String(text || "");
    let lastError = null;

    if (!value) {
      return { ok: false, manual: false, method: "none", error: null };
    }

    const shouldTryClipboardApi = !isEmbeddedContext();

    if (
      shouldTryClipboardApi &&
      global.navigator &&
      global.navigator.clipboard &&
      typeof global.navigator.clipboard.writeText === "function"
    ) {
      try {
        await global.navigator.clipboard.writeText(value);
        return { ok: true, manual: false, method: "clipboard", error: null };
      } catch (error) {
        lastError = error;
      }
    }

    try {
      if (legacyCopyText(value)) {
        return { ok: true, manual: false, method: "execCommand", error: lastError };
      }
    } catch (error) {
      lastError = error;
    }

    const prompted = showManualCopyPrompt(value);
    return {
      ok: false,
      manual: prompted,
      method: prompted ? "prompt" : "none",
      error: lastError
    };
  }

  global.NadiClipboardUtils = {
    copyText,
    isEmbeddedContext,
    isClipboardPolicyBlockedError,
    legacyCopyText
  };
})(window);
