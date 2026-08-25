import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validate request body
    const { name, email, countryCode, phone, businessName, service, message } = body;
    
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Save to Supabase
    const { data, error } = await supabase
      .from('contact_submissions')
      .insert([
        {
          name,
          email,
          country_code: countryCode,
          phone,
          business_name: businessName,
          service,
          message,
          status: 'unread'
        }
      ]);
      
    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Failed to submit request' },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { success: true, message: 'Request submitted successfully' },
      { status: 200 }
    );
    
  } catch (err: any) {
    console.error('API Error:', err);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
