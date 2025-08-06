import { cn } from "@/lib/utils"
import React from "react"

/**
 * A placeholder component to display a loading state.
 * It renders a simple, animated shape to indicate that content is being loaded.
 */
const Skeleton: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  ...props
}) => {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-muted", className)}
      {...props}
    />
  )
}

export { Skeleton }
