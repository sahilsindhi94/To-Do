import { useEffect } from 'react'

/**
 * @param {Array<{ key: string, meta?: boolean, shift?: boolean, handler: () => void }>} shortcuts
 */
export function useKeyboardShortcuts(shortcuts) {
  useEffect(() => {
    function handleKeyDown(event) {
      // Don't fire when typing in inputs
      const tag = document.activeElement?.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return

      const key = event.key.toLowerCase()
      const shortcut = shortcuts.find(
        (s) =>
          s.key === key &&
          Boolean(s.meta) === (event.metaKey || event.ctrlKey) &&
          Boolean(s.shift) === event.shiftKey
      )

      if (shortcut) {
        event.preventDefault()
        shortcut.handler()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [shortcuts])
}
