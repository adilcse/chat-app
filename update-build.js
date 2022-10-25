const fs = require("fs");
const filePath = "./package.json";
const incrementVersion = (v) => {
    if (!v) {
        return "0.1.0";
    }
const lastVersion = v.split(".");
let incrementVersion = parseInt(lastVersion.pop()) + 1;
return lastVersion.join(".") + "." + incrementVersion
}

const packageJson = JSON.parse(fs.readFileSync(filePath).toString());
packageJson.buildDate = new Date().getTime();
packageJson.version = incrementVersion(packageJson.version);
fs.writeFileSync(filePath, JSON.stringify(packageJson, null, 2));

const jsonData = {
  buildDate: packageJson.buildDate,
  version: packageJson.version
};

const jsonContent = JSON.stringify(jsonData);

fs.writeFile("./public/meta.json", jsonContent, "utf8", function (error) {
  if (error) {
    console.log("An error occured while saving build date and time to meta.json");
    return console.log(error);
  }

  console.log("Latest build date and time updated in meta.json file, version: " + jsonData.version);
});
