import { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';

interface TableStateProps {
  initialFilter?: string;
  initialPerPage?: number;
  initialSearch?: string;
  initialPage?: number;
  baseUrl: string;
}

export function useTableState({
  initialFilter = 'withoutTrash',
  initialPerPage = 15,
  initialSearch = '',
  initialPage = 1,
  baseUrl
}: TableStateProps) {
  const [currentFilter, setCurrentFilter] = useState(initialFilter);
  const [currentPerPage, setCurrentPerPage] = useState(initialPerPage);
  const [currentSearch, setCurrentSearch] = useState(initialSearch);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [loading, setLoading] = useState(false);

  // Update search state when props change
  useEffect(() => {
    setCurrentSearch(initialSearch);
  }, [initialSearch]);

  const handleFilterChange = (newFilter: string) => {
    setLoading(true);
    setCurrentFilter(newFilter);
    setCurrentPage(1); // Reset to first page when filter changes
    router.get(baseUrl, { 
      filter: newFilter, 
      perPage: currentPerPage, 
      page: 1, 
      search: currentSearch 
    }, {
      onSuccess: () => setLoading(false),
      onError: () => setLoading(false)
    });
  };

  const handlePerPageChange = (newPerPage: number) => {
    setLoading(true);
    setCurrentPerPage(newPerPage);
    setCurrentPage(1); // Reset to first page when perPage changes
    router.get(baseUrl, { 
      filter: currentFilter, 
      perPage: newPerPage, 
      page: 1, 
      search: currentSearch 
    }, {
      onSuccess: () => setLoading(false),
      onError: () => setLoading(false)
    });
  };

  const handlePageChange = (newPage: number) => {
    setLoading(true);
    setCurrentPage(newPage);
    router.get(baseUrl, { 
      filter: currentFilter, 
      perPage: currentPerPage, 
      page: newPage, 
      search: currentSearch 
    }, {
      onSuccess: () => setLoading(false),
      onError: () => setLoading(false)
    });
  };

  const handleSearch = (query: string) => {
    setLoading(true);
    setCurrentSearch(query);
    setCurrentPage(1); // Reset to first page when search changes
    router.get(baseUrl, { 
      filter: currentFilter, 
      perPage: currentPerPage, 
      page: 1, 
      search: query 
    }, {
      onSuccess: () => setLoading(false),
      onError: () => setLoading(false)
    });
  };

  const resetTableState = () => {
    setCurrentFilter(initialFilter);
    setCurrentPerPage(initialPerPage);
    setCurrentSearch(initialSearch);
    setCurrentPage(initialPage);
  };

  return {
    currentFilter,
    currentPerPage,
    currentSearch,
    currentPage,
    loading,
    handleFilterChange,
    handlePerPageChange,
    handlePageChange,
    handleSearch,
    resetTableState,
    setLoading
  };
}