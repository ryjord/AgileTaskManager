import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// --- Types and Enums ---

console.log('api.ts is being executed');

export interface Project {
  project_ID: number;
  name: string;
  description?: string;
  startDate?: string;
  endDate?: string;
}

export enum TaskStatus {
  TODO = "To Do",
  IN_PROGRESS = "Work In Progress",
  DONE = "Task Completed",
  REVIEW = "Under Review",
}

export enum TaskPriority {
  LOW = "Low",
  MEDIUM = "Medium",
  HIGH = "High",
  CRITICAL = "Critical",
  BACKLOG = "Backlog",
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

export interface SearchResults {
  tasks?: Task[];
  projects?: Project[];
  users?: User[];
}

export interface Team {
  teamId: number;
  teamName: string;
  productOwnerUserId?: number;
  projectManagerUserId?: number;
}

// --- API Slice ---

export const api = createApi({
  baseQuery: fetchBaseQuery({ 
    baseUrl: process.env.NEXT_PUBLIC_API_URL || 'https://agile-task-manager-server.vercel.app/api',
    prepareHeaders: (headers) => {
      // Keep your existing auth logic if you have any
      const token = localStorage.getItem('token');
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    }
  }),
  // Everything below remains exactly the same
  reducerPath: "api",
  tagTypes: ["Projects", "Tasks", "Users", "Teams"],
  endpoints: (build) => ({
    // PlaceHolder AUTH Query

    // Projects Query
    getProjects: build.query<Project[], void>({
      query: () => "projects?limit=100",
      providesTags: ["Projects"],
    }),

    // Create Project Query
    createProject: build.mutation<Project, Partial<Project>>({
      query: (project) => ({
        url: "projects",
        method: "POST",
        body: project,
      }),
      invalidatesTags: ["Projects"],
    }),

    // Tasks Query
    getTasks: build.query<{ data: Task[]; meta: any }, { project_ID: number }>({
      query: ({ project_ID }) => `tasks?project_ID=${project_ID}`,
      providesTags: (result) =>
        Array.isArray(result?.data)
          ? [
              ...result.data.map(({ Task_ID }) => ({
                type: "Tasks" as const,
                id: Task_ID,
              })),
              { type: "Tasks" as const, id: "LIST" },
            ]
          : [{ type: "Tasks" as const, id: "LIST" }],
    }),

    // User Tasks Query
    getTasksByUser: build.query<Task[], number>({
      query: (user_ID) => `tasks/user/${user_ID}`,
      providesTags: (result, error, user_ID) =>
        result
          ? result.map(({ Task_ID }) => ({ type: "Tasks", id: Task_ID }))
          : [{ type: "Tasks", id: user_ID }],
    }),

    // Create Tasks Query
    createTask: build.mutation<Task, Partial<Task>>({
      query: (task) => ({
        url: "tasks",
        method: "POST",
        body: task,
      }),
      invalidatesTags: ["Tasks"],
    }),

    // Update Tasks Status Query
    updateTaskStatus: build.mutation<Task, { Task_ID: number; status: string }>({
      query: ({ Task_ID, status }) => ({
        url: `tasks/${Task_ID}/status`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: (result, error, { Task_ID }) => [
        { type: "Tasks", id: Task_ID },
      ],
    }),

    // Delete Projects Query
    deleteProject: build.mutation<{ success: boolean }, { project_ID: number }>({
      query: ({ project_ID }) => ({
        url: `projects/${project_ID}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Projects", "Tasks"],
    }),

    // Users Query
    getUsers: build.query<User[], void>({
      query: () => "users",
      providesTags: ["Users"],
    }),

    // Teams Query
    getTeams: build.query<Team[], void>({
      query: () => "teams",
      providesTags: ["Teams"],
    }),

    // Search Query
    search: build.query<SearchResults, string>({
      query: (query) => `search?query=${query}`,
    }),
  }),
});

// --- Hooks ---
export const {
  useGetProjectsQuery,
  useCreateProjectMutation,
  useGetTasksQuery,
  useCreateTaskMutation,
  useUpdateTaskStatusMutation,
  useDeleteProjectMutation,
  useGetUsersQuery,
  useGetTeamsQuery,
  useGetTasksByUserQuery,
  useSearchQuery,
} = api;