import React, { useState, useEffect } from "react";
import "./Utilities.css";

function InstallPWAButton() {
  const [deferredPrompt, setDeferredPrompt] = useState("");

  useEffect(() => {
    window.addEventListener("beforeinstallprompt", (e) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later.
      setDeferredPrompt(e);
    });

    window.addEventListener("appinstalled", () => {
      // Log install to analytics
      console.log("INSTALL: Success");
      setDeferredPrompt("");
    });
    if (window.matchMedia("(display-mode: standalone)").matches) {
      console.log("installed?");
    }
  }, []);

  const handleInstallClick = (e) => {
    // Show the install prompt
    deferredPrompt.prompt();
    // Wait for the user to respond to the prompt
    deferredPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === "accepted") {
        console.log("User accepted the install prompt");
      } else {
        console.log("User dismissed the install prompt");
      }
    });
  };

  return (
    <React.Fragment>
      {deferredPrompt !== "" && (
        <button type="button" className="pwaBtn" onClick={handleInstallClick}>
          Installér App
        </button>
      )}
    </React.Fragment>
  );
}

export default InstallPWAButton;
