import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Badge } from '../components/ui/badge'
import { Heart, Gift, Zap, Brain, TrendingUp, Server, DollarSign, Sparkles, Shield, Users, Clock } from 'lucide-react'

export default function MissionModelPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-4 space-y-8 pb-24">
        {/* Header */}
        <div className="text-center pt-6 space-y-4">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 icon-badge-action rounded-2xl">
              <Heart className="w-8 h-8 text-action" />
            </div>
            <h1 className="text-3xl font-bold text-primary">Our Mission & Model</h1>
          </div>
          <p className="text-lg text-secondary max-w-2xl mx-auto">
            Transparent, user-first fitness tracking. No hidden costs, no data sales, no compromises on your privacy.
          </p>
        </div>

        {/* Section 1: Our Promise - Free Features */}
        <Card className="card-base backdrop-blur-xl shadow-2xl">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-3 icon-badge-success rounded-xl">
                <Shield className="w-6 h-6 text-success" />
              </div>
              <div>
                <CardTitle className="text-primary text-xl">
                  Our Promise: A Powerful, Free Tool for Everyone
                </CardTitle>
                <CardDescription className="text-secondary">
                  Core features that will always remain free and ad-free
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-semibold text-primary flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-action" />
                  Forever Free Core Features
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-4 card-success rounded-lg backdrop-blur-sm shadow-lg">
                    <div className="w-3 h-3 bg-white rounded-full shadow-lg"></div>
                    <span className="text-white font-bold">
                      <strong>Workout Logging</strong> - Track exercises, sets, reps, and RIR
                    </span>
                  </div>
                  <div className="flex items-center gap-3 p-4 card-activity rounded-lg backdrop-blur-sm shadow-lg">
                    <div className="w-3 h-3 bg-white rounded-full shadow-lg"></div>
                    <span className="text-white font-bold">
                      <strong>Nutrition Tracking</strong> - Log meals and monitor calorie intake
                    </span>
                  </div>
                  <div className="flex items-center gap-3 p-4 card-wellness rounded-lg backdrop-blur-sm shadow-lg">
                    <div className="w-3 h-3 bg-white rounded-full shadow-lg"></div>
                    <span className="text-white font-bold">
                      <strong>Progress Analytics</strong> - Charts, trends, and achievement tracking
                    </span>
                  </div>
                  <div className="flex items-center gap-3 p-4 card-warning rounded-lg backdrop-blur-sm shadow-lg">
                    <div className="w-3 h-3 bg-white rounded-full shadow-lg"></div>
                    <span className="text-white font-bold">
                      <strong>Guest Mode</strong> - Full functionality without requiring registration
                    </span>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <h3 className="font-semibold text-primary flex items-center gap-2">
                  <Shield className="w-5 h-5 text-action" />
                  Our Commitments
                </h3>
                <div className="space-y-3">
                  <div className="p-4 card-action rounded-lg backdrop-blur-sm shadow-lg">
                    <p className="text-white font-medium">✓ 100% Ad-Free</p>
                    <p className="text-white/90 text-sm mt-1">
                      No banner ads, video ads, or sponsored content ever
                    </p>
                  </div>
                  <div className="p-4 card-activity rounded-lg backdrop-blur-sm shadow-lg">
                    <p className="text-white font-medium">✓ Your Data, Your Control</p>
                    <p className="text-white/90 text-sm mt-1">
                      We never sell your data or share it with third parties
                    </p>
                  </div>
                  <div className="p-4 card-success rounded-lg backdrop-blur-sm shadow-lg">
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
        <Card className="card-base backdrop-blur-xl shadow-2xl">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-3 icon-badge-warning rounded-xl">
                <Heart className="w-6 h-6 text-warning" />
              </div>
              <div>
                <CardTitle className="text-primary text-xl">
                  Support the Mission: Optional Donations
                </CardTitle>
                <CardDescription className="text-secondary">
                  Help us keep the lights on and develop new free features
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-semibold text-primary flex items-center gap-2">
                  <Server className="w-5 h-5 text-secondary" />
                  Where Your Donations Go
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 card-activity rounded-lg backdrop-blur-sm shadow-lg">
                    <span className="text-white font-bold">Server & Infrastructure</span>
                    <Badge variant="secondary" className="bg-white/20 text-white font-bold backdrop-blur-sm">~60%</Badge>
                  </div>
                  <div className="flex items-center justify-between p-4 card-success rounded-lg backdrop-blur-sm shadow-lg">
                    <span className="text-white font-bold">New Free Feature Development</span>
                    <Badge variant="secondary" className="bg-white/20 text-white font-bold backdrop-blur-sm">~30%</Badge>
                  </div>
                  <div className="flex items-center justify-between p-4 card-wellness rounded-lg backdrop-blur-sm shadow-lg">
                    <span className="text-white font-bold">Platform Maintenance</span>
                    <Badge variant="secondary" className="bg-white/20 text-white font-bold backdrop-blur-sm">~10%</Badge>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <h3 className="font-semibold text-primary flex items-center gap-2">
                  <Gift className="w-5 h-5 text-warning" />
                  Future Vision
                </h3>
                <div className="space-y-3">
                  <div className="p-4 card-action rounded-lg backdrop-blur-sm shadow-lg">
                    <p className="text-white font-bold">🎯 Charity Integration</p>
                    <p className="text-white/90 text-sm mt-1">
                      Option to direct donations to fitness-related charities
                    </p>
                  </div>
                  <div className="p-4 card-warning rounded-lg backdrop-blur-sm shadow-lg">
                    <p className="text-white font-bold">🌟 Community Features</p>
                    <p className="text-white/90 text-sm mt-1">
                      Donation-funded community challenges and features
                    </p>
                  </div>
                </div>
                <div className="text-center">
                  <Button 
                    variant="outline" 
                    className="button-outline-warning transition-all duration-300"
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
        <Card className="card-glass backdrop-blur-xl shadow-2xl border-action/30">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-3 icon-badge-action rounded-xl">
                <Zap className="w-6 h-6 text-action" />
              </div>
              <div>
                <CardTitle className="text-primary text-xl">
                  Unlock Your Potential: PPE Premium (Future)
                </CardTitle>
                <CardDescription className="text-secondary">
                  Advanced AI features - deferred until the app is financially sustainable
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Important Notice */}
            <div className="p-4 card-warning rounded-lg backdrop-blur-sm shadow-lg">
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
              <h3 className="font-semibold text-primary text-center mb-6">
                Premium Features: Cost Transparency & Benefits
              </h3>
              
              <div className="space-y-4">
                {/* AI Coach Feature */}
                <div className="border border-action/50 rounded-lg overflow-hidden card-action backdrop-blur-sm shadow-lg shadow-action/20">
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
                <div className="border border-success/50 rounded-lg overflow-hidden card-success backdrop-blur-sm shadow-lg shadow-success/20">
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
                <div className="border border-wellness/50 rounded-lg overflow-hidden card-wellness backdrop-blur-sm shadow-lg shadow-wellness/20">
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
            <div className="p-6 card-glass rounded-xl border-action/20">
              <h4 className="font-semibold text-primary mb-6 text-center text-lg">Our Pricing Philosophy</h4>
              <div className="grid md:grid-cols-3 gap-6 text-center">
                <div className="space-y-3">
                  <div className="w-16 h-16 icon-badge-action rounded-2xl flex items-center justify-center mx-auto shadow-lg">
                    <Shield className="w-7 h-7 text-action" />
                  </div>
                  <h5 className="font-semibold text-primary text-lg">Transparent Costs</h5>
                  <p className="text-sm text-secondary leading-relaxed">
                    Every premium feature shows exactly why it costs money
                  </p>
                </div>
                <div className="space-y-3">
                  <div className="w-16 h-16 icon-badge-success rounded-2xl flex items-center justify-center mx-auto shadow-lg">
                    <TrendingUp className="w-7 h-7 text-success" />
                  </div>
                  <h5 className="font-semibold text-primary text-lg">Real Value</h5>
                  <p className="text-sm text-secondary leading-relaxed">
                    Premium features provide tangible benefits worth the cost
                  </p>
                </div>
                <div className="space-y-3">
                  <div className="w-16 h-16 icon-badge-action rounded-2xl flex items-center justify-center mx-auto shadow-lg">
                    <Heart className="w-7 h-7 text-action" />
                  </div>
                  <h5 className="font-semibold text-primary text-lg">User-First</h5>
                  <p className="text-sm text-secondary leading-relaxed">
                    Free core features ensure everyone can benefit
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Call to Action */}
        <Card className="card-action backdrop-blur-xl shadow-2xl border-action/30">
          <CardContent className="p-8 text-center space-y-6">
            <div className="space-y-4">
              <div className="w-20 h-20 icon-badge-action rounded-3xl flex items-center justify-center mx-auto shadow-xl">
                <Zap className="w-10 h-10 text-action" />
              </div>
              <h3 className="text-2xl font-bold text-white">
                Start Your Fitness Journey Today
              </h3>
              <p className="text-white/90 max-w-2xl mx-auto text-lg leading-relaxed">
                Get started with our powerful, free tools. Track workouts, monitor nutrition, and see your progress — 
                no registration required with Guest Mode.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button 
                className="button-surface text-action hover:text-action/80 shadow-lg hover:shadow-xl transition-all duration-300"
                onClick={() => window.location.href = '/workouts'}
              >
                <Zap className="w-5 h-5 mr-2" />
                Start Logging Workouts
              </Button>
              <Button 
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10 backdrop-blur-sm transition-all duration-300"
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