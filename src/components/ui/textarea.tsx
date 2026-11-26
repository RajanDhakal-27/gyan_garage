import * as React from "react"
import { cn } from "cn"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex field-sizing-content min-h-16 w-full rounded-none border border-[rgba(20,28,43,0.2)] bg-[#EFE9DD] px-3 py-2 font-mono text-xs text-[#141C2B] transition-colors outline-none placeholder:text-[#767E8C] focus-visible:border-[#2C4A8F] focus-visible:ring-1 focus-visible:ring-[#2C4A8F] disabled:cursor-not-allowed disabled:opacity-40",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
