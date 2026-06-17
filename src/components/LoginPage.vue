<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useApp } from '../composables/useApp.js';
import { getErrorMessage } from '../api/client.js';
import { ShieldCheck, ArrowLeft, Upload, User } from 'lucide-vue-next';

const router = useRouter();
const { login, register, showToast } = useApp();

const isLogin = ref(true);
const name = ref('');
const email = ref('');
const phone = ref('');
const password = ref('');
const passwordConfirmation = ref('');
const avatarFile = ref(null);
const avatarPreview = ref(null);
const submitting = ref(false);

const DEMO_ACCOUNTS = [
  { label: 'Commerçant', email: 'commercant@akaguriro.bi' },
  { label: 'Admin Marché', email: 'admin.bujumbura@akaguriro.bi' },
  { label: 'Super Admin', email: 'admin@akaguriro.bi' },
];

function onAvatarChange(e) {
  const file = e.target.files?.[0];
  avatarFile.value = file || null;
  if (file) {
    avatarPreview.value = URL.createObjectURL(file);
  } else {
    avatarPreview.value = null;
  }
}

async function handleQuickLogin(demoEmail) {
  submitting.value = true;
  try {
    const user = await login(demoEmail, 'password');
    router.push(['SUPER_ADMIN', 'ADMIN_MARCHE', 'COMMERCANT'].includes(user.role) ? '/admin' : '/');
  } catch (error) {
    showToast(getErrorMessage(error, 'Connexion impossible'), 'error');
  } finally {
    submitting.value = false;
  }
}

async function handleSubmit(e) {
  e.preventDefault();
  submitting.value = true;
  try {
    if (isLogin.value) {
      if (!email.value || !password.value) {
        showToast('Email et mot de passe requis', 'error');
        return;
      }
      const user = await login(email.value, password.value);
      router.push(['SUPER_ADMIN', 'ADMIN_MARCHE', 'COMMERCANT'].includes(user.role) ? '/admin' : '/');
    } else {
      if (!name.value || !email.value || !password.value) {
        showToast('Veuillez remplir tous les champs obligatoires', 'error');
        return;
      }
      if (password.value !== passwordConfirmation.value) {
        showToast('Les mots de passe ne correspondent pas', 'error');
        return;
      }
      await register({
        name: name.value,
        email: email.value,
        phone: phone.value || undefined,
        password: password.value,
        password_confirmation: passwordConfirmation.value,
        avatar: avatarFile.value || undefined,
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
  <div
    class="min-h-screen relative flex items-center justify-center p-4 sm:p-8"
    style="background-image: url('/login-bg.png'); background-size: cover; background-position: center;"
  >
    <div class="absolute inset-0 bg-slate-950/65 backdrop-blur-[2px]"></div>

    <button
      type="button"
      class="absolute top-5 left-5 z-20 flex items-center gap-2 text-white/80 hover:text-white text-xs font-bold uppercase tracking-wide transition-colors"
      @click="router.push('/')"
    >
      <ArrowLeft class="w-4 h-4" />
      Retour au portail
    </button>

    <div class="relative z-10 w-full max-w-md">
      <div class="bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl border border-white/20 overflow-hidden">

        <div class="p-8 space-y-6">
          <form @submit="handleSubmit" class="space-y-4">
            <div v-if="!isLogin" class="space-y-1">
              <label class="text-xs font-bold text-slate-500">Nom complet</label>
              <input
                v-model="name"
                type="text"
                placeholder="ex. Claver Ndayishimiye"
                class="w-full bg-slate-50 border border-slate-200 focus:border-emerald-400 rounded-xl py-3 px-4 text-sm outline-none"
              />
            </div>

            <div class="space-y-1">
              <label class="text-xs font-bold text-slate-500">Email</label>
              <input
                v-model="email"
                type="email"
                placeholder="ex. commercant@akaguriro.bi"
                class="w-full bg-slate-50 border border-slate-200 focus:border-emerald-400 rounded-xl py-3 px-4 text-sm outline-none"
                required
              />
            </div>

            <div v-if="!isLogin" class="space-y-1">
              <label class="text-xs font-bold text-slate-500">Téléphone</label>
              <input
                v-model="phone"
                type="tel"
                placeholder="ex. +257 79 123 456"
                class="w-full bg-slate-50 border border-slate-200 focus:border-emerald-400 rounded-xl py-3 px-4 text-sm outline-none"
              />
            </div>

            <div v-if="!isLogin" class="space-y-2">
              <label class="text-xs font-bold text-slate-500">Photo de profil</label>
              <div class="flex items-center gap-4">
                <div class="w-14 h-14 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center shrink-0">
                  <img v-if="avatarPreview" :src="avatarPreview" alt="Aperçu" class="w-full h-full object-cover" />
                  <User v-else class="w-6 h-6 text-slate-400" />
                </div>
                <label class="flex-1 cursor-pointer">
                  <span class="inline-flex items-center gap-2 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-2 rounded-lg hover:bg-emerald-100 transition-colors">
                    <Upload class="w-4 h-4" />
                    Choisir une image
                  </span>
                  <input type="file" accept="image/*" class="hidden" @change="onAvatarChange" />
                </label>
              </div>
            </div>

            <div class="space-y-1">
              <label class="text-xs font-bold text-slate-500">Mot de passe</label>
              <input
                v-model="password"
                type="password"
                placeholder="••••••••"
                class="w-full bg-slate-50 border border-slate-200 focus:border-emerald-400 rounded-xl py-3 px-4 text-sm outline-none"
                required
              />
            </div>

            <div v-if="!isLogin" class="space-y-1">
              <label class="text-xs font-bold text-slate-500">Confirmer le mot de passe</label>
              <input
                v-model="passwordConfirmation"
                type="password"
                placeholder="••••••••"
                class="w-full bg-slate-50 border border-slate-200 focus:border-emerald-400 rounded-xl py-3 px-4 text-sm outline-none"
                required
              />
            </div>

            <button
              type="submit"
              :disabled="submitting"
              class="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-3.5 rounded-xl text-sm transition-all disabled:opacity-50"
            >
              {{ submitting ? 'Chargement...' : (isLogin ? 'Se connecter' : "S'inscrire") }}
            </button>
          </form>

          <p class="text-center text-xs text-slate-500 font-semibold">
            {{ isLogin ? "Pas encore de compte ?" : "Déjà inscrit ?" }}
            <button type="button" class="text-emerald-600 hover:underline font-bold" @click="isLogin = !isLogin">
              {{ isLogin ? "Créer un compte" : "Se connecter" }}
            </button>
          </p>

        </div>
      </div>
    </div>
  </div>
</template>