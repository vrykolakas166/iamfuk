"use client"

import * as React from "react"
import { Check, ChevronsUpDown, X } from "lucide-react";
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export type ComboboxItem = {
  value: string
  label: string
}

interface ComboboxProps {
  items: ComboboxItem[]
  value: string[]
  onChange: (value: string[]) => void
  onSearch?: (search: string) => void
  placeholder?: string
  emptyText?: string
  className?: string
}

export function Combobox({
  items,
  value,
  onChange,
  onSearch,
  placeholder = "Select items...",
  emptyText = "No items found.",
  className,
}: ComboboxProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const [search, setSearch] = React.useState("")
  const inputRef = React.useRef<HTMLInputElement>(null)
  const containerRef = React.useRef<HTMLDivElement>(null)

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearch(value)
    onSearch?.(value)
  }

  const handleSelect = (itemValue: string) => {
    if (value.includes(itemValue)) {
      onChange(value.filter(v => v !== itemValue))
    } else {
      onChange([...value, itemValue])
    }
    setSearch("")
    inputRef.current?.focus()
  }

  const handleRemove = (itemValue: string, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onChange(value.filter(v => v !== itemValue))
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && search.trim()) {
      e.preventDefault()
      handleSelect(search.trim())
    } else if (e.key === 'Escape') {
      setIsOpen(false)
    }
  }

  const filteredItems = items.filter(item => 
    !value.includes(item.value) && 
    item.label.toLowerCase().includes(search.toLowerCase())
  )

  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className={cn("flex flex-col gap-2", className)} ref={containerRef}>
      <div className="flex flex-wrap gap-2">
        {value.map(v => {
          const item = items.find(i => i.value === v)
          return (
            <Badge
              key={v}
              variant="secondary"
              className="flex items-center gap-1"
            >
              {item?.label || v}
              <button
                type="button"
                onClick={(e) => handleRemove(v, e)}
                className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              >
                <X className="h-3 w-3" />
                <span className="sr-only">Remove {item?.label || v}</span>
              </button>
            </Badge>
          )
        })}
      </div>
      <div className="relative">
        <div className="flex items-center border rounded-md">
          <input
            ref={inputRef}
            type="text"
            value={search}
            onChange={handleSearch}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsOpen(true)}
            placeholder={placeholder}
            className="flex-1 px-3 py-2 bg-transparent outline-none text-sm"
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="px-2"
            onClick={() => setIsOpen(!isOpen)}
          >
            <ChevronsUpDown className="h-4 w-4 opacity-50" />
          </Button>
        </div>
        {isOpen && (
          <div className="absolute z-50 w-full mt-1 bg-popover border rounded-md shadow-md">
            {filteredItems.length === 0 ? (
              <div className="p-2 text-sm text-muted-foreground text-center">
                {emptyText}
              </div>
            ) : (
              <div className="max-h-[200px] overflow-auto">
                {filteredItems.map((item) => (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() => handleSelect(item.value)}
                    className="w-full flex items-center px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground cursor-pointer"
                  >
                    <Check className={cn(
                        "mr-2 h-4 w-4",
                        value.includes(item.value) ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {item.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
} 