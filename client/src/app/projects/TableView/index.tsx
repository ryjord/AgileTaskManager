
// Imports
import { useAppSelector } from "@/app/redux";
import Header from "@/components/Header";
import { dataGridClassNames, dataGridSxStyles } from "@/lib/utils";
import { useGetTasksQuery } from "@/state/api";
import { DataGrid, GridColDef } from "@mui/x-data-grid";


// Type definition for Table component props
type TableProps = {
  project_ID: string;
  setIsModalNewTaskOpen: (isOpen: boolean) => void;
};

// Custom cell renderers
const StatusCell = ({ value }: { value: string }) => (
  <span className="inline-flex rounded-full bg-green-100 px-2 text-xs font-semibold leading-5 text-green-800">
    {value}
  </span>
);

// Custom cell renderers (with fallback)
const UserCell = ({ value, fallback }: { value?: { username: string }, fallback: string }) => (
  value?.username || fallback
);

// Column definitions for the table
const columns: GridColDef[] = [
  { field: "title", headerName: "Title", width: 100 },
  { field: "description", headerName: "Description", width: 200 },
  { field: "status", headerName: "Status", width: 130, renderCell: (params) => <StatusCell value={params.value} />},
  { field: "priority", headerName: "Priority", width: 75 },
  { field: "tags", headerName: "Tags", width: 130 },
  { field: "startDate", headerName: "Start Date", width: 130 },
  { field: "dueDate", headerName: "Due Date", width: 130 },
  { field: "author", headerName: "Author", width: 150, renderCell: (params) => <UserCell value={params.row.author} fallback="Unknown" />},
  { field: "assignee", headerName: "Assignee", width: 150, renderCell: (params) => <UserCell value={params.row.assignee} fallback="Unassigned" />
  },
];

// Add task button
const AddTaskButton = ({ onClick }: { onClick: () => void }) => (
  <button
    className="flex items-center rounded bg-blue-primary px-3 py-2 text-white hover:bg-blue-600"
    onClick={onClick}
  >
    Add Task
  </button>
);

// Main Table component
export const TableView = ({ project_ID, setIsModalNewTaskOpen }: TableProps) => {
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);
  const { data: tasks, error, isLoading } = useGetTasksQuery({ 
    project_ID: Number(project_ID) 
  });

  if (isLoading) return <div>Loading...</div>;
  if (error || !tasks) return <div>Error fetching tasks</div>;

  // Render the table
  return (
    <div className="h-[540px] w-full px-4 pb-8 xl:px-6">
      <div className="pt-5">
        <Header
          name="Table"
          buttonComponent={<AddTaskButton onClick={() => setIsModalNewTaskOpen(true)} />}
          isSmallText
        />
      </div>
      <DataGrid
        rows={tasks?.data || []}
        columns={columns}
        getRowId={(row) => row.task_ID}
        className={dataGridClassNames}
        sx={dataGridSxStyles(isDarkMode)}
      />
    </div>
  );
};

// Export the Table component
export default TableView;