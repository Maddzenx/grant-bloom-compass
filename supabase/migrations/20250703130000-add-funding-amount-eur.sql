-- Add funding_amount_eur field for simplified sorting and filtering
-- This field will contain a single EUR amount for sorting/filtering purposes
-- It should not be displayed in the UI, only used for backend operations

ALTER TABLE grant_call_details 
ADD COLUMN funding_amount_eur bigint;

-- Add index for efficient sorting and filtering
CREATE INDEX idx_grant_call_details_funding_amount_eur 
ON grant_call_details(funding_amount_eur);

-- Add comment to document the field's purpose
COMMENT ON COLUMN grant_call_details.funding_amount_eur IS 
'Funding amount in EUR for sorting and filtering purposes. Not displayed in UI.'; 