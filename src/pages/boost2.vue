<template>
    <div class="dashboard">
        <name name="Add" />
        Add points:
        <form class="nameForm" v-on:submit="(e) => sendPoints(e)">
            <div><label for="name">Name:</label>
                <input v-on:change="(e) => changeName(e)" type="text" :value="newName"
                    v-on:blur="(e) => findUser(e, 1)" />
            </div>
            <div style="margin-bottom: 20px"><label for="name">Points:</label>
                <input v-on:change="(e) => changePoint(e)" type="text" :value="points" />
            </div>
            <button type="submit" :class="user ? 'change' : 'changeF'">change</button>
        </form>
        Add admin:
        <form class="nameForm" v-on:submit="(e) => addAdm(e)">
            <div><label for="name">Name:</label>
                <input v-on:change="(e) => changeName(e)" type="text" :value="newName3"
                    v-on:blur="(e) => findUser(e, 3)" />
            </div>
            <button type="submit" :class="user3 ? 'change' : 'changeF'">add</button>
        </form>
        Change custom ref link:
        <form class="nameForm" v-on:submit="(e) => changeRef(e)">
            <div><label for="name">Name:</label>
                <input v-on:change="(e) => changeName2(e)" type="text" :value="newName2"
                    v-on:blur="(e) => findUser(e, 2)" />
            </div>
            <div style="margin-bottom: 20px"><label for="name">Custom ref link:</label>
                <input v-on:change="(e) => changeCustomLink(e)" type="text" :value="customLink" />
            </div>
            <button type="submit" :class="user2 ? 'change' : 'changeF'">change</button>
        </form>
        <!-- {{ users }} -->
        Users list
        <form class="nameForm" v-on:submit="(e) => changeRef(e)">
            <div><label for="name">Search by name:</label>
                <input v-on:change="(e) => changeSearch(e)" type="text" :value="searchName"
                    v-on:blur="(e) => findUserForList(e, 2)" />
            </div>
            <button type="submit" class="change">search</button>
        </form>

        <div class="table">
            <div v-for="us in users" v-bind:key="us._id">

                <div class="tableRow"
                    :style="{ 'opacity': us.isBanned ? '0.5' : '1', 'pointer-events': us.isBanned ? 'none' : 'auto' }">
                    <div><span>{{ us?.userRank
                            }}</span>
                        <div class="tableUserName">{{ us?.fullName }}</div>
                        <div>
                            <div class="clicks">{{ (us?.clicks || us?.points) ? (us?.clicks || us?.points).toFixed(0) :
                                0 }}
                            </div>
                            p

                        </div>
                    </div>

                    <div сlass="ban" v-on:click="(e) => ban(e, us.tgId)">
                        {{ us.isBanned ? "banned" : "BAN" }}
                    </div>
                </div>

            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { useUserStore } from '@/store/app';
import WebApp from '@twa-dev/sdk';
import { storeToRefs } from 'pinia';
import boost from '@/components/boost/boost.vue'
import { ref } from 'vue';
import { addPoints, findUser, changeRefLink, findAllUsers, banUser, addAdmin } from '@/api/a'
const newName = ref("")
const newName2 = ref("")
const newName3 = ref("")
const points = ref("")
const customLink = ref("")
const searchName = ref("")
const user = ref<any>(undefined)
const user2 = ref<any>(undefined)
const user3 = ref<any>(undefined)
const users = ref<any[]>([])
export default {
    setup() {
        const userStore = useUserStore();
        const { getUser, getJwt } = storeToRefs(userStore);
        return {
            newName,
            user,
            user2,
            user3,
            points,
            getJwt,
            customLink,
            newName2,
            newName3,
            users,
            searchName
        };
    },
    data() {
        return {};
    },
    mounted() {
        this.findAllUsers()
    },
    methods: {
        changeName(event: any) {
            newName.value = event.target.value
        },
        changeName2(event: any) {
            newName2.value = event.target.value
        },
        changeName3(event: any) {
            newName3.value = event.target.value
        },
        changePoint(event: any) {
            points.value = event.target.value
        },
        changeSearch(event: any) {
            searchName.value = event.target.value
        },
        changeCustomLink(event: any) {
            customLink.value = event.target.value
        },
        async ban(e: any, tgId: number) {
            e.preventDefault()
            const res = await banUser(this.getJwt, tgId)
            if (res) {
                users.value = users.value.filter((u) => u.tgId != tgId)
            }
        },
        async sendPoints(e: any) {

            e.preventDefault()
            const res = await addPoints(this.getJwt, user?.value?.tgId, Number(points.value))
            if (res) {
                newName.value = ''
                points.value = ''
                user.value = undefined
            }

        },
        async findUser(e: any, num: number) {
            e.preventDefault()
            const res = await findUser(this.getJwt, num == 1 ? newName.value : newName2.value)
            if (res && num == 1) {
                user.value = res.users[0]
            }
            if (res && num == 2) {
                user2.value = res.users[0]
            }
            if (res && num == 3) {
                user3.value = res.users[0]
            }
        },
        async findUserForList(e: any, num: number) {
            e.preventDefault()
            const res = await findUser(this.getJwt, searchName.value)
            users.value = res.users

        },
        async findAllUsers() {
            const res = await findAllUsers(this.getJwt)
            if (res) {
                users.value = res.users
            }
        },
        async addAdm(e: any) {

            e.preventDefault()
            const res = await addAdmin(this.getJwt, user3?.value?.tgId)
            if (res) {
                newName3.value = ''
                user3.value = undefined
            }

        },
        async changeRef(e: any) {

            e.preventDefault()
            const res = await changeRefLink(this.getJwt, user2?.value?.tgId, customLink.value)
            if (res) {
                newName2.value = ''
                customLink.value = ''
                user2.value = undefined
            }

        }
    },
    components: { boost }
};
</script>
<style scoped>
.ban {
    color: black;
    cursor: pointer;
    width: 50px;
    height: 20px;
    background-color: grey;
}

.clicks {
    margin-left: 10px;
}

.tableRow {
    margin-bottom: 40px;
}

.dashboard {
    color: white !important;
    padding-bottom: 100px;
    height: 100vh;
    overflow-y: scroll;
    width: 100%;

}

.changeF {
    opacity: 0.5;
    pointer-events: none;
}
</style>