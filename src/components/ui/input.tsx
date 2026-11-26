import * as React from "react"
import { Input as InputPrimitive } from "@base-ui/react/input"
import { cn } from "cn"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(
        "h-16 w-full min-w-0 rounded-2xl border border-white/60 bg-[#EFEBF5] px-5 py-2 font-sans text-base text-[#332F3A] shadow-clayPressed outline-none transition-all duration-200 placeholder:text-[#635F69] focus-visible:bg-white/80 focus-visible:ring-4 focus-visible:ring-[#7C3AED]/25 disabled:cursor-not-allowed disabled:opacity-40",
        className
      )}
      {...props}
    />
  )
}

export { Input }
