export interface ApiResponse {
  success: boolean;
  message: string;
  // Optional HTTP status code for richer error handling in UI
  status?: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: any;
}
