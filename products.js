<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Pardhu ERP – Products</title>
<meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>

<body>

<script>
/* ===== PAGE RBAC: PRODUCTS ===== */
const role = localStorage.getItem("role");
const modules = (localStorage.getItem("modules") || "").toLowerCase();

if (!role) {
  window.location.replace("index.html");
}

if (modules !== "all" && !modules.split(",").includes("products")) {
  window.location.replace("dashboard.html");
}
</script>

<h2>Products</h2>
<div id="productList">Loading...</div>

<script src="products.js"></script>
</body>
</html>
