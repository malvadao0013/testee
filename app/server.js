const express = require('express')
const cors = require('cors')
const bodyparser = require('body-parser')
const dotenv = require('dotenv')



dotenv.config();

const app = express()

app.use(cors())
app.use(express.json());
app.use(express.urlencoded({extended:true}));

const Shopify = require('shopify-api-node');

const shopify = new Shopify({
  shopName: '011e49-5d.myshopify.com',
  accessToken: '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'
});

app.get('/create/webhook', async (req, res) => {
  const webhook = await shopify.webhook.create({
    topic: 'checkouts/create',
    address: `https://147.79.104.189:3000/webhooks/checkout`,
    format: 'json'
  });
  console.log(webhook)
})

// app.post('/we')

app.get('/', async function (req, res) {
  await shopify.webhook.list().then((webhooks) => {
    console.log('Lista de Webhooks: ', webhooks);
  }).catch((error) => {
    console.error('Erro ao listar os webhooks: ', error);
  });
})

// app.get('/install', (req, res) => {
//   const shop = req.query.shop;
//   const redirectUri = `https://a023e7-17.myshopify.com/auth/callback`;
//   const installUrl = `https://${shop}/admin/oauth/authorize?client_id=${process.env.APIKEYSHOPIFY}&scope=write_checkouts&redirect_uri=https://a023e7-17.myshopify.com/auth/callback`;
  
//   res.redirect(installUrl);
// });


app.post('/webhooks/checkout', async (req, res) => {
  const checkoutData = req.body;
  
  // Verifique se o checkout foi criado corretamente
  if (checkoutData.id) {
    const externalUrl = `https://147.79.104.189:3000/checkout?id=${checkoutData.id}`;

    // Redireciona o cliente para o site externo
    res.redirect(externalUrl);
  } else {
    res.status(400).send('Erro no Checkout');
  }
});


app.get('/checkout', async (req, res) => {
  try {
    const checkoutId = req.query.id
    // Faz a chamada para obter os detalhes do checkout
    const checkout = await shopify.checkout.get(checkoutId);
    
    res.json(checkout)
  } catch (error) {
    console.error('Erro ao obter detalhes do checkout:', error);
  }
})

app.get('/teste', (req, res) => {
  res.send('ping')
})


app.listen(3000)