'use client'
import type React from 'react'
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { addTodo } from '@/lib/features/todos/todosSlice'
import toast from 'react-hot-toast'
import { Todo } from '@/lib/types'

export default function TodoForm({ filteredTodos }: { filteredTodos: Todo[] }) {
   const dispatch = useDispatch()
   const [text, setText] = useState<string>('')

   const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault()

      if (text.trim()) {
         if (filteredTodos.some((todo) => todo.text.toLowerCase() === text.trim().toLowerCase())) {
            toast.error('Task already exists!')
            return
         }
         dispatch(
            addTodo({
               text: text.trim(),
               createdAt: new Date().toISOString()
            })
         )
         setText('')
         toast.success('Add task successfully!')
      }
   }

   return (
      <form onSubmit={handleSubmit} className='flex gap-2'>
         <div className='flex-1 flex gap-2'>
            <Input
               type='text'
               value={text}
               onChange={(e) => setText(e.target.value)}
               placeholder='Add a new task...'
               className='flex-1'
            />
         </div>

         <Button type='submit' disabled={!text.trim()}>
            <Plus className='h-4 w-4' />
            Add
         </Button>
      </form>
   )
}
