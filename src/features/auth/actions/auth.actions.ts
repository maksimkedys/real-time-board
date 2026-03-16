'use server';

import { redirect } from 'next/navigation';
import { cookies, headers } from 'next/headers';
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
}

export async function signUpAction(
  prevState: AuthState | null,
  formData: FormData
): Promise<AuthState> {
  const data = Object.fromEntries(formData.entries());

  const parsed = signUpSchema.safeParse(data);

  if (!parsed.success) {
    return {
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const { email, password, fullName } = parsed.data;

  const cookieStore = await cookies();
  const supabase = createServerClient(
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

  const { error: signUpError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName || null,
      },
    },
  });

  if (signUpError) {
    return { error: signUpError.message };
  }

  redirect('/');
}

export async function signInAction(
  prevState: AuthState | null,
  formData: FormData
): Promise<AuthState> {
  const data = Object.fromEntries(formData.entries());
  const parsed = signInSchema.safeParse(data);

  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const { email, password } = parsed.data;
  const cookieStore = await cookies();

  const supabase = createServerClient(
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

  const { error: signInError } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (signInError) {
    return { error: signInError.message };
  }

  redirect('/');
}

export async function forgotPasswordAction(
  prevState: AuthState | null,
  formData: FormData
): Promise<AuthState> {
  const data = Object.fromEntries(formData.entries());
  const parsed = forgotPasswordSchema.safeParse(data);

  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const { email } = parsed.data;

  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: () => {}, // Нам не потрібно встановлювати куки для скидання пароля
      },
    }
  );

  const headersList = await headers();
  const origin =
    headersList.get('origin') ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    'http://localhost:3000';

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback?next=/update-password`,
  });

  if (error) {
    return { error: error.message };
  }

  return { success: 'Check your email for the reset link!' };
}
