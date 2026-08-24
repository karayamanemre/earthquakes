const STORAGE_KEY = "earthquakes-theme";

function updateButton(button, theme) {
  const next = theme === "dark" ? "light" : "dark";
  button.setAttribute("aria-label", `Switch to ${next} theme`);
  button.querySelector("[data-theme-icon]").textContent = theme === "dark" ? "☀" : "☾";
  button.querySelector("[data-theme-label]").textContent = theme === "dark" ? "Light" : "Dark";
}

export function initTheme() {
  const button = document.querySelector("[data-theme-toggle]");
  const current = document.documentElement.dataset.theme || "light";
  if (button) {
    updateButton(button, current);
    button.addEventListener("click", () => {
      const theme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
      document.documentElement.dataset.theme = theme;
      localStorage.setItem(STORAGE_KEY, theme);
      updateButton(button, theme);
    });
  }
  document.querySelectorAll("[data-current-year]").forEach((element) => { element.textContent = new Date().getFullYear(); });
}
