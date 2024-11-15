<template>
    <div class="footer">
        <div class="links">
            <RouterLink to="/squad">
                <div class="link"><img src='../../assets/triangle.svg' />Squad</div>
            </RouterLink>
            <RouterLink to="/top">
                <div class="link"><img src='../../assets/cube.svg' />League</div>
            </RouterLink>
            <RouterLink to="/boost">
                <div class="link"><img src='../../assets/five.svg' />Boost</div>
            </RouterLink>
            <RouterLink to="/referral">
                <div class="link"><img src='../../assets/six.svg' />Referrals</div>
            </RouterLink>
        </div>
    </div>

</template>

<script lang="ts">
import { disconnectUser } from '@/api/auth';


export default {
    name: 'footer',
    beforeUnmount() {
        // disconnectUser()
        // state.value++

    }
}
</script>
<style>
.footer {
    width: 100%;
    z-index: 1;
    position: fixed;
    bottom: 20px;
    left: 0;

}


.links {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    place-content: center;
    height: 100px;
    border-radius: 20px;
    background-image: url(../../assets/bg__footer.png);
    padding: 10px;
    width: 100%;
    padding-left: 27px;
    padding-right: 27px;
    margin-top: 5px;
    margin-bottom: -20px;

    a {
        text-decoration: none;
    }
}

.link {
    /* background-color: rgba(255, 255, 255, 0.1); */
    color: white;
    height: 36px;
    /* border-radius: 20px; */
    font-size: 12px;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    text-transform: uppercase;

    img {
        margin-bottom: 5px;

    }
}
</style>
