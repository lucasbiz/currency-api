import styles from "./EmptyState.module.css";

function EmptyState() {
  return (
    <div className={styles.container}>
      <div className={styles.icon}>
        <span className="material-symbols-outlined">monitoring</span>
      </div>
      <h2 className={styles.title}>Nenhuma moeda selecionada</h2>
      <p className={styles.message}>
        Selecione moedas na barra lateral para começar a acompanhar as cotações.
      </p>
      <div className={styles.suggestions}>
        <p className={styles.suggestionLabel}>Sugestões:</p>
        <div className={styles.suggestionChips}>
          <span className={styles.chip}>USD/BRL</span>
          <span className={styles.chip}>EUR/BRL</span>
          <span className={styles.chip}>BTC/BRL</span>
        </div>
      </div>
    </div>
  );
}

export default EmptyState;
