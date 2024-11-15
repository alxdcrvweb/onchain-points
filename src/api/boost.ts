import axiosClient from "@/api/api";
import { leaderboard, user } from '../store/leaderboard';
import {Improvement} from "@/store/gameStore";

interface EnergyResponse {
    energy: any;
    maxLevel?: boolean;
}
interface ClickResponse {
    clicks: any;
    maxLevel?: boolean;
}
interface ImprovementResponse {
  status: true, level: any
}

export interface NextLevel {
  currentValue: number;
  nextValue: number;
  currentLevel: number;
  nextLevel: number;
  upgradeCost: number;
  next: boolean;
  isExist?: boolean;

}
export interface UnionLevels {
  energy: NextLevel;
  clicks: NextLevel;
  autoClicker: NextLevel;

}

export async function getAllImprovements(): Promise<UnionLevels> {
    const res = await axiosClient.get('/api/unionboost');
    return res.data.unionLevels;
}
export async function clickNew(coins: number): Promise<ClickResponse|null> {
    if(coins <= 0) return null
    const res = await axiosClient.post(
        '/api/klick/myself/click',
        { clicks: coins },
        {
        }
    );

    return {
        clicks: res.data
    };
}
export async function getEnergyBoostLvl(): Promise<Improvement> {
    const {data}: {data: Improvement } = await axiosClient.get('/api/energy/nlevel', {
    });

    return data;
}
export async function getClickBoostLvl(): Promise<Improvement> {
    const {data}: {data: Improvement } = await axiosClient.get('/api/clicks/nlevel', {
    });
    console.log('data getClickBoostLvl', data)
  return data;
}
export async function energyRefill(): Promise<any> {
    const res = await axiosClient.post(
        '/api/boosts/energy',
        {},
        {
        }
    );
  console.log('resenergy', res)
    return {
        energy: res.data.user

    };
}
export async function upEnergyLvl(): Promise<Improvement> {
    const {data}: {data: Improvement } = await axiosClient.post(
        '/api/level/energy',
        {},
        {
        }
    );

  return data;
}
export async function upClickLvl(): Promise<Improvement> {
    const {data}: {data: Improvement } = await axiosClient.post(
        '/api/level/clicks',
        {},
        {
        }
    );
  return data;
}


export interface Quests {
  twitter: boolean,
  postw: boolean,
  tgChannel: boolean,
  trustWallet: boolean,
  okx: boolean,
}
export interface CheckQuestResponse {
  status: true,
  quests: Quests
}

export async function fetchRocketBoostMultiplier(): Promise<number|null> {
    try {
      const res = await axiosClient.post('/api/rocketActivation');
      return res.data.multiplier;
    } catch (error) {
      return null;
    }
}
export async function sendRocketResults(clicks: number): Promise<any> {
    try {
      const res = await axiosClient.post(
        '/api/clicksWithRocketBoost',
        { clicks },
      );
      return res.data;
    } catch (error) {
      return null;
    }

}
export async function checkAllQuests(): Promise<CheckQuestResponse | null> {
    try {
      const res = await axiosClient.get('/api/checkallsub', {
      });
      console.log('resquests', res.data)
      if (!res.data.status) return null;
      return res.data;
    } catch (error) {
      return null
    }
}


interface ClickerResponse {
  exist: boolean,
  level: number,
  lastReset: number
  coins: number
}
export const buyClicker = async ():Promise<Improvement> => {
  const {data}: {data: { autoClicker: Improvement } } = await axiosClient.post(
    '/api/autoclicker/create',
  );
  return data.autoClicker;
}
export const upgradeClicker = async ():Promise<Improvement> => {
  const {data}: {data: { autoClicker: Improvement } } = await axiosClient.post(
    '/api/autoclicker/upgrade',
    {},
    {
    }
  );
  return data.autoClicker;
}

export const claimClickerPoints = async ():Promise<ClickerResponse> => {
  const res = await axiosClient.post(
    '/api/autoclicker/recharge',
    {},
    {
    }
  );
  return {...res.data.clicker, coins: res.data.coins};
}
export const getClickerNextLevel = async ():Promise<NextLevel> => {
  const {data}: {data: Improvement } = await axiosClient.get('/api/autoclicker/nextlevel', {
  });
  return data;
}

export const AutoClickerApi = {
  buyClicker,
  upgradeClicker,
  getClickerNextLevel,
  claimClickerPoints,
}
export const RocketApi = {
  fetchRocketBoostMultiplier,
  sendRocketResults,
}

export const ImprovementsApi = {
  getAllImprovements,
}
