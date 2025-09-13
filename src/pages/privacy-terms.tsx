import React, { useState } from 'react'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { ArrowLeft, Shield, FileText, Eye, Lock, UserCheck, Globe, Download } from 'lucide-react'
import { Link } from 'wouter'

const sections = [
  { id: 'privacy', title: 'Privacy Policy', icon: Shield },
  { id: 'terms', title: 'Terms of Service', icon: FileText },
  { id: 'data', title: 'Data Usage', icon: Eye },
  { id: 'security', title: 'Security', icon: Lock },
  { id: 'rights', title: 'Your Rights', icon: UserCheck },
  { id: 'contact', title: 'Contact Info', icon: Globe }
]

export default function PrivacyTermsPage() {
  const [activeSection, setActiveSection] = useState('privacy')

  const renderPrivacyPolicy = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-bold text-white mb-3">Information We Collect</h3>
        <div className="space-y-3 text-slate-300">
          <p>We collect information you provide directly to us, such as:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Account information (name, email, profile photo)</li>
            <li>Fitness data you log (workouts, nutrition, measurements)</li>
            <li>Custom workouts and preferences you create</li>
            <li>Communication with our support team</li>
          </ul>
        </div>
      </div>

      <div>
        <h3 className="text-xl font-bold text-white mb-3">How We Use Your Information</h3>
        <div className="space-y-3 text-slate-300">
          <p>We use the information we collect to:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Provide, maintain, and improve our fitness tracking service</li>
            <li>Personalize your experience and provide recommendations</li>
            <li>Send you technical notices and support messages</li>
            <li>Analyze usage patterns to improve our app</li>
          </ul>
        </div>
      </div>

      <div>
        <h3 className="text-xl font-bold text-white mb-3">Information Sharing</h3>
        <div className="space-y-3 text-slate-300">
          <p><strong>We do not sell your personal data.</strong> We may share your information only in these limited circumstances:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>With your explicit consent</li>
            <li>To comply with legal obligations</li>
            <li>To protect our rights and prevent fraud</li>
            <li>With service providers who help operate our app (under strict contracts)</li>
          </ul>
        </div>
      </div>

      <div>
        <h3 className="text-xl font-bold text-white mb-3">Data Retention</h3>
        <div className="space-y-3 text-slate-300">
          <p>We retain your personal information only as long as necessary for the purposes outlined in this policy, including:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>As long as your account is active</li>
            <li>As needed to provide you services</li>
            <li>As required by law or to resolve disputes</li>
            <li>Until you request deletion (right to be forgotten)</li>
          </ul>
        </div>
      </div>
    </div>
  )

  const renderTermsOfService = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-bold text-white mb-3">Acceptance of Terms</h3>
        <p className="text-slate-300">
          By accessing and using this fitness tracking application, you accept and agree to be bound by the terms and provision of this agreement.
        </p>
      </div>

      <div>
        <h3 className="text-xl font-bold text-white mb-3">Use License</h3>
        <div className="space-y-3 text-slate-300">
          <p>Permission is granted to temporarily use this application for personal, non-commercial transitory viewing only. This includes:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Personal fitness tracking and goal setting</li>
            <li>Creating and managing workout routines</li>
            <li>Logging nutrition and progress data</li>
          </ul>
        </div>
      </div>

      <div>
        <h3 className="text-xl font-bold text-white mb-3">Prohibited Uses</h3>
        <div className="space-y-3 text-slate-300">
          <p>You may not:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Use the app for any unlawful purpose</li>
            <li>Attempt to gain unauthorized access to the app or its systems</li>
            <li>Reverse engineer, decompile, or disassemble the application</li>
            <li>Share your account credentials with others</li>
            <li>Upload malicious code or attempt to harm the service</li>
          </ul>
        </div>
      </div>

      <div>
        <h3 className="text-xl font-bold text-white mb-3">Health and Fitness Disclaimer</h3>
        <div className="p-4 bg-amber-50/10 dark:bg-amber-900/20 rounded-lg border border-amber-200/30 dark:border-amber-800/50">
          <p className="text-amber-200 text-sm">
            <strong>Important:</strong> This app is for informational purposes only and should not be considered medical advice. 
            Always consult with healthcare professionals before starting any fitness or nutrition program.
          </p>
        </div>
      </div>

      <div>
        <h3 className="text-xl font-bold text-white mb-3">Service Availability</h3>
        <p className="text-slate-300">
          We strive to maintain high availability but cannot guarantee uninterrupted service. We reserve the right to modify or discontinue features with reasonable notice.
        </p>
      </div>
    </div>
  )

  const renderDataUsage = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-bold text-white mb-3">Data Collection Principles</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="p-4 bg-green-50/10 dark:bg-green-900/20 rounded-lg border border-green-200/30 dark:border-green-800/50">
            <h4 className="font-semibold text-green-200 mb-2">✓ What We Do</h4>
            <ul className="text-green-300 text-sm space-y-1">
              <li>Collect only necessary data</li>
              <li>Use data to improve your experience</li>
              <li>Encrypt sensitive information</li>
              <li>Allow you to export your data</li>
              <li>Delete data when you request it</li>
            </ul>
          </div>
          
          <div className="p-4 bg-red-50/10 dark:bg-red-900/20 rounded-lg border border-red-200/30 dark:border-red-800/50">
            <h4 className="font-semibold text-red-200 mb-2">✗ What We Don't Do</h4>
            <ul className="text-red-300 text-sm space-y-1">
              <li>Sell your personal data</li>
              <li>Share data without consent</li>
              <li>Track you across other websites</li>
              <li>Use invasive analytics</li>
              <li>Require unnecessary permissions</li>
            </ul>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-xl font-bold text-white mb-3">Data Categories</h3>
        <div className="space-y-4">
          {[
            { 
              name: 'Fitness Data', 
              description: 'Workouts, exercises, sets, reps, and personal records you log',
              retention: 'Until account deletion'
            },
            { 
              name: 'Nutrition Data', 
              description: 'Food logs, calorie tracking, and nutrition goals',
              retention: 'Until account deletion'
            },
            { 
              name: 'Progress Data', 
              description: 'Body measurements, progress photos, and milestone achievements',
              retention: 'Until account deletion'
            },
            { 
              name: 'Account Data', 
              description: 'Email, name, preferences, and app settings',
              retention: '7 days after deletion request'
            }
          ].map((category, index) => (
            <div key={index} className="p-4 bg-slate-700/30 rounded-lg border border-slate-600">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-semibold text-white">{category.name}</h4>
                <span className="text-xs bg-slate-600 text-slate-300 px-2 py-1 rounded">{category.retention}</span>
              </div>
              <p className="text-slate-300 text-sm">{category.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  const renderSecurity = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-bold text-white mb-3">Security Measures</h3>
        <div className="grid md:grid-cols-2 gap-4">
          {[
            {
              title: 'Data Encryption',
              description: 'All data is encrypted in transit and at rest using industry-standard protocols',
              icon: '🔒'
            },
            {
              title: 'Secure Authentication',
              description: 'OAuth 2.0 and secure session management protect your account access',
              icon: '🛡️'
            },
            {
              title: 'Regular Backups',
              description: 'Your data is regularly backed up with encrypted, geographically distributed storage',
              icon: '💾'
            },
            {
              title: 'Privacy by Design',
              description: 'Data minimization and purpose limitation built into our systems',
              icon: '🎯'
            }
          ].map((measure, index) => (
            <div key={index} className="p-4 bg-slate-700/30 rounded-lg border border-slate-600">
              <h4 className="font-semibold text-white mb-2 flex items-center gap-2">
                <span>{measure.icon}</span>
                {measure.title}
              </h4>
              <p className="text-slate-300 text-sm">{measure.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-xl font-bold text-white mb-3">Your Role in Security</h3>
        <div className="space-y-3 text-slate-300">
          <p>Help us keep your data secure by:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Using a strong, unique password for your account</li>
            <li>Keeping your login credentials confidential</li>
            <li>Logging out from shared devices</li>
            <li>Reporting any suspicious activity immediately</li>
            <li>Keeping your device and browser updated</li>
          </ul>
        </div>
      </div>

      <div className="p-4 bg-blue-50/10 dark:bg-blue-900/20 rounded-lg border border-blue-200/30 dark:border-blue-800/50">
        <h4 className="font-semibold text-blue-200 mb-2">Security Incident Response</h4>
        <p className="text-blue-300 text-sm">
          In the unlikely event of a security incident, we will notify affected users within 72 hours 
          and provide detailed information about the incident and remediation steps.
        </p>
      </div>
    </div>
  )

  const renderYourRights = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-bold text-white mb-3">Data Protection Rights</h3>
        <div className="space-y-4">
          {[
            {
              right: 'Right to Access',
              description: 'Request copies of your personal data and information about how we process it',
              action: 'Contact support for a data report'
            },
            {
              right: 'Right to Rectification',
              description: 'Request correction of inaccurate or incomplete personal data',
              action: 'Update in app settings or contact support'
            },
            {
              right: 'Right to Erasure',
              description: 'Request deletion of your personal data (\'right to be forgotten\')',
              action: 'Use account deletion feature'
            },
            {
              right: 'Right to Portability',
              description: 'Receive your data in a structured, machine-readable format',
              action: 'Use data export feature'
            },
            {
              right: 'Right to Object',
              description: 'Object to processing of your personal data for certain purposes',
              action: 'Contact support with your request'
            },
            {
              right: 'Right to Restrict Processing',
              description: 'Request limitation of how we process your personal data',
              action: 'Contact support for processing restrictions'
            }
          ].map((right, index) => (
            <div key={index} className="p-4 bg-slate-700/30 rounded-lg border border-slate-600">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-semibold text-white">{right.right}</h4>
                <span className="text-xs bg-teal-600 text-teal-100 px-2 py-1 rounded">Available</span>
              </div>
              <p className="text-slate-300 text-sm mb-2">{right.description}</p>
              <p className="text-teal-300 text-xs font-medium">How to exercise: {right.action}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="p-4 bg-purple-50/10 dark:bg-purple-900/20 rounded-lg border border-purple-200/30 dark:border-purple-800/50">
        <h4 className="font-semibold text-purple-200 mb-2">Response Time</h4>
        <p className="text-purple-300 text-sm">
          We aim to respond to all data rights requests within 30 days. Complex requests may take longer, 
          but we'll keep you informed of our progress.
        </p>
      </div>
    </div>
  )

  const renderContactInfo = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-bold text-white mb-3">Data Protection Officer</h3>
        <div className="p-4 bg-slate-700/30 rounded-lg border border-slate-600">
          <p className="text-slate-300 mb-2">
            For privacy-related questions, data rights requests, or concerns about our data practices:
          </p>
          <div className="space-y-2 text-slate-300">
            <p><strong>Email:</strong> privacy@fitnessapp.com</p>
            <p><strong>Response Time:</strong> Within 5 business days</p>
            <p><strong>Languages:</strong> English</p>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-xl font-bold text-white mb-3">General Support</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <Link href="/contact-support">
            <div className="p-4 bg-slate-700/30 rounded-lg border border-slate-600 cursor-pointer hover:bg-slate-600/30 transition-all">
              <h4 className="font-semibold text-white mb-2">Support Team</h4>
              <p className="text-slate-300 text-sm mb-3">General questions, technical issues, and account help</p>
              <Button variant="outline" size="sm" className="w-full border-blue-400/50 text-blue-400">
                Contact Support
              </Button>
            </div>
          </Link>

          <Link href="/help-center">
            <div className="p-4 bg-slate-700/30 rounded-lg border border-slate-600 cursor-pointer hover:bg-slate-600/30 transition-all">
              <h4 className="font-semibold text-white mb-2">Help Center</h4>
              <p className="text-slate-300 text-sm mb-3">Self-service resources and frequently asked questions</p>
              <Button variant="outline" size="sm" className="w-full border-green-400/50 text-green-400">
                Visit Help Center
              </Button>
            </div>
          </Link>
        </div>
      </div>

      <div>
        <h3 className="text-xl font-bold text-white mb-3">Regulatory Information</h3>
        <div className="space-y-3 text-slate-300 text-sm">
          <p><strong>Jurisdiction:</strong> This app operates under [Your Jurisdiction] data protection laws</p>
          <p><strong>Supervisory Authority:</strong> [Your Data Protection Authority]</p>
          <p><strong>Last Updated:</strong> September 2025</p>
          <p><strong>Next Review:</strong> March 2026</p>
        </div>
      </div>
    </div>
  )

  const renderContent = () => {
    switch (activeSection) {
      case 'privacy': return renderPrivacyPolicy()
      case 'terms': return renderTermsOfService()
      case 'data': return renderDataUsage()
      case 'security': return renderSecurity()
      case 'rights': return renderYourRights()
      case 'contact': return renderContactInfo()
      default: return renderPrivacyPolicy()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="container mx-auto p-4 space-y-6 pb-24">
        {/* Header */}
        <div className="flex items-center gap-4 pt-8">
          <Link href="/profile">
            <Button variant="ghost" size="sm" className="text-slate-300 hover:text-white" data-testid="button-back">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Settings
            </Button>
          </Link>
        </div>

        <div className="text-center">
          <h1 className="text-3xl font-bold text-white" data-testid="page-title">Privacy & Terms</h1>
          <p className="text-slate-300 mt-2">Your privacy rights and our terms of service</p>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-4">
          <Link href="/data-export">
            <Card className="bg-slate-800/60 border-slate-700/50 backdrop-blur-xl shadow-2xl cursor-pointer hover:bg-slate-700/40 transition-all">
              <CardContent className="p-4 text-center space-y-3">
                <Download className="w-8 h-8 text-blue-400 mx-auto" />
                <div>
                  <h3 className="font-bold text-white">Export Data</h3>
                  <p className="text-slate-300 text-sm">Download your information</p>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/contact-support">
            <Card className="bg-slate-800/60 border-slate-700/50 backdrop-blur-xl shadow-2xl cursor-pointer hover:bg-slate-700/40 transition-all">
              <CardContent className="p-4 text-center space-y-3">
                <Globe className="w-8 h-8 text-green-400 mx-auto" />
                <div>
                  <h3 className="font-bold text-white">Contact Support</h3>
                  <p className="text-slate-300 text-sm">Privacy questions</p>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/delete-account">
            <Card className="bg-slate-800/60 border-slate-700/50 backdrop-blur-xl shadow-2xl cursor-pointer hover:bg-slate-700/40 transition-all">
              <CardContent className="p-4 text-center space-y-3">
                <UserCheck className="w-8 h-8 text-purple-400 mx-auto" />
                <div>
                  <h3 className="font-bold text-white">Delete Account</h3>
                  <p className="text-slate-300 text-sm">Exercise your rights</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Navigation Sidebar */}
          <Card className="lg:col-span-1 bg-slate-800/60 border-slate-700/50 backdrop-blur-xl shadow-2xl">
            <CardHeader>
              <CardTitle className="text-white text-lg font-bold">Sections</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {sections.map((section) => {
                const IconComponent = section.icon
                return (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full p-3 rounded-lg text-left transition-all duration-200 flex items-center gap-3 ${
                      activeSection === section.id
                        ? 'bg-teal-500/20 text-teal-300 border border-teal-500/30'
                        : 'text-slate-300 hover:bg-slate-700/50 hover:text-white'
                    }`}
                    data-testid={`nav-${section.id}`}
                  >
                    <IconComponent className="w-4 h-4" />
                    {section.title}
                  </button>
                )
              })}
            </CardContent>
          </Card>

          {/* Content Area */}
          <Card className="lg:col-span-3 bg-slate-800/60 border-slate-700/50 backdrop-blur-xl shadow-2xl">
            <CardHeader>
              <CardTitle className="text-white text-2xl font-bold">
                {sections.find(s => s.id === activeSection)?.title}
              </CardTitle>
              <CardDescription className="text-slate-300">
                {activeSection === 'privacy' && 'How we collect, use, and protect your personal information'}
                {activeSection === 'terms' && 'Terms and conditions for using our fitness tracking service'}
                {activeSection === 'data' && 'Detailed breakdown of how we handle your data'}
                {activeSection === 'security' && 'Security measures protecting your information'}
                {activeSection === 'rights' && 'Your data protection rights and how to exercise them'}
                {activeSection === 'contact' && 'How to reach us with privacy questions or concerns'}
              </CardDescription>
            </CardHeader>
            <CardContent data-testid={`content-${activeSection}`}>
              {renderContent()}
            </CardContent>
          </Card>
        </div>

        {/* Last Updated Notice */}
        <Card className="bg-slate-800/60 border-slate-700/50 backdrop-blur-xl shadow-2xl">
          <CardContent className="p-4 text-center">
            <p className="text-slate-400 text-sm">
              Last updated: September 13, 2025 | Next review: March 2026 | 
              <Link href="/contact-support" className="text-teal-400 hover:text-teal-300 ml-2">
                Questions? Contact us
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}