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
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-4 space-y-6 pb-24">
        {/* Header */}
        <div className="flex items-center gap-4 pt-8">
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-secondary hover:text-primary" 
            data-testid="button-back"
            onClick={() => {
              if (window.history.length > 1) {
                window.history.back()
              } else {
                window.location.href = '/profile'
              }
            }}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Settings
          </Button>
        </div>

        <div className="text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 icon-badge-action rounded-2xl">
              <HelpCircle className="w-8 h-8 text-action" />
            </div>
            <h1 className="text-3xl font-bold text-primary" data-testid="page-title">Contact Support</h1>
          </div>
          <p className="text-secondary mt-2">Get help with your account, technical issues, or general questions</p>
        </div>

        {/* Contact Options */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="card-action backdrop-blur-xl shadow-2xl hover:shadow-3xl transition-all duration-300">
            <CardContent className="p-6 text-center space-y-4">
              <div className="w-16 h-16 icon-badge-action rounded-xl mx-auto flex items-center justify-center">
                <MessageCircle className="w-8 h-8 text-action" />
              </div>
              <div>
                <h3 className="font-bold text-primary text-lg">Live Chat</h3>
                <p className="text-secondary text-sm mt-2">
                  Get instant help from our support team
                </p>
                <p className="text-secondary text-xs mt-2">Available 9 AM - 6 PM EST</p>
              </div>
              <Button 
                variant="outline" 
                className="w-full button-outline-action"
                disabled
                data-testid="button-live-chat"
              >
                Coming Soon
              </Button>
            </CardContent>
          </Card>

          <Card className="card-base backdrop-blur-xl shadow-2xl hover:shadow-3xl transition-all duration-300">
            <CardContent className="p-6 text-center space-y-4">
              <div className="w-16 h-16 icon-badge-success rounded-xl mx-auto flex items-center justify-center">
                <Mail className="w-8 h-8 text-success" />
              </div>
              <div>
                <h3 className="font-bold text-primary text-lg">Email Support</h3>
                <p className="text-secondary text-sm mt-2">
                  Send us a detailed message about your issue
                </p>
                <p className="text-secondary text-xs mt-2">Response within 24 hours</p>
              </div>
              <Button 
                variant="outline" 
                className="w-full button-outline-success"
                data-testid="button-email-support"
              >
                Use Form Below
              </Button>
            </CardContent>
          </Card>

          <Card className="card-glass backdrop-blur-xl shadow-2xl hover:shadow-3xl transition-all duration-300">
            <CardContent className="p-6 text-center space-y-4">
              <div className="w-16 h-16 icon-badge-info rounded-xl mx-auto flex items-center justify-center">
                <HelpCircle className="w-8 h-8 text-info" />
              </div>
              <div>
                <h3 className="font-bold text-primary text-lg">Help Center</h3>
                <p className="text-secondary text-sm mt-2">
                  Browse our knowledge base and FAQ
                </p>
                <p className="text-secondary text-xs mt-2">Self-service resources</p>
              </div>
              <Link href="/help-center">
                <Button 
                  variant="outline" 
                  className="w-full button-outline-info"
                  data-testid="button-help-center"
                >
                  Visit Help Center
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Contact Form */}
        <Card className="card-glass backdrop-blur-xl shadow-2xl">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-3 icon-badge-action rounded-xl">
                <Send className="w-6 h-6 text-action" />
              </div>
              <div>
                <CardTitle className="text-primary text-xl font-bold">Send Support Message</CardTitle>
                <CardDescription className="text-secondary">
                  Fill out the form below and we'll get back to you as soon as possible
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-secondary mb-2">
                  Full Name *
                </label>
                <Input
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Enter your full name"
                  className="input-primary text-primary placeholder:text-secondary"
                  data-testid="input-name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-secondary mb-2">
                  Email Address *
                </label>
                <Input
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="Enter your email"
                  type="email"
                  className="input-primary text-primary placeholder:text-secondary"
                  data-testid="input-email"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-secondary mb-2">
                Subject
              </label>
              <Input
                value={formData.subject}
                onChange={(e) => handleInputChange('subject', e.target.value)}
                placeholder="Brief description of your issue"
                className="input-primary text-primary placeholder:text-secondary"
                data-testid="input-subject"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-secondary mb-2">
                Message *
              </label>
              <textarea
                value={formData.message}
                onChange={(e) => handleInputChange('message', e.target.value)}
                placeholder="Please describe your issue or question in detail..."
                rows={6}
                className="w-full p-3 input-primary border rounded-md text-primary placeholder:text-secondary resize-none focus:outline-none focus:ring-2 focus:ring-action focus:border-action"
                data-testid="input-message"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                onClick={handleSubmitForm}
                disabled={isSubmitting}
                className="flex-1 button-primary-action text-action-text hover:button-primary-action-hover font-bold h-12 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                data-testid="button-submit-support"
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-action-text border-t-transparent rounded-full animate-spin" />
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
            
            <p className="text-xs text-secondary text-center">
              We typically respond to support requests within 24 hours during business days.
            </p>
          </CardContent>
        </Card>

        {/* Response Time Info */}
        <Card className="card-success backdrop-blur-xl shadow-2xl">
          <CardContent className="p-6">
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div className="space-y-2">
                <Clock className="w-8 h-8 text-warning mx-auto" />
                <h3 className="font-semibold text-primary">Response Time</h3>
                <p className="text-sm text-secondary">
                  Most inquiries answered within 4-6 hours during business hours
                </p>
              </div>
              
              <div className="space-y-2">
                <CheckCircle className="w-8 h-8 text-success mx-auto" />
                <h3 className="font-semibold text-primary">Resolution Rate</h3>
                <p className="text-sm text-secondary">
                  95% of issues resolved on first contact
                </p>
              </div>
              
              <div className="space-y-2">
                <MessageCircle className="w-8 h-8 text-action mx-auto" />
                <h3 className="font-semibold text-primary">Follow-up</h3>
                <p className="text-sm text-secondary">
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