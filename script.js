window.addEventListener("DOMContentLoaded", () => {
  const getStartedBtn = document.getElementById("getStartedBtn");
  const introSection = document.getElementById("introSection");
  const profileSection = document.getElementById("profileSection");

  if (getStartedBtn && introSection && profileSection) {
    getStartedBtn.addEventListener("click", () => {
      introSection.style.display = "none";
      profileSection.style.display = "block";
      startListening(); // optional, but probably what you want
    });
  } else {
    console.error("Missing element(s):", {
      getStartedBtn,
      introSection,
      profileSection,
    });
  }
});

