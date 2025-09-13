import React, { useState } from 'react'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Input } from '../components/ui/input'
import { ArrowLeft, MessageCircle, Mail, Clock, CheckCircle, Send, HelpCircle } from 'lucide-react'
import { Link } from 'wouter'
import { useToast } from '../hooks/use-toast'

export default function ContactSupportPage() {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmitForm = async () => {
    if (!formData.name || !formData.email || !formData.message) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields before submitting.",
        variant: "destructive"
      })
      return
    }

    setIsSubmitting(true)
    
    try {
      // Simulate form submission
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      toast({
        title: "Message Sent!",
        description: "Your support request has been submitted. We'll get back to you within 24 hours."
      })
      
      // Reset form
      setFormData({ name: '', email: '', subject: '', message: '' })
    } catch (error) {
      toast({
        title: "Send Failed",
        description: "Failed to send your message. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
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
          <h1 className="text-3xl font-bold text-white" data-testid="page-title">Contact Support</h1>
          <p className="text-slate-300 mt-2">Get help with your account, technical issues, or general questions</p>
        </div>

        {/* Contact Options */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="bg-slate-800/60 border-slate-700/50 backdrop-blur-xl shadow-2xl">
            <CardContent className="p-6 text-center space-y-4">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-xl mx-auto flex items-center justify-center">
                <MessageCircle className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="font-bold text-white text-lg">Live Chat</h3>
                <p className="text-slate-300 text-sm mt-2">
                  Get instant help from our support team
                </p>
                <p className="text-slate-400 text-xs mt-2">Available 9 AM - 6 PM EST</p>
              </div>
              <Button 
                variant="outline" 
                className="w-full border-blue-400/50 text-blue-400 hover:bg-blue-400/10"
                disabled
                data-testid="button-live-chat"
              >
                Coming Soon
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/60 border-slate-700/50 backdrop-blur-xl shadow-2xl">
            <CardContent className="p-6 text-center space-y-4">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-xl mx-auto flex items-center justify-center">
                <Mail className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h3 className="font-bold text-white text-lg">Email Support</h3>
                <p className="text-slate-300 text-sm mt-2">
                  Send us a detailed message about your issue
                </p>
                <p className="text-slate-400 text-xs mt-2">Response within 24 hours</p>
              </div>
              <Button 
                variant="outline" 
                className="w-full border-green-400/50 text-green-400 hover:bg-green-400/10"
                data-testid="button-email-support"
              >
                Use Form Below
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/60 border-slate-700/50 backdrop-blur-xl shadow-2xl">
            <CardContent className="p-6 text-center space-y-4">
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-xl mx-auto flex items-center justify-center">
                <HelpCircle className="w-8 h-8 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <h3 className="font-bold text-white text-lg">Help Center</h3>
                <p className="text-slate-300 text-sm mt-2">
                  Browse our knowledge base and FAQ
                </p>
                <p className="text-slate-400 text-xs mt-2">Self-service resources</p>
              </div>
              <Link href="/help-center">
                <Button 
                  variant="outline" 
                  className="w-full border-purple-400/50 text-purple-400 hover:bg-purple-400/10"
                  data-testid="button-help-center"
                >
                  Visit Help Center
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Contact Form */}
        <Card className="bg-slate-800/60 border-slate-700/50 backdrop-blur-xl shadow-2xl">
          <CardHeader>
            <CardTitle className="text-white text-xl font-bold flex items-center gap-2">
              <Send className="w-6 h-6 text-teal-400" />
              Send Support Message
            </CardTitle>
            <CardDescription className="text-slate-300">
              Fill out the form below and we'll get back to you as soon as possible
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Full Name *
                </label>
                <Input
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Enter your full name"
                  className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400"
                  data-testid="input-name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Email Address *
                </label>
                <Input
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="Enter your email"
                  type="email"
                  className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400"
                  data-testid="input-email"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Subject
              </label>
              <Input
                value={formData.subject}
                onChange={(e) => handleInputChange('subject', e.target.value)}
                placeholder="Brief description of your issue"
                className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400"
                data-testid="input-subject"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Message *
              </label>
              <textarea
                value={formData.message}
                onChange={(e) => handleInputChange('message', e.target.value)}
                placeholder="Please describe your issue or question in detail..."
                rows={6}
                className="w-full p-3 bg-slate-700/50 border border-slate-600 rounded-md text-white placeholder:text-slate-400 resize-none focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-teal-400"
                data-testid="input-message"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                onClick={handleSubmitForm}
                disabled={isSubmitting}
                className="flex-1 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white font-bold h-12 rounded-xl shadow-xl shadow-teal-500/25"
                data-testid="button-submit-support"
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Sending...
                  </div>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Send Message
                  </>
                )}
              </Button>
            </div>
            
            <p className="text-xs text-slate-500 text-center">
              We typically respond to support requests within 24 hours during business days.
            </p>
          </CardContent>
        </Card>

        {/* Response Time Info */}
        <Card className="bg-slate-800/60 border-slate-700/50 backdrop-blur-xl shadow-2xl">
          <CardContent className="p-6">
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div className="space-y-2">
                <Clock className="w-8 h-8 text-amber-400 mx-auto" />
                <h3 className="font-semibold text-white">Response Time</h3>
                <p className="text-sm text-slate-300">
                  Most inquiries answered within 4-6 hours during business hours
                </p>
              </div>
              
              <div className="space-y-2">
                <CheckCircle className="w-8 h-8 text-green-400 mx-auto" />
                <h3 className="font-semibold text-white">Resolution Rate</h3>
                <p className="text-sm text-slate-300">
                  95% of issues resolved on first contact
                </p>
              </div>
              
              <div className="space-y-2">
                <MessageCircle className="w-8 h-8 text-blue-400 mx-auto" />
                <h3 className="font-semibold text-white">Follow-up</h3>
                <p className="text-sm text-slate-300">
                  We'll check in to ensure your issue is fully resolved
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}