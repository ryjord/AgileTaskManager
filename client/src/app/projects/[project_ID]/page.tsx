"use client";

// Import
import React, { useState } from 'react';
import ProjectHeader from "@/app/projects/ProjectHeader";
import BoardView from '../BoardView';
import List from '../ListView';
import Timeline from "../TimelineView";
import Table from '../TableView';
import ModalNewTask from '@/components/ModalNewTask';

// Type definition for Project component props
type PageProps = {
    params: {project_ID: string}
}


// Main Project component
const Project = ({ params }: PageProps) => {
  const { project_ID } = params;
  const [activeTab, setActiveTab] = useState("Board");
  const [isModalNewTaskOpen, setIsModalNewTaskOpen] = useState(false);

// Render
  return (
    <div>
        {/* new task */}
       <ModalNewTask 
  isOpen={isModalNewTaskOpen} 
  onClose={() => setIsModalNewTaskOpen(false)} 
  project_ID={project_ID} 
/>
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
    {activeTab === "Table" && (
     <Table project_ID={project_ID} setIsModalNewTaskOpen={setIsModalNewTaskOpen}/>
    )}
    </div>
  )
}

export default Project