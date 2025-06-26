drop trigger if exists "on_summary_updated" on "public"."summaries";

drop policy "Users can create their own summaries" on "public"."summaries";

drop policy "Users can delete their own summaries" on "public"."summaries";

drop policy "Users can update their own summaries" on "public"."summaries";

drop policy "Users can view their own summaries" on "public"."summaries";

alter table "public"."summaries" drop constraint "summaries_meeting_id_fkey";

alter table "public"."summaries" drop constraint "summaries_meeting_id_key";

drop function if exists "public"."handle_summary_updated"();

drop index if exists "public"."idx_summaries_meeting_id";

drop index if exists "public"."summaries_meeting_id_key";

create table "public"."google_tokens" (
    "user_id" uuid not null,
    "refresh_token" text not null
);


create table "public"."slack_tokens" (
    "id" uuid not null default gen_random_uuid(),
    "user_id" uuid not null,
    "access_token" text not null,
    "team_id" text,
    "team_name" text,
    "scope" text,
    "created_at" timestamp with time zone not null default now(),
    "selected_channel_id" text,
    "selected_channel_name" text
);


alter table "public"."slack_tokens" enable row level security;

create table "public"."waitlist" (
    "id" uuid not null default gen_random_uuid(),
    "email" text not null,
    "name" text,
    "created_at" timestamp with time zone not null default now(),
    "source" text default 'hero_button'::text
);


alter table "public"."waitlist" enable row level security;

alter table "public"."summaries" drop column "ai_model";

alter table "public"."summaries" drop column "meeting_id";

alter table "public"."summaries" drop column "processing_time_ms";

alter table "public"."summaries" drop column "prompt_version";

alter table "public"."summaries" drop column "retry_attempts";

alter table "public"."summaries" drop column "transcript_sample";

alter table "public"."summaries" drop column "updated_at";

alter table "public"."summaries" add column "audio_name" text;

alter table "public"."summaries" add column "transcript" text not null;

alter table "public"."tasks" add column "status" text default 'In Progress'::text;

CREATE UNIQUE INDEX google_tokens_pkey ON public.google_tokens USING btree (user_id);

CREATE UNIQUE INDEX slack_tokens_pkey ON public.slack_tokens USING btree (id);

CREATE INDEX slack_tokens_user_id_idx ON public.slack_tokens USING btree (user_id);

CREATE UNIQUE INDEX waitlist_email_key ON public.waitlist USING btree (email);

CREATE UNIQUE INDEX waitlist_pkey ON public.waitlist USING btree (id);

alter table "public"."google_tokens" add constraint "google_tokens_pkey" PRIMARY KEY using index "google_tokens_pkey";

alter table "public"."slack_tokens" add constraint "slack_tokens_pkey" PRIMARY KEY using index "slack_tokens_pkey";

alter table "public"."waitlist" add constraint "waitlist_pkey" PRIMARY KEY using index "waitlist_pkey";

alter table "public"."google_tokens" add constraint "google_tokens_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) not valid;

alter table "public"."google_tokens" validate constraint "google_tokens_user_id_fkey";

alter table "public"."slack_tokens" add constraint "slack_tokens_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."slack_tokens" validate constraint "slack_tokens_user_id_fkey";

alter table "public"."waitlist" add constraint "waitlist_email_key" UNIQUE using index "waitlist_email_key";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
BEGIN
  INSERT INTO public.profiles (id, first_name, last_name, email)
  VALUES (
    new.id,
    new.raw_user_meta_data ->> 'first_name',
    new.raw_user_meta_data ->> 'last_name',
    new.email
  );
  RETURN new;
END;
$function$
;

grant delete on table "public"."google_tokens" to "anon";

grant insert on table "public"."google_tokens" to "anon";

grant references on table "public"."google_tokens" to "anon";

grant select on table "public"."google_tokens" to "anon";

grant trigger on table "public"."google_tokens" to "anon";

grant truncate on table "public"."google_tokens" to "anon";

grant update on table "public"."google_tokens" to "anon";

grant delete on table "public"."google_tokens" to "authenticated";

grant insert on table "public"."google_tokens" to "authenticated";

grant references on table "public"."google_tokens" to "authenticated";

grant select on table "public"."google_tokens" to "authenticated";

grant trigger on table "public"."google_tokens" to "authenticated";

grant truncate on table "public"."google_tokens" to "authenticated";

grant update on table "public"."google_tokens" to "authenticated";

grant delete on table "public"."google_tokens" to "service_role";

grant insert on table "public"."google_tokens" to "service_role";

grant references on table "public"."google_tokens" to "service_role";

grant select on table "public"."google_tokens" to "service_role";

grant trigger on table "public"."google_tokens" to "service_role";

grant truncate on table "public"."google_tokens" to "service_role";

grant update on table "public"."google_tokens" to "service_role";

grant delete on table "public"."slack_tokens" to "anon";

grant insert on table "public"."slack_tokens" to "anon";

grant references on table "public"."slack_tokens" to "anon";

grant select on table "public"."slack_tokens" to "anon";

grant trigger on table "public"."slack_tokens" to "anon";

grant truncate on table "public"."slack_tokens" to "anon";

grant update on table "public"."slack_tokens" to "anon";

grant delete on table "public"."slack_tokens" to "authenticated";

grant insert on table "public"."slack_tokens" to "authenticated";

grant references on table "public"."slack_tokens" to "authenticated";

grant select on table "public"."slack_tokens" to "authenticated";

grant trigger on table "public"."slack_tokens" to "authenticated";

grant truncate on table "public"."slack_tokens" to "authenticated";

grant update on table "public"."slack_tokens" to "authenticated";

grant delete on table "public"."slack_tokens" to "service_role";

grant insert on table "public"."slack_tokens" to "service_role";

grant references on table "public"."slack_tokens" to "service_role";

grant select on table "public"."slack_tokens" to "service_role";

grant trigger on table "public"."slack_tokens" to "service_role";

grant truncate on table "public"."slack_tokens" to "service_role";

grant update on table "public"."slack_tokens" to "service_role";

grant delete on table "public"."waitlist" to "anon";

grant insert on table "public"."waitlist" to "anon";

grant references on table "public"."waitlist" to "anon";

grant select on table "public"."waitlist" to "anon";

grant trigger on table "public"."waitlist" to "anon";

grant truncate on table "public"."waitlist" to "anon";

grant update on table "public"."waitlist" to "anon";

grant delete on table "public"."waitlist" to "authenticated";

grant insert on table "public"."waitlist" to "authenticated";

grant references on table "public"."waitlist" to "authenticated";

grant select on table "public"."waitlist" to "authenticated";

grant trigger on table "public"."waitlist" to "authenticated";

grant truncate on table "public"."waitlist" to "authenticated";

grant update on table "public"."waitlist" to "authenticated";

grant delete on table "public"."waitlist" to "service_role";

grant insert on table "public"."waitlist" to "service_role";

grant references on table "public"."waitlist" to "service_role";

grant select on table "public"."waitlist" to "service_role";

grant trigger on table "public"."waitlist" to "service_role";

grant truncate on table "public"."waitlist" to "service_role";

grant update on table "public"."waitlist" to "service_role";

create policy "Users can delete their own Slack tokens"
on "public"."slack_tokens"
as permissive
for delete
to public
using ((auth.uid() = user_id));


create policy "Users can insert their own Slack tokens"
on "public"."slack_tokens"
as permissive
for insert
to public
with check ((auth.uid() = user_id));


create policy "Users can view their own Slack tokens"
on "public"."slack_tokens"
as permissive
for select
to public
using ((auth.uid() = user_id));


create policy "Users can delete their summaries"
on "public"."summaries"
as permissive
for delete
to public
using ((auth.uid() = user_id));


create policy "Users can insert their summaries"
on "public"."summaries"
as permissive
for insert
to public
with check ((auth.uid() = user_id));


create policy "Users can update their summaries"
on "public"."summaries"
as permissive
for update
to public
using ((auth.uid() = user_id));


create policy "Users can view their summaries"
on "public"."summaries"
as permissive
for select
to public
using ((auth.uid() = user_id));


create policy "Anyone can join waitlist"
on "public"."waitlist"
as permissive
for insert
to public
with check (true);


create policy "Users can view their own waitlist entry"
on "public"."waitlist"
as permissive
for select
to public
using (true);



