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
