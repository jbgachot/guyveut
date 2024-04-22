echo -e "Creating the Slack App..."


JSON_MANIFEST=$(jq '{"manifest": .}' ${args[--manifest]} | jq -c .)
JSON_MANIFEST="${JSON_MANIFEST//<<BANKER_ENDPOINT>>/'https://'"$(uuidgen)"'.fake'}"   
REPORTS_ENDPOINT=$(cd packages/reports && serverless info --verbose | grep ServiceEndpoint | sed s/ServiceEndpoint\:\ //g)
JSON_MANIFEST="${JSON_MANIFEST//<<REPORTS_ENDPOINT>>/'https://'"$(uuidgen)"'.fake'}"   

curl -X POST -H "Content-Type: application/json; charset=utf-8" \
    -H "Authorization: Bearer $SLACK_APP_CONF_TOKEN" \
    --data "${JSON_MANIFEST//[[:blank:]]/}" https://slack.com/api/apps.manifest.create
