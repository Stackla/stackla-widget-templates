import express from 'express';
import 'hbs';
import { WidgetRequest } from '@stackla/ugc-widgets';
import cors from 'cors';
import path from 'path';
import { readFileSync } from "fs";

const expressApp = express();
expressApp.use((_req, res, next) => {
  res.set('Cache-Control', 'public, max-age=300');
  next();
});
expressApp.use(express.static('dist', { redirect: false }));
expressApp.set('view engine', 'hbs');
expressApp.use(cors());

// Register preview route
expressApp.get('/preview', (req, res) => {
  const widgetRequest = req.query as WidgetRequest;
  const widgetType = req.query.widgetType;
  if (!widgetType) {
    return res.status(400).send('widgetType is required');
  }

  const rootDir = path.resolve(__dirname,`../../../../../dist/${widgetType}`);
  
  const layout = `${rootDir}/layout.hbs`;
  const tile =  `${rootDir}/tile.hbs`;
  const css = `${rootDir}/widget.css`;
  const js =`${rootDir}/widget.js`;

  const layoutFileContents = readFileSync(layout, 'utf8');
  const tileFileContents = readFileSync(tile, 'utf8');
  const cssFileContents = readFileSync(css, 'utf8');
  const jsFileContents = readFileSync(js, 'utf8');

  res.render('preview', { 
    widgetRequest: JSON.stringify(widgetRequest),
    layoutCode: layoutFileContents,
    tileCode: tileFileContents,
    cssCode: cssFileContents,
    jsCode: jsFileContents.replace(/\\/g, '\\\\')
    .replace(/\"/g, '\\"')
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '\\r')
    .replace(/\t/g, '\\t')
  });
});

export default expressApp;
