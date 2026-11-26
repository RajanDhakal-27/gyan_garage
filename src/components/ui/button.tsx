import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-none border border-transparent bg-clip-padding font-mono text-xs uppercase tracking-wider font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:ring-1 focus-visible:ring-[#2C4A8F] active:translate-y-px disabled:pointer-events-none disabled:opacity-40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 cursor-pointer",
  {
    variants: {
      variant: {
        default: "bg-[#2C4A8F] text-[#EFE9DD] hover:bg-[#203668] border-[#2C4A8F]",
        outline:
          "border-[rgba(20,28,43,0.24)] bg-transparent text-[#141C2B] hover:bg-[#E5DED0] hover:text-[#141C2B]",
        secondary:
          "bg-[#E5DED0] text-[#141C2B] border-[rgba(20,28,43,0.16)] hover:bg-[#DBD3C3]",
        ghost:
          "hover:bg-[#E5DED0] text-[#141C2B]",
        destructive:
          "bg-[#A33A3A]/10 text-[#A33A3A] border-[#A33A3A]/30 hover:bg-[#A33A3A]/20",
        link: "text-[#2C4A8F] underline-offset-4 hover:underline",
      },
      size: {
        default:
          "h-9 gap-2 px-3",
        xs: "h-6 gap-1 px-2 text-[10px]",
        sm: "h-7 gap-1.5 px-2.5 text-xs",
        lg: "h-11 gap-2.5 px-5 text-sm",
        icon: "size-8",
        "icon-xs":
          "size-6 [&_svg:not([class*='size-'])]:size-3",
        "icon-sm":
          "size-7",
        "icon-lg": "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
