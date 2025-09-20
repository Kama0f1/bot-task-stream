import { useState, useEffect } from 'react';
import { supabase, type Task } from '@/lib/supabase';

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      setTasks(data || []);
      setError(null);
    } catch (err: any) {
      setError(err.message);
      console.error('Error fetching tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateTaskStatus = async (id: string, status: 'pending' | 'done') => {
    try {
      const { error } = await supabase
        .from('tasks')
        .update({ status })
        .eq('id', id);

      if (error) {
        throw error;
      }

      // Update local state
      setTasks(tasks.map(task => 
        task.id === id ? { ...task, status } : task
      ));
    } catch (err: any) {
      setError(err.message);
      console.error('Error updating task:', err);
    }
  };

  useEffect(() => {
    fetchTasks();

    // Set up real-time subscription
    const subscription = supabase
      .channel('tasks')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'tasks' 
      }, () => {
        fetchTasks(); // Refetch when changes occur
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return {
    tasks,
    loading,
    error,
    fetchTasks,
    updateTaskStatus
  };
};