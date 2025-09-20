import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TaskCard } from './TaskCard';
import { RefreshCw, Users, CheckCircle, Clock, Zap } from 'lucide-react';
import heroImage from '@/assets/hackbuddy-hero.jpg';
import { useTasks } from '@/hooks/useTasks';
import { formatDistanceToNow } from 'date-fns';

// Remove the Task interface and mock data - now handled by Supabase

export const Dashboard = () => {
  const { tasks, loading, error, updateTaskStatus, fetchTasks } = useTasks();
  
  const handleMarkDone = (taskId: string, currentStatus: 'pending' | 'done') => {
    const newStatus = currentStatus === 'pending' ? 'done' : 'pending';
    updateTaskStatus(taskId, newStatus);
  };

  const handleRefresh = async () => {
    await fetchTasks();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-hero flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading tasks...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-hero flex items-center justify-center">
        <div className="text-center">
          <p className="text-destructive mb-4">Error: {error}</p>
          <Button onClick={handleRefresh} variant="outline">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  const pendingTasks = tasks.filter(task => task.status === 'pending');
  const completedTasks = tasks.filter(task => task.status === 'done');
  const newTasks = tasks.filter(task => {
    const createdAt = new Date(task.created_at);
    return Date.now() - createdAt.getTime() < 5 * 60 * 1000; // 5 minutes
  });

  return (
    <div className="min-h-screen bg-gradient-hero">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center shadow-glow">
                <Zap className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                  HackBuddy Dashboard
                </h1>
                <p className="text-muted-foreground">
                  Real-time task management from Discord
                </p>
              </div>
            </div>
            <Button 
              onClick={handleRefresh}
              variant="outline"
              className="border-primary/50 hover:bg-primary/10"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-background/80 to-background/40 z-10" />
        <img 
          src={heroImage} 
          alt="HackBuddy Dashboard" 
          className="w-full h-48 object-cover"
        />
        <div className="absolute inset-0 z-20 flex items-center">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl">
              <h2 className="text-4xl font-bold text-foreground mb-4">
                Track Your Team's Progress
              </h2>
              <p className="text-xl text-muted-foreground">
                Stay connected with your hackathon team through real-time task updates from Discord
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Cards */}
      <section className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-card border-border/50 shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-card-foreground">
                Total Tasks
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{tasks.length}</div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-card border-border/50 shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-card-foreground">
                Pending
              </CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-warning">{pendingTasks.length}</div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-card border-border/50 shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-card-foreground">
                Completed
              </CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success">{completedTasks.length}</div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-card border-border/50 shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-card-foreground">
                New Tasks
              </CardTitle>
              <Zap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{newTasks.length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Tasks Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Pending Tasks */}
          <div>
            <div className="flex items-center gap-2 mb-6">
              <Clock className="h-5 w-5 text-warning" />
              <h3 className="text-xl font-semibold text-foreground">
                Pending Tasks
              </h3>
              <Badge variant="outline" className="border-warning text-warning">
                {pendingTasks.length}
              </Badge>
            </div>
            <div className="space-y-4">
              {pendingTasks.map(task => {
                const timestamp = formatDistanceToNow(new Date(task.created_at), { addSuffix: true });
                const isNew = Date.now() - new Date(task.created_at).getTime() < 5 * 60 * 1000;
                
                return (
                  <TaskCard 
                    key={task.id} 
                    task={{
                      ...task,
                      timestamp,
                      isNew
                    }} 
                    onMarkDone={handleMarkDone}
                  />
                );
              })}
              {pendingTasks.length === 0 && (
                <Card className="bg-gradient-card border-border/50 shadow-card">
                  <CardContent className="pt-6 text-center">
                    <CheckCircle className="h-12 w-12 text-success mx-auto mb-4" />
                    <p className="text-muted-foreground">All tasks completed! 🎉</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* Completed Tasks */}
          <div>
            <div className="flex items-center gap-2 mb-6">
              <CheckCircle className="h-5 w-5 text-success" />
              <h3 className="text-xl font-semibold text-foreground">
                Completed Tasks
              </h3>
              <Badge variant="outline" className="border-success text-success">
                {completedTasks.length}
              </Badge>
            </div>
            <div className="space-y-4">
              {completedTasks.map(task => {
                const timestamp = formatDistanceToNow(new Date(task.created_at), { addSuffix: true });
                
                return (
                  <TaskCard 
                    key={task.id} 
                    task={{
                      ...task,
                      timestamp
                    }} 
                  />
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 mt-16">
        <div className="container mx-auto px-4 py-8 text-center">
          <p className="text-muted-foreground">
            Built with ❤️ for hackathons • Powered by{' '}
            <span className="text-primary font-semibold">HackBuddy</span>
          </p>
        </div>
      </footer>
    </div>
  );
};