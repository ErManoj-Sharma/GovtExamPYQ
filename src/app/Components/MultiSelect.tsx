'use client'
import { useState, useEffect, useRef } from 'react'

interface MultiSelectProps {
  options: string[]
  selected: string[]
  onChange: (selected: string[]) => void
  placeholder?: string
  required?: boolean
}

export default function MultiSelect({ 
  options, 
  selected, 
  onChange, 
  placeholder = 'Select options',
  required = false 
}: MultiSelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [highlightedIndex, setHighlightedIndex] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    setHighlightedIndex(0)
  }, [search])

  const filteredOptions = options.filter(opt => 
    opt.toLowerCase().includes(search.toLowerCase()) &&
    !selected.includes(opt)
  )

  const handleSelect = (option: string) => {
    if (!selected.includes(option)) {
      onChange([...selected, option])
    }
    setSearch('')
    setIsOpen(false)
  }

  const handleRemove = (option: string) => {
    onChange(selected.filter(s => s !== option))
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
        setIsOpen(true)
        e.preventDefault()
      }
      return
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setHighlightedIndex(prev => 
          prev < filteredOptions.length - 1 ? prev + 1 : 0
        )
        break
      case 'ArrowUp':
        e.preventDefault()
        setHighlightedIndex(prev => 
          prev > 0 ? prev - 1 : filteredOptions.length - 1
        )
        break
      case 'Enter':
        e.preventDefault()
        if (filteredOptions[highlightedIndex]) {
          handleSelect(filteredOptions[highlightedIndex])
        }
        break
      case 'Escape':
        setIsOpen(false)
        break
      case 'Backspace':
        if (search === '' && selected.length > 0) {
          handleRemove(selected[selected.length - 1])
        }
        break
    }
  }

  return (
    <div ref={ref} className="relative">
      <div
        className="min-h-[42px] p-1 border rounded bg-white dark:bg-primary-dark-200 dark:text-black cursor-text flex flex-wrap gap-1 items-center"
        onClick={() => {
          setIsOpen(true)
          inputRef.current?.focus()
        }}
      >
        {selected.map(item => (
          <span 
            key={item} 
            className="inline-flex items-center gap-1 px-2 py-1 bg-primary dark:bg-primary-dark text-white text-sm rounded"
          >
            {item}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                handleRemove(item)
              }}
              className="hover:bg-white/20 rounded px-1"
            >
              ×
            </button>
          </span>
        ))}
        <input
          ref={inputRef}
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsOpen(true)}
          placeholder={selected.length === 0 ? placeholder : ''}
          className="flex-1 min-w-[100px] outline-none bg-transparent dark:text-black"
        />
      </div>

      {isOpen && filteredOptions.length > 0 && (
        <div className="absolute z-50 w-full mt-1 border rounded bg-white dark:bg-primary-dark-200 shadow-lg max-h-60 overflow-auto">
          {filteredOptions.map((option, index) => (
            <div
              key={option}
              onClick={() => handleSelect(option)}
              onMouseEnter={() => setHighlightedIndex(index)}
              className={`p-2 cursor-pointer ${
                index === highlightedIndex 
                  ? 'bg-primary dark:bg-primary-dark text-white' 
                  : 'dark:text-black hover:bg-primary/10 dark:hover:bg-primary-dark/50'
              }`}
            >
              {option}
            </div>
          ))}
        </div>
      )}

      {isOpen && filteredOptions.length === 0 && (
        <div className="absolute z-50 w-full mt-1 border rounded bg-white dark:bg-primary-dark-200 shadow-lg p-2 dark:text-black">
          No options found
        </div>
      )}
    </div>
  )
}
