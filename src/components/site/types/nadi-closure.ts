
export interface NadiClosure {
  id: string;
  site_id: string;
  title: string;
  start_date: string;
  end_date: string;
  is_recurring: boolean;
  recurrence_pattern?: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateNadiClosureParams {
  site_id: string;
  title: string;
  start_date: string;
  end_date: string;
  is_recurring: boolean;
  recurrence_pattern?: string;
  description?: string;
}

export interface UpdateNadiClosureParams extends Partial<CreateNadiClosureParams> {
  id: string;
}
