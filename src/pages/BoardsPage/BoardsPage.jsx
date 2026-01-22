import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBoards } from '../../context/BoardsContext';
import { BoardCard } from './components/BoardCard';
import { EmptyState } from './components/EmptyState';
import { BoardModal } from './components/BoardModal';
import { DeleteBoardModal } from './components/DeleteBoardModal';
import styles from './BoardsPage.module.css';

export function BoardsPage() {
  const { boards, createBoard, updateBoard, deleteBoard } = useBoards();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingBoard, setEditingBoard] = useState(null);
  const [boardToDelete, setBoardToDelete] = useState(null);

  // Cerrar modales con ESC
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        handleCloseModal();
        setShowDeleteModal(false);
        setBoardToDelete(null);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  const handleOpenModal = (board = null) => {
    setEditingBoard(board);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingBoard(null);
  };

  const handleSubmit = (formData) => {
    if (editingBoard) {
      updateBoard(editingBoard.id, formData);
    } else {
      createBoard(formData.title, formData.description, formData.cover || null);
    }
    handleCloseModal();
  };

  const handleOpenDeleteModal = (board) => {
    setBoardToDelete(board);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    if (boardToDelete) {
      deleteBoard(boardToDelete.id);
      setShowDeleteModal(false);
      setBoardToDelete(null);
    }
  };

  const handleOpenBoard = (boardId) => {
    navigate(`/boards/${boardId}`);
  };

  return (
    <section className={styles.boardsPage}>
      <div className={styles.header}>
        <div>
          <h1>Mis Tableros</h1>
          <p>Aquí puedes ver y gestionar todos tus tableros.</p>
        </div>
        <button className={styles.createButton} onClick={() => handleOpenModal()}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Crear Tablero
        </button>
      </div>

      {boards.length === 0 ? (
        <EmptyState onCreateBoard={() => handleOpenModal()} />
      ) : (
        <div className={styles.boardsGrid}>
          {boards.map(board => (
            <BoardCard
              key={board.id}
              board={board}
              onOpen={handleOpenBoard}
              onEdit={handleOpenModal}
              onDelete={handleOpenDeleteModal}
            />
          ))}
        </div>
      )}

      <BoardModal
        isOpen={showModal}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        editingBoard={editingBoard}
      />

      <DeleteBoardModal
        isOpen={showDeleteModal && boardToDelete}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleConfirmDelete}
        boardTitle={boardToDelete?.title || ''}
      />
    </section>
  );
}