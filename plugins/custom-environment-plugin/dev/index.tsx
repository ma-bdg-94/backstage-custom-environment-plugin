import React from 'react';
import { createDevApp } from '@backstage/dev-utils';
import {
  customEnvironmentPluginPlugin,
  CustomEnvironmentPluginPage,
} from '../src/plugin';
import { Provider } from 'react-redux';
import {store} from '../src/redux/store';

createDevApp()
  .registerPlugin(customEnvironmentPluginPlugin)
  .addPage({
    element: (
      <Provider store={store}>
        <CustomEnvironmentPluginPage />
      </Provider>
    ),
    title: 'Root Page',
    path: '/custom-environment-plugin',
  })
  .render();
