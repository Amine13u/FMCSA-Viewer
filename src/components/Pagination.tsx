import React from "react";
import { TablePagination } from "@mui/material";

interface PaginationProps {
  count: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => void;
  onRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  count,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
}) => (
  <TablePagination
    component="div"
    count={count}
    page={page}
    onPageChange={onPageChange}
    rowsPerPage={rowsPerPage}
    onRowsPerPageChange={onRowsPerPageChange}
    sx={{
      borderTop: "1px solid #e0e0e0",
      backgroundColor: "#ffffff",
      padding: "8px 16px",
      "& .MuiTablePagination-select": {
        marginRight: "16px",
      },
      "& .MuiTablePagination-actions": {
        marginLeft: "auto",
      },
      "& .MuiTypography-caption": {
        color: "#757575",
      },
    }}
  />
);

export default Pagination;
