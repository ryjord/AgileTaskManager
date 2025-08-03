import { Clock, Filter, Grid3x3, List, PlusSquare, Share2, Table, Search, Trash2 } from "lucide-react";
import { useDeleteProjectMutation, useGetTasksQuery } from '@/state/api';
import Header from '@/components/Header';
import React, { useState } from 'react'
import ModalNewProject from '@/app/projects/ModalNewProject';

type HeaderProps = {
  activeTab: string;
  setActiveTab: (tabName: string) => void;
};

type TabButtonProps = {
  name: string;
  icon: React.ReactNode;
  setActiveTab: (tabName: string) => void;
  activeTab: string;
};

const ProjectHeader = ({ activeTab, setActiveTab }: HeaderProps) => {
  const [isModalNewProjectOpen, setIsModalNewProjectOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [deleteProject, { isLoading: isDeleting }] = useDeleteProjectMutation();
  const [searchValue, setSearchValue] = useState("");

  // Get current project ID from URL (assuming /projects/[project_ID])
  const projectIdMatch = typeof window !== 'undefined' ? window.location.pathname.match(/projects\/(\d+)/) : null;
  const project_ID = projectIdMatch ? Number(projectIdMatch[1]) : undefined;
  // Fetch tasks for this project to count incomplete
  const { data: tasks } = useGetTasksQuery(project_ID ? { project_ID } : { project_ID: 1 }, { skip: !project_ID });
  const safeTasks = Array.isArray(tasks?.data) ? tasks.data : [];
  const incompleteTasksCount = safeTasks.filter(task => String(task.status) !== "DONE").length;

  const handleDeleteProject = async () => {
    setDeleteError(null);
    if (typeof project_ID !== 'number' || isNaN(project_ID)) {
      setDeleteError('Invalid project ID.');
      return;
    }
    try {
      await deleteProject({ project_ID }).unwrap();
      window.location.href = "/home";
    } catch (err: any) {
      setDeleteError(err?.data?.message || "Failed to delete project.");
    }
  };

  return (
    <div className='px-4 xl:px-6'>
      <ModalNewProject isOpen={isModalNewProjectOpen} onClose={() => setIsModalNewProjectOpen(false)}/>
      <div className='pb-6 pt-6 lg:pb-4 lg:pt-8'>
        <Header name="Product Development" buttonComponent={
          <div className="flex gap-2">
            <button className="flex items-center rounded-md bg-red-primary px-3 py-2 text-white hover:bg-red-600" onClick={() => setIsModalNewProjectOpen(true)}>
              <PlusSquare className="mr-2 h-4 w-4" /> New Boards
            </button>
            <button
              className="flex items-center rounded-md bg-gray-200 px-3 py-2 text-red-600 hover:bg-red-200 dark:bg-dark-tertiary dark:text-white"
              onClick={() => setIsDeleteModalOpen(true)}
              disabled={typeof project_ID !== 'number' || isNaN(project_ID)}
            >
              <Trash2 className="mr-2 h-4 w-4" /> Delete Project
            </button>
          </div>
        }/>
      </div>

      {/* Delete Project Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white dark:bg-dark-secondary rounded-lg shadow-lg p-8 max-w-md w-full">
            <h2 className="text-xl font-bold mb-4 text-red-600">Delete Project?</h2>
            <p className="mb-2">Are you sure you want to delete this project?</p>
            {incompleteTasksCount > 0 ? (
              <p className="mb-2 text-yellow-600">Warning: There are {incompleteTasksCount} incomplete task(s) in this project.</p>
            ) : (
              <p className="mb-2 text-green-600">All tasks are complete.</p>
            )}
            {deleteError && <div className="mb-2 text-red-500">{deleteError}</div>}
            <div className="flex justify-end gap-2 mt-4">
              <button
                className="px-4 py-2 rounded bg-gray-200 dark:bg-dark-tertiary text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-dark-primary"
                onClick={() => setIsDeleteModalOpen(false)}
                disabled={isDeleting}
              >
                No, Cancel
              </button>
              <button
                className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
                onClick={handleDeleteProject}
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting..." : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* tabs */}
      <div className="flex flex-wrap-reverse gap-2 border-y border-gray-200 pb-[8px] pt-2 dark:border-stroke-dark md:items-center">
        <div className="flex flex-1 items-center gap-2 md:gap-4">
          <TabButton
            name="Board"
            icon={<Grid3x3 className="h-5 w-5" />}
            setActiveTab={setActiveTab}
            activeTab={activeTab}
          />
          <TabButton
            name="List"
            icon={<List className="h-5 w-5" />}
            setActiveTab={setActiveTab}
            activeTab={activeTab}
          />
          <TabButton
            name="Timeline"
            icon={<Clock className="h-5 w-5" />}
            setActiveTab={setActiveTab}
            activeTab={activeTab}
          />
          <TabButton
            name="Table"
            icon={<Table className="h-5 w-5" />}
            setActiveTab={setActiveTab}
            activeTab={activeTab}
          />
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="text-gray-500 hover:text-gray-600 dark:text-neutral-500 dark:hover:text-gray-300"
            aria-label="Filter"
          >
            <Filter className="h-5 w-5" />
          </button>
          <button
            type="button"
            className="text-gray-500 hover:text-gray-600 dark:text-neutral-500 dark:hover:text-gray-300"
            aria-label="Share"
          >
            <Share2 className="h-5 w-5" />
          </button>
          <div className="relative">
            <input
              type="text"
              placeholder="Search Task"
              value={searchValue}
              onChange={e => setSearchValue(e.target.value)}
              className="rounded-md border py-1 pl-10 pr-4 focus:outline-none dark:border-dark-secondary dark:bg-dark-secondary dark:text-white"
            />
            <Search className="absolute left-3 top-2 h-4 w-4 text-gray-400 dark:text-neutral-500" />
          </div>
        </div>
      </div>
    </div>
  );
};

const TabButton = React.memo(({ name, icon, setActiveTab, activeTab }: TabButtonProps) => {
  const isActive = activeTab === name;

  return (
    <button
      type="button"
      className={`relative flex items-center gap-2 px-1 py-2 text-gray-500 after:absolute after:-bottom-[9px] after:left-0 after:h-[1px] after:w-full hover:text-red-600 dark:text-neutral-500 dark:hover:text-white sm:px-2 lg:px-4 ${
        isActive ? "text-red-600 after:bg-red-600 dark:text-white" : ""
      }`}
      onClick={() => setActiveTab(name)}
    >
      {icon}
      {name}
    </button>
  );
});

export default ProjectHeader;