import { useEscapeKey } from "../../../hooks/useEscapeKey";
import styles from "./DeleteBoardModal.module.css";

export function DeleteBoardModal({ isOpen, onClose, onConfirm, boardTitle }) {
  useEscapeKey(isOpen, onClose);

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.confirmModal}>
        <div className={styles.confirmModalHeader}>
          <div className={styles.confirmModalIcon}>
            <svg xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"><path d="M10.363 3.591L2.257 17.125a1.914 1.914 0 0 0 1.636 2.871h16.214a1.914 1.914 0 0 0 1.636-2.87L13.637 3.59a1.914 1.914 0 0 0-3.274 0zM12 9h.01"/><path d="M11 12h1v4h1"/></g></svg>
          </div>
          <div>
            <h2>¿Eliminar tablero?</h2>
            <p>
              Se eliminará permanentemente "<strong>{boardTitle}</strong>" y todas sus tareas. 
              Esta acción no se puede deshacer.
            </p>
          </div>
        </div>
        <div className={styles.modalActions}>
          <button onClick={onClose} className={styles.cancelButton}>
            Cancelar
          </button>
          <button onClick={onConfirm} className={`${styles.submitButton} ${styles.dangerButton}`}>
            Eliminar tablero
          </button>
        </div>
      </div>
    </div>
  );
}