/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useApp } from '../composables/useApp.js';
import { getErrorMessage } from '../api/client.js';
import { ShieldCheck } from 'lucide-vue-next';

const router = useRouter();
const { login, register, showToast } = useApp();

const isLogin = ref(true);
const name = ref('');
const email = ref('');
const phone = ref('');
const password = ref('');
const submitting = ref(false);

const DEMO_ACCOUNTS = [
  { label: 'Commerçant (Anésie)', email: 'commercant@akaguriro.bi', role: 'COMMERCANT' },
  { label: 'Admin Marché (Bujumbura)', email: 'admin.bujumbura@akaguriro.bi', role: 'ADMIN_MARCHE' },
  { label: 'Super Admin', email: 'admin@akaguriro.bi', role: 'SUPER_ADMIN' },
];

async function handleQuickLogin(demoEmail) {
  submitting.value = true;
  try {
    const user = await login(demoEmail, 'password');
    if (['SUPER_ADMIN', 'ADMIN_MARCHE', 'COMMERCANT'].includes(user.role)) {
      router.push('/admin');
    } else {
      router.push('/');
    }
  } catch (error) {
    showToast(getErrorMessage(error, 'Connexion impossible'), 'error');
  } finally {
    submitting.value = false;
  }
}

async function handleManualSubmit(e) {
  e.preventDefault();
  submitting.value = true;
  try {
    if (isLogin.value) {
      if (!email.value || !password.value) {
        showToast('Email et mot de passe requis', 'error');
        return;
      }
      const user = await login(email.value, password.value);
      if (['SUPER_ADMIN', 'ADMIN_MARCHE', 'COMMERCANT'].includes(user.role)) {
        router.push('/admin');
      } else {
        router.push('/');
      }
    } else {
      if (!name.value || !email.value || !password.value) {
        showToast('Veuillez remplir tous les champs obligatoires', 'error');
        return;
      }
      await register({
        name: name.value,
        email: email.value,
        phone: phone.value || undefined,
        password: password.value,
      });
      router.push('/');
    }
  } catch (error) {
    showToast(getErrorMessage(error), 'error');
  } finally {
    submitting.value = false;
  }
}
</script>

<template>
  <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
    <div class="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm grid grid-cols-1 lg:grid-cols-12 min-h-[580px]">

      <div class="hidden lg:block lg:col-span-5 relative bg-slate-900 text-white p-12 flex flex-col justify-between overflow-hidden">
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
            Connectez-vous à la plateforme AKAGURIRO pour gérer les marchés publics, les emplacements et les produits en temps réel.
          </p>
        </div>

        <div class="relative z-10 border-t border-slate-800 pt-6 mt-16 space-y-3.5 text-xs text-slate-400 font-semibold">
          <p>✔ API Laravel sécurisée (Sanctum)</p>
          <p>✔ Validation des demandes d'octroi en ligne</p>
          <p>✔ Téléversement et validation des reçus</p>
        </div>
      </div>

      <div class="lg:col-span-7 p-6 sm:p-12 flex flex-col justify-center space-y-8 bg-white">

        <div class="space-y-2">
          <h1 class="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-display">
            {{ isLogin ? "Heureux de vous revoir" : "Créez votre accès citoyen" }}
          </h1>
          <p class="text-slate-400 text-xs sm:text-sm font-semibold">
            {{ isLogin ? "Connectez-vous avec votre email et mot de passe" : "Inscrivez-vous pour accéder au portail" }}
          </p>
        </div>

        <div class="bg-slate-50 p-4 rounded-2xl border border-slate-200/50 space-y-2.5">
          <h3 class="text-[11.5px] font-bold text-slate-500 uppercase tracking-wide">Comptes de démonstration (mot de passe : password)</h3>
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px] font-bold">
            <button
              v-for="demo in DEMO_ACCOUNTS"
              :key="demo.email"
              type="button"
              :disabled="submitting"
              @click="handleQuickLogin(demo.email)"
              class="bg-white hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 text-slate-700 py-1.5 px-2.5 rounded-lg text-left transition-all disabled:opacity-50"
            >
              {{ demo.label }}
            </button>
          </div>
        </div>

        <form @submit="handleManualSubmit" class="space-y-4 text-xs font-semibold">

          <div v-if="!isLogin" class="space-y-1">
            <label class="text-slate-500 block">Nom Complet</label>
            <input
              v-model="name"
              type="text"
              placeholder="ex. Claver Ndayishimiye"
              class="w-full bg-slate-50 border border-slate-200 focus:border-emerald-400 focus:bg-white rounded-xl py-3 px-4 outline-none font-medium text-slate-800 transition-colors"
            />
          </div>

          <div class="space-y-1">
            <label class="text-slate-500 block">Email</label>
            <input
              v-model="email"
              type="email"
              placeholder="ex. commercant@akaguriro.bi"
              class="w-full bg-slate-50 border border-slate-200 focus:border-emerald-400 focus:bg-white rounded-xl py-3 px-4 outline-none font-medium text-slate-800 transition-colors"
              required
            />
          </div>

          <div v-if="!isLogin" class="space-y-1">
            <label class="text-slate-500 block">Téléphone</label>
            <input
              v-model="phone"
              type="tel"
              placeholder="ex. +257 79 123 456"
              class="w-full bg-slate-50 border border-slate-200 focus:border-emerald-400 focus:bg-white rounded-xl py-3 px-4 outline-none font-medium text-slate-800 transition-colors"
            />
          </div>

          <div class="space-y-1">
            <label class="text-slate-500 block">Mot de Passe</label>
            <input
              v-model="password"
              type="password"
              placeholder="••••••••"
              class="w-full bg-slate-50 border border-slate-200 focus:border-emerald-400 focus:bg-white rounded-xl py-3 px-4 outline-none font-medium text-slate-800 transition-colors"
              required
            />
          </div>

          <button
            type="submit"
            :disabled="submitting"
            class="w-full bg-slate-900 hover:bg-slate-800 text-white font-extrabold py-3.5 rounded-xl text-center text-xs tracking-wide transition-all shadow-md disabled:opacity-50"
          >
            {{ submitting ? 'Chargement...' : (isLogin ? "Se connecter" : "S'enregistrer maintenant") }}
          </button>

        </form>

        <div class="text-center pt-3 border-t border-slate-100 text-xs text-slate-400 font-bold">
          {{ isLogin ? "Vous n'avez pas de compte ?" : "Vous possédez déjà un compte ?" }}
          <button type="button" @click="isLogin = !isLogin" class="text-emerald-600 hover:underline">
            {{ isLogin ? "Inscrivez-vous gratuitement" : "Connectez-vous à votre espace" }}
          </button>
        </div>

      </div>

    </div>
  </div>
</template>