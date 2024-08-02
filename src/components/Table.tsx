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
} from "@mui/material";

interface RowData {
  [key: string]: string;
}

interface TableProps {
  data: RowData[];
  loading: boolean;
  columnLabels: { [key: string]: string };
}

const Table: React.FC<TableProps> = ({ data, loading, columnLabels }) => (
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
              {columnLabels[key]}
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
        ) : data.length > 0 ? (
          data.map((row, index) => (
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
                  {value}
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

export default Table;
