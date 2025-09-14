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
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-br from-[var(--color-action)]/20 to-[var(--color-action)]/10 rounded-2xl border border-[var(--color-action)]/20">
              <Heart className="w-8 h-8 text-[var(--color-action)]" />
            </div>
            <h1 className="text-3xl font-bold text-[var(--color-text-primary)]">Our Mission & Model</h1>
          </div>
          <p className="text-lg text-[var(--color-text-secondary)] max-w-2xl mx-auto">
            Transparent, user-first fitness tracking. No hidden costs, no data sales, no compromises on your privacy.
          </p>
        </div>

        {/* Section 1: Our Promise - Free Features */}
        <Card className="bg-gradient-to-br from-[var(--color-surface)] to-[var(--color-surface)]/80 border-[var(--color-border)] backdrop-blur-xl shadow-2xl">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-[var(--color-success)]/20 to-[var(--color-success)]/10 rounded-xl border border-[var(--color-success)]/20">
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
                  <div className="flex items-center gap-3 p-4 bg-gradient-to-br from-[var(--color-success)]/60 to-[var(--color-success)]/70 rounded-lg border border-[var(--color-success)]/50 backdrop-blur-sm shadow-lg shadow-[var(--color-success)]/20">
                    <div className="w-3 h-3 bg-white rounded-full shadow-lg"></div>
                    <span className="text-white font-bold">
                      <strong>Workout Logging</strong> - Track exercises, sets, reps, and RIR
                    </span>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-gradient-to-br from-[var(--color-activity)]/60 to-[var(--color-activity)]/70 rounded-lg border border-[var(--color-activity)]/50 backdrop-blur-sm shadow-lg shadow-[var(--color-activity)]/20">
                    <div className="w-3 h-3 bg-white rounded-full shadow-lg"></div>
                    <span className="text-white font-bold">
                      <strong>Nutrition Tracking</strong> - Log meals and monitor calorie intake
                    </span>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-gradient-to-br from-[var(--color-wellness)]/60 to-[var(--color-wellness)]/70 rounded-lg border border-[var(--color-wellness)]/50 backdrop-blur-sm shadow-lg shadow-[var(--color-wellness)]/20">
                    <div className="w-3 h-3 bg-white rounded-full shadow-lg"></div>
                    <span className="text-white font-bold">
                      <strong>Progress Analytics</strong> - Charts, trends, and achievement tracking
                    </span>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-gradient-to-br from-[var(--color-warning)]/60 to-[var(--color-warning)]/70 rounded-lg border border-[var(--color-warning)]/50 backdrop-blur-sm shadow-lg shadow-[var(--color-warning)]/20">
                    <div className="w-3 h-3 bg-white rounded-full shadow-lg"></div>
                    <span className="text-white font-bold">
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
                  <div className="p-4 bg-gradient-to-br from-[var(--color-action)]/60 to-[var(--color-action)]/70 rounded-lg border border-[var(--color-action)]/50 backdrop-blur-sm shadow-lg shadow-[var(--color-action)]/20">
                    <p className="text-white font-medium">✓ 100% Ad-Free</p>
                    <p className="text-white/90 text-sm mt-1">
                      No banner ads, video ads, or sponsored content ever
                    </p>
                  </div>
                  <div className="p-4 bg-gradient-to-br from-[var(--color-activity)]/60 to-[var(--color-activity)]/70 rounded-lg border border-[var(--color-activity)]/50 backdrop-blur-sm shadow-lg shadow-[var(--color-activity)]/20">
                    <p className="text-white font-medium">✓ Your Data, Your Control</p>
                    <p className="text-white/90 text-sm mt-1">
                      We never sell your data or share it with third parties
                    </p>
                  </div>
                  <div className="p-4 bg-gradient-to-br from-[var(--color-success)]/60 to-[var(--color-success)]/70 rounded-lg border border-[var(--color-success)]/50 backdrop-blur-sm shadow-lg shadow-[var(--color-success)]/20">
                    <p className="text-white font-medium">✓ Core Features Forever</p>
                    <p className="text-white/90 text-sm mt-1">
                      Essential fitness tracking will always be free
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Section 2: Support the Mission */}
        <Card className="bg-gradient-to-br from-[var(--color-surface)] to-[var(--color-surface)]/80 border-[var(--color-border)] backdrop-blur-xl shadow-2xl">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-[var(--color-warning)]/20 to-[var(--color-warning)]/10 rounded-xl border border-[var(--color-warning)]/20">
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
                  <div className="flex items-center justify-between p-4 bg-gradient-to-br from-[var(--color-activity)]/60 to-[var(--color-activity)]/70 rounded-lg border border-[var(--color-activity)]/50 backdrop-blur-sm shadow-lg shadow-[var(--color-activity)]/20">
                    <span className="text-white font-bold">Server & Infrastructure</span>
                    <Badge variant="secondary" className="bg-white/20 text-white font-bold backdrop-blur-sm">~60%</Badge>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gradient-to-br from-[var(--color-success)]/60 to-[var(--color-success)]/70 rounded-lg border border-[var(--color-success)]/50 backdrop-blur-sm shadow-lg shadow-[var(--color-success)]/20">
                    <span className="text-white font-bold">New Free Feature Development</span>
                    <Badge variant="secondary" className="bg-white/20 text-white font-bold backdrop-blur-sm">~30%</Badge>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gradient-to-br from-[var(--color-wellness)]/60 to-[var(--color-wellness)]/70 rounded-lg border border-[var(--color-wellness)]/50 backdrop-blur-sm shadow-lg shadow-[var(--color-wellness)]/20">
                    <span className="text-white font-bold">Platform Maintenance</span>
                    <Badge variant="secondary" className="bg-white/20 text-white font-bold backdrop-blur-sm">~10%</Badge>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <h3 className="font-semibold text-[var(--color-text-primary)] flex items-center gap-2">
                  <Gift className="w-5 h-5 text-[var(--color-warning)]" />
                  Future Vision
                </h3>
                <div className="space-y-3">
                  <div className="p-4 bg-gradient-to-br from-[var(--color-action)]/60 to-[var(--color-action)]/70 rounded-lg border border-[var(--color-action)]/50 backdrop-blur-sm shadow-lg shadow-[var(--color-action)]/20">
                    <p className="text-white font-bold">🎯 Charity Integration</p>
                    <p className="text-white/90 text-sm mt-1">
                      Option to direct donations to fitness-related charities
                    </p>
                  </div>
                  <div className="p-4 bg-gradient-to-br from-[var(--color-warning)]/60 to-[var(--color-warning)]/70 rounded-lg border border-[var(--color-warning)]/50 backdrop-blur-sm shadow-lg shadow-[var(--color-warning)]/20">
                    <p className="text-white font-bold">🌟 Community Features</p>
                    <p className="text-white/90 text-sm mt-1">
                      Donation-funded community challenges and features
                    </p>
                  </div>
                </div>
                <div className="text-center">
                  <Button 
                    variant="outline" 
                    className="bg-gradient-to-r from-[var(--color-warning)]/10 to-[var(--color-warning)]/5 border-[var(--color-warning)]/50 text-[var(--color-warning)] hover:from-[var(--color-warning)]/20 hover:to-[var(--color-warning)]/10 hover:border-[var(--color-warning)] transition-all duration-300"
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
        <Card className="bg-gradient-to-br from-[var(--color-surface)] to-[var(--color-surface)]/80 border-[var(--color-border)] backdrop-blur-xl shadow-2xl">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-[var(--color-action)]/20 to-[var(--color-action)]/10 rounded-xl border border-[var(--color-action)]/20">
                <Zap className="w-6 h-6 text-[var(--color-action)]" />
              </div>
              <div>
                <CardTitle className="text-[var(--color-text-primary)] text-xl">
                  Unlock Your Potential: PPE Premium (Future)
                </CardTitle>
                <CardDescription className="text-[var(--color-text-secondary)]">
                  Advanced AI features - deferred until the app is financially sustainable
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Important Notice */}
            <div className="p-4 bg-gradient-to-br from-[var(--color-warning)]/60 to-[var(--color-warning)]/70 rounded-lg border border-[var(--color-warning)]/50 backdrop-blur-sm shadow-lg shadow-[var(--color-warning)]/20">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-5 h-5 text-white" />
                <p className="font-bold text-white">Development Status</p>
              </div>
              <p className="text-white/90 text-sm">
                These premium features are <strong>currently deferred</strong> while we focus on building a strong user base 
                with our free core features. Premium development will begin once the platform is financially sustainable.
              </p>
            </div>

            {/* Premium Features Comparison Table */}
            <div className="space-y-4">
              <h3 className="font-semibold text-[var(--color-text-primary)] text-center mb-6">
                Premium Features: Cost Transparency & Benefits
              </h3>
              
              <div className="space-y-4">
                {/* AI Coach Feature */}
                <div className="border border-[var(--color-action)]/50 rounded-lg overflow-hidden bg-gradient-to-br from-[var(--color-action)]/60 to-[var(--color-action)]/70 backdrop-blur-sm shadow-lg shadow-[var(--color-action)]/20">
                  <div className="bg-gradient-to-br from-white/20 to-white/10 p-4 border-b border-white/20">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Brain className="w-6 h-6 text-white" />
                        <h4 className="font-bold text-white">AI Personal Coach</h4>
                      </div>
                      <Badge variant="outline" className="border-white/30 text-white bg-white/20 font-bold">
                        ~$5-8/month
                      </Badge>
                    </div>
                  </div>
                  <div className="p-4 grid md:grid-cols-2 gap-4">
                    <div>
                      <h5 className="font-bold text-white mb-2 flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-white" />
                        Why It Costs Money
                      </h5>
                      <ul className="text-sm text-white/90 space-y-1">
                        <li>• Advanced AI processing ($3-4/month per user)</li>
                        <li>• Real-time workout analysis and feedback</li>
                        <li>• Personalized nutrition recommendations</li>
                        <li>• Continuous model training and updates</li>
                      </ul>
                    </div>
                    <div>
                      <h5 className="font-bold text-white mb-2 flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-white" />
                        What You Get
                      </h5>
                      <ul className="text-sm text-white/90 space-y-1">
                        <li>• Personalized workout adjustments based on performance</li>
                        <li>• Smart form correction and technique tips</li>
                        <li>• Adaptive meal planning with macro optimization</li>
                        <li>• Real-time coaching during workouts</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Smart Recovery Score */}
                <div className="border border-[var(--color-success)]/50 rounded-lg overflow-hidden bg-gradient-to-br from-[var(--color-success)]/60 to-[var(--color-success)]/70 backdrop-blur-sm shadow-lg shadow-[var(--color-success)]/20">
                  <div className="bg-gradient-to-br from-white/20 to-white/10 p-4 border-b border-white/20">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <TrendingUp className="w-6 h-6 text-white" />
                        <h4 className="font-bold text-white">Smart Recovery Score</h4>
                      </div>
                      <Badge variant="outline" className="border-white/30 text-white bg-white/20 font-bold">
                        ~$3-5/month
                      </Badge>
                    </div>
                  </div>
                  <div className="p-4 grid md:grid-cols-2 gap-4">
                    <div>
                      <h5 className="font-bold text-white mb-2 flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-white" />
                        Why It Costs Money
                      </h5>
                      <ul className="text-sm text-white/90 space-y-1">
                        <li>• Health data aggregation APIs ($2-3/month)</li>
                        <li>• Complex algorithmic processing</li>
                        <li>• Sleep and HRV analysis servers</li>
                        <li>• Real-time health monitoring infrastructure</li>
                      </ul>
                    </div>
                    <div>
                      <h5 className="font-bold text-white mb-2 flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-white" />
                        What You Get
                      </h5>
                      <ul className="text-sm text-white/90 space-y-1">
                        <li>• Daily recovery score based on sleep & HRV data</li>
                        <li>• Workout intensity recommendations</li>
                        <li>• Optimal training and rest day planning</li>
                        <li>• Integration with health platforms (Apple Health, etc.)</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Health Data Integration */}
                <div className="border border-[var(--color-wellness)]/50 rounded-lg overflow-hidden bg-gradient-to-br from-[var(--color-wellness)]/60 to-[var(--color-wellness)]/70 backdrop-blur-sm shadow-lg shadow-[var(--color-wellness)]/20">
                  <div className="bg-gradient-to-br from-white/20 to-white/10 p-4 border-b border-white/20">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Users className="w-6 h-6 text-white" />
                        <h4 className="font-bold text-white">Health Platform Integration</h4>
                      </div>
                      <Badge variant="outline" className="border-white/30 text-white bg-white/20 font-bold">
                        ~$2-4/month
                      </Badge>
                    </div>
                  </div>
                  <div className="p-4 grid md:grid-cols-2 gap-4">
                    <div>
                      <h5 className="font-bold text-white mb-2 flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-white" />
                        Why It Costs Money
                      </h5>
                      <ul className="text-sm text-white/90 space-y-1">
                        <li>• Third-party health API subscriptions ($1-2/month)</li>
                        <li>• Data processing and synchronization</li>
                        <li>• Secure health data storage and compliance</li>
                        <li>• Multiple platform integration maintenance</li>
                      </ul>
                    </div>
                    <div>
                      <h5 className="font-bold text-white mb-2 flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-white" />
                        What You Get
                      </h5>
                      <ul className="text-sm text-white/90 space-y-1">
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
            <div className="p-4 bg-gradient-to-br from-[var(--color-surface)]/80 to-[var(--color-surface)]/60 rounded-lg border border-[var(--color-border)]">
              <h4 className="font-semibold text-[var(--color-text-primary)] mb-3 text-center">Our Pricing Philosophy</h4>
              <div className="grid md:grid-cols-3 gap-4 text-center">
                <div className="space-y-2">
                  <div className="w-12 h-12 bg-gradient-to-br from-[var(--color-action)]/20 to-[var(--color-action)]/10 rounded-lg flex items-center justify-center mx-auto border border-[var(--color-action)]/20">
                    <Shield className="w-6 h-6 text-[var(--color-action)]" />
                  </div>
                  <h5 className="font-medium text-[var(--color-text-primary)]">Transparent Costs</h5>
                  <p className="text-sm text-[var(--color-text-secondary)]">
                    Every premium feature shows exactly why it costs money
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="w-12 h-12 bg-gradient-to-br from-[var(--color-success)]/20 to-[var(--color-success)]/10 rounded-lg flex items-center justify-center mx-auto border border-[var(--color-success)]/20">
                    <TrendingUp className="w-6 h-6 text-[var(--color-success)]" />
                  </div>
                  <h5 className="font-medium text-[var(--color-text-primary)]">Real Value</h5>
                  <p className="text-sm text-[var(--color-text-secondary)]">
                    Premium features provide tangible benefits worth the cost
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="w-12 h-12 bg-gradient-to-br from-[var(--color-action)]/20 to-[var(--color-action)]/10 rounded-lg flex items-center justify-center mx-auto border border-[var(--color-action)]/20">
                    <Heart className="w-6 h-6 text-[var(--color-action)]" />
                  </div>
                  <h5 className="font-medium text-[var(--color-text-primary)]">User-First</h5>
                  <p className="text-sm text-[var(--color-text-secondary)]">
                    Free core features ensure everyone can benefit
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Call to Action */}
        <Card className="bg-gradient-to-r from-[var(--color-action)]/15 to-[var(--color-action)]/5 border-[var(--color-action)]/30 shadow-2xl">
          <CardContent className="p-6 text-center space-y-4">
            <h3 className="text-xl font-semibold text-[var(--color-text-primary)]">
              Start Your Fitness Journey Today
            </h3>
            <p className="text-[var(--color-text-secondary)] max-w-2xl mx-auto">
              Get started with our powerful, free tools. Track workouts, monitor nutrition, and see your progress — 
              no registration required with Guest Mode.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button 
                className="bg-gradient-to-r from-[var(--color-action)] to-[var(--color-action)]/90 hover:from-[var(--color-action)]/90 hover:to-[var(--color-action)]/80 text-[var(--color-action-text)] shadow-lg hover:shadow-xl transition-all duration-300"
                onClick={() => window.location.href = '/workouts'}
              >
                <Zap className="w-4 h-4 mr-2" />
                Start Logging Workouts
              </Button>
              <Button 
                variant="outline"
                className="bg-gradient-to-r from-[var(--color-surface)]/50 to-[var(--color-surface)]/30 border-[var(--color-border)] text-[var(--color-text-secondary)] hover:from-[var(--color-surface)]/70 hover:to-[var(--color-surface)]/50 hover:text-[var(--color-text-primary)] transition-all duration-300"
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