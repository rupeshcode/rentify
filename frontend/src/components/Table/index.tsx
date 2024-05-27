import { useState, ChangeEvent, ReactNode, PropsWithChildren } from "react";
import scss from "./RolexTable.module.scss";
import {
  ColumnDef,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { RiArrowUpSLine, RiPushpinFill, RiUnpinFill } from "react-icons/ri";
import { PiFileCsv, PiMicrosoftExcelLogo } from "react-icons/pi";
import { FiSearch } from "react-icons/fi";
import useRolexTable from "./useRolexTable";
import { FaFileExport } from "react-icons/fa6";
import { TbArrowsSort, TbTableColumn } from "react-icons/tb";
import { IoCalendarSharp } from "react-icons/io5";
import writeXlsxFile from "write-excel-file";
import { download, generateCsv, mkConfig } from "export-to-csv";
import Pagination, { PaginationActions } from "./Pagination";
import fetcher from "@/utils/fetcher";
import { clsx, isValidDate } from "@/utils/string";
import {
  ActionIcon,
  Button,
  Menu,
  Popover,
  Switch,
  Table,
  TextInput,
  Tooltip,
} from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";

type RolexTableProps = {
  title?: string;
  columns: ColumnDef<any, any>[];
  state: ReturnType<typeof useRolexTable>;
  children?: ReactNode;
  children2?: ReactNode;
  canSearch?: boolean;
  canFilterByDate?: boolean;
  canFilterColumns?: boolean;
  canExport?: boolean;
};

const RolexTable = ({
  title,
  columns,
  state,
  children = null,
  children2 = null,
  canSearch = false,
  canFilterByDate = false,
  canFilterColumns = true,
  canExport = false,
}: RolexTableProps) => {
  const [visibleCols, setVisibleCols] = useState<VisibilityState>({});

  const handleStartDateChange = (value: any) => {
    state.setStartDate(
      value.toLocaleDateString("sv", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        timeZone: "Asia/Kolkata",
      })
    );
    state.setEndDate("");
  };

  const handleEndDateChange = (value: any) => {
    state.setEndDate(
      value.toLocaleDateString("sv", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        timeZone: "Asia/Kolkata",
      })
    );
  };

  const table = useReactTable({
    data: state.data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    state: { columnVisibility: visibleCols },
    onColumnVisibilityChange: setVisibleCols,
    columnResizeMode: "onChange",
    manualPagination: true,
    manualSorting: true,
  });

  const handleSearchChange = (evt: ChangeEvent<HTMLInputElement>) =>
    state.setSearchQuery(evt.target.value);

  const setPageSize = (pageSize: number) =>
    state.setPaginationState({
      type: PaginationActions.SET_PAGE_SIZE,
      payload: { pageSize },
    });

  const exportCsv = async () => {
    const dataRows = await fetcher(`${state.apiPath}/export`, "POST");
    const columnHeaders = table
      .getAllLeafColumns()
      .filter((col) => !!col.accessorFn)
      .map((col) => ({
        key: col.id,
        displayLabel: col.columnDef.header as string,
      }));
    const config = mkConfig({ columnHeaders, filename: title });
    const csv = generateCsv(config)(dataRows);
    download(config)(csv);
  };

  const exportExcel = async () => {
    const dataRows = await fetcher(`${state.apiPath}/export`, "POST", {
      startDate: state.startDate,
      endDate: state.endDate,
    });
    const schema = table
      .getAllLeafColumns()
      .filter((col) => !!col.accessorFn)
      .map((col) => ({
        column: col.columnDef.header,
        value: (row: Record<string, any>) => row[col.id],
        type: typeof dataRows[0][col.id] === "number" ? Number : String,
        align: "center",
        alignVertical: "center",
        height: 20,
        wrap: true,
        width: 20,
      })) as any;
    const blob = (await writeXlsxFile(dataRows, { schema })) as unknown as Blob;
    const blobUrl = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = blobUrl;
    anchor.download = `${title}.xlsx`;
    anchor.style.visibility = "hidden";
    document.body.appendChild(anchor);
    anchor.click();
    URL.revokeObjectURL(blobUrl);
    anchor.remove();
  };

  return (
    <div className="d-flex flex-column flex-grow-1 w-100 min-h-0 mb-5 mt-3 overflow-y-hidden h-100 px-10 pt-1 z-[1]">
      <div className={scss.header}>
        <div className="flex items-center ">
          {children}
          <header className={scss.table_title}>{title || ""}</header>
          {children2}
        </div>

        {canFilterByDate && (
          <div
            className={clsx(
              scss.date_input,
              "d-flex align-items-center justify-content-center gap-2"
            )}
          >
            <DatePickerInput
              placeholder="Select start date"
              weekendDays={[]}
              name="startDate"
              onChange={handleStartDateChange}
              value={state.startDate ? new Date(state.startDate) : null}
            />
            <span>To</span>
            <DatePickerInput
              placeholder="Select end date"
              weekendDays={[]}
              name="endDate"
              minDate={new Date(state.startDate)}
              onChange={handleEndDateChange}
              value={state.endDate ? new Date(state.endDate) : null}
            />
          </div>
        )}

        <div className="d-flex align-items-center gap-3">
          {!!canSearch && (
            <div>
              <TextInput
                style={{ borderRadius: "1.2rem" }}
                leftSection={<FiSearch color="gray.300" />}
                variant="filled"
                placeholder="Search..."
                value={state.searchQuery}
                onChange={handleSearchChange}
              />
            </div>
          )}

          {canFilterColumns && (
            <Popover position="bottom-end">
              <Popover.Target>
                <div>
                  <Tooltip color="#1A365D" label="Columns">
                    <ActionIcon
                      className="mt-1"
                      variant="filled"
                      aria-label="columns"
                    >
                      <TbTableColumn size={22} />
                    </ActionIcon>
                  </Tooltip>
                </div>
              </Popover.Target>
              <Popover.Dropdown>
                <div className="d-flex flex-column p-1 gap-2">
                  {table.getAllLeafColumns().map((column) => (
                    <div
                      key={column.id}
                      className="d-flex align-items-center gap-2"
                    >
                      <Switch
                        {...{
                          type: "checkbox",
                          checked: column.getIsVisible(),
                          onChange: column.getToggleVisibilityHandler(),
                        }}
                      />
                      <label>{column.columnDef.header?.toString()}</label>
                    </div>
                  ))}
                </div>
              </Popover.Dropdown>
            </Popover>
          )}

          {canExport && (
            <Menu>
              <Tooltip color="#1A365D" label="Export">
                <ActionIcon variant="filled">
                  <FaFileExport size={22} onClick={exportExcel} />
                </ActionIcon>
              </Tooltip>
            </Menu>
          )}
        </div>
      </div>

      <div className={scss.tableContainer}>
        <Table
          className={scss.table}
          style={{
            width: `max(100%, ${table.getCenterTotalSize()}px)`,
          }}
        >
          <Table.Thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <Table.Tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <Table.Th
                    key={header.id}
                    colSpan={header.colSpan}
                    style={{ width: header.getSize() }}
                    color="facebook.900"
                  >
                    {!header.isPlaceholder && (
                      <div className="d-flex align-items-center gap-2">
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        <div className={scss.colActions}>
                          {header.column.getCanPin() && (
                            <ActionIcon
                              variant="filled"
                              onClick={() =>
                                header.column.getIsPinned()
                                  ? header.column.pin(false)
                                  : header.column.pin("left")
                              }
                              aria-label="pin column"
                            >
                              {header.column.getIsPinned() ? (
                                <RiUnpinFill size={17} />
                              ) : (
                                <RiPushpinFill size={17} />
                              )}
                            </ActionIcon>
                          )}
                          {!!header.column.columnDef.enableSorting && (
                            <ActionIcon
                              variant="filled"
                              onClick={() =>
                                state.setSort((prev) => ({
                                  column: header.column.id,
                                  direction:
                                    prev?.column === header.column.id
                                      ? 1 - prev.direction
                                      : 0,
                                }))
                              }
                              aria-label="sort column"
                            >
                              <TbArrowsSort size={17} />
                            </ActionIcon>
                          )}
                        </div>
                      </div>
                    )}
                    <div
                      className={clsx(
                        scss.resizer,
                        header.column.getIsResizing() && scss.isResizing
                      )}
                      onMouseDown={header.getResizeHandler()}
                      onTouchStart={header.getResizeHandler()}
                    />
                  </Table.Th>
                ))}
              </Table.Tr>
            ))}
          </Table.Thead>
          <Table.Tbody>
            {table.getRowModel().rows.map((row) => (
              <Table.Tr key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <Table.Td
                    key={cell.id}
                    // className={
                    //   row.original.punch_in &&
                    //   !isValidDate(row.original.punch_in)
                    //     ? "bg-sky-700"
                    //     : ""
                    // }
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </Table.Td>
                ))}
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>

        <div
          className={clsx(
            scss.footer,
            "d-flex py-2 px-4 justify-content-between align-items-center gap-3"
          )}
        >
          <div>
            {state.totalRecords !== undefined && (
              <>
                <strong>{state.totalRecords}</strong> records
              </>
            )}
          </div>
          <div className="d-flex align-items-center gap-4">
            <Menu>
              <Menu.Target>
                <Button size="compact-md">
                  Rows per page: {state.paginationState.pageSize}
                  <RiArrowUpSLine />
                </Button>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Item onClick={() => setPageSize(10)}>10</Menu.Item>
                <Menu.Item onClick={() => setPageSize(20)}>20</Menu.Item>
                <Menu.Item onClick={() => setPageSize(50)}>50</Menu.Item>
                <Menu.Item onClick={() => setPageSize(100)}>100</Menu.Item>
              </Menu.Dropdown>
            </Menu>
            <Pagination
              paginationState={state.paginationState}
              setPaginationState={state.setPaginationState}
              totalPages={state.totalPages}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

RolexTable.Filters = ({ children }: PropsWithChildren) => {
  return children;
};

export default RolexTable;
