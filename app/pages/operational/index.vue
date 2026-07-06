<script setup lang="ts">

definePageMeta({
  layout: 'operational',
});
const { login } = useSanctumAuth()

const credentials = {
  email: null,
  password: null,
  remember: false,
}

const loginFire = async () => {
  await login(credentials)
}
</script>

<template>
  <div class="hero bg-base-200 min-h-screen">
    <div class="hero-content flex-col lg:flex-row-reverse">
      <div class="text-center lg:text-left">
        <h1 class="text-4xl font-bold">Login now!</h1>
        <p class="py-6">
          PGM - Operational made to make your job easy.
        </p>
      </div>
      <div class="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
        <div class="card-body">
          <form @submit.prevent="loginFire">
            <fieldset class="fieldset">
              <label class="label">Email</label>
              <input v-model="credentials.email" type="email" class="input" placeholder="Email" />
              <label class="label">Password</label>
              <input v-model="credentials.password" type="password" class="input" placeholder="Password" />
              <label class="label">
                <input v-model="credentials.remember" type="checkbox" class="checkbox" />
                Remember me
              </label>
              <div><a class="link link-hover">Forgot password?</a></div>
              <button class="btn btn-neutral mt-4" type="submit">Login</button>
            </fieldset>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>