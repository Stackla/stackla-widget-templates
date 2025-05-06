import type { StorybookConfig } from '@storybook/web-components-webpack5';

import { join, dirname } from "path"

/**
* This function is used to resolve the absolute path of a package.
* It is needed in projects that use Yarn PnP or are set up within a monorepo.
*/
function getAbsolutePath(value: string): any {
  return dirname(require.resolve(join(value, 'package.json')))
}
const config: StorybookConfig = {
  "stories": [
    "../widgets/**/*.mdx",
    "../widgets/**/*.stories.@(js|jsx|mjs|ts|tsx)"
  ],
  "addons": [
    getAbsolutePath('@storybook/addon-webpack5-compiler-swc'),
    getAbsolutePath('@storybook/addon-essentials'),
    getAbsolutePath('@chromatic-com/storybook')
  ],
  "framework": {
    "name": getAbsolutePath('@storybook/web-components-webpack5'),
    "options": {}
  },
  webpackFinal: async (config) => {
    const distFolderPath = join(__dirname, '../dist');
    // Add loader for Handlebars (.hbs) files
    config.module?.rules?.push({
      test: /\.hbs$/,
      include: distFolderPath,
      use: 'raw-loader',
    });

    // Add loader for raw JavaScript (.js) files
    config.module?.rules?.push({
      test: /\.js$/,
      include: distFolderPath,
      use: 'raw-loader',
    });

    // Add loaders for CSS files
    config.module?.rules?.push({
      test: /\.css$/,
      include: distFolderPath,
      use: ['raw-loader'], // Injects CSS into the DOM
    });

    return config;
  },
};
export default config;