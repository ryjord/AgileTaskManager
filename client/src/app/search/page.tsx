"use client";

// Imports
import Header from "@/components/Header";
import ProjectCard from "@/components/ProjectCard";
import TaskCard from "@/components/TaskCard";
import UserCard from "@/components/UserCard";
import { useSearchQuery } from "@/state/api";
import { debounce } from "lodash";
import React, { useEffect, useState } from "react";

// Search component
const Search = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const {
        data: searchResults,
        isLoading,
        isError,
    } = useSearchQuery(searchTerm, {
        skip: searchTerm.length < 3,
    });

    // Debug: log searchTerm and searchResults
    useEffect(() => {
        console.log("searchTerm:", searchTerm);
        console.log("searchResults:", searchResults);
    }, [searchTerm, searchResults]);

    // Debounced search handler to reduce API calls
    const handleSearch = debounce(
        (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
        },
        500,
    );

    // Cleanup function to cancel the debounce on unmount
    useEffect(() => {
        return handleSearch.cancel;
    }, [handleSearch.cancel]);

    // Render the search component
    return (
        <div className="p-8">
        <Header name="Search" />
        <div>
            <input
            type="text"
            placeholder="Search..."
            className="w-1/2 rounded border p-3 shadow"
            onChange={handleSearch}
            />
        </div>
        <div className="p-5">
            {isLoading && <p>Loading...</p>}
            {isError && <p>Error occurred while fetching search results.</p>}
            {!isLoading && !isError && searchResults && (
              <div>
                {/* Tasks Section */}
                <div className="mb-8">
                  <h2 className="text-lg font-semibold mb-2 border-b pb-1 text-gray-900 dark:text-white">Tasks</h2>
                  {searchResults.tasks && searchResults.tasks.filter((task: any) => task.title && task.title.trim() !== '').length > 0 ? (
                    searchResults.tasks
                      .filter((task: any) => task.title && task.title.trim() !== '')
                      .map((task: any) => {
                        const required = {
                          id: task.task_ID || task.id,
                          title: task.title || '',
                        };
                        const optional = Object.entries({
                          description: task.description || '',
                          status: task.status || '',
                          priority: task.priority || '',
                          tags: task.tags || '',
                          startDate: task.startDate || '',
                          dueDate: task.dueDate || '',
                          author: task.author || null,
                          assignee: task.assignee || null,
                          attachments: Array.isArray(task.attachments) ? task.attachments : [],
                        })
                          .filter(([_, v]) => v !== null && v !== undefined && (typeof v !== 'string' || v.trim() !== '') && (!Array.isArray(v) || v.length > 0))
                          .reduce((acc, [k, v]) => ({ ...acc, [k]: v }), {});
                        const normalizedTask = { ...task, ...required, ...optional };
                        return <TaskCard key={normalizedTask.id} task={normalizedTask} />;
                      })
                  ) : (
                    <p className="text-gray-500">No results found.</p>
                  )}
                </div>

                {/* Projects Section */}
                <div className="mb-8">
                  <h2 className="text-lg font-semibold mb-2 border-b pb-1 text-gray-900 dark:text-white">Projects</h2>
                  {searchResults.projects && searchResults.projects.filter((project: any) => project.name && project.name.trim() !== '').length > 0 ? (
                    searchResults.projects
                      .filter((project: any) => project.name && project.name.trim() !== '')
                      .map((project: any) => {
                        const required = {
                          id: project.project_ID || project.id,
                          name: project.name || '',
                        };
                        const optional = Object.entries({
                          description: project.description || '',
                          startDate: project.startDate || '',
                          endDate: project.endDate || '',
                        })
                          .filter(([_, v]) => v !== null && v !== undefined && (typeof v !== 'string' || v.trim() !== ''))
                          .reduce((acc, [k, v]) => ({ ...acc, [k]: v }), {});
                        const normalizedProject = { ...project, ...required, ...optional };
                        return <ProjectCard key={normalizedProject.id} project={normalizedProject} />;
                      })
                  ) : (
                    <p className="text-gray-500">No results found.</p>
                  )}
                </div>

                {/* Users Section */}
                <div className="mb-8">
                  <h2 className="text-lg font-semibold mb-2 border-b pb-1 text-gray-900 dark:text-white">Users</h2>
                  {searchResults.users && searchResults.users.length > 0 ? (
                    searchResults.users.map((user: any) => {
                      const required = {
                        id: user.user_ID || user.userId || user.id,
                        username: user.username || '',
                        email: user.email || '',
                      };
                      const optional = Object.entries({
                        profilePictureUrl: user.profilePictureUrl || '',
                      })
                        .filter(([_, v]) => v !== null && v !== undefined && (typeof v !== 'string' || v.trim() !== ''))
                        .reduce((acc, [k, v]) => ({ ...acc, [k]: v }), {});
                      const normalizedUser = { ...user, ...required, ...optional };
                      return <UserCard key={normalizedUser.id} user={normalizedUser} />;
                    })
                  ) : (
                    <p className="text-gray-500">No results found.</p>
                  )}
                </div>
              </div>
            )}
        </div>
        </div>
    );
};

export default Search;