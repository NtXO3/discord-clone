import React from "react"

export const useOutsideClick = (isOpen: boolean, setIsOpen: (isOpen: boolean) => void) => {
  return React.useEffect(() => {
    const handleCancel = () => setIsOpen(false)

    if (isOpen) {
      return document.addEventListener('click', handleCancel)
    }
    document.removeEventListener('click', handleCancel)

    return () => {
      document.removeEventListener('click', handleCancel)
    }
  }, [isOpen, setIsOpen])
}