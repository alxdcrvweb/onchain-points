<template>
    <Column>
        <Title>{{ tableTitle }}</Title>
        <BlockContainer reverseGradient>
              <Loader
                v-if="isLoading"
                message="Loading leaderboard"
              />

          <ErrorScreen v-else-if="!isLoading&&(!myData||!tableData)" title="Loading failed" message="Try again later" hide-reload-button />

          <div v-else>
              <div class="tableRowMe">
                  <div><span>{{ myData?.userRank == 1 ? "🥇" : myData?.userRank == 2 ? "🥈" : myData.userRank == 3 ? "🥉"
                      :
                          myData.userRank }}</span>
                      <div class="tableMyName">{{ myData?.fullName }}</div>
                  </div>
                  <div>
                      <div>{{ (myData?.clicks || myData?.points) ? numberWithCommas((myData?.clicks || myData?.points).toFixed(0)) : 0 }}
                      </div>
                      <img src="../../assets/coin.png" />
                  </div>
              </div>
              <div class="table">
                  <div v-for="item in tableData" v-bind:key="item._id">
                      <div class="tableRow">
                          <div><span>{{ item?.userRank == 1 ? "🥇" : item?.userRank == 2 ? "🥈" : item.userRank == 3 ?
                              "🥉"
                                  : item.userRank }}</span>
                              <div class="tableUserName">{{ item?.fullName }}</div>

                          </div>
                          <div>
                              <div>{{ (item?.clicks || item?.points) ? numberWithCommas((item?.clicks || item?.points).toFixed(0)) : 0 }}
                              </div>
                              <img src="../../assets/coin.png" />
                          </div>
                      </div>
                  </div>
              </div>
          </div>
        </BlockContainer>
    </Column>
</template>

<script lang="ts">
import { user } from '@/store/leaderboard';
import { defineProps } from 'vue';
import {numberWithCommas} from '@/utils/get'
import Title from "@/components/layouts/Title.vue";
import Column from "@/components/layouts/Column.vue";
import BlockContainer from "@/components/layouts/BlockContainer.vue";
import Loader from "@/components/utilityScreens/Loader.vue";
import ErrorScreen from "@/components/utilityScreens/ErrorScreen.vue";
defineProps<{
    tableData: user[]
    tableTitle: string
    myData: user
}>()
export default {
    name: 'table',
  components: {ErrorScreen, Loader, BlockContainer, Column, Title},
    props: ['tableData', 'tableTitle', "myData", 'isLoading'],
    setup(props) {
        // setup() receives props as the first argument.
        // let tableTitle = props.tableTitle
        // let tableData = props.tableData
        // let myData = props.myData
        // console.log('tableData', tableData, 'myData', myData)
        return { numberWithCommas }
    }
}
</script>
<style lang="scss">
.table {
    width: 100%;
    z-index: 1;
    max-height: calc(100vh - 470px);
    overflow-y: scroll;
    padding-top: 15px;
}

.tableFull {
    border: 1px solid #303030;
    backdrop-filter: blur(10px) invert(5%);
    padding: 16px;
}

.tableTitle {
    font-size: 16px;
    text-transform: uppercase;
    margin-bottom: 10px;
    margin-left: 15px;
    margin-top: 20px;
}

.tableUserName {
    color: rgba(255, 255, 255, 0.65);
    letter-spacing: 1px;
    max-width: 200px;
    overflow-x: hidden;
}

.tableMyName {
    font-size: 16px;
    font-weight: 600;
    letter-spacing: 1px;
    max-width: 200px;
    overflow-x: hidden;
}

.tableRowMe {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 40px;
    width: 100%;
    padding-bottom: 20px;
    padding-top: 10px;
    border-bottom: 1px solid #5C5C5C;
    div {
        display: flex;
        align-items: center;
        span {
            font-size: 12px;
            width: fit-content;
            /* max-width: fit-content; */
            min-width: 24px;
        }
    }

    img {
        width: 17px;
        height: 17px;
        margin-left: 8px;
    }
}

.tableRow {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 27px;
    width: 100%;
    margin-bottom: 15px;

    div {
        display: flex;
        align-items: center;

        span {
            font-size: 12px;
            width: 24px;
        }
    }

    img {
        width: 17px;
        height: 17px;
        margin-left: 8px;
    }
}

.loadingTable {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 200px;
    width: 100%;
    img {
        width: 50px;
        height: 50px;
    }
}
</style>
