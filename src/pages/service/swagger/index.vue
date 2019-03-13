<template>
  <d2-container-frame :src="src"/>
</template>
<script>
export default {
  name: 'Taroco-Swagger',
  data () {
    return {
      src: `${process.env.VUE_APP_API}/swagger-ui.html`
    }
  }
}
</script>
