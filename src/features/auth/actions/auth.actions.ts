'use server';

import { redirect } from 'next/navigation';
import { isRedirectError } from 'next/dist/client/components/redirect-error';
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import {
  signInSchema,
  signUpSchema,
  forgotPasswordSchema,
} from '@/shared/schemas/auth.schema';

export interface AuthState {
  error?: string;
  success?: string;
  fieldErrors?: {
    fullName?: string[];
    email?: string[];
    password?: string[];
  };
  values?: {
    fullName?: string;
    email?: string;
  };
}

async function getSupabaseClient() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch (error) {
            console.log(error);
          }
        },
      },
    }
  );
}

export async function signUpAction(
  prevState: AuthState | null,
  formData: FormData
): Promise<AuthState> {
  try {
    const data = Object.fromEntries(formData.entries());
    const values = {
      fullName: data.fullName as string,
      email: data.email as string,
    };
    const parsed = signUpSchema.safeParse(data);

    if (!parsed.success) {
      return { fieldErrors: parsed.error.flatten().fieldErrors, values };
    }

    const { email, password, fullName } = parsed.data;
    const supabase = await getSupabaseClient();

    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });

    if (signUpError) {
      return { error: signUpError.message, values };
    }
  } catch (err) {
    if (isRedirectError(err)) throw err;
    console.error('SignUp Error:', err);
    return { error: 'An unexpected error occurred during sign up.' };
  }

  redirect('/');
}

export async function signInAction(
  prevState: AuthState | null,
  formData: FormData
): Promise<AuthState> {
  try {
    const data = Object.fromEntries(formData.entries());
    const values = { email: data.email as string };
    const parsed = signInSchema.safeParse(data);

    if (!parsed.success) {
      return { fieldErrors: parsed.error.flatten().fieldErrors, values };
    }

    const { email, password } = parsed.data;
    const supabase = await getSupabaseClient();

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      return { error: signInError.message, values };
    }
  } catch (err) {
    if (isRedirectError(err)) throw err;

    console.error('SignIn Error:', err);
    return { error: 'Invalid credentials or server error.' };
  }

  redirect('/');
}

export async function forgotPasswordAction(
  prevState: AuthState | null,
  formData: FormData
): Promise<AuthState> {
  try {
    const data = Object.fromEntries(formData.entries());
    const values = { email: data.email as string };
    const parsed = forgotPasswordSchema.safeParse(data);

    if (!parsed.success) {
      return { fieldErrors: parsed.error.flatten().fieldErrors, values };
    }

    const { email } = parsed.data;
    const supabase = await getSupabaseClient();

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/callback?next=/update-password`,
    });

    if (error) {
      return { error: error.message, values };
    }

    return { success: 'Check your email for the reset link!' };
  } catch (err) {
    console.error('Forgot Password Error:', err);
    return { error: 'Could not send reset email.' };
  }
}
