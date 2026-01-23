import { useParams, Navigate } from "react-router-dom";
import { useBoards } from "../../context/BoardsContext";
import { useState, useMemo, useCallback } from "react";
import {
  DndContext,
  DragOverlay,
  closestCorners,
  PointerSensor,
  TouchSensor,
  MouseSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { Column } from "./components/Column";
import { TaskModal } from "./components/TaskModal";
import { ConfirmDeleteModal } from "./components/ConfirmDeleteModal";
import { SectionModal } from "./components/SectionModal";
import styles from "./BoardPage.module.css";

export function BoardPage() {
  const { boardId } = useParams();
  const { boards, addTask, updateTask, deleteTask, moveTask, updateBoard } = useBoards();
  const [activeTask, setActiveTask] = useState(null);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [selectedColumnId, setSelectedColumnId] = useState(null);
  const [editingTask, setEditingTask] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [showSectionModal, setShowSectionModal] = useState(false);
  const [editingSection, setEditingSection] = useState(null);

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 10,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250,
        tolerance: 5,
      },
    }),
    useSensor(KeyboardSensor)
  );

  const board = useMemo(() => 
    boards.find((b) => b.id === boardId) || null,
    [boards, boardId]
  );

  const selectedColumn = useMemo(() => 
    board?.columns.find(col => col.id === selectedColumnId),
    [board, selectedColumnId]
  );

  // Validación: Si no existe el board y ya cargaron los boards, redirigir a 404
  if (!board && boards.length > 0) {
    return <Navigate to="/404" replace />;
  }

  // Estado de carga
  if (!board) {
    return <div className={styles.boardPage}>Cargando...</div>;
  }

  const handleAddTask = useCallback((columnId) => {
    setSelectedColumnId(columnId);
    setEditingTask(null);
    setShowTaskModal(true);
  }, []);

  const handleEditTask = useCallback((task) => {
    const column = board.columns.find(col => 
      col.tasks.some(t => t.id === task.id)
    );
    
    if (column) {
      setSelectedColumnId(column.id);
      setEditingTask(task);
      setShowTaskModal(true);
    }
  }, [board]);

  const handleDeleteTask = useCallback((columnId, taskId) => {
    setDeleteTarget({ type: 'task', columnId, taskId });
    setShowDeleteModal(true);
  }, []);

  const handleConfirmDelete = useCallback(() => {
    if (!deleteTarget) return;

    if (deleteTarget.type === 'task') {
      deleteTask(boardId, deleteTarget.columnId, deleteTarget.taskId);
    } else if (deleteTarget.type === 'column') {
      const newColumns = board.columns.filter(col => col.id !== deleteTarget.columnId);
      updateBoard(boardId, { columns: newColumns });
    }
    setShowDeleteModal(false);
    setDeleteTarget(null);
  }, [deleteTarget, boardId, deleteTask, board, updateBoard]);

  const handleSubmitTask = useCallback((taskData) => {
    if (editingTask) {
      updateTask(boardId, selectedColumnId, editingTask.id, taskData);
    } else {
      addTask(boardId, selectedColumnId, taskData);
    }
    setShowTaskModal(false);
    setSelectedColumnId(null);
    setEditingTask(null);
  }, [editingTask, boardId, selectedColumnId, updateTask, addTask]);

  const handleAddSection = useCallback(() => {
    setEditingSection(null);
    setShowSectionModal(true);
  }, []);

  const handleEditSection = useCallback((column) => {
    setEditingSection(column);
    setShowSectionModal(true);
  }, []);

  const handleDeleteSection = useCallback((columnId) => {
    setDeleteTarget({ type: 'column', columnId });
    setShowDeleteModal(true);
  }, []);

  const handleSubmitSection = useCallback((title) => {
    if (editingSection) {
      const newColumns = board.columns.map(col =>
        col.id === editingSection.id ? { ...col, title } : col
      );
      updateBoard(boardId, { columns: newColumns });
    } else {
      const newColumn = {
        id: crypto.randomUUID(),
        title,
        tasks: []
      };
      updateBoard(boardId, { columns: [...board.columns, newColumn] });
    }
    setShowSectionModal(false);
    setEditingSection(null);
  }, [editingSection, board, boardId, updateBoard]);

  const handleDragStart = useCallback((event) => {
    const task = board.columns
      .flatMap((col) => col.tasks)
      .find((t) => t.id === event.active.id);
    setActiveTask(task);
  }, [board]);

  const handleDragOver = useCallback((event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const activeColumn = board.columns.find(col => 
      col.tasks.some(task => task.id === active.id)
    );
    const overColumn = board.columns.find(col => 
      col.id === over.id || col.tasks.some(task => task.id === over.id)
    );

    if (!activeColumn || !overColumn || activeColumn.id === overColumn.id) {
      return;
    }

    const activeTask = activeColumn.tasks.find(t => t.id === active.id);
    
    const newColumns = board.columns.map(col => {
      if (col.id === activeColumn.id) {
        return {
          ...col,
          tasks: col.tasks.filter(t => t.id !== active.id)
        };
      }
      if (col.id === overColumn.id) {
        return {
          ...col,
          tasks: [...col.tasks, activeTask]
        };
      }
      return col;
    });

    moveTask(boardId, newColumns);
  }, [board, boardId, moveTask]);

  const handleDragEnd = useCallback((event) => {
    const { active, over } = event;
    setActiveTask(null);

    if (!over || active.id === over.id) return;

    const newColumns = board.columns.map((col) => ({
      ...col,
      tasks: [...col.tasks],
    }));

    let sourceColumn, destColumn, taskToMove;

    for (const col of newColumns) {
      const taskIndex = col.tasks.findIndex((t) => t.id === active.id);
      if (taskIndex !== -1) {
        sourceColumn = col;
        [taskToMove] = col.tasks.splice(taskIndex, 1);
        break;
      }
    }

    for (const col of newColumns) {
      if (col.tasks.some((t) => t.id === over.id) || col.id === over.id) {
        destColumn = col;
        break;
      }
    }

    if (!destColumn) destColumn = sourceColumn;

    const overIndex = destColumn.tasks.findIndex((t) => t.id === over.id);
    destColumn.tasks.splice(overIndex !== -1 ? overIndex : destColumn.tasks.length, 0, taskToMove);

    moveTask(boardId, newColumns);
  }, [board, boardId, moveTask]);

  const closeTaskModal = useCallback(() => {
    setShowTaskModal(false);
    setSelectedColumnId(null);
    setEditingTask(null);
  }, []);

  const closeDeleteModal = useCallback(() => {
    setShowDeleteModal(false);
    setDeleteTarget(null);
  }, []);

  const closeSectionModal = useCallback(() => {
    setShowSectionModal(false);
    setEditingSection(null);
  }, []);

  return (
    <div className={styles.boardPage}>
      <div className={styles.boardHeader}>
        <h1>{board.title}</h1>
        {board.description && <p>{board.description}</p>}
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className={styles.columnsContainer}>
          {board.columns.map((column) => (
            <Column 
              key={column.id} 
              column={column}
              onAddTask={handleAddTask}
              onEditTask={handleEditTask}
              onDeleteTask={handleDeleteTask}
              onEditColumn={handleEditSection}
              onDeleteColumn={handleDeleteSection}
            />
          ))}

          <button className={styles.addSectionButton} onClick={handleAddSection}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Agregar Sección
          </button>
        </div>

        <DragOverlay>
          {activeTask && (
            <div className={styles.taskCard}>
              <div className={styles.taskCardDraggable}>
                <h4 className={styles.taskTitle}>{activeTask.title}</h4>
              </div>
            </div>
          )}
        </DragOverlay>
      </DndContext>

      <TaskModal
        isOpen={showTaskModal}
        onClose={closeTaskModal}
        onSubmit={handleSubmitTask}
        columnTitle={selectedColumn?.title || ""}
        editingTask={editingTask}
      />

      <ConfirmDeleteModal
        isOpen={showDeleteModal}
        onClose={closeDeleteModal}
        onConfirm={handleConfirmDelete}
        title={deleteTarget?.type === 'task' ? '¿Eliminar tarea?' : '¿Eliminar sección?'}
        message={
          deleteTarget?.type === 'task' 
            ? 'Esta acción no se puede deshacer. La tarea será eliminada permanentemente.'
            : 'Esta acción no se puede deshacer. La sección y todas sus tareas serán eliminadas permanentemente.'
        }
      />

      <SectionModal
        isOpen={showSectionModal}
        onClose={closeSectionModal}
        onSubmit={handleSubmitSection}
        editingSection={editingSection}
      />
    </div>
  );
}