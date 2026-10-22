create table if not exists portal_service_requests (
  id text primary key,
  client_subject text not null,
  client_email text,
  client_name text,
  contract jsonb not null,
  status text not null default 'Received',
  attachment_document_id text,
  created_at timestamptz not null default now()
);

create index if not exists portal_service_requests_client_subject_idx
  on portal_service_requests (client_subject, created_at desc);

create table if not exists portal_matter_requests (
  id text primary key,
  client_subject text not null,
  client_email text,
  client_name text,
  category text not null,
  description text not null,
  attachment_document_id text,
  submitted_at timestamptz not null default now(),
  status text not null default 'Received'
);

create index if not exists portal_matter_requests_client_subject_idx
  on portal_matter_requests (client_subject, submitted_at desc);

create table if not exists portal_documents (
  id text primary key,
  matter_key text not null,
  filename text not null,
  blob_pathname text not null,
  blob_url text not null,
  content_type text,
  size_bytes bigint,
  added_at timestamptz not null default now(),
  added_by_subject text,
  added_by_email text,
  added_by_name text not null,
  uploaded_by_client boolean not null default false,
  deleted_at timestamptz,
  retention_until timestamptz
);

create index if not exists portal_documents_matter_key_idx
  on portal_documents (matter_key, added_at desc)
  where deleted_at is null;

create index if not exists portal_documents_added_by_subject_idx
  on portal_documents (added_by_subject, added_at desc)
  where deleted_at is null;

create table if not exists portal_matter_updates (
  id text primary key,
  matter_key text not null,
  body text not null,
  author_name text not null,
  author_subject text,
  added_at timestamptz not null default now()
);

create index if not exists portal_matter_updates_matter_key_idx
  on portal_matter_updates (matter_key, added_at desc);

create table if not exists portal_audit_events (
  id bigserial primary key,
  actor_subject text,
  actor_email text,
  actor_role text not null,
  action text not null,
  resource_type text not null,
  resource_id text,
  matter_key text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists portal_audit_events_resource_idx
  on portal_audit_events (resource_type, resource_id, created_at desc);

create index if not exists portal_audit_events_actor_idx
  on portal_audit_events (actor_subject, created_at desc);

-- Lead conflict checks (ML1 2026-10-22): a lead names the parties before sharing
-- matter details, signing or paying; Levine Law clears or declines.
create table if not exists intake_conflict_requests (
  id text primary key,
  user_id text not null,
  user_email text not null,
  service_code text not null,
  service_slug text not null,
  applicant_name text not null,
  company_name text,
  related_parties text,
  adverse_parties text,
  status text not null default 'pending',
  decided_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists intake_conflict_requests_user_idx
  on intake_conflict_requests (user_id, service_slug, created_at desc);

create index if not exists intake_conflict_requests_status_idx
  on intake_conflict_requests (status, created_at desc);

-- Lead funnel measurement (ML1 2026-10-22): where each lead came from, how far it
-- got, what it sold for and what it cost in time. Feeds the admin scorecard.
alter table intake_conflict_requests add column if not exists source text;
alter table intake_conflict_requests add column if not exists engaged_at timestamptz;
alter table intake_conflict_requests add column if not exists final_service_code text;
alter table intake_conflict_requests add column if not exists fee_cents integer;
alter table intake_conflict_requests add column if not exists clio_matter text;
alter table intake_conflict_requests add column if not exists paid_at timestamptz;
alter table intake_conflict_requests add column if not exists completed_at timestamptz;
alter table intake_conflict_requests add column if not exists hours numeric(6,2);

create table if not exists intake_events (
  id bigserial primary key,
  user_id text not null,
  service_slug text not null,
  event text not null,
  source text,
  created_at timestamptz not null default now(),
  unique (user_id, service_slug, event)
);

create index if not exists intake_events_service_idx
  on intake_events (service_slug, event, created_at desc);
