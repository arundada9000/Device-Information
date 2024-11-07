// Ui js
document.addEventListener("DOMContentLoaded", () => {
  // Initial fade-in animation on load
  document.querySelectorAll(".info-container").forEach((container, index) => {
    container.style.animationDelay = `${index * 0.1}s`;
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("fade-in");
        } else {
          entry.target.classList.remove("fade-in");
        }
      });
    },
    { threshold: 0.1 }
  );

  document.querySelectorAll(".info-section").forEach((section) => {
    observer.observe(section);
  });
});

// service worker
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/service-worker.js")
      .then((registration) => {
        // console.log("Service Worker registered:", registration);
      })
      .catch((error) => {
        console.error("Service Worker registration failed:", error);
      });
  });
}
// For installation
let deferredPrompt;

window.addEventListener("beforeinstallprompt", (event) => {
  deferredPrompt = event;
  document.querySelector(".refresh-button").style.display = "none";
});

function installPWA() {
  if (deferredPrompt) {
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === "accepted") {
        console.log("Installed");
        document.querySelector(".refresh-button").style.display = "block";
        document.querySelector(".install-button").style.display = "none";
      } else {
        console.log("Dismissed");
      }
      deferredPrompt = null;
    });
  }
}

function refreshApp() {
  navigator.serviceWorker.ready.then((registration) => {
    caches.delete("my-cache-name");
    window.location.reload();
  });
}

// Basic Information
document.getElementById("userAgent").textContent = navigator.userAgent;
document.getElementById("platform").textContent = navigator.platform;
document.getElementById("browser").textContent = navigator.userAgent;

// Browser Information
if (navigator.userAgentData) {
  document.getElementById("browserName").innerText =
    navigator.userAgentData.brands[0]?.brand || "Unavailable";
  document.getElementById("browserVersion").innerText =
    navigator.userAgentData.brands[0]?.version || "Unavailable";
} else {
  document.getElementById("browserName").innerText = "Unavailable";
  document.getElementById("browserVersion").innerText = "Unavailable";
}
document.getElementById("cookiesEnabled").innerText = navigator.cookieEnabled
  ? "Yes"
  : "No";
document.getElementById("language").innerText = navigator.language;
document.getElementById("timeZone").innerText =
  Intl.DateTimeFormat().resolvedOptions().timeZone;

// Screen Information
document.getElementById(
  "resolution"
).innerText = `${screen.width} x ${screen.height}`;
document.getElementById("availWidth").innerText = screen.availWidth;
document.getElementById("availHeight").innerText = screen.availHeight;
document.getElementById("pixelRatio").innerText = window.devicePixelRatio;
document.getElementById("colorDepth").innerText = screen.colorDepth;
if (window.screen.orientation) {
  document.getElementById("orientation").textContent =
    window.screen.orientation.type;
} else {
  document.getElementById("orientation").textContent = "Unavailable";
}

// Memory & Processor Information
if (navigator.deviceMemory) {
  document.getElementById("memory").innerText = `${navigator.deviceMemory} GB`;
} else {
  document.getElementById("memory").innerText = "Unavailable";
}
document.getElementById("processorCores").innerText =
  navigator.hardwareConcurrency || "Unavailable";
document.getElementById("hardwareConcurrency").innerText =
  navigator.hardwareConcurrency || "Unavailable";

// Network Information
if (navigator.connection) {
  document.getElementById("networkType").innerText =
    navigator.connection.type || "Unknown";
  document.getElementById("effectiveType").innerText =
    navigator.connection.effectiveType || "Unknown";
  document.getElementById("rtt").innerText = `${navigator.connection.rtt} ms`;
  document.getElementById(
    "downlink"
  ).innerText = `${navigator.connection.downlink} Mbps`;
  document.getElementById("uplink").innerText = `${
    navigator.connection.uplink || "Unknown"
  } Mbps`;
} else {
  document.getElementById("networkType").innerText = "Unavailable";
  document.getElementById("effectiveType").innerText = "Unavailable";
  document.getElementById("rtt").innerText = "Unavailable";
  document.getElementById("downlink").innerText = "Unavailable";
  document.getElementById("uplink").innerText = "Unavailable";
}

// Battery Information
if (navigator.getBattery) {
  navigator.getBattery().then((battery) => {
    document.getElementById("batteryLevel").innerText = `${Math.round(
      battery.level * 100
    )}%`;
    document.getElementById("charging").innerText = battery.charging
      ? "Yes"
      : "No";
  });
} else {
  document.getElementById("batteryLevel").innerText = "Unavailable";
  document.getElementById("charging").innerText = "Unavailable";
}

// Display Preferences
document.getElementById("colorSchemePreference").innerText = window.matchMedia(
  "(prefers-color-scheme: dark)"
).matches
  ? "Dark"
  : "Light";
document.getElementById("reducedMotionPreference").innerText =
  window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ? "Reduced"
    : "Normal";

// gpu info
function getGPUInfo() {
  const canvas = document.createElement("canvas");
  const gl =
    canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
  if (gl) {
    const debugInfo = gl.getExtension("WEBGL_debug_renderer_info");
    const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
    const vendor = gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL);
    return { renderer, vendor };
  } else {
    return null;
  }
}

const gpuInfo = getGPUInfo();
if (gpuInfo) {
  document.getElementById("gpuVendor").innerText = gpuInfo.vendor;
  document.getElementById("gpuRenderer").innerText = gpuInfo.renderer;
} else {
  document.getElementById("gpuVendor").innerText = "Unavailable";
  document.getElementById("gpuRenderer").innerText = "Unavailable";
}

// Location
if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(
    (position) => {
      document.getElementById("latitude").innerText = position.coords.latitude;
      document.getElementById("longitude").innerText =
        position.coords.longitude;
    },
    (error) => {
      document.getElementById("latitude").innerText = "Permission denied";
      document.getElementById("longitude").innerText = "Permission denied";
    }
  );
} else {
  document.getElementById("latitude").innerText = "Not supported";
  document.getElementById("longitude").innerText = "Not supported";
}

// date and time
function updateDateTime() {
  const now = new Date();

  const date = now.toLocaleDateString();

  const time = now.toLocaleTimeString();

  const day = now.toLocaleString("en-US", { weekday: "long" });

  document.getElementById("currentDate").innerText = date;
  document.getElementById("currentTime").innerText = time;
  document.getElementById("currentDay").innerText = day;
}

setInterval(updateDateTime, 1000);

updateDateTime();
