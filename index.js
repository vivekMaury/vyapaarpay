const express = require("express");
const path = require("path");

const app = express();
const rootDir = __dirname;
const preferredHost = "www.vyapaarpay.com";

const canonicalRoutes = new Map([
  ["/", "index.html"],
  ["/about/", "about-us.html"],
  ["/contact/", "contact.html"],
  ["/guides/", "guides.html"],
  ["/privacy-policy/", "privacy-policy.html"],
  ["/terms/", "terms-and-conditions.html"],
  ["/disclaimer/", "disclaimer.html"],
  ["/thank-you/", "thank-you.html"],
  ["/loan-application-rejection-reasons/", "loan-application-rejection-reasons.html"],
  ["/emi-calculator/", "emi-calculator/index.html"],
  ["/business-loan-emi-calculator/", "business-loan-emi-calculator/index.html"],
  ["/msme-loan-emi-calculator/", "msme-loan-emi-calculator/index.html"],
  ["/self-employed-loan-emi-calculator/", "self-employed-loan-emi-calculator/index.html"],
  ["/guides/how-emi-is-calculated/", "guides/how-emi-is-calculated/index.html"],
  ["/guides/how-to-reduce-emi-legally/", "guides/how-to-reduce-emi-legally/index.html"],
  ["/guides/choose-loan-service-provider-india/", "guides/choose-loan-service-provider-india.html"],
  ["/guides/documents-required-loans-india/", "guides/documents-required-loans-india.html"],
  ["/guides/loan-eligibility-criteria-india/", "guides/loan-eligibility-criteria-india.html"],
  ["/guides/loan-myths-india/", "guides/loan-myths-india.html"],
  ["/guides/loan-services-improve-approval-chances/", "guides/loan-services-improve-approval-chances.html"],
  ["/guides/personal-vs-business-vs-msme-loan/", "guides/personal-vs-business-vs-msme-loan.html"],
  ["/guides/safe-to-apply-through-loan-service-providers/", "guides/safe-to-apply-through-loan-service-providers.html"],
  ["/guides/what-are-loan-services-india/", "guides/what-are-loan-services-india.html"],
  ["/guides/which-type-of-loan-is-right/", "guides/which-type-of-loan-is-right.html"],
]);

const legacyRedirects = new Map([
  ["/index.html", "/"],
  ["/about-us.html", "/about/"],
  ["/contact.html", "/contact/"],
  ["/guides.html", "/guides/"],
  ["/privacy-policy.html", "/privacy-policy/"],
  ["/terms-and-conditions.html", "/terms/"],
  ["/disclaimer.html", "/disclaimer/"],
  ["/thank-you.html", "/thank-you/"],
  ["/loan-application-rejection-reasons.html", "/loan-application-rejection-reasons/"],
  ["/emi-calculator.html", "/emi-calculator/"],
  ["/emi-calculator/index.html", "/emi-calculator/"],
  ["/business-loan-emi-calculator/index.html", "/business-loan-emi-calculator/"],
  ["/msme-loan-emi-calculator/index.html", "/msme-loan-emi-calculator/"],
  ["/self-employed-loan-emi-calculator/index.html", "/self-employed-loan-emi-calculator/"],
  ["/guides/how-emi-is-calculated/index.html", "/guides/how-emi-is-calculated/"],
  ["/guides/how-to-reduce-emi-legally/index.html", "/guides/how-to-reduce-emi-legally/"],
  ["/guides/choose-loan-service-provider-india.html", "/guides/choose-loan-service-provider-india/"],
  ["/guides/documents-required-loans-india.html", "/guides/documents-required-loans-india/"],
  ["/guides/loan-eligibility-criteria-india.html", "/guides/loan-eligibility-criteria-india/"],
  ["/guides/loan-myths-india.html", "/guides/loan-myths-india/"],
  ["/guides/loan-services-improve-approval-chances.html", "/guides/loan-services-improve-approval-chances/"],
  ["/guides/personal-vs-business-vs-msme-loan.html", "/guides/personal-vs-business-vs-msme-loan/"],
  ["/guides/safe-to-apply-through-loan-service-providers.html", "/guides/safe-to-apply-through-loan-service-providers/"],
  ["/guides/what-are-loan-services-india.html", "/guides/what-are-loan-services-india/"],
  ["/guides/which-type-of-loan-is-right.html", "/guides/which-type-of-loan-is-right/"],
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
  const redirectTarget = legacyRedirects.get(req.path);

  if (redirectTarget) {
    const query = req.url.includes("?") ? req.url.slice(req.url.indexOf("?")) : "";
    res.redirect(301, `${redirectTarget}${query}`);
    return;
  }

  const indexMatch = req.path.match(/^(.*)\/index\.html$/);
  if (indexMatch) {
    const normalizedPath = indexMatch[1] || "/";
    const redirectPath = normalizedPath.endsWith("/") ? normalizedPath : `${normalizedPath}/`;
    const query = req.url.includes("?") ? req.url.slice(req.url.indexOf("?")) : "";
    res.redirect(301, `${redirectPath}${query}`);
    return;
  }

  next();
});

for (const [publicPath, filePath] of canonicalRoutes) {
  if (publicPath !== "/" && publicPath.endsWith("/")) {
    app.get(publicPath.slice(0, -1), (req, res) => {
      res.redirect(301, publicPath);
    });
  }

  app.get(publicPath, (req, res) => {
    res.sendFile(path.join(rootDir, filePath));
  });
}

app.use(express.static(rootDir));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
