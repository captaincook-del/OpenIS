import { defineConfig, presetWind3, transformerVariantGroup } from 'unocss'

export default defineConfig({
  presets: [presetWind3()],
  transformers: [transformerVariantGroup()],
  theme: {
    colors: { paper: '#EEF1EC', ink: '#16221F', mute: '#3F4D49', line: '#CBD3CD', edge: '#9DAAA5', brand: '#2F5D50', brandsoft: '#DCE8E2', rule: '#E1E6E2', soft: '#F6F8F5', gain: '#1F6B45', propbar: '#B3BDB8' },
    fontFamily: {
      display: '"Bricolage Grotesque", "Segoe UI", sans-serif',
      sans: '"Instrument Sans", system-ui, sans-serif',
    },
  },
  shortcuts: {
    // Conteneur pleine largeur : 16 px de marge sur téléphone, 48 px sur ordinateur
    wrap: 'max-w-[1680px] mx-auto px-4 md:px-12',
    card: 'bg-white border border-line rounded-[14px]',
    eyebrow: 'text-xs md:text-[13px] font-600 text-mute uppercase tracking-[0.06em]',
    'h-page': 'm-0 font-display font-800 text-[32px] md:text-[clamp(36px,3.6vw,56px)] leading-[1.02]',
    'h-sec': 'm-0 font-display font-700 text-2xl md:text-[28px]',
    field: 'w-full min-h-12 px-3.5 rounded-[10px] border border-edge bg-white font-400 text-base focusable',
    chip: 'px-3 py-1 rounded-full border border-line text-sm bg-white/60',
    focusable: 'outline-none focus-visible:(ring-2 ring-ink ring-offset-2)',
    // Bouton radio : l'input reste dans le flux d'accessibilité, le label porte le visuel
    'radio-card': 'relative flex cursor-pointer rounded-[10px] border-2 has-[:focus-visible]:(ring-2 ring-ink ring-offset-2)',
  },
})
