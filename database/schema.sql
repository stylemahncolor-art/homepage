-- Run in your NEW Supabase project's SQL Editor before importing data.
create table if not exists public.page_content (
 page text not null, locale text not null check(locale in ('kr','en','cn','jp')),
 title text not null, description text not null, image text, updated_at text not null,
 primary key(page,locale)
);
create table if not exists public.news (
 slug text primary key, category integer not null check(category between 0 and 4),
 title text not null, description text not null, body text not null,
 image text, source text, status text not null check(status in ('published','draft')),
 updated_at text not null, gallery text not null default '[]'
);
create table if not exists public.news_order(id text primary key,slugs text not null);
alter table public.page_content enable row level security;
alter table public.news enable row level security;
alter table public.news_order enable row level security;
revoke all on public.page_content,public.news,public.news_order from anon,authenticated;
grant all on public.page_content,public.news,public.news_order to service_role;
-- Media are public website photos. Only server service_role can upload.
insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
values('ipib-media','ipib-media',true,4000000,ARRAY['image/jpeg','image/png','image/webp'])
on conflict(id) do update set public=true,file_size_limit=4000000,
 allowed_mime_types=ARRAY['image/jpeg','image/png','image/webp'];
