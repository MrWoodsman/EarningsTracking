import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabaseUrl = "https://iweommaosuvsvbkjceqw.supabase.co";
const supabaseAnonKey =
	"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml3ZW9tbWFvc3V2c3Zia2pjZXF3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2NjY4MTg4NjQsImV4cCI6MTk4MjM5NDg2NH0.xBphK_rFaxF3GjRFKPsylGAXFdX_cKsbjIQP8fAhdz0";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
