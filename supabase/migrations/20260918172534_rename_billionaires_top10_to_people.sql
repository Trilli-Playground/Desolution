-- Scope corrected: top 10 richest people overall, not filtered by gender.
alter table public.billionaires_top10_men rename to billionaires_top10;
alter table public.billionaires_top10 drop column global_rank;
