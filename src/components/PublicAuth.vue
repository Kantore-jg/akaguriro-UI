/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

<script setup>
import { ref } from 'vue';
import { useApp } from '../composables/useApp.js';
import { ShieldCheck } from 'lucide-vue-next';

const { setCurrentUser, setViewState, setPublicTab, showToast } = useApp();

const isLogin = ref(true);
const name = ref('');
const phone = ref('');
const password = ref('');

function handleQuickLogin(role) {
  let mockName = 'Gilbert Nkurunziza';
  let mockPhone = '+257 79 000 111';
  let merchantId = undefined;
  let marketId = undefined;

  if (role === 'COMMERCANT') {
    mockName = 'Anésie Ndayishimiye';
    mockPhone = '+257 79 384 102';
    merchantId = 'mer1';
  } else if (role === 'ADMIN_MARCHE') {
    mockName = 'Pierre Nkurikiye';
    mockPhone = '+257 61 454 987';
    marketId = 'm1';
  }

  setCurrentUser({
    id: `u_${role.toLowerCase()}`,
    name: mockName,
    phone: mockPhone,
    role,
    merchantId,
    marketId
  });

  setViewState('DASHBOARD');
  showToast(`Connexion réussie comme ${mockName} (${role.replace('_', ' ')})`, 'success');
}

function handleManualSubmit(e) {
  e.preventDefault();
  if (isLogin.value) {
    if (!phone.value) {
      showToast('Veuillez entrer votre numéro de téléphone', 'error');
      return;
    }
    setCurrentUser({
      id: `u_${Date.now()}`,
      name: 'Utilisateur Certifié',
      phone: phone.value,
      role: 'VISITOR'
    });
    setViewState('PUBLIC');
    setPublicTab('home');
    showToast('Connecté avec succès en tant que Visiteur Certifié', 'success');
  } else {
    if (!name.value || !phone.value) {
      showToast('Veuillez remplir tous les champs obligatoires', 'error');
      return;
    }
    setCurrentUser({
      id: `u_${Date.now()}`,
      name: name.value,
      phone: phone.value,
      role: 'VISITOR'
    });
    setViewState('PUBLIC');
    setPublicTab('home');
    showToast('Inscription au portail réussie ! Vous êtes connecté.', 'success');
  }
}
</script>

<template>
  <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
    <div class="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm grid grid-cols-1 lg:grid-cols-12 min-h-[580px]">

      <!-- Left side: Premium split-screen decorative illustration -->
      <div class="hidden lg:block lg:col-span-5 relative bg-slate-900 text-white p-12 flex flex-col justify-between overflow-hidden">
        <!-- Cover image filter overlay -->
        <div class="absolute inset-0 z-0 opacity-40">
          <img
            src="https://images.unsplash.com/photo-1506484381205-f7945653044d?auto=format&fit=crop&q=80&w=600"
            alt="Gitega Marketplace"
            class="w-full h-full object-cover"
          />
          <div class="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/80 to-transparent"></div>
        </div>

        <div class="relative z-10 space-y-4">
          <div class="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center">
            <ShieldCheck class="w-6 h-6 text-slate-950" />
          </div>
          <h2 class="text-2xl font-black tracking-tight leading-snug font-display text-white">
            Souveraineté Digitale des Marchés du Burundi
          </h2>
          <p class="text-slate-300 text-xs leading-relaxed font-semibold">
            Rejoignez l'écosystème Akaguriro géré directement en étroite coopération avec les mairies municipales pour garantir la transparence des prix et l'ordre des places publiques.
          </p>
        </div>

        <div class="relative z-10 border-t border-slate-800 pt-6 mt-16 space-y-3.5 text-xs text-slate-400 font-semibold">
          <p>✔ Données conformes aux lois du commerce burundais.</p>
          <p>✔ Validation rapide et sécurisée des demandes d'octroi.</p>
          <p>✔ Facturation et téléversement transparents des reçus.</p>
        </div>
      </div>

      <!-- Right side: Modern login/registration form -->
      <div class="lg:col-span-7 p-6 sm:p-12 flex flex-col justify-center space-y-8 bg-white">

        <div class="space-y-2">
          <h1 class="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-display">
            {{ isLogin ? "Heureux de vous revoir" : "Créez votre accès citoyen" }}
          </h1>
          <p class="text-slate-400 text-xs sm:text-sm font-semibold">
            {{ isLogin ? "Connectez-vous pour demander une place ou gérer vos produits" : "Enregistrez-vous pour soumettre des dossiers en ligne" }}
          </p>
        </div>

        <!-- Quick-simulate account selector buttons (Stripe style testing helper) -->
        <div class="bg-slate-50 p-4 rounded-2xl border border-slate-200/50 space-y-2.5">
          <h3 class="text-[11.5px] font-bold text-slate-500 uppercase tracking-wide">Accès Simulé d'Évaluation (Bascule rapide en un clic)</h3>
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px] font-bold">
            <button
              type="button"
              @click="handleQuickLogin('COMMERCANT')"
              class="bg-white hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 text-slate-700 py-1.5 px-2.5 rounded-lg text-left transition-all"
            >
               Commerçant (Anésie)
            </button>
            <button
              type="button"
              @click="handleQuickLogin('ADMIN_MARCHE')"
              class="bg-white hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 text-slate-700 py-1.5 px-2.5 rounded-lg text-left transition-all"
            >
               Admin Marché (Pierre)
            </button>
            <button
              type="button"
              @click="handleQuickLogin('SUPER_ADMIN')"
              class="bg-white hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 text-slate-700 py-1.5 px-2.5 rounded-lg text-left transition-all"
            >
               Super Admin (Gilbert)
            </button>
          </div>
        </div>

        <!-- Core manual Form -->
        <form @submit="handleManualSubmit" class="space-y-4 text-xs font-semibold">

          <div v-if="!isLogin" class="space-y-1">
            <label class="text-slate-500 block">Nom Complet</label>
            <input
              type="text"
              placeholder="ex. Claver Ndayishimiye"
              v-model="name"
              class="w-full bg-slate-50 border border-slate-200 focus:border-emerald-400 focus:bg-white rounded-xl py-3 px-4 outline-none font-medium text-slate-800 transition-colors"
            />
          </div>

          <div class="space-y-1">
            <label class="text-slate-500 block">Téléphone (Identifiant principal)</label>
            <input
              type="tel"
              placeholder="ex. +257 79 123 456"
              v-model="phone"
              class="w-full bg-slate-50 border border-slate-200 focus:border-emerald-400 focus:bg-white rounded-xl py-3 px-4 outline-none font-medium text-slate-800 transition-colors"
              required
            />
          </div>

          <div class="space-y-1">
            <div class="flex justify-between items-center text-xs">
              <label class="text-slate-500">Mot de Passe</label>
              <button
                v-if="isLogin"
                type="button"
                @click="showToast('Lien de réinitialisation simulé envoyé à votre numéro !', 'info')"
                class="text-emerald-600 hover:underline"
              >
                Mot de passe oublié ?
              </button>
            </div>
            <input
              type="password"
              placeholder="••••••••"
              v-model="password"
              class="w-full bg-slate-50 border border-slate-200 focus:border-emerald-400 focus:bg-white rounded-xl py-3 px-4 outline-none font-medium text-slate-800 transition-colors"
            />
          </div>

          <button
            type="submit"
            class="w-full bg-slate-900 hover:bg-slate-800 text-white font-extrabold py-3.5 rounded-xl text-center text-xs tracking-wide transition-all shadow-md pt-3.5"
          >
            {{ isLogin ? "Se connecter" : "S'enregistrer maintenant" }}
          </button>

        </form>

        <!-- Toggle form button -->
        <div class="text-center pt-3 border-t border-slate-100 text-xs text-slate-400 font-bold">
          {{ isLogin ? "Vous n'avez pas de compte ?" : "Vous possédez déjà un compte ?" }}
          <button
            type="button"
            @click="isLogin = !isLogin"
            class="text-emerald-600 hover:underline"
          >
            {{ isLogin ? "Inscrivez-vous gratuitement" : "Connectez-vous à votre espace" }}
          </button>
        </div>

      </div>

    </div>
  </div>
</template>
