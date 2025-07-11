
import type { DropTargetMonitor, DragSourceMonitor } from "react-dnd";
import React from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useGetTasksQuery, useUpdateTaskStatusMutation, Task as TaskType } from "@/state/api";
import { EllipsisVertical, MessageSquareMore, Plus } from "lucide-react";
import { format } from "date-fns";
import Image from "next/image";

type BoardProps = {
  project_ID: string;
  setIsModalNewTaskOpen: (isOpen: boolean) => void;
};

const taskStatus = ["To Do", "Work In Progress", "Under Review", "Task Completed"];

// Mapping backend status to display status
const statusMap: Record<string, string> = {
  "TODO": "To Do",
  "IN_PROGRESS": "Work In Progress",
  "REVIEW": "Under Review",      
  "DONE": "Task Completed",     
};

// Reverse mapping for updating backend
const reverseStatusMap: Record<string, string> = {
  "To Do": "TODO",
  "Work In Progress": "IN_PROGRESS",
  "Under Review": "REVIEW",      
  "Task Completed": "DONE",      
};

const BoardView = ({ project_ID, setIsModalNewTaskOpen }: BoardProps) => {
  const { data: tasks, isLoading, error } = useGetTasksQuery({ project_ID: Number(project_ID) });

  const [updateTaskStatus] = useUpdateTaskStatusMutation();

  // Defensive: ensure tasks is always an array and map statuses for display
  // Add displayStatus for UI, keep status for backend logic
  const safeTasks: (TaskType & { displayStatus: string })[] = Array.isArray(tasks?.data)
    ? tasks.data.map(task => {
        const id = (task as any).Task_ID ?? (task as any).task_ID;
        return {
          ...task,
          Task_ID: id,
          displayStatus: statusMap[task.status as string] || String(task.status)
        };
      })
    : [];

  const moveTask = (Task_ID: number, toDisplayStatus: string) => {
    if (typeof Task_ID !== 'number' || isNaN(Task_ID)) {
      console.error('Invalid Task_ID for moveTask:', Task_ID);
      return;
    }
    updateTaskStatus({ Task_ID, status: reverseStatusMap[toDisplayStatus] || toDisplayStatus });
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>An error occurred while fetching tasks</div>;

  return (
      <DndProvider backend={HTML5Backend}>
        <div className="grid grid-cols-1 gap-4 p-4 md:grid-cols-2 xl:grid-cols-4">
          {taskStatus.map((displayStatus) => (
            <TaskColumn
              key={displayStatus}
              displayStatus={displayStatus}
              tasks={safeTasks}
              moveTask={moveTask}
              setIsModalNewTaskOpen={setIsModalNewTaskOpen}
            />
          ))}
        </div>
      </DndProvider>
  );
};

type TaskColumnProps = {
  displayStatus: string;
  tasks: (TaskType & { displayStatus: string })[];
  moveTask: (Task_ID: number, toDisplayStatus: string) => void;
  setIsModalNewTaskOpen: (isOpen: boolean) => void;
};

// Utility function to get status color class
const getStatusColorClass = (status: string) => {
  switch (status) {
    case "To Do":
      return "bg-status-todo";
    case "Work In Progress":
      return "bg-status-inprogress";
    case "Under Review":
      return "bg-status-review";
    case "Task Completed":
      return "bg-status-completed";
    default:
      return "bg-gray-200";
  }
};

const TaskColumn = ({
  displayStatus,
  tasks,
  moveTask,
  setIsModalNewTaskOpen,
}: TaskColumnProps) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: "task",
    drop: (item: { Task_ID: number }) => moveTask(item.Task_ID, displayStatus),
    collect: (monitor: DropTargetMonitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  // Memoize filtered tasks for this column
  const tasksForColumn = React.useMemo(
    () => tasks.filter((task) => task.displayStatus === displayStatus),
    [tasks, displayStatus]
  );
  const tasksCount = tasksForColumn.length;

  const ref = React.useRef<HTMLDivElement>(null);
  drop(ref);

  return (
    <div
      ref={ref}
      className={`sl:py-4 rounded-lg py-2 xl:px-2 ${isOver ? "bg-blue-100 dark:bg-neutral-950" : ""}`}
    >
      <div className="mb-3 flex w-full">
        <div
          className={`w-2 ${getStatusColorClass(displayStatus)} rounded-s-lg`}
        />
        <div className="flex w-full items-center justify-between rounded-e-lg bg-white px-5 py-4 dark:bg-dark-secondary">
          <h3 className="flex items-center text-lg font-semibold dark:text-white">
            {displayStatus}{" "}
            <span
              className="ml-2 inline-block rounded-full bg-gray-200 p-1 text-center text-sm leading-none dark:bg-dark-tertiary"
              style={{ width: "1.5rem", height: "1.5rem" }}
            >
              {tasksCount}
            </span>
          </h3>
          <div className="flex items-center gap-1">
            <button className="flex h-6 w-5 items-center justify-center dark:text-neutral-500">
              <EllipsisVertical size={26} />
            </button>
            <button
              className="flex h-6 w-6 items-center justify-center rounded bg-gray-200 dark:bg-dark-tertiary dark:text-white"
              onClick={() => setIsModalNewTaskOpen(true)}
            >
              <Plus size={16} />
            </button>
          </div>
        </div>
      </div>

      {tasksForColumn.map((task, idx) => (
        <Task key={task.Task_ID ?? `task-fallback-${idx}`} task={task} />
      ))}
    </div>
  );
};

type TaskProps = {
  task: TaskType & { displayStatus: string };
};

const PriorityTag = ({ priority }: { priority: TaskType["priority"] }) => (
  <div
    className={`rounded-full px-2 py-1 text-xs font-semibold ${
      priority === "Critical"
        ? "bg-red-200 text-red-700"
        : priority === "High"
          ? "bg-yellow-200 text-yellow-700"
          : priority === "Medium"
            ? "bg-green-200 text-green-700"
            : priority === "Low"
              ? "bg-blue-200 text-blue-700"
              : "bg-gray-200 text-gray-700"
    }`}
  >
    {priority}
  </div>
);

const Task = ({ task }: TaskProps) => {
  const ref = React.useRef<HTMLDivElement>(null);
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "task",
    item: { Task_ID: task.Task_ID },
    collect: (monitor: DragSourceMonitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  drag(ref);

  const taskTagsSplit = task.tags ? task.tags.split(",") : [];

  const formattedStartDate = task.startDate
    ? format(new Date(task.startDate), "P")
    : "";
  const formattedDueDate = task.dueDate
    ? format(new Date(task.dueDate), "P")
    : "";

  const numberOfComments = (task.comments && task.comments.length) || 0;

  return (
    <div
      ref={ref}
      className={`mb-4 rounded-md bg-white shadow dark:bg-dark-secondary ${
        isDragging ? "opacity-50" : "opacity-100"
      }`}
    >
      {task.attachments && task.attachments.length > 0 && (() => {
        const fileURL = task.attachments[0].fileURL;
        const safeFileURL = typeof fileURL === "string" && fileURL.match(/^[\w\-./]+$/) ? `/${fileURL}` : "/default-attachment.png";
        return (
          <Image
            src={safeFileURL}
            alt={task.attachments[0].fileName || "attachment"}
            width={400}
            height={200}
            className="h-auto w-full rounded-t-md"
          />
        );
      })()}
      <div className="p-4 md:p-6">
        <div className="flex items-start justify-between">
          <div className="flex flex-1 flex-wrap items-center gap-2">
            {task.priority && <PriorityTag priority={task.priority} />}
            <div className="flex gap-2">
              {taskTagsSplit.map((tag, idx) => (
                <div
                  key={`${task.Task_ID ?? "noid"}-tag-${tag.trim()}-${idx}`}
                  className="rounded-full bg-blue-100 px-2 py-1 text-xs"
                >
                  {tag}
                </div>
              ))}
            </div>
          </div>
          <button className="flex h-6 w-4 flex-shrink-0 items-center justify-center dark:text-neutral-500">
            <EllipsisVertical size={26} />
          </button>
        </div>

        <div className="my-3 flex justify-between">
          <h4 className="text-md font-bold dark:text-white">{task.title}</h4>
          {typeof task.points === "number" && (
            <div className="text-xs font-semibold dark:text-white">
              {task.points} pts
            </div>
          )}
        </div>

        <div className="text-xs text-gray-500 dark:text-neutral-500">
          {formattedStartDate && <span>{formattedStartDate} - </span>}
          {formattedDueDate && <span>{formattedDueDate}</span>}
        </div>
        <p className="text-sm text-gray-600 dark:text-neutral-500">
          {task.description}
        </p>
        <div className="mt-4 border-t border-gray-200 dark:border-stroke-dark" />

        {/* Users */}
        <div className="mt-3 flex items-center justify-between">
          <div className="flex -space-x-[6px] overflow-hidden">
            {task.assignee && (() => {
              const profilePictureUrl = task.assignee.profilePictureUrl;
              const safeProfilePictureUrl = typeof profilePictureUrl === "string" && profilePictureUrl.match(/^[\w\-./]+$/) ? `/${profilePictureUrl}` : "/default-avatar.png";
              return (
                <Image
                  key={`assignee-${task.Task_ID ?? "noid"}-${task.assignee.user_ID}`}
                  src={safeProfilePictureUrl}
                  alt={task.assignee.username}
                  width={30}
                  height={30}
                  className="h-8 w-8 rounded-full border-2 border-white object-cover dark:border-dark-secondary"
                />
              );
            })()}
            {task.author && (() => {
              const profilePictureUrl = task.author.profilePictureUrl;
              const safeProfilePictureUrl = typeof profilePictureUrl === "string" && profilePictureUrl.match(/^[\w\-./]+$/) ? `/${profilePictureUrl}` : "/default-avatar.png";
              return (
                <Image
                  key={`author-${task.Task_ID ?? "noid"}-${task.author.user_ID}`}
                  src={safeProfilePictureUrl}
                  alt={task.author.username}
                  width={30}
                  height={30}
                  className="h-8 w-8 rounded-full border-2 border-white object-cover dark:border-dark-secondary"
                />
              );
            })()}
          </div>
          <div className="flex items-center text-gray-500 dark:text-neutral-500">
            <MessageSquareMore size={20} />
            <span className="ml-1 text-sm dark:text-neutral-400">
              {numberOfComments}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BoardView;