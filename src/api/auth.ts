import { profile } from '@/store/profile';
import axiosClient from "@/api/api";
interface AuthResponse {
    success: boolean;
    token: string;
    error?: string;
    info?: any;
}
interface userInfo {
    success: boolean;
    user: profile;
}
export async function checkServerStatus(): Promise<{ serverIsOpen: boolean; code: number; botName?:string }> {
  try {
    console.log('status axios attempt')
        const res = await axiosClient.get('/api/server/status');
        console.log('status axios response', res)
        return { serverIsOpen: res.data.serverIsOpen, code: res.data.code, botName: res.data.botname};
    } catch (error: any) {
        return { serverIsOpen: false, code: error.response==='Too Many Requests'?429:error?.response?.status||429, botName: undefined};
    }
}
export async function validateUser(initData: string): Promise<AuthResponse> {
    try {
        const req = { hash: initData };
        const data = await axiosClient.post('/api/validate', req, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        axiosClient.defaults.headers.common['Authorization'] = `Bearer ${data.data.token}`;
        return {
            success: data.data.success,
            token: data.data.token,
            error: data.data.error,
            info: data.data.info,
        };
    } catch (error: any) {
        console.log('error.response', error.response);
        if (error.response.status >= 500) {
            throw new Error('Server unavailable')
            // return {
            //     success: false,
            //     token: '',
            //     error: 'server unavailable'
            // };
        }
        return {
            success: false,
            token: '',
            error: error.response.data.error,
            info: undefined
        };
    }
}
export async function disconnectUser(): Promise<AuthResponse> {
    // const req = { hash: initData };
    const data = await axiosClient.post(
        '/api/disconnect',
        {},
        {
            headers: {
                'Content-Type': 'application/json'
            }
        }
    );
    return {
        success: data.data.success,
        token: data.data.token
    };
}
export async function userInfo(jwt?: string): Promise<userInfo> {
    const data = await axiosClient.get('/api/info');
    console.log(data.data);
    return {
        success: data.data.success,
        user: data.data.user
    };
}
export async function userSubscribeX(jwt: string): Promise<any> {
    const data = await axiosClient.get('/api/checksub/tw');
    console.log(data.data);
    return {
        success: data.data.status
    };
}
export async function userTwitted(jwt: string): Promise<any> {
    const data = await axiosClient.get('/api/checksub/postw');
    console.log(data.data);
    return {
        success: data.data.status
    };
}
export async function userSubscribe(jwt: string): Promise<any> {
    const data = await axiosClient.get('/api/checksub/tg');
    console.log(data.data);
    return {
        success: data.data.status
    };
}

export interface upgradeLevelResponse {
    status: boolean;
    error?: any;
    user: {
        level: number;
        coins: number;
    };
    boostSize?: number;
}
export async function activateBoost(jwt: string): Promise<any> {
    const res = await axiosClient.post('/api/boosts/clicks');
    console.log('activateBoost res.data,', res.data);
    return res.data;
}
export async function kickDisbeliever(jwt: string): Promise<upgradeLevelResponse> {
    const data = await axiosClient.post(
        '/api/disbeliever/kick'
    );
    return {
        status: data.data.status,
        user: data.data.user,
        error: data.data.error
    };
}
