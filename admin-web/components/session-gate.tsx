"use client";

import { PropsWithChildren, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { getSupabaseBrowserClient } from "@/lib/supabase-browser";
import type { AdminProfile } from "@/lib/types";

interface SessionGateProps extends PropsWithChildren {
  publicRoute?: boolean;
}

export default function SessionGate({
  children,
  publicRoute = false,
}: SessionGateProps) {
  const supabase = useMemo(() => getSupabaseBrowserClient(), []);
  const pathname = usePathname();
  const router = useRouter();
  const [state, setState] = useState<{
    loading: boolean;
    profile: AdminProfile | null;
    error: string | null;
  }>({
    loading: true,
    profile: null,
    error: null,
  });

  useEffect(() => {
    let active = true;

    const run = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!active) return;

      if (!session) {
        setState({ loading: false, profile: null, error: null });
        if (!publicRoute) router.replace(`/login?next=${encodeURIComponent(pathname)}`);
        return;
      }

      const { data, error } = await supabase
        .from("admin_profiles")
        .select("*")
        .eq("user_id", session.user.id)
        .single();

      if (!active) return;

      if (error || !data) {
        setState({
          loading: false,
          profile: null,
          error: "Bu hesap için admin erişimi tanımlı değil.",
        });
        return;
      }

      setState({
        loading: false,
        profile: data as AdminProfile,
        error: null,
      });

      if (publicRoute) {
        router.replace("/overview");
      }
    };

    void run();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      void run();
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, [pathname, publicRoute, router, supabase]);

  if (state.loading) {
    return <div className="screenCenter">Erişim kontrol ediliyor...</div>;
  }

  if (state.error) {
    return <div className="screenCenter errorText">{state.error}</div>;
  }

  if (!publicRoute && !state.profile) {
    return <div className="screenCenter">Giriş yönlendirmesi yapılıyor...</div>;
  }

  return <>{children}</>;
}
