import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { User, Clock, CheckCircle2, Circle } from "lucide-react";
import { cn } from "@/lib/utils";

// Remove the Task interface as it's now in Supabase types

interface TaskCardProps {
  task: {
    id: string;
    user: string;
    task: string;
    status: 'pending' | 'done';
    timestamp: string;
    isNew?: boolean;
  };
  onMarkDone?: (taskId: string, currentStatus: 'pending' | 'done') => void;
}

export const TaskCard = ({ task, onMarkDone }: TaskCardProps) => {
  return (
    <Card className={cn(
      "bg-gradient-card border-border/50 shadow-card transition-all duration-300 hover:shadow-elevated hover:scale-[1.02]",
      task.isNew && "ring-2 ring-primary/50 shadow-glow"
    )}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-card-foreground flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            {task.user}
          </CardTitle>
          <Badge 
            variant={task.status === 'done' ? 'secondary' : 'default'}
            className={cn(
              "transition-colors",
              task.status === 'done' 
                ? "bg-success text-success-foreground" 
                : "bg-primary text-primary-foreground"
            )}
          >
            {task.status === 'done' ? (
              <CheckCircle2 className="h-3 w-3 mr-1" />
            ) : (
              <Circle className="h-3 w-3 mr-1" />
            )}
            {task.status === 'done' ? 'Completed' : 'Pending'}
          </Badge>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          {task.timestamp}
          {task.isNew && (
            <Badge variant="outline" className="text-xs border-primary text-primary">
              NEW
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="text-card-foreground mb-4 leading-relaxed">
          {task.task}
        </p>
        {task.status === 'pending' && onMarkDone && (
          <Button 
            onClick={() => onMarkDone(task.id, task.status)}
            variant="default"
            size="sm"
            className="bg-gradient-primary hover:shadow-glow transition-all duration-300"
          >
            <CheckCircle2 className="h-4 w-4 mr-2" />
            Mark as Done
          </Button>
        )}
      </CardContent>
    </Card>
  );
};