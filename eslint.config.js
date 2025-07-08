import chooks from 'chooks-eslint-config'

export default chooks({
  typescript: {
    parserOptions: {
      project: true,
    },
  },
}, {
  rules: {
    'ts/no-redeclare': 'off',
  },
})
