import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Badge } from '../components/ui/badge'
import { Heart, Gift, Zap, Brain, TrendingUp, Server, DollarSign, Sparkles, Shield, Users, Clock } from 'lucide-react'

export default function MissionModelPage() {
  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      <div className="container mx-auto p-4 space-y-8 pb-24">
        {/* Header */}
        <div className="text-center pt-6 space-y-4">
          <h1 className="text-3xl font-bold text-[var(--color-text-primary)]">Our Mission & Model</h1>
          <p className="text-lg text-[var(--color-text-secondary)] max-w-2xl mx-auto">
            Transparent, user-first fitness tracking. No hidden costs, no data sales, no compromises on your privacy.
          </p>
        </div>

        {/* Section 1: Our Promise - Free Features */}
        <Card className="bg-[var(--color-surface)] border-[var(--color-border)] backdrop-blur-xl">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[var(--color-success)]/20 rounded-lg">
                <Shield className="w-6 h-6 text-[var(--color-success)]" />
              </div>
              <div>
                <CardTitle className="text-[var(--color-text-primary)] text-xl">
                  Our Promise: A Powerful, Free Tool for Everyone
                </CardTitle>
                <CardDescription className="text-[var(--color-text-secondary)]">
                  Core features that will always remain free and ad-free
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-semibold text-[var(--color-text-primary)] flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-[var(--color-action)]" />
                  Forever Free Core Features
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-[var(--color-surface)]/60 rounded-lg">
                    <div className="w-2 h-2 bg-[var(--color-success)] rounded-full"></div>
                    <span className="text-[var(--color-text-primary)]">
                      <strong>Workout Logging</strong> - Track exercises, sets, reps, and RIR
                    </span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-[var(--color-surface)]/60 rounded-lg">
                    <div className="w-2 h-2 bg-[var(--color-success)] rounded-full"></div>
                    <span className="text-[var(--color-text-primary)]">
                      <strong>Nutrition Tracking</strong> - Log meals and monitor calorie intake
                    </span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-[var(--color-surface)]/60 rounded-lg">
                    <div className="w-2 h-2 bg-[var(--color-success)] rounded-full"></div>
                    <span className="text-[var(--color-text-primary)]">
                      <strong>Progress Analytics</strong> - Charts, trends, and achievement tracking
                    </span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-[var(--color-surface)]/60 rounded-lg">
                    <div className="w-2 h-2 bg-[var(--color-success)] rounded-full"></div>
                    <span className="text-[var(--color-text-primary)]">
                      <strong>Guest Mode</strong> - Full functionality without requiring registration
                    </span>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <h3 className="font-semibold text-[var(--color-text-primary)] flex items-center gap-2">
                  <Shield className="w-5 h-5 text-[var(--color-action)]" />
                  Our Commitments
                </h3>
                <div className="space-y-3">
                  <div className="p-4 bg-[var(--color-action)]/10 rounded-lg border border-[var(--color-action)]/30">
                    <p className="text-[var(--color-action)] font-medium">✓ 100% Ad-Free</p>
                    <p className="text-[var(--color-action)]/80 text-sm mt-1">
                      No banner ads, video ads, or sponsored content ever
                    </p>
                  </div>
                  <div className="p-4 bg-[var(--color-action)]/10 rounded-lg border border-[var(--color-action)]/30">
                    <p className="text-[var(--color-action)] font-medium">✓ Your Data, Your Control</p>
                    <p className="text-[var(--color-action)]/80 text-sm mt-1">
                      We never sell your data or share it with third parties
                    </p>
                  </div>
                  <div className="p-4 bg-[var(--color-success)]/20 rounded-lg border border-[var(--color-success)]/50">
                    <p className="text-[var(--color-success)] font-medium">✓ Core Features Forever</p>
                    <p className="text-[var(--color-success)] text-sm mt-1">
                      Essential fitness tracking will always be free
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Section 2: Support the Mission */}
        <Card className="bg-[var(--color-surface)] border-[var(--color-border)] backdrop-blur-xl">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[var(--color-warning)]/20 rounded-lg">
                <Heart className="w-6 h-6 text-[var(--color-warning)]" />
              </div>
              <div>
                <CardTitle className="text-[var(--color-text-primary)] text-xl">
                  Support the Mission: Optional Donations
                </CardTitle>
                <CardDescription className="text-[var(--color-text-secondary)]">
                  Help us keep the lights on and develop new free features
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-semibold text-[var(--color-text-primary)] flex items-center gap-2">
                  <Server className="w-5 h-5 text-[var(--color-text-secondary)]" />
                  Where Your Donations Go
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-[var(--color-surface)]/60 rounded-lg">
                    <span className="text-[var(--color-text-primary)]">Server & Infrastructure</span>
                    <Badge variant="secondary" className="bg-[var(--color-surface)] text-[var(--color-text-secondary)]">~60%</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-[var(--color-surface)]/60 rounded-lg">
                    <span className="text-[var(--color-text-primary)]">New Free Feature Development</span>
                    <Badge variant="secondary" className="bg-[var(--color-surface)] text-[var(--color-text-secondary)]">~30%</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-[var(--color-surface)]/60 rounded-lg">
                    <span className="text-[var(--color-text-primary)]">Platform Maintenance</span>
                    <Badge variant="secondary" className="bg-[var(--color-surface)] text-[var(--color-text-secondary)]">~10%</Badge>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <h3 className="font-semibold text-[var(--color-text-primary)] flex items-center gap-2">
                  <Gift className="w-5 h-5 text-[var(--color-warning)]" />
                  Future Vision
                </h3>
                <div className="space-y-3">
                  <div className="p-4 bg-[var(--color-action)]/20 rounded-lg border border-[var(--color-action)]/50">
                    <p className="text-[var(--color-action)] font-medium">🎯 Charity Integration</p>
                    <p className="text-[var(--color-action)] text-sm mt-1">
                      Option to direct donations to fitness-related charities
                    </p>
                  </div>
                  <div className="p-4 bg-[var(--color-warning)]/20 rounded-lg border border-[var(--color-warning)]/50">
                    <p className="text-[var(--color-warning)] font-medium">🌟 Community Features</p>
                    <p className="text-[var(--color-warning)] text-sm mt-1">
                      Donation-funded community challenges and features
                    </p>
                  </div>
                </div>
                <div className="text-center">
                  <Button 
                    variant="outline" 
                    className="border-[var(--color-warning)]/50 text-[var(--color-warning)] hover:bg-[var(--color-warning)]/10"
                    disabled
                  >
                    <Heart className="w-4 h-4 mr-2" />
                    Donate (Coming Soon)
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Section 3: PPE Premium Future */}
        <Card className="bg-white/70 dark:bg-slate-800/80 border-slate-200/50 dark:border-slate-700/50 backdrop-blur-xl">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 dark:bg-primary/20 rounded-lg">
                <Zap className="w-6 h-6 text-primary" />
              </div>
              <div>
                <CardTitle className="text-slate-900 dark:text-white text-xl">
                  Unlock Your Potential: PPE Premium (Future)
                </CardTitle>
                <CardDescription className="text-slate-600 dark:text-slate-300">
                  Advanced AI features - deferred until the app is financially sustainable
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Important Notice */}
            <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                <p className="font-medium text-yellow-800 dark:text-yellow-200">Development Status</p>
              </div>
              <p className="text-yellow-700 dark:text-yellow-300 text-sm">
                These premium features are <strong>currently deferred</strong> while we focus on building a strong user base 
                with our free core features. Premium development will begin once the platform is financially sustainable.
              </p>
            </div>

            {/* Premium Features Comparison Table */}
            <div className="space-y-4">
              <h3 className="font-semibold text-slate-900 dark:text-white text-center mb-6">
                Premium Features: Cost Transparency & Benefits
              </h3>
              
              <div className="space-y-4">
                {/* AI Coach Feature */}
                <div className="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden">
                  <div className="bg-slate-50 dark:bg-slate-800 p-4 border-b border-slate-200 dark:border-slate-700">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Brain className="w-6 h-6 text-primary" />
                        <h4 className="font-semibold text-slate-900 dark:text-white">AI Personal Coach</h4>
                      </div>
                      <Badge variant="outline" className="border-primary/30 text-primary">
                        ~$5-8/month
                      </Badge>
                    </div>
                  </div>
                  <div className="p-4 grid md:grid-cols-2 gap-4">
                    <div>
                      <h5 className="font-medium text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-red-600 dark:text-red-400" />
                        Why It Costs Money
                      </h5>
                      <ul className="text-sm text-slate-600 dark:text-slate-300 space-y-1">
                        <li>• Advanced AI processing ($3-4/month per user)</li>
                        <li>• Real-time workout analysis and feedback</li>
                        <li>• Personalized nutrition recommendations</li>
                        <li>• Continuous model training and updates</li>
                      </ul>
                    </div>
                    <div>
                      <h5 className="font-medium text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-green-600 dark:text-green-400" />
                        What You Get
                      </h5>
                      <ul className="text-sm text-slate-600 dark:text-slate-300 space-y-1">
                        <li>• Personalized workout adjustments based on performance</li>
                        <li>• Smart form correction and technique tips</li>
                        <li>• Adaptive meal planning with macro optimization</li>
                        <li>• Real-time coaching during workouts</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Smart Recovery Score */}
                <div className="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden">
                  <div className="bg-slate-50 dark:bg-slate-800 p-4 border-b border-slate-200 dark:border-slate-700">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <TrendingUp className="w-6 h-6 text-primary" />
                        <h4 className="font-semibold text-slate-900 dark:text-white">Smart Recovery Score</h4>
                      </div>
                      <Badge variant="outline" className="border-primary/30 text-primary">
                        ~$3-5/month
                      </Badge>
                    </div>
                  </div>
                  <div className="p-4 grid md:grid-cols-2 gap-4">
                    <div>
                      <h5 className="font-medium text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-red-600 dark:text-red-400" />
                        Why It Costs Money
                      </h5>
                      <ul className="text-sm text-slate-600 dark:text-slate-300 space-y-1">
                        <li>• Health data aggregation APIs ($2-3/month)</li>
                        <li>• Complex algorithmic processing</li>
                        <li>• Sleep and HRV analysis servers</li>
                        <li>• Real-time health monitoring infrastructure</li>
                      </ul>
                    </div>
                    <div>
                      <h5 className="font-medium text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-green-600 dark:text-green-400" />
                        What You Get
                      </h5>
                      <ul className="text-sm text-slate-600 dark:text-slate-300 space-y-1">
                        <li>• Daily recovery score based on sleep & HRV data</li>
                        <li>• Workout intensity recommendations</li>
                        <li>• Optimal training and rest day planning</li>
                        <li>• Integration with health platforms (Apple Health, etc.)</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Health Data Integration */}
                <div className="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden">
                  <div className="bg-slate-50 dark:bg-slate-800 p-4 border-b border-slate-200 dark:border-slate-700">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Users className="w-6 h-6 text-green-600 dark:text-green-400" />
                        <h4 className="font-semibold text-slate-900 dark:text-white">Health Platform Integration</h4>
                      </div>
                      <Badge variant="outline" className="border-green-300 text-green-700 dark:border-green-600 dark:text-green-400">
                        ~$2-4/month
                      </Badge>
                    </div>
                  </div>
                  <div className="p-4 grid md:grid-cols-2 gap-4">
                    <div>
                      <h5 className="font-medium text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-red-600 dark:text-red-400" />
                        Why It Costs Money
                      </h5>
                      <ul className="text-sm text-slate-600 dark:text-slate-300 space-y-1">
                        <li>• Third-party health API subscriptions ($1-2/month)</li>
                        <li>• Data processing and synchronization</li>
                        <li>• Secure health data storage and compliance</li>
                        <li>• Multiple platform integration maintenance</li>
                      </ul>
                    </div>
                    <div>
                      <h5 className="font-medium text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-green-600 dark:text-green-400" />
                        What You Get
                      </h5>
                      <ul className="text-sm text-slate-600 dark:text-slate-300 space-y-1">
                        <li>• Automatic sync with Apple Health & Google Health Connect</li>
                        <li>• Wearable device integration (Fitbit, Garmin, Oura)</li>
                        <li>• Comprehensive health data analysis</li>
                        <li>• Holistic wellness insights and trends</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Pricing Philosophy */}
            <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
              <h4 className="font-semibold text-slate-900 dark:text-white mb-3 text-center">Our Pricing Philosophy</h4>
              <div className="grid md:grid-cols-3 gap-4 text-center">
                <div className="space-y-2">
                  <div className="w-12 h-12 bg-primary/10 dark:bg-primary/20 rounded-lg flex items-center justify-center mx-auto">
                    <Shield className="w-6 h-6 text-primary" />
                  </div>
                  <h5 className="font-medium text-slate-900 dark:text-white">Transparent Costs</h5>
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    Every premium feature shows exactly why it costs money
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center mx-auto">
                    <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                  <h5 className="font-medium text-slate-900 dark:text-white">Real Value</h5>
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    Premium features provide tangible benefits worth the cost
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="w-12 h-12 bg-primary/10 dark:bg-primary/20 rounded-lg flex items-center justify-center mx-auto">
                    <Heart className="w-6 h-6 text-primary" />
                  </div>
                  <h5 className="font-medium text-slate-900 dark:text-white">User-First</h5>
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    Free core features ensure everyone can benefit
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Call to Action */}
        <Card className="bg-gradient-to-r from-primary/10 to-primary/20 dark:from-primary/20 dark:to-primary/30 border-primary/20 dark:border-primary/30">
          <CardContent className="p-6 text-center space-y-4">
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
              Start Your Fitness Journey Today
            </h3>
            <p className="text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              Get started with our powerful, free tools. Track workouts, monitor nutrition, and see your progress — 
              no registration required with Guest Mode.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button 
                className="bg-slate-700 dark:bg-slate-600 hover:bg-slate-600 dark:hover:bg-slate-500 text-white border-2 border-primary/50 hover:border-primary hover:ring-4 hover:ring-primary/20"
                onClick={() => window.location.href = '/workouts'}
              >
                <Zap className="w-4 h-4 mr-2" />
                Start Logging Workouts
              </Button>
              <Button 
                variant="outline"
                className="border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                onClick={() => window.location.href = '/nutrition'}
              >
                Track Your Nutrition
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}