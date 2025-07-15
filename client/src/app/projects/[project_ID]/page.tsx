"use client";

// Import
import React, { useState } from 'react';
import ProjectHeader from "@/app/projects/ProjectHeader";
import BoardView from '../BoardView';
import List from '../ListView';
import Timeline from "../TimelineView";

// Type definition for Project component props
type Props = {
    params: {project_ID: string}
}


// Main Project component
const Project = ({ params }: Props) => {
  const { project_ID } = params;
  const [activeTab, setActiveTab] = useState("Board");
  const [isModalNewTaskOpen, setIsModalNewTaskOpen] = useState(false);

// Render
  return (
    <div>
        {/* new task */}
    <ProjectHeader activeTab={activeTab} setActiveTab={setActiveTab} />
    { activeTab === "Board" && (
      <BoardView project_ID={project_ID} setIsModalNewTaskOpen={setIsModalNewTaskOpen}/>
    )}
    {activeTab === "List" && (
     <List project_ID={project_ID} setIsModalNewTaskOpen={setIsModalNewTaskOpen}/>
    )}
    {activeTab === "Timeline" && (
     <Timeline project_ID={project_ID} setIsModalNewTaskOpen={setIsModalNewTaskOpen}/>
    )}
    </div>
  )
}

export default Project