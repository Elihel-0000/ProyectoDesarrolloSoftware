import * as React from 'react'

import { cn } from '@/lib/utils'

function Input({ className, type, ...props }: React.ComponentProps<'input'>) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        'h-9 w-full min-w-0 rounded-md border px-3 py-1 shadow-xs transition-[color,box-shadow] outline-none',
        'text-base text-gray-900 md:text-sm',
        'bg-white/50 backdrop-blur-sm border-white/40',
        'placeholder:text-muted-foreground',
        'dark:bg-slate-800/90 dark:border-slate-600 dark:text-slate-100 dark:placeholder:text-slate-400',
        'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] focus-visible:scale-[1.01] duration-200',
        'selection:bg-primary selection:text-primary-foreground',
        'file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground',
        'disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
        'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
        className,
      )}
      {...props}
    />
  )
}

export { Input }
