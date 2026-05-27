/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { AlertCircle, CheckCircle2, Info, X } from 'lucide-react'
import { cn } from '../utils/cn'

const ToastContext = createContext(null)

const toastConfig = {
  success: { Icon: CheckCircle2, iconClass: 'text-teal-500',  barClass: 'bg-teal-500'  },
  error:   { Icon: AlertCircle,  iconClass: 'text-rose-500',  barClass: 'bg-rose-500'  },
  info:    { Icon: Info,         iconClass: 'text-blue-500',  barClass: 'bg-blue-500'  },
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const notify = useCallback((message, type = 'success') => {
    const id = crypto.randomUUID()
    setToasts((prev) => [...prev, { id, message, type }])
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 3200)
  }, [])

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const value = useMemo(() => ({ notify }), [notify])

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed bottom-4 right-4 z-[60] flex w-[calc(100%-2rem)] max-w-sm flex-col gap-2.5">
        <AnimatePresence>
          {toasts.map((toast) => {
            const { Icon, iconClass, barClass } = toastConfig[toast.type] ?? toastConfig.success
            return (
              <motion.div
                key={toast.id}
                layout
                initial={{ opacity: 0, y: 16, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, x: 32, scale: 0.95 }}
                transition={{ type: 'spring', damping: 22, stiffness: 280 }}
                className="glass-panel relative overflow-hidden rounded-2xl px-4 py-3 text-sm text-ink shadow-lg dark:text-white"
              >
                {/* Progress bar */}
                <motion.div
                  className={cn('absolute bottom-0 left-0 h-0.5', barClass)}
                  initial={{ width: '100%' }}
                  animate={{ width: '0%' }}
                  transition={{ duration: 3.2, ease: 'linear' }}
                />
                <div className="flex items-center gap-3">
                  <Icon className={cn('h-5 w-5 flex-none', iconClass)} />
                  <span className="flex-1 leading-5">{toast.message}</span>
                  <button
                    className="focus-ring rounded-full p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    onClick={() => dismiss(toast.id)}
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) throw new Error('useToast must be used inside ToastProvider')
  return context
}
