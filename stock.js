/* ===== AUTH GUARD ===== */
const role = localStorage.getItem("role");
const modules = (localStorage.getItem("modules") || "").toLowerCase();

if(!role){
  window.location.href = "index.html";
}

if(modules !== "all" && !modules.split(",").includes("stock")){
  alert("Access denied");
  window.location.href = "dashboard.html";
}

/* ===== GOOGLE SHEET CONFIG ===== */
const SHEET_ID = "1ZG49Svf_a7sjtxv87Zx_tnk8_ymVurhcCm0YzrgKByo";
const SHEET_NAME = "stock";

const API_URL =
`https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&sheet=${SHEET_NAME}&t=${Date.now()}`;

/* ===== LOAD STOCK ===== */
fetch(API_URL)
  .then(res => res.text())
  .then(text => {
    const json = JSON.parse(
      text.substring(text.indexOf('{'), text.lastIndexOf('}') + 1)
    );

    let html = "";

    json.table.rows.forEach((r, index) => {
      if(index === 0 || !r.c) return; // skip header

      const productId = r.c[0]?.v;
      const qty = r.c[1]?.v;
      const updated = r.c[2]?.v;

      html += `
        <div style="background:#fff;padding:12px;margin-bottom:10px;border-radius:10px">
          <b>Product ID:</b> ${productId}<br>
          <b>Available Qty:</b> ${qty}<br>
          <b>Last Updated:</b> ${updated}
        </div>
      `;
    });

    document.getElementById("stockList").innerHTML =
      html || "No stock data";

  })
  .catch(err => {
    console.error(err);
    document.getElementById("stockList").innerText =
      "Error loading stock";
  });
