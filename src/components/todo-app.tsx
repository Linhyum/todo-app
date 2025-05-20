'use client'

import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import TodoItem from '@/components/todo-item'
import TodoForm from '@/components/todo-form'
import type { RootState } from '@/lib/store'
import { reorderTodos } from '@/lib/features/todos/todosSlice'
import type { DropResult } from '@hello-pangea/dnd'

export default function TodoApp() {
   const dispatch = useDispatch()
   const todos = useSelector((state: RootState) => state.todos.items)
   const [mounted, setMounted] = useState<boolean>(false)
   const { theme, setTheme } = useTheme()
   const [filter, setFilter] = useState<string>('all')

   useEffect(() => {
      setMounted(true)
   }, [])

   const filteredTodos = todos.filter((todo) => {
      if (filter === 'completed') return todo.completed
      if (filter === 'active') return !todo.completed
      return true
   })

   const handleDragEnd = (result: DropResult) => {
      if (!result.destination) return

      const sourceIndex = result.source.index
      const destinationIndex = result.destination.index

      dispatch(reorderTodos({ sourceIndex, destinationIndex, filter }))
   }

   if (!mounted) return null

   return (
      <div className='max-w-md mx-auto'>
         <div className='flex items-center justify-between mb-6'>
            <h1 className='text-2xl font-bold'>Todo App</h1>
            <Button
               variant='ghost'
               size='icon'
               onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
               aria-label='Toggle theme'
            >
               {theme === 'dark' ? <Sun className='h-5 w-5' /> : <Moon className='h-5 w-5' />}
            </Button>
         </div>

         <TodoForm filteredTodos={filteredTodos} />

         <Tabs defaultValue='all' className='mt-6' onValueChange={setFilter}>
            <TabsList className='grid grid-cols-3 mb-4'>
               <TabsTrigger value='all'>All</TabsTrigger>
               <TabsTrigger value='active'>Active</TabsTrigger>
               <TabsTrigger value='completed'>Completed</TabsTrigger>
            </TabsList>

            <TabsContent value={filter} className='mt-0 max-h-[calc(100vh-300px)] overflow-y-auto'>
               {filteredTodos.length === 0 ? (
                  <div className='text-center py-8 text-muted-foreground'>No tasks found</div>
               ) : (
                  <DragDropContext onDragEnd={handleDragEnd}>
                     <Droppable droppableId='todos'>
                        {(provided) => (
                           <ul className='space-y-2' {...provided.droppableProps} ref={provided.innerRef}>
                              {filteredTodos.map((todo, index) => (
                                 <Draggable key={todo.id} draggableId={todo.id} index={index}>
                                    {(provided) => (
                                       <li
                                          ref={provided.innerRef}
                                          {...provided.draggableProps}
                                          {...provided.dragHandleProps}
                                       >
                                          <TodoItem todo={todo} />
                                       </li>
                                    )}
                                 </Draggable>
                              ))}
                              {provided.placeholder}
                           </ul>
                        )}
                     </Droppable>
                  </DragDropContext>
               )}
            </TabsContent>
         </Tabs>
      </div>
   )
}
