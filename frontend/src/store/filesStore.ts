import { create } from 'zustand';
import type { FileType } from '../types/File';

type FileStore = {
  files: FileType[];
  searchTerm: string;
  sortBy: 'name' | 'size' | 'date';
  sortOrder: 'asc' | 'desc';
  startDate: Date | null;
  endDate: Date | null;
  setFiles: (files: FileType[]) => void;
  setSearchTerm: (searchTerm: string) => void;
  setSortBy: (sortBy: 'name' | 'size' | 'date') => void;
  setSortOrder: (sortOrder: 'asc' | 'desc') => void;
  setStartDate: (startDate: Date | null) => void;
  setEndDate: (endDate: Date | null) => void;
  clearDateRange: () => void;
  getFilteredAndSortedFiles: () => FileType[];
}
export const useFilesStore = create((set, get) : FileStore => ({
  files: [],
  searchTerm: '',
  sortBy: 'name' as 'name' | 'size' | 'date',
  sortOrder: 'asc' as 'asc' | 'desc',
  startDate: null,
  endDate: null,
  
  setFiles: (files: FileType[]) => set({ files }),
  
  setSearchTerm: (searchTerm: string) => set({ searchTerm }),
  
  setSortBy: (sortBy: 'name' | 'size' | 'date') => set({ sortBy }),
  
  setSortOrder: (sortOrder: 'asc' | 'desc') => set({ sortOrder }),
  
  setStartDate: (startDate: Date | null) => set({ startDate }),
  
  setEndDate: (endDate: Date | null) => set({ endDate }),
  
  clearDateRange: () => set({ startDate: null, endDate: null }),
  
  getFilteredAndSortedFiles: () => {
    const { files, searchTerm, sortBy, sortOrder, startDate, endDate } = get();
    
    // Filter files based on search term
    let filteredFiles = files.filter((file: FileType) =>
      file.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    // Filter files based on date range
    if (startDate || endDate) {
      filteredFiles = filteredFiles.filter((file: FileType) => {
        const fileDate = new Date(file.last_modified);
        fileDate.setHours(0, 0, 0, 0); // Normalize to start of day for comparison
        
        if (startDate && endDate) {
          const start = new Date(startDate);
          start.setHours(0, 0, 0, 0);
          const end = new Date(endDate);
          end.setHours(23, 59, 59, 999); // Include the entire end date
          return fileDate >= start && fileDate <= end;
        } else if (startDate) {
          const start = new Date(startDate);
          start.setHours(0, 0, 0, 0);
          return fileDate >= start;
        } else if (endDate) {
          const end = new Date(endDate);
          end.setHours(23, 59, 59, 999);
          return fileDate <= end;
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
        case 'date':
          comparison = new Date(a.last_modified).getTime() - new Date(b.last_modified).getTime();
          break;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });
    
    return filteredFiles;
  },
}))
