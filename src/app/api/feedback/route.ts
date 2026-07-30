import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, message } = body;

    if (!message?.trim()) {
      return NextResponse.json({ error: 'Message is required.' }, { status: 400 });
    }

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (url && key && url.startsWith('http')) {
      const supabase = createClient(url, key);
      const { error } = await supabase
        .from('feedback')
        .insert([{ name: name?.trim() || null, email: email?.trim() || null, message: message.trim() }]);

      if (error) throw error;
    } else {
      console.log('Feedback received (Supabase credentials not configured):', { name, email, message });
    }

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (err) {
    console.error('[/api/feedback]', err);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
