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
        <h3 className="text-xl font-bold mb-3" style={{ color: 'var(--color-text-on-action)' }}>Information We Collect</h3>
        <div className="space-y-3" style={{ color: 'var(--color-text-secondary-on-action)' }}>
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
        <h3 className="text-xl font-bold mb-3" style={{ color: 'var(--color-text-on-action)' }}>How We Use Your Information</h3>
        <div className="space-y-3" style={{ color: 'var(--color-text-secondary-on-action)' }}>
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
        <h3 className="text-xl font-bold mb-3" style={{ color: 'var(--color-text-on-action)' }}>Information Sharing</h3>
        <div className="space-y-3" style={{ color: 'var(--color-text-secondary-on-action)' }}>
          <p><strong style={{ color: 'var(--color-text-on-action)' }}>We do not sell your personal data.</strong> We may share your information only in these limited circumstances:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>With your explicit consent</li>
            <li>To comply with legal obligations</li>
            <li>To protect our rights and prevent fraud</li>
            <li>With service providers who help operate our app (under strict contracts)</li>
          </ul>
        </div>
      </div>

      <div>
        <h3 className="text-xl font-bold mb-3" style={{ color: 'var(--color-text-on-action)' }}>Data Retention</h3>
        <div className="space-y-3" style={{ color: 'var(--color-text-secondary-on-action)' }}>
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
        <h3 className="text-xl font-bold mb-3" style={{ color: 'var(--color-text-on-action)' }}>Acceptance of Terms</h3>
        <p style={{ color: 'var(--color-text-secondary-on-info)' }}>
          By accessing and using this fitness tracking application, you accept and agree to be bound by the terms and provision of this agreement.
        </p>
      </div>

      <div>
        <h3 className="text-xl font-bold mb-3" style={{ color: 'var(--color-text-on-action)' }}>Use License</h3>
        <div className="space-y-3" style={{ color: 'var(--color-text-secondary-on-action)' }}>
          <p>Permission is granted to temporarily use this application for personal, non-commercial transitory viewing only. This includes:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Personal fitness tracking and goal setting</li>
            <li>Creating and managing workout routines</li>
            <li>Logging nutrition and progress data</li>
          </ul>
        </div>
      </div>

      <div>
        <h3 className="text-xl font-bold text-primary mb-3">Prohibited Uses</h3>
        <div className="space-y-3 text-secondary">
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
        <h3 className="text-xl font-bold mb-3" style={{ color: 'var(--color-text-on-action)' }}>Health and Fitness Disclaimer</h3>
        <div className="p-4 bg-white/10 rounded-lg border border-white/30">
          <p className="text-sm" style={{ color: 'var(--color-text-on-action)' }}>
            <strong>Important:</strong> This app is for informational purposes only and should not be considered medical advice. 
            Always consult with healthcare professionals before starting any fitness or nutrition program.
          </p>
        </div>
      </div>

      <div>
        <h3 className="text-xl font-bold mb-3" style={{ color: 'var(--color-text-on-action)' }}>Service Availability</h3>
        <p style={{ color: 'var(--color-text-secondary-on-info)' }}>
          We strive to maintain high availability but cannot guarantee uninterrupted service. We reserve the right to modify or discontinue features with reasonable notice.
        </p>
      </div>
    </div>
  )

  const renderDataUsage = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-bold mb-3" style={{ color: 'var(--color-text-on-action)' }}>Data Collection Principles</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="p-4 bg-white/10 rounded-lg border border-white/30">
            <h4 className="font-semibold mb-2" style={{ color: 'var(--color-text-on-wellness)' }}>✓ What We Do</h4>
            <ul className="text-sm space-y-1" style={{ color: 'var(--color-text-secondary-on-wellness)' }}>
              <li>Collect only necessary data</li>
              <li>Use data to improve your experience</li>
              <li>Encrypt sensitive information</li>
              <li>Allow you to export your data</li>
              <li>Delete data when you request it</li>
            </ul>
          </div>
          
          <div className="p-4 bg-white/10 rounded-lg border border-white/30">
            <h4 className="font-semibold mb-2" style={{ color: 'var(--color-text-on-wellness)' }}>✗ What We Don't Do</h4>
            <ul className="text-sm space-y-1" style={{ color: 'var(--color-text-secondary-on-wellness)' }}>
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
        <h3 className="text-xl font-bold mb-3" style={{ color: 'var(--color-text-on-action)' }}>Data Categories</h3>
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
            <div key={index} className="p-4 bg-white/10 rounded-lg border border-white/30">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-semibold" style={{ color: 'var(--color-text-on-wellness)' }}>{category.name}</h4>
                <span className="text-xs px-2 py-1 rounded" style={{ backgroundColor: 'rgba(255,255,255,0.2)', color: 'var(--color-text-on-wellness)' }}>{category.retention}</span>
              </div>
              <p className="text-sm" style={{ color: 'var(--color-text-secondary-on-wellness)' }}>{category.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  const renderSecurity = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-bold text-primary mb-3">Security Measures</h3>
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
            <div key={index} className="p-4 bg-surface/60 rounded-lg border border-primary">
              <h4 className="font-semibold text-primary mb-2 flex items-center gap-2">
                <span>{measure.icon}</span>
                {measure.title}
              </h4>
              <p className="text-secondary text-sm">{measure.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-xl font-bold text-primary mb-3">Your Role in Security</h3>
        <div className="space-y-3 text-secondary">
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

      <div className="p-4 bg-action/10 rounded-lg border border-action/30">
        <h4 className="font-semibold text-action mb-2">Security Incident Response</h4>
        <p className="text-action/80 text-sm">
          In the unlikely event of a security incident, we will notify affected users within 72 hours 
          and provide detailed information about the incident and remediation steps.
        </p>
      </div>
    </div>
  )

  const renderYourRights = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-bold text-primary mb-3">Data Protection Rights</h3>
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
            <div key={index} className="p-4 bg-surface/60 rounded-lg border border-primary">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-semibold text-primary">{right.right}</h4>
                <span className="text-xs bg-action text-action-text px-2 py-1 rounded">Available</span>
              </div>
              <p className="text-secondary text-sm mb-2">{right.description}</p>
              <p className="text-action/80 text-xs font-medium">How to exercise: {right.action}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="p-4 bg-action/10 rounded-lg border border-action/30">
        <h4 className="font-semibold text-action mb-2">Response Time</h4>
        <p className="text-action/80 text-sm">
          We aim to respond to all data rights requests within 30 days. Complex requests may take longer, 
          but we'll keep you informed of our progress.
        </p>
      </div>
    </div>
  )

  const renderContactInfo = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-bold text-primary mb-3">Data Protection Officer</h3>
        <div className="p-4 bg-surface/60 rounded-lg border border-primary">
          <p className="text-secondary mb-2">
            For privacy-related questions, data rights requests, or concerns about our data practices:
          </p>
          <div className="space-y-2 text-secondary">
            <p><strong>Email:</strong> privacy@fitnessapp.com</p>
            <p><strong>Response Time:</strong> Within 5 business days</p>
            <p><strong>Languages:</strong> English</p>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-xl font-bold text-primary mb-3">General Support</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <Link href="/contact-support">
            <div className="p-4 bg-surface/60 rounded-lg border border-primary cursor-pointer hover:bg-surface/80 transition-all">
              <h4 className="font-semibold text-primary mb-2">Support Team</h4>
              <p className="text-secondary text-sm mb-3">General questions, technical issues, and account help</p>
              <Button variant="outline" size="sm" className="w-full border-action/50 text-action">
                Contact Support
              </Button>
            </div>
          </Link>

          <Link href="/help-center">
            <div className="p-4 bg-surface/60 rounded-lg border border-primary cursor-pointer hover:bg-surface/80 transition-all">
              <h4 className="font-semibold text-primary mb-2">Help Center</h4>
              <p className="text-secondary text-sm mb-3">Self-service resources and frequently asked questions</p>
              <Button variant="outline" size="sm" className="w-full border-action/50 text-action">
                Visit Help Center
              </Button>
            </div>
          </Link>
        </div>
      </div>

      <div>
        <h3 className="text-xl font-bold text-primary mb-3">Regulatory Information</h3>
        <div className="space-y-3 text-secondary text-sm">
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
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-4 space-y-6 pb-24">
        {/* Header */}
        <div className="flex items-center gap-4 pt-8">
          <Link href="/profile">
            <Button variant="ghost" size="sm" className="text-secondary hover:text-primary" data-testid="button-back">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Settings
            </Button>
          </Link>
        </div>

        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-4 icon-badge-action rounded-2xl">
              <Shield className="w-8 h-8 text-action" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-primary" data-testid="page-title">Privacy & Terms</h1>
          <p className="text-secondary mt-2">Your privacy rights and our terms of service</p>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-4">
          <Link href="/data-export">
            <Card className="card-info backdrop-blur-xl shadow-2xl cursor-pointer hover:bg-info/20 transition-all">
              <CardContent className="p-4 text-center space-y-3">
                <div className="w-12 h-12 icon-badge-info rounded-xl flex items-center justify-center mx-auto">
                  <Download className="w-6 h-6 text-info" />
                </div>
                <div>
                  <h3 className="font-bold" style={{ color: 'var(--color-text-on-info)' }}>Export Data</h3>
                  <p className="text-sm" style={{ color: 'var(--color-text-secondary-on-info)' }}>Download your information</p>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/contact-support">
            <Card className="card-success backdrop-blur-xl shadow-2xl cursor-pointer hover:bg-success/20 transition-all">
              <CardContent className="p-4 text-center space-y-3">
                <div className="w-12 h-12 icon-badge-success rounded-xl flex items-center justify-center mx-auto">
                  <Globe className="w-6 h-6 text-success" />
                </div>
                <div>
                  <h3 className="font-bold" style={{ color: 'var(--color-text-on-success)' }}>Contact Support</h3>
                  <p className="text-sm" style={{ color: 'var(--color-text-secondary-on-success)' }}>Privacy questions</p>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/delete-account">
            <Card className="card-warning backdrop-blur-xl shadow-2xl cursor-pointer hover:bg-warning/20 transition-all">
              <CardContent className="p-4 text-center space-y-3">
                <div className="w-12 h-12 icon-badge-warning rounded-xl flex items-center justify-center mx-auto">
                  <UserCheck className="w-6 h-6 text-warning" />
                </div>
                <div>
                  <h3 className="font-bold text-white">Delete Account</h3>
                  <p className="text-white/90 text-sm">Exercise your rights</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Navigation Sidebar */}
          <Card className="lg:col-span-1 card-glass backdrop-blur-xl shadow-2xl border-action/20">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 icon-badge-action rounded-lg">
                  <Shield className="w-5 h-5 text-action" />
                </div>
                <CardTitle className="text-primary text-lg font-bold">Sections</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              {sections.map((section) => {
                const IconComponent = section.icon
                return (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full p-3 rounded-xl text-left transition-all duration-200 flex items-center gap-3 ${
                      activeSection === section.id
                        ? 'bg-action/20 text-action border border-action/30 shadow-lg'
                        : 'text-secondary hover:bg-surface/80 hover:text-primary'
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
          <Card className={`lg:col-span-3 backdrop-blur-xl shadow-2xl ${
            activeSection === 'privacy' ? 'card-action border-action/30' :
            activeSection === 'terms' ? 'card-info border-info/30' :
            activeSection === 'data' ? 'card-wellness border-wellness/30' :
            activeSection === 'security' ? 'card-success border-success/30' :
            activeSection === 'rights' ? 'card-activity border-activity/30' :
            'card-glass border-primary/30'
          }`}>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className={`p-3 rounded-xl ${
                  activeSection === 'privacy' ? 'icon-badge-action' :
                  activeSection === 'terms' ? 'icon-badge-info' :
                  activeSection === 'data' ? 'icon-badge-wellness' :
                  activeSection === 'security' ? 'icon-badge-success' :
                  activeSection === 'rights' ? 'icon-badge-activity' :
                  'icon-badge-action'
                }`}>
                  {sections.find(s => s.id === activeSection)?.icon && 
                    React.createElement(sections.find(s => s.id === activeSection)!.icon, {
                      className: `w-6 h-6 ${
                        activeSection === 'privacy' ? 'text-action' :
                        activeSection === 'terms' ? 'text-info' :
                        activeSection === 'data' ? 'text-wellness' :
                        activeSection === 'security' ? 'text-success' :
                        activeSection === 'rights' ? 'text-activity' :
                        'text-action'
                      }`
                    })
                  }
                </div>
                <div>
                  <CardTitle className="text-white text-2xl font-bold">
                    {sections.find(s => s.id === activeSection)?.title}
                  </CardTitle>
                  <CardDescription className="text-white/90">
                    {activeSection === 'privacy' && 'How we collect, use, and protect your personal information'}
                    {activeSection === 'terms' && 'Terms and conditions for using our fitness tracking service'}
                    {activeSection === 'data' && 'Detailed breakdown of how we handle your data'}
                    {activeSection === 'security' && 'Security measures protecting your information'}
                    {activeSection === 'rights' && 'Your data protection rights and how to exercise them'}
                    {activeSection === 'contact' && 'How to reach us with privacy questions or concerns'}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent data-testid={`content-${activeSection}`} className="text-white/95">
              {renderContent()}
            </CardContent>
          </Card>
        </div>

        {/* Last Updated Notice */}
        <Card className="bg-surface border-primary backdrop-blur-xl shadow-2xl">
          <CardContent className="p-4 text-center">
            <p className="text-secondary text-sm">
              Last updated: September 13, 2025 | Next review: March 2026 | 
              <Link href="/contact-support" className="text-action hover:text-action/80 ml-2">
                Questions? Contact us
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}