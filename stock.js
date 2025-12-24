const SHEET_ID = "1ZG49Svf_a7sjtxv87Zx_tnk8_ymVurhcCm0YzrgKByo";
const SHEET_NAME = "stock";

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

      const name = r.c[1]?.v || "";
      const price = r.c[2]?.v || 0;
      const stock = r.c[3]?.v || 0;
      const category = r.c[4]?.v || "";

      html += `
        <div class="stock">
          <b>${name}</b><br>
          Price: ₹${price}<br>
          Stock: ${stock}<br>
          Category: ${category}
        </div>
      `;
    });

    document.getElementById("stockList").innerHTML =
      html || "No stock data";

  })
  .catch(() => {
    document.getElementById("stockList").innerText =
      "Error loading stock";
  });
