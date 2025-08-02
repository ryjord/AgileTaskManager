"use client";

// Imports
import { useAppSelector } from "@/app/redux";
import Header from "@/components/Header";
import { useGetProjectsQuery, Project } from "@/state/api";
import { DisplayOption, Gantt, ViewMode } from "gantt-task-react";
import "gantt-task-react/dist/index.css";
import React, { useMemo, useState } from "react";

// Type definitions
type TaskTypeItems = "task" | "milestone" | "project";
type ProjectsResponse = Project[] | { data: Project[] };

// Timeline component
const Timeline = () => {   
    const isDarkMode = useAppSelector((state) => state.global.isDarkMode);
    const { data: projects, isLoading, isError } = useGetProjectsQuery();

  // redine array for data objects of projects
    const projectArray: Project[] = Array.isArray(projects)
    ? projects
    : (projects && typeof projects === "object" && "data" in projects && Array.isArray((projects as any).data))
      ? (projects as any).data
      : [];

    // Define display options for the Gantt chart
    const [displayOptions, setDisplayOptions] = useState<DisplayOption>({
        viewMode: ViewMode.Month,
        locale: "en-US",
    });

    // ganttchart variables initialization
    const ganttTasks = useMemo(() => {
        return (
            projectArray.map((project: Project) => ({
                start: new Date(project.startDate as string),
                end: new Date(project.endDate as string),
                name: project.name,
                id: `Project-${project.project_ID}`,
                type: "project" as TaskTypeItems,
                progress: 50,
                isDisabled: false,
            })) || []
        );
    }, [projectArray]);

    // Handle view mode change
    const handleViewModeChange = (
        event: React.ChangeEvent<HTMLSelectElement>,
    ) => {
        setDisplayOptions((prev) => ({
        ...prev,
        viewMode: event.target.value as ViewMode,
        }));
    };

 // Render the timeline component
  if (isLoading) return <div>Loading...</div>;
  if (isError || !projects)
    return <div>An error occurred while fetching projects</div>;

  return (
    <div className="max-w-full p-8">
      <header className="mb-4 flex items-center justify-between">
        <Header name="Projects Timeline" />
        <div className="relative inline-block w-64">
          <select className="focus:shadow-outline block w-full appearance-none rounded border border-gray-400 bg-white px-4 py-2 pr-8 leading-tight shadow hover:border-gray-500 focus:outline-none dark:border-dark-secondary dark:bg-dark-secondary dark:text-white" value={displayOptions.viewMode} onChange={handleViewModeChange}>
            <option value={ViewMode.Day}>Day</option>
            <option value={ViewMode.Week}>Week</option>
            <option value={ViewMode.Month}>Month</option>
          </select>
        </div>
      </header>

      <div className="overflow-hidden rounded-md bg-white shadow dark:bg-dark-secondary dark:text-white">
        <div className="timeline">
          <Gantt tasks={ganttTasks} {...displayOptions} columnWidth={displayOptions.viewMode === ViewMode.Month ? 150 : 100} listCellWidth="100px" projectBackgroundColor={isDarkMode ? "#101214" : "#1f2937"} projectProgressColor={isDarkMode ? "#1f2937" : "#aeb8c2"} projectProgressSelectedColor={isDarkMode ? "#000" : "#9ba1a6"} />
        </div>
      </div>
    </div>
  );
};

export default Timeline;