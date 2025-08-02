import { Clock, Filter, Grid3x3, List, PlusSquare, Share2, Table, Search } from "lucide-react";
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
  const [searchValue, setSearchValue] = useState("");

  return (
    <div className='px-4 xl:px-6'>
      <ModalNewProject isOpen={isModalNewProjectOpen} onClose={() => setIsModalNewProjectOpen(false)}/>
      <div className='pb-6 pt-6 lg:pb-4 lg:pt-8'>
        <Header name="Product Development" buttonComponent={
          <button className="flex items-center rounded-md bg-red-primary px-3 py-2 text-white hover:bg-red-600" onClick={() => setIsModalNewProjectOpen(true)}>
            <PlusSquare className="mr-2 h-4 w-4" /> New Boards
          </button>}/>
      </div>

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