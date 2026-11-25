
alter table public.leads
  add column full_name text,
  add column phone_country_code text,
  add column phone_number text;

comment on column public.leads.phone_country_code is
  'International dialing code, for example +502';

comment on column public.leads.phone_number is
  'WhatsApp number without the international dialing code';
