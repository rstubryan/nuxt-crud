<script setup>
import { ref, onMounted } from "vue";
import { useFlowbite } from "~/composables/useFlowbite";
import { initFlowbite } from "flowbite";
import Auth from "../../layouts/auth.vue";

const email = ref("");
const password = ref("");

const handleSubmit = async () => {
  const config = useRuntimeConfig();
  const tokenCookie = useCookie("auth_token");
  const formData = {
    email: email.value,
    password: password.value,
  };
  try {
    const response = await fetch(`${config.public.apiUrl}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const result = await response.json();
    console.log("Success:", result);

    tokenCookie.value = result.content.token;
    return navigateTo("/dashboard");
  } catch (error) {
    console.error("Error:", error);
  }
};

onMounted(() => {
  useFlowbite(() => {
    initFlowbite();
  });
});
</script>

<template>
  <Auth>
    <section
      class="max-w-lg w-full p-6 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700"
    >
      <form @submit.prevent="handleSubmit">
        <div class="mb-5">
          <UiLabel for="email">Your email</UiLabel>
          <UiInput
            v-model="email"
            type="email"
            id="email"
            placeholder="name@flowbite.com"
            required
          />
        </div>
        <div class="mb-5">
          <UiLabel for="password">Your password</UiLabel>
          <UiInput v-model="password" type="password" id="password" required />
        </div>
        <div class="flex items-start mb-5">
          <div class="flex items-center h-5">
            <UiCheckbox />
          </div>
          <label
            for="remember"
            class="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
            >Remember me</label
          >
        </div>
        <UiButton type="submit" class="w-full">Submit</UiButton>
      </form>
    </section>
  </Auth>
</template>
