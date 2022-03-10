const installer = require("electron-installer-debian");
const common = require("./common");

async function main() {
  const myArgs = process.argv.slice(2);
  const pkg = common.getPackage();
  const configs = pkg.electron.buildConfigs;

  let appDirName = configs["linux-deb"][myArgs[0]]["name"];
  let executableName = configs["linux-deb"][myArgs[0]]["executableName"];

  if (common.hasChannelName()) {
    appDirName += ` ${common.getTitlecaseChannelName()}`;
    executableName += `-${common.getChannelName()}`;
  }

  /* Default to amd64/x64 */
  if (ARCH_OUTNAME === undefined || ARCH_ELECTRON === undefined) {
    ARCH_OUTNAME = "x64";
    ARCH_ELECTRON = "amd64"
  }

  console.log(`Creating package for ${appDirName} on arch ${ARCH_OUTNAME} (this may take a while)`);

  const options = {
    desktopTemplate: "app/assets/desktop.ejs",
    src: `app/build/dist-electron/packaged/${appDirName}-linux-${ARCH_ELECTRON}/`,
    dest: "app/build/dist-electron/installers",
    name: appDirName,
    bin: executableName,
    productName: appDirName,
    startupWmClass: executableName,
    genericName: "Threema Desktop Client",
    maintainer: "Threema GmbH <help@threema.ch>",
    icon: configs["linux-deb"][myArgs[0]]["icons"],
    arch: "${ARCH_OUTNAME}",
    homepage: "https://threema.ch",
    categories: ["Network", "InstantMessaging", "Chat"],
    description: "Desktop client for Threema (requires the mobile app)",
    productDescription:
      "Threema for desktop is a wrapped version of Threema Web. A multi-device solution will become available at a later date.",
    section: "comm",
  };

  try {
    // installer expects package.json to be present in the project root
    await installer(options);
    console.log(`Successfully created package at ${options.dest}`);
  } catch (err) {
    console.error(err, err.stack);
    process.exit(1);
  }

}

main();
