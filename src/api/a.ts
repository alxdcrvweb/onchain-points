import { leaderboard, user } from '../store/leaderboard';
import axiosClient from "@/api/api";

export async function addPoints(jwt: string, tgId: number, coins: number) {
    const res = await axiosClient.post(
        '/api/admin/changekebab',
        { tgId: tgId, coins: coins }
    );

    return res.status;
}

export async function banUser(jwt: string, tgId: number) {
    const res = await axiosClient.post(
        `/api/admin/ban`,
        {
            tgId: tgId
        }
    );

    return res.status;
}
export async function findUser(jwt: string, name: string) {
    const res = await axiosClient.get(`/api/admin/search?fullname=${name}`);

    return res.data;
}
export async function findAllUsers(jwt: string) {
    const res = await axiosClient.get(`/api/admin/users`);

    return res.data;
}
export async function addAdmin(jwt: string, tgId: number) {
    const res = await axiosClient.post(
        '/api/admin/promote',
        { tgId: tgId }
    );

    return res.status;
}
export async function changeRefLink(jwt: string, tgId: number, name: string) {
    const res = await axiosClient.post(
        `/api/admin/addchromosome`,
        { tgId: tgId, username: name }
    );

    return res.data;
}
export async function init(jwt: string) {
    const res = await axiosClient.post(`/api/admin/init`);

    return res.data;
}
