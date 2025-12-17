import React from "react";
import { cn } from "./utils";

interface ToggleButtonProps {
  enabled: boolean;
  onChange: (enabled: boolean) => void;
  label?: string;
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  className?: string;
}

export function ToggleButton({ 
  enabled, 
  onChange, 
  label, 
  size = "md",
  disabled = false,
  className 
}: ToggleButtonProps) {
  const sizes = {
    sm: {
      container: "w-9 h-5",
      circle: "w-3.5 h-3.5",
      translate: "translate-x-4"
    },
    md: {
      container: "w-11 h-6",
      circle: "w-4 h-4",
      translate: "translate-x-5"
    },
    lg: {
      container: "w-14 h-7",
      circle: "w-5 h-5",
      translate: "translate-x-7"
    }
  };

  const currentSize = sizes[size];

  return (
    <div className={cn("flex items-center gap-3", className)}>
      {label && (
        <span className={cn(
          "text-gray-700 select-none",
          size === "sm" && "text-sm",
          size === "lg" && "text-base",
          disabled && "text-gray-400"
        )}>
          {label}
        </span>
      )}
      
      <button
        type="button"
        role="switch"
        aria-checked={enabled}
        disabled={disabled}
        onClick={() => !disabled && onChange(!enabled)}
        className={cn(
          "toggle-button relative inline-flex flex-shrink-0 rounded-full transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2",
          currentSize.container,
          enabled 
            ? "bg-gradient-to-r from-blue-600 to-indigo-700 focus:ring-blue-500 shadow-md shadow-blue-200" 
            : "bg-gray-300 focus:ring-gray-400",
          disabled 
            ? "opacity-50 cursor-not-allowed" 
            : "cursor-pointer hover:shadow-lg"
        )}
      >
        <span className="sr-only">{label || "Toggle"}</span>
        <span
          aria-hidden="true"
          className={cn(
            "toggle-circle pointer-events-none inline-block rounded-full bg-white shadow-lg ring-0 transition-all duration-300 ease-in-out transform",
            currentSize.circle,
            "absolute top-1/2 -translate-y-1/2 left-1",
            enabled ? currentSize.translate : "translate-x-0"
          )}
        />
      </button>
    </div>
  );
}
