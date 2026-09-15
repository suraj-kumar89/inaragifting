module.exports = async function handler(req, res) {

  // =========================================
  // ONLY ALLOW POST
  // =========================================

  if (req.method !== "POST") {
    return res.status(405).send("Method Not Allowed");
  }


  try {

    // =========================================
    // GET FORM DATA
    // =========================================

    let data = req.body || {};

    // Handle URL-encoded body if necessary
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


    // =========================================
    // SERVER-SIDE VALIDATION
    // =========================================

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
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Incomplete Enquiry | Inara Rituals</title>
        </head>

        <body>

          <h1>Please complete all required fields.</h1>

          <p>
            Please go back and complete the enquiry form.
          </p>

          <p>
            <a href="/">Return to Inara Rituals</a>
          </p>

        </body>
        </html>
      `);
    }


    // =========================================
    // HUBSPOT DETAILS
    // =========================================

    const portalId = "247389613";

    const formId =
      "73054849-9223-4171-bd91-dfa3fd69bafc";


    // =========================================
    // HUBSPOT API ENDPOINT
    // =========================================

    const endpoint =
      `https://api.hsforms.com/submissions/v3/integration/submit/${portalId}/${formId}`;


    console.log("HubSpot Portal ID:", portalId);

    console.log("HubSpot Form ID:", formId);

    console.log("HubSpot Endpoint:", endpoint);


    // =========================================
    // SEND DATA TO HUBSPOT
    // =========================================

    const hubspotResponse = await fetch(
      endpoint,
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify({

          fields: [

            {
              name: "firstname",
              value: String(name).trim()
            },

            {
              name: "company",
              value: String(company).trim()
            },

            {
              name: "email",
              value: String(email).trim()
            },

            {
              name: "phone",
              value: String(phone).trim()
            },

            {
              name: "corporate_gift_quantity",
              value: String(quantity)
            },

            {
              name: "delivery_city",
              value: String(city).trim()
            },

            {
              name: "required_delivery_date",
              value: String(date)
            },

            {
              name: "additional_requirements",
              value: notes
                ? String(notes).trim()
                : ""
            }

          ],

          context: {

            pageName:
              "Inara Rituals Corporate Gifting",

            pageUri:
              "https://www.inararitualscorporate.com/"

          }

        })
      }
    );


    // =========================================
    // READ HUBSPOT RESPONSE
    // =========================================

    const result =
      await hubspotResponse.text();


    console.log(
      "HubSpot Status:",
      hubspotResponse.status
    );

    console.log(
      "HubSpot Response:",
      result
    );


    // =========================================
    // HUBSPOT ERROR
    // =========================================

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
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0"
          >

          <title>Submission Error | Inara Rituals</title>
        </head>

        <body>

          <h1>
            We couldn't submit your enquiry.
          </h1>

          <p>
            Please try again or contact Inara Rituals
            directly on WhatsApp.
          </p>

          <p>
            <a href="/">
              Return to Inara Rituals
            </a>
          </p>

        </body>

        </html>
      `);
    }


    // =========================================
    // SUCCESS
    // =========================================

    console.log(
      "HubSpot submission successful."
    );


    // =========================================
    // REDIRECT TO thank_you PAGE
    // =========================================

    return res.redirect(
      303,
      "/thank_you"
    );


  } catch (error) {


    // =========================================
    // UNEXPECTED ERROR
    // =========================================

    console.error(
      "Unexpected submission error:",
      error
    );


    return res.status(500).send(`
      <!DOCTYPE html>
      <html>

      <head>
        <meta charset="UTF-8">

        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0"
        >

        <title>Something Went Wrong | Inara Rituals</title>
      </head>

      <body>

        <h1>
          Something went wrong.
        </h1>

        <p>
          Please try again or contact Inara Rituals
          directly on WhatsApp.
        </p>

        <p>
          <a href="/">
            Return to Inara Rituals
          </a>
        </p>

      </body>

      </html>
    `);

  }

};