import * as React from "react"
import { Input as InputPrimitive } from "@base-ui/react/input"
import { cn } from "cn"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(
        "h-9 w-full min-w-0 rounded-none border border-[rgba(20,28,43,0.2)] bg-[#EFE9DD] px-3 py-1 font-mono text-xs text-[#141C2B] transition-colors outline-none placeholder:text-[#767E8C] focus-visible:border-[#2C4A8F] focus-visible:ring-1 focus-visible:ring-[#2C4A8F] disabled:cursor-not-allowed disabled:opacity-40",
        className
      )}
      {...props}
    />
  )
}

export { Input }
