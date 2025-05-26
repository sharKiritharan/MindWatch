import { createClient } from '@supabase/supabase-js';
import { supabase as mockClient } from '../mock/client';

const supabaseUrl = 'https://bodbeysxpacuvxedqdcu.supabase.co';
const supabaseKey = 'your-anon-key';

export const supabase = import.meta.env.DEV 
  ? mockClient 
  : createClient(supabaseUrl, supabaseKey);