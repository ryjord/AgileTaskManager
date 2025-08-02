
// Imports
import Header from "@/components/Header";
import TaskCard from "@/components/TaskCard";
import { Task, useGetTasksQuery } from "@/state/api";
import React from "react";

/**
 * Type definition for Board component props
 */
type ListProps = {
  project_ID: string;
  setIsModalNewTaskOpen: (isOpen: boolean) => void;
};

/**
 * Type definition for Board component props
 */
const ListView = ({project_ID, setIsModalNewTaskOpen}: ListProps) => {

  // Destructure project_ID from props
   const {data: tasks, error, isLoading} = useGetTasksQuery({ project_ID: Number(project_ID) });

  // Render loading state
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>error : fetching tasks</div>;

  /** 
   *  Render Board component
   *  @returns JSX
   */
  return (
    <div className="px-4 pb-8 xl:px-6">
      <div className="pt-5">
        <Header name="List"
          buttonComponent={
            <button className="flex items-center rounded bg-red-primary px-3 py-2 text-white hover:bg-red-600"
              onClick={() => setIsModalNewTaskOpen(true)}>
              Add Task
            </button>}isSmallText/>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
       {tasks?.data?.map((task: Task, index) => (
        <TaskCard key={task.Task_ID || `task-${index}-${task.title || 'untitled'}`} task={task}/>
       ))}
      </div>
    </div>

  );
};

export default ListView;