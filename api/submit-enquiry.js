module.exports = async function handler(req, res) {

  // Only allow POST requests
  if (req.method !== "POST") {
    return res.status(405).send("Method Not Allowed");
  }

  try {

    let data = req.body || {};

    // Handle URL-encoded form data
    if (typeof data === "string") {
      const params = new URLSearchParams(data);
      data = Object.fromEntries(params.entries());
    }

    const {
      name,
      company,
      email,
      phone,
      quantity,
      city,
      date,
      notes
    } = data;


    // -----------------------------------------
    // SERVER-SIDE VALIDATION
    // -----------------------------------------

    if (
      !name ||
      !company ||
      !email ||
      !phone ||
      !quantity ||
      !city ||
      !date
    ) {
      return res.status(400).send(`
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <title>Incomplete Enquiry</title>
        </head>

        <body>
          <h1>Please complete all required fields.</h1>

          <p>
            <a href="/">Return to Inara Rituals</a>
          </p>
        </body>
        </html>
      `);
    }


    // -----------------------------------------
    // SEND DATA TO HUBSPOT
    // -----------------------------------------

  const portalId = process.env.HUBSPOT_PORTAL_ID;
const formId = process.env.HUBSPOT_FORM_ID;

const hubspotResponse = await fetch(
  `https://api.hsforms.com/submissions/v3/integration/submit/${portalId}/${formId}`,
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify({

          fields: [

            {
              name: "firstname",
              value: name
            },

            {
              name: "company",
              value: company
            },

            {
              name: "email",
              value: email
            },

            {
              name: "phone",
              value: phone
            },

            {
              name: "corporate_gift_quantity",
              value: quantity
            },

            {
              name: "delivery_city",
              value: city
            },

            {
              name: "required_delivery_date",
              value: date
            },

            {
              name: "additional_requirements",
              value: notes || ""
            }

          ],

          context: {
            pageName: "Inara Rituals Corporate Gifting",
            pageUri: "https://www.inararitualscorporate.com/"
          }

        })
      }
    );


    // -----------------------------------------
    // READ HUBSPOT RESPONSE
    // -----------------------------------------

    const result = await hubspotResponse.text();


    // -----------------------------------------
    // HUBSPOT ERROR
    // -----------------------------------------

    if (!hubspotResponse.ok) {

      console.error(
        "HubSpot submission failed:",
        result
      );

      return res.status(502).send(`
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <title>Submission Error</title>
        </head>

        <body>

          <h1>We couldn't submit your enquiry.</h1>

          <p>
            Please try again or contact Inara Rituals
            directly on WhatsApp.
          </p>

          <p>
            <a href="/">Return to Inara Rituals</a>
          </p>

        </body>
        </html>
      `);
    }


    // -----------------------------------------
    // SUCCESS
    // -----------------------------------------

    console.log(
      "HubSpot submission successful:",
      result
    );


    // Redirect visitor to booking page
    return res.redirect(
      303,
      "/book-a-call"
    );


  } catch (error) {

    console.error(
      "Unexpected submission error:",
      error
    );

    return res.status(500).send(`
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Something Went Wrong</title>
      </head>

      <body>

        <h1>Something went wrong.</h1>

        <p>
          Please try again or contact Inara Rituals directly.
        </p>

        <p>
          <a href="/">Return to Inara Rituals</a>
        </p>

      </body>
      </html>
    `);
  }
};