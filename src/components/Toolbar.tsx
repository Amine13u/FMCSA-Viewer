import React from "react";
import {
  TextField,
  InputAdornment,
  IconButton,
  Toolbar as MuiToolbar,
  Typography,
  Grid,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

interface ToolbarProps {
  filters: { [key: string]: string };
  onFilterChange: (column: string, value: string) => void;
  columnLabels: { [key: string]: string };
}

const Toolbar: React.FC<ToolbarProps> = ({
  filters,
  onFilterChange,
  columnLabels,
}) => (
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
    <Grid container spacing={2}>
      {Object.keys(columnLabels).map((key) => (
        <Grid item xs={12} sm={6} md={4} lg={3} key={key}>
          <TextField
            label={columnLabels[key]}
            value={filters[key] || ""}
            onChange={(event) => onFilterChange(key, event.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label={`search ${columnLabels[key]}`}
                    sx={{ color: "#3f51b5" }}
                  >
                    <SearchIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            variant="outlined"
            margin="normal"
            sx={{
              width: "100%",
              backgroundColor: "#ffffff",
              borderRadius: "0.25rem",
              "& .MuiOutlinedInput-root": {
                borderRadius: "0.25rem",
              },
              "& .MuiInputLabel-root": {
                color: "#757575",
              },
              "& .MuiInputBase-input": {
                padding: "0.5rem",
              },
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "#e0e0e0",
              },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: "#3f51b5",
              },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: "#3f51b5",
              },
            }}
            aria-label={`Filter by ${columnLabels[key]}`}
          />
        </Grid>
      ))}
    </Grid>
  </MuiToolbar>
);

export default Toolbar;
