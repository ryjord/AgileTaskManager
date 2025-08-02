// Import necessary dependencies
import { useAppSelector } from "@/app/redux";
import { useGetTasksQuery } from "@/state/api";
import { DisplayOption, Gantt, ViewMode } from "gantt-task-react";
import "gantt-task-react/dist/index.css";
import React, { useMemo, useState } from "react";

// the props type for the Timeline component
type Props = {
  project_ID: string;
  setIsModalNewTaskOpen: (isOpen: boolean) => void;
};

// Define the type for task items
type TaskTypeItems = "task" | "milestone" | "project";


/**
 * Timeline component for displaying project tasks in a Gantt chart format.
 */
const Timeline = ({ project_ID, setIsModalNewTaskOpen }: Props) => {
  // Get the current dark mode state from the app selector
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);

  // Get the tasks data from the API using the project ID
  const {
    data: tasks,
    error,
    isLoading,
  } = useGetTasksQuery({ project_ID: Number(project_ID) });

  // Initialize the display options state with default values
  const [displayOptions, setDisplayOptions] = useState<DisplayOption>({
    viewMode: ViewMode.Month,
    locale: "en-US",
  });

  // Use useMemo to memoize the gantt tasks data
  const ganttTasks = useMemo(() => {
    // Map over the tasks data and create a new array of gantt tasks
    return (
      tasks?.data?.map((task, index) => ({
        start: new Date(task.startDate as string),
        end: new Date(task.dueDate as string),
        name: task.title,
        id: `Task-${task.Task_ID || index}`, // use index as fallback if Task_ID is undefined
        type: "task" as TaskTypeItems,
        progress: task.points ? (task.points / 10) * 100 : 0,
        isDisabled: false,
      })) || []
    );
  }, [tasks?.data]); // Re-run the memoization when tasks data changes

  // function to handle view mode changes
  const handleViewModeChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    // Update the display options state with the new view mode
    setDisplayOptions((prev) => ({
      ...prev,
      viewMode: event.target.value as ViewMode,
    }));
  };

  // If the data is still loading, display a loading message
  if (isLoading) return <div>Loading...</div>;

  // If there's an error or no tasks data, display an error message
  if (error || !tasks) return <div>An error occurred while fetching tasks</div>;

  // Return the Timeline component
  return (
    <div className="px-4 xl:px-6">
      <div className="flex flex-wrap items-center justify-between gap-2 py-5">
        <h1 className="me-2 text-lg font-bold dark:text-white">
          Project Tasks Timeline
        </h1>
        <div className="relative inline-block w-64">
          <select
            className="focus:shadow-outline block w-full appearance-none rounded border border-gray-400 bg-white px-4 py-2 pr-8 leading-tight shadow hover:border-gray-500 focus:outline-none dark:border-dark-secondary dark:bg-dark-secondary dark:text-white"
            value={displayOptions.viewMode}
            onChange={handleViewModeChange}
          >
            <option value={ViewMode.Day}>Day</option>
            <option value={ViewMode.Week}>Week</option>
            <option value={ViewMode.Month}>Month</option>
          </select>
        </div>
      </div>

      <div className="overflow-hidden rounded-md bg-white shadow dark:bg-dark-secondary dark:text-white">
        <div className="timeline">
          <Gantt
            tasks={ganttTasks}
            {...displayOptions}
            columnWidth={displayOptions.viewMode === ViewMode.Month ? 150 : 100}
            listCellWidth="100px"
            barBackgroundColor={isDarkMode ? "#101214" : "#aeb8c2"}
            barBackgroundSelectedColor={isDarkMode ? "#000" : "#9ba1a6"}
          />
        </div>
        <div className="px-4 pb-5 pt-1">
          <button
            className="flex items-center rounded bg-red-primary px-3 py-2 text-white hover:bg-red-600"
            onClick={() => setIsModalNewTaskOpen(true)}
          >
            Add New Task
          </button>
        </div>
      </div>
    </div>
  );
};

// Export the Timeline component
export default Timeline;