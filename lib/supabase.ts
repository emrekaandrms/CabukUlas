import "react-native-url-polyfill/auto";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";

// Supabase projenizi olusturduktan sonra bu degerleri guncelleyin
// https://supabase.com/dashboard adresinden proje ayarlarindan alinabilir
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || "https://your-project.supabase.co";
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || "your-anon-key";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
