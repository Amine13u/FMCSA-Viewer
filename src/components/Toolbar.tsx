import React from "react";
import { Toolbar as MuiToolbar, Typography } from "@mui/material";

interface ToolbarProps {
  filters: { [key: string]: string };
  onFilterChange: (column: string, value: string) => void;
  columnLabels: { [key: string]: string };
}

const Toolbar: React.FC<ToolbarProps> = () => (
  <MuiToolbar
    sx={{
      backgroundColor: "#f5f5f5",
      borderBottom: "1px solid #e0e0e0",
      display: "flex",
      flexDirection: "column",
      padding: "1reù",
      boxShadow: "0 0.125rem 0.25rem rgba(0, 0, 0, 0.1)",
    }}
  >
    <Typography
      variant="h4"
      sx={{
        color: "#3f51b5",
        fontWeight: 600,
        marginBottom: "1rem",
      }}
    >
      FMCSA Viewer
    </Typography>
  </MuiToolbar>
);

export default Toolbar;
