"use client";

// Imports 
import { useAppDispatch, useAppSelector } from '@/app/redux';
import { setIsSidebarCollapsed } from '@/state';
import { useGetProjectsQuery } from '@/state/api';
import { AlertCircle, AlertOctagon, AlertTriangle, Briefcase, ChevronDown, ChevronUp, Home, Layers3, LockIcon, LucideIcon, Search, Settings, ShieldAlert, User, Users, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useState, useCallback } from 'react';

// interface Dictionary to handle the sidebar links
interface SidebarLinkProps {
  href: string;
  icon: LucideIcon;
  label: string;
}

// Type for a single project (adjust as needed)
interface Project {
  project_ID: string | number;
  name: string;
  // ...other fields
}

// Type for possible API response shapes
type ProjectsResponse = Project[] | { data: Project[]; meta?: any };

// SidebarLinks manager
const SidebarLink = ({ href, icon: Icon, label}: SidebarLinkProps) => {
    const pathname = usePathname();
    const isActive = pathname === href || pathname.startsWith(href + '/');

   return (
    <Link href={href} className="w-full">
        <div
            className={`relative flex cursor-pointer items-center gap-3 px-8 py-3 transition-colors hover:bg-gray-100 dark:bg-black dark:hover:bg-gray-700 ${
                isActive ? 'bg-gray-100 text-white dark:bg-gray-600' : ''}`}
        >
            {isActive && (
                <div className='absolute left-0 top-0 h-[100%] w-[5px] bg-red-200' />
            )}
            <Icon className='h-6 w-6 text-gray-800 dark:text-gray-100' />
            <span className={'font-medium text-gray-800 dark:text-gray-100'}>
                {label}
            </span>
        </div>
    </Link>
   );
}

// Main Sidebar Util
const Sidebar: React.FC = () => {
  // States
  const [showProjects, setShowProjects] = useState(true);
  const [showPriority, setShowPriority] = useState(true);
  const isSidebarCollapsed = useAppSelector((state) => state.global.isSidebarCollapsed);

  // API call
  const { data: projects, error, isLoading } = useGetProjectsQuery() as { data: ProjectsResponse, error: any, isLoading: boolean };
  // If your RTK Query is typed, you may not need the cast above. Adjust as needed.

  const dispatch = useAppDispatch();

  // Type guard for { data: Project[] }
  function hasDataArray(obj: any): obj is { data: Project[] } {
    return obj && typeof obj === "object" && Array.isArray(obj.data);
  }

  // Defensive: ensure projects is always an array
  let safeProjects: Project[] = [];
  if (Array.isArray(projects)) {
    safeProjects = projects;
  } else if (hasDataArray(projects)) {
    safeProjects = projects.data;
  }

  // Sidebar class names
  const sidebarClassNames = `fixed flex flex-col h-[100%] justify-between shadow-xl transition-all duration-300 h-full z-40 dark:bg-black overflow-y-auto bg-white
    ${isSidebarCollapsed ? "w-0 hidden" : "w-64"}`;

  const toggleProjects = useCallback(() => setShowProjects(prev => !prev), []);
  const togglePriority = useCallback(() => setShowPriority(prev => !prev), []);

  return (
    <div className={sidebarClassNames}>
      <div className='flex h-[100%] w-full flex-col justify-start'>
        {/* Company Name */}
        <div className='z-50 flex min-h-[56px] w-64 items-center justify-between bg-white px-6 pt-3 dark:bg-black'>
          <div className='text-xl font-bold text-gray-800 dark:text-white'>
            AGILE
          </div>
          {/* Closure Button */}
          <div>
            {isSidebarCollapsed ? null : (
              <button
                className="py-3"
                aria-label="Collapse sidebar"
                onClick={() => {
                  dispatch(setIsSidebarCollapsed(!isSidebarCollapsed));
                }}>
                <X className="h-6 w-6 text-gray-800 hover:text-gray-500 dark:text-white" />
              </button>
            )}
          </div>
        </div>

        {/* Team View */}
        <div className='flex items-center gap-5 border-y-[1.5px] border-gray-200 px-8 py-4 dark:border-gray-600'>
          <Image
            src='/logo.jpg'
            alt="Agile Team Logo"
            width={40}
            height={40}
            priority={true}
            quality={85}
            className="rounded-full"
            style={{
              objectFit: 'cover',
              objectPosition: 'center',
            }}
          />
          <div>
            <h3 className='text-md font-bold tracking-wide dark:text-gray-200'>
              AGILE TEAM
            </h3>
            <div className='mt-1 flex items-start gap-2'>
              <LockIcon className='mt-[0.1rem] h-3 w-3 text-gray-500 dark:text-gray-400' />
              <p className='text-xs text-gray-500'>Private</p>
            </div>
          </div>
        </div>

        {/* Sidebar Links */}
        <nav className="z-10 w-full">
          <SidebarLink icon={Home} label="Home" href="/" />
          <SidebarLink icon={Briefcase} label="Scrum" href="/timeline" />
          <SidebarLink icon={Search} label="Search" href="/search" />
          <SidebarLink icon={Settings} label="Settings" href="/settings" />
          <SidebarLink icon={User} label="Users" href="/users" />
          <SidebarLink icon={Users} label="Teams" href="/teams" />
        </nav>

        {/* Project Viewer Setup */}
        <button
          onClick={toggleProjects}
          className='flex w-full items-center justify-between px-8 py-3 text-gray-500'
          aria-label="Toggle projects section"
        >
          <span>Projects</span>
          {showProjects ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
        </button>
        {/* Lists Projects */}
        {showProjects && safeProjects.map((project: Project) => (
          <SidebarLink
            key={project.project_ID}
            icon={Briefcase}
            label={project.name}
            href={`/projects/${project.project_ID}`}
          />
        ))}

        {/* Priority Viewer Setup */}
        <button
          onClick={togglePriority}
          className='flex w-full items-center justify-between px-8 py-3 text-gray-500'
          aria-label="Toggle prioritised tasks section"
        >
          <span>Prioritsed Tasks</span>
          {showPriority ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
        </button>

        {/* Lists Prioritsed Tasks */}
        {showPriority && (
          <>
            <SidebarLink icon={AlertCircle} label="Urgent" href="/priority/urgent" />
            <SidebarLink icon={ShieldAlert} label="High" href="/priority/high" />
            <SidebarLink icon={AlertTriangle} label="Medium" href="/priority/medium" />
            <SidebarLink icon={AlertOctagon} label="Low" href="/priority/low" />
            <SidebarLink icon={Layers3} label="Backlog" href="/priority/backlog" />
          </>
        )}
      </div>
    </div>
  );
};

export default Sidebar;