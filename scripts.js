const USERNAME = "kvegdani";
const API_KEY = "3c559fb856d05b0a101f9d7673c4a572";

const URL = `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${USERNAME}&api_key=${API_KEY}&format=json&limit=1`;

let lastPlayedUnix = null;
let isNowPlaying = false;
let currentTrackName = ""; // Track identifier to detect changes

// Convert Unix timestamp to relative time
function timeAgoFromUnix(unixSeconds) {
  const secondsAgo = Math.floor(Date.now() / 1000) - unixSeconds;

  if (secondsAgo < 60) return "Just now";

  const minutes = Math.floor(secondsAgo / 60);
  if (minutes < 60) return `${minutes} minute${minutes !== 1 ? "s" : ""} ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours !== 1 ? "s" : ""} ago`;

  const days = Math.floor(hours / 24);
  return `${days} day${days !== 1 ? "s" : ""} ago`;
}

// Update the "time ago" text
function updateTimeAgo() {
  const timeEl = document.getElementById("timeAgo");

  if (isNowPlaying) {
    timeEl.classList.add("listening");

    if (lastPlayedUnix) {
      const secondsElapsed = Math.floor(Date.now() / 1000 - lastPlayedUnix);
      timeEl.textContent = `Listening Now · ${secondsElapsed}s`;
    } else {
      timeEl.textContent = "Listening Now";
    }

  } else if (lastPlayedUnix) {
    timeEl.classList.remove("listening");
    timeEl.textContent = "Played " + timeAgoFromUnix(lastPlayedUnix);
  }
}


// Fetch latest track and update UI
function fetchLatestTrack() {
  fetch(URL)
    .then(res => res.json())
    .then(data => {
      const track = data.recenttracks.track[0];

      // Detect if track changed
      const trackIdentifier = track.artist["#text"] + " - " + track.name;
      if (trackIdentifier === currentTrackName) {
        // Track hasn’t changed, just update time
        updateTimeAgo();
        return;
      }

      currentTrackName = trackIdentifier;
      isNowPlaying = !!track["@attr"]?.nowplaying;
      lastPlayedUnix = track.date?.uts ? Number(track.date.uts) : null;

      // Update song info
      document.getElementById("song").textContent = track.name;
    //   document.getElementById("artist").textContent = track.artist["#text"];

      // Album art
      const image = track.image.at(-1)["#text"];
      if (image) {
        const cover = document.getElementById("cover");
        cover.src = image;
        cover.alt = `Album cover for ${track.album["#text"]}`;
      }

      // Spotify search link
      const spotifySearch = `https://open.spotify.com/search/${encodeURIComponent(
        track.artist["#text"] + " " + track.name
      )}`;
      const link = document.getElementById("songLink");
      link.href = spotifySearch;

      // Update initial time
      updateTimeAgo();
    })
    .catch(err => console.error("Last.fm fetch error:", err));
}

// Run initially
fetchLatestTrack();

// ✅ Update every 10 seconds
setInterval(fetchLatestTrack, 10_000);

// ✅ Update "time ago" every second for live feeling
setInterval(updateTimeAgo, 1_000);



// Mouse Hover
// Select all elements you want this effect on
// Select all elements you want this effect on
const hoverElements = document.querySelectorAll(".inline-link, .tool-btn");

hoverElements.forEach(el => {
    el.addEventListener("mousemove", e => {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left; 
        const y = e.clientY - rect.top;

        const offsetX = (x - el.offsetWidth / 2) * 0.2; // use offsetWidth/Height
        const offsetY = (y - el.offsetHeight / 2) * 0.2;

        const maxOffset = 8;
        const finalX = Math.max(Math.min(offsetX, maxOffset), -maxOffset);
        const finalY = Math.max(Math.min(offsetY, maxOffset), -maxOffset);

        el.style.setProperty("--hover-translate-x", finalX + "px");
        el.style.setProperty("--hover-translate-y", finalY + "px");
    });

    el.addEventListener("mouseenter", () => el.classList.add("hover-active"));
    el.addEventListener("mouseleave", () => el.classList.remove("hover-active"));

    // Remove hover effect on click
    el.addEventListener("mousedown", () => el.classList.remove("hover-active"));
});





// Adding Time

const pstEl = document.getElementById("pstTime");
const emojiEl = document.getElementById("seasonEmoji");

// Return season emoji based on month
function getSeasonEmoji() {
  const month = new Date().getMonth() + 1; // 1-12

  if (month >= 3 && month <= 5) return "🌱";  // Spring
  if (month >= 6 && month <= 8) return "☀️";  // Summer
  if (month >= 9 && month <= 11) return "🍂"; // Autumn
  return "❄️";                                // Winter (Dec-Feb)
}

// Update PST clock + emoji
function updatePSTTime() {
  const now = new Date();

  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Los_Angeles",
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });

  emojiEl.textContent = getSeasonEmoji();
  pstEl.innerHTML = `${emojiEl.outerHTML}${formatter.format(now)} | YVR`;
}

// Initial run
updatePSTTime();

// Update every second
setInterval(updatePSTTime, 1000);





// Switching Themes

document.addEventListener("DOMContentLoaded", () => {
    const themeToggle = document.getElementById("themeToggle");
    const themeIcon = document.getElementById("themeIcon");
    const root = document.documentElement;

    if (!themeToggle || !themeIcon) return;

    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)");

    /* 🌙 DARK / ALT THEME ICON */
    const altIcon = `
        <path d="M13.025 6L10.025 3L13.025 0L16.025 3L13.025 6ZM18.025 9L16.025 7L18.025 5L20.025 7L18.025 9ZM10.1 20C8.7 20 7.3875 19.7333 6.1625 19.2C4.9375 18.6667 3.87083 17.9458 2.9625 17.0375C2.05417 16.1292 1.33333 15.0625 0.8 13.8375C0.266667 12.6125 0 11.3 0 9.9C0 7.46667 0.775 5.32083 2.325 3.4625C3.875 1.60417 5.85 0.45 8.25 0C7.95 1.65 8.04167 3.2625 8.525 4.8375C9.00833 6.4125 9.84167 7.79167 11.025 8.975C12.2083 10.1583 13.5875 10.9917 15.1625 11.475C16.7375 11.9583 18.35 12.05 20 11.75C19.5667 14.15 18.4167 16.125 16.55 17.675C14.6833 19.225 12.5333 20 10.1 20Z"
        fill="currentColor"/>
    `;

    /* ☀️ LIGHT THEME ICON */
    const lightIcon = `
        <path d="M10 3V0H12V3H10ZM10 22V19H12V22H10ZM19 12V10H22V12H19ZM0 12V10H3V12H0ZM17.7 5.7L16.3 4.3L18.05 2.5L19.5 3.95L17.7 5.7ZM3.95 19.5L2.5 18.05L4.3 16.3L5.7 17.7L3.95 19.5ZM18.05 19.5L16.3 17.7L17.7 16.3L19.5 18.05L18.05 19.5ZM4.3 5.7L2.5 3.95L3.95 2.5L5.7 4.3L4.3 5.7ZM11 17C9.33333 17 7.91667 16.4167 6.75 15.25C5.58333 14.0833 5 12.6667 5 11C5 9.33333 5.58333 7.91667 6.75 6.75C7.91667 5.58333 9.33333 5 11 5C12.6667 5 14.0833 5.58333 15.25 6.75C16.4167 7.91667 17 9.33333 17 11C17 12.6667 16.4167 14.0833 15.25 15.25C14.0833 16.4167 12.6667 17 11 17Z"
        fill="currentColor"/>
    `;

    function applyTheme(theme) {
        if (theme === "alt") {
            root.setAttribute("data-theme", "alt");
            themeIcon.innerHTML = altIcon;
        } else {
            root.removeAttribute("data-theme");
            themeIcon.innerHTML = lightIcon;
        }
    }

    /* 🔁 INITIAL LOAD */
    const themeSource = localStorage.getItem("themeSource");
    const savedTheme = localStorage.getItem("theme");

    if (themeSource === "user" && savedTheme) {
        applyTheme(savedTheme);
    } else {
        applyTheme(prefersDark.matches ? "alt" : "light");
    }

    /* 👂 FOLLOW SYSTEM CHANGES (only if user hasn’t overridden) */
    prefersDark.addEventListener("change", e => {
        if (localStorage.getItem("themeSource") !== "user") {
            applyTheme(e.matches ? "alt" : "light");
        }
    });

    /* 👆 USER TOGGLE */
    themeToggle.addEventListener("click", () => {
        const isAlt = root.getAttribute("data-theme") === "alt";
        const nextTheme = isAlt ? "light" : "alt";

        localStorage.setItem("theme", nextTheme);
        localStorage.setItem("themeSource", "user");
        applyTheme(nextTheme);
    });
});
