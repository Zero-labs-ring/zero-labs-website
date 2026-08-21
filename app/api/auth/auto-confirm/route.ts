import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export const runtime = 'nodejs';

/**
 * POST /api/auth/auto-confirm
 * Auto-confirms an existing user's email if they are stuck with 'Email not confirmed',
 * and ensures their profile exists in public.users.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email } = body;

    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();

    // Find the user in Supabase Auth
    const { data: usersData, error: listError } = await supabaseAdmin.auth.admin.listUsers();
    if (listError) {
      console.error('List users error in auto-confirm:', listError);
      return NextResponse.json({ error: 'Failed to find user' }, { status: 500 });
    }

    const targetUser = usersData?.users?.find(u => u.email?.toLowerCase() === cleanEmail);
    if (!targetUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Auto-confirm the user if not confirmed
    if (!targetUser.email_confirmed_at) {
      const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(targetUser.id, {
        email_confirm: true,
      });

      if (updateError) {
        console.error('Failed to auto-confirm user:', updateError);
        return NextResponse.json({ error: updateError.message }, { status: 500 });
      }
    }

    // Ensure public.users entry
    try {
      await supabaseAdmin.from('users').upsert({
        id: targetUser.id,
        email: cleanEmail,
        plan: 'free',
      }, { onConflict: 'id' });
    } catch (tblErr) {
      console.warn('Failed to upsert public.users in auto-confirm:', tblErr);
    }

    return NextResponse.json({
      success: true,
      confirmed: true,
      userId: targetUser.id,
    });
  } catch (err: any) {
    console.error('Auto-confirm exception:', err);
    return NextResponse.json({ error: err.message || 'Internal error' }, { status: 500 });
  }
}
