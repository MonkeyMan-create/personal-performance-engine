import React, { useState } from 'react'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Input } from '../components/ui/input'
import { ArrowLeft, Search, Book, MessageCircle, ChevronDown, ChevronRight } from 'lucide-react'
import { Link } from 'wouter'

interface FAQItem {
  id: string
  question: string
  answer: string
  category: string
}

const faqData: FAQItem[] = [
  {
    id: '1',
    question: 'How do I track my workouts?',
    answer: 'Navigate to the Workouts tab and tap "Start Workout". Select exercises from our database or create custom ones. Log sets, reps, and weights for each exercise. Your progress is automatically saved.',
    category: 'Workouts'
  },
  {
    id: '2',
    question: 'Can I use the app without creating an account?',
    answer: 'Yes! Our Guest Mode allows you to use all core features without registration. Your data is saved locally on your device. To sync across devices or backup data, create an account.',
    category: 'Account'
  },
  {
    id: '3',
    question: 'How do I switch between LBS and KG?',
    answer: 'Go to Settings (Profile tab), then tap "Measurement Units" to toggle between LBS and KG. This setting affects all weight displays throughout the app.',
    category: 'Settings'
  },
  {
    id: '4',
    question: 'How do I log my nutrition?',
    answer: 'Use the Nutrition tab to log meals and track calories. Search our food database or scan barcodes for quick entry. Set daily calorie goals based on your fitness objectives.',
    category: 'Nutrition'
  },
  {
    id: '5',
    question: 'Is my data secure and private?',
    answer: 'Absolutely. We use industry-standard encryption and never sell your personal data. You have full control over your information and can export or delete it at any time.',
    category: 'Privacy'
  },
  {
    id: '6',
    question: 'How do I connect health apps like Apple Health?',
    answer: 'Visit Settings > Health Data Connections to link with Apple HealthKit or Google Health Connect. This allows automatic syncing of health metrics like sleep and heart rate.',
    category: 'Integrations'
  }
]

const categories = ['All', 'Workouts', 'Nutrition', 'Account', 'Settings', 'Privacy', 'Integrations']

export default function HelpCenterPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null)

  const filteredFAQs = faqData.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'All' || faq.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const toggleFAQ = (id: string) => {
    setExpandedFAQ(expandedFAQ === id ? null : id)
  }

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      <div className="container mx-auto p-4 space-y-6 pb-24">
        {/* Header */}
        <div className="flex items-center gap-4 pt-8">
          <Link href="/profile">
            <Button variant="ghost" size="sm" className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]" data-testid="button-back">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Settings
            </Button>
          </Link>
        </div>

        <div className="text-center">
          <h1 className="text-3xl font-bold text-[var(--color-text-primary)]" data-testid="page-title">Help Center</h1>
          <p className="text-[var(--color-text-secondary)] mt-2">Find answers to common questions and learn how to use the app</p>
        </div>

        {/* Search Bar */}
        <Card className="bg-[var(--color-surface)] border-[var(--color-border)] backdrop-blur-xl shadow-2xl">
          <CardContent className="p-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--color-text-secondary)] w-5 h-5" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for help topics..."
                className="pl-10 bg-[var(--color-surface)] border-[var(--color-border)] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-secondary)] h-12"
                data-testid="input-search"
              />
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="bg-slate-800/60 border-slate-700/50 backdrop-blur-xl shadow-2xl cursor-pointer hover:bg-slate-700/40 transition-all">
            <CardContent className="p-6 text-center space-y-4">
              <div className="w-16 h-16 bg-[var(--color-action)]/10 rounded-xl mx-auto flex items-center justify-center">
                <Book className="w-8 h-8 text-[var(--color-action)]" />
              </div>
              <div>
                <h3 className="font-bold text-[var(--color-text-primary)] text-lg">Getting Started</h3>
                <p className="text-[var(--color-text-secondary)] text-sm mt-2">
                  New to the app? Learn the basics here
                </p>
              </div>
            </CardContent>
          </Card>

          <Link href="/contact-support">
            <Card className="bg-[var(--color-surface)] border-[var(--color-border)] backdrop-blur-xl shadow-2xl cursor-pointer hover:bg-[var(--color-surface)]/80 transition-all">
              <CardContent className="p-6 text-center space-y-4">
                <div className="w-16 h-16 bg-[var(--color-action)]/20 rounded-xl mx-auto flex items-center justify-center">
                  <MessageCircle className="w-8 h-8 text-[var(--color-action)]" />
                </div>
                <div>
                  <h3 className="font-bold text-[var(--color-text-primary)] text-lg">Contact Support</h3>
                  <p className="text-[var(--color-text-secondary)] text-sm mt-2">
                    Can't find what you're looking for?
                  </p>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/mission">
            <Card className="bg-[var(--color-surface)] border-[var(--color-border)] backdrop-blur-xl shadow-2xl cursor-pointer hover:bg-[var(--color-surface)]/80 transition-all">
              <CardContent className="p-6 text-center space-y-4">
                <div className="w-16 h-16 bg-[var(--color-action)]/10 rounded-xl mx-auto flex items-center justify-center">
                  <Search className="w-8 h-8 text-[var(--color-action)]" />
                </div>
                <div>
                  <h3 className="font-bold text-[var(--color-text-primary)] text-lg">Our Mission</h3>
                  <p className="text-[var(--color-text-secondary)] text-sm mt-2">
                    Learn about our commitment to free fitness
                  </p>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Category Filter */}
        <Card className="bg-[var(--color-surface)] border-[var(--color-border)] backdrop-blur-xl shadow-2xl">
          <CardContent className="p-6">
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className={selectedCategory === category 
                    ? "bg-[var(--color-action)] hover:bg-[var(--color-action-hover)] text-[var(--color-action-text)]" 
                    : "border-[var(--color-border)] text-[var(--color-text-secondary)] hover:bg-[var(--color-surface)]/80"
                  }
                  data-testid={`filter-${category.toLowerCase()}`}
                >
                  {category}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* FAQ Section */}
        <Card className="bg-[var(--color-surface)] border-[var(--color-border)] backdrop-blur-xl shadow-2xl">
          <CardHeader>
            <CardTitle className="text-[var(--color-text-primary)] text-xl font-bold">
              Frequently Asked Questions
            </CardTitle>
            <CardDescription className="text-[var(--color-text-secondary)]">
              {filteredFAQs.length} question{filteredFAQs.length !== 1 ? 's' : ''} found
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {filteredFAQs.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-[var(--color-text-secondary)]">
                  No questions found. Try adjusting your search or category filter.
                </p>
              </div>
            ) : (
              filteredFAQs.map((faq) => (
                <div key={faq.id} className="border border-[var(--color-border)] rounded-lg overflow-hidden">
                  <button
                    onClick={() => toggleFAQ(faq.id)}
                    className="w-full p-4 text-left hover:bg-[var(--color-surface)]/60 transition-all duration-200 flex items-center justify-between"
                    data-testid={`faq-question-${faq.id}`}
                  >
                    <div className="flex-1">
                      <h3 className="font-semibold text-[var(--color-text-primary)]">{faq.question}</h3>
                      <span className="text-xs text-[var(--color-action)] font-medium">{faq.category}</span>
                    </div>
                    {expandedFAQ === faq.id ? (
                      <ChevronDown className="w-5 h-5 text-[var(--color-text-secondary)]" />
                    ) : (
                      <ChevronRight className="w-5 h-5 text-[var(--color-text-secondary)]" />
                    )}
                  </button>
                  
                  {expandedFAQ === faq.id && (
                    <div className="p-4 bg-[var(--color-surface)]/40 border-t border-[var(--color-border)]" data-testid={`faq-answer-${faq.id}`}>
                      <p className="text-[var(--color-text-secondary)] leading-relaxed">{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Additional Resources */}
        <Card className="bg-[var(--color-surface)] border-[var(--color-border)] backdrop-blur-xl shadow-2xl">
          <CardHeader>
            <CardTitle className="text-[var(--color-text-primary)] text-xl font-bold">
              Still Need Help?
            </CardTitle>
            <CardDescription className="text-[var(--color-text-secondary)]">
              Additional resources and support options
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <Link href="/contact-support">
                <Button 
                  variant="outline" 
                  className="w-full h-12 border-[var(--color-action)]/50 text-[var(--color-action)] hover:bg-[var(--color-action)]/10"
                  data-testid="button-contact-support-bottom"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Contact Support Team
                </Button>
              </Link>
              
              <Link href="/mission">
                <Button 
                  variant="outline" 
                  className="w-full h-12 border-[var(--color-action)]/50 text-[var(--color-action)] hover:bg-[var(--color-action)]/10"
                  data-testid="button-mission-bottom"
                >
                  <Book className="w-4 h-4 mr-2" />
                  Learn About Our Mission
                </Button>
              </Link>
            </div>
            
            <p className="text-xs text-[var(--color-text-secondary)] text-center">
              We're here to help! Don't hesitate to reach out if you can't find what you're looking for.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}