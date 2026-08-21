import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { generateApiKey } from '@/lib/apiKeyAuth';

export const runtime = 'nodejs';

/**
 * POST /api/auth/signup
 * Securely creates a verified Supabase account with email_confirm: true,
 * creates a public.users profile, and initializes a default API key.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password, name } = body;

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json({ error: 'Please provide a valid email address.' }, { status: 400 });
    }

    if (!password || typeof password !== 'string' || password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters long.' }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();
    const displayName = name ? String(name).trim() : cleanEmail.split('@')[0];

    // 1. Attempt to create the user with pre-confirmed email via Admin API
    const { data: createData, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email: cleanEmail,
      password: password,
      email_confirm: true,
      user_metadata: {
        full_name: displayName,
        name: displayName,
      },
    });

    let userId: string | null = null;
    let userEmail: string = cleanEmail;

    if (createError) {
      const errorMsg = createError.message?.toLowerCase() || '';

      // Check if user already exists
      if (errorMsg.includes('already registered') || errorMsg.includes('already exists') || errorMsg.includes('unique')) {
        // User already exists. Try to find user and make sure email is confirmed
        try {
          const { data: usersList } = await supabaseAdmin.auth.admin.listUsers();
          const existingUser = usersList?.users?.find(u => u.email?.toLowerCase() === cleanEmail);
          
          if (existingUser) {
            // Auto-confirm existing user and update password if needed
            await supabaseAdmin.auth.admin.updateUserById(existingUser.id, {
              email_confirm: true,
              password: password,
            });

            // Ensure public.users entry
            await supabaseAdmin.from('users').upsert({
              id: existingUser.id,
              email: cleanEmail,
              plan: 'free',
            }, { onConflict: 'id' });

            return NextResponse.json({
              success: true,
              message: 'Account updated. Logging you in…',
              user: { id: existingUser.id, email: cleanEmail },
              alreadyExisted: true,
            });
          }
        } catch (findErr) {
          console.warn('Could not lookup existing user:', findErr);
        }

        return NextResponse.json(
          { error: 'An account with this email already exists. Please log in.' },
          { status: 400 }
        );
      }

      console.error('Supabase admin createUser error:', createError);
      return NextResponse.json({ error: createError.message || 'Failed to create account.' }, { status: 500 });
    }

    if (!createData?.user) {
      return NextResponse.json({ error: 'Failed to create user record.' }, { status: 500 });
    }

    userId = createData.user.id;
    userEmail = createData.user.email || cleanEmail;

    // 2. Insert into public.users table
    try {
      await supabaseAdmin.from('users').upsert({
        id: userId,
        email: userEmail,
        plan: 'free',
        created_at: new Date().toISOString(),
      }, { onConflict: 'id' });
    } catch (tblErr) {
      console.warn('Failed to insert into public.users:', tblErr);
    }

    // 3. Create default API key for the new user
    try {
      const { prefix, hash } = generateApiKey();
      await supabaseAdmin.from('api_keys').insert([
        {
          user_id: userId,
          key_hash: hash,
          key_prefix: prefix,
          label: 'Default API Key',
          requests_count: 0,
          is_active: true,
          created_at: new Date().toISOString(),
        },
      ]);
    } catch (keyErr) {
      console.warn('Failed to create default API key:', keyErr);
    }

    return NextResponse.json({
      success: true,
      user: {
        id: userId,
        email: userEmail,
      },
    });
  } catch (err: any) {
    console.error('Signup route unexpected error:', err);
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
  }
}
