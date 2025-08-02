// Import
import { Project } from "@/state/api";
import React from "react";

// Type definitions
type Props = {
  project: Project;
};


// ProjectCard component
const ProjectCard = ({ project }: Props) => {
  return (
    <div className="rounded border p-4 shadow">
      <h2 className="text-2xl font-bold mb-2 text-black dark:text-white">{project.name || 'Untitled Project'}</h2>
      <p className="text-black dark:text-white">{project.description || 'No description provided'}</p>
      <p>
        <span className="text-red-600 dark:text-red-400">Start Date:</span>
        <span className="ml-1 text-black dark:text-white">{project.startDate ? project.startDate : 'Not set'}</span>
      </p>
      <p>
        <span className="text-red-600 dark:text-red-400">End Date:</span>
        <span className="ml-1 text-black dark:text-white">{project.endDate ? project.endDate : 'Not set'}</span>
      </p>
    </div>
  );
};

export default ProjectCard;