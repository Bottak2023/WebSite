import Stripe from 'stripe'
// const stripe = new Stripe(sk_test_51K4GxEEHzR9KDft7JvEtNpwEXsSlbWC5BsDaCJ5SCOWR91owjrjfhYJS0J9onrjGVrE7uXvaFoITNpz53cfx1MOK00kOAGB32S);


const stripe = new Stripe('sk_test_51K4GxEEHzR9KDft7JvEtNpwEXsSlbWC5BsDaCJ5SCOWR91owjrjfhYJS0J9onrjGVrE7uXvaFoITNpz53cfx1MOK00kOAGB32S');

export default async function handler(req, res) {
  console.log(req)
  console.log(req.body.amount)
  try {
    const session = await stripe.checkout.sessions.create({

      line_items: [
        {
          price_data: {
            product_data: {
              name: req.body.type,
            },
            currency: req.body.currency,
            unit_amount: req.body.amount * 100,
          },
          quantity: 1,
        },
        {
          price_data: {
            product_data: {
              name: "Comision",
            },
            currency: req.body.currency,
            unit_amount: req.body.comision * 100,
          },
          quantity: 1,
        },
      ],
      mode: "payment",

      success_url: "https://bottak.lat/Transferencias/Exitoso",
      cancel_url: "https://bottak.lat/",
    });
    console.log(session)
    console.log(session.url);
    return res.json({
      id: session.id,
      url: session.url
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

// export const createSession = async (req, res) => {
//   try {
//     const session = await stripe.checkout.sessions.create({
//       line_items: [
//         {
//           price_data: {
//             product_data: {
//               name: "Laptop",
//             },
//             currency: "usd",
//             unit_amount: 2000,
//           },
//           quantity: 1,
//         },
//         {
//           price_data: {
//             product_data: {
//               name: "TV",
//             },
//             currency: "usd",
//             unit_amount: 1000,
//           },
//           quantity: 2,
//         },
//       ],
//       mode: "payment",
//       success_url: "http://localhost:3000/Success",
//       cancel_url: "http://localhost:3000/Cancel",
//     });

//     console.log(session);
//     return res.json({ url: session.url });
//   } catch (error) {
//     return res.status(500).json({ message: error.message });
//   }
// };







