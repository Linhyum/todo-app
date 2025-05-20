'use client'

import type React from 'react'

import { useEffect } from 'react'
import { Provider } from 'react-redux'
import { ThemeProvider } from 'next-themes'
import { store } from '@/lib/store'
import { initializeTodos } from '@/lib/features/todos/todosSlice'

export function Providers({ children }: { children: React.ReactNode }) {
   useEffect(() => {
      store.dispatch(initializeTodos())
   }, [])

   return (
      <Provider store={store}>
         <ThemeProvider attribute='class' defaultTheme='system' enableSystem disableTransitionOnChange>
            {children}
         </ThemeProvider>
      </Provider>
   )
}
