import { useCallback, useEffect, useRef, useState } from "react"
import { Moon, Sun } from "lucide-react"
import { flushSync } from "react-dom"
import { cn } from "@/lib/utils"

interface AnimatedThemeTogglerProps extends React.ComponentPropsWithoutRef<"button"> {
  duration?: number
}

export const AnimatedThemeToggler = ({
  className,
  duration = 400,
  ...props
}: AnimatedThemeTogglerProps) => {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window === "undefined") return false
    return document.documentElement.classList.contains("dark")
  })

  const ref = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains("dark"))
    })
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    })
    return () => observer.disconnect()
  }, [])

  const toggleTheme = useCallback(async () => {
    const newDark = !isDark

    if (
      !ref.current ||
      !document.startViewTransition ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      document.documentElement.classList.toggle("dark", newDark)
      localStorage.setItem("theme", newDark ? "dark" : "light")
      return
    }

    await document.startViewTransition(() => {
      flushSync(() => {
        document.documentElement.classList.toggle("dark", newDark)
        localStorage.setItem("theme", newDark ? "dark" : "light")
        setIsDark(newDark)
      })
    }).ready

    const { top, left, width, height } = ref.current.getBoundingClientRect()
    const x = left + width / 2
    const y = top + height / 2
    const right = window.innerWidth - left
    const bottom = window.innerHeight - top
    const maxRadius = Math.hypot(Math.max(left, right), Math.max(top, bottom))

    document.documentElement.animate(
      {
        clipPath: [
          `circle(0px at ${x}px ${y}px)`,
          `circle(${maxRadius}px at ${x}px ${y}px)`,
        ],
      },
      {
        duration,
        easing: "ease-in-out",
        pseudoElement: "::view-transition-new(root)",
      }
    )
  }, [isDark, duration])

  return (
    <button
      ref={ref}
      type="button"
      onClick={toggleTheme}
      className={cn(
        "relative inline-flex h-8 w-8 items-center justify-center rounded-lg text-foreground/60 hover:text-gold transition-colors",
        className
      )}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      {...props}
    >
      <Sun
        className={cn(
          "h-4 w-4 transition-all duration-300",
          isDark ? "rotate-90 scale-0 opacity-0" : "rotate-0 scale-100 opacity-100"
        )}
        style={{ position: isDark ? "absolute" : "relative" }}
      />
      <Moon
        className={cn(
          "h-4 w-4 transition-all duration-300",
          isDark ? "rotate-0 scale-100 opacity-100" : "-rotate-90 scale-0 opacity-0"
        )}
        style={{ position: !isDark ? "absolute" : "relative" }}
      />
    </button>
  )
}
