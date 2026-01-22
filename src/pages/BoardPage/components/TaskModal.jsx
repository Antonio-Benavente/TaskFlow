import { useState, useEffect, useCallback } from "react";
import { useEscapeKey } from "../../../hooks/useEscapeKey.js";
import styles from "./TaskModal.module.css";

export function TaskModal({ isOpen, onClose, onSubmit, columnTitle, editingTask }) {
  const [formData, setFormData] = useState({
    title: "",
    description: ""
  });

  useEffect(() => {
    if (isOpen) {  // ← AGREGAR ESTA CONDICIÓN
      if (editingTask) {
        setFormData({
          title: editingTask.title || "",
          description: editingTask.description || ""
        });
      } else {
        setFormData({
          title: "",
          description: ""
        });
      }
    }
  }, [editingTask, isOpen]);  // ← AGREGAR isOpen AQUÍ

  useEscapeKey(isOpen, onClose);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }, []);

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;
    onSubmit(formData);
  }, [formData, onSubmit]);

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h2>{editingTask ? 'Editar Tarea' : `Nueva Tarea en ${columnTitle}`}</h2>
          <button className={styles.closeButton} onClick={onClose} aria-label="Cerrar">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
        <form onSubmit={handleSubmit} className={styles.modalForm}>
          <div className={styles.formGroup}>
            <label htmlFor="title">
              Título <span className={styles.required}>*</span>
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Ej. Diseñar mockups de landing page"
              required
              autoFocus
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="description">Descripción</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe los detalles de la tarea..."
              rows="3"
            />
          </div>
          <div className={styles.modalActions}>
            <button type="button" onClick={onClose} className={styles.cancelButton}>
              Cancelar
            </button>
            <button type="submit" className={styles.submitButton}>
              {editingTask ? 'Guardar Cambios' : 'Crear Tarea'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}