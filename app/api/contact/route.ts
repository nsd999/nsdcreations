import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validate request body
    let { name, email, countryCode, phone, businessName, service, message } = body;
    
    // Parse combined phone number from PhoneInput if countryCode is missing or phone contains a space
    if (phone && phone.includes(' ')) {
      const parts = phone.split(' ');
      if (parts.length > 1) {
        countryCode = parts[0];
        phone = parts[1];
      }
    }

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
          country_code: countryCode || '+91',
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
