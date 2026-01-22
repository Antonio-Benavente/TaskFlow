import { useState, useEffect, useRef } from "react";
import { useEscapeKey } from "../../../hooks/useEscapeKey";
import styles from "./BoardModal.module.css";

export function BoardModal({ isOpen, onClose, onSubmit, editingBoard }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    cover: ''
  });
  const [coverPreview, setCoverPreview] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const uploadAreaRef = useRef(null);

  useEffect(() => {
    if (editingBoard) {
      setFormData({
        title: editingBoard.title,
        description: editingBoard.description || '',
        cover: editingBoard.cover || ''
      });
      setCoverPreview(editingBoard.cover || null);
    } else {
      setFormData({ title: '', description: '', cover: '' });
      setCoverPreview(null);
    }
  }, [editingBoard]);

  useEscapeKey(isOpen, onClose);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const processImageFile = (file) => {
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('La imagen no debe superar los 5MB');
      return;
    }

    if (!file.type.startsWith('image/')) {
      alert('Solo se permiten archivos de imagen');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setCoverPreview(reader.result);
      setFormData({
        ...formData,
        cover: reader.result
      });
    };
    reader.onerror = () => {
      console.error('Error reading file');
      alert('Error al cargar la imagen');
    };
    reader.readAsDataURL(file);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    processImageFile(file);
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.target === uploadAreaRef.current) {
      setIsDragging(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      processImageFile(files[0]);
    }
  };

  const handleRemoveCover = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setCoverPreview(null);
    setFormData({ ...formData, cover: '' });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;
    onSubmit(formData);
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <div>
            <h2>{editingBoard ? 'Editar Tablero' : 'Crear Tablero'}</h2>
            <p className={styles.modalSubtitle}>
              {editingBoard 
                ? 'Modifica la información de tu tablero' 
                : 'Personaliza tu espacio de trabajo para comenzar'}
            </p>
          </div>
          <button
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Cerrar modal"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
        <form onSubmit={handleSubmit} className={styles.modalForm}>
          <div className={styles.formRow}>
            <div className={styles.formLeft}>
              <div className={styles.formGroup}>
                <label htmlFor="title">
                  Nombre del tablero <span className={styles.required}>*</span>
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Ej. Marketing Q3"
                  required
                  autoFocus
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="description">
                  Descripción <span className={styles.optional}>(Opcional)</span>
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe el propósito de este tablero..."
                  rows="4"
                />
              </div>
            </div>
            <div className={styles.formRight}>
              <div className={styles.formGroup}>
                <label>Personalización</label>
                <p className={styles.uploadLabel}>Cargar Imagen de Portada</p>
                <label 
                  ref={uploadAreaRef}
                  className={`${styles.uploadArea} ${isDragging ? styles.dragOver : ''}`}
                  onDragEnter={handleDragEnter}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    style={{ display: 'none' }}
                  />
                  {coverPreview ? (
                    <div className={styles.coverPreviewContainer}>
                      <img src={coverPreview} alt="Preview" className={styles.coverPreview} />
                      <button
                        type="button"
                        className={styles.removeImageButton}
                        onClick={handleRemoveCover}
                        aria-label="Eliminar imagen"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <line x1="18" y1="6" x2="6" y2="18" />
                          <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                      </button>
                    </div>
                  ) : (
                    <div className={styles.uploadPlaceholder}>
                      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                        <circle cx="8.5" cy="8.5" r="1.5" />
                        <polyline points="21 15 16 10 5 21" />
                      </svg>
                      <p>
                        <span className={styles.uploadLink}>Sube un archivo</span> o arrastra aquí
                      </p>
                      <p className={styles.uploadHint}>PNG, JPG, GIF hasta 5MB</p>
                    </div>
                  )}
                </label>
              </div>
            </div>
          </div>
          <div className={styles.modalActions}>
            <button type="button" onClick={onClose} className={styles.cancelButton}>
              Cancelar
            </button>
            <button type="submit" className={styles.submitButton}>
              {editingBoard ? 'Guardar Cambios' : 'Crear Tablero'}
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}