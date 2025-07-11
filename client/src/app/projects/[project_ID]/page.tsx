"use client";

import React, { useState } from 'react';
import ProjectHeader from "@/app/projects/ProjectHeader";
import BoardView from '../BoardView';
type Props = {
    params: {project_ID: string}
}

const Project = ({ params }: Props) => {
  const { project_ID } = params;
  const [activeTab, setActiveTab] = useState("Board");
  const [isModalNewTaskOpen, setIsModalNewTaskOpen] = useState(false);


  return (
    <div>
        {/* new task */}
    <ProjectHeader activeTab={activeTab} setActiveTab={setActiveTab} />
    { activeTab === "Board" && (
      <BoardView project_ID={project_ID} setIsModalNewTaskOpen={setIsModalNewTaskOpen}/>
      
    )}
    </div>
  )
}

export default Project