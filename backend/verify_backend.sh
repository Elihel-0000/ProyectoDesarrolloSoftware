#!/bin/bash

BASE_URL="http://localhost:3004"

echo "1. Registering Citizen..."
CITIZEN_EMAIL="citizen@test.com"
curl -s -X POST $BASE_URL/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"email\": \"$CITIZEN_EMAIL\", \"password\": \"password123\", \"name\": \"Citizen John\", \"role\": \"citizen\"}" | jq .

echo -e "\n\n2. Logging in Citizen..."
LOGIN_RES=$(curl -s -X POST $BASE_URL/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\": \"$CITIZEN_EMAIL\", \"password\": \"password123\"}")
TOKEN=$(echo $LOGIN_RES | jq -r .access_token)
echo "Token: $TOKEN"

echo -e "\n\n3. Get Profile..."
curl -s -X GET $BASE_URL/auth/me \
  -H "Authorization: Bearer $TOKEN" | jq .

echo -e "\n\n4. Create Complaint (no image)..."
curl -s -X POST $BASE_URL/denuncias \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"title\": \"Pothole\", \"description\": \"Big pothole here\", \"category\": \"Infrastructure\", \"lat\": 10.0, \"lng\": 20.0}" | jq .

echo -e "\n\n5. Get Complaints..."
curl -s -X GET "$BASE_URL/denuncias?status=Pending" | jq .

echo -e "\n\n6. Register Authority..."
AUTHORITY_EMAIL="auth@test.com"
curl -s -X POST $BASE_URL/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"email\": \"$AUTHORITY_EMAIL\", \"password\": \"admin123\", \"name\": \"Officer Jane\", \"role\": \"authority\"}" | jq .

echo -e "\n\n7. Login Authority..."
AUTH_LOGIN_RES=$(curl -s -X POST $BASE_URL/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\": \"$AUTHORITY_EMAIL\", \"password\": \"admin123\"}")
AUTH_TOKEN=$(echo $AUTH_LOGIN_RES | jq -r .access_token)

echo -e "\n\n8. Update Status (Authority)..."
# Get ID of first complaint (assuming 1)
curl -s -X PATCH $BASE_URL/denuncias/1/status \
  -H "Authorization: Bearer $AUTH_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"status\": \"In Progress\"}" | jq .

echo -e "\n\n9. Get Stats..."
curl -s -X GET $BASE_URL/stats \
  -H "Authorization: Bearer $TOKEN" | jq .
