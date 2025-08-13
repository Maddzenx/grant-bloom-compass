import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Fetch count from your waitlist table
    const { count, error } = await supabase
      .from('waitlist_subscribers')
      .select('*', { count: 'exact', head: true });

    if (error) {
      console.error('Error fetching waitlist count:', error);
      return res.status(500).json({ message: 'Failed to fetch count' });
    }

    // Return the real count
    res.status(200).json({ count: count || 0 });
  } catch (error) {
    console.error('Error in waitlist count API:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
} 