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
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  console.log('Waitlist subscription request received:', req.body);

  try {
    const { email, paymentInterest, paymentAmount, comment } = req.body;

    console.log('Parsed data:', { email, paymentInterest, paymentAmount, comment });

    // Validate email
    if (!email || !email.includes('@')) {
      console.log('Invalid email:', email);
      return res.status(400).json({ message: 'Invalid email address' });
    }

    // Check if email already exists
    const { data: existingUser, error: checkError } = await supabase
      .from('waitlist_subscribers')
      .select('email')
      .eq('email', email)
      .single();

    if (checkError && checkError.code !== 'PGRST116') {
      console.error('Error checking existing user:', checkError);
      return res.status(500).json({ message: 'Database error' });
    }

    if (existingUser) {
      console.log('Email already exists:', email);
      return res.status(409).json({ message: 'Email already subscribed' });
    }

    // Insert new subscriber
    const { data, error } = await supabase
      .from('waitlist_subscribers')
      .insert([
        {
          email,
          payment_interest: paymentInterest || 0,
          payment_amount: paymentAmount || '',
          comment: comment || '',
          subscribed_at: new Date().toISOString()
        }
      ])
      .select();

    if (error) {
      console.error('Error inserting subscriber:', error);
      return res.status(500).json({ message: 'Failed to save subscriber', error: error.message });
    }

    console.log('Successfully saved subscriber:', data);

    res.status(200).json({ 
      message: 'Successfully subscribed to waitlist',
      data 
    });
  } catch (error) {
    console.error('Error in waitlist subscription API:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
} 