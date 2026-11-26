import * as React from "react"
import { cn } from "cn"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex field-sizing-content min-h-32 w-full rounded-2xl border border-white/60 bg-[#EFEBF5] px-5 py-4 font-sans text-base text-[#332F3A] shadow-clayPressed outline-none transition-all duration-200 placeholder:text-[#635F69] focus-visible:bg-white/80 focus-visible:ring-4 focus-visible:ring-[#7C3AED]/25 disabled:cursor-not-allowed disabled:opacity-40",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
