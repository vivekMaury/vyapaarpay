const express = require("express");

const app = express();
const rootDir = __dirname;
const preferredHost = "www.vyapaarpay.com";

const redirectToFiles = new Map([
  ["/about", "/about-us.html"],
  ["/about/", "/about-us.html"],
  ["/contact", "/contact.html"],
  ["/contact/", "/contact.html"],
  ["/guides", "/guides.html"],
  ["/guides/", "/guides.html"],
  ["/privacy-policy", "/privacy-policy.html"],
  ["/privacy-policy/", "/privacy-policy.html"],
  ["/terms", "/terms-and-conditions.html"],
  ["/terms/", "/terms-and-conditions.html"],
  ["/disclaimer", "/disclaimer.html"],
  ["/disclaimer/", "/disclaimer.html"],
  ["/thank-you", "/thank-you.html"],
  ["/thank-you/", "/thank-you.html"],
  ["/loan-application-rejection-reasons", "/loan-application-rejection-reasons.html"],
  ["/loan-application-rejection-reasons/", "/loan-application-rejection-reasons.html"],
  ["/guides/choose-loan-service-provider-india", "/guides/choose-loan-service-provider-india.html"],
  ["/guides/choose-loan-service-provider-india/", "/guides/choose-loan-service-provider-india.html"],
  ["/guides/documents-required-loans-india", "/guides/documents-required-loans-india.html"],
  ["/guides/documents-required-loans-india/", "/guides/documents-required-loans-india.html"],
  ["/guides/loan-eligibility-criteria-india", "/guides/loan-eligibility-criteria-india.html"],
  ["/guides/loan-eligibility-criteria-india/", "/guides/loan-eligibility-criteria-india.html"],
  ["/guides/loan-myths-india", "/guides/loan-myths-india.html"],
  ["/guides/loan-myths-india/", "/guides/loan-myths-india.html"],
  ["/guides/loan-services-improve-approval-chances", "/guides/loan-services-improve-approval-chances.html"],
  ["/guides/loan-services-improve-approval-chances/", "/guides/loan-services-improve-approval-chances.html"],
  ["/guides/personal-vs-business-vs-msme-loan", "/guides/personal-vs-business-vs-msme-loan.html"],
  ["/guides/personal-vs-business-vs-msme-loan/", "/guides/personal-vs-business-vs-msme-loan.html"],
  ["/guides/safe-to-apply-through-loan-service-providers", "/guides/safe-to-apply-through-loan-service-providers.html"],
  ["/guides/safe-to-apply-through-loan-service-providers/", "/guides/safe-to-apply-through-loan-service-providers.html"],
  ["/guides/what-are-loan-services-india", "/guides/what-are-loan-services-india.html"],
  ["/guides/what-are-loan-services-india/", "/guides/what-are-loan-services-india.html"],
  ["/guides/which-type-of-loan-is-right", "/guides/which-type-of-loan-is-right.html"],
  ["/guides/which-type-of-loan-is-right/", "/guides/which-type-of-loan-is-right.html"],
]);

app.enable("trust proxy");

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use((req, res, next) => {
  const forwardedProto = req.get("x-forwarded-proto");
  const protocol = forwardedProto ? forwardedProto.split(",")[0].trim() : req.protocol;
  const hostHeader = req.get("host");

  if (!hostHeader) {
    next();
    return;
  }

  const host = hostHeader.split(":")[0].toLowerCase();
  const isVyapaarPayHost = host === "vyapaarpay.com" || host === preferredHost;

  if (isVyapaarPayHost && (host !== preferredHost || protocol !== "https")) {
    res.redirect(301, `https://${preferredHost}${req.originalUrl}`);
    return;
  }

  next();
});

app.use((req, res, next) => {
  const redirectTarget = redirectToFiles.get(req.path);

  if (redirectTarget) {
    const query = req.url.includes("?") ? req.url.slice(req.url.indexOf("?")) : "";
    res.redirect(301, `${redirectTarget}${query}`);
    return;
  }

  next();
});

app.use(express.static(rootDir));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
