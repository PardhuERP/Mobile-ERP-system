const role = localStorage.getItem("role");
if(!role){
  window.location.href="index.html";
}

const SHEET_ID = "1ZG49Svf_a7sjtxv87Zx_tnk8_ymVurhcCm0YzrgKByo";
const SHEET_NAME = "Products";

const API_URL =
  `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&sheet=${SHEET_NAME}`;

fetch(API_URL)
  .then(res => res.text())
  .then(text => {
    const json = JSON.parse(
      text.substring(text.indexOf('{'), text.lastIndexOf('}') + 1)
    );

    const rows = json.table.rows;
    let html = "";

    rows.forEach((r, i) => {
      if(!r.c || r.c[5]?.v !== "YES") return;

      const name = r.c[1]?.v || "";
      const price = r.c[2]?.v || 0;
      const stock = r.c[3]?.v || 0;

      html += `
        <div class="product">
          <b>${name}</b><br>
          Price: ₹${price}<br>
          Stock: ${stock}
          ${
            role === "admin"
            ? `<input type="number" id="s${i}" value="${stock}">
               <button onclick="updateStock(${i}, '${name}')">Update Stock</button>`
            : ""
          }
        </div>
      `;
    });

    document.getElementById("productList").innerHTML =
      html || "No products";

  })
  .catch(()=>{
    document.getElementById("productList").innerText="Error loading data";
  });

function updateStock(rowIndex, name){
  alert(
    "Stock update request for: " + name +
    "\n\nGoogle Sheet update automation will be added next step."
  );
}
