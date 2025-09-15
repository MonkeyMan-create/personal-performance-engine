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
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-4 space-y-8 pb-24">
        {/* Header */}
        <div className="pt-6 text-center space-y-4">
          <div className="flex items-center justify-center gap-4">
            <div className="p-3 bg-gradient-to-br from-action to-action/80 rounded-2xl shadow-lg">
              <Book className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-primary" data-testid="page-title">Help Center</h1>
              <p className="text-secondary text-lg">Find answers to common questions and learn how to use the app</p>
            </div>
          </div>
          <div className="card-action-header rounded-2xl p-4 border border-action/20">
            <p className="text-secondary text-lg flex items-center justify-center gap-2">
              <MessageCircle className="w-5 h-5 text-action" />
              We're here to help you on your fitness journey
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <Card className="card-action shadow-2xl backdrop-blur-xl overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-br from-action/5 via-transparent to-action/5 pointer-events-none"></div>
          <CardContent className="p-8 relative">
            <div className="relative">
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 p-2 bg-action/10 rounded-lg">
                <Search className="text-action w-5 h-5" />
              </div>
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for help topics..."
                className="pl-16 pr-6 input-primary border-2 border-action/30 focus:border-action text-primary placeholder:text-secondary h-14 text-lg font-medium rounded-xl shadow-lg"
                data-testid="input-search"
              />
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="card-success shadow-2xl backdrop-blur-xl cursor-pointer hover:scale-[1.02] transition-all duration-300 overflow-hidden relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-activity/5 via-transparent to-activity/10 pointer-events-none group-hover:from-activity/10 group-hover:to-activity/15 transition-all duration-300"></div>
            <CardContent className="p-8 text-center space-y-4 relative">
              <div className="w-20 h-20 card-activity rounded-2xl mx-auto flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Book className="w-10 h-10 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-primary text-xl mb-2">Getting Started</h3>
                <p className="text-secondary font-medium">
                  New to the app? Learn the basics here
                </p>
              </div>
            </CardContent>
          </Card>

          <Link href="/contact-support">
            <Card className="card-action shadow-2xl backdrop-blur-xl cursor-pointer hover:scale-[1.02] transition-all duration-300 overflow-hidden relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-action/5 via-transparent to-action/10 pointer-events-none group-hover:from-action/10 group-hover:to-action/15 transition-all duration-300"></div>
              <CardContent className="p-8 text-center space-y-4 relative">
                <div className="w-20 h-20 bg-gradient-to-br from-action to-action/80 rounded-2xl mx-auto flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <MessageCircle className="w-10 h-10 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-primary text-xl mb-2">Contact Support</h3>
                  <p className="text-secondary font-medium">
                    Can't find what you're looking for?
                  </p>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/mission">
            <Card className="card-glass shadow-2xl backdrop-blur-xl cursor-pointer hover:scale-[1.02] transition-all duration-300 overflow-hidden relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-wellness/5 via-transparent to-wellness/10 pointer-events-none group-hover:from-wellness/10 group-hover:to-wellness/15 transition-all duration-300"></div>
              <CardContent className="p-8 text-center space-y-4 relative">
                <div className="w-20 h-20 card-wellness rounded-2xl mx-auto flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Search className="w-10 h-10 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-primary text-xl mb-2">Our Mission</h3>
                  <p className="text-secondary font-medium">
                    Learn about our commitment to free fitness
                  </p>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Category Filter */}
        <Card className="card-action shadow-2xl backdrop-blur-xl overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-br from-action/5 via-transparent to-action/5 pointer-events-none"></div>
          <CardContent className="p-8 relative">
            <div className="mb-4">
              <h3 className="text-primary text-xl font-bold flex items-center gap-2">
                <div className="p-1 bg-action rounded-lg">
                  <Search className="w-4 h-4 text-white" />
                </div>
                Filter by Category
              </h3>
            </div>
            <div className="flex flex-wrap gap-3">
              {categories.map((category) => {
                const isActive = selectedCategory === category
                return (
                  <Button
                    key={category}
                    variant={isActive ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category)}
                    className={isActive 
                      ? "button-action text-white font-bold px-4 py-2 h-10 rounded-xl shadow-lg" 
                      : "border-2 border-action/30 text-secondary hover:bg-action/10 hover:border-action/50 font-medium px-4 py-2 h-10 rounded-xl"
                    }
                    data-testid={`filter-${category.toLowerCase()}`}
                  >
                    {category}
                    {isActive && <span className="ml-2">✓</span>}
                  </Button>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* FAQ Section */}
        <Card className="card-glass shadow-2xl backdrop-blur-xl overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-br from-action/5 via-transparent to-action/5 pointer-events-none"></div>
          <CardHeader className="bg-gradient-to-r from-action/10 to-action/5 relative">
            <CardTitle className="text-primary text-2xl font-bold flex items-center gap-3">
              <div className="p-2 bg-action rounded-xl shadow-lg">
                <MessageCircle className="w-6 h-6 text-white" />
              </div>
              Frequently Asked Questions
            </CardTitle>
            <CardDescription className="text-action text-lg font-medium">
              {filteredFAQs.length} question{filteredFAQs.length !== 1 ? 's' : ''} found
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 p-8 relative">
            {filteredFAQs.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-action/10 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Search className="w-8 h-8 text-action" />
                </div>
                <p className="text-secondary text-lg font-medium">
                  No questions found. Try adjusting your search or category filter.
                </p>
              </div>
            ) : (
              filteredFAQs.map((faq) => {
                const isExpanded = expandedFAQ === faq.id
                return (
                  <div key={faq.id} className={`border-2 rounded-xl overflow-hidden transition-all duration-300 ${
                    isExpanded ? 'border-action/40 shadow-lg' : 'border-primary hover:border-action/30'
                  }`}>
                    <button
                      onClick={() => toggleFAQ(faq.id)}
                      className={`w-full p-6 text-left transition-all duration-200 flex items-center justify-between ${
                        isExpanded ? 'bg-gradient-to-r from-action/10 to-action/5' : 'hover:bg-action/5'
                      }`}
                      data-testid={`faq-question-${faq.id}`}
                    >
                      <div className="flex-1">
                        <h3 className="font-bold text-primary text-lg mb-2">{faq.question}</h3>
                        <span className={`text-sm font-bold px-3 py-1 rounded-lg ${
                          isExpanded ? 'bg-action text-white' : 'bg-action/20 text-action'
                        }`}>{faq.category}</span>
                      </div>
                      <div className={`p-2 rounded-lg transition-all duration-200 ${
                        isExpanded ? 'bg-action text-white' : 'bg-action/10 text-action'
                      }`}>
                        {isExpanded ? (
                          <ChevronDown className="w-5 h-5" />
                        ) : (
                          <ChevronRight className="w-5 h-5" />
                        )}
                      </div>
                    </button>
                    
                    {isExpanded && (
                      <div className="p-6 bg-gradient-to-br from-action/5 to-action/10 border-t border-action/20" data-testid={`faq-answer-${faq.id}`}>
                        <p className="text-secondary leading-relaxed text-lg font-medium">{faq.answer}</p>
                      </div>
                    )}
                  </div>
                )
              })
            )}
          </CardContent>
        </Card>

        {/* Additional Resources */}
        <Card className="card-success shadow-2xl backdrop-blur-xl overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-br from-action/5 via-transparent to-action/5 pointer-events-none"></div>
          <CardHeader className="bg-gradient-to-r from-action/10 to-action/5 relative">
            <CardTitle className="text-primary text-2xl font-bold flex items-center gap-3">
              <div className="p-2 bg-action rounded-xl shadow-lg">
                <Book className="w-6 h-6 text-white" />
              </div>
              Still Need Help?
            </CardTitle>
            <CardDescription className="text-secondary text-lg">
              Additional resources and support options
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 p-8 relative">
            <div className="grid md:grid-cols-2 gap-6">
              <Link href="/contact-support">
                <Button 
                  variant="outline" 
                  className="w-full h-16 border-2 border-action/40 text-action hover:bg-action/10 hover:border-action/60 text-lg font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-[1.02]"
                  data-testid="button-contact-support-bottom"
                >
                  <MessageCircle className="w-6 h-6 mr-3" />
                  Contact Support Team
                </Button>
              </Link>
              
              <Link href="/mission">
                <Button 
                  variant="outline" 
                  className="w-full h-16 border-2 border-wellness/40 text-wellness hover:bg-wellness/10 hover:border-wellness/60 text-lg font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-[1.02]"
                  data-testid="button-mission-bottom"
                >
                  <Book className="w-6 h-6 mr-3" />
                  Learn About Our Mission
                </Button>
              </Link>
            </div>
            
            <div className="bg-gradient-to-r from-action/10 to-action/5 rounded-xl p-4 border border-action/20">
              <p className="text-secondary text-center text-lg font-medium">
                We're here to help! Don't hesitate to reach out if you can't find what you're looking for.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}