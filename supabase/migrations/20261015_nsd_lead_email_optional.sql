-- Admin-entered leads may legitimately have no email address.
alter table public.contact_submissions alter column email drop not null;
