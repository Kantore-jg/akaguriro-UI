/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

<script setup>
import { ref } from 'vue';
import { useApp } from '../composables/useApp.js';
import { Store, User, Phone, Briefcase, FileText, CheckCircle2, Clock, AlertTriangle } from 'lucide-vue-next';

const {
  markets,
  requests,
  addPlaceRequest,
  currentUser,
  showToast
} = useApp();

const candidateName = ref(currentUser.value?.name || '');
const candidatePhone = ref(currentUser.value?.phone || '');
const activity = ref('');
const category = ref('Poissonnerie');
const targetMarketId = ref(markets.value[0]?.id ?? null);
const description = ref('');

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

  addPlaceRequest({
    merchantName: candidateName.value,
    merchantPhone: candidatePhone.value,
    activityType: activity.value,
    category: category.value,
    requestedMarketId: targetMarketId.value,
    description: description.value
  });

  activity.value = '';
  description.value = '';
}

function findMarket(marketId) {
  return markets.value.find(m => m.id === marketId);
}
</script>

<template>
  <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-12">
    <!-- Header -->
    <div class="space-y-1">
      <h3 class="text-xs font-bold uppercase tracking-wider text-primary">Formulaire Citoyen</h3>
      <h1 class="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-display">
        Demande Publique d'Octroi d'Emplacement
      </h1>
      <p class="text-slate-500 text-sm max-w-2xl font-medium">
        Postulez en ligne pour obtenir un étalage légal et sécurisé dans l'un des marchés publics connectés du Burundi.
      </p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

      <!-- Left: Demande Form Component -->
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
              <label class="text-slate-500 block">Filière / Catégorie d'activité</label>
              <div class="flex items-center gap-2 bg-background border border-slate-200 rounded-xl px-3 py-2 mr-1">
                <Briefcase class="w-4 h-4 text-slate-400 shrink-0" />
                <select
                  v-model="category"
                  class="bg-transparent border-0 outline-none w-full text-xs cursor-pointer text-slate-700"
                >
                  <option value="Poissonnerie">🐟 Poissonnerie</option>
                  <option value="Café & Thé">☕ Café & Thé de Montagne</option>
                  <option value="Fruits & Légumes">🥑 Fruits & Légumes</option>
                  <option value="Vivres">🌾 Vivres Alimentaires</option>
                  <option value="Textiles">👕 Textiles & Couture</option>
                  <option value="Artisanat">👜 Vanerie & Artisanat</option>
                  <option value="Électronique">🔌 Tech / Services</option>
                </select>
              </div>
            </div>

            <div class="space-y-1">
              <label class="text-slate-500 block">Marché Souhaité</label>
              <div class="flex items-center gap-2 bg-background border border-slate-200 rounded-xl px-3 py-2 mr-1">
                <Store class="w-4 h-4 text-slate-400 shrink-0" />
                <select
                  v-model="targetMarketId"
                  class="bg-transparent border-0 outline-none w-full text-xs cursor-pointer text-slate-700"
                >
                  <option v-for="m in markets" :key="m.id" :value="m.id">{{ m.name }} ({{ m.city }})</option>
                </select>
              </div>
            </div>
          </div>

          <div class="space-y-1">
            <label class="text-slate-500 block">Description Concise de l'Activité Réelle</label>
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
            <label class="text-slate-500 block">Justification (Pourquoi avez-vous besoin de cette place ?)</label>
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
          >
            Soumettre ma demande d'enregistrement
          </button>

        </form>
      </div>

      <!-- Right: Previous requests states -->
      <div class="lg:col-span-5 space-y-6">
        <div class="bg-slate-900 text-white p-6 sm:p-7 rounded-3xl border border-slate-800 space-y-5 shadow-sm">

          <div class="space-y-1">
            <h3 class="text-xs font-black uppercase text-primary tracking-wider">Tableau des Candidatures Actives</h3>
            <p class="text-[11.5px] text-slate-400">
              Suivez en direct l'état d'affectation de vos demandes soumises :
            </p>
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
                  <CheckCircle2 class="w-3 h-3" /> Demande Approuvée (Stall Alloué)
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
                <div
                  v-if="item.status === 'approved'"
                  class="mt-2 text-[10px] text-primary font-extrabold bg-emerald-950/40 p-2 rounded border border-emerald-900/35"
                >
                  🎉 Félicitations ! Un emplacement libre a été attribué et vous avez été enregistré comme marchand officiel. Consultez le plan du marché !
                </div>
              </div>

              <div class="flex justify-end text-[9.5px] font-bold text-slate-500">
                Soumis le {{ item.submittedDate }}
              </div>
            </div>
          </div>

        </div>

        <!-- <div class="bg-slate-100/70 border border-slate-200/40 p-4 rounded-2xl text-xs text-slate-500 font-medium">
          💡 <strong>Note de simulation :</strong> Pour tester le processus de validation de bout-en-bout, soumettez une demande ici, puis basculez sur le profil <strong>🔑 Super Admin</strong> ou <strong>🏢 Admin Marché</strong> via la barre de simu au sommet, allez sur le Dashboard à la colonne <strong>"Demandes"</strong> pour approuver le dossier. Le système mettra en œuvre l'étalage en un instant !
        </div> -->
      </div>

    </div>
  </div>
</template>
