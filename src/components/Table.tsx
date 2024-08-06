import React, { useState } from "react";
import {
  Table as MuiTable,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  IconButton,
  TextField,
  InputAdornment,
  Menu,
  MenuItem,
  Tooltip,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import { format, parseISO, isValid } from "date-fns";

interface RowData {
  [key: string]: string;
}

interface TableProps {
  data: RowData[];
  loading: boolean;
  columnLabels: { [key: string]: string };
  onSort: (column: string, direction: "asc" | "desc") => void;
  sortColumn: string | null;
  sortDirection: "asc" | "desc";
}

const formatDate = (dateString: string) => {
  try {
    const date = parseISO(dateString);
    return isValid(date) ? format(date, "MMM d, yyyy") : dateString;
  } catch (error) {
    console.error("Error formatting date:", error);
    return dateString;
  }
};

const Table: React.FC<TableProps> = ({
  data,
  loading,
  columnLabels,
  onSort,
  sortColumn,
  sortDirection,
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [activeColumn, setActiveColumn] = useState<string | null>(null);
  const [searchValues, setSearchValues] = useState<{ [key: string]: string }>(
    {}
  );

  const handleClick = (
    event: React.MouseEvent<HTMLButtonElement>,
    column: string
  ) => {
    setAnchorEl(event.currentTarget);
    setActiveColumn(column);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setActiveColumn(null);
  };

  const handleFilterChange = (
    column: string,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSearchValues((prev) => ({
      ...prev,
      [column]: event.target.value,
    }));
  };

  const applyFilter = () => {
    handleClose();
  };

  const handleSort = (column: string) => {
    const isAscending = sortColumn === column && sortDirection === "asc";
    onSort(column, isAscending ? "desc" : "asc");
  };

  const filteredData = data.filter((row) =>
    Object.keys(row).every(
      (key) =>
        !searchValues[key] ||
        row[key]
          ?.toString()
          .toLowerCase()
          .includes(searchValues[key].toLowerCase())
    )
  );

  const sortedData = React.useMemo(() => {
    if (!sortColumn) return filteredData;

    return [...filteredData].sort((a, b) => {
      const aValue = (a[sortColumn] || "").toString();
      const bValue = (b[sortColumn] || "").toString();

      if (sortDirection === "asc") {
        return aValue.localeCompare(bValue);
      } else {
        return bValue.localeCompare(aValue);
      }
    });
  }, [filteredData, sortColumn, sortDirection]);

  return (
    <TableContainer
      component={Paper}
      sx={{
        marginTop: "16px",
        borderRadius: "8px",
        boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
        overflowX: "auto",
      }}
    >
      <MuiTable>
        <TableHead>
          <TableRow>
            {Object.keys(columnLabels).map((key) => (
              <TableCell
                key={key}
                sx={{
                  backgroundColor: "#3f51b5",
                  color: "#ffffff",
                  fontWeight: 600,
                  textAlign: "center",
                  padding: "8px",
                  position: "relative",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <span>{columnLabels[key]}</span>
                  <div>
                    <Tooltip title="Filter">
                      <IconButton
                        aria-label={`filter by ${columnLabels[key]}`}
                        onClick={(event) => handleClick(event, key)}
                        sx={{ color: "#ffffff", marginLeft: "8px" }}
                      >
                        <SearchIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Sort">
                      <IconButton
                        aria-label={`sort by ${columnLabels[key]}`}
                        onClick={() => handleSort(key)}
                        sx={{ color: "#ffffff", marginLeft: "8px" }}
                      >
                        {sortColumn === key && sortDirection === "asc" ? (
                          <ArrowUpwardIcon />
                        ) : (
                          <ArrowDownwardIcon />
                        )}
                      </IconButton>
                    </Tooltip>
                  </div>
                </div>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl) && activeColumn === key}
                  onClose={handleClose}
                >
                  <MenuItem>
                    <TextField
                      label={`Filter by ${columnLabels[key]}`}
                      value={searchValues[key] || ""}
                      onChange={(event) =>
                        handleFilterChange(
                          key,
                          event as React.ChangeEvent<HTMLInputElement>
                        )
                      }
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          applyFilter();
                        }
                      }}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              aria-label={`apply filter for ${columnLabels[key]}`}
                              onClick={() => applyFilter()}
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
                        width: "200px",
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
                  </MenuItem>
                </Menu>
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell
                colSpan={Object.keys(columnLabels).length}
                sx={{
                  textAlign: "center",
                  padding: "16px",
                }}
              >
                <CircularProgress color="primary" />
                <div>Loading data...</div>
              </TableCell>
            </TableRow>
          ) : sortedData.length > 0 ? (
            sortedData.map((row, index) => (
              <TableRow
                key={index}
                sx={{
                  "&:nth-of-type(odd)": {
                    backgroundColor: "#f5f5f5",
                  },
                  "&:hover": {
                    backgroundColor: "#e8eaf6",
                  },
                }}
              >
                {Object.values(row).map((value, i) => (
                  <TableCell key={i} sx={{ textAlign: "center" }}>
                    {columnLabels[Object.keys(row)[i]]
                      .toLowerCase()
                      .includes("date")
                      ? formatDate(value)
                      : value}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={Object.keys(columnLabels).length}
                sx={{
                  textAlign: "center",
                  padding: "16px",
                }}
              >
                No data available
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </MuiTable>
    </TableContainer>
  );
};

export default Table;
