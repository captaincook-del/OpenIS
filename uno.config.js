import { defineConfig, presetWind3, transformerVariantGroup } from 'unocss'

export default defineConfig({
  presets: [presetWind3()],
  transformers: [transformerVariantGroup()],
  theme: {
    colors: { paper: '#EEF1EC', ink: '#16221F', mute: '#3F4D49', line: '#CBD3CD', edge: '#9DAAA5', brand: '#2F5D50', brandsoft: '#DCE8E2' },
    fontFamily: {
      display: '"Bricolage Grotesque", "Segoe UI", sans-serif',
      sans: '"Instrument Sans", system-ui, sans-serif',
    },
  },
  shortcuts: {
    chip: 'px-3 py-1 rounded-full border border-line text-sm bg-white/60',
    focusable: 'outline-none focus-visible:(ring-2 ring-ink ring-offset-2)',
  },
})
