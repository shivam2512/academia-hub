/**
 * Anti-inspection script for production.
 * Disables right-click, DevTools shortcuts, and adds a debugger trap.
 * Only active when NOT in development mode.
 */

export function initAntiInspect() {
  if (import.meta.env.DEV) return;

  // 1. Disable right-click context menu
  document.addEventListener("contextmenu", (e) => e.preventDefault());

  // 2. Block common DevTools keyboard shortcuts
  document.addEventListener("keydown", (e) => {
    // F12
    if (e.key === "F12") {
      e.preventDefault();
      return;
    }
    // Ctrl+Shift+I (Inspect), Ctrl+Shift+J (Console), Ctrl+Shift+C (Element picker)
    if (e.ctrlKey && e.shiftKey && ["I", "J", "C"].includes(e.key)) {
      e.preventDefault();
      return;
    }
    // Ctrl+U (View Source)
    if (e.ctrlKey && e.key === "u") {
      e.preventDefault();
      return;
    }
  });

  // 3. Debugger trap — fires every 2 seconds if DevTools is open
  const debuggerLoop = () => {
    // eslint-disable-next-line no-debugger
    debugger;
  };
  setInterval(debuggerLoop, 2000);

  // 4. Clear console and show a warning
  console.clear();
  console.log(
    "%c⚠️ Stop!",
    "color: red; font-size: 40px; font-weight: bold;"
  );
  console.log(
    "%cThis browser feature is intended for developers. If someone told you to copy-paste something here, it is a scam.",
    "font-size: 16px;"
  );
}
