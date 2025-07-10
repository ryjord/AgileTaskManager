import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { result } from "lodash";

export interface Project {
    project_ID: number;
    name: string; 
    description?: string;
    startDate?: string;
    endDate?: string;
}

export enum TaskStatus {
  TODO = 'To Do',
  IN_PROGRESS = 'Work In Progres',
  DONE = 'Task Completed',
  REVIEW = 'Under Review'
}

export enum TaskPriority {
  LOW = "Low",
  MEDIUM = 'Medium',
  HIGH = 'High',
  CRITICAL = 'Critical',
  BACKLOG = 'Backlog'
}

export interface User {
  user_ID?: number;
  username: string;
  email: string;
  profilePictureUrl?: string;
  cognito_ID: string;
  team_ID?: number;
}

export interface Attachment {
  attachment_ID: number;     
  fileURL: string;
  fileName: string;
  task_ID: number;     
  uploadedById: number;    
}


export interface Task {
    Task_ID: number;
    title: string;
    description?: string;
    status?: TaskStatus;
    priority?: TaskPriority;
    tags?: string;
    startDate?: string;
    dueDate?: string;
    points?: number;
    project_ID: number;
    author_user_ID?: number;
    assigned_user_ID?: number;
    updatedAt: string;

    author?: User;
    assignee?: User;
    comments?: Comment[];
    attachments?: Attachment[];
}

export const api = createApi({
    baseQuery: fetchBaseQuery({ baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL }),
    reducerPath: 'api',
    tagTypes: ["Projects", 'Tasks'],
    endpoints: (build) => ({
      getProjects: build.query<Project[], void>({
        query: () => "projects",
        providesTags: ["Projects"],
      }),
      createProject: build.mutation<Project, Partial<Project>>({
        query: (project) => ({
          url: "projects",
          method: "POST",
          body: project
        }),
        invalidatesTags: ["Projects"],
      }),
      getTasks: build.query<Task[], {project_ID: number}>({
        query: ({project_ID}) => 'tasks?project_ID=${project_ID}=65',
        providesTags: (result) => result ? result.map(({Task_ID}) => ({type: 'Tasks' as const, Task_ID})) : [{type: "Tasks" as const}],
      }),
      createTask: build.mutation<Task, Partial<Task>>({
        query: (Task) => ({
          url: "tasks",
          method: "POST",
          body: Task
        }),
        invalidatesTags: ["Tasks"],
      }),
      UpdateTaskStatus: build.mutation<Task, {Task_ID: number; status: string}>({
        query: ({Task_ID, status}) => ({
          url: 'tasks/${task_ID}/status',
          method: "PATCH",
          body: { status }
        }),
        invalidatesTags: (result, error, {Task_ID}) => [
          {type: "Tasks", id: Task_ID},
        ],
      }),
    }),
    
})

// Export the api object for use in store setup and hooks
export const { useGetProjectsQuery, useCreateProjectMutation, useGetTasksQuery, useCreateTaskMutation} = api;