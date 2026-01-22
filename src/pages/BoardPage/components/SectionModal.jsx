import { useState, useEffect, useCallback } from "react";
import { useEscapeKey } from "../../../hooks/useEscapeKey.js";
import styles from "./SectionModal.module.css";

export function SectionModal({ isOpen, onClose, onSubmit, editingSection }) {
  const [title, setTitle] = useState("");

  useEffect(() => {
    setTitle(editingSection?.title || "");
  }, [editingSection]);

  useEscapeKey(isOpen, onClose);

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSubmit(title);
  }, [title, onSubmit]);

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h2>{editingSection ? 'Editar Sección' : 'Nueva Sección'}</h2>
          <button className={styles.closeButton} onClick={onClose} aria-label="Cerrar">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
        <form onSubmit={handleSubmit} className={styles.modalForm}>
          <div className={styles.formGroup}>
            <label htmlFor="sectionTitle">
              Nombre de la sección <span className={styles.required}>*</span>
            </label>
            <input
              type="text"
              id="sectionTitle"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ej. En Revisión"
              required
              autoFocus
            />
          </div>
          <div className={styles.modalActions}>
            <button type="button" onClick={onClose} className={styles.cancelButton}>
              Cancelar
            </button>
            <button type="submit" className={styles.submitButton}>
              {editingSection ? 'Guardar Cambios' : 'Crear Sección'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}