import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Send, Bot, User, Zap, Apple } from "lucide-react";
import { LocalStorageService } from "@/lib/localStorage";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface Message {
  id: string;
  role: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

export function AICoach() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Load existing conversation or create initial AI greeting
    const conversations = LocalStorageService.getAiConversations();
    if (conversations.length > 0) {
      const latest = conversations[0];
      setConversationId(latest.id);
      setMessages(latest.messages);
    } else {
      // Initial greeting
      const greeting: Message = {
        id: Date.now().toString(),
        role: 'ai',
        content: "Hey there! I'm your AI fitness coach. I'm here to help you with workout advice, nutrition tips, form corrections, and motivation. What can I help you with today?",
        timestamp: new Date(),
      };
      setMessages([greeting]);
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputMessage,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    try {
      const user = LocalStorageService.getUser();
      const recentWorkouts = LocalStorageService.getWorkouts().slice(0, 3);
      const todaysMeals = LocalStorageService.getMeals(new Date());
      const bodyMetrics = LocalStorageService.getLatestBodyMetric();

      const context = {
        userId: user?.id || 'demo-user',
        recentWorkouts: recentWorkouts.map(w => ({
          name: w.name,
          date: w.startTime,
          completed: w.isCompleted,
          exerciseCount: w.exercises.length,
        })),
        nutritionData: {
          todaysMeals: todaysMeals.length,
          totalCalories: todaysMeals.reduce((sum, meal) => sum + (meal.calories || 0), 0),
          totalProtein: todaysMeals.reduce((sum, meal) => sum + (meal.protein || 0), 0),
        },
        bodyMetrics: bodyMetrics ? {
          weight: bodyMetrics.weight,
          bodyFatPercentage: bodyMetrics.bodyFatPercentage,
          date: bodyMetrics.date,
        } : null,
        fitnessGoals: user?.fitnessGoal,
      };

      const response = await apiRequest('POST', '/api/ai/chat', {
        message: inputMessage,
        context,
      });

      const aiResponse = await response.json();

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        content: aiResponse.response,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, aiMessage]);

      // Save conversation
      const updatedMessages = [...messages, userMessage, aiMessage];
      const conversation = {
        id: conversationId || Date.now().toString(),
        userId: user?.id || 'demo-user',
        messages: updatedMessages,
        context: 'general',
        updatedAt: new Date(),
      };

      LocalStorageService.saveAiConversation(conversation);
      if (!conversationId) {
        setConversationId(conversation.id);
      }

    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to get response from AI coach. Please try again.",
        variant: "destructive",
      });

      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        content: "I'm sorry, I'm having trouble connecting right now. Please try again in a moment. In the meantime, keep up the great work with your fitness journey!",
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const askFormAdvice = () => {
    setInputMessage("Can you give me form tips for my current workout?");
  };

  const askNutritionAdvice = () => {
    setInputMessage("What nutrition advice do you have for me today?");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-foreground">AI Coach</h2>
        <Badge variant="secondary" className="bg-accent text-accent-foreground">
          <div className="w-2 h-2 bg-accent-foreground rounded-full mr-2 animate-pulse" />
          Online
        </Badge>
      </div>

      {/* Chat Interface */}
      <Card className="h-80 flex flex-col">
        <CardContent className="flex-1 p-4 space-y-3 overflow-y-auto">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex items-start space-x-3 ${
                message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''
              }`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                message.role === 'ai' 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-accent text-accent-foreground'
              }`}>
                {message.role === 'ai' ? (
                  <Bot className="h-4 w-4" />
                ) : (
                  <User className="h-4 w-4" />
                )}
              </div>
              <div className={`flex-1 ${message.role === 'user' ? 'text-right' : ''}`}>
                <div className={`rounded-lg p-3 max-w-xs inline-block ${
                  message.role === 'ai'
                    ? 'bg-muted text-foreground'
                    : 'bg-primary text-primary-foreground'
                }`}>
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {message.timestamp.toLocaleTimeString([], { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </p>
              </div>
            </div>
          ))}

          {/* Typing Indicator */}
          {isLoading && (
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <Bot className="h-4 w-4 text-primary-foreground" />
              </div>
              <div className="bg-muted rounded-lg p-3">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse" />
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse" style={{ animationDelay: '0.4s' }} />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </CardContent>

        {/* Chat Input */}
        <div className="p-4 border-t border-border">
          <div className="flex space-x-2">
            <Input
              type="text"
              placeholder="Ask about your workout, nutrition, or form..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={handleKeyPress}
              disabled={isLoading}
              className="flex-1"
              data-testid="input-chat-message"
            />
            <Button
              onClick={sendMessage}
              disabled={!inputMessage.trim() || isLoading}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
              data-testid="button-send-message"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-3">
        <Button
          onClick={askFormAdvice}
          variant="secondary"
          className="p-3 h-auto flex flex-col items-center space-y-1"
          data-testid="button-form-advice"
        >
          <Zap className="h-5 w-5 mb-1" />
          <span className="text-sm">Form Check</span>
        </Button>
        <Button
          onClick={askNutritionAdvice}
          variant="secondary"
          className="p-3 h-auto flex flex-col items-center space-y-1"
          data-testid="button-nutrition-advice"
        >
          <Apple className="h-5 w-5 mb-1" />
          <span className="text-sm">Nutrition Tips</span>
        </Button>
      </div>
    </div>
  );
}
