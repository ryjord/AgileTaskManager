"use client";

// Imports
import { TaskPriority, Project, Task, useGetProjectsQuery, useGetTasksQuery } from "@/state/api";
import React from "react";
import { useAppSelector } from "../redux";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import Header from "@/components/Header";
import { Bar, BarChart, CartesianGrid, Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { dataGridClassNames, dataGridSxStyles } from "@/lib/utils";

// Task table columns
const taskColumns: GridColDef[] = [
  { field: "title", headerName: "Title", width: 200 },
  { field: "status", headerName: "Status", width: 150 },
  { field: "priority", headerName: "Priority", width: 150 },
  { field: "dueDate", headerName: "Due Date", width: 150 },
];

// Status colors for charts
const STATUS_COLORS: Record<string, string> = {
  Completed: "#22c55e",
  Active: "#3b82f6",
};

// Main dashboard component
const HomePage = () => {
  // Project selection state
  const { data: projectsResult, isLoading: isProjectsLoading } = useGetProjectsQuery();
  // DEBUG: Show the actual projectsResult for troubleshooting
  // Remove this after debugging
  // eslint-disable-next-line no-console
  if (typeof window !== 'undefined') console.log('projectsResult:', projectsResult);
  // Type guard for projectsResult
  function isProjectArray(val: unknown): val is Project[] {
    return Array.isArray(val) && val.every((item) => typeof item === 'object' && item !== null && 'project_ID' in item);
  }
  function hasDataArray(val: unknown): val is { data: Project[] } {
    return typeof val === 'object' && val !== null && Array.isArray((val as any).data);
  }
  let projects: Project[] = [];
  if (isProjectArray(projectsResult)) {
    projects = projectsResult;
  } else if (hasDataArray(projectsResult as any)) {
    projects = (projectsResult as any).data;
  }
  const [selectedProjectIdx, setSelectedProjectIdx] = React.useState(0);
  const [dropdownOpen, setDropdownOpen] = React.useState(false);
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);

  // Get selected project
  const selectedProject = projects[selectedProjectIdx] || null;
  const selectedProjectId = selectedProject?.project_ID;

  // Fetch tasks for selected project
  const { data: tasksResult, isLoading: tasksLoading, isError: tasksError } = useGetTasksQuery(selectedProjectId ? { project_ID: selectedProjectId } : { project_ID: 1 });
  const tasks = tasksResult?.data || [];


  // Loading state
  if (tasksLoading || isProjectsLoading) return <div>Loading..</div>;

  // No projects state (also show debug info)
  if (!projects.length) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8">
        <Header name="Project Management Dashboard" />
        <div className="mt-8 text-xl text-gray-500 dark:text-gray-300">No projects found. Please create a project to get started.</div>
        <pre className="mt-4 text-xs text-gray-400 bg-gray-100 p-2 rounded max-w-xl overflow-x-auto">
          {JSON.stringify(projectsResult, null, 2)}
        </pre>
      </div>
    );
  }

  // Error state
  if (tasksError) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8">
        <Header name="Project Management Dashboard" />
        <div className="mt-8 text-xl text-red-500">Error fetching tasks for the selected project.</div>
      </div>
    );
  }

  // Calculate priority distribution
  const priorityCount = tasks.reduce((acc: Record<string, number>, task: Task) => {
    acc[task.priority as TaskPriority] = (acc[task.priority as TaskPriority] || 0) + 1;
    return acc;
  }, {});

  const taskDistribution = Object.keys(priorityCount).map((key) => ({
    name: key,
    count: priorityCount[key],
  }));

  // Calculate task status
  const now = new Date();
  const taskStatusCount = tasks.reduce((acc: Record<string, number>, task: Task) => {
    const status = (String(task.status) === "DONE" && task.dueDate && new Date(task.dueDate) <= now) ? "Completed" : "Active";
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});

  const taskStatus = [
    { name: "Active", count: taskStatusCount["Active"] || 0 },
    { name: "Completed", count: taskStatusCount["Completed"] || 0 },
  ];

  // Theme colors
  const chartColors = isDarkMode ? {
    bar: "#991b1b", barGrid: "#303030", pieFill: "#991b1b", text: "#FFFFFF"
  } : {
    bar: "#991b1b", barGrid: "#E0E0E0", pieFill: "#991b1b", text: "#000000"
  };

  // Handlers for project navigation
  const handlePrevProject = () => {
    setSelectedProjectIdx((prev) => (prev - 1 + projects.length) % projects.length);
    setDropdownOpen(false);
  };
  const handleNextProject = () => {
    setSelectedProjectIdx((prev) => (prev + 1) % projects.length);
    setDropdownOpen(false);
  };
  const handleDropdownSelect = (idx: number) => {
    setSelectedProjectIdx(idx);
    setDropdownOpen(false);
  };

  // Project selector UI
  const projectSelector = (
    <div className="flex items-center justify-center my-6 relative">
      <button
        className="px-2 py-1 text-2xl font-bold text-gray-500 hover:text-gray-800 dark:text-gray-300 dark:hover:text-white"
        onClick={handlePrevProject}
        aria-label="Previous project"
      >
        &#8592;
      </button>
      <div className="relative mx-4">
        <button
          className="px-4 py-2 rounded bg-gray-200 dark:bg-dark-primary text-lg font-semibold shadow hover:bg-gray-300 dark:hover:bg-dark-secondary focus:outline-none"
          onClick={() => setDropdownOpen((open) => !open)}
        >
          {selectedProject?.name || `Project ${selectedProjectIdx + 1}`}
        </button>
        {dropdownOpen && (
          <div className="absolute left-0 right-0 z-10 mt-2 bg-gray-100 dark:bg-gray-100 border border-gray-200 dark:border-gray-700 rounded shadow-lg max-h-60 overflow-y-auto">
            {projects.map((proj: Project, idx: number) => (
              <div
                key={proj.project_ID || idx}
                className={`px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-dark-primary ${idx === selectedProjectIdx ? 'bg-gray-100 dark:bg-dark-primary font-bold' : ''}`}
                onClick={() => handleDropdownSelect(idx)}
              >
                {proj.name || `Project ${idx + 1}`}
              </div>
            ))}
          </div>
        )}
      </div>
      <button
        className="px-2 py-1 text-2xl font-bold text-gray-500 hover:text-gray-800 dark:text-gray-300 dark:hover:text-white"
        onClick={handleNextProject}
        aria-label="Next project"
      >
        &#8594;
      </button>
      {/* Overlay to close dropdown when clicking outside */}
      {dropdownOpen && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setDropdownOpen(false)}
          aria-hidden="true"
        />
      )}
    </div>
  );

  return (
    <div className="container h-full w-[100%] bg-gray-100 bg-transparent p-8">
      <Header name="Project Management Dashboard" />
      {projectSelector}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* Priority Distribution Chart */}
        <div className="rounded-lg bg-white p-4 shadow dark:bg-dark-secondary">
          <h3 className="mb-4 text-lg font-semibold dark:text-white">Task Priority Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={taskDistribution}>
              <CartesianGrid strokeDasharray="3 3" stroke={chartColors.barGrid} />
              <XAxis dataKey="name" stroke={chartColors.text} />
              <YAxis stroke={chartColors.text} interval={0} tickCount={Math.max(...taskDistribution.map(d => d.count), 1)} domain={[0, 'dataMax + 1']} allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill={chartColors.bar} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Task Status Chart */}
        <div className="rounded-lg bg-white p-4 shadow dark:bg-dark-secondary">
          <h3 className="mb-4 text-lg font-semibold dark:text-white">Task Status</h3>
          <ResponsiveContainer width="100%" height={300}>
            {taskStatus[0].count > 0 || taskStatus[1].count > 0 ? (
              <PieChart>
                <Pie dataKey="count" data={taskStatus} label>
                  {taskStatus.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={STATUS_COLORS[entry.name] || "#d1d5db"} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            ) : (
              <div className="flex h-full items-center justify-center text-gray-400">
                No task status data to display.
              </div>
            )}
          </ResponsiveContainer>
        </div>

        {/* Task Data Grid */}
        <div className="rounded-lg bg-white p-4 shadow dark:bg-dark-secondary md:col-span-2">
          <h3 className="mb-4 text-lg font-semibold dark:text-white">Your Tasks</h3>
          <div style={{ height: 400, width: "100%" }}>
            <DataGrid
              rows={tasks}
              columns={taskColumns}
              getRowId={(row) => row.Task_ID ?? row.task_ID ?? row.id}
              checkboxSelection
              loading={tasksLoading}
              className={dataGridClassNames}
              sx={dataGridSxStyles(isDarkMode)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;