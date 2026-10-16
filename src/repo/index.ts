
import { SupabaseUserRepository } from "./Supabase/SupabaseUserRepository";
import { SupabaseGameRepository } from "./Supabase/SupbaseGameRepository";

export const userRepository = new SupabaseUserRepository();
export const gameRepository = new SupabaseGameRepository();
