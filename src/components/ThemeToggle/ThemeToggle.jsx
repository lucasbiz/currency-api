import styles from "./ThemeToggle.module.css";

function ThemeToggle({ theme, setTheme }) {
  function handleToggle() {
    setTheme(prev => prev === "light" ? "dark" : "light");
  }

  return (
    <button
      className={styles.toggle}
      onClick={handleToggle}
      aria-label={theme === "dark" ? "Ativar modo claro" : "Ativar modo escuro"}
      aria-pressed={theme === "dark"}
      role="switch"
    >
      <span className={`material-symbols-outlined ${styles.icon}`} aria-hidden="true">
        {theme === "dark" ? "dark_mode" : "light_mode"}
      </span>
      <span className={styles.knob} />
    </button>
  );
}

export default ThemeToggle;
