import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Scale, Percent, User } from "lucide-react";
import { LocalStorageService, BodyMetricData } from "@/lib/localStorage";
import { useToast } from "@/hooks/use-toast";

interface BodyMetricsFormProps {
  onSave: () => void;
}

export function BodyMetricsForm({ onSave }: BodyMetricsFormProps) {
  const [formData, setFormData] = useState({
    weight: "",
    bodyFatPercentage: "",
    muscleMass: "",
    notes: "",
  });
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.weight && !formData.bodyFatPercentage && !formData.muscleMass) {
      toast({
        title: "Error",
        description: "Please enter at least one measurement",
        variant: "destructive",
      });
      return;
    }

    const user = LocalStorageService.getUser();
    const metricData: BodyMetricData = {
      id: Date.now().toString(),
      userId: user?.id || 'demo-user',
      date: new Date(),
      weight: parseFloat(formData.weight) || undefined,
      bodyFatPercentage: parseFloat(formData.bodyFatPercentage) || undefined,
      muscleMass: parseFloat(formData.muscleMass) || undefined,
      notes: formData.notes.trim() || undefined,
    };

    LocalStorageService.saveBodyMetric(metricData);
    onSave();
  };

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Card className="bg-card border border-border">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Log Body Metrics</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-6">
            {/* Weight */}
            <div className="space-y-2">
              <Label htmlFor="weight" className="flex items-center">
                <Scale className="h-4 w-4 mr-2" />
                Weight (lbs)
              </Label>
              <Input
                id="weight"
                type="number"
                step="0.1"
                value={formData.weight}
                onChange={(e) => updateField('weight', e.target.value)}
                placeholder="185.2"
                className="bg-input border border-border"
                data-testid="input-weight"
              />
            </div>

            {/* Body Fat Percentage */}
            <div className="space-y-2">
              <Label htmlFor="body-fat" className="flex items-center">
                <Percent className="h-4 w-4 mr-2" />
                Body Fat Percentage (%)
              </Label>
              <Input
                id="body-fat"
                type="number"
                step="0.1"
                value={formData.bodyFatPercentage}
                onChange={(e) => updateField('bodyFatPercentage', e.target.value)}
                placeholder="12.5"
                className="bg-input border border-border"
                data-testid="input-body-fat"
              />
            </div>

            {/* Muscle Mass */}
            <div className="space-y-2">
              <Label htmlFor="muscle-mass" className="flex items-center">
                <User className="h-4 w-4 mr-2" />
                Lean Muscle Mass (lbs)
              </Label>
              <Input
                id="muscle-mass"
                type="number"
                step="0.1"
                value={formData.muscleMass}
                onChange={(e) => updateField('muscleMass', e.target.value)}
                placeholder="167.2"
                className="bg-input border border-border"
                data-testid="input-muscle-mass"
              />
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <Label htmlFor="notes">Notes (optional)</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => updateField('notes', e.target.value)}
                placeholder="Morning measurement, fasted..."
                className="bg-input border border-border resize-none h-20"
                data-testid="textarea-metrics-notes"
              />
            </div>
          </div>

          <div className="flex space-x-3 pt-4">
            <Button
              type="submit"
              className="flex-1 bg-accent text-accent-foreground hover:bg-accent/90"
              data-testid="button-save-metrics"
            >
              Save Metrics
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
