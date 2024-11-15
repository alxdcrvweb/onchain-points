import axiosClient from "@/api/api";
import { leaderboard, user } from '../store/leaderboard';
interface League {
    league: {
        totalCount: number;
        id: number;
        name: string;
        description: string;
        minScore: number;
        maxScore: number;
    };
    me: {
        userRank: number;
        _id: string;
        clicks: number;
        tgId: number;
        coins: number;
    };
    energy: {
        my: number;
        total: number;
    };
}
interface LeagueResponse {
    leagueId: number;
    userRank: number;
}
interface AuthResponse {
    success: boolean;
    leaderboard: leaderboard;
}

export async function getGlobalTop(jwt: string): Promise<AuthResponse> {
    const res = await axiosClient.get('/api/global/rate');

    return {
        success: res.data.success,
        leaderboard: res.data,
    };
}
export async function getLeagueTop(jwt: string): Promise<AuthResponse> {
    const res = await axiosClient.get('/api/league/rate');

    return {
        success: true,
        leaderboard: res.data
    };
}
export async function getLeague(jwt: string): Promise<LeagueResponse | null> {
    try {
      const res = await axiosClient.get('/api/league');

      return {
        leagueId: res.data.league.id,
        userRank: res.data.me.userRank
      };
    } catch (e) {
      console.error(e);
      return null
    }
}
