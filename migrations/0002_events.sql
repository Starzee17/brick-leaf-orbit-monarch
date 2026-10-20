create table if not exists profiles (
  user_id text primary key,
  display_name text not null default '',
  phone text not null default '',
  bio text not null default '',
  role text not null default 'user',
  created_at timestamptz not null default now()
);

create table if not exists categories (
  id serial primary key,
  name text not null unique
);

create table if not exists events (
  id serial primary key,
  title text not null,
  description text not null,
  start_at timestamptz not null,
  end_at timestamptz not null,
  location text not null,
  category_id integer references categories(id),
  organizer_id text not null,
  tone text not null default 'ember',
  status text not null default 'published',
  price_cents integer not null default 0,
  capacity integer not null default 100,
  created_at timestamptz not null default now()
);

create table if not exists payments (
  id serial primary key,
  user_id text not null,
  event_id integer not null references events(id),
  amount_cents integer not null,
  currency text not null default 'USD',
  status text not null,
  last4 text not null default '',
  created_at timestamptz not null default now()
);

create table if not exists tickets (
  id serial primary key,
  user_id text not null,
  event_id integer not null references events(id),
  payment_id integer references payments(id),
  code text not null unique,
  status text not null default 'valid',
  amount_cents integer not null,
  created_at timestamptz not null default now()
);

create index if not exists tickets_user_idx on tickets (user_id);
create index if not exists events_start_idx on events (start_at);

insert into categories (name)
values ('Music'), ('Food'), ('Talks'), ('Sports'), ('Nightlife'), ('Workshops')
on conflict (name) do nothing;

insert into events (title, description, start_at, end_at, location, category_id, organizer_id, tone, status, price_cents, capacity)
select v.title, v.description, v.start_at, v.end_at, v.location, c.id, 'house', v.tone, 'published', v.price_cents, v.capacity
from (
  values
    ('Harbor Jazz After Dark', 'A waterfront quartet, low light, and a short set list that runs past midnight.', now() + interval '2 days', now() + interval '2 days 3 hours', 'Pier 9 Warehouse', 'Music', 'ember', 2800, 180),
    ('Sunday Market Supper', 'One long table, six cooks, and a menu built from whatever arrived that morning.', now() + interval '5 days', now() + interval '5 days 4 hours', 'Lot 14 Courtyard', 'Food', 'moss', 4500, 40),
    ('City Builders Forum', 'Three talks on streets, housing, and the small decisions that change a block.', now() + interval '8 days', now() + interval '8 days 2 hours', 'Atlas Hall', 'Talks', 'ink', 0, 220),
    ('Night Run: East Loop', 'An untimed 8k with marshals, water, and a finish-line cocoa stand.', now() + interval '12 days', now() + interval '12 days 2 hours', 'East Loop Gate', 'Sports', 'tide', 1500, 400),
    ('Basement Listening Room', 'No phones, one deck, and a guest selector. Doors at 9.', now() + interval '3 days', now() + interval '3 days 5 hours', 'Room 4, Mercer', 'Nightlife', 'dusk', 2200, 80),
    ('Letterpress Saturday', 'Set type, pull prints, and leave with a poster you made yourself.', now() + interval '16 days', now() + interval '16 days 3 hours', 'Oak & Ink Studio', 'Workshops', 'clay', 3500, 16)
) as v(title, description, start_at, end_at, location, category, tone, price_cents, capacity)
join categories c on c.name = v.category
where not exists (select 1 from events limit 1);
