
export interface TakwimEvent {
  id: string;
  title: string;
  date: Date;
  startTime: string;
  endTime: string;
  type: string;
  description?: string;
  location?: string;
}

export interface EventType {
  value: string;
  label: string;
  color: string;
}

