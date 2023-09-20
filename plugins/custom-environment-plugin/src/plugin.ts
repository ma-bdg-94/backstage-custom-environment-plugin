import { createPlugin, createRoutableExtension } from '@backstage/core-plugin-api';

import { rootRouteRef } from './routes';

export const customEnvironmentPluginPlugin = createPlugin({
  id: 'custom-environment-plugin',
  routes: {
    root: rootRouteRef,
  },
});

export const CustomEnvironmentPluginPage = customEnvironmentPluginPlugin.provide(
  createRoutableExtension({
    name: 'CustomEnvironmentPluginPage',
    component: () =>
      import('./components/ExampleComponent').then(m => m.ExampleComponent),
    mountPoint: rootRouteRef,
  }),
);
