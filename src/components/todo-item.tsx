'use client'

import type React from 'react'

import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { format } from 'date-fns'
import { Pencil, Save, Trash2, GripVertical } from 'lucide-react'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toggleTodo, removeTodo, updateTodo } from '@/lib/features/todos/todosSlice'
import type { Todo } from '@/lib/types'
import toast from 'react-hot-toast'

interface TodoItemProps {
   todo: Todo
}

export default function TodoItem({ todo }: TodoItemProps) {
   const dispatch = useDispatch()
   const [isEditing, setIsEditing] = useState<boolean>(false)
   const [editedText, setEditedText] = useState<string>(todo.text)

   const handleToggle = () => {
      dispatch(toggleTodo(todo.id))
   }

   const handleDelete = () => {
      dispatch(removeTodo(todo.id))
      toast.success('Delete task successfully!')
   }

   const handleEdit = () => {
      setIsEditing(true)
   }

   const handleSave = () => {
      if (editedText.trim()) {
         dispatch(updateTodo({ id: todo.id, text: editedText }))
         setIsEditing(false)
         toast.success('Edit task successfully!')
      }
   }

   const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
         handleSave()
      }
   }

   return (
      <div className={`flex items-center gap-2 p-3 rounded-lg border ${todo.completed ? 'bg-muted' : 'bg-card'}`}>
         <GripVertical className='h-5 w-5 text-muted-foreground cursor-grab' />

         <Checkbox checked={todo.completed} onCheckedChange={handleToggle} id={`todo-${todo.id}`} />

         {isEditing ? (
            <div className='flex-1 flex gap-2'>
               <Input
                  value={editedText}
                  onChange={(e) => setEditedText(e.target.value)}
                  onKeyDown={handleKeyDown}
                  autoFocus
                  className='flex-1'
               />
               <Button size='icon' onClick={handleSave} variant='outline' className='text-blue-500 hover:text-blue-500'>
                  <Save className='h-4 w-4' />
               </Button>
            </div>
         ) : (
            <>
               <label
                  htmlFor={`todo-${todo.id}`}
                  className={`flex-1 cursor-pointer ${todo.completed ? 'line-through text-muted-foreground' : ''}`}
               >
                  {todo.text}
                  {todo.createdAt && (
                     <div className='text-xs text-muted-foreground mt-1'>
                        Created: {format(new Date(todo.createdAt), 'MMM d, yyyy')}
                     </div>
                  )}
               </label>

               <div className='flex gap-1'>
                  <Button
                     size='icon'
                     onClick={handleEdit}
                     variant='ghost'
                     className='text-green-500 hover:text-green-500'
                  >
                     <Pencil className='h-4 w-4' />
                  </Button>
                  <Button
                     size='icon'
                     onClick={handleDelete}
                     variant='ghost'
                     className='text-destructive hover:text-destructive/90'
                  >
                     <Trash2 className='h-4 w-4' />
                  </Button>
               </div>
            </>
         )}
      </div>
   )
}
