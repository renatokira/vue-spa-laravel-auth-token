<script setup>
import InputLabel from '@/components/InputLabel.vue';
import TextInput from '@/components/TextInput.vue';
import InputError from '@/components/InputError.vue';

import { storeToRefs } from 'pinia'
import { ref,reactive } from "vue";
import { useAuthStore } from "../stores/auth";
import axios from "axios";
import Swal from 'sweetalert';
import Layout from "../Layouts/Layout.vue";

const authStore = useAuthStore();
const { user } = storeToRefs(authStore)

const name = ref(user.value.name);
const profileErrors = ref({});

async function handleEditUser() {

  profileErrors.value = [];


  try {
    const token = localStorage.getItem('token');

    const response = await axios.post("/api/user/edit", {
      name: name.value,
    }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    user.value.name = name.value

    Swal({
      title: 'Success!',
      text: response.data.status,
      icon: 'success'
    })

  } catch (error) {
    if (error.response?.status === 422) {
      profileErrors.value = error.response.data.errors;
    } else {
      Swal({
        title: error.response?.status,
        icon: 'error'
      })
    }
  }

};
</script>

<template>
  <Layout>

    <section class="max-w-xl mx-auto">
      <header>
        <h2 class="text-lg font-medium text-gray-900 my-4">Profile Information</h2>
      </header>
      <form @submit.prevent="handleEditUser" class="space-y-6">
        <div>
          <InputLabel for="name" value="Name" />
          <TextInput id="name" type="text" class="mt-1 block w-full" v-model="name" required autofocus />
          <InputError :message="profileErrors.name && profileErrors.name[0]" class="mt-2" />

        </div>
        <div>
          <InputLabel for="email" value="Email" />
          <TextInput id="email" type="email" disabled class="mt-1 block w-full disabled:bg-gray-100" :value="user?.email"/>
        </div>

        <div>
          <button type="submit"
            class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Submit</button>
        </div>
      </form>

    </section>


  </Layout>
</template>