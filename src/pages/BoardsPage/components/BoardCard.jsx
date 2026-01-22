import styles from "./BoardCard.module.css";

export function BoardCard({ board, onOpen, onEdit, onDelete }) {
  const handleCardClick = () => {
    onOpen(board.id);
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    onEdit(board);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    onDelete(board);
  };

  const totalTasks = board.columns?.reduce((acc, col) => acc + (col.tasks?.length || 0), 0) || 0;

  return (
    <article className={styles.boardCard} onClick={handleCardClick}>
      <div className={styles.boardImageContainer}>
        {board.cover ? (
          <img className={styles.boardImage} src={board.cover} alt={board.title} />
        ) : (
          <div className={styles.boardImagePlaceholder}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.3">
              <rect x="3" y="3" width="7" height="7" />
              <rect x="14" y="3" width="7" height="7" />
              <rect x="14" y="14" width="7" height="7" />
              <rect x="3" y="14" width="7" height="7" />
            </svg>
          </div>
        )}
        <div className={styles.boardOverlay}>
          <button
            className={styles.quickOpenButton}
            onClick={(e) => {
              e.stopPropagation();
              onOpen(board.id);
            }}
            aria-label="Abrir tablero"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
              <polyline points="15 3 21 3 21 9" />
              <line x1="10" y1="14" x2="21" y2="3" />
            </svg>
            Abrir
          </button>
        </div>
      </div>

      <div className={styles.boardInfo}>
        <div className={styles.boardHeader}>
          <h2>{board.title}</h2>
          <div className={styles.boardActions}>
            <button
              className={styles.iconButton}
              aria-label="Editar tablero"
              onClick={handleEdit}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
            </button>
            <button
              className={`${styles.iconButton} ${styles.deleteButton}`}
              aria-label="Eliminar tablero"
              onClick={handleDelete}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
              </svg>
            </button>
          </div>
        </div>
        <p className={styles.boardDescription}>
          {board.description || 'Sin descripción'}
        </p>
        <div className={styles.boardMeta}>
          <span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="7" height="7" />
              <rect x="14" y="3" width="7" height="7" />
              <rect x="14" y="14" width="7" height="7" />
              <rect x="3" y="14" width="7" height="7" />
            </svg>
            {board.columns?.length || 0} secciones
          </span>
          <span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 11l3 3L22 4" />
              <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
            </svg>
            {totalTasks} tareas
          </span>
        </div>
      </div>
    </article>
  );
}