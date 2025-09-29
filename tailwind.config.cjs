module.exports = {
  content: ['./index.html','./src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brandLightStart: '#3B82F6',
        brandLightEnd: '#A78BFA',
        brandDarkStart: '#4C1D95',
        brandDarkEnd: '#1E40AF',
        correct: '#34D399',
        incorrect: '#F87171'
      },
      borderRadius: { 'card': '20px' }
    }
  },
  plugins: []
}
