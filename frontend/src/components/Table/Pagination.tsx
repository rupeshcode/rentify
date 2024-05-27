import {
  RiArrowLeftSLine,
  RiArrowRightSLine,
  RiSkipLeftLine,
  RiSkipRightLine,
} from "react-icons/ri";
import { Dispatch } from "react";
import { ActionIcon } from "@mantine/core";

type PaginationProps = {
  paginationState: PaginationState;
  setPaginationState: Dispatch<PaginationAction>;
  totalPages: number;
};

const Pagination = ({
  paginationState,
  setPaginationState,
  totalPages,
}: PaginationProps) => {
  const goFirst = () => setPaginationState({ type: PaginationActions.FIRST });
  const goBack = () =>
    setPaginationState({
      type: PaginationActions.PREV,
      payload: { totalPages },
    });
  const goNext = () =>
    setPaginationState({
      type: PaginationActions.NEXT,
      payload: { totalPages },
    });
  const goLast = () =>
    setPaginationState({
      type: PaginationActions.LAST,
      payload: { totalPages },
    });
  const goToPage = (page: number) =>
    page !== paginationState.activePage &&
    setPaginationState({
      type: PaginationActions.SET_PAGE,
      payload: { activePage: page },
    });

  return (
    <div className="d-flex align-items-center gap-2">
      <ActionIcon
        variant="filled"
        onClick={goFirst}
        disabled={paginationState.activePage === 0}
        aria-label="first page"
      >
        <RiSkipLeftLine size={22} />
      </ActionIcon>
      <ActionIcon
        variant="filled"
        onClick={goBack}
        disabled={paginationState.activePage === 0}
        aria-label="previous page"
      >
        <RiArrowLeftSLine size={22} />
      </ActionIcon>
      {paginate(paginationState.activePage, totalPages).map((page) => (
        <ActionIcon
          key={page}
          // size="xs"
          variant="filled"
          onClick={() => goToPage(page)}
          style={{
            backgroundColor:
              page === paginationState.activePage
                ? " rgb(33, 150, 243)"
                : "white",
            color: page === paginationState.activePage ? "white" : "black",
          }}
        >
          {page + 1}
        </ActionIcon>
      ))}
      <ActionIcon
        variant="filled"
        onClick={goNext}
        disabled={paginationState.activePage === totalPages - 1}
        aria-label="next page"
      >
        <RiArrowRightSLine size={22} />
      </ActionIcon>
      <ActionIcon
        variant="filled"
        onClick={goLast}
        disabled={paginationState.activePage === totalPages - 1}
        aria-label="last page"
      >
        <RiSkipRightLine size={22} />
      </ActionIcon>
    </div>
  );
};

const paginate = (active: number, total: number, length = 5) => {
  if (length > total) length = total;
  const min = 0;
  const start = Math.min(
    Math.max(active - Math.floor(length / 2), min),
    min + total - length
  );
  return Array.from({ length }, (_, i) => start + i);
};

export const paginationReducer = (
  prev: PaginationState,
  action: PaginationAction
): PaginationState => {
  const { activePage } = prev;
  const totalPages = action.payload?.totalPages!;
  switch (action.type) {
    case PaginationActions.FIRST: {
      return { ...prev, activePage: 0 };
    }
    case PaginationActions.PREV: {
      return {
        ...prev,
        activePage: (activePage + totalPages - 1) % totalPages,
      };
    }
    case PaginationActions.NEXT: {
      return {
        ...prev,
        activePage: (activePage + totalPages + 1) % totalPages,
      };
    }
    case PaginationActions.LAST: {
      return { ...prev, activePage: totalPages - 1 };
    }
    case PaginationActions.SET_PAGE: {
      return { ...prev, activePage: action.payload?.activePage! };
    }
    case PaginationActions.SET_PAGE_SIZE: {
      return { ...prev, activePage: 0, pageSize: action.payload?.pageSize! };
    }
    case PaginationActions.REFETCH: {
      return { ...prev };
    }
    case PaginationActions.RESET: {
      return { ...prev, activePage: 0 };
    }
  }
};

export type PaginationState = {
  activePage: number;
  pageSize: number;
};

export type PaginationAction = {
  type: PaginationActions;
  payload?: Partial<PaginationState> &
    Partial<{
      totalRecords: number;
      totalPages: number;
    }>;
};

export enum PaginationActions {
  PREV = 0,
  NEXT,
  FIRST,
  LAST,
  SET_PAGE,
  SET_PAGE_SIZE,
  RESET,
  REFETCH,
}

export default Pagination;
