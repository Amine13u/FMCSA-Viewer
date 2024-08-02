import React, { useState, useEffect, useCallback, useMemo } from "react";
import Toolbar from "./components/Toolbar";
import Table from "./components/Table";
import Pagination from "./components/Pagination";
import "./App.css";

interface RowData {
  [key: string]: string;
}

const columnLabels: { [key: string]: string } = {
  created_dt: "Created Date",
  data_source_modified_dt: "Modified Date",
  entity_type: "Entity Type",
  operating_status: "Operating Status",
  legal_name: "Legal Name",
  dba_name: "DBA Name",
  physical_address: "Physical Address",
  phone: "Phone",
  usdot_number: "DOT Number",
  mc_mx_ff_number: "MC/MX/FF Number",
  power_units: "Power Units",
  out_of_service_date: "Out of Service Date",
};

const CHUNK_SIZE = 10;
const SPREADSHEET_ID = "1hB_LjBT9ezZigXnC-MblT2PXZledkZqBnvV23ssfSuE";

const App: React.FC = () => {
  const [data, setData] = useState<RowData[]>([]);
  const [filters, setFilters] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(CHUNK_SIZE);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async (page: number, rowsPerPage: number) => {
    setLoading(true);
    setError(null);
    const startRow = page * rowsPerPage;

    try {
      const response = await fetch(
        `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/gviz/tq?tqx=out:json&tq=SELECT%20A,B,C,D,E,F,G,L,R,S,T,V%20LIMIT%20${rowsPerPage}%20OFFSET%20${startRow}`
      );
      const text = await response.text();
      const json = JSON.parse(text.substring(47, text.length - 2));
      const rows: RowData[] = json.table.rows.map((row: any) => {
        const rowData: RowData = {};
        row.c.forEach((cell: any, index: number) => {
          const columnName = json.table.cols[index].label;
          if (columnLabels[columnName]) {
            rowData[columnName] = cell?.v || "";
          }
        });
        return rowData;
      });

      setData(rows);
    } catch (error) {
      console.error("Error fetching data from Google Sheets", error);
      setError("Failed to load data. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData(page, rowsPerPage);
  }, [fetchData, page, rowsPerPage]);

  const filteredData = useMemo(() => {
    return data.filter((row) =>
      Object.keys(filters).every(
        (key) =>
          row[key]
            ?.toString()
            .toLowerCase()
            .includes(filters[key].toLowerCase()) || !filters[key]
      )
    );
  }, [data, filters]);

  const handleFilterChange = (column: string, value: string) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [column]: value,
    }));
    setPage(0);
  };

  const handleChangePage = (
    _: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <div className="App">
      <Toolbar
        filters={filters}
        onFilterChange={handleFilterChange}
        columnLabels={columnLabels}
      />
      {error && <div className="error-message">{error}</div>}
      <Table
        data={filteredData}
        loading={loading}
        columnLabels={columnLabels}
      />
      <Pagination
        count={100000}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </div>
  );
};

export default App;
