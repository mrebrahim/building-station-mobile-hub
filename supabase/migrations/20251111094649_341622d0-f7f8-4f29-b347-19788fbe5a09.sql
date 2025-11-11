-- Create user_courses table to track enrolled courses
CREATE TABLE IF NOT EXISTS public.user_courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  course_id INTEGER NOT NULL,
  product_id INTEGER NOT NULL,
  enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  status TEXT DEFAULT 'active',
  UNIQUE(user_id, course_id)
);

-- Enable RLS
ALTER TABLE public.user_courses ENABLE ROW LEVEL SECURITY;

-- Users can view their own enrolled courses
CREATE POLICY "Users can view their own courses"
ON public.user_courses
FOR SELECT
USING (auth.uid() = user_id);

-- Users can insert their own course enrollments (handled by edge function)
CREATE POLICY "Users can enroll in courses"
ON public.user_courses
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Add index for faster lookups
CREATE INDEX idx_user_courses_user_id ON public.user_courses(user_id);
CREATE INDEX idx_user_courses_course_id ON public.user_courses(course_id);