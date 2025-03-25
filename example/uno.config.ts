import { defineConfig, presetWind3 } from 'unocss';
import presetStackpress from 'stackpress/unocss';

export default defineConfig({
  content: {
    pipeline: {
      include: [
        // include js/ts files
        'plugins/**/*.{js,ts,tsx}',
        '../stackpress/src/view/**/*.{js,ts,tsx}',
        '../stackpress/dist/view/**/*.{js,ts,tsx}',
        '../node_modules/frui/**/*.{js,ts,tsx}',
        '../node_modules/r22n/**/*.{js,ts,tsx}',
        '../node_modules/r22n/**/*.{js,ts,tsx}'
      ],
      // exclude files
      // exclude: []
    },
  },
  presets: [
    presetWind3(),
    presetStackpress()
  ]
})