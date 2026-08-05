<script setup>
import { ref } from 'vue';
import { Download, Upload, FileSpreadsheet } from 'lucide-vue-next';
import { useApp } from '../composables/useApp.js';
import {
  downloadExcelTemplate,
  exportExcelWorkbook,
  importExcelWorkbook,
} from '../api/services/excel.js';
import Button from '../app/components/ui/Button.vue';
import { Card, CardContent } from '../app/components/ui/card';

const { showToast, refreshAll } = useApp();

const fileInput = ref(null);
const selectedFileName = ref('Aucun fichier sélectionné');
const busy = ref(false);

const handleExport = async () => {
  try {
    busy.value = true;
    await exportExcelWorkbook();
    showToast('Export Excel téléchargé', 'success');
  } catch (error) {
    showToast(error?.message || 'Impossible de générer le fichier Excel', 'error');
  } finally {
    busy.value = false;
  }
};

const handleTemplate = async () => {
  try {
    busy.value = true;
    await downloadExcelTemplate();
    showToast('Modèle Excel téléchargé', 'success');
  } catch (error) {
    showToast(error?.message || 'Impossible de générer le modèle Excel', 'error');
  } finally {
    busy.value = false;
  }
};

const openFilePicker = () => {
  fileInput.value?.click();
};

const handleFileChange = async (event) => {
  const [file] = event.target.files || [];
  if (!file) return;

  selectedFileName.value = file.name;
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
  <Card class="border shadow-sm">
    <CardContent class="p-5 space-y-4">
      <div class="flex items-start gap-3">
        <div class="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
          <FileSpreadsheet class="w-5 h-5" />
        </div>
        <div class="space-y-1">
          <h3 class="text-sm font-black text-slate-900">Import / Export Excel</h3>
          <p class="text-xs text-slate-500">
            Exportez les données existantes ou importez un classeur avec catégories, marchés, blocs, utilisateurs, emplacements et produits.
          </p>
        </div>
      </div>

      <div class="flex flex-wrap gap-2">
        <Button type="button" variant="outline" :disabled="busy" @click="handleExport">
          <Download class="w-4 h-4 mr-2" />
          Exporter
        </Button>
        <Button type="button" variant="outline" :disabled="busy" @click="handleTemplate">
          <Download class="w-4 h-4 mr-2" />
          Modèle
        </Button>
        <Button type="button" :disabled="busy" @click="openFilePicker">
          <Upload class="w-4 h-4 mr-2" />
          Importer
        </Button>
        <input
          ref="fileInput"
          type="file"
          accept=".xlsx,.xls"
          class="hidden"
          @change="handleFileChange"
        />
      </div>

      <p class="text-[11px] text-slate-400">
        Fichier sélectionné: {{ selectedFileName }}
      </p>
    </CardContent>
  </Card>
</template>
