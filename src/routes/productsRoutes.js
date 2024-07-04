import { Router } from "express";
import fs from "fs";
import __dirname from "../utils.js";
const URL = __dirname + "/data/productos.json";

const router = Router();

router.get("/", async (req, res) => {
  const productsInDataBase = JSON.parse(
    await fs.promises.readFile(URL, "utf-8")
  );
  const limit = req.query.limit;
  //Envia un query para limitar los resultamos mostrados
  const productsToShow = productsInDataBase.slice(0, limit);
  //Verifica que existan productos cargados en la base de datos
  if (productsToShow.length) {
    return res.send(productsToShow);
  } else
    return res
      .status(200)
      .send(
        "Se realizo la busqueda y no se encontró ningun producto en la base de datos"
      );
});
router.get("/:id", async (req, res) => {
  const productsInDataBase = JSON.parse(
    await fs.promises.readFile(URL, "utf-8")
  );
  const productFinded = productsInDataBase.find(
    (item) => item.id == req.params.id
  );
  //Verifica que exista el producto con ese id
  if (productFinded) {
    return res.send(productFinded);
  } else {
    return res
      .status(404)
      .send(
        "El producto con el id:" +
          req.params.id +
          " no se encuentra en la base de datos"
      );
  }
});
router.post("/", async (req, res) => {
  const productsInDataBase = JSON.parse(
    await fs.promises.readFile(URL, "utf-8")
  );
  const title = req.body.title;
  const description = req.body.description;
  const code = req.body.code;
  const price = req.body.price;
  const stock = req.body.stock;
  const category = req.body.category;
  //Valida que el req.body venga completo con todos los campos obligatorios y luego valida que sean del tipo de dato correspondiente
  if (title && description && code && price && stock && category) {
    if (typeof title !== "string") {
      return res.send("El campo title debe ser un texto (string)");
    }
    if (typeof description !== "string") {
      return res.send("El campo description debe ser un texto (string)");
    }
    if (typeof code !== "string") {
      return res.send("El campo code debe ser un texto (string)");
    }
    if (typeof price !== "number") {
      return res.send("El campo price debe ser un número (Number)");
    }
    if (typeof stock !== "number") {
      return res.send("El campo stock debe ser un número (Number)");
    }
    if (typeof category !== "string") {
      return res.send("El campo category debe ser un texto (string)");
    }
    if (req.body.thumbnails) {
      if (!Array.isArray(req.body.thumbnails)) {
        return res.send(
          "El campo thumbnails debe ser un arreglo de strings (array)"
        );
      }
    }

    //Función que genera cada nuevo id
    const newId = () => {
      if (productsInDataBase.length) {
        const lastProduct = productsInDataBase[productsInDataBase.length - 1];
        const lastId = lastProduct.id;
        return lastId + 1;
      } else {
        return 1;
      }
    };
    //Guardo el nuevo producto con su id en una nueva const y luego lo agrego al dataBase
    const newProductWithId = { ...req.body, status: true, id: newId() };
    productsInDataBase.push(newProductWithId);
    //Paso el nuevo dataBase a formato JSON para poder hacer la persistencia de los datos
    const updatedDatabase = JSON.stringify(productsInDataBase, null, " ");
    //Realizo la persistencia de la base de datos actualizada

    //fs.writeFileSync(URL, updatedDatabase);//Metodo sincrónico
    await fs.promises.writeFile(URL, updatedDatabase);

    return res.send("Se agregó correctamente el producto.");
  } else {
    return res.send(
      "Es requisito que complete todos los campos (el campo thumbnails si puede quedar vacio)"
    );
  }
});
router.put("/:id", async (req, res) => {
  const productsInDataBase = JSON.parse(
    await fs.promises.readFile(URL, "utf-8")
  );
  //Verifica que exista el producto con ese id en la base de datos
  const result = productsInDataBase.find((item) => item.id == req.params.id);

  if (result) {
    //Agregar validaciones del req.body
    const title = req.body.title;
    const description = req.body.description;
    const code = req.body.code;
    const price = req.body.price;
    const stock = req.body.stock;
    const category = req.body.category;
    //Valida que el req.body venga completo con todos los campos obligatorios y luego valida que sean del tipo de dato correspondiente
    if (title && description && code && price && stock && category) {
      if (typeof title !== "string") {
        return res.send("El campo title debe ser un texto (string)");
      }
      if (typeof description !== "string") {
        return res.send("El campo description debe ser un texto (string)");
      }
      if (typeof code !== "string") {
        return res.send("El campo code debe ser un texto (string)");
      }
      if (typeof price !== "number") {
        return res.send("El campo price debe ser un número (Number)");
      }
      if (typeof stock !== "number") {
        return res.send("El campo stock debe ser un número (Number)");
      }
      if (typeof category !== "string") {
        return res.send("El campo category debe ser un texto (string)");
      }
      if (req.body.thumbnails) {
        if (!Array.isArray(req.body.thumbnails)) {
          return res.send(
            "El campo thumbnails debe ser un arreglo de strings (array)"
          );
        }
      }
      //Guardo el las modificaciones del producto
      result.title = req.body.title;
      result.description = req.body.description;
      result.code = req.body.code;
      result.price = req.body.price;
      if (req.body.status === false) {
        result.status = false;
      }
      result.stock = req.body.stock;
      result.category = req.body.category;
      if (req.body.thumbnails) {
        result.thumbnails = req.body.thumbnails;
      }

      //Paso el nuevo dataBase a formato JSON para poder hacer la persistencia de los datos
      const updatedDatabase = JSON.stringify(productsInDataBase, null, " ");
      //Realizo la persistencia de la base de datos actualizada
      await fs.promises.writeFile(URL, updatedDatabase);
      //fs.writeFileSync(URL, updatedDatabase);//Metodo sincrónico

      return res.send(
        "Se mofifico el producto con id: " + req.params.id + " correctamente"
      );
    }
  } else {
    return res
      .status(404)
      .send(
        "El producto con el id:" +
          req.params.id +
          " no se encuentra en la base de datos"
      );
  }
});
//Borrado permanente del producto
router.delete("/:id", async (req, res) => {
  const productsInDataBase = JSON.parse(
    await fs.promises.readFile(URL, "utf-8")
  );
  //Verifica que exista el producto con ese id

  const indexProductoToDelete = productsInDataBase.findIndex(
    (item) => item.id == req.params.id
  );

  if (indexProductoToDelete > -1) {
    productsInDataBase.splice(indexProductoToDelete, 1);

    const updatedDatabase = JSON.stringify(productsInDataBase, null, " ");

    //fs.writeFileSync(URL, updatedDatabase);//Metodo sincrónico
    await fs.promises.writeFile(URL, updatedDatabase);

    return res.send("Se borro el producto con éxito");
  } else {
    return res
      .status(404)
      .send(
        "El producto con el id:" +
          req.params.id +
          " no se encuentra en la base de datos"
      );
  }
});

export default router;