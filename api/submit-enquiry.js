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
            <a href="/">
              Return to Inara Rituals
            </a>
          </p>

        </body>
        </html>
      `);
    }


    // =========================================
    // CLEAN FORM VALUES
    // =========================================

    const cleanName = String(name).trim();
    const cleanCompany = String(company).trim();
    const cleanEmail = String(email).trim();
    const cleanPhone = String(phone).trim();
    const cleanQuantity = String(quantity).trim();
    const cleanCity = String(city).trim();
    const cleanDate = String(date).trim();
    const cleanNotes = notes
      ? String(notes).trim()
      : "";


    // =========================================
    // HUBSPOT DETAILS
    // =========================================

    const portalId = "247389613";

    const formId =
      "73054849-9223-4171-bd91-dfa3fd69bafc";


    const hubspotEndpoint =
      `https://api.hsforms.com/submissions/v3/integration/submit/${portalId}/${formId}`;


    // =========================================
    // STEP 1
    // SEND ENQUIRY TO HUBSPOT
    // =========================================

    console.log("=================================");
    console.log("STEP 1: Sending enquiry to HubSpot");
    console.log("=================================");


    const hubspotResponse = await fetch(
      hubspotEndpoint,
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify({

          fields: [

            {
              name: "firstname",
              value: cleanName
            },

            {
              name: "company",
              value: cleanCompany
            },

            {
              name: "email",
              value: cleanEmail
            },

            {
              name: "phone",
              value: cleanPhone
            },

            {
              name: "corporate_gift_quantity",
              value: cleanQuantity
            },

            {
              name: "delivery_city",
              value: cleanCity
            },

            {
              name: "required_delivery_date",
              value: cleanDate
            },

            {
              name: "additional_requirements",
              value: cleanNotes
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


    const hubspotResult =
      await hubspotResponse.text();


    console.log(
      "HubSpot Status:",
      hubspotResponse.status
    );

    console.log(
      "HubSpot Response:",
      hubspotResult
    );


    // =========================================
    // STOP IF HUBSPOT FAILED
    // =========================================

    if (!hubspotResponse.ok) {

      console.error(
        "❌ HUBSPOT FAILED"
      );

      return res.status(502).send(`
        <!DOCTYPE html>
        <html>

        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
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


    console.log(
      "✅ HubSpot submission successful."
    );


    // =========================================
    // STEP 2
    // SEND CUSTOM EMAIL THROUGH RESEND
    // =========================================

    console.log("=================================");
    console.log("STEP 2: Sending custom email through Resend");
    console.log("=================================");


    const resendApiKey =
      process.env.RESEND_API_KEY;


    const resendToEmail =
      process.env.RESEND_TO_EMAIL;


    const resendFromEmail =
      process.env.RESEND_FROM_EMAIL;


    console.log(
      "Resend API key exists:",
      Boolean(resendApiKey)
    );

    console.log(
      "Resend From:",
      resendFromEmail
    );

    console.log(
      "Resend To:",
      resendToEmail
    );


    // =========================================
    // CHECK RESEND ENVIRONMENT VARIABLES
    // =========================================

    if (
      !resendApiKey ||
      !resendToEmail ||
      !resendFromEmail
    ) {

      console.error(
        "❌ RESEND ENVIRONMENT VARIABLES ARE MISSING"
      );

      // HubSpot already succeeded.
      // Do not submit the enquiry again.

      return res.redirect(
        303,
        "/thank_you"
      );
    }


    // =========================================
    // EMAIL HTML
    // =========================================

    const emailHtml = `

      <!DOCTYPE html>

      <html>

      <head>

        <meta charset="UTF-8">

        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0"
        >

        <title>
          New Lead — Inara Rituals
        </title>

      </head>


      <body
        style="
          margin:0;
          padding:0;
          background:#F7F5F1;
          font-family:Arial,Helvetica,sans-serif;
          color:#22302E;
        "
      >

        <div
          style="
            width:100%;
            padding:40px 15px;
            box-sizing:border-box;
          "
        >

          <div
            style="
              max-width:680px;
              margin:0 auto;
              background:#FFFFFF;
              border:1px solid #E1DBD1;
            "
          >

            <!-- HEADER -->

            <div
              style="
                padding:32px;
                background:#144752;
              "
            >

              <div
                style="
                  color:#CBA871;
                  font-size:12px;
                  font-weight:bold;
                  letter-spacing:2px;
                  margin-bottom:12px;
                "
              >
                INARA RITUALS
              </div>


              <h1
                style="
                  margin:0;
                  color:#FFFFFF;
                  font-family:Georgia,serif;
                  font-size:28px;
                  font-weight:normal;
                  line-height:1.3;
                "
              >
                New Corporate Gifting Lead
              </h1>


              <p
                style="
                  margin:12px 0 0;
                  color:#D8E4E5;
                  font-size:14px;
                  line-height:1.6;
                "
              >
                A new enquiry has been submitted
                through your website.
              </p>

            </div>


            <!-- NEW LEAD -->

            <div
              style="
                margin:28px 30px 0;
                padding:16px 18px;
                background:#F7F5F1;
                border-left:4px solid #A8834E;
              "
            >

              <div
                style="
                  color:#5F6A69;
                  font-size:11px;
                  letter-spacing:1.5px;
                  text-transform:uppercase;
                  margin-bottom:6px;
                "
              >
                NEW LEAD
              </div>

              <div
                style="
                  color:#144752;
                  font-size:16px;
                  font-weight:bold;
                "
              >
                Corporate Diwali Gifting Enquiry
              </div>

            </div>


            <!-- CONTENT -->

            <div
              style="
                padding:30px;
              "
            >

              <!-- CONTACT DETAILS -->

              <h2
                style="
                  margin:0 0 18px;
                  color:#144752;
                  font-family:Georgia,serif;
                  font-size:21px;
                  font-weight:normal;
                "
              >
                Contact Details
              </h2>


              <table
                width="100%"
                cellpadding="0"
                cellspacing="0"
                style="
                  border-collapse:collapse;
                "
              >

                <tr>

                  <td
                    style="
                      padding:11px 0;
                      border-bottom:1px solid #E1DBD1;
                      color:#6B7472;
                      width:38%;
                      font-size:14px;
                    "
                  >
                    Name
                  </td>

                  <td
                    style="
                      padding:11px 0;
                      border-bottom:1px solid #E1DBD1;
                      color:#22302E;
                      font-size:14px;
                      font-weight:bold;
                    "
                  >
                    ${cleanName}
                  </td>

                </tr>


                <tr>

                  <td
                    style="
                      padding:11px 0;
                      border-bottom:1px solid #E1DBD1;
                      color:#6B7472;
                      font-size:14px;
                    "
                  >
                    Company
                  </td>

                  <td
                    style="
                      padding:11px 0;
                      border-bottom:1px solid #E1DBD1;
                      color:#22302E;
                      font-size:14px;
                      font-weight:bold;
                    "
                  >
                    ${cleanCompany}
                  </td>

                </tr>


                <tr>

                  <td
                    style="
                      padding:11px 0;
                      border-bottom:1px solid #E1DBD1;
                      color:#6B7472;
                      font-size:14px;
                    "
                  >
                    Work Email
                  </td>

                  <td
                    style="
                      padding:11px 0;
                      border-bottom:1px solid #E1DBD1;
                      font-size:14px;
                    "
                  >

                    <a
                      href="mailto:${cleanEmail}"
                      style="
                        color:#1E5F6B;
                        text-decoration:none;
                        font-weight:bold;
                      "
                    >
                      ${cleanEmail}
                    </a>

                  </td>

                </tr>


                <tr>

                  <td
                    style="
                      padding:11px 0;
                      color:#6B7472;
                      font-size:14px;
                    "
                  >
                    Phone
                  </td>

                  <td
                    style="
                      padding:11px 0;
                      color:#22302E;
                      font-size:14px;
                      font-weight:bold;
                    "
                  >
                    ${cleanPhone}
                  </td>

                </tr>

              </table>


              <!-- GIFTING REQUIREMENTS -->

              <h2
                style="
                  margin:38px 0 18px;
                  color:#144752;
                  font-family:Georgia,serif;
                  font-size:21px;
                  font-weight:normal;
                "
              >
                Gifting Requirements
              </h2>


              <table
                width="100%"
                cellpadding="0"
                cellspacing="0"
                style="
                  border-collapse:collapse;
                "
              >

                <tr>

                  <td
                    style="
                      padding:11px 0;
                      border-bottom:1px solid #E1DBD1;
                      color:#6B7472;
                      width:38%;
                      font-size:14px;
                    "
                  >
                    Quantity
                  </td>

                  <td
                    style="
                      padding:11px 0;
                      border-bottom:1px solid #E1DBD1;
                      color:#22302E;
                      font-size:14px;
                      font-weight:bold;
                    "
                  >
                    ${cleanQuantity}
                  </td>

                </tr>


                <tr>

                  <td
                    style="
                      padding:11px 0;
                      border-bottom:1px solid #E1DBD1;
                      color:#6B7472;
                      font-size:14px;
                    "
                  >
                    Delivery City
                  </td>

                  <td
                    style="
                      padding:11px 0;
                      border-bottom:1px solid #E1DBD1;
                      color:#22302E;
                      font-size:14px;
                      font-weight:bold;
                    "
                  >
                    ${cleanCity}
                  </td>

                </tr>


                <tr>

                  <td
                    style="
                      padding:11px 0;
                      color:#6B7472;
                      font-size:14px;
                    "
                  >
                    Required Delivery Date
                  </td>

                  <td
                    style="
                      padding:11px 0;
                      color:#22302E;
                      font-size:14px;
                      font-weight:bold;
                    "
                  >
                    ${cleanDate}
                  </td>

                </tr>

              </table>


              <!-- ADDITIONAL REQUIREMENTS -->

              <h2
                style="
                  margin:38px 0 18px;
                  color:#144752;
                  font-family:Georgia,serif;
                  font-size:21px;
                  font-weight:normal;
                "
              >
                Additional Requirements
              </h2>


              <div
                style="
                  padding:18px;
                  background:#F7F5F1;
                  border-left:3px solid #A8834E;
                  color:#22302E;
                  font-size:14px;
                  line-height:1.7;
                "
              >

                ${
                  cleanNotes ||
                  "No additional requirements provided."
                }

              </div>


              <!-- REPLY BUTTON -->

              <div
                style="
                  margin-top:32px;
                "
              >

                <a
                  href="mailto:${cleanEmail}"
                  style="
                    display:inline-block;
                    padding:13px 22px;
                    background:#D4144E;
                    color:#FFFFFF;
                    text-decoration:none;
                    font-size:14px;
                    font-weight:bold;
                  "
                >
                  Reply to Lead
                </a>

              </div>


              <!-- FOOTER -->

              <div
                style="
                  margin-top:38px;
                  padding-top:20px;
                  border-top:1px solid #E1DBD1;
                "
              >

                <p
                  style="
                    margin:0;
                    color:#6B7472;
                    font-size:12px;
                    line-height:1.6;
                  "
                >
                  This enquiry was submitted through
                  the Inara Rituals Corporate Gifting website.
                </p>

                <p
                  style="
                    margin:8px 0 0;
                    color:#6B7472;
                    font-size:12px;
                  "
                >
                  Inara Rituals · Corporate Diwali Gifting
                </p>

              </div>

            </div>

          </div>

        </div>

      </body>

      </html>

    `;


    // =========================================
    // SEND TO RESEND
    // =========================================

    const resendResponse = await fetch(
      "https://api.resend.com/emails",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
          "Authorization":
            `Bearer ${resendApiKey}`
        },

        body: JSON.stringify({

          from:
            resendFromEmail,

          to: [
            resendToEmail
          ],

          reply_to:
            cleanEmail,

          subject:
            "🔔 New Lead — Inara Rituals Corporate Gifting",

          html:
            emailHtml

        })
      }
    );


    const resendResult =
      await resendResponse.text();


    console.log(
      "Resend Status:",
      resendResponse.status
    );

    console.log(
      "Resend Response:",
      resendResult
    );


    // =========================================
    // RESEND RESULT
    // =========================================

    if (!resendResponse.ok) {

      console.error(
        "❌ RESEND FAILED:",
        resendResult
      );

      // IMPORTANT:
      // HubSpot already received the enquiry.
      // We do NOT submit it to HubSpot again.
      //
      // Customer can still continue to thank_you.

    } else {

      console.log(
        "✅ RESEND EMAIL SENT SUCCESSFULLY"
      );

    }


    // =========================================
    // STEP 3
    // SEND CUSTOMER TO THANK YOU PAGE
    // =========================================

    console.log(
      "STEP 3: Redirecting customer to /thank_you"
    );


    return res.redirect(
      303,
      "/thank_you"
    );


  } catch (error) {

    // =========================================
    // UNEXPECTED ERROR
    // =========================================

    console.error(
      "❌ UNEXPECTED ERROR:",
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

        <title>
          Something Went Wrong | Inara Rituals
        </title>

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