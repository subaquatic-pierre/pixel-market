import React from "react";
import { DataGrid, GridRowsProp, GridColDef } from "@mui/x-data-grid";

import Paper from "@mui/material/Paper";

const rows: GridRowsProp = [
  { id: 1, col1: "Hello", col2: "World" },
  { id: 2, col1: "DataGridPro", col2: "is Awesome" },
  { id: 3, col1: "MUI", col2: "is Amazing" },
];

const columns: GridColDef[] = [
  { field: "col1", headerName: "Column 1", width: 150 },
  { field: "col2", headerName: "Column 2", width: 150 },
];

const AuthorRequestList = () => {
  return (
    <Paper sx={{ height: 300, width: "100%" }}>
      <DataGrid rows={rows} columns={columns} />
    </Paper>
  );
};

export default AuthorRequestList;
