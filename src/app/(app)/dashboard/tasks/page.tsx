import React from "react";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { getUserTasks } from "@/actions/tasks";
import { CreateTaskForm } from "@/components/dashboard/CreateTaskForm";
import { TaskList } from "@/components/dashboard/TaskList";

export default async function TaskStudioPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const tasks = await getUserTasks(user.id);
  
  const pendingTasks = tasks.filter(t => !t.isCompleted);
  const completedTasks = tasks.filter(t => t.isCompleted);

  return (
    <div className="max-w-4xl mx-auto pb-12">
      
      <CreateTaskForm userId={user.id} />

      <div className="space-y-10">
        <section>
          <div className="flex items-center gap-2 mb-4">
            <h2 className="text-xl font-headline font-bold text-on-background">Pending Tasks</h2>
            <span className="bg-surface-container-high text-on-surface-variant text-xs font-bold px-2 py-0.5 rounded-full">
              {pendingTasks.length}
            </span>
          </div>
          <TaskList initialTasks={pendingTasks} />
        </section>

        {completedTasks.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-4">
              <h2 className="text-xl font-headline font-bold text-on-background opacity-60">Completed</h2>
              <span className="bg-surface-container text-on-surface-variant opacity-60 text-xs font-bold px-2 py-0.5 rounded-full">
                {completedTasks.length}
              </span>
            </div>
            <TaskList initialTasks={completedTasks} />
          </section>
        )}
      </div>
    </div>
  );
}
