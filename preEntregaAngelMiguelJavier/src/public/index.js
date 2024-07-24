const socket = io();

socket.on("showProducts", (products) => {
  const productContainer = document.querySelector("#products");
  productContainer.innerHTML = "";
  products.forEach((product) => {
    const title = document.createElement("li");
    title.innerHTML = product.title
    const price = document.createElement("p");
    price.innerHTML = "Precio: "+product.price
    const description = document.createElement("p");
    description.innerHTML = "Descripcion: "+product.description
    const category = document.createElement("p");
    category.innerHTML = "Categoria: "+product.category
    const productId = document.createElement("p");
    productId.innerHTML = "Id: "+product.id
    const div = document.createElement("div")
    div.classList.add("producto");
    div.append(title,description,category,price,productId);
    productContainer.appendChild(div);
  });
});
socket.on("error", (messaje) => {
  Swal.fire(messaje);
});

const addProduct = () => {
  const productToAdd = {
    title: String(document.querySelector("#addTitle").value),
    description: String(document.querySelector("#addDescription").value),
    code: String(document.querySelector("#addCode").value),
    price: Number(document.querySelector("#addPrice").value),
    stock: Number(document.querySelector("#addStock").value),
    category: String(document.querySelector("#addCategory").value),
  };
  socket.emit("addProductFromView", productToAdd);
};

const deleteProduct = () => {
  const productId = Number(document.querySelector("#deleteProduct").value);
  socket.emit("deleteProductFromView", productId);
};