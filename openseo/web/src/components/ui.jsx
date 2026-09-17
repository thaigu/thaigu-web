import React from "react";

export function Card({ className = "", children, ...props }) {
  return (
    <div
      className={`rounded-xl border border-border/70 bg-card text-card-foreground shadow-sm ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function Button({
  className = "",
  variant = "default", // default, outline, secondary, ghost, destructive
  size = "default", // sm, default, lg
  children,
  disabled,
  ...props
}) {
  const base =
    "inline-flex items-center justify-center rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary disabled:pointer-events-none disabled:opacity-50 cursor-pointer";

  const variants = {
    default: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm",
    outline: "border border-border/80 bg-background/50 hover:bg-muted text-foreground",
    secondary: "bg-muted text-foreground hover:bg-muted/80",
    ghost: "hover:bg-muted hover:text-foreground",
    destructive: "bg-rose-500 text-white hover:bg-rose-600",
  };

  const sizes = {
    sm: "h-8 px-3 text-xs",
    default: "h-9 px-4 py-2 text-sm",
    lg: "h-10 px-6 text-base",
  };

  return (
    <button
      className={`${base} ${variants[variant] || variants.default} ${sizes[size] || sizes.default} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}

export function Badge({
  className = "",
  variant = "default", // default, secondary, outline, destructive, success, warning
  children,
  ...props
}) {
  const base = "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors";

  const variants = {
    default: "bg-primary/20 text-primary border border-primary/30",
    secondary: "bg-muted text-muted-foreground border border-border",
    outline: "border border-border text-foreground",
    destructive: "bg-rose-500/20 text-rose-400 border border-rose-500/30",
    success: "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30",
    warning: "bg-amber-500/20 text-amber-400 border border-amber-500/30",
  };

  return (
    <span className={`${base} ${variants[variant] || variants.default} ${className}`} {...props}>
      {children}
    </span>
  );
}

export function Input({ className = "", ...props }) {
  return (
    <input
      className={`flex h-9 w-full rounded-md border border-border bg-background/50 px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      {...props}
    />
  );
}
