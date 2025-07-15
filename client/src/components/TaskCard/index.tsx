
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
        task.attachments && task.attachments.length > 0 && (
          <div>
            <strong>Attachments:</strong>
            <div className="flex flex-wrap">
              {
                // Render the first attachment as an image
                // TODO: render all attachments, not just the first one
                task.attachments && task.attachments.length > 0 && (
                  <Image
                    src={`/${task.attachments[0].fileURL}`}
                    alt={task.attachments[0].fileName}
                    width={400}
                    height={200}
                    className="rounded-md"
                    priority
                    style={{ width: 'auto', height: 'auto' }}
                  />
                )
              }
            </div>
          </div>
        )
      }
      {
        // Render properties of the task
        [
          { label: 'Title', value: task.title },
          { label: 'Description', value: task.description || 'No description provided' },
          { label: 'Status', value: task.status },
          { label: 'Priority', value: task.priority },
          { label: 'Tags', value: task.tags || 'No tags' },
          { label: 'Start Date', value: task.startDate ? format(new Date(task.startDate), "P") : 'Not set' },
          { label: 'Due Date', value: task.dueDate ? format(new Date(task.dueDate), "P") : 'Not set' },
          { label: 'Author', value: task.author ? task.author.username : 'Unknown' },
          { label: 'Assignee', value: task.assignee ? task.assignee.username : 'Unassigned' },
        ].map((item) => (
          <p key={item.label}>
            <strong className={`w-28 flex-shrink-0 text-sm font-medium ${item.label ? 'text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-300'}`}>
              {item.label}:
            </strong> {item.value}
          </p>
        ))
      }
    </div>
  );
};

export default TaskCard;