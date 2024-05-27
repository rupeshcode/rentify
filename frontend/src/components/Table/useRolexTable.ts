import { useEffect, useReducer, useState } from "react";
import { PaginationActions, paginationReducer } from "./Pagination";
import { isBlank } from "@/utils/string";
import fetcher from "@/utils/fetcher";
import NProgress from "nprogress";
import useDebounce from "@/hooks/useDebounce";

const useRolexTable = ({ apiPath, apiParams }: HookProps) => {
  const [data, setData] = useState<Array<Record<string, any>>>([]);
  const [paginationState, setPaginationState] = useReducer(paginationReducer, {
    activePage: 0,
    pageSize: 10,
  });
  const [totalPages, setTotalPages] = useState(-1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedQuery = useDebounce(searchQuery, 600);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [sort, setSort] = useState<Sort>();

  useEffect(() => {
    let shouldIgnore = false;
    if (!apiPath) return;
    const controller = new AbortController();
    const { signal } = controller;
    const json = {
      sort,
      pagination: {
        page: paginationState.activePage,
        size: paginationState.pageSize,
      },
      search: debouncedQuery.trim() || null,
      startDate: startDate || null,
      endDate: endDate || null,
      custom: apiParams,
    };
    NProgress.start();
    // console.log("json", json);
    fetcher(apiPath, "POST", json, signal).then((res: ReportApiResponse) => {
      // console.log("res", res);
      if (shouldIgnore) {
        return;
      }
      setData(res.content);
      setTotalPages(res.totalPages);
      setTotalRecords(res.totalElements);
      NProgress.done();
    });

    return () => {
      shouldIgnore = true;
      controller.abort();
    };
  }, [paginationState]);

  useEffect(() => {
    if (!apiPath) return;
    const queryLen = debouncedQuery?.trim().length ?? 0;
    if (queryLen > 0 && queryLen < 1) {
      return;
    }
    if (!isValidDateRange(startDate, endDate)) {
      return;
    }
    setPaginationState({ type: PaginationActions.RESET });
  }, [debouncedQuery, startDate, endDate, sort, apiParams]);

  const refetchCurrentPage = () => {
    setPaginationState({ type: PaginationActions.REFETCH });
  };

  const resetToFirstPage = () => {
    setPaginationState({ type: PaginationActions.RESET });
  };

  return {
    apiPath,
    data,
    setData,
    paginationState,
    setPaginationState,
    totalPages,
    setTotalPages,
    totalRecords,
    setTotalRecords,
    searchQuery,
    setSearchQuery,
    query: debouncedQuery,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    sort,
    setSort,
    resetToFirstPage,
    refetchCurrentPage,
  };
};

const isValidDateRange = (startDate: string, endDate: string): boolean => {
  try {
    return (
      (isBlank(startDate) && isBlank(endDate)) ||
      new Date(startDate) <= new Date(endDate)
    );
  } catch (err) {
    return false;
  }
};

export type Sort = {
  column: string;
  direction: number; // 0 -> ASC, 1 -> DESC
};

type ReportApiResponse = {
  content: Array<Record<string, any>>;
  totalElements: number;
  totalPages: number;
};

type HookProps = {
  apiPath?: string;
  apiParams?: Record<string, any>;
};

export default useRolexTable;
