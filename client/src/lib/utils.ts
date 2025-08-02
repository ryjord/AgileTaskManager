
// Styles for the DataGrid
export const dataGridClassNames =
  "border border-gray-200 bg-white shadow dark:border-stroke-dark dark:bg-dark-secondary dark:text-gray-200";

// Styles for the DataGrid with dark mode checks
export const dataGridSxStyles = (isDarkMode: boolean) => {
  return {
    "& .MuiDataGrid-columnHeaders": {
      color: `${isDarkMode ? "#e5e7eb" : ""}`,
      '& [role="row"] > *': {
        backgroundColor: `${isDarkMode ? "#1d1f21" : "white"}`,
        borderColor: `${isDarkMode ? "#2d3135" : ""}`,
      },
    },
    "& .MuiIconbutton-root": {
      color: `${isDarkMode ? "#a3a3a3" : ""}`,
    },
    "& .MuiTablePagination-root": {
      color: `${isDarkMode ? "#a3a3a3" : ""}`,
    },
    "& .MuiTablePagination-selectIcon": {
      color: `${isDarkMode ? "#a3a3a3" : ""}`,
    },
    "& .MuiDataGrid-cell": {
      border: "none",
    },
    "& .MuiDataGrid-row": {
      borderBottom: `1px solid ${isDarkMode ? "#2d3135" : "e5e7eb"}`,
      '&:hover': {
        backgroundColor: isDarkMode ? '#7f1d1d' : '#fee2e2', // dark:red-900, light:red-100
      },
    },
    // Priority cell coloring
    '& .MuiDataGrid-cell[data-field="priority"]': {
      color: isDarkMode ? '#f87171' : '#b91c1c', // red-400 (light), red-700 (dark)
      fontWeight: 600,
      backgroundColor: isDarkMode ? 'rgba(239,68,68,0.08)' : 'rgba(254,226,226,0.7)',
      borderRadius: '6px',
    },
    "& .MuiDataGrid-withBorderColor": {
      borderColor: `${isDarkMode ? "#2d3135" : "e5e7eb"}`,
    },
  };
};