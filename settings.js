/* =========================
   SETTINGS – SMART ERP
========================= */

const SHEET_ID = "1ZG49Svf_a7sjtxv87Zx_tnk8_ymVurhcCm0YzrgKByo";
const SHEET_NAME = "settings";

const company = localStorage.getItem("company") || "master";
const role = localStorage.getItem("role");

// later…
if (role !== "super" && rowCompany !== company) return;

const API_URL =
  `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&sheet=${SHEET_NAME}&t=${Date.now()}`;

fetch(API_URL)
  .then(res => res.text())
  .then(text => {
    const json = JSON.parse(
      text.substring(text.indexOf('{'), text.lastIndexOf('}') + 1)
    );

    let html = "";

    json.table.rows.forEach(r => {
      if (!r.c) return;

      const key = r.c[0]?.v || "";
      const value = r.c[1]?.v || "";
      const rowCompany = r.c[2]?.v || "";
      const updatedBy = r.c[3]?.v || "";

      // Super sees all, admin sees own
      if (role !== "super" && rowCompany !== company) return;

      html += `
        <div class="setting">
          <span class="key">${key}</span><br>
          Value: ${value}<br>
          <small>Company: ${rowCompany} | Updated by: ${updatedBy}</small>
        </div>
      `;
    });

    document.getElementById("settingsList").innerHTML =
      html || "No settings found";

  })
  .catch(err => {
    console.error(err);
    document.getElementById("settingsList").innerText =
      "Error loading settings";
  });
