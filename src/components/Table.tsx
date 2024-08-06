import React from "react";
import {
  Table as MuiTable,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  TableSortLabel,
} from "@mui/material";
import { format, isValid, parseISO } from "date-fns";

interface RowData {
  [key: string]: string;
}

interface TableProps {
  data: RowData[];
  loading: boolean;
  columnLabels: { [key: string]: string };
  onSort: (column: string, direction: "asc" | "desc") => void;
  sortColumn: string;
  sortDirection: "asc" | "desc";
}

const Table: React.FC<TableProps> = ({
  data,
  loading,
  columnLabels,
  onSort,
  sortColumn,
  sortDirection,
}) => {
  const handleSort = (column: string) => {
    const newDirection =
      sortColumn === column && sortDirection === "asc" ? "desc" : "asc";
    onSort(column, newDirection);
  };

  const sortedData = React.useMemo(() => {
    return [...data].sort((a, b) => {
      if (!sortColumn) return 0;

      const aValue = (a[sortColumn] || "").toString();
      const bValue = (b[sortColumn] || "").toString();

      if (sortDirection === "asc") {
        return aValue.localeCompare(bValue);
      } else {
        return bValue.localeCompare(aValue);
      }
    });
  }, [data, sortColumn, sortDirection]);

  const formatDate = (dateString: string) => {
    try {
      const parsedDate = parseISO(dateString);
      return isValid(parsedDate) ? format(parsedDate, "MM/dd/yyyy") : "";
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Invalid Date";
    }
  };

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
                }}
              >
                <TableSortLabel
                  active={sortColumn === key}
                  direction={sortColumn === key ? sortDirection : "asc"}
                  onClick={() => handleSort(key)}
                  sx={{
                    color: "#ffffff",
                    "&.MuiTableSortLabel-active .MuiTableSortLabel-icon": {
                      color: "#ffffff",
                    },
                  }}
                >
                  {columnLabels[key]}
                </TableSortLabel>
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
                {Object.entries(row).map(([key, value], i) => (
                  <TableCell key={i} sx={{ textAlign: "center" }}>
                    {columnLabels[key]?.includes("Date")
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
