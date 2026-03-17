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

const DoctorsTable = () => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const [clientQueryString, setClientQueryString] = useState(() =>
    searchParams.toString(),
  );

  const [sortingState, setSortingState] = useState<SortingState>(() =>
    getSortingFromParams(searchParams),
  );

  const [paginationState, setPaginationState] = useState<PaginationState>(() =>
    getPaginationFromParams(searchParams),
  );

  useEffect(() => {
    setClientQueryString(searchParams.toString());
    setSortingState(getSortingFromParams(searchParams));
    setPaginationState(getPaginationFromParams(searchParams));
  }, [searchParams]);

  const handleSortingChange = useCallback(
    (nextSorting: SortingState) => {
      let next: SortingState;
      if (typeof nextSorting === "function") {
        next = (nextSorting as (prev: SortingState) => SortingState)(sortingState);
      } else {
        next = nextSorting;
      }

      // Use the last known client query string (including filters) so we
      // optimistically update the URL without waiting for next navigation.
      const params = new URLSearchParams(clientQueryString);

      if (!next || next.length === 0) {
        params.delete("sortBy");
        params.delete("sortOrder");
      } else {
        const { id, desc } = next[0];
        params.set("sortBy", String(id));
        params.set("sortOrder", desc ? "desc" : "asc");
      }

      const search = params.toString();
      setClientQueryString(search);
      router.replace(search ? `${pathname}?${search}` : pathname, {
        scroll: false,
      });

      setSortingState(next);
    },
    [clientQueryString, pathname, router, sortingState],
  );

  const handlePaginationChange = useCallback(
    (nextPagination: PaginationState) => {
      let next: PaginationState;
      if (typeof nextPagination === "function") {
        next = (nextPagination as (prev: PaginationState) => PaginationState)(paginationState);
      } else {
        next = nextPagination;
      }

      // Use the last known client query string (including filters) so we
      // optimistically update the URL without waiting for next navigation.
      const params = new URLSearchParams(clientQueryString);

      params.set("page", String(next.pageIndex + 1));
      params.set("limit", String(next.pageSize));

      const search = params.toString();
      setClientQueryString(search);
      router.replace(search ? `${pathname}?${search}` : pathname, {
        scroll: false,
      });

      setPaginationState(next);
    },
    [clientQueryString, pathname, router, paginationState],
  );

  const { data: doctorDataResponse, isLoading, isFetching } = useQuery({
    queryKey: ["doctors", clientQueryString],
    queryFn: () => getDoctors(clientQueryString),
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