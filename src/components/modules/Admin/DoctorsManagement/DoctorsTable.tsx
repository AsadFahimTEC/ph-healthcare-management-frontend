"use client";

import { useCallback, useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { SortingState, PaginationState } from "@tanstack/react-table";
import DataTable from "@/components/shared/table/DataTable";
import { getDoctors } from "@/services/doctor.service";
import { IDoctor } from "@/types/doctor.types";
import { useQuery } from "@tanstack/react-query";
import { doctorColumns } from "./doctorsColumns";

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;
// const SPECIALTIES_FILTER_KEY = "specialties.specialty.title";
// const APPOINTMENT_FEE_FILTER_KEY = "appointmentFee";
// const DOCTOR_FILTER_DEFINITIONS = [
//   serverManagedFilter.single("gender"),
//   serverManagedFilter.multi(SPECIALTIES_FILTER_KEY),
//   serverManagedFilter.range(APPOINTMENT_FEE_FILTER_KEY),
// ];

const getSortingFromParams = (searchParams: URLSearchParams) => {
  const sortBy = searchParams.get("sortBy");
  const sortOrder = searchParams.get("sortOrder");

  if (!sortBy) return [];

  return [{ id: sortBy, desc: sortOrder?.toLowerCase() === "desc" }];
};

const getPaginationFromParams = (searchParams: URLSearchParams): PaginationState => {
  const page = parseInt(searchParams.get("page") || String(DEFAULT_PAGE));
  const limit = parseInt(searchParams.get("limit") || String(DEFAULT_LIMIT));

  return { pageIndex: page - 1, pageSize: limit };
};

const getSearchFromParams = (searchParams: URLSearchParams): string => {
  return searchParams.get("search") || "";
};

const DoctorsTable = () => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const [sortingState, setSortingState] = useState<SortingState>(() =>
    getSortingFromParams(searchParams),
  );

  const [paginationState, setPaginationState] = useState<PaginationState>(() =>
    getPaginationFromParams(searchParams),
  );

  const [searchValue, setSearchValue] = useState<string>(() =>
    getSearchFromParams(searchParams),
  );

  useEffect(() => {
    setSortingState(getSortingFromParams(searchParams));
    setPaginationState(getPaginationFromParams(searchParams));
    setSearchValue(getSearchFromParams(searchParams));
  }, [searchParams]);

  const handleSortingChange = useCallback(
    (nextSorting: SortingState) => {
      let next: SortingState;
      if (typeof nextSorting === "function") {
        next = (nextSorting as (prev: SortingState) => SortingState)(sortingState);
      } else {
        next = nextSorting;
      }

      // Use the current search params to build the new URL
      const params = new URLSearchParams(searchParams.toString());

      if (!next || next.length === 0) {
        params.delete("sortBy");
        params.delete("sortOrder");
      } else {
        const { id, desc } = next[0];
        params.set("sortBy", String(id));
        params.set("sortOrder", desc ? "desc" : "asc");
      }

      const search = params.toString();
      router.replace(search ? `${pathname}?${search}` : pathname, {
        scroll: false,
      });

      setSortingState(next);
    },
    [searchParams, pathname, router, sortingState],
  );

  const handlePaginationChange = useCallback(
    (nextPagination: PaginationState) => {
      let next: PaginationState;
      if (typeof nextPagination === "function") {
        next = (nextPagination as (prev: PaginationState) => PaginationState)(paginationState);
      } else {
        next = nextPagination;
      }

      // Use the current search params to build the new URL
      const params = new URLSearchParams(searchParams.toString());

      params.set("page", String(next.pageIndex + 1));
      params.set("limit", String(next.pageSize));

      const search = params.toString();
      router.replace(search ? `${pathname}?${search}` : pathname, {
        scroll: false,
      });

      setPaginationState(next);
    },
    [searchParams, pathname, router, paginationState],
  );

  const handleSearchChange = useCallback(
    (value: string) => {
      console.log("Search debounced:", value);
      // Use the current search params to build the new URL
      const params = new URLSearchParams(searchParams.toString());

      const trimmedValue = value.trim();
      if (!trimmedValue || trimmedValue.length < 2) {
        params.delete("search");
        // Don't reset page when clearing search
      } else {
        params.set("search", trimmedValue);
        // Reset to page 1 when searching
        params.set("page", "1");
      }

      const search = params.toString();
      console.log("Updating URL with search:", search);
      router.replace(search ? `${pathname}?${search}` : pathname, {
        scroll: false,
      });

      setSearchValue(value);
    },
    [searchParams, pathname, router],
  );

  const { data: doctorDataResponse, isLoading, isFetching } = useQuery({
    queryKey: ["doctors", searchParams.toString()],
    queryFn: () => {
      console.log("Fetching doctors with query:", searchParams.toString());
      return getDoctors(searchParams.toString());
    },
  });

  const doctors = doctorDataResponse?.data ?? [];


  const handleView = (doctor: IDoctor) => {
    console.log("View doctor", doctor);
  };

  const handleEdit = (doctor: IDoctor) => {
    console.log("Edit doctor", doctor);
  };

  const handleDelete = (doctor: IDoctor) => {
    console.log("Delete doctor", doctor);
  };

  return (
    <DataTable
        data={doctors}
        columns={doctorColumns}
        isLoading={isLoading || isFetching}
        emptyMessage="No doctors found."
        search={{
          initialValue: searchValue,
          placeholder: "Search doctors (min 2 characters)...",
          debounceMs: 400,
          onDebouncedChange: handleSearchChange,
        }}
        sorting={{ state: sortingState, onSortingChange: handleSortingChange }}
        pagination={{ state: paginationState, onPaginationChange: handlePaginationChange }}
        meta={doctorDataResponse?.meta}
        actions={{
          onView: handleView,
          onEdit: handleEdit,
          onDelete: handleDelete,
        }}
      />
  );
};

export default DoctorsTable;