import React, { useState, useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'
import { Play, Pause, Volume2, VolumeX, Maximize, Loader2, PlayCircle, Video } from 'lucide-react'
import { Button } from './ui/button'

interface ExerciseVideoProps {
  src?: string
  poster?: string
  exerciseName: string
  className?: string
  size?: 'small' | 'medium' | 'large' | 'full'
  autoPlay?: boolean
  muted?: boolean
  loop?: boolean
  controls?: boolean
  showPlaceholder?: boolean
  lazy?: boolean
  onVideoClick?: () => void
}

export default function ExerciseVideo({
  src,
  poster,
  exerciseName,
  className,
  size = 'medium',
  autoPlay = false,
  muted = true,
  loop = true,
  controls = false,
  showPlaceholder = true,
  lazy = true,
  onVideoClick
}: ExerciseVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(muted)
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [isVisible, setIsVisible] = useState(!lazy)
  const [showControls, setShowControls] = useState(false)

  // Size configurations
  const sizeClasses = {
    small: 'w-16 h-16',
    medium: 'w-24 h-24',
    large: 'w-48 h-48',
    full: 'w-full h-64 md:h-80'
  }

  const iconSizes = {
    small: 'w-4 h-4',
    medium: 'w-6 h-6',
    large: 'w-8 h-8',
    full: 'w-12 h-12'
  }

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (!lazy) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1 }
    )

    const element = document.getElementById(`exercise-video-${exerciseName}`)
    if (element) {
      observer.observe(element)
    }

    return () => observer.disconnect()
  }, [lazy, exerciseName])

  const handleVideoLoad = () => {
    setIsLoading(false)
    setHasError(false)
  }

  const handleVideoError = () => {
    setIsLoading(false)
    setHasError(true)
  }

  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!videoRef.current) return

    if (isPlaying) {
      videoRef.current.pause()
      setIsPlaying(false)
    } else {
      videoRef.current.play()
      setIsPlaying(true)
    }
  }

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!videoRef.current) return
    
    videoRef.current.muted = !isMuted
    setIsMuted(!isMuted)
  }

  const handleVideoClick = () => {
    if (onVideoClick) {
      onVideoClick()
    } else if (size !== 'full') {
      togglePlay(new MouseEvent('click') as any)
    }
  }

  const handleMouseEnter = () => {
    setShowControls(true)
  }

  const handleMouseLeave = () => {
    setShowControls(false)
  }

  // Placeholder component
  const PlaceholderContent = () => (
    <div className={cn(
      "flex flex-col items-center justify-center bg-gradient-to-br from-slate-100 to-slate-300 dark:from-slate-700 dark:to-slate-900 text-[var(--color-activity)] dark:text-white",
      sizeClasses[size]
    )}>
      <PlayCircle className={cn(iconSizes[size], "mb-1 text-[var(--color-activity)] dark:text-white")} />
      {size !== 'small' && (
        <span className="text-xs text-center px-1 font-medium">
          {size === 'full' ? 'Video Guide' : 'Video'}
        </span>
      )}
    </div>
  )

  // Loading component
  const LoadingContent = () => (
    <div className={cn(
      "flex flex-col items-center justify-center bg-slate-100 dark:bg-slate-700 text-[var(--color-activity)] dark:text-white",
      sizeClasses[size]
    )}>
      <Loader2 className={cn(iconSizes[size], "animate-spin mb-1")} />
      {size !== 'small' && (
        <span className="text-xs font-medium">Loading...</span>
      )}
    </div>
  )

  return (
    <div
      id={`exercise-video-${exerciseName}`}
      className={cn(
        "relative overflow-hidden rounded-lg border border-slate-200 dark:border-slate-700 group bg-black",
        sizeClasses[size],
        "cursor-pointer hover:shadow-md transition-shadow",
        className
      )}
      onClick={handleVideoClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      data-testid={`exercise-video-${exerciseName.toLowerCase().replace(/\s+/g, '-')}`}
    >
      {!isVisible ? (
        // Lazy loading placeholder
        <div className={cn(
          "flex items-center justify-center bg-slate-50 dark:bg-slate-800",
          sizeClasses[size]
        )}>
          <Video className={cn(iconSizes[size], "text-[var(--color-activity)] dark:text-white")} />
        </div>
      ) : !src || hasError ? (
        // No video or error placeholder
        showPlaceholder ? <PlaceholderContent /> : null
      ) : (
        <>
          {/* Loading state */}
          {isLoading && <LoadingContent />}
          
          {/* Actual video */}
          <video
            ref={videoRef}
            src={src}
            poster={poster}
            onLoadedData={handleVideoLoad}
            onError={handleVideoError}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            className={cn(
              "w-full h-full object-cover transition-opacity duration-300",
              isLoading ? "opacity-0" : "opacity-100"
            )}
            autoPlay={autoPlay}
            muted={muted}
            loop={loop}
            controls={controls}
            playsInline
          />
          
          {/* Custom video controls overlay */}
          {!controls && !isLoading && !hasError && (
            <div className={cn(
              "absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent",
              "flex items-center justify-center transition-opacity duration-200",
              showControls ? "opacity-100" : "opacity-0 group-hover:opacity-100"
            )}>
              {/* Play/Pause button */}
              <Button
                variant="ghost"
                size="icon"
                onClick={togglePlay}
                className="backdrop-blur-sm hover:bg-white/20"
                style={{ color: 'var(--color-text-on-surface)' }}
              >
                {isPlaying ? (
                  <Pause className={iconSizes[size]} />
                ) : (
                  <Play className={cn(iconSizes[size], "ml-0.5")} />
                )}
              </Button>
              
              {/* Bottom controls */}
              {size === 'full' && (
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={toggleMute}
                      className="backdrop-blur-sm hover:bg-white/20 w-8 h-8"
                      style={{ color: 'var(--color-text-on-surface)' }}
                    >
                      {isMuted ? (
                        <VolumeX className="w-4 h-4" />
                      ) : (
                        <Volume2 className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => videoRef.current?.requestFullscreen()}
                    className="backdrop-blur-sm hover:bg-white/20 w-8 h-8"
                    style={{ color: 'var(--color-text-on-surface)' }}
                  >
                    <Maximize className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </div>
          )}
        </>
      )}
      
      {/* Video type badge */}
      {size === 'full' && !hasError && !isLoading && (
        <div className="absolute top-2 right-2">
          <div className="bg-red-600 px-2 py-1 rounded-md text-xs font-medium shadow-lg flex items-center space-x-1" style={{ color: 'var(--color-text-on-error)' }}>
            <PlayCircle className="w-3 h-3" />
            <span>Video</span>
          </div>
        </div>
      )}
    </div>
  )
}

// Convenience components for common use cases
export const VideoThumbnail = (props: Omit<ExerciseVideoProps, 'size'>) => (
  <ExerciseVideo {...props} size="small" />
)

export const VideoPreview = (props: Omit<ExerciseVideoProps, 'size'>) => (
  <ExerciseVideo {...props} size="medium" />
)

export const VideoGallery = (props: Omit<ExerciseVideoProps, 'size'>) => (
  <ExerciseVideo {...props} size="large" />
)

export const VideoPlayer = (props: Omit<ExerciseVideoProps, 'size'>) => (
  <ExerciseVideo {...props} size="full" controls />
)