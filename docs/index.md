# GlobalCVE API Docs

This page documents how to query CVE data, filter by severity, and integrate with your tools.

🚀 **Getting Started**  
Our API supports RESTful endpoints for CVE search, filtering, and metadata enrichment. Authentication is optional for public queries.

⚠️ **API Usage Notice**  
The GlobalCVE API is designed for local deployment only. Due to strict security settings and rate-limit concerns on the public site (globalcve.xyz), direct API access is not available from the hosted frontend.

✅ **How to Use the API**  
1. Clone the repository
2. Run the project locally: `npm run dev`
3. Access the API via `http://localhost:3000/api/cves?query=...`

🔐 **Why This Matters**  
GlobalCVE prioritizes security and performance. Hosting the API publicly would expose it to abuse, scraping, and potential denial-of-service risks. For contributors and developers, local deployment offers:
- Full access to all query parameters
- Reliable testing and debugging
- No external throttling or middleware interference
- Easy to deploy in a Docker container

📌 This note applies to both the GitHub API documentation and the live site docs. Please ensure you run the API locally for full functionality.

🔍 **Example Endpoint**  
`GET /api/cves?query=openssl&severity=high`  
Returns CVEs matching "openssl" with high severity.

📦 **Coming Soon**
- Vendor-specific filters (available in testing)
- Export formats (JSON, CSV 
