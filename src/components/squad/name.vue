<template>
    <div class="squad">
        <RouterLink to="/"><img src="../../assets/back.svg" /></RouterLink>
        <div>{{ name }}</div>
        <div></div>
    </div>
</template>

<script>
export default {
    name: 'Name',
    props: ['name'],
    data(props) {
        return {
            name: props.name,
        };
    },
};
</script>

<style scoped>
/* Your component's CSS styles go here */
.squad {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30px;
    margin-top: 16px;
    img {
        width: 10px;
    }
}
</style>