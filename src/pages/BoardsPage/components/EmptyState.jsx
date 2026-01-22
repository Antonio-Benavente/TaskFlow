import styles from "./EmptyState.module.css";

export function EmptyState({ onCreateBoard }) {
  return (
    <div className={styles.emptyState}>
      <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
        <line x1="9" y1="9" x2="15" y2="9" />
        <line x1="9" y1="15" x2="15" y2="15" />
      </svg>
      <h2>No tienes tableros aún</h2>
      <p>Crea tu primer tablero para empezar a organizar tus tareas</p>
      <button className={styles.createButton} onClick={onCreateBoard}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
        Crear mi primer tablero
      </button>
    </div>
  );
}