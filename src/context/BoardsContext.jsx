import { createContext, useContext, useEffect, useReducer, useMemo, useCallback } from "react"
import { boardsReducer } from "./boardsReducer"

const BoardsContext = createContext()

export function BoardsProvider({ children }) {
  // Inicializar con lazy initialization del localStorage
  const [boards, dispatch] = useReducer(boardsReducer, [], () => {
    const stored = localStorage.getItem("boards");
    if (!stored) return [];

    try {
      const parsed = JSON.parse(stored);
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      console.error('Error loading boards from localStorage:', error);
      localStorage.removeItem("boards");
      return [];
    }
  });

  // Guardar boards en localStorage cuando cambien
  useEffect(() => {
    try {
      localStorage.setItem("boards", JSON.stringify(boards));
    } catch (error) {
      console.error('Error saving boards to localStorage:', error);
    }
  }, [boards]);

  // Funciones de boards
  const createBoard = useCallback((title, description = "", cover = null) => {
    if (!title || typeof title !== 'string') {
      console.error('Invalid title for board creation');
      return;
    }

    dispatch({
      type: "CREATE",
      payload: {
        id: crypto.randomUUID(),
        title: title.trim(),
        description: description?.trim() || "",
        cover,
        columns: [
          { id: crypto.randomUUID(), title: "Por hacer", tasks: [] },
          { id: crypto.randomUUID(), title: "En progreso", tasks: [] },
          { id: crypto.randomUUID(), title: "Hecho", tasks: [] }
        ],
        createdAt: new Date().toISOString()
      }
    });
  }, []);

  const updateBoard = useCallback((id, data) => {
    if (!id) {
      console.error('Invalid board ID for update');
      return;
    }
    dispatch({ type: "UPDATE", payload: { id, data } });
  }, []);

  const deleteBoard = useCallback((id) => {
    if (!id) {
      console.error('Invalid board ID for deletion');
      return;
    }
    dispatch({ type: "DELETE", payload: id });
  }, []);

  const getBoard = useCallback((id) => {
    return boards.find(b => b.id === id) || null;
  }, [boards]);

  // Funciones de tareas
  const addTask = useCallback((boardId, columnId, taskData) => {
    if (!boardId || !columnId || !taskData) {
      console.error('Invalid parameters for task creation');
      return;
    }

    const task = {
      id: crypto.randomUUID(),
      title: taskData.title?.trim() || "",
      description: taskData.description?.trim() || "",
      createdAt: new Date().toISOString()
    };

    dispatch({ type: "ADD_TASK", payload: { boardId, columnId, task } });
  }, []);

  const updateTask = useCallback((boardId, columnId, taskId, data) => {
    if (!boardId || !columnId || !taskId) {
      console.error('Invalid parameters for task update');
      return;
    }
    dispatch({ type: "UPDATE_TASK", payload: { boardId, columnId, taskId, data } });
  }, []);

  const deleteTask = useCallback((boardId, columnId, taskId) => {
    if (!boardId || !columnId || !taskId) {
      console.error('Invalid parameters for task deletion');
      return;
    }
    dispatch({ type: "DELETE_TASK", payload: { boardId, columnId, taskId } });
  }, []);

  const moveTask = useCallback((boardId, updates) => {
    if (!boardId || !Array.isArray(updates)) {
      console.error('Invalid parameters for task move');
      return;
    }
    dispatch({ type: "MOVE_TASK", payload: { boardId, updates } });
  }, []);

  const value = useMemo(() => ({
    boards,
    createBoard,
    updateBoard,
    deleteBoard,
    getBoard,
    addTask,
    updateTask,
    deleteTask,
    moveTask
  }), [boards, createBoard, updateBoard, deleteBoard, getBoard, addTask, updateTask, deleteTask, moveTask]);

  return (
    <BoardsContext.Provider value={value}>
      {children}
    </BoardsContext.Provider>
  );
}

export function useBoards() {
  const context = useContext(BoardsContext);
  if (!context) {
    throw new Error("useBoards must be used within BoardsProvider");
  }
  return context;
}