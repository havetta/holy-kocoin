const sfcCompiler = require("@vue/compiler-sfc");
const fs = require("fs");
const glob = require("glob");

const COMPONENT_START = "export default defineComponent({";

function convertSFC(filePath) {
  try {
    fs.readFile(filePath, "utf8", (err, data) => {
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
                  .replace(/[\n\r]/gi, " ")
                  .replace(/\"/gi, '\\"')
                  .replace(/\s\s+/gi, " ")
              : null,
            templateLine = templateEncoded ? `\ntemplate: "${templateEncoded}",\n` : "",
            justScript = parsed.descriptor.script.content,
            startPos = justScript.indexOf(COMPONENT_START),
            scriptAndTemplate =
              justScript.substring(0, startPos + COMPONENT_START.length) +
              templateLine +
              justScript.substring(startPos + COMPONENT_START.length);
          fs.writeFile(
            filePath.replace("vue", "ts"),
            scriptAndTemplate,
            (err) => {
              if (err) throw err;
              console.log(`The file ${filePath} has been created!`);
            }
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

glob("**/*.vue", {}, (err, files) => {
  console.log(`Convert ${files.length} SFCs...`);
  files.forEach((filePath) => {
    convertSFC(filePath);
  });
});