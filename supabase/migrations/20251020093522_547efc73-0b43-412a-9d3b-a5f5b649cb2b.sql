-- Add 'in_progress' status to job_status enum
ALTER TYPE job_status ADD VALUE IF NOT EXISTS 'in_progress';