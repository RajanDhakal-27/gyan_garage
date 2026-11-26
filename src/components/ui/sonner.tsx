"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner, type ToasterProps } from "sonner"
import { CircleCheckIcon, InfoIcon, TriangleAlertIcon, OctagonXIcon, Loader2Icon } from "lucide-react"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      icons={{
        success: (
          <CircleCheckIcon className="size-5" />
        ),
        info: (
          <InfoIcon className="size-5" />
        ),
        warning: (
          <TriangleAlertIcon className="size-5" />
        ),
        error: (
          <OctagonXIcon className="size-5" />
        ),
        loading: (
          <Loader2Icon className="size-5 animate-spin" />
        ),
      }}
      style={
        {
          "--normal-bg": "rgba(255, 255, 255, 0.92)",
          "--normal-text": "#332F3A",
          "--normal-border": "rgba(255, 255, 255, 0.7)",
          "--border-radius": "24px",
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          toast:
            "cn-toast !rounded-3xl !border !border-white/70 !bg-white/90 !font-sans !text-[#332F3A] !shadow-clayDeep !backdrop-blur-xl",
          title: "!font-heading !font-extrabold",
          description: "!text-[#635F69]",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
