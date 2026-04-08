(function () {
  "use strict";

  const isTargetChecksPage = () =>
    /^\/[^/]+\/[^/]+\/pull\/\d+\/checks/.test(window.location.pathname) &&
    new URL(window.location.href).searchParams.has("check_run_id");

  const findAndFollowBuildLink = () => {
    /** @type {HTMLAnchorElement | null} */
    const link = document.querySelector(
      'a[href^="https://console.cloud.google.com/cloud-build/builds/"]',
    );
    if (!link || !link.href) {
      return false;
    }
    window.location.href = link.href;
    return true;
  };

  const runRedirect = () => {
    if (!isTargetChecksPage()) {
      return false;
    }
    return findAndFollowBuildLink();
  };

  let observerAttached = false;
  const observer = new MutationObserver(() => {
    if (runRedirect()) {
      observer.disconnect();
      observerAttached = false;
    }
  });

  const startObserver = () => {
    if (observerAttached || !document.body) {
      return;
    }
    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
    observerAttached = true;
  };

  const onLocationChange = () => {
    if (runRedirect()) {
      return;
    }
    startObserver();
  };

  /**
   * @param {'pushState'|'replaceState'} method
   */
  const patchHistoryMethod = (method) => {
    /** @type {function(...any): any} */
    const original = history[method];
    history[method] = function (...args) {
      const result = original.apply(this, args);
      window.dispatchEvent(new Event("locationchange"));
      return result;
    };
  };

  patchHistoryMethod("pushState");
  patchHistoryMethod("replaceState");

  window.addEventListener("popstate", () =>
    window.dispatchEvent(new Event("locationchange")),
  );
  window.addEventListener("locationchange", onLocationChange);
  document.addEventListener("pjax:end", onLocationChange, true);
  document.addEventListener("pjax:success", onLocationChange, true);

  if (!runRedirect()) {
    if (document.readyState === "loading") {
      window.addEventListener("DOMContentLoaded", startObserver, {
        once: true,
      });
    } else {
      startObserver();
    }
  }
})();
