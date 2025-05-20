'use client'

import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { Todo, TodosState } from '@/lib/types'

// khởi tạo data từ localStorage
const loadTodosFromLocalStorage = (): Todo[] => {
   if (typeof window === 'undefined') return []

   try {
      const storedTodos = localStorage.getItem('todos')
      return storedTodos ? JSON.parse(storedTodos) : []
   } catch (error) {
      console.error('Error loading todos from localStorage:', error)
      return []
   }
}

const saveTodosToLocalStorage = (todos: Todo[]) => {
   if (typeof window === 'undefined') return

   try {
      localStorage.setItem('todos', JSON.stringify(todos))
   } catch (error) {
      console.error('Error saving todos to localStorage:', error)
   }
}

const initialState: TodosState = {
   items: []
}

export const todosSlice = createSlice({
   name: 'todos',
   initialState,
   reducers: {
      initializeTodos: (state) => {
         state.items = loadTodosFromLocalStorage()
      },
      addTodo: (state, action: PayloadAction<{ text: string; createdAt?: string }>) => {
         const newTodo: Todo = {
            id: Date.now().toString(),
            text: action.payload.text,
            completed: false,
            createdAt: action.payload.createdAt || new Date().toISOString()
         }
         state.items.push(newTodo)
         saveTodosToLocalStorage(state.items)
      },
      toggleTodo: (state, action: PayloadAction<string>) => {
         const todo = state.items.find((todo) => todo.id === action.payload)
         if (todo) {
            todo.completed = !todo.completed
            saveTodosToLocalStorage(state.items)
         }
      },
      removeTodo: (state, action: PayloadAction<string>) => {
         state.items = state.items.filter((todo) => todo.id !== action.payload)
         saveTodosToLocalStorage(state.items)
      },
      updateTodo: (state, action: PayloadAction<{ id: string; text: string }>) => {
         const todo = state.items.find((todo) => todo.id === action.payload.id)
         if (todo) {
            todo.text = action.payload.text
            saveTodosToLocalStorage(state.items)
         }
      },
      reorderTodos: (
         state,
         action: PayloadAction<{
            sourceIndex: number
            destinationIndex: number
            filter: string
         }>
      ) => {
         const { sourceIndex, destinationIndex, filter } = action.payload

         let filteredItems: Todo[] = []

         if (filter === 'completed') {
            filteredItems = state.items.filter((todo) => todo.completed)
         } else if (filter === 'active') {
            filteredItems = state.items.filter((todo) => !todo.completed)
         } else {
            filteredItems = [...state.items]
         }

         const [movedItem] = filteredItems.splice(sourceIndex, 1)
         filteredItems.splice(destinationIndex, 0, movedItem)

         if (filter === 'completed') {
            const nonCompleted = state.items.filter((todo) => !todo.completed)
            state.items = [...nonCompleted, ...filteredItems]
         } else if (filter === 'active') {
            const completed = state.items.filter((todo) => todo.completed)
            state.items = [...filteredItems, ...completed]
         } else {
            state.items = filteredItems
         }

         saveTodosToLocalStorage(state.items)
      }
   }
})

export const { initializeTodos, addTodo, toggleTodo, removeTodo, updateTodo, reorderTodos } = todosSlice.actions

export default todosSlice.reducer
