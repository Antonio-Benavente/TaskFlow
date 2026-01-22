import { Link } from 'react-router-dom';
import styles from './NotFoundPage.module.css';

export function NotFoundPage() {
  return (
    <div className={styles.notFound}>
      <div className={styles.content}>
        <h1 className={styles.code}>404</h1>
        <h2>Página no encontrada</h2>
        <p>Lo sentimos, la página que buscas no existe o ha sido movida.</p>
        <div className={styles.actions}>
          <Link to="/boards" className={styles.primaryButton}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
              <polyline points="9 22 9 12 15 12 15 22"/>
            </svg>
            Ir a mis tableros
          </Link>
          <button onClick={() => window.history.back()} className={styles.secondaryButton}>
            Volver atrás
          </button>
        </div>
      </div>
    </div>
  );
}