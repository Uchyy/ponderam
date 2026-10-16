
import { supabase } from "../../utils/supabase";
import type { LeaderboardRepository, LeaderboardEntry } from "../LeaderboardReposiroty";

export class SupabaseLeaderboardRepository implements LeaderboardRepository {
    
    async getTopPlayers( tab: "ranked" | "popular" = "ranked", limit = 100 ): Promise<LeaderboardEntry[]> {
        const sortColumn = tab === "popular" ? "likes" : "total_score";

        const { data, error } = await supabase
            .from("public_leaderboard")
            .select("username, avatar, total_score, likes")
            .order(sortColumn, { ascending: false })
            .order("username", { ascending: true })
            .limit(limit);

        if (error) throw error;

        return (data ?? []).map((player) => ({
            username: player.username,
            avatar: player.avatar,
            total_score: Number(player.total_score ?? 0),
            likes: Number(player.likes ?? 0),
        }));
    }
   

 
    subscribe(listener: () => void): () => void {
        const channel = supabase
            .channel("public:leaderboard", {
            config: { private: true },
            })
            .on(
            "broadcast",
            { event: "leaderboard_changed" },
            () => listener()
            )
            .subscribe();

        return () => {
            void supabase.removeChannel(channel);
        };
    }

}
