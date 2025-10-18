-- Create enum for user roles
CREATE TYPE public.user_role AS ENUM ('resident', 'store', 'service_provider', 'rider', 'admin');

-- Create enum for service provider categories
CREATE TYPE public.service_category AS ENUM (
  'plumber', 
  'electrician', 
  'carpenter', 
  'painter', 
  'welder', 
  'mechanic',
  'cleaner',
  'gardener',
  'other'
);

-- Create enum for request status
CREATE TYPE public.request_status AS ENUM ('pending', 'approved', 'rejected');

-- Create enum for job status
CREATE TYPE public.job_status AS ENUM ('pending', 'accepted', 'rejected', 'completed');

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  phone_number TEXT,
  role public.user_role NOT NULL,
  is_outside_estate BOOLEAN DEFAULT false,
  is_approved BOOLEAN DEFAULT false,
  hours_of_operation TEXT,
  service_category public.service_category,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create onboarding requests table
CREATE TABLE public.onboarding_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  role public.user_role NOT NULL,
  full_name TEXT NOT NULL,
  phone_number TEXT NOT NULL,
  is_outside_estate BOOLEAN DEFAULT false,
  service_category public.service_category,
  status public.request_status DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create gate permit requests table
CREATE TABLE public.gate_permits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  requester_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  subject_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  subject_role public.user_role NOT NULL,
  purpose TEXT,
  status public.request_status DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create job requests table (for service providers)
CREATE TABLE public.job_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  resident_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  provider_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  service_category public.service_category NOT NULL,
  resident_name TEXT NOT NULL,
  resident_address TEXT NOT NULL,
  service_description TEXT NOT NULL,
  available_time TEXT NOT NULL,
  status public.job_status DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create rider requests table
CREATE TABLE public.rider_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  requester_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  rider_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  pickup_location TEXT,
  delivery_location TEXT,
  status public.job_status DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create notifications table
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create announcements table
CREATE TABLE public.announcements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.onboarding_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gate_permits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rider_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view all approved profiles"
  ON public.profiles FOR SELECT
  USING (is_approved = true OR id = auth.uid());

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (id = auth.uid());

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (id = auth.uid());

-- RLS Policies for onboarding_requests
CREATE POLICY "Users can view their own onboarding requests"
  ON public.onboarding_requests FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Anyone can create onboarding requests"
  ON public.onboarding_requests FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins can view all onboarding requests"
  ON public.onboarding_requests FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin' AND is_approved = true
    )
  );

CREATE POLICY "Admins can update onboarding requests"
  ON public.onboarding_requests FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin' AND is_approved = true
    )
  );

-- RLS Policies for gate_permits
CREATE POLICY "Users can view gate permits involving them"
  ON public.gate_permits FOR SELECT
  USING (requester_id = auth.uid() OR subject_id = auth.uid());

CREATE POLICY "Users can create gate permit requests"
  ON public.gate_permits FOR INSERT
  WITH CHECK (requester_id = auth.uid());

CREATE POLICY "Admins can view all gate permits"
  ON public.gate_permits FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin' AND is_approved = true
    )
  );

CREATE POLICY "Admins can update gate permits"
  ON public.gate_permits FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin' AND is_approved = true
    )
  );

-- RLS Policies for job_requests
CREATE POLICY "Residents and providers can view their job requests"
  ON public.job_requests FOR SELECT
  USING (resident_id = auth.uid() OR provider_id = auth.uid());

CREATE POLICY "Residents can create job requests"
  ON public.job_requests FOR INSERT
  WITH CHECK (resident_id = auth.uid());

CREATE POLICY "Providers can update job requests"
  ON public.job_requests FOR UPDATE
  USING (provider_id = auth.uid());

-- RLS Policies for rider_requests
CREATE POLICY "Requesters and riders can view their requests"
  ON public.rider_requests FOR SELECT
  USING (requester_id = auth.uid() OR rider_id = auth.uid());

CREATE POLICY "Stores can create rider requests"
  ON public.rider_requests FOR INSERT
  WITH CHECK (requester_id = auth.uid());

CREATE POLICY "Riders can update their requests"
  ON public.rider_requests FOR UPDATE
  USING (rider_id = auth.uid());

-- RLS Policies for notifications
CREATE POLICY "Users can view their own notifications"
  ON public.notifications FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can update their own notifications"
  ON public.notifications FOR UPDATE
  USING (user_id = auth.uid());

-- RLS Policies for announcements
CREATE POLICY "Everyone can view announcements"
  ON public.announcements FOR SELECT
  USING (true);

CREATE POLICY "Admins can create announcements"
  ON public.announcements FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin' AND is_approved = true
    )
  );

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add updated_at triggers
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.onboarding_requests
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.gate_permits
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.job_requests
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.rider_requests
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();