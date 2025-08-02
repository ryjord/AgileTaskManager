
// Imports 
import Modal from "@/components/Modal";
import { TaskStatus, TaskPriority, useCreateTaskMutation } from "@/state/api";
import React, { useState } from "react";
import { formatISO } from "date-fns";

// Type definitions
type NewTasksProps = {
  isOpen: boolean;
  onClose: () => void;
  project_ID?: string | null;
};

// ModalNewTask component
const ModalNewTask = ({ isOpen, onClose, project_ID = null }: NewTasksProps) => {

  // State variables redeclaring
  const [createTask, { isLoading }] = useCreateTaskMutation();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<string>("TODO");
  const [priority, setPriority] = useState<string>("BACKLOG");
  const [tags, setTags] = useState("");
  const [startDate, setStartDate] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [author_user_ID, setAuthorUserId] = useState("");
  const [assigned_user_ID, setAssignedUserId] = useState("");
  const [localProjectId, setproject_ID] = useState("");

  // Effect to set localProjectId if project_ID is null
  const handleSubmit = async () => {
    console.log('handleSubmit function called');
    // Check if form is valid
  if (!title || !author_user_ID || (!project_ID && !localProjectId)) {
  console.log('Form is invalid, not creating task');
}
  try {
    const formattedStartDate = formatISO(new Date(startDate), {
      representation: "complete",
    });
    const formattedDueDate = formatISO(new Date(dueDate), {
      representation: "complete",
    });
    // Log the values for debugging
    console.log('status:', status);
    console.log('priority:', priority);

    // Create task using the createTask mutation
    const result = await createTask({
      title,
      description,
      status: status as TaskStatus,
      priority: priority as TaskPriority,
      tags,
      startDate: formattedStartDate,
      dueDate: formattedDueDate,
      author_user_ID: parseInt(author_user_ID),
      assigned_user_ID: parseInt(assigned_user_ID),
      project_ID: project_ID !== null ? Number(project_ID) : Number(localProjectId),
    });

    // Check if the result contains an error
    if ('error' in result) {
      console.error('Failed to create task:', result.error);
    } else {
      onClose(); // Close modal on success
    }
  } catch (error) {
    console.error('Error creating task:', error);
  }
};

// Function to validate form inputs
 const isFormValid = () => {
  return title && author_user_ID && (project_ID !== null || localProjectId);
};

  const selectStyles =
    "mb-4 block w-full rounded border border-gray-300 px-3 py-2 dark:border-dark-tertiary dark:bg-dark-tertiary dark:text-white dark:focus:outline-none";

  const inputStyles =
    "w-full rounded border border-gray-300 p-2 shadow-sm dark:border-dark-tertiary dark:bg-dark-tertiary dark:text-white dark:focus:outline-none";

    // return early if not open
  return (
    <Modal isOpen={isOpen} onClose={onClose} name="Create New Task">
      <form className="mt-4 space-y-6" onSubmit={(e) => {
        console.log('form submitted');
        e.preventDefault();
        handleSubmit();}}>

        {/* Form Fields for status and priority*/}
        <input type="text" className={inputStyles} placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
        <textarea className={inputStyles} placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-2">
          <select className={selectStyles} value={status} onChange={(e) => setStatus(e.target.value as TaskStatus)}>
            <option value="TODO">To Do</option>
            <option value="IN_PROGRESS">Work In Progress</option>
            <option value="REVIEW">Under Review</option>
            <option value="DONE">Completed</option>
          </select>
          <select className={selectStyles} value={priority} onChange={(e) => setPriority(e.target.value as TaskPriority)}>
            <option value="CRITICAL">Critical</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
            <option value="BACKLOG">Backlog</option>
          </select>
        </div>
        {/* Input fields for tags, dates, author and assigned user IDs */}
          <input type="text" className={inputStyles} placeholder="Tags (comma separated)" value={tags} onChange={(e) => setTags(e.target.value)}/>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-2">
            <input type="date" className={inputStyles} value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            <input type="date" className={inputStyles} value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
          </div>
          
          <input type="text" className={inputStyles} placeholder="Author User ID" value={author_user_ID} onChange={(e) => setAuthorUserId(e.target.value)} />
          <input type="text" className={inputStyles} placeholder="Assigned User ID" value={assigned_user_ID} onChange={(e) => setAssignedUserId(e.target.value)} />
          <button type="submit" className={`focus-offset-2 mt-4 flex w-full justify-center rounded-md border border-transparent bg-blue-primary px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600 ${ !isFormValid() || isLoading ? "cursor-not-allowed opacity-50" : "" }`}disabled={!isFormValid() || isLoading}>
            {isLoading ? "Creating..." : "Create Task"}
          </button>
      </form>
    </Modal>
  );
};

export default ModalNewTask;