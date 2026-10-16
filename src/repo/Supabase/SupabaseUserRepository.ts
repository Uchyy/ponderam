import type { Participant } from "../../models/Participant";
import { supabase } from "../../utils/supabase";
import type { UserRepository, UserProfile, CreateProfileInput, UpdateProfileInput } from "../UserRepository";


export class SupabaseUserRepository implements UserRepository {

    private mapParticipant(data: any): Participant {
        return {
            id: data.id,
            joinedAt: new Date(data.joinedAt),
            leftAt: data.leftAt ? new Date(data.leftAt) : null,
            connected: data.connected,
            isHost: data.isHost,
            username: data.username,
            avatar: data.avatar,
            reliability: data.reliability,
            hasCompletedMarking: data.hasCompletedMarking ?? false,
        };
    }

    async getById(id: string): Promise<UserProfile | null> {
        const { data, error } = await supabase.from("profiles").select("*").eq("id", id).maybeSingle();

        if (error) throw error;
        if (!data) return null;

        return {
            id: data.id,
            username: data.username,
            avatar: data.avatar,
            coins: data.coins,
            streak: data.streak,
            likes: data.likes,
            soloIds: data.solo_ids,
            multiplayerIds: data.multiplayer_ids,
            createdAt: new Date(data.created_at),
            lastPlayedDate: data.last_played_date? new Date(data.last_played_date) : null,
            reliability: data.reliability,
            total_score: data.total_score
        };
    }

    async create( id: string, input: CreateProfileInput ): Promise<UserProfile> {
        const { data, error } = await supabase.from("profiles").insert({
            id, username: input.username.trim(), avatar: input.avatar, }).select().single();

        if (error) throw error;

        return {
            id: data.id,
            username: data.username,
            avatar: data.avatar,
            coins: data.coins,
            streak: data.streak,
            likes: data.likes,
            soloIds: data.solo_ids,
            multiplayerIds: data.multiplayer_ids,
            createdAt: new Date(data.created_at),
            lastPlayedDate: data.last_played_date ? new Date(data.last_played_date) : null,
            reliability: data.reliability,
            total_score: data.total_score
        
        };
    }

    async update( id: string, input: UpdateProfileInput): Promise<UserProfile> {
        const updates: { username?: string; avatar?: string; } = {};

        if (input.username !== undefined) {
            updates.username = input.username.trim();
        }

        if (input.avatar !== undefined) {
            updates.avatar = input.avatar;
        }

        if (Object.keys(updates).length === 0) {
            const profile = await this.getById(id);

            if (!profile) {
            throw new Error("User profile not found.");
            }

            return profile;
        }

        const { data, error } = await supabase.from("profiles").update(updates).eq("id", id).select().maybeSingle();

        if (error) throw error;

        if (!data) {
            throw new Error("User profile not found.");
        }

        return {
            id: data.id,
            username: data.username,
            avatar: data.avatar,
            coins: data.coins,
            streak: data.streak,
            likes: data.likes,
            soloIds: data.solo_ids,
            multiplayerIds: data.multiplayer_ids,
            createdAt: new Date(data.created_at),
            lastPlayedDate: data.last_played_date ? new Date(data.last_played_date) : null,
            reliability: data.reliability,
            total_score: data.total_score
        };
    }

    
   async usernameExists(username: string): Promise<boolean> {
        const { data, error } = await supabase.from("profiles").select("id").ilike("username", username.trim()).limit(1);
        if (error) throw error;

        return data.length > 0;
    }

    createParticipant(profile: UserProfile): Participant {
        return {
            id: profile.id,
            joinedAt: new Date(),
            isHost: false,
            leftAt: null,
            connected: true,
            username: profile.username,
            avatar: profile.avatar,
            reliability: profile.reliability,
            hasCompletedMarking: false
        };
    }

    async getParticipantById( code: string, id: string ): Promise<Participant | null> {
        const { data, error } = await supabase.from("games").select("participants").eq("code", code.toUpperCase()).maybeSingle();

        if (error) throw error;
        if (!data) return null;

        const participant = data.participants.find(
            (participant: Participant) => participant.id === id
        );

        return participant ? this.mapParticipant(participant) : null;
    }

    async getAllParticipant(code: string): Promise<Participant[]> {
        const { data, error } = await supabase.from("games").select("participants").eq("code", code.toUpperCase()).maybeSingle();

        if (error) throw error;
        if (!data) return [];

        return data.participants.map(
            (participant: Participant) => this.mapParticipant(participant)
        );
    }
}

