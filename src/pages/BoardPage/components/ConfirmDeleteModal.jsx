import { useEscapeKey } from "../../../hooks/useEscapeKey.js";
import styles from "./ConfirmDeleteModal.module.css";

export function ConfirmDeleteModal({ isOpen, onClose, onConfirm, title, message }) {
  useEscapeKey(isOpen, onClose);

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.confirmModal}>
        <div className={styles.confirmModalHeader}>
          <div className={styles.confirmModalIcon}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>
          <div>
            <h2>{title}</h2>
            <p>{message}</p>
          </div>
        </div>
        <div className={styles.modalActions}>
          <button onClick={onClose} className={styles.cancelButton}>
            Cancelar
          </button>
          <button onClick={onConfirm} className={`${styles.submitButton} ${styles.dangerButton}`}>
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
}