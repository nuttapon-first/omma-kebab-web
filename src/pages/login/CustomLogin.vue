<template>
  <form @submit.prevent="loginUser">
    <va-input
      v-model="username"
      class="mb-3"
      type="string"
      :label="'username'"
      :error="!!usernameErrors.length"
      :error-messages="usernameErrors"
    />

    <va-input
      v-model="password"
      class="mb-3"
      type="password"
      :label="'password'"
      :error="!!passwordErrors.length"
      :error-messages="passwordErrors"
    />

    <div class="auth-layout__options d-flex align--center justify--space-between">
      <!-- <va-checkbox v-model="keepLoggedIn" class="mb-0" :label="t('auth.keep_logged_in')" /> -->
      <!-- <router-link class="ml-1 link" :to="{ name: 'recover-password' }">{{ t('auth.recover_password') }}</router-link> -->
    </div>

    <div class="d-flex justify--center mt-3">
      <va-button class="my-0" @click="loginUser">{{ 'login' }}</va-button>
    </div>
  </form>
</template>

<script lang="ts">
  import { defineComponent } from 'vue'
  import { login } from './login.api'

  export default defineComponent({
    name: 'Login',
    data() {
      return {
        username: '',
        password: '',
        usernameErrors: [] as any,
        passwordErrors: [] as any,
      }
    },

    methods: {
      async loginUser() {
        try {
          this.usernameErrors = this.username ? [] : ['Username is required']
          this.passwordErrors = this.password ? [] : ['Password is required']

          const payload = {
            username: this.username,
            password: this.password,
          }

          if (payload.username && payload.password) {
            const [err, data] = await login(payload)
            if (err) console.error(err)
            else {
              localStorage.setItem('user', JSON.stringify(data))
              this.$router.push({ name: 'dashboard' })
            }
          }
        } catch (err) {
          console.log(err)
        }
      },
    },
  })
</script>
