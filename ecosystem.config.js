module.exports = {
  apps: [
    {
      name: 'fishmyspot-backend',
      script: 'yarn start:prod',
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
};
