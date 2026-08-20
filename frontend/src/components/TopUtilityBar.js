import React, {
  createContext,
  useContext,
  useState,
} from "react";

const AppSettingsContext =
  createContext(null);

export function AppSettingsProvider({ children }) {
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState("English");

  const toggleTheme = () => {
    setDarkMode((prev) => !prev);
  };

  return (
    <AppSettingsContext.Provider
      value={{
        darkMode,
        language,
        setLanguage,
        toggleTheme,
      }}
    >
      {children}
    </AppSettingsContext.Provider>
  );
}

export function useAppSettings() {
  const context = useContext(
    AppSettingsContext
  );

  if (!context) {
    throw new Error(
      "useAppSettings must be used inside AppSettingsProvider"
    );
  }

  return context;
}

function TopUtilityBar() {
  const {
    darkMode,
    language,
    setLanguage,
    toggleTheme,
  } = useAppSettings();

  return (
    <div className="top-utility-bar">
      <div className="utility-container">

        <button
          type="button"
          className="theme-button"
          onClick={toggleTheme}
        >
          {darkMode
            ? "☀️ Light"
            : "🌙 Dark"}
        </button>

        <select
          className="language-select"
          value={language}
          onChange={(e) =>
            setLanguage(e.target.value)
          }
        >
          <option value="English">
            English
          </option>

          <option value="Hindi">
            हिंदी
          </option>

          <option value="Marathi">
            मराठी
          </option>
        </select>

      </div>
    </div>
  );
}

export default TopUtilityBar;