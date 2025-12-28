const SHEET_ID = "1ZG49Svf_a7sjtxv87Zx_tnk8_ymVurhcCm0YzrgKByo";
const SHEET_NAME = "settings";

const company = (localStorage.getItem("company") || "").toLowerCase();

fetch(`https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&sheet=${SHEET_NAME}&t=${Date.now()}`)
  .then(res => res.text())
  .then(text => {
    const json = JSON.parse(
      text.substring(text.indexOf('{'), text.lastIndexOf('}') + 1)
    );

    let html = "";

    json.table.rows.forEach(r => {
      if(!r.c) return;

      const key = (r.c[0]?.v || "").toLowerCase();
      const value = (r.c[1]?.v || "").toLowerCase();
      const rowCompany = (r.c[2]?.v || "").toLowerCase();

      if(rowCompany !== company) return;

      // Save settings to localStorage (GLOBAL EFFECT)
      localStorage.setItem(key, value);

      // Apply theme instantly
      if(key === "theme_color"){
        document.documentElement.style.setProperty("--theme", value);
        document.querySelector(".header").style.background = value;
      }

      html += `
        <div class="setting">
          <div class="key">${key}</div>
          <div class="value">${value}</div>
        </div>
      `;
    });

    document.getElementById("settingsList").innerHTML =
      html || "No settings found";

  })
  .catch(() => {
    document.getElementById("settingsList").innerText =
      "Error loading settings";
  });
