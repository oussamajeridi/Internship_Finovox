import { create } from 'zustand'
import { isWithinInterval, startOfDay, endOfDay, isAfter, isBefore, format } from 'date-fns'
import type { FileType, PaginationMetadata } from '../types'

type FileStore = {
  files: FileType[];
  searchTerm: string;
  sortBy: 'name' | 'size' | 'modified' | 'type';
  sortOrder: 'asc' | 'desc';
  startDate: Date | null;
  endDate: Date | null;
  pagination: PaginationMetadata | null;
  currentPage: number;
  itemsPerPage: number;
  setFiles: (files: FileType[]) => void;
  setSearchTerm: (searchTerm: string) => void;
  setSortBy: (sortBy: 'name' | 'size' | 'modified' | 'type') => void;
  setSortOrder: (sortOrder: 'asc' | 'desc') => void;
  setStartDate: (startDate: Date | null) => void;
  setEndDate: (endDate: Date | null) => void;
  clearDateRange: () => void;
  getFilteredAndSortedFiles: () => FileType[];
  addFile: (file: FileType) => void;
  deleteFile: (filename: string) => void;
  setPagination: (pagination: PaginationMetadata | null) => void;
  setCurrentPage: (page: number) => void;
  setItemsPerPage: (itemsPerPage: number) => void;
  goToNextPage: () => void;
  goToPrevPage: () => void;
  goToPage: (page: number) => void;
  resetSearchAndSort: () => void;
  getBackendSearchParams: () => { search?: string; sort_by?: string; sort_order?: string; date_from?: string; date_to?: string };
}
export const useFilesStore = create((set, get) : FileStore => ({
  files: [],
  searchTerm: '',
  sortBy: 'name' as 'name' | 'size' | 'modified' | 'type',
  sortOrder: 'asc' as 'asc' | 'desc',
  startDate: null,
  endDate: null,
  pagination: null,
  currentPage: 1,
  itemsPerPage: 10,
  
  setFiles: (files: FileType[]) => set({ 
    files: files.map(file => ({
      ...file,
      last_modified: new Date(file.last_modified)
    }))
  }),
  
  addFile: (file: FileType) => set((state) => ({ 
    files: [...state.files, {
      ...file,
      last_modified: new Date(file.last_modified)
    }] 
  })),
  
  deleteFile: (filename: string) => set((state) => ({ 
    files: state.files.filter((file) => file.name !== filename) 
  })),
  
  setSearchTerm: (searchTerm: string) => set({ searchTerm }),
  
  setSortBy: (sortBy: 'name' | 'size' | 'modified' | 'type') => set({ sortBy }),
  
  setSortOrder: (sortOrder: 'asc' | 'desc') => set({ sortOrder }),
  
  setStartDate: (startDate: Date | null) => set({ startDate }),
  
  setEndDate: (endDate: Date | null) => set({ endDate }),
  
  clearDateRange: () => set({ startDate: null, endDate: null }),
  
  setPagination: (pagination: PaginationMetadata | null) => set({ pagination }),
  
  setCurrentPage: (currentPage: number) => set({ currentPage }),
  
  setItemsPerPage: (itemsPerPage: number) => set({ itemsPerPage, currentPage: 1 }),
  
  goToNextPage: () => set((state) => {
    if (state.pagination?.has_next) {
      return { currentPage: state.currentPage + 1 }
    }
    return state
  }),
  
  goToPrevPage: () => set((state) => {
    if (state.pagination?.has_prev) {
      return { currentPage: state.currentPage - 1 }
    }
    return state
  }),
  
  goToPage: (page: number) => set((state) => {
    if (state.pagination && page >= 1 && page <= state.pagination.total_pages) {
      return { currentPage: page }
    }
    return state
  }),
  
  getFilteredAndSortedFiles: () => {
    const { files, searchTerm, sortBy, sortOrder, startDate, endDate } = get();
    
    // Filter files based on search term
    let filteredFiles = files.filter((file: FileType) =>
      file.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    // Filter files based on date range using date-fns
    if (startDate || endDate) {
      filteredFiles = filteredFiles.filter((file: FileType) => {
        const fileDate = new Date(file.last_modified);
        
        if (startDate && endDate) {
          return isWithinInterval(fileDate, {
            start: startOfDay(startDate),
            end: endOfDay(endDate)
          });
        } else if (startDate) {
          return isAfter(fileDate, startOfDay(startDate)) || fileDate.getTime() === startOfDay(startDate).getTime();
        } else if (endDate) {
          return isBefore(fileDate, endOfDay(endDate)) || fileDate.getTime() === endOfDay(endDate).getTime();
        }
        return true;
      });
    }
    
    // Sort files
    filteredFiles.sort((a: FileType, b: FileType) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'size':
          comparison = a.size - b.size;
          break;
        case 'modified':
          comparison = new Date(a.last_modified).getTime() - new Date(b.last_modified).getTime();
          break;
        case 'type':
          comparison = a.type.localeCompare(b.type);
          break;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });
    
    return filteredFiles;
  },
  
  resetSearchAndSort: () => set({ 
    searchTerm: '', 
    sortBy: 'name', 
    sortOrder: 'asc',
    currentPage: 1 
  }),
  
  getBackendSearchParams: () => {
    const { searchTerm, sortBy, sortOrder, startDate, endDate } = get();
    const params: { search?: string; sort_by?: 'name' | 'size' | 'modified' | 'type'; sort_order?: 'asc' | 'desc'; date_from?: string; date_to?: string } = {};
    
    if (searchTerm.trim()) {
      params.search = searchTerm.trim();
    }
    
    if (sortBy !== 'name' || sortOrder !== 'asc') {
      params.sort_by = sortBy;
      params.sort_order = sortOrder;
    }
    
    // Add date range parameters using date-fns format
    if (startDate) {
      params.date_from = format(startDate, 'yyyy-MM-dd');
    }
    
    if (endDate) {
      params.date_to = format(endDate, 'yyyy-MM-dd');
    }
    
    return params as { search?: string; sort_by?: 'name' | 'size' | 'modified' | 'type'; sort_order?: 'asc' | 'desc'; date_from?: string; date_to?: string };
  },
}))
