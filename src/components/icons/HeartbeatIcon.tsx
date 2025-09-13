import React from 'react';

interface HeartbeatIconProps {
  className?: string
  size?: number
}

export default function HeartbeatIcon({ className = "w-10 h-10", size }: HeartbeatIconProps) {
  return (
    <svg 
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
    </svg>
  )
}