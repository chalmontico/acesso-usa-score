import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  'https://gedqamkcfiteuhlvrabo.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdlZHFhbWtjZml0ZXVobHZyYWJvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg5MDMzMzIsImV4cCI6MjA2NDQ3OTMzMn0.eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9'
)

export function getServiceClient() {
  return createClient(
    'https://gedqamkcfiteuhlvrabo.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdlZHFhbWtjZml0ZXVobHZyYWJvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODkwMzMzMiwiZXhwIjoyMDY0NDc5MzMyfQ.hRwKBJTlAqfFVrIETqXBl1p-BEgZ0hECFTX2lxwTYhs'
  )
}
