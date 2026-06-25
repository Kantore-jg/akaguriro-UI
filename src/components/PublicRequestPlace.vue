/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

<script setup>
import { ref, computed, watch } from 'vue';
import { useApp } from '../composables/useApp.js';
import { categoriesForMarket, findMarketById } from '../utils/categories.js';
import { Store, User, Phone, Briefcase, FileText, CheckCircle2, Clock, AlertTriangle } from 'lucide-vue-next';

const {
  markets,
  productCategories,
  requests,
  addPlaceRequest,
  currentUser,
  showToast,
} = useApp();

const candidateName = ref(currentUser.value?.name || '');
const candidatePhone = ref(currentUser.value?.phone || '');
const activity = ref('');
const category = ref('');
const targetMarketId = ref(markets.value[0]?.id ?? null);
const description = ref('');

const selectedMarket = computed(() =>
  findMarketById(markets.value, targetMarketId.value),
);

const availableCategories = computed(() =>
  categoriesForMarket(selectedMarket.value, productCategories.value),
);

watch(
  markets,
  (items) => {
    if (!targetMarketId.value && items.length) {
      targetMarketId.value = items[0].id;
    }
  },
  { immediate: true },
);

watch(
  availableCategories,
  (cats) => {
    if (!cats.length) {
      category.value = '';
      return;
    }
    if (!cats.some((c) => c.name === category.value)) {
      category.value = cats[0].name;
    }
  },
  { immediate: true },
);

function handleSubmit(e) {
  e.preventDefault();
  if (!currentUser.value?.id || currentUser.value.role === 'VISITOR') {
    showToast('Connectez-vous pour soumettre une demande.', 'error');
    return;
  }
  if (!candidateName.value || !candidatePhone.value || !activity.value || !description.value) {
    showToast('Veuillez remplir l\'intégralité des champs obligatoires.', 'error');
    return;
  }
  if (!targetMarketId.value) {
    showToast('Aucun marché disponible.', 'error');
    return;
  }
  if (!category.value) {
    showToast('Aucune catégorie disponible pour ce marché.', 'error');
    return;
  }

  addPlaceRequest({
    merchantName: candidateName.value,
    merchantPhone: candidatePhone.value,
    activityType: activity.value,
    category: category.value,
    requestedMarketId: targetMarketId.value,
    description: description.value,
  });

  activity.value = '';
  description.value = '';
}

function findMarket(marketId) {
  return findMarketById(markets.value, marketId);
}
</script>

<template>
  <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-12">
    <div class="space-y-1">
      <h1>
        Demande Publique d'Octroi d'Emplacement
      </h1>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      <div class="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
        <h2 class="text-lg font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
          <Store class="w-5 h-5 text-primary" />
          Introduire un dossier
        </h2>

        <form @submit="handleSubmit" class="space-y-4 text-xs font-bold text-slate-700">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div class="space-y-1">
              <label class="text-slate-500 block">Nom du Candidat</label>
              <div class="flex items-center gap-2 bg-background border border-slate-200 rounded-xl px-3 py-2.5">
                <User class="w-4 h-4 text-slate-400 shrink-0" />
                <input
                  type="text"
                  placeholder="ex. Emery Ndayiragije"
                  v-model="candidateName"
                  class="bg-transparent border-0 outline-none text-xs w-full text-slate-800 font-medium"
                  required
                />
              </div>
            </div>

            <div class="space-y-1">
              <label class="text-slate-500 block">Numéro de Téléphone</label>
              <div class="flex items-center gap-2 bg-background border border-slate-200 rounded-xl px-3 py-2.5">
                <Phone class="w-4 h-4 text-slate-400 shrink-0" />
                <input
                  type="tel"
                  placeholder="ex. +257 79 884 902"
                  v-model="candidatePhone"
                  class="bg-transparent border-0 outline-none text-xs w-full text-slate-800 font-medium"
                  required
                />
              </div>
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div class="space-y-1">
              <label class="text-slate-500 block">Marché Souhaité</label>
              <div class="flex items-center gap-2 bg-background border border-slate-200 rounded-xl px-3 py-2 mr-1">
                <Store class="w-4 h-4 text-slate-400 shrink-0" />
                <select
                  v-model="targetMarketId"
                  class="bg-transparent border-0 outline-none w-full text-xs cursor-pointer text-slate-700"
                >
                  <option v-for="m in markets" :key="m.id" :value="m.id">{{ m.name }}</option>
                </select>
              </div>
            </div>
            <div class="space-y-1">
              <label class="text-slate-500 block">Catégorie d'activité</label>
              <div class="flex items-center gap-2 bg-background border border-slate-200 rounded-xl px-3 py-2 mr-1">
                <Briefcase class="w-4 h-4 text-slate-400 shrink-0" />
                <select
                  v-model="category"
                  class="bg-transparent border-0 outline-none w-full text-xs cursor-pointer text-slate-700"
                  :disabled="!availableCategories.length"
                  required
                >
                  <option v-if="!availableCategories.length" value="" disabled>
                    Aucune catégorie disponible
                  </option>
                  <option v-for="cat in availableCategories" :key="cat.id" :value="cat.name">
                    {{ cat.name }}
                  </option>
                </select>
              </div>
            </div>

            
          </div>

          <div class="space-y-1">
            <label class="text-slate-500 block">Description</label>
            <div class="flex items-center gap-2 bg-background border border-slate-200 rounded-xl px-3 py-2.5">
              <FileText class="w-4 h-4 text-slate-400 shrink-0 self-start mt-1" />
              <input
                type="text"
                placeholder="ex. Vente de fret et de fret de Rumonge sur étal frais ventilé."
                v-model="activity"
                class="bg-transparent border-0 outline-none text-xs w-full text-slate-800 font-medium"
                required
              />
            </div>
          </div>

          <div class="space-y-1">
            <label class="text-slate-500 block">Pourquoi avez-vous besoin de cette place ?</label>
            <textarea
              rows="4"
              placeholder="Rédigez ici vos motivations..."
              v-model="description"
              class="w-full bg-background border border-slate-200 rounded-xl py-2.5 px-4 outline-none font-medium text-slate-850 text-xs focus:bg-white focus:border-primary transition-colors"
              required
            />
          </div>

          <button
            type="submit"
            class="w-full bg-primary hover:bg-primary transition-all text-white font-extrabold py-3.5 rounded-xl text-center text-xs tracking-wide shadow shadow-emerald-700/30 pt-3.5"
            :disabled="!availableCategories.length"
          >
            Soumettre
          </button>
        </form>
      </div>

      <div class="lg:col-span-5 space-y-6">
        <div class="bg-slate-900 text-white p-6 sm:p-7 rounded-3xl border border-slate-800 space-y-5 shadow-sm">
          <div class="space-y-1">
            <h3 class="text-xs font-black uppercase text-primary tracking-wider">Tableau des Candidatures Actives</h3>
          </div>

          <div v-if="requests.length === 0" class="text-center py-8 text-slate-500 text-xs">
            Aucun dossier soumis dans votre historique.
          </div>
          <div v-else class="space-y-3.5 max-h-[460px] overflow-y-auto pr-1">
            <div
              v-for="item in requests"
              :key="item.id"
              class="bg-slate-950 p-4 rounded-xl border border-slate-850 space-y-3.5"
            >
              <div class="flex justify-between items-start">
                <div>
                  <h4 class="text-xs font-black text-white">{{ item.merchantName }}</h4>
                  <p class="text-[10px] text-slate-400 tracking-tight mt-0.5">{{ item.merchantPhone }}</p>
                </div>
                <span
                  v-if="item.status === 'pending'"
                  class="inline-flex items-center gap-1 bg-amber-50 text-amber-700 border border-amber-200 text-[10px] px-2.5 py-0.5 rounded-full font-bold"
                >
                  <Clock class="w-3 h-3" /> En attente d'évaluation
                </span>
                <span
                  v-else-if="item.status === 'approved'"
                  class="inline-flex items-center gap-1 bg-emerald-50 text-primary border border-primary/20 text-[10px] px-2.5 py-0.5 rounded-full font-bold"
                >
                  <CheckCircle2 class="w-3 h-3" /> Demande Approuvée
                </span>
                <span
                  v-else-if="item.status === 'rejected'"
                  class="inline-flex items-center gap-1 bg-red-50 text-red-700 border border-red-200 text-[10px] px-2.5 py-0.5 rounded-full font-bold"
                >
                  <AlertTriangle class="w-3 h-3" /> Dossier Rejeté
                </span>
              </div>

              <div class="space-y-1.5 text-[11px] border-t border-slate-900 pt-2.5 text-slate-300">
                <p><strong class="text-white">Activité :</strong> {{ item.activityType }}</p>
                <p><strong class="text-white">Filière d'affaire :</strong> {{ item.category }}</p>
                <p><strong class="text-white">Marché :</strong> {{ findMarket(item.requestedMarketId)?.name || 'Inconnu' }}</p>
              </div>

              <div class="flex justify-end text-[9.5px] font-bold text-slate-500">
                Soumis le {{ item.submittedDate }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>