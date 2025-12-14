export interface File {
  name: string
  size: number
  last_modified: Date
  type: string
}

export type FileType = File