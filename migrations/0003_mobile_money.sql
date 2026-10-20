alter table payments add column if not exists provider text not null default '';
alter table payments add column if not exists msisdn text not null default '';
alter table payments add column if not exists reference text not null default '';
