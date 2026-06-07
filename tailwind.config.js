module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        base: '#050e20',
        surface: '#0a1325',
        card: '#111927',
        gold: '#e9c349',
        blue: '#47d6ff',
        live: '#22c55e'
      },
      fontFamily: {
        display: ['Bebas Neue', 'sans-serif'],
        body: ['Geist', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace']
      }
    }
  },
  plugins: []
}
