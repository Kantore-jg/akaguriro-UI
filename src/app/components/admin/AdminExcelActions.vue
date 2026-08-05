<script setup>
import { ref } from 'vue';
import { Download, Upload } from 'lucide-vue-next';
import { useApp } from '../../../composables/useApp.js';
import {
  downloadExcelTemplate,
  exportExcelWorkbook,
  importExcelWorkbook,
} from '../../../api/services/excel.js';
import Button from '../ui/Button.vue';

const { showToast, refreshAll, currentUser } = useApp();

const fileInput = ref(null);
const busy = ref(false);

const canManageExcel = () => ['SUPER_ADMIN', 'ADMIN_MARCHE'].includes(currentUser.value?.role);

const downloadFile = async (action, successMessage, errorMessage) => {
  try {
    busy.value = true;
    await action();
    showToast(successMessage, 'success');
  } catch (error) {
    showToast(error?.message || errorMessage, 'error');
  } finally {
    busy.value = false;
  }
};

const handleExport = () =>
  downloadFile(exportExcelWorkbook, 'Export Excel téléchargé', 'Impossible de générer le fichier Excel');

const handleTemplate = () =>
  downloadFile(downloadExcelTemplate, 'Modèle Excel téléchargé', 'Impossible de générer le modèle Excel');

const openFilePicker = () => {
  fileInput.value?.click();
};

const handleFileChange = async (event) => {
  const [file] = event.target.files || [];
  if (!file) return;

  try {
    busy.value = true;
    await importExcelWorkbook(file);
    await refreshAll();
    showToast('Import Excel terminé', 'success');
  } catch (error) {
    showToast(error?.response?.data?.message || error?.message || 'Import Excel impossible', 'error');
  } finally {
    busy.value = false;
    event.target.value = '';
  }
};
</script>

<template>
  <div v-if="canManageExcel()" class="flex flex-wrap items-center gap-2">
    <Button type="button" variant="outline" class="rounded-full" :disabled="busy" @click="handleTemplate">
      <Download class="w-4 h-4 mr-2" />
      Modèle Excel
    </Button>
    <Button type="button" variant="outline" class="rounded-full" :disabled="busy" @click="handleExport">
      <Download class="w-4 h-4 mr-2" />
      Exporter Excel
    </Button>
    <Button type="button" class="rounded-full" :disabled="busy" @click="openFilePicker">
      <Upload class="w-4 h-4 mr-2" />
      Importer Excel
    </Button>
    <input
      ref="fileInput"
      type="file"
      accept=".xlsx,.xls"
      class="hidden"
      @change="handleFileChange"
    />
  </div>
</template>
