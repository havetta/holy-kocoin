import { readFileSync, writeFileSync} from "fs";

export function componentput(request, respond) {
  let body = '';
  filePath = __dirname + '/public/data.txt';
  request.on('data', function(data) {
      body += data;
  });

  request.on('end', function () {
    writeFileSync ("public/templates/", JSON.stringify(res.data))

      fs.appendFile(filePath, body, function() {
          respond.end();
      });
  });
}