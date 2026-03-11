# API Examples - cURL Commands

Collection of example cURL commands for testing the RAG chatbot API.

## Health Check

```bash
curl http://localhost:3001/health
```

## List All Websites

```bash
curl http://localhost:3001/api/websites
```

## Get Specific Website

```bash
# SmileCare Dental (ID: 1)
curl http://localhost:3001/api/website/1

# TechForge Solutions (ID: 2)
curl http://localhost:3001/api/website/2

# LearnHub Academy (ID: 3)
curl http://localhost:3001/api/website/3
```

## Chat API - SmileCare Dental (Website ID: 1)

### General Services
```bash
curl -X POST http://localhost:3001/api/chat \
  -H "Content-Type: application/json" \
  -d '{"websiteId": 1, "message": "What services do you offer?"}'
```

### Pricing Question
```bash
curl -X POST http://localhost:3001/api/chat \
  -H "Content-Type: application/json" \
  -d '{"websiteId": 1, "message": "How much does teeth whitening cost?"}'
```

### Contact Information
```bash
curl -X POST http://localhost:3001/api/chat \
  -H "Content-Type: application/json" \
  -d '{"websiteId": 1, "message": "What are your working hours?"}'
```

### Insurance Question
```bash
curl -X POST http://localhost:3001/api/chat \
  -H "Content-Type: application/json" \
  -d '{"websiteId": 1, "message": "Do you accept dental insurance?"}'
```

### Staff Information
```bash
curl -X POST http://localhost:3001/api/chat \
  -H "Content-Type: application/json" \
  -d '{"websiteId": 1, "message": "Tell me about Dr. Sarah Johnson"}'
```

## Chat API - TechForge Solutions (Website ID: 2)

### Technology Stack
```bash
curl -X POST http://localhost:3001/api/chat \
  -H "Content-Type: application/json" \
  -d '{"websiteId": 2, "message": "What technologies do you use for web development?"}'
```

### Pricing
```bash
curl -X POST http://localhost:3001/api/chat \
  -H "Content-Type: application/json" \
  -d '{"websiteId": 2, "message": "How much does a mobile app cost?"}'
```

### Process
```bash
curl -X POST http://localhost:3001/api/chat \
  -H "Content-Type: application/json" \
  -d '{"websiteId": 2, "message": "What is your development process?"}'
```

### Support
```bash
curl -X POST http://localhost:3001/api/chat \
  -H "Content-Type: application/json" \
  -d '{"websiteId": 2, "message": "Do you provide post-launch support?"}'
```

### Cloud Services
```bash
curl -X POST http://localhost:3001/api/chat \
  -H "Content-Type: application/json" \
  -d '{"websiteId": 2, "message": "Can you help with cloud infrastructure?"}'
```

## Chat API - LearnHub Academy (Website ID: 3)

### Course Catalog
```bash
curl -X POST http://localhost:3001/api/chat \
  -H "Content-Type: application/json" \
  -d '{"websiteId": 3, "message": "What courses do you offer?"}'
```

### Pricing
```bash
curl -X POST http://localhost:3001/api/chat \
  -H "Content-Type: application/json" \
  -d '{"websiteId": 3, "message": "How much is a subscription?"}'
```

### Certificates
```bash
curl -X POST http://localhost:3001/api/chat \
  -H "Content-Type: application/json" \
  -d '{"websiteId": 3, "message": "Do you offer certificates?"}'
```

### Free Trial
```bash
curl -X POST http://localhost:3001/api/chat \
  -H "Content-Type: application/json" \
  -d '{"websiteId": 3, "message": "Is there a free trial?"}'
```

### Offline Access
```bash
curl -X POST http://localhost:3001/api/chat \
  -H "Content-Type: application/json" \
  -d '{"websiteId": 3, "message": "Can I download courses for offline viewing?"}'
```

## Error Cases

### Invalid Website ID
```bash
curl -X POST http://localhost:3001/api/chat \
  -H "Content-Type: application/json" \
  -d '{"websiteId": 999, "message": "Test question"}'
```

Expected:
```json
{
  "success": false,
  "error": "Website with ID 999 not found or inactive",
  "code": "WEBSITE_NOT_FOUND"
}
```

### Missing WebsiteId
```bash
curl -X POST http://localhost:3001/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Test question"}'
```

Expected:
```json
{
  "success": false,
  "error": "websiteId is required",
  "code": "VALIDATION_ERROR"
}
```

### Missing Message
```bash
curl -X POST http://localhost:3001/api/chat \
  -H "Content-Type: application/json" \
  -d '{"websiteId": 1}'
```

Expected:
```json
{
  "success": false,
  "error": "message is required",
  "code": "VALIDATION_ERROR"
}
```

### Empty Message
```bash
curl -X POST http://localhost:3001/api/chat \
  -H "Content-Type: application/json" \
  -d '{"websiteId": 1, "message": ""}'
```

Expected:
```json
{
  "success": false,
  "error": "message cannot be empty",
  "code": "VALIDATION_ERROR"
}
```

## Testing Multi-Tenant Isolation

These tests verify that each website only gets its own data:

### Test 1: SmileCare should NOT know about TechForge
```bash
curl -X POST http://localhost:3001/api/chat \
  -H "Content-Type: application/json" \
  -d '{"websiteId": 1, "message": "Do you offer web development services?"}'
```

Expected: Should say information not found (dental clinic doesn't offer web dev).

### Test 2: TechForge should NOT know about LearnHub
```bash
curl -X POST http://localhost:3001/api/chat \
  -H "Content-Type: application/json" \
  -d '{"websiteId": 2, "message": "Do you offer online courses?"}'
```

Expected: Should say information not found (software agency doesn't offer courses).

### Test 3: LearnHub should NOT know about SmileCare
```bash
curl -X POST http://localhost:3001/api/chat \
  -H "Content-Type: application/json" \
  -d '{"websiteId": 3, "message": "Do you offer teeth whitening?"}'
```

Expected: Should say information not found (education platform doesn't offer dental services).

## Pretty Print JSON (Optional)

Add `| jq` to pretty-print JSON responses (requires jq installed):

```bash
curl -X POST http://localhost:3001/api/chat \
  -H "Content-Type: application/json" \
  -d '{"websiteId": 1, "message": "What services do you offer?"}' \
  | jq
```

## Save Response to File

```bash
curl -X POST http://localhost:3001/api/chat \
  -H "Content-Type: application/json" \
  -d '{"websiteId": 1, "message": "What services do you offer?"}' \
  > response.json
```

## Timing Requests

Add timing information:

```bash
curl -X POST http://localhost:3001/api/chat \
  -H "Content-Type: application/json" \
  -d '{"websiteId": 1, "message": "What services do you offer?"}' \
  -w "\nTime: %{time_total}s\n"
```

## Using PowerShell (Windows)

If using PowerShell instead of bash:

```powershell
Invoke-RestMethod -Uri http://localhost:3001/api/chat `
  -Method Post `
  -ContentType "application/json" `
  -Body '{"websiteId": 1, "message": "What services do you offer?"}'
```

## Using JavaScript (fetch)

```javascript
fetch('http://localhost:3001/api/chat', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    websiteId: 1,
    message: 'What services do you offer?'
  })
})
.then(res => res.json())
.then(data => console.log(data));
```
