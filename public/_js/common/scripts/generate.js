import { readFileSync, writeFileSync } from 'fs';

import { Glob, glob, globStream, globStreamSync, globSync } from 'glob';
// const sfcCompiler = require("@vue/compiler-sfc");

const COMPONENT_START = 'export default defineComponent({';

function generateSFC(filePath) {
  try {
    console.log(`Convert ${filePath}`);
    return;
    readFileSync(filePath, 'utf8', (err, data) => {
      if (err) {
        console.log(err);
      } else {
        try {
          const parsed = sfcCompiler.parse(data);
          if (!parsed.descriptor) {
            return;
          }
          let templateEncoded = parsed.descriptor.template
              ? parsed.descriptor.template.content
                  .replace(/[\n\r]/gi, ' ')
                  .replace(/\"/gi, '\\"')
                  .replace(/\s\s+/gi, ' ')
              : null,
            templateLine = templateEncoded
              ? `\ntemplate: "${templateEncoded}",\n`
              : '',
            justScript = parsed.descriptor.script.content,
            startPos = justScript.indexOf(COMPONENT_START),
            scriptAndTemplate =
              justScript.substring(0, startPos + COMPONENT_START.length) +
              templateLine +
              justScript.substring(startPos + COMPONENT_START.length);
          writeFileSync(
            filePath.replace('vue', 'js'),
            scriptAndTemplate,
            (err) => {
              if (err) throw err;
              console.log(`The file ${filePath} has been created!`);
            },
          );
        } catch (parseError) {
          console.log(parseError);
        }
      }
    });
  } catch (readError) {
    console.log(readError);
  }
}

const jsfiles = await glob('./public/components/**/*.js', {
  ignore: 'node_modules/**',
});
jsfiles.forEach((f) => generateSFC(f));

glob('**/*.js', {}, (err, files) => {
  console.log(`Convert ${files.length} SFCs...`);
  files.forEach((filePath) => {
    generateSFC(filePath);
  });
});
