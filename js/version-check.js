async function checkVersion() {

  try {

    const response = await fetch("version.json?t=" + Date.now());

    const data = await response.json();

    const currentVersion = localStorage.getItem("app_version");

    if (!currentVersion) {
      localStorage.setItem("app_version", data.version);
    }

    if (currentVersion && currentVersion !== data.version) {

      alert("יש גרסה חדשה לאפליקציה. העמוד יתעדכן.");

      localStorage.setItem("app_version", data.version);

      location.reload(true);
    }

  } catch (e) {
    console.log("Version check failed");
  }

}

setInterval(checkVersion, 60000);
