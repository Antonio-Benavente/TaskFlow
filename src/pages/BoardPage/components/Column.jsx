import { useState, useMemo, useCallback } from "react";
import { SortableContext, verticalListSortingStrategy, useSortable } from "@dnd-kit/sortable";
import { TaskCard } from "./TaskCard";
import styles from "./Column.module.css";

export function Column({ column, onAddTask, onEditTask, onDeleteTask, onEditColumn, onDeleteColumn }) {
  const taskIds = useMemo(() => column.tasks.map(task => task.id), [column.tasks]);
  const { setNodeRef } = useSortable({ id: column.id });
  const [showMenu, setShowMenu] = useState(false);

  const handleMenuClick = useCallback((e) => {
    e.stopPropagation();
    setShowMenu(prev => !prev);
  }, []);

  const handleEditColumn = useCallback(() => {
    setShowMenu(false);
    onEditColumn(column);
  }, [column, onEditColumn]);

  const handleDeleteColumn = useCallback(() => {
    setShowMenu(false);
    onDeleteColumn(column.id);
  }, [column.id, onDeleteColumn]);

  const handleAddTaskClick = useCallback(() => {
    onAddTask(column.id);
  }, [column.id, onAddTask]);

  // Handler para eliminar tarea - agrega el columnId
  const handleDeleteTask = useCallback((taskId) => {
    onDeleteTask(column.id, taskId);
  }, [column.id, onDeleteTask]);

  return (
    <div ref={setNodeRef} className={styles.column}>
      <div className={styles.columnHeader}>
        <div className={styles.columnTitle}>
          <h3>{column.title}</h3>
          <span className={styles.taskCount}>{column.tasks.length}</span>
        </div>
        <div className={styles.columnMenuContainer}>
          <button 
            className={styles.columnMenu} 
            onClick={handleMenuClick}
            aria-label="Opciones de columna"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="1" />
              <circle cx="12" cy="5" r="1" />
              <circle cx="12" cy="19" r="1" />
            </svg>
          </button>
          {showMenu && (
            <div className={styles.columnMenuDropdown}>
              <button onClick={handleEditColumn}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
                Editar sección
              </button>
              <button onClick={handleDeleteColumn} className={styles.deleteOption}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                </svg>
                Eliminar sección
              </button>
            </div>
          )}
        </div>
      </div>

      <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
        <div className={styles.tasksList}>
          {column.tasks.length === 0 ? (
            <div className={styles.emptyColumn}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <line x1="9" y1="9" x2="15" y2="9" />
                <line x1="9" y1="15" x2="15" y2="15" />
              </svg>
              <p>No hay tareas</p>
            </div>
          ) : (
            column.tasks.map((task) => (
              <TaskCard 
                key={task.id} 
                task={task}
                onEdit={onEditTask}
                onDelete={handleDeleteTask}
              />
            ))
          )}
        </div>
      </SortableContext>

      <button 
        className={styles.addTaskButton}
        onClick={handleAddTaskClick}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
        Agregar tarea
      </button>
    </div>
  );
}