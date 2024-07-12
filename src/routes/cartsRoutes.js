import { Router } from "express";
import fs from "fs";
import __dirname from "../utils.js";
const router = Router();
const URL = __dirname + "/data/carrito.json";

router.get("/", async (req, res) => {
  const cartsInDatabase = JSON.parse(await fs.promises.readFile(URL, "utf-8"));
  const limit = req.query.limit;
  const limitData = cartsInDatabase.slice(0, limit);
  if (limitData.length) {
    return res.send(limitData);
  } else
    return res
      .status(200)
      .send(
        "Se realizo la busqueda y no se encontró ningun carrito en la base de datos"
      );
});
router.post("/", async (req, res) => {
  const cartsInDatabase = JSON.parse(await fs.promises.readFile(URL, "utf-8"));
  const newId = () => {
    if (cartsInDatabase.length) {
      const lastCartInDatabase = cartsInDatabase[cartsInDatabase.length - 1];
      const lastId = lastCartInDatabase.id;
      return lastId + 1;
    } else {
      return 1;
    }
  };
  const newCartWithId = { products: [], id: newId() };
  cartsInDatabase.push(newCartWithId);
  const updatedDatabase = JSON.stringify(cartsInDatabase, null, " ");
  await fs.promises.writeFile(URL, updatedDatabase);
  //fs.writeFileSync(URL, updatedDatabase);

  return res.send("Se agregó correctamente el nuevo carrito.");
});
router.get("/:id", async (req, res) => {
  const cartsInDatabase = JSON.parse(await fs.promises.readFile(URL, "utf-8"));
  const cartFinded = cartsInDatabase.find((item) => item.id == req.params.id);
  if (cartFinded) {
    if (cartFinded.products.length) {
      return res.send(cartFinded.products);
    }
    return res.send(
      "Este carrito aun no tiene productos cargados"
    );
  } else {
    return res
      .status(404)
      .send(
        "El carrito con el id:" +
          req.params.id +
          " no existe"
      );
  }
});
router.post("/:idcart/:idproduct", async (req, res) => {
  const cartsInDatabase = JSON.parse(await fs.promises.readFile(URL, "utf-8"));
  const cartFinded = cartsInDatabase.find(
    (item) => item.id == req.params.idcart
  );

  if (cartFinded) {
    const productExistInCart = cartFinded.products.find(
      (item) => item.product == req.params.idproduct
    );
    if (productExistInCart) {
      productExistInCart.quantity++;
      const updatedDatabase = JSON.stringify(cartsInDatabase, null, " ");
      await fs.promises.writeFile(URL, updatedDatabase);
      //s.writeFileSync(URL, updatedDatabase);Metodo sincrónico
      return res.send(
        "Se agregó una unidad mas del producto con id:" +
          req.params.idproduct +
          " al carrito con id:" +
          req.params.idcart
      );
    } else {
      const productInCart = {
        product: parseInt(req.params.idproduct),
        quantity: 1,
      };
      cartFinded.products.push(productInCart);
      const updatedDatabase = JSON.stringify(cartsInDatabase, null, " ");
      await fs.promises.writeFile(URL, updatedDatabase);
      //fs.writeFileSync(URL, updatedDatabase);Metodo sincrónico
      return res.send(
        "Se agregó el producto con id:" +
          req.params.idproduct +
          " al carrito con id:" +
          req.params.idcart
      );
    }
  } else {
    return res
      .status(404)
      .send("Ese carrito no se encuentra");
  }
});

export default router;