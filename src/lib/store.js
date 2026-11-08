import { reactive } from 'vue'

// Langue : ?lang=en dans l'adresse, sinon dernier choix mémorisé, sinon langue du navigateur
const initialLang = () => {
  const q = new URLSearchParams(location.search).get('lang')
  if (q === 'fr' || q === 'en') return q
  try { const s = localStorage.getItem('lang'); if (s === 'fr' || s === 'en') return s } catch {}
  return navigator.language?.toLowerCase().startsWith('en') ? 'en' : 'fr'
}

// Choix partagé entre les pages : taille, niveau, langue
export const state = reactive({ sizeId: 'pme', levelIdx: 1, lang: initialLang() })
