import { useState, useRef, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import styles from "./UserMenu.module.css"
import { AboutModal } from "../AboutModal/AboutModal.jsx"

export function UserMenu() {
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [showAboutModal, setShowAboutModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showProfileModal, setShowProfileModal] = useState(false)
  const menuRef = useRef(null)

  // Obtener datos del perfil del localStorage
  const [profileData, setProfileData] = useState(() => {
    const saved = localStorage.getItem('taskflow-profile')
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return {
          username: parsed.username || 'Usuario'
        };
      } catch (error) {
        console.error('Error loading profile:', error);
        return { username: 'Usuario' };
      }
    }
    return { username: 'Usuario' };
  });

  const [formData, setFormData] = useState(profileData);

  // Cerrar menú al hacer clic fuera
  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, []);

  // Cerrar modales con ESC
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        setShowDeleteModal(false);
        setShowProfileModal(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  const handleClearData = () => {
    setOpen(false);
    setShowDeleteModal(true);
  };

  const confirmClearData = () => {
    localStorage.clear();
    navigate('/boards');
    window.location.reload();
  };

  const handleAbout = () => {
    setOpen(false);
    setShowAboutModal(true);
  };

  const handleEditProfile = () => {
    setOpen(false);
    setFormData(profileData);
    setShowProfileModal(true);
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();

    const newProfile = {
      username: formData.username.trim() || 'Usuario'
    };

    setProfileData(newProfile);
    try {
      localStorage.setItem('taskflow-profile', JSON.stringify(newProfile));
    } catch (error) {
      console.error('Error saving profile:', error);
    }
    setShowProfileModal(false);
  };

  function getInitial(name = "") {
    const trimmed = name.trim(); if (!trimmed) return "U";
    return trimmed.charAt(0).toUpperCase();
  }
  function getColorFromName(name = "") {
    const colors = [
      "#3b82f6", "#8b5cf6", "#ec4899", "#f59e0b",
      "#10b981", "#06b6d4", "#6366f1", "#f97316"
    ];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }

    const index = Math.abs(hash) % colors.length;
    return colors[index];
  }
  return (
    <>
      <div className={styles.userWrapper} ref={menuRef}>
        <button
          className={styles.user}
          onClick={() => setOpen(prev => !prev)}
          aria-expanded={open}
          aria-label="Menú de usuario"
        >
          <div
            className={styles.userInitial}
            style={{ backgroundColor: getColorFromName(profileData.username) }}
          >
            {getInitial(profileData.username)}
          </div>
        </button>
        <div className={`${styles.menu} ${open ? styles.open : ""}`}>
          <div className={styles.menuHeader}>
            <div
              className={styles.menuAvatar}
              style={{ backgroundColor: getColorFromName(profileData.username) }}
            >
              {getInitial(profileData.username)}
            </div>
            <div className={styles.menuUserInfo}>
              <span className={styles.menuUsername}>{profileData.username}</span>
              <span className={styles.menuEmail}>TaskFlow User</span>
            </div>
          </div>
          <hr />
          <button onClick={handleEditProfile}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
            Editar perfil
          </button>
          <button onClick={handleAbout}>
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 11v5m0 5a9 9 0 1 1 0-18a9 9 0 0 1 0 18m.05-13v.1h-.1V8z" /></svg>
            Acerca de
          </button>
          <hr />
          <button className={styles.logout} onClick={handleClearData}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
              <line x1="10" y1="11" x2="10" y2="17" />
              <line x1="14" y1="11" x2="14" y2="17" />
            </svg>
            Borrar datos
          </button>
        </div>
      </div>

      {/* Modal Editar Perfil */}
      {showProfileModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h2>Editar Perfil</h2>
              <button
                className={styles.closeButton}
                onClick={() => setShowProfileModal(false)}
                aria-label="Cerrar"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleSaveProfile} className={styles.modalBody}>
              <div className={styles.formGroup}>
                <label htmlFor="username">
                  Nombre de usuario <span className={styles.required}>*</span>
                </label>
                <input
                  type="text"
                  id="username"
                  value={formData.username}
                  onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                  placeholder="Ej. Juan Pérez"
                  required
                  maxLength={50}
                  autoFocus
                />
                <div className={styles.characterCount}>
                  <span className={formData.username.length > 45 ? styles.warning : ''}>
                    {formData.username.length}/50
                  </span>
                </div>
              </div>

              <div className={styles.modalActions}>
                <button
                  type="button"
                  onClick={() => setShowProfileModal(false)}
                  className={styles.cancelButton}
                >
                  Cancelar
                </button>
                <button type="submit" className={styles.submitButton}>
                  Guardar cambios
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Acerca de - AHORA COMPONENTE SEPARADO */}
      <AboutModal
        isOpen={showAboutModal}
        onClose={() => setShowAboutModal(false)}
      />

      {/* Modal de confirmación para borrar datos */}
      {showDeleteModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.confirmModal}>
            <div className={styles.confirmModalHeader}>
              <div className={styles.confirmModalIcon}>
                <svg xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"><path d="M10.363 3.591L2.257 17.125a1.914 1.914 0 0 0 1.636 2.871h16.214a1.914 1.914 0 0 0 1.636-2.87L13.637 3.59a1.914 1.914 0 0 0-3.274 0zM12 9h.01" /><path d="M11 12h1v4h1" /></g></svg>
              </div>
              <div>
                <h2>¿Borrar todos los datos?</h2>
                <p>
                  Se eliminarán permanentemente <strong>todos tus tableros, tareas, configuraciones y perfil</strong>.
                  Esta acción no se puede deshacer.
                </p>
              </div>
            </div>
            <div className={styles.modalActions}>
              <button
                onClick={() => setShowDeleteModal(false)}
                className={styles.cancelButton}
              >
                Cancelar
              </button>
              <button
                onClick={confirmClearData}
                className={`${styles.submitButton} ${styles.dangerButton}`}
              >
                Borrar todo
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}