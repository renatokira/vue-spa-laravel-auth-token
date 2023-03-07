<script setup>
import InputLabel from '@/components/InputLabel.vue';
import TextInput from '@/components/TextInput.vue';
import InputError from '@/components/InputError.vue';

import { ref } from "vue";
import { useAuthStore } from "../stores/auth";

const authStore = useAuthStore();

const form = ref({
  email: "test@example.com",
  password: "password",
});
</script>

<template>
  <section class="bg-[#F4F7FF] h-screen">
    <div class="px-2 h-full text-gray-800">
      <div class="flex justify-center items-center h-full">

        <div class="w-full px-4">
          <div class="
                      relative
                      mx-auto
                      max-w-[525px]
                      overflow-hidden
                      rounded-lg
                      bg-white
                      py-16
                      px-10
                 
                      sm:px-12
                      md:px-[60px]
                    ">
            <div class="mb-10 text-center md:mb-16">SPA Authentication Token Laravel</div>
            <form @submit.prevent="authStore.handleLogin(form)" class="space-y-6">
              <div>
                <InputLabel for="email" value="Email" />
                <TextInput id="email" type="email" class="mt-1 block w-full" v-model="form.email" autofocus />
                <InputError :message="authStore.errors.email && authStore.errors.email[0]" class="mt-2" />
              </div>
              <div>
                <InputLabel for="password" value="Password" />
                <TextInput id="password" type="password" class="mt-1 block w-full" v-model="form.password" required
                  autofocus />
                <InputError :message="authStore.errors.password && authStore.errors.password[0]" class="mt-2" />
              </div>

              <div class="mb-10">
                <button type="submit" class="
                            w-full
                            px-4
                            py-3
                            bg-indigo-500
                            hover:bg-indigo-700
                            rounded-md
                            text-white
                          ">
                  Login
                </button>
              </div>
            </form>
          </div>
        </div>

      </div>
    </div>
  </section>
</template>





