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
app.use(express.urlencoded({ extended: true }));



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


app.get("/api/products/metafields/:id", async (req, res) => {
  try {
    const response = await shopify.api.rest.Metafield.all({
      session: res.locals.shopify.session,
    
      product_id:req.params.id,
     
      
    });

    res.status(200).send(response);

  } catch(err){
    res.status(500).send(err);
  }
})




app.get("/api/products/metafield/:id", async( req, res) => {
  let status = 200
  let error = null

  try {
  
    const session = res.locals.shopify.session
    const client = new shopify.api.clients.Graphql({session});
    await client.query({
      data: `mutation  {
        bulkOperationRunQuery(
         query: """
          {
            products {
              edges {
                node {
                  id
                  title
                }
              }
            }
          }
          """
        ) {
          bulkOperation {
            id
            status
          }
          userErrors {
            field
            message
          }
        }
      }`
    })
    
  } catch(err) {
    console.log(`failed to process request ${err}`)
    status = 500
    error =  err.message
  }
  const reqs = req.body.uploadval;
  res.status(status).send({ sucess: status === 200, error, other: reqs });
  
  
});





app.put("/api/products/update/:id", async( req, res) => {
  let status = 200
  let error = null

  try {
  
    const session = res.locals.shopify.session
    const client = new shopify.api.clients.Graphql({session});
    await client.query({
      data: `mutation {
         productUpdate(input: 
          {
            id: "gid://shopify/Product/${req.params.id}",
            metafields: [
              {
                namespace: "advanceapp",
                key: "isenableupload",
                value: "${req.body.designval}",
                type: "single_line_text_field"
              },
              {
                namespace: "advanceapp",
                key: "iscustomnumber",
                value: "${req.body.numberval}",
                type: "single_line_text_field"
              },
              {
                namespace: "advanceapp",
                key: "iscustomname",
                value: "${req.body.nameval}",
                type: "single_line_text_field"
              }
            ],
         
          }) {
          product {
            id
            metafields(first: 3) {
              edges {
                node {
                  id
                  namespace
                  key
                  value
                }
              }
            }
          }
          userErrors {
            message
            field
          }
        }
      }`
    })
    
  } catch(err) {
    console.log(`failed to process request ${err}`)
    status = 500
    error =  err.message
  }
  const reqs = req.body.customnumber;
  res.status(status).send({ sucess: status === 200, error, other: reqs });
  });




  app.put("/api/products/metafields/update/:id", async( req, res) => {
    let status = 200
    let error = null
  
    try {
    
      const session = res.locals.shopify.session
      const client = new shopify.api.clients.Graphql({session});
      await client.query({
        data: `mutation {
          productUpdate(
          input : {
            id: "gid://shopify/Product/${req.params.id}",
            metafields: [
              {
                id: "gid://shopify/Metafield/${req.body.customsesignid}",
                value: "${req.body.designval}"
              },
              {
                id: "gid://shopify/Metafield/${req.body.customnumberid}",
                value: "${req.body.numberval}"
              },
              {
                id: "gid://shopify/Metafield/${req.body.customnameid}",
                value: "${req.body.nameval}"
              }
            ]
          }) {
            product {
              metafields(first: 10) {
                edges {
                  node {
                    namespace
                    key
                    value
                  }
                }
              }
            }
          }
        }
        `
      })
      
    } catch(err) {
      console.log(`failed to process request ${err}`)
      status = 500
      error =  err.message
    }
    const reqs = req.body.customnumber;
    res.status(status).send({ sucess: status === 200, error, other: reqs, mid: req.body.customDesignid });
    
    
  });
  


app.use(serveStatic(STATIC_PATH, { index: false }));

app.use("/*", shopify.ensureInstalledOnShop(), async (_req, res, _next) => {
  return res
    .status(200)
    .set("Content-Type", "text/html")
    .send(readFileSync(join(STATIC_PATH, "index.html")));
});

app.listen(PORT);
