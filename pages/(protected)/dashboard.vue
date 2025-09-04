<script setup>
import { ref, watch } from "vue";
import Container from "../../components/templates/content/container.vue";
import Button from "../../components/ui/button.vue";

const config = useRuntimeConfig();
const tokenCookie = useCookie("auth_token");

const data = ref([]);
const pending = ref(true);
const error = ref(null);

const item = ref("");
const toastMessage = ref("");
const toastVisible = ref(false);

const showToast = (message) => {
  toastMessage.value = message;
  toastVisible.value = true;
  setTimeout(() => {
    toastVisible.value = false;
  }, 3000);
};

const fetchTodos = async () => {
  try {
    const response = await fetch(`${config.public.apiUrl}/todos`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${tokenCookie.value}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const result = await response.json();
    data.value = result.content.entries;
    console.log("Success:", result);
  } catch (err) {
    error.value = err;
    console.error("Error:", err);
  } finally {
    pending.value = false;
  }
};

watch(
  () => tokenCookie.value,
  (newToken) => {
    if (newToken) {
      fetchTodos();
    }
  },
  { immediate: true },
);

const handleSubmit = async () => {
  const formData = {
    item: item.value,
  };

  try {
    const response = await fetch(`${config.public.apiUrl}/todos`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${tokenCookie.value}`,
      },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const result = await response.json();
    console.log("Success:", result);

    item.value = "";
    await fetchTodos();
    showToast("Item added successfully.");
  } catch (err) {
    console.error("Error:", err);
  }
};

const handleUpdate = async (id, isDone) => {
  const action = isDone ? "UNDONE" : "DONE";

  try {
    const response = await fetch(`${config.public.apiUrl}/todos/${id}/mark`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${tokenCookie.value}`,
      },
      body: JSON.stringify({ action }),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const result = await response.json();
    console.log("Updated:", result);

    await fetchTodos();
    showToast(`Item marked as ${action === "DONE" ? "done" : "undone"}.`);
  } catch (err) {
    console.error("Error:", err);
  }
};

const handleDelete = async (id) => {
  try {
    const response = await fetch(`${config.public.apiUrl}/todos/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${tokenCookie.value}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const result = await response.json();
    console.log("Deleted:", result);

    await fetchTodos();
    showToast("Item deleted successfully.");
  } catch (err) {
    console.error("Error:", err);
  }
};

const handleLogout = () => {
  tokenCookie.value = null;
  navigateTo("/login");
};
</script>

<template>
  <Container>
    <div
      class="max-w-lg w-full p-6 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700"
    >
      <div class="flex justify-between items-center mb-6">
        <h1
          class="mb-4 text-2xl font-bold tracking-tight text-gray-900 dark:text-white"
        >
          Todo App
        </h1>
        <Button @click="handleLogout">Logout</Button>
      </div>

      <section>
        <p v-if="pending" class="text-gray-500 dark:text-gray-400">
          Loading...
        </p>
        <p v-else-if="error" class="text-red-500">
          Error loading data: {{ error.message }}
        </p>
        <div v-else>
          <p v-if="data.length === 0" class="text-gray-500 dark:text-gray-400">
            No todos available.
          </p>
          <ul v-else class="list-disc pl-5 space-y-2">
            <li
              v-for="item in data"
              :key="item.id"
              class="flex items-center justify-between"
            >
              <span
                :class="{ 'line-through': item.isDone }"
                class="text-gray-900 dark:text-gray-100"
                >{{ item.item }}</span
              >
              <div class="flex items-center space-x-2">
                <button
                  @click="handleUpdate(item.id, item.isDone)"
                  class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center me-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                  <span class="me-2"
                    >Mark as {{ item.isDone ? "Undone" : "Done" }}</span
                  >
                  <svg
                    v-if="item.isDone"
                    class="w-3.5 h-3.5"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm7.707-3.707a1 1 0 0 0-1.414 1.414L10.586 12l-2.293 2.293a1 1 0 1 0 1.414 1.414L12 13.414l2.293 2.293a1 1 0 0 0 1.414-1.414L13.414 12l2.293-2.293a1 1 0 0 0-1.414-1.414L12 10.586 9.707 8.293Z"
                      clip-rule="evenodd"
                    />
                  </svg>
                  <svg
                    v-else
                    class="w-3.5 h-3.5"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm13.707-1.293a1 1 0 0 0-1.414-1.414L11 12.586l-1.793-1.793a1 1 0 0 0-1.414 1.414l2.5 2.5a1 1 0 0 0 1.414 0l4-4Z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </button>
                <button
                  @click="handleDelete(item.id)"
                  class="text-white focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center"
                >
                  <svg
                    class="w-3.5 h-3.5 me-2"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M8.586 2.586A2 2 0 0 1 10 2h4a2 2 0 0 1 2 2v2h3a1 1 0 1 1 0 2v12a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V8a1 1 0 0 1 0-2h3V4a2 2 0 0 1 .586-1.414ZM10 6h4V4h-4v2Zm1 4a1 1 0 1 0-2 0v8a1 1 0 1 0 2 0v-8Zm4 0a1 1 0 1 0-2 0v8a1 1 0 1 0 2 0v-8Z"
                      clip-rule="evenodd"
                    />
                  </svg>
                  Delete
                </button>
              </div>
            </li>
          </ul>
        </div>
      </section>

      <section class="mt-6">
        <form @submit.prevent="handleSubmit">
          <div class="mb-4">
            <label
              for="item"
              class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              New Todo Item
            </label>
            <input
              v-model="item"
              type="text"
              id="item"
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Enter a new todo item"
              required
            />
          </div>
          <button
            type="submit"
            class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm !w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Add Item
          </button>
        </form>
      </section>
    </div>

    <div
      v-if="toastVisible"
      id="toast-success"
      class="fixed bottom-4 right-4 flex items-center w-full max-w-xs p-4 mb-4 text-gray-500 bg-white rounded-lg shadow-sm dark:text-gray-400 dark:bg-gray-800"
      role="alert"
    >
      <div
        class="inline-flex items-center justify-center shrink-0 w-8 h-8 text-green-500 bg-green-100 rounded-lg dark:bg-green-800 dark:text-green-200"
      >
        <svg
          class="w-5 h-5"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z"
          />
        </svg>
        <span class="sr-only">Check icon</span>
      </div>
      <div class="ms-3 text-sm font-normal">{{ toastMessage }}</div>
      <button
        type="button"
        class="ms-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex items-center justify-center h-8 w-8 dark:text-gray-500 dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700"
        @click="toastVisible = false"
        aria-label="Close"
      >
        <span class="sr-only">Close</span>
        <svg
          class="w-3 h-3"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 14 14"
        >
          <path
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
          />
        </svg>
      </button>
    </div>
  </Container>
</template>
