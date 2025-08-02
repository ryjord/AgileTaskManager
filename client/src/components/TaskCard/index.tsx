
// Import
import { Task } from "@/state/api";
import { format } from "date-fns";
import Image from "next/image";
import React from "react";

// Type definition for Task component props
type LineCardProps = {
  task: Task;
};

// Task component rendering a card for a task
const TaskCard = ({ task }: LineCardProps) => {
  return (
    <div className="mb-3 rounded bg-white p-4 shadow dark:bg-dark-secondary dark:text-white">
      {
        // Render attachments if the task has any
        Array.isArray(task.attachments) && task.attachments.length > 0 && (
          <div>
            <strong>Attachments:</strong>
            <div className="flex flex-wrap">
              {task.attachments.map((attachment: any, idx: number) => (
                <Image
                  key={attachment.fileURL || idx}
                  src={attachment.fileURL ? `/${attachment.fileURL.replace(/^public\//, "")}` : "/default.jpg"}
                  alt={attachment.fileName || 'attachment'}
                  width={400}
                  height={200}
                  className="rounded-md mr-2 mb-2"
                  priority
                  style={{ width: 'auto', height: 'auto' }}
                />
              ))}
            </div>
          </div>
        )
      }
      {
        // Render properties of the task
        [
          { label: 'Title', value: task.title || 'Untitled Task' },
          { label: 'Description', value: task.description || 'No description provided' },
          { label: 'Status', value: task.status || 'No status' },
          { label: 'Priority', value: task.priority || 'No priority' },
          { label: 'Tags', value: task.tags || 'No tags' },
          { label: 'Start Date', value: task.startDate ? format(new Date(task.startDate), "P") : 'Not set' },
          { label: 'Due Date', value: task.dueDate ? format(new Date(task.dueDate), "P") : 'Not set' },
          { label: 'Author', value: task.author && task.author.username ? task.author.username : 'Unknown' },
          { label: 'Assignee', value: task.assignee && task.assignee.username ? task.assignee.username : 'Unassigned' },
        ].map((item) => (
          <p key={item.label}>
            <span className="w-28 flex-shrink-0 text-sm font-medium text-red-600 dark:text-red-400">
              {item.label}:
            </span>
            <span className="ml-1 text-black dark:text-white">{item.value}</span>
          </p>
        ))
      }
    </div>
  );
};

export default TaskCard;