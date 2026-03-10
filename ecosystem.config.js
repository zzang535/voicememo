module.exports = {
  apps: [
    {
      name: 'voicememo',
      script: '.next/standalone/server.js',
      cwd: '/Users/yoonhwang/Project/voicememo',
      env: {
        NODE_ENV: 'production',
        NEXT_TELEMETRY_DISABLED: '1',
        PORT: '3000',
        HOSTNAME: '0.0.0.0',
      },
    },
  ],
};
