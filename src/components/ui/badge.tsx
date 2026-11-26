import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"

const badgeVariants = cva(
  "group/badge inline-flex h-5 w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-none border border-[rgba(20,28,43,0.16)] px-2 py-0.5 text-xs font-mono font-medium uppercase tracking-wider whitespace-nowrap transition-all focus-visible:ring-1 focus-visible:ring-[#2C4A8F] [&>svg]:pointer-events-none [&>svg]:size-3!",
  {
    variants: {
      variant: {
        default: "bg-[#2C4A8F] text-[#EFE9DD] [a]:hover:bg-[#2C4A8F]/90",
        secondary:
          "bg-[#E5DED0] text-[#141C2B] border-[rgba(20,28,43,0.16)] [a]:hover:bg-[#E5DED0]/80",
        destructive:
          "bg-[#A33A3A]/10 text-[#A33A3A] border-[#A33A3A]/30 [a]:hover:bg-[#A33A3A]/20",
        outline:
          "border-[rgba(20,28,43,0.2)] text-[#141C2B] bg-transparent [a]:hover:bg-[#E5DED0]",
        ghost:
          "hover:bg-[#E5DED0] hover:text-[#141C2B]",
        link: "text-[#2C4A8F] underline-offset-4 hover:underline",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant = "default",
  render,
  ...props
}: useRender.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return useRender({
    defaultTagName: "span",
    props: mergeProps<"span">(
      {
        className: cn(badgeVariants({ variant }), className),
      },
      props
    ),
    render,
    state: {
      slot: "badge",
      variant,
    },
  })
}

export { Badge, badgeVariants }
