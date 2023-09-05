create table if not exists skills (
  id uuid default gen_random_uuid() primary key,
  skill text not null,
  sequence_number int not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);