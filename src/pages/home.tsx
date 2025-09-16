import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import AuthPrompt from '../components/AuthPrompt'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Plus, Utensils, Dumbbell, Clock, Moon, Sun, Calendar, Brain, Activity, Flame, Target, Apple, TrendingUp, Lightbulb, Award } from 'lucide-react'
import { Link } from 'wouter'
import ProgressRing from '../components/ProgressRing'

export default function HomePage() {
  const { user, isGuestMode } = useAuth()
  const [selectedMood, setSelectedMood] = useState<string | null>(null)
  const [currentTime, setCurrentTime] = useState(new Date())

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 60000)
    return () => clearInterval(timer)
  }, [])

  if (!user && !isGuestMode) {
    return (
      <AuthPrompt 
        title="Daily Diary"
        description="Your personal fitness command center - track every meal, every workout, every day."
      />
    )
  }

  const getGreeting = () => {
    const hour = currentTime.getHours()
    if (hour < 12) return { text: 'Good Morning', icon: Sun }
    if (hour < 18) return { text: 'Good Afternoon', icon: Sun }
    return { text: 'Good Evening', icon: Moon }
  }

  const greeting = getGreeting()
  const GreetingIcon = greeting.icon

  const moods = [
    { emoji: '😄', label: 'Excellent', value: 'excellent' },
    { emoji: '😊', label: 'Good', value: 'good' },
    { emoji: '😐', label: 'Okay', value: 'okay' },
    { emoji: '😔', label: 'Low', value: 'low' },
    { emoji: '😴', label: 'Tired', value: 'tired' }
  ]

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    })
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      month: 'long', 
      day: 'numeric' 
    })
  }

  // Mock data for progress indicators
  const stepsData = { current: 7234, goal: 10000 }
  const caloriesData = { current: 1450, goal: 2000 }
  const sleepData = { current: 7.2, goal: 8 }
  const waterData = { current: 6, goal: 8 }

  const stepsProgress = (stepsData.current / stepsData.goal) * 100
  const caloriesProgress = (caloriesData.current / caloriesData.goal) * 100
  const sleepProgress = (sleepData.current / sleepData.goal) * 100
  const waterProgress = (waterData.current / waterData.goal) * 100

  // Nutrition mock data
  const nutritionData = {
    calories: { current: 1450, goal: 2000 },
    protein: { current: 85, goal: 120 },
    carbs: { current: 180, goal: 250 },
    fat: { current: 65, goal: 80 },
    mealsLogged: 2
  }

  // Wellness insights
  const insights = [
    {
      id: 1,
      icon: Target,
      message: "You're 85% to your step goal! A 10-minute walk will get you there.",
      action: "Take a walk",
      badgeClass: "icon-badge-activity"
    },
    {
      id: 2,
      icon: Award,
      message: "Great job hitting your protein target yesterday!",
      action: "Keep it up",
      badgeClass: "icon-badge-nutrition"
    },
    {
      id: 3,
      icon: Brain,
      message: "Consider a 5-minute meditation to reduce stress.",
      action: "Meditate",
      badgeClass: "icon-badge-wellness"
    }
  ]

  return (
    <div 
      style={{
        minHeight: '100vh',
        background: 'var(--color-background)',
        paddingBottom: 'calc(var(--spacing-20) + var(--spacing-4))', // Account for bottom nav
        color: 'var(--color-text-primary)'
      }}
    >
      <div 
        style={{
          maxWidth: '480px',
          margin: '0 auto',
          padding: `var(--spacing-6) var(--spacing-4)`,
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--spacing-6)'
        }}
      >
        
        {/* Top Section - Greeting & Time */}
        <div 
          style={{
            textAlign: 'center',
            paddingTop: 'var(--spacing-4)',
            paddingBottom: 'var(--spacing-6)'
          }}
        >
          <div 
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 'var(--spacing-3)',
              marginBottom: 'var(--spacing-2)'
            }}
          >
            <GreetingIcon 
              style={{
                width: 'var(--icon-size-xl)',
                height: 'var(--icon-size-xl)',
                color: 'var(--color-action)'
              }}
            />
            <h1 
              style={{
                fontSize: 'var(--font-size-3xl)',
                fontWeight: 'var(--font-weight-bold)',
                color: 'var(--color-text-primary)',
                margin: 0
              }}
              data-testid="greeting-text"
            >
              {greeting.text}
            </h1>
          </div>
          
          <div 
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 'var(--spacing-4)',
              color: 'var(--color-text-secondary)'
            }}
          >
            <div 
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--spacing-2)'
              }}
            >
              <Clock 
                style={{
                  width: 'var(--icon-size-md)',
                  height: 'var(--icon-size-md)'
                }}
              />
              <span 
                style={{
                  fontSize: 'var(--font-size-xl)',
                  fontWeight: 'var(--font-weight-semibold)'
                }}
                data-testid="current-time"
              >
                {formatTime(currentTime)}
              </span>
            </div>
            <div 
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--spacing-2)'
              }}
            >
              <Calendar 
                style={{
                  width: 'var(--icon-size-md)',
                  height: 'var(--icon-size-md)'
                }}
              />
              <span 
                style={{
                  fontSize: 'var(--font-size-lg)'
                }}
                data-testid="current-date"
              >
                {formatDate(currentTime)}
              </span>
            </div>
          </div>
        </div>

        {/* Mood Check-in */}
        <Card 
          style={{
            background: `linear-gradient(135deg, var(--color-wellness), ${getComputedStyle(document.documentElement).getPropertyValue('--color-wellness-hover')})`,
            border: 'none',
            color: 'var(--color-wellness-text)'
          }}
        >
          <CardHeader 
            style={{
              textAlign: 'center'
            }}
          >
            <CardTitle 
              style={{
                color: 'var(--color-wellness-text)',
                fontSize: 'var(--font-size-xl)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 'var(--spacing-2)'
              }}
            >
              <Brain 
                style={{
                  width: 'var(--icon-size-lg)',
                  height: 'var(--icon-size-lg)',
                  color: 'var(--color-wellness-text)'
                }} 
              />
              How are you feeling today?
            </CardTitle>
            <CardDescription 
              style={{
                color: 'rgba(255, 255, 255, 0.8)'
              }}
            >
              Tap an emoji to check in with your mood
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div 
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 'var(--spacing-4)'
              }}
            >
              {moods.map((mood) => (
                <button
                  key={mood.value}
                  onClick={() => setSelectedMood(mood.value)}
                  style={{
                    padding: 'var(--spacing-4)',
                    borderRadius: 'var(--radius-2xl)',
                    transition: 'all var(--duration-slow) var(--easing-ease-out)',
                    transform: 'scale(1)',
                    background: selectedMood === mood.value 
                      ? `linear-gradient(135deg, var(--color-wellness), ${getComputedStyle(document.documentElement).getPropertyValue('--color-wellness-hover')})` 
                      : 'var(--color-surface)',
                    border: selectedMood === mood.value 
                      ? 'none' 
                      : '1px solid var(--color-border)',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 'var(--spacing-1)'
                  }}
                  data-testid={`mood-${mood.value}`}
                  aria-label={`Select ${mood.label} mood`}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.1)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)'
                  }}
                  onMouseDown={(e) => {
                    e.currentTarget.style.transform = 'scale(0.95)'
                  }}
                  onMouseUp={(e) => {
                    e.currentTarget.style.transform = 'scale(1.1)'
                  }}
                >
                  <div 
                    style={{
                      fontSize: 'var(--font-size-3xl)'
                    }}
                  >
                    {mood.emoji}
                  </div>
                  <div 
                    style={{
                      fontSize: 'var(--font-size-xs)',
                      color: selectedMood === mood.value 
                        ? 'rgba(255, 255, 255, 0.8)' 
                        : 'var(--color-text-secondary)',
                      marginTop: 'var(--spacing-1)',
                      fontWeight: 'var(--font-weight-medium)'
                    }}
                  >
                    {mood.label}
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Central Progress Ring */}
        <div 
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: `var(--spacing-8) 0`
          }}
        >
          <ProgressRing
            progress={caloriesProgress}
            current={caloriesData.current}
            goal={caloriesData.goal}
            label="Calories"
            unit="cal"
            size="lg"
            color="var(--color-nutrition)"
            style={{
              filter: 'drop-shadow(0 25px 50px rgba(0, 0, 0, 0.15))'
            }}
          />
        </div>

        {/* Key Metrics Grid - V2.0 Enhanced */}
        <div 
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: 'var(--spacing-4)'
          }}
        >
          <div 
            style={{
              background: 'var(--gradient-card-activity)',
              border: `1px solid var(--border-activity-light)`,
              borderRadius: 'var(--radius-lg)',
              padding: 'var(--spacing-5)',
              textAlign: 'center',
              transition: 'all var(--duration-slow) var(--easing-ease-out)',
              boxShadow: 'var(--shadow-md)',
              cursor: 'pointer',
              position: 'relative',
              overflow: 'hidden'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)'
              e.currentTarget.style.boxShadow = 'var(--shadow-activity)'
              e.currentTarget.style.borderColor = 'var(--color-activity)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = 'var(--shadow-md)'
              e.currentTarget.style.borderColor = 'var(--border-activity-light)'
            }}
          >
            {/* Icon badge with enhanced styling */}
            <div 
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 'var(--spacing-3)',
                gap: 'var(--spacing-2)'
              }}
            >
              <div 
                style={{
                  padding: 'var(--spacing-2)',
                  borderRadius: 'var(--radius-lg)',
                  background: 'var(--gradient-card-activity)',
                  border: `1px solid var(--border-activity-light)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Activity 
                  style={{
                    width: 'var(--icon-size-md)',
                    height: 'var(--icon-size-md)',
                    color: 'var(--color-activity)'
                  }}
                />
              </div>
              <span 
                style={{
                  color: 'var(--color-text-secondary)',
                  fontSize: 'var(--font-size-sm)',
                  fontWeight: 'var(--font-weight-semibold)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}
              >
                Steps
              </span>
            </div>
            <div 
              style={{
                fontSize: 'var(--font-size-3xl)',
                fontWeight: 'var(--font-weight-bold)',
                color: 'var(--color-text-primary)',
                marginBottom: 'var(--spacing-1)'
              }}
              data-testid="steps-count-metric"
            >
              {stepsData.current.toLocaleString()}
            </div>
            <div 
              style={{
                fontSize: 'var(--font-size-xs)',
                color: 'var(--color-text-tertiary)',
                fontWeight: 'var(--font-weight-medium)'
              }}
            >
              of {stepsData.goal.toLocaleString()} goal
            </div>
          </div>

          <div 
            style={{
              background: 'var(--gradient-card-nutrition)',
              border: `1px solid var(--border-nutrition-light)`,
              borderRadius: 'var(--radius-lg)',
              padding: 'var(--spacing-5)',
              textAlign: 'center',
              transition: 'all var(--duration-slow) var(--easing-ease-out)',
              boxShadow: 'var(--shadow-md)',
              cursor: 'pointer',
              position: 'relative',
              overflow: 'hidden'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)'
              e.currentTarget.style.boxShadow = 'var(--shadow-nutrition)'
              e.currentTarget.style.borderColor = 'var(--color-nutrition)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = 'var(--shadow-md)'
              e.currentTarget.style.borderColor = 'var(--border-nutrition-light)'
            }}
          >
            {/* Icon badge with enhanced styling */}
            <div 
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 'var(--spacing-3)',
                gap: 'var(--spacing-2)'
              }}
            >
              <div 
                style={{
                  padding: 'var(--spacing-2)',
                  borderRadius: 'var(--radius-lg)',
                  background: 'var(--gradient-card-nutrition)',
                  border: `1px solid var(--border-nutrition-light)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Flame 
                  style={{
                    width: 'var(--icon-size-md)',
                    height: 'var(--icon-size-md)',
                    color: 'var(--color-nutrition)'
                  }}
                />
              </div>
              <span 
                style={{
                  color: 'var(--color-text-secondary)',
                  fontSize: 'var(--font-size-sm)',
                  fontWeight: 'var(--font-weight-semibold)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}
              >
                Burned
              </span>
            </div>
            <div 
              style={{
                fontSize: 'var(--font-size-3xl)',
                fontWeight: 'var(--font-weight-bold)',
                color: 'var(--color-text-primary)',
                marginBottom: 'var(--spacing-1)'
              }}
              data-testid="calories-burned-metric"
            >
              420<span 
                style={{
                  fontSize: 'var(--font-size-lg)',
                  color: 'var(--color-text-secondary)',
                  marginLeft: 'var(--spacing-1)'
                }}
              >
                cal
              </span>
            </div>
            <div 
              style={{
                fontSize: 'var(--font-size-xs)',
                color: 'var(--color-text-tertiary)',
                fontWeight: 'var(--font-weight-medium)'
              }}
            >
              burned today
            </div>
          </div>

          <div 
            style={{
              background: 'var(--gradient-card-wellness)',
              border: `1px solid var(--border-wellness-light)`,
              borderRadius: 'var(--radius-lg)',
              padding: 'var(--spacing-5)',
              textAlign: 'center',
              transition: 'all var(--duration-slow) var(--easing-ease-out)',
              boxShadow: 'var(--shadow-md)',
              cursor: 'pointer',
              position: 'relative',
              overflow: 'hidden'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)'
              e.currentTarget.style.boxShadow = 'var(--shadow-wellness)'
              e.currentTarget.style.borderColor = 'var(--color-wellness)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = 'var(--shadow-md)'
              e.currentTarget.style.borderColor = 'var(--border-wellness-light)'
            }}
          >
            {/* Icon badge with enhanced styling */}
            <div 
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 'var(--spacing-3)',
                gap: 'var(--spacing-2)'
              }}
            >
              <div 
                style={{
                  padding: 'var(--spacing-2)',
                  borderRadius: 'var(--radius-lg)',
                  background: 'var(--gradient-card-wellness)',
                  border: `1px solid var(--border-wellness-light)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Moon 
                  style={{
                    width: 'var(--icon-size-md)',
                    height: 'var(--icon-size-md)',
                    color: 'var(--color-wellness)'
                  }}
                />
              </div>
              <span 
                style={{
                  color: 'var(--color-text-secondary)',
                  fontSize: 'var(--font-size-sm)',
                  fontWeight: 'var(--font-weight-semibold)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}
              >
                Sleep
              </span>
            </div>
            <div 
              style={{
                fontSize: 'var(--font-size-3xl)',
                fontWeight: 'var(--font-weight-bold)',
                color: 'var(--color-text-primary)',
                marginBottom: 'var(--spacing-1)'
              }}
              data-testid="sleep-hours-metric"
            >
              {sleepData.current}<span 
                style={{
                  fontSize: 'var(--font-size-lg)',
                  color: 'var(--color-text-secondary)',
                  marginLeft: 'var(--spacing-1)'
                }}
              >
                h
              </span>
            </div>
            <div 
              style={{
                fontSize: 'var(--font-size-xs)',
                color: 'var(--color-text-tertiary)',
                fontWeight: 'var(--font-weight-medium)'
              }}
            >
              of {sleepData.goal}h goal
            </div>
          </div>

          <div 
            style={{
              background: 'var(--gradient-card-action)',
              border: `1px solid var(--border-action-light)`,
              borderRadius: 'var(--radius-lg)',
              padding: 'var(--spacing-5)',
              textAlign: 'center',
              transition: 'all var(--duration-slow) var(--easing-ease-out)',
              boxShadow: 'var(--shadow-md)',
              cursor: 'pointer',
              position: 'relative',
              overflow: 'hidden'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)'
              e.currentTarget.style.boxShadow = 'var(--shadow-action)'
              e.currentTarget.style.borderColor = 'var(--color-action)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = 'var(--shadow-md)'
              e.currentTarget.style.borderColor = 'var(--border-action-light)'
            }}
          >
            {/* Icon badge with enhanced styling */}
            <div 
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 'var(--spacing-3)',
                gap: 'var(--spacing-2)'
              }}
            >
              <div 
                style={{
                  padding: 'var(--spacing-2)',
                  borderRadius: 'var(--radius-lg)',
                  background: 'var(--gradient-card-action)',
                  border: `1px solid var(--border-action-light)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Target 
                  style={{
                    width: 'var(--icon-size-md)',
                    height: 'var(--icon-size-md)',
                    color: 'var(--color-action)'
                  }}
                />
              </div>
              <span 
                style={{
                  color: 'var(--color-text-secondary)',
                  fontSize: 'var(--font-size-sm)',
                  fontWeight: 'var(--font-weight-semibold)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}
              >
                Water
              </span>
            </div>
            <div 
              style={{
                fontSize: 'var(--font-size-3xl)',
                fontWeight: 'var(--font-weight-bold)',
                color: 'var(--color-text-primary)',
                marginBottom: 'var(--spacing-1)'
              }}
              data-testid="water-glasses-metric"
            >
              {waterData.current}<span 
                style={{
                  fontSize: 'var(--font-size-lg)',
                  color: 'var(--color-text-secondary)',
                  marginLeft: 'var(--spacing-1)'
                }}
              >
                / {waterData.goal}
              </span>
            </div>
            <div 
              style={{
                fontSize: 'var(--font-size-xs)',
                color: 'var(--color-text-tertiary)',
                fontWeight: 'var(--font-weight-medium)'
              }}
            >
              glasses today
            </div>
          </div>
        </div>

        {/* Quick Action Buttons */}
        <div 
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--spacing-4)'
          }}
        >
          <Link href="/workouts">
            <Card 
              style={{
                background: 'var(--gradient-activity)',
                border: 'none',
                color: 'var(--color-activity-text)',
                transition: 'all var(--duration-slow) var(--easing-ease-out)',
                cursor: 'pointer',
                transform: 'scale(1)',
                boxShadow: 'var(--shadow-activity)',
                position: 'relative',
                overflow: 'hidden'
              }}
              data-testid="card-log-workout"
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.02) translateY(-2px)'
                e.currentTarget.style.boxShadow = 'var(--shadow-button-hover)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1) translateY(0)'
                e.currentTarget.style.boxShadow = 'var(--shadow-activity)'
              }}
              onMouseDown={(e) => {
                e.currentTarget.style.transform = 'scale(0.98) translateY(0)'
                e.currentTarget.style.boxShadow = 'var(--shadow-button-active)'
              }}
              onMouseUp={(e) => {
                e.currentTarget.style.transform = 'scale(1.02) translateY(-2px)'
                e.currentTarget.style.boxShadow = 'var(--shadow-button-hover)'
              }}
            >
              <CardContent 
                style={{
                  padding: 'var(--spacing-6)'
                }}
              >
                <div 
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <div 
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 'var(--spacing-4)'
                    }}
                  >
                    <div 
                      style={{
                        padding: 'var(--spacing-3)',
                        backgroundColor: 'rgba(255, 255, 255, 0.2)',
                        borderRadius: 'var(--radius-2xl)',
                        backdropFilter: 'blur(8px)'
                      }}
                    >
                      <Dumbbell 
                        style={{
                          width: 'var(--icon-size-lg)',
                          height: 'var(--icon-size-lg)',
                          color: 'inherit'
                        }}
                      />
                    </div>
                    <div>
                      <h3 
                        style={{
                          fontSize: 'var(--font-size-xl)',
                          fontWeight: 'var(--font-weight-bold)',
                          color: 'inherit',
                          margin: 0,
                          marginBottom: 'var(--spacing-1)'
                        }}
                      >
                        Log Workout
                      </h3>
                      <p 
                        style={{
                          opacity: 0.8,
                          color: 'inherit',
                          margin: 0,
                          fontSize: 'var(--font-size-sm)'
                        }}
                      >
                        Track your training session
                      </p>
                    </div>
                  </div>
                  <Plus 
                    style={{
                      width: 'var(--icon-size-lg)',
                      height: 'var(--icon-size-lg)',
                      color: 'inherit'
                    }}
                  />
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/nutrition">
            <Card 
              style={{
                background: 'var(--gradient-nutrition)',
                border: 'none',
                color: 'var(--color-nutrition-text)',
                transition: 'all var(--duration-slow) var(--easing-ease-out)',
                cursor: 'pointer',
                transform: 'scale(1)',
                boxShadow: 'var(--shadow-nutrition)',
                position: 'relative',
                overflow: 'hidden'
              }}
              data-testid="card-log-meal"
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.02) translateY(-2px)'
                e.currentTarget.style.boxShadow = 'var(--shadow-button-hover)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1) translateY(0)'
                e.currentTarget.style.boxShadow = 'var(--shadow-nutrition)'
              }}
              onMouseDown={(e) => {
                e.currentTarget.style.transform = 'scale(0.98) translateY(0)'
                e.currentTarget.style.boxShadow = 'var(--shadow-button-active)'
              }}
              onMouseUp={(e) => {
                e.currentTarget.style.transform = 'scale(1.02) translateY(-2px)'
                e.currentTarget.style.boxShadow = 'var(--shadow-button-hover)'
              }}
            >
              <CardContent 
                style={{
                  padding: 'var(--spacing-6)'
                }}
              >
                <div 
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <div 
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 'var(--spacing-4)'
                    }}
                  >
                    <div 
                      style={{
                        padding: 'var(--spacing-3)',
                        backgroundColor: 'rgba(255, 255, 255, 0.2)',
                        borderRadius: 'var(--radius-2xl)',
                        backdropFilter: 'blur(8px)'
                      }}
                    >
                      <Utensils 
                        style={{
                          width: 'var(--icon-size-lg)',
                          height: 'var(--icon-size-lg)',
                          color: 'inherit'
                        }}
                      />
                    </div>
                    <div>
                      <h3 
                        style={{
                          fontSize: 'var(--font-size-xl)',
                          fontWeight: 'var(--font-weight-bold)',
                          color: 'inherit',
                          margin: 0,
                          marginBottom: 'var(--spacing-1)'
                        }}
                      >
                        Log Meal
                      </h3>
                      <p 
                        style={{
                          opacity: 0.8,
                          color: 'inherit',
                          margin: 0,
                          fontSize: 'var(--font-size-sm)'
                        }}
                      >
                        Record what you ate
                      </p>
                    </div>
                  </div>
                  <Plus 
                    style={{
                      width: 'var(--icon-size-lg)',
                      height: 'var(--icon-size-lg)',
                      color: 'inherit'
                    }}
                  />
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/meditate">
            <Card 
              style={{
                background: 'var(--gradient-wellness)',
                border: 'none',
                color: 'var(--color-wellness-text)',
                transition: 'all var(--duration-slow) var(--easing-ease-out)',
                cursor: 'pointer',
                transform: 'scale(1)',
                boxShadow: 'var(--shadow-wellness)',
                position: 'relative',
                overflow: 'hidden'
              }}
              data-testid="card-meditate"
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.02) translateY(-2px)'
                e.currentTarget.style.boxShadow = 'var(--shadow-button-hover)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1) translateY(0)'
                e.currentTarget.style.boxShadow = 'var(--shadow-wellness)'
              }}
              onMouseDown={(e) => {
                e.currentTarget.style.transform = 'scale(0.98) translateY(0)'
                e.currentTarget.style.boxShadow = 'var(--shadow-button-active)'
              }}
              onMouseUp={(e) => {
                e.currentTarget.style.transform = 'scale(1.02) translateY(-2px)'
                e.currentTarget.style.boxShadow = 'var(--shadow-button-hover)'
              }}
            >
              <CardContent 
                style={{
                  padding: 'var(--spacing-6)'
                }}
              >
                <div 
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <div 
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 'var(--spacing-4)'
                    }}
                  >
                    <div 
                      style={{
                        padding: 'var(--spacing-3)',
                        backgroundColor: 'rgba(255, 255, 255, 0.2)',
                        borderRadius: 'var(--radius-2xl)',
                        backdropFilter: 'blur(8px)'
                      }}
                    >
                      <Brain 
                        style={{
                          width: 'var(--icon-size-lg)',
                          height: 'var(--icon-size-lg)',
                          color: 'inherit'
                        }}
                      />
                    </div>
                    <div>
                      <h3 
                        style={{
                          fontSize: 'var(--font-size-xl)',
                          fontWeight: 'var(--font-weight-bold)',
                          color: 'inherit',
                          margin: 0,
                          marginBottom: 'var(--spacing-1)'
                        }}
                      >
                        Meditate
                      </h3>
                      <p 
                        style={{
                          opacity: 0.8,
                          color: 'inherit',
                          margin: 0,
                          fontSize: 'var(--font-size-sm)'
                        }}
                      >
                        Find your inner peace
                      </p>
                    </div>
                  </div>
                  <Plus 
                    style={{
                      width: 'var(--icon-size-lg)',
                      height: 'var(--icon-size-lg)',
                      color: 'inherit'
                    }}
                  />
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Daily Wellness Insights */}
        <Card 
          style={{
            background: `linear-gradient(135deg, var(--color-wellness), ${getComputedStyle(document.documentElement).getPropertyValue('--color-wellness-hover')})`,
            border: 'none',
            color: 'var(--color-wellness-text)'
          }}
        >
          <CardHeader>
            <CardTitle 
              style={{
                color: 'var(--color-wellness-text)',
                display: 'flex',
                alignItems: 'flex-start',
                gap: 'var(--spacing-2)'
              }}
            >
              <div 
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 'var(--control-width-icon)',
                  height: 'var(--control-width-icon)',
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  borderRadius: 'var(--radius-lg)',
                  backdropFilter: 'blur(8px)'
                }}
              >
                <Lightbulb 
                  style={{
                    width: 'var(--icon-size-md)',
                    height: 'var(--icon-size-md)',
                    color: 'var(--color-wellness-text)'
                  }}
                />
              </div>
              Daily Wellness Insights
            </CardTitle>
            <CardDescription 
              style={{
                color: 'rgba(255, 255, 255, 0.8)'
              }}
            >
              Personalized tips to help you reach your goals
            </CardDescription>
          </CardHeader>
          <CardContent 
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--spacing-3)'
            }}
          >
            {insights.map((insight) => {
              const IconComponent = insight.icon
              return (
                <div 
                  key={insight.id} 
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 'var(--spacing-3)',
                    padding: 'var(--spacing-3)',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: 'var(--radius-lg)',
                    backdropFilter: 'blur(4px)'
                  }}
                  data-testid={`insight-${insight.id}`}
                >
                  <div 
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 'var(--control-width-icon-sm)',
                      height: 'var(--control-width-icon-sm)',
                      backgroundColor: 'rgba(255, 255, 255, 0.2)',
                      borderRadius: 'var(--radius-full)',
                      flexShrink: 0
                    }}
                  >
                    <IconComponent 
                      style={{
                        width: 'var(--icon-size-sm)',
                        height: 'var(--icon-size-sm)',
                        color: 'var(--color-wellness-text)'
                      }}
                    />
                  </div>
                  <div 
                    style={{
                      flex: 1,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 'var(--spacing-2)'
                    }}
                  >
                    <p 
                      style={{
                        color: 'var(--color-wellness-text)',
                        fontSize: 'var(--font-size-sm)',
                        lineHeight: 'var(--line-height-relaxed)',
                        margin: 0
                      }}
                    >
                      {insight.message}
                    </p>
                    <button 
                      style={{
                        alignSelf: 'flex-start',
                        padding: `var(--spacing-1) var(--spacing-3)`,
                        backgroundColor: 'rgba(255, 255, 255, 0.2)',
                        color: 'var(--color-wellness-text)',
                        fontSize: 'var(--font-size-xs)',
                        fontWeight: 'var(--font-weight-medium)',
                        borderRadius: 'var(--radius-full)',
                        border: '1px solid rgba(255, 255, 255, 0.3)',
                        cursor: 'pointer',
                        transition: 'all var(--duration-base) var(--easing-ease-out)'
                      }}
                      data-testid={`insight-action-${insight.id}`}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.3)'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)'
                      }}
                    >
                      {insight.action} →
                    </button>
                  </div>
                </div>
              )
            })}
          </CardContent>
        </Card>

        {/* Nutrition Snapshot */}
        <Card 
          style={{
            background: `linear-gradient(135deg, var(--color-nutrition), ${getComputedStyle(document.documentElement).getPropertyValue('--color-nutrition-hover')})`,
            border: 'none',
            color: 'var(--color-nutrition-text)'
          }}
        >
          <CardHeader>
            <CardTitle 
              style={{
                color: 'var(--color-nutrition-text)',
                display: 'flex',
                alignItems: 'flex-start',
                gap: 'var(--spacing-2)'
              }}
            >
              <div 
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 'var(--control-width-icon)',
                  height: 'var(--control-width-icon)',
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  borderRadius: 'var(--radius-lg)',
                  backdropFilter: 'blur(8px)'
                }}
              >
                <Apple 
                  style={{
                    width: 'var(--icon-size-md)',
                    height: 'var(--icon-size-md)',
                    color: 'var(--color-nutrition-text)'
                  }}
                />
              </div>
              Nutrition Snapshot
            </CardTitle>
            <CardDescription 
              style={{
                color: 'rgba(255, 255, 255, 0.8)'
              }}
            >
              Today's nutritional breakdown
            </CardDescription>
          </CardHeader>
          <CardContent 
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--spacing-4)'
            }}
          >
            {/* Macros */}
            <div 
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--spacing-3)'
              }}
            >
              <div 
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <span 
                  style={{
                    fontWeight: 'var(--font-weight-medium)',
                    color: 'var(--color-nutrition-text)'
                  }}
                >
                  Protein
                </span>
                <span 
                  style={{
                    color: 'rgba(255, 255, 255, 0.8)',
                    fontSize: 'var(--font-size-sm)'
                  }}
                  data-testid="protein-count"
                >
                  {nutritionData.protein.current}g / {nutritionData.protein.goal}g
                </span>
              </div>
              <div 
                style={{
                  width: '100%',
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  borderRadius: 'var(--radius-full)',
                  height: 'var(--spacing-2)'
                }}
              >
                <div 
                  style={{
                    backgroundColor: 'var(--color-protein)',
                    height: 'var(--spacing-2)',
                    borderRadius: 'var(--radius-full)',
                    transition: 'all 1s ease-out',
                    width: `${Math.min(100, (nutritionData.protein.current / nutritionData.protein.goal) * 100)}%`
                  }}
                />
              </div>
            </div>

            <div 
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--spacing-3)'
              }}
            >
              <div 
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <span 
                  style={{
                    fontWeight: 'var(--font-weight-medium)',
                    color: 'var(--color-nutrition-text)'
                  }}
                >
                  Carbs
                </span>
                <span 
                  style={{
                    color: 'rgba(255, 255, 255, 0.8)',
                    fontSize: 'var(--font-size-sm)'
                  }}
                  data-testid="carbs-count"
                >
                  {nutritionData.carbs.current}g / {nutritionData.carbs.goal}g
                </span>
              </div>
              <div 
                style={{
                  width: '100%',
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  borderRadius: 'var(--radius-full)',
                  height: 'var(--spacing-2)'
                }}
              >
                <div 
                  style={{
                    backgroundColor: 'var(--color-carbs)',
                    height: 'var(--spacing-2)',
                    borderRadius: 'var(--radius-full)',
                    transition: 'all 1s ease-out',
                    width: `${Math.min(100, (nutritionData.carbs.current / nutritionData.carbs.goal) * 100)}%`
                  }}
                />
              </div>
            </div>

            <div 
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--spacing-3)'
              }}
            >
              <div 
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <span 
                  style={{
                    fontWeight: 'var(--font-weight-medium)',
                    color: 'var(--color-nutrition-text)'
                  }}
                >
                  Fat
                </span>
                <span 
                  style={{
                    color: 'rgba(255, 255, 255, 0.8)',
                    fontSize: 'var(--font-size-sm)'
                  }}
                  data-testid="fat-count"
                >
                  {nutritionData.fat.current}g / {nutritionData.fat.goal}g
                </span>
              </div>
              <div 
                style={{
                  width: '100%',
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  borderRadius: 'var(--radius-full)',
                  height: 'var(--spacing-2)'
                }}
              >
                <div 
                  style={{
                    backgroundColor: 'var(--color-fat)',
                    height: 'var(--spacing-2)',
                    borderRadius: 'var(--radius-full)',
                    transition: 'all 1s ease-out',
                    width: `${Math.min(100, (nutritionData.fat.current / nutritionData.fat.goal) * 100)}%`
                  }}
                />
              </div>
            </div>

            {/* Quick Stats */}
            <div 
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingTop: 'var(--spacing-4)',
                borderTop: '1px solid rgba(255, 255, 255, 0.2)',
                gap: 'var(--spacing-2)'
              }}
            >
              <div 
                style={{
                  textAlign: 'center',
                  padding: 'var(--spacing-3)',
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  borderRadius: 'var(--radius-xl)',
                  backdropFilter: 'blur(8px)',
                  flex: 1
                }}
              >
                <p 
                  style={{
                    fontSize: 'var(--font-size-2xl)',
                    fontWeight: 'var(--font-weight-bold)',
                    color: 'var(--color-nutrition-text)',
                    margin: 0,
                    marginBottom: 'var(--spacing-1)'
                  }}
                  data-testid="meals-logged-count"
                >
                  {nutritionData.mealsLogged}
                </p>
                <p 
                  style={{
                    fontSize: 'var(--font-size-xs)',
                    color: 'rgba(255, 255, 255, 0.8)',
                    fontWeight: 'var(--font-weight-medium)',
                    margin: 0
                  }}
                >
                  Meals Logged
                </p>
              </div>
              <div 
                style={{
                  textAlign: 'center',
                  padding: 'var(--spacing-3)',
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  borderRadius: 'var(--radius-xl)',
                  backdropFilter: 'blur(8px)',
                  flex: 1
                }}
              >
                <p 
                  style={{
                    fontSize: 'var(--font-size-2xl)',
                    fontWeight: 'var(--font-weight-bold)',
                    color: 'var(--color-nutrition-text)',
                    margin: 0,
                    marginBottom: 'var(--spacing-1)'
                  }}
                  data-testid="calories-remaining"
                >
                  {nutritionData.calories.goal - nutritionData.calories.current}
                </p>
                <p 
                  style={{
                    fontSize: 'var(--font-size-xs)',
                    color: 'rgba(255, 255, 255, 0.8)',
                    fontWeight: 'var(--font-weight-medium)',
                    margin: 0
                  }}
                >
                  Calories Left
                </p>
              </div>
              <div 
                style={{
                  textAlign: 'center',
                  padding: 'var(--spacing-3)',
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  borderRadius: 'var(--radius-xl)',
                  backdropFilter: 'blur(8px)',
                  flex: 1
                }}
              >
                <p 
                  style={{
                    fontSize: 'var(--font-size-2xl)',
                    fontWeight: 'var(--font-weight-bold)',
                    color: 'var(--color-nutrition-text)',
                    margin: 0,
                    marginBottom: 'var(--spacing-1)'
                  }}
                >
                  73%
                </p>
                <p 
                  style={{
                    fontSize: 'var(--font-size-xs)',
                    color: 'rgba(255, 255, 255, 0.8)',
                    fontWeight: 'var(--font-weight-medium)',
                    margin: 0
                  }}
                >
                  Daily Goal
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}