export interface UserProgram {
  id: string;
  user_id: string;
  program_id: string;
  active: boolean;
  current_day: number;
  started_at: string | null;
  completed_at: string | null;
}

export interface RouteDay {
  id: string;
  day_number: number;
  program_id: string;
  is_published: boolean;
}
    
export interface UserDayProgress {
  id: string;
  user_program_id: string;
  day_id: string;
  completed: boolean;
  completed_at: string | null;
  minutes_watched: number | null;
}