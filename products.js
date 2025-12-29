/* ===== GOOGLE SHEET CONFIG ===== */
const SHEET_ID = "1ZG49Svf_a7sjtxv87Zx_tnk8_ymVurhcCm0YzrgKByo";
const SHEET_NAME = "products";

/* ===== FETCH PRODUCTS ===== */
fetch(`https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&sheet=${SHEET_NAME}&t=${Date.now()}`)
  .then(res => res.text())
  .then(text => {
    const json = JSON.parse(
      text.substring(text.indexOf('{'), text.lastIndexOf('}') + 1)
    );

    let html = "";

    json.table.rows.forEach(r => {
      if(!r.c) return;

      // A id | B name | C price | D stock | E category | F active
      if((r.c[5]?.v || "").toLowerCase() !== "yes") return;

      html += `
        <div class="product">
          <b>${r.c[1]?.v}</b><br>
          Price: ₹${r.c[2]?.v}<br>
          Stock: ${r.c[3]?.v}<br>
          <span class="badge">${r.c[4]?.v}
          </span>
        </div>
      `;
    });

    document.getElementById("productList").innerHTML =
      html || "No active products";

  })
  .catch(() => {
    document.getElementById("productList").innerText =
      "Error loading products";
  });
