
export type Member = {
  id: string;
  name: string;
  category: string;
};

export type Assignment = {
  id: string;
  title: string;
  description: string;
  category: string;
  status: "new" | "doing" | "done";
  assignedId?: string;
  assignedTo?: string;
  timestamp: string;
};