<script setup>
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';

const API_URL = 'http://localhost:3000/tasks';

const tasks = ref([]);
const newTaskTitle = ref('');
const newTaskPriority = ref('asap');

const urgentTasks = computed(() => {
  return tasks.value.filter(task => task.priority === 'urgente');
});

const asapTasks = computed(() => {
  return tasks.value.filter(task => task.priority === 'asap');
});

const sometimeTasks = computed(() => {
  return tasks.value.filter(task => task.priority === 'sometime');
});

const fetchTasks = async () => {
  try {
    const response = await axios.get(API_URL);
    tasks.value = response.data;
  } catch (error) {
    console.error('Erro ao buscar tarefas:', error);
  }
};

const addTask = async () => {
  if (newTaskTitle.value.trim() === '') return;

  try {
    const response = await axios.post(API_URL, {
      title: newTaskTitle.value,
      priority: newTaskPriority.value 
    });
    tasks.value.unshift(response.data);
    newTaskTitle.value = '';
    newTaskPriority.value = 'asap';
  } catch (error) {
    console.error('Erro ao adicionar tarefa:', error);
  }
};

const toggleCompleted = async (task) => {
  try {
    const response = await axios.put(`${API_URL}/${task.id}`);
    const index = tasks.value.findIndex((t) => t.id === task.id);
    if (index !== -1) {
      tasks.value[index] = response.data;
    }
  } catch (error) {
    console.error('Erro ao atualizar tarefa:', error);
  }
};

const deleteTask = async (task) => {
  try {
    await axios.delete(`${API_URL}/${task.id}`);
    tasks.value = tasks.value.filter((t) => t.id !== task.id);
  } catch (error) {
    console.error('Erro ao deletar tarefa:', error);
  }
};

const changePriority = async (task, newPriority) => {
  try {
    const response = await axios.put(`${API_URL}/${task.id}/priority`, { priority: newPriority });
    const index = tasks.value.findIndex((t) => t.id === task.id);
    if (index !== -1) {
      tasks.value[index] = response.data;
    }
  } catch (error) {
    console.error('Erro ao mudar prioridade:', error);
  }
};

onMounted(fetchTasks);
</script>

<template>
  <div class="bg-gray-900 min-h-screen text-white p-8">
    <div class="max-w-7xl mx-auto">
      
      <h1 class="text-3xl font-bold text-center text-blue-400 mb-6">
        Lista To-do
      </h1>

      <form @submit.prevent="addTask" class="flex flex-col md:flex-row gap-3 mb-8 p-6 bg-gray-800 rounded-lg shadow-lg">
        <input
          v-model="newTaskTitle"
          type="text"
          placeholder="O que precisa ser feito?"
          class="flex-grow p-3 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
        />
        <select
          v-model="newTaskPriority"
          class="p-3 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
        >
          <option value="asap">O quanto antes</option>
          <option value="urgente">Urgente</option>
          <option value="sometime">Se sobrar tempo</option>
        </select>
        <button
          type="submit"
          class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-5 rounded-md transition duration-200"
        >
          Adicionar
        </button>
      </form>
      
      <p v-if="tasks.length === 0" class="text-center text-gray-500 text-lg mb-6">
        Você ainda não tem tarefas. Adicione uma acima!
      </p>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">

        <div class="bg-gray-800 rounded-lg shadow-lg p-4">
          <h2 class="text-xl font-bold text-red-400 mb-4 border-b border-red-400 pb-2">
            Urgente
          </h2>
          <ul class="space-y-3 h-96 overflow-y-auto">
            <li
              v-for="task in urgentTasks"
              :key="task.id"
              class="flex flex-col bg-gray-700 p-4 rounded-md shadow-md"
              :class="{ 'opacity-50': task.completed }"
            >
              <div class="flex items-center gap-3">
                <input
                  type="checkbox"
                  :checked="task.completed"
                  @change="toggleCompleted(task)"
                  class="h-5 w-5 flex-shrink-0 checkbox-urgent"
                />
                <span :class="{ 'line-through text-gray-500': task.completed }" class="text-lg">
                  {{ task.title }}
                </span>
              </div>
              <div class="flex items-center justify-between mt-3 pt-3 border-t border-gray-600">
                <select
                  :value="task.priority"
                  @change="changePriority(task, $event.target.value)"
                  class="text-xs bg-gray-600 rounded p-1 focus:outline-none"
                  :disabled="task.completed"
                >
                  <option value="urgente">Urgente</option>
                  <option value="asap">O quanto antes</option>
                  <option value="sometime">Se sobrar tempo</option>
                </select>
                <button @click="deleteTask(task)" class="text-red-500 hover:text-red-400 text-xs font-bold">
                  Excluir
                </button>
              </div>
            </li>
            <p v-if="urgentTasks.length === 0" class="text-center text-gray-500 mt-6">
              Nenhuma tarefa urgente.
            </p>
          </ul>
        </div>

        <div class="bg-gray-800 rounded-lg shadow-lg p-4">
          <h2 class="text-xl font-bold text-blue-400 mb-4 border-b border-blue-400 pb-2">
            O quanto antes
          </h2>
          <ul class="space-y-3 h-96 overflow-y-auto">
            <li
              v-for="task in asapTasks"
              :key="task.id"
              class="flex flex-col bg-gray-700 p-4 rounded-md shadow-md"
              :class="{ 'opacity-50': task.completed }"
            >
              <div class="flex items-center gap-3">
                <input
                  type="checkbox"
                  :checked="task.completed"
                  @change="toggleCompleted(task)"
                  class="h-5 w-5 flex-shrink-0"
                />
                <span :class="{ 'line-through text-gray-500': task.completed }" class="text-lg">
                  {{ task.title }}
                </span>
              </div>
              <div class="flex items-center justify-between mt-3 pt-3 border-t border-gray-600">
                <select
                  :value="task.priority"
                  @change="changePriority(task, $event.target.value)"
                  class="text-xs bg-gray-600 rounded p-1 focus:outline-none"
                  :disabled="task.completed"
                >
                  <option value="urgente">Urgente</option>
                  <option value="asap">O quanto antes</option>
                  <option value="sometime">Se sobrar tempo</option>
                </select>
                <button @click="deleteTask(task)" class="text-red-500 hover:text-red-400 text-xs font-bold">
                  Excluir
                </button>
              </div>
            </li>
            <p v-if="asapTasks.length === 0" class="text-center text-gray-500 mt-6">
              Nenhuma tarefa por enquanto.
            </p>
          </ul>
        </div>

        <div class="bg-gray-800 rounded-lg shadow-lg p-4">
          <h2 class="text-xl font-bold text-gray-400 mb-4 border-b border-gray-400 pb-2">
            Se sobrar tempo
          </h2>
          <ul class="space-y-3 h-96 overflow-y-auto">
            <li
              v-for="task in sometimeTasks"
              :key="task.id"
              class="flex flex-col bg-gray-700 p-4 rounded-md shadow-md"
              :class="{ 'opacity-50': task.completed }"
            >
              <div class="flex items-center gap-3">
                <input
                  type="checkbox"
                  :checked="task.completed"
                  @change="toggleCompleted(task)"
                  class="h-5 w-5 flex-shrink-0 checkbox-sometime"
                />
                <span :class="{ 'line-through text-gray-500': task.completed }" class="text-lg">
                  {{ task.title }}
                </span>
              </div>
              <div class="flex items-center justify-between mt-3 pt-3 border-t border-gray-600">
                <select
                  :value="task.priority"
                  @change="changePriority(task, $event.target.value)"
                  class="text-xs bg-gray-600 rounded p-1 focus:outline-none"
                  :disabled="task.completed"
                >
                  <option value="urgente">Urgente</option>
                  <option value="asap">O quanto antes</option> 
                  <option value="sometime">Se sobrar tempo</option>
                </select>
                <button @click="deleteTask(task)" class="text-red-500 hover:text-red-400 text-xs font-bold">
                  Excluir
                </button>
              </div>
            </li>
            <p v-if="sometimeTasks.length === 0" class="text-center text-gray-500 mt-6">
              Nenhuma tarefa de baixa prioridade.
            </p>
          </ul>
        </div>

      </div>

    </div>
  </div>
</template>