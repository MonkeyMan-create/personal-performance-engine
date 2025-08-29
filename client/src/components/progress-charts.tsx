import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TrendingUp, BarChart3, Activity, Target } from "lucide-react";
import { BodyMetricData, WorkoutData } from "@/lib/localStorage";

interface ProgressChartsProps {
  bodyMetrics: BodyMetricData[];
  workouts: WorkoutData[];
}

export function ProgressCharts({ bodyMetrics, workouts }: ProgressChartsProps) {
  const calculateWeeklyVolume = () => {
    // Simplified volume calculation - in real app would be more sophisticated
    const weeklyData = [];
    for (let i = 3; i >= 0; i--) {
      const weekStart = new Date();
      weekStart.setDate(weekStart.getDate() - (i * 7));
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 6);
      
      const weekWorkouts = workouts.filter(w => 
        w.startTime >= weekStart && w.startTime <= weekEnd
      );
      
      const volume = weekWorkouts.reduce((total, workout) => {
        return total + workout.exercises.reduce((exerciseTotal, exercise) => {
          return exerciseTotal + exercise.sets.reduce((setTotal, set) => {
            return setTotal + ((set.weight || 0) * (set.reps || 0));
          }, 0);
        }, 0);
      }, 0);
      
      weeklyData.push({
        week: `Week ${4 - i}`,
        volume: Math.round(volume),
        workouts: weekWorkouts.length
      });
    }
    return weeklyData;
  };

  const weeklyVolume = calculateWeeklyVolume();
  const maxVolume = Math.max(...weeklyVolume.map(w => w.volume), 1);

  return (
    <div className="space-y-4">
      {/* Weight Progress Chart */}
      <Card className="bg-card border border-border">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold flex items-center">
              <TrendingUp className="h-5 w-5 mr-2" />
              Weight Progress
            </CardTitle>
            <Select defaultValue="3months">
              <SelectTrigger className="w-32" data-testid="select-weight-timeframe">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1month">1 Month</SelectItem>
                <SelectItem value="3months">3 Months</SelectItem>
                <SelectItem value="6months">6 Months</SelectItem>
                <SelectItem value="1year">1 Year</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {bodyMetrics.length >= 2 ? (
            <div className="chart-container bg-muted/30 rounded-lg p-4">
              {/* Simplified chart representation */}
              <div className="flex items-end justify-between h-32 space-x-2">
                {bodyMetrics.slice(-6).reverse().map((metric, index) => {
                  const height = metric.weight ? (metric.weight / Math.max(...bodyMetrics.map(m => m.weight || 0))) * 100 : 0;
                  return (
                    <div key={metric.id} className="flex-1 flex flex-col items-center">
                      <div 
                        className="w-full bg-primary rounded-t min-h-[4px]"
                        style={{ height: `${height}%` }}
                      />
                      <span className="text-xs text-muted-foreground mt-2">
                        {metric.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                  );
                })}
              </div>
              <div className="mt-4 text-center">
                <p className="text-sm text-muted-foreground">
                  Latest: {bodyMetrics[0]?.weight} lbs
                  {bodyMetrics[1]?.weight && (
                    <span className={`ml-2 ${
                      (bodyMetrics[0]?.weight || 0) > (bodyMetrics[1]?.weight || 0) 
                        ? 'text-destructive' 
                        : 'text-accent'
                    }`}>
                      {(bodyMetrics[0]?.weight || 0) > (bodyMetrics[1]?.weight || 0) ? '↑' : '↓'}
                      {Math.abs((bodyMetrics[0]?.weight || 0) - (bodyMetrics[1]?.weight || 0)).toFixed(1)} lbs
                    </span>
                  )}
                </p>
              </div>
            </div>
          ) : (
            <div className="chart-container bg-muted/30 rounded-lg p-4 flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <TrendingUp className="h-8 w-8 mx-auto mb-2" />
                <p className="text-sm">Track at least 2 measurements</p>
                <p className="text-xs">to see weight progress chart</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Weekly Volume Chart */}
      <Card className="bg-card border border-border">
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center">
            <BarChart3 className="h-5 w-5 mr-2" />
            Weekly Training Volume
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="chart-container bg-muted/30 rounded-lg p-4">
            <div className="flex items-end justify-between h-32 space-x-2">
              {weeklyVolume.map((week, index) => {
                const height = week.volume > 0 ? (week.volume / maxVolume) * 100 : 4;
                return (
                  <div key={index} className="flex-1 flex flex-col items-center">
                    <div 
                      className="w-full bg-accent rounded-t min-h-[4px]"
                      style={{ height: `${height}%` }}
                    />
                    <span className="text-xs text-muted-foreground mt-2">
                      {week.week}
                    </span>
                  </div>
                );
              })}
            </div>
            <div className="mt-4 text-center">
              <p className="text-sm text-muted-foreground">
                This week: {weeklyVolume[weeklyVolume.length - 1]?.volume.toLocaleString()} lbs total volume
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Body Composition Chart */}
      <Card className="bg-card border border-border">
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center">
            <Activity className="h-5 w-5 mr-2" />
            Body Composition
          </CardTitle>
        </CardHeader>
        <CardContent>
          {bodyMetrics.length > 0 && bodyMetrics[0].bodyFatPercentage && bodyMetrics[0].muscleMass ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-muted/30 rounded-lg">
                  <p className="text-xl font-bold text-secondary">{bodyMetrics[0].bodyFatPercentage}%</p>
                  <p className="text-sm text-muted-foreground">Body Fat</p>
                </div>
                <div className="text-center p-3 bg-muted/30 rounded-lg">
                  <p className="text-xl font-bold text-accent">{bodyMetrics[0].muscleMass} lbs</p>
                  <p className="text-sm text-muted-foreground">Lean Mass</p>
                </div>
              </div>
              {/* Simple pie chart representation */}
              <div className="flex items-center justify-center">
                <div className="w-32 h-32 rounded-full relative overflow-hidden bg-muted">
                  <div 
                    className="absolute inset-0 bg-accent"
                    style={{
                      background: `conic-gradient(var(--accent) 0deg ${((100 - (bodyMetrics[0].bodyFatPercentage || 0)) / 100) * 360}deg, var(--secondary) ${((100 - (bodyMetrics[0].bodyFatPercentage || 0)) / 100) * 360}deg 360deg)`
                    }}
                  />
                  <div className="absolute inset-4 bg-card rounded-full flex items-center justify-center">
                    <span className="text-xs font-medium text-foreground">
                      {100 - (bodyMetrics[0].bodyFatPercentage || 0)}% Lean
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="chart-container bg-muted/30 rounded-lg p-4 flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <Activity className="h-8 w-8 mx-auto mb-2" />
                <p className="text-sm">Track body fat and muscle mass</p>
                <p className="text-xs">to see composition chart</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Goals Progress */}
      <Card className="bg-card border border-border">
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center">
            <Target className="h-5 w-5 mr-2" />
            Goals Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground py-8">
            <Target className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>Set fitness goals to track progress</p>
            <p className="text-sm">Goals feature coming soon</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
