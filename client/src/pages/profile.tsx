import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { useTheme } from "@/components/theme-provider";
import { User, Settings, Download, Trash2, Target, Activity, Moon, Sun } from "lucide-react";
import { LocalStorageService, UserData } from "@/lib/localStorage";
import { useToast } from "@/hooks/use-toast";

export default function Profile() {
  const { theme, toggleTheme } = useTheme();
  const [user, setUser] = useState<UserData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    fitnessGoal: "",
    activityLevel: "",
  });
  const { toast } = useToast();

  useEffect(() => {
    const userData = LocalStorageService.getUser();
    if (userData) {
      setUser(userData);
      setFormData({
        firstName: userData.firstName || "",
        lastName: userData.lastName || "",
        fitnessGoal: userData.fitnessGoal || "",
        activityLevel: userData.activityLevel || "",
      });
    } else {
      // Create default user if none exists
      const defaultUser: UserData = {
        id: 'demo-user',
        username: 'demo',
        firstName: 'John',
        lastName: 'Doe',
        fitnessGoal: 'bulk',
        activityLevel: 'moderately_active',
      };
      LocalStorageService.setUser(defaultUser);
      setUser(defaultUser);
      setFormData({
        firstName: defaultUser.firstName || "",
        lastName: defaultUser.lastName || "",
        fitnessGoal: defaultUser.fitnessGoal || "",
        activityLevel: defaultUser.activityLevel || "",
      });
    }
  }, []);

  const getDataStats = () => {
    const workouts = LocalStorageService.getWorkouts();
    const meals = LocalStorageService.getMeals();
    const bodyMetrics = LocalStorageService.getBodyMetrics();
    const conversations = LocalStorageService.getAiConversations();

    return {
      workouts: workouts.length,
      meals: meals.length,
      bodyMetrics: bodyMetrics.length,
      conversations: conversations.length,
    };
  };

  const handleSaveProfile = () => {
    if (!user) return;

    const updatedUser: UserData = {
      ...user,
      firstName: formData.firstName.trim() || undefined,
      lastName: formData.lastName.trim() || undefined,
      fitnessGoal: formData.fitnessGoal || undefined,
      activityLevel: formData.activityLevel || undefined,
    };

    LocalStorageService.setUser(updatedUser);
    setUser(updatedUser);
    setIsEditing(false);
    
    toast({
      title: "Profile Updated!",
      description: "Your profile information has been saved.",
    });
  };

  const handleExportData = () => {
    try {
      const data = LocalStorageService.exportData();
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `fittracker-backup-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
      
      toast({
        title: "Data Exported! 📊",
        description: "Your data has been downloaded as a backup file.",
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Failed to export data. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleClearData = () => {
    if (confirm("Are you sure you want to clear all data? This action cannot be undone.")) {
      LocalStorageService.clearAll();
      
      // Recreate default user
      const defaultUser: UserData = {
        id: 'demo-user',
        username: 'demo',
        firstName: 'John',
        lastName: 'Doe',
      };
      LocalStorageService.setUser(defaultUser);
      setUser(defaultUser);
      
      toast({
        title: "Data Cleared",
        description: "All data has been removed from the app.",
        variant: "destructive",
      });
    }
  };

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const stats = getDataStats();

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background p-4 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Profile</h1>
        <Button
          variant="outline"
          size="icon"
          onClick={toggleTheme}
          data-testid="button-theme-toggle"
        >
          {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>
      </div>

      {/* Profile Information */}
      <Card className="bg-card border border-border">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold flex items-center">
              <User className="h-5 w-5 mr-2" />
              Profile Information
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(!isEditing)}
              data-testid="button-edit-profile"
            >
              {isEditing ? "Cancel" : "Edit"}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {isEditing ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="first-name">First Name</Label>
                  <Input
                    id="first-name"
                    value={formData.firstName}
                    onChange={(e) => updateField('firstName', e.target.value)}
                    placeholder="John"
                    data-testid="input-first-name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="last-name">Last Name</Label>
                  <Input
                    id="last-name"
                    value={formData.lastName}
                    onChange={(e) => updateField('lastName', e.target.value)}
                    placeholder="Doe"
                    data-testid="input-last-name"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="fitness-goal">Fitness Goal</Label>
                <Select value={formData.fitnessGoal} onValueChange={(value) => updateField('fitnessGoal', value)}>
                  <SelectTrigger id="fitness-goal" data-testid="select-fitness-goal">
                    <SelectValue placeholder="Select your goal" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bulk">Build Muscle (Bulk)</SelectItem>
                    <SelectItem value="cut">Lose Fat (Cut)</SelectItem>
                    <SelectItem value="maintain">Maintain Weight</SelectItem>
                    <SelectItem value="strength">Build Strength</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="activity-level">Activity Level</Label>
                <Select value={formData.activityLevel} onValueChange={(value) => updateField('activityLevel', value)}>
                  <SelectTrigger id="activity-level" data-testid="select-activity-level">
                    <SelectValue placeholder="Select your activity level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sedentary">Sedentary (Office job)</SelectItem>
                    <SelectItem value="lightly_active">Lightly Active (1-3 days/week)</SelectItem>
                    <SelectItem value="moderately_active">Moderately Active (3-5 days/week)</SelectItem>
                    <SelectItem value="very_active">Very Active (6-7 days/week)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button 
                onClick={handleSaveProfile}
                className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
                data-testid="button-save-profile"
              >
                Save Changes
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">Name</p>
                <p className="text-foreground font-medium">
                  {user.firstName || user.lastName 
                    ? `${user.firstName || ''} ${user.lastName || ''}`.trim()
                    : 'Not set'
                  }
                </p>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground">Username</p>
                <p className="text-foreground font-medium">{user.username}</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Fitness Goal</p>
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary" className="flex items-center">
                    <Target className="h-3 w-3 mr-1" />
                    {user.fitnessGoal ? 
                      user.fitnessGoal.charAt(0).toUpperCase() + user.fitnessGoal.slice(1) :
                      'Not set'
                    }
                  </Badge>
                </div>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Activity Level</p>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className="flex items-center">
                    <Activity className="h-3 w-3 mr-1" />
                    {user.activityLevel ? 
                      user.activityLevel.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()) :
                      'Not set'
                    }
                  </Badge>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* App Settings */}
      <Card className="bg-card border border-border">
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center">
            <Settings className="h-5 w-5 mr-2" />
            App Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-foreground">Dark Theme</p>
              <p className="text-sm text-muted-foreground">Use dark mode interface</p>
            </div>
            <Switch
              checked={theme === 'dark'}
              onCheckedChange={toggleTheme}
              data-testid="switch-dark-theme"
            />
          </div>
          
          <Separator />
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-foreground">Push Notifications</p>
              <p className="text-sm text-muted-foreground">Workout reminders and progress updates</p>
            </div>
            <Switch
              checked={false}
              disabled
              data-testid="switch-notifications"
            />
          </div>
        </CardContent>
      </Card>

      {/* Data Statistics */}
      <Card className="bg-card border border-border">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Data Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-muted/30 rounded-lg">
              <p className="text-2xl font-bold text-primary">{stats.workouts}</p>
              <p className="text-sm text-muted-foreground">Workouts</p>
            </div>
            <div className="text-center p-3 bg-muted/30 rounded-lg">
              <p className="text-2xl font-bold text-accent">{stats.meals}</p>
              <p className="text-sm text-muted-foreground">Meals Logged</p>
            </div>
            <div className="text-center p-3 bg-muted/30 rounded-lg">
              <p className="text-2xl font-bold text-secondary">{stats.bodyMetrics}</p>
              <p className="text-sm text-muted-foreground">Body Metrics</p>
            </div>
            <div className="text-center p-3 bg-muted/30 rounded-lg">
              <p className="text-2xl font-bold text-chart-3">{stats.conversations}</p>
              <p className="text-sm text-muted-foreground">AI Conversations</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Management */}
      <Card className="bg-card border border-border">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Data Management</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button
            variant="outline"
            onClick={handleExportData}
            className="w-full justify-start"
            data-testid="button-export-data"
          >
            <Download className="h-4 w-4 mr-2" />
            Export Data
          </Button>
          
          <Button
            variant="outline"
            onClick={handleClearData}
            className="w-full justify-start text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground"
            data-testid="button-clear-data"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Clear All Data
          </Button>
        </CardContent>
      </Card>

      {/* App Information */}
      <Card className="bg-card border border-border">
        <CardContent className="pt-6">
          <div className="text-center text-muted-foreground">
            <div className="w-8 h-8 gradient-bg rounded-lg mx-auto mb-2">
              <User className="h-4 w-4 text-white m-2" />
            </div>
            <p className="font-semibold text-foreground">FitTracker Pro</p>
            <p className="text-sm">Version 1.0.0</p>
            <p className="text-xs mt-2">
              Your comprehensive fitness companion with AI coaching
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
