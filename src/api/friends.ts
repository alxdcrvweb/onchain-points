import axiosClient from "@/api/api";

interface UserSearchResponse {
  users: {fullName:string, _id:number }[]
}
interface BoostsResponse {
  "boost": {
    "_id": string
    "userId": string,
    "remainingGems": number,
    "lastDailyGemReset": number,
    "remainingRockets": number,
    "lastDailyRocketReset": number,
  },
  "boostIsActive": false
  "clicker": {
    "exist": boolean,
    "level": number,
    "lastReset": number
    "coins": number
  }
}
export const getAvailableBoosts = async (jwt?:string):Promise<BoostsResponse|null> => {
  try {
    const res = await axiosClient.get('/api/boost');

    return res.data;
  } catch (e) {
    return null;
  }

}
export const searchUsers = async (userId: number):Promise<UserSearchResponse> => {
  try {
    const res = await axiosClient.get(`/api/user/find?query=${userId}`);

    return {
      users: res.data.users
    };
  } catch (e) {
    return {
      users: []
    };
  }

}

export const sendGem = async (type:'squad'|'friend', userId?: number):Promise<any> => {
  try {
    const res = await axiosClient.post(
      '/api/boost/gems',
      {
        transfer: type,
        friendId: userId,
      },
    );
    return true;
  } catch (e) {
    null
  }
}
