export function boardsReducer(state, action) {
  // Asegurar que state siempre sea un array
  const currentState = Array.isArray(state) ? state : [];

  switch (action.type) {
    case "LOAD":
      return Array.isArray(action.payload) ? action.payload : currentState;

    case "CREATE": {
      // Validar que el payload tenga la estructura correcta
      if (!action.payload?.id || !action.payload?.title) {
        console.error('Invalid board data for creation');
        return currentState;
      }
      return [...currentState, action.payload];
    }

    case "UPDATE": {
      const { id, data } = action.payload;
      if (!id || !data) {
        console.error('Invalid data for board update');
        return currentState;
      }
      
      return currentState.map(board =>
        board.id === id
          ? { ...board, ...data, updatedAt: new Date().toISOString() }
          : board
      );
    }

    case "DELETE": {
      if (!action.payload) {
        console.error('Invalid board ID for deletion');
        return currentState;
      }
      return currentState.filter(board => board.id !== action.payload);
    }

    case "ADD_TASK": {
      const { boardId, columnId, task } = action.payload;
      if (!boardId || !columnId || !task) {
        console.error('Invalid data for task creation');
        return currentState;
      }

      return currentState.map(board => {
        if (board.id !== boardId) return board;
        
        return {
          ...board,
          columns: board.columns.map(col => 
            col.id === columnId
              ? { ...col, tasks: [...col.tasks, task] }
              : col
          ),
          updatedAt: new Date().toISOString()
        };
      });
    }

    case "UPDATE_TASK": {
      const { boardId, columnId, taskId, data } = action.payload;
      if (!boardId || !columnId || !taskId || !data) {
        console.error('Invalid data for task update');
        return currentState;
      }

      return currentState.map(board => {
        if (board.id !== boardId) return board;
        
        return {
          ...board,
          columns: board.columns.map(col => {
            if (col.id !== columnId) return col;
            
            return {
              ...col,
              tasks: col.tasks.map(task =>
                task.id === taskId
                  ? { ...task, ...data, updatedAt: new Date().toISOString() }
                  : task
              )
            };
          }),
          updatedAt: new Date().toISOString()
        };
      });
    }

    case "DELETE_TASK": {
      const { boardId, columnId, taskId } = action.payload;
      if (!boardId || !columnId || !taskId) {
        console.error('Invalid data for task deletion');
        return currentState;
      }

      return currentState.map(board => {
        if (board.id !== boardId) return board;
        
        return {
          ...board,
          columns: board.columns.map(col => {
            if (col.id !== columnId) return col;
            
            return {
              ...col,
              tasks: col.tasks.filter(task => task.id !== taskId)
            };
          }),
          updatedAt: new Date().toISOString()
        };
      });
    }

    case "MOVE_TASK": {
      const { boardId, updates } = action.payload;
      if (!boardId || !Array.isArray(updates)) {
        console.error('Invalid data for task move');
        return currentState;
      }

      return currentState.map(board => {
        if (board.id !== boardId) return board;
        return { 
          ...board, 
          columns: updates,
          updatedAt: new Date().toISOString()
        };
      });
    }

    default:
      console.warn(`Unknown action type: ${action.type}`);
      return currentState;
  }
}