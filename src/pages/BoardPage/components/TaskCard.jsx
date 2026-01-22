import { useMemo, useCallback } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import styles from "./TaskCard.module.css";

export function TaskCard({ task, onEdit, onDelete }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = useMemo(() => ({
    transform: CSS.Transform.toString(transform),
    transition,
  }), [transform, transition]);

  const handleEdit = useCallback((e) => {
    e.stopPropagation();
    onEdit(task);
  }, [task, onEdit]);

  const handleDelete = useCallback((e) => {
    e.stopPropagation();
    onDelete(task.id);
  }, [task.id, onDelete]);

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`${styles.taskCard} ${isDragging ? styles.dragging : ""}`}
    >
      <div className={styles.taskCardDraggable} {...attributes} {...listeners}>
        <h4 className={styles.taskTitle}>{task.title}</h4>
        {task.description && (
          <p className={styles.taskDescription}>{task.description}</p>
        )}
        {(task.subtasks || task.attachments) && (
          <div className={styles.taskFooter}>
            <div className={styles.taskMeta}>
              {task.subtasks && (
                <span>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 11l3 3L22 4" />
                    <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
                  </svg>
                  {task.subtasks.completed}/{task.subtasks.total}
                </span>
              )}
              {task.attachments && (
                <span>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48" />
                  </svg>
                  {task.attachments}
                </span>
              )}
            </div>
          </div>
        )}
      </div>
      <div className={styles.taskActions}>
        <button 
          className={styles.taskActionButton}
          onClick={handleEdit}
          aria-label="Editar tarea"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
          </svg>
        </button>
        <button 
          className={`${styles.taskActionButton} ${styles.deleteButton}`}
          onClick={handleDelete}
          aria-label="Eliminar tarea"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            <line x1="10" y1="11" x2="10" y2="17" />
            <line x1="14" y1="11" x2="14" y2="17" />
          </svg>
        </button>
      </div>
    </div>
  );
}