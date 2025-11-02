// lib/supabase.ts
import { createClient, SupabaseClient } from '@supabase/supabase-js'

let browserClient: SupabaseClient | null = null

// ✅ 우리가 앞으로 쓸 함수
export function getSupabaseBrowserClient(): SupabaseClient {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    // 브라우저에서만 이 에러가 보이도록
    throw new Error(
      'Supabase env is missing. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.'
    )
  }

  // 서버(빌드)일 때는 실제 연결 안 만들어도 된다
  if (typeof window === 'undefined') {
    return createClient(supabaseUrl, supabaseAnonKey, {
      auth: { persistSession: false },
    })
  }

  // 브라우저에서만 1번만 생성
  if (!browserClient) {
    browserClient = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
      },
    })
  }

  return browserClient
}

// ✅ 예전 코드 호환용 (import { supabase } from ... ) 이 남아있을 수도 있어서
// 서버에서는 빈 객체를, 브라우저에서는 진짜 클라이언트를 준다
export const supabase: SupabaseClient = ((): SupabaseClient => {
  if (typeof window === 'undefined') {
    // 빌드/SSR 때는 실제로 안 쓰이도록 빈 객체 반환
    return {} as SupabaseClient
  }
  return getSupabaseBrowserClient()
})()
