// @ts-check
import { join } from "path";
import { readFileSync } from "fs";
import express from "express";
import serveStatic from "serve-static";

import shopify from "./shopify.js";
import GDPRWebhookHandlers from "./gdpr.js";

import applyQrCodeApiEndpoints from "./middleware/qr-code-api.js";
import applyQrCodePublicEndpoints from "./middleware/qr-code-public.js";

const PORT = parseInt(
  process.env.BACKEND_PORT || process.env.PORT || "3000",
  10
);

const STATIC_PATH =
  process.env.NODE_ENV === "production"
    ? `${process.cwd()}/frontend/dist`
    : `${process.cwd()}/frontend/`;

const app = express();

// Set up Shopify authentication and webhook handling
app.get(shopify.config.auth.path, shopify.auth.begin());
app.get(
  shopify.config.auth.callbackPath,
  shopify.auth.callback(),
  shopify.redirectToShopifyOrAppRoot()
);
app.post(
  shopify.config.webhooks.path,
  shopify.processWebhooks({ webhookHandlers: GDPRWebhookHandlers })
);

applyQrCodePublicEndpoints(app);

// All endpoints after this point will require an active session
app.use("/api/*", shopify.validateAuthenticatedSession());
//applyQrCodeApiEndpoints(app);
app.use(express.json());

app.get("/api/products", async (req, res) => {
  try {
    const session = res.locals.shopify.session
    const data = await shopify.api.rest.Product.all({session: session})
    res.status(200).send(data)

  } catch(err) {
    console.log(err)
  }
});



app.get("/api/products/:id", async (req, res) => {
  try {
    const response = await shopify.api.rest.Product.find({
      session: res.locals.shopify.session,
      id: req.params.id
    });

    res.status(200).send(response);

  } catch(err){
    res.status(500).send(err);
  }
})



app.put("/api/products/update/:id", async (req, res) => {
  try {
    const response = await shopify.api.rest.Product.update({
      session: res.locals.shopify.session,
      id: req.params.id,
      metafields: 
        {
          "key": "new",
          "value": "newvalue",
          "type": "single_line_text_field",
          "namespace": "global"
        }
     
    });

    res.status(200).send(response);

  } catch(err){
    res.status(500).send(err);
  }
})


app.use(serveStatic(STATIC_PATH, { index: false }));

app.use("/*", shopify.ensureInstalledOnShop(), async (_req, res, _next) => {
  return res
    .status(200)
    .set("Content-Type", "text/html")
    .send(readFileSync(join(STATIC_PATH, "index.html")));
});

app.listen(PORT);
