
-- Update the match_grant_call_details function to use negative inner product
CREATE OR REPLACE FUNCTION public.match_grant_call_details(query_embedding extensions.vector, match_threshold double precision, match_count integer)
 RETURNS SETOF grant_call_details
 LANGUAGE sql
AS $function$
  select *,
    (embedding <#> query_embedding) as distance
  from grant_call_details
  where embedding IS NOT NULL
  order by embedding <#> query_embedding desc
  limit least(match_count, 200);
$function$
