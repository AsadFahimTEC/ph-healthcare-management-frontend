"use client";

import { useCallback, useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { SortingState } from "@tanstack/react-table";
import DataTable from "@/components/shared/table/DataTable";
import { getDoctors } from "@/services/doctor.service";
import { IDoctor } from "@/types/doctor.types";
import { useQuery } from "@tanstack/react-query";
import { doctorColumns } from "./doctorsColumns";

const getSortingFromParams = (searchParams: URLSearchParams) => {
  const sortBy = searchParams.get("sortBy");
  const sortOrder = searchParams.get("sortOrder");

  if (!sortBy) return [];

  return [{ id: sortBy, desc: sortOrder?.toLowerCase() === "desc" }];
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

  useEffect(() => {
    setClientQueryString(searchParams.toString());
    setSortingState(getSortingFromParams(searchParams));
  }, [searchParams]);

  const handleSortingChange = useCallback(
    (nextSorting: SortingState) => {
      const next =
        typeof nextSorting === "function" ? nextSorting(sortingState) : nextSorting;

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
        actions={{
          onView: handleView,
          onEdit: handleEdit,
          onDelete: handleDelete,
        }}
      />
  );
};

export default DoctorsTable;