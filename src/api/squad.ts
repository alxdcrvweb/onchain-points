import axiosClient from "@/api/api";
import { leaderboard, user } from '../store/leaderboard';

interface CreateResponse {
    success: boolean;
    jwt?: string;
}
interface SquadResponse {
    squad: {
      _id: number,
      points: number,
      title: string,
      username: string,
      isOwner: boolean,
      isVerified: boolean,
      verifyLink: string,
      globalRank: number
      gems: number
    },
    me: {
      userRank: number,
      _id: number,
      league: number,
      tgId: number,
      points: number
      username: string
      fullName: string
    }
}

interface SquadLeaderboardResponse {
    users: {
      userRank: number,
      _id: number,
      league: number,
      tgId: number,
      points: number
      username: string
      fullName: string
    }[];

}

interface SquadListResponse {
    squadList: any;
}
interface BotnameResponse {
    botname: any;
}
interface LinkResponse {
    link: any;
}
export async function joinSquad(jwt: string, squadId: string): Promise<CreateResponse> {
    const res = await axiosClient.post(
        `/api/squad/join?squadId=${squadId}`
    );
    axiosClient.defaults.headers.common['Authorization'] = `Bearer ${res.data.jwt || res.data.token}`;
    return {
        success: res.data.success,
        jwt: res.data.jwt || res.data.token
    };
}
export async function leaveSquad(jwt: string): Promise<CreateResponse> {
    const res = await axiosClient.post(
        `/api/squad/leave`,
        {}
    );
    axiosClient.defaults.headers.common['Authorization'] = `Bearer ${res.data.jwt || res.data.token}`;
    return {
        success: res.data.success,
        jwt: res.data.jwt || res.data.token
    };
}
export async function createSquad(jwt: string, title: string, originalName: string): Promise<CreateResponse> {
    const res = await axiosClient.post(
        '/api/squad',
        {
            title: title,
            link: originalName
        }
    );

    return {
        success: res.data.success,
        jwt: res.data.jwt || res.data.token
    };
}
export async function getGameBotName(jwt: string): Promise<string> {
    const res = await axiosClient.get(`/api/botname`);
    console.log('botname', res.data)
    return res.data.botname;
}
export async function verifySquad(jwt: string, channelLink: string): Promise<CreateResponse> {
  if (channelLink.includes('t.me/+')) {
    return {success: false}
  }
  const link = channelLink.includes('t.me/') ? channelLink.split('t.me/')[1] : channelLink
  const res = await axiosClient.post(
    '/api/squad/verification',
    {
      link: link,
    }
  );
  return {
    success: res.data.success
  };
}
export async function getLink(jwt: string): Promise<LinkResponse> {
    const res = await axiosClient.get('/api/links');

    return {
        link: res.data
    };
}
export async function getBotname(jwt: string): Promise<BotnameResponse> {
    const res = await axiosClient.get('/api/botname');

    return {
        botname: res.data
    };
}
export async function getSquad(jwt: string): Promise<SquadResponse | null> {
    try {
        const res = await axiosClient.get('/api/squad/info');
        const rank = await axiosClient.get('/api/squad/rank');

        return {
            squad: {...res.data.resp.squad, globalRank: rank.data.rank},
            me: rank.data.me
        };
    } catch (e) {
        return null
    }
}
// export async function getSquadTop(jwt: string): Promise<SquadTopResponse | null> {
//   try {
//     const res = await axiosClient.get('/api/squad/rank', {
//       headers: {
//         'Content-Type': 'application/json',
//         Authorization: `Bearer ${jwt}`
//       }
//     });
//     console.log('res.rank',res.data)
//     return {
//       rank: res.data.rank,
//       me: res.data.me
//     };
//   } catch (e) {
//     return null
//   }
// }
export async function getSquadLeaderboard(jwt: string): Promise<SquadLeaderboardResponse | null> {
    try {
        const res = await axiosClient.get('/api/squad/topusers');

        return {
            users: res.data.users,
        };
    } catch (e) {
        console.error('error lb', e)
        return null
    }
}
export async function getRandomSquads(jwt: string): Promise<SquadListResponse> {
    try {
      const res = await axiosClient.get('/api/squad/list');

      return {
        squadList: res.data.squads
      };
    } catch (e) {
      return {
        squadList: null
      }
    }
}
