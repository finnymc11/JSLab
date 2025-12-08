// travel_recommendation.js

let travelData = null;

document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("search-input");
  const searchButton = document.getElementById("search-button");
  const clearButton = document.getElementById("clear-button");
  const resultsContainer = document.getElementById("results");
  const navLinks = document.querySelectorAll(".nav-link");
  const sections = document.querySelectorAll(".page-section");
  const searchContainer = document.getElementById("search-container");

  // ---- NAVIGATION (Home / About / Contact) ----
  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const sectionId = link.getAttribute("data-section");

      // highlight active nav item
      navLinks.forEach((lnk) => lnk.classList.remove("active"));
      link.classList.add("active");

      // show the selected section
      sections.forEach((sec) => {
        if (sec.id === sectionId) {
          sec.classList.add("active");
        } else {
          sec.classList.remove("active");
        }
      });

      // show search bar only on Home
      if (sectionId === "home") {
        searchContainer.style.display = "flex";
      } else {
        searchContainer.style.display = "none";
      }
    });
  });

  // ---- FETCH JSON DATA ----
  fetch("travel_recommendation_api.json")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to load travel_recommendation_api.json");
      }
      return response.json();
    })
    .then((data) => {
      travelData = data;
      console.log("Loaded travel recommendation data:", travelData);
    })
    .catch((error) => {
      console.error("Error loading travel data:", error);
    });

  // ---- SEARCH BUTTON ----
  searchButton.addEventListener("click", () => {
    if (!travelData) {
      alert("Travel data not loaded yet. Please try again in a moment.");
      return;
    }

    const rawKeyword = searchInput.value.trim();
    if (!rawKeyword) {
      alert("Please enter a keyword (e.g., beach, temple, Japan).");
      return;
    }

    const keyword = rawKeyword.toLowerCase();
    resultsContainer.innerHTML = ""; // clear previous

    // Determine what to search for
    if (keyword.startsWith("beach")) {
      // "beach", "beaches", "BEACHES", etc.
      showBeaches(travelData.beaches);
    } else if (keyword.startsWith("temple")) {
      // "temple", "temples", etc.
      showTemples(travelData.temples);
    } else {
      // Assume user is searching by country name
      showCountriesByKeyword(keyword, travelData.countries);
    }
  });

  // ---- CLEAR / RESET BUTTON ----
  clearButton.addEventListener("click", () => {
    searchInput.value = "";
    resultsContainer.innerHTML = "";
  });

  // Optional: prevent actual submission on Contact form
  const contactForm = document.getElementById("contact-form");
  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      alert("Thank you for contacting us! (Form submission demo)");
      contactForm.reset();
    });
  }

  // ---- RENDER FUNCTIONS ----

  function createCard({ name, imageUrl, description }) {
    const card = document.createElement("div");
    card.className = "card";

    const img = document.createElement("img");
    img.src = imageUrl;
    img.alt = name;

    const body = document.createElement("div");
    body.className = "card-body";

    const title = document.createElement("h3");
    title.textContent = name;

    const desc = document.createElement("p");
    desc.textContent = description;

    body.appendChild(title);
    body.appendChild(desc);

    card.appendChild(img);
    card.appendChild(body);

    return card;
  }

  function showBeaches(beaches) {
    if (!beaches || beaches.length === 0) {
      resultsContainer.textContent = "No beach recommendations found.";
      return;
    }

    beaches.forEach((beach) => {
      const card = createCard(beach);
      resultsContainer.appendChild(card);
    });
  }

  function showTemples(temples) {
    if (!temples || temples.length === 0) {
      resultsContainer.textContent = "No temple recommendations found.";
      return;
    }

    temples.forEach((temple) => {
      const card = createCard(temple);
      resultsContainer.appendChild(card);
    });
  }

  function showCountriesByKeyword(keyword, countries) {
    const matches = [];

    countries.forEach((country) => {
      if (country.name.toLowerCase().includes(keyword)) {
        // push its cities as recommendations
        country.cities.forEach((city) => {
          matches.push(city);
        });
      }
    });

    if (matches.length === 0) {
      resultsContainer.textContent =
        "No recommendations found for that country. Try 'beach', 'temple', 'Australia', 'Japan', or 'Brazil'.";
      return;
    }

    matches.forEach((city) => {
      const card = createCard(city);
      resultsContainer.appendChild(card);
    });
  }
});
