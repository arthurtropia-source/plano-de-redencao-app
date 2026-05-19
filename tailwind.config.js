/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Verde-quadro principal (espelha variáveis CSS do v3)
        'v':   'var(--v)',   // #1a3a2a
        'vm':  'var(--vm)',  // #234d38
        'vc':  'var(--vc)',  // #2e6349
        // Dourado
        'o':   'var(--o)',   // #c9a227
        'oc':  'var(--oc)',  // #e8c547
        'op':  'var(--op)',  // #f5e199
        // Neutros
        'mi':  'var(--mi)',  // #f2ead8 marfim
        'cr':  'var(--cr)',  // #e8dfc8 creme
        'tx':  'var(--tx)',  // #d4c8a8 texto secundário
      },
      fontFamily: {
        'cinzel-deco': ['"Cinzel Decorative"', 'serif'],
        'cinzel':      ['"Cinzel"', 'serif'],
        'crimson':     ['"Crimson Pro"', 'Georgia', 'serif'],
        'caveat':      ['"Caveat"', 'cursive'],
      }
    },
  },
  plugins: [],
}
