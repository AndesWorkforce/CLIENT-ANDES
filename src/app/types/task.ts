import { ReactNode } from "react";

export interface Task {
  id: number;
  title: string;
  completed: boolean;
  icon: () => ReactNode;
} 