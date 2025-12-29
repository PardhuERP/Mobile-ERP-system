const SHEET_ID = "1ZG49Svf_a7sjtxv87Zx_tnk8_ymVurhcCm0YzrgKByo";
const SHEET_NAME = "orders";

fetch(`https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&sheet=${SHEET_NAME}&t=${Date.now()}`)
  .then(res => res.text())
  .then(text => {
    console.log("RAW:", text);

    const json = JSON.parse(
      text.substring(text.indexOf('{'), text.lastIndexOf('}') + 1)
    );

    console.log("PARSED:", json);

    let html = "";

    json.table.rows.forEach((r, i) => {
      html += `
        <div class="order">
          <b>Row ${i + 1}</b><br>
          ${JSON.stringify(r.c)}
        </div>
      `;
    });

    document.getElementById("orderList").innerHTML =
      html || "No rows";
  })
  .catch(err => {
    console.error("FETCH ERROR:", err);
    document.getElementById("orderList").innerText =
      "Error loading orders";
  });
