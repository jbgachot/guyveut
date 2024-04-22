echo -e "Updating the Slack App..."

JSON_MANIFEST=$(jq --arg APP_ID ${args[--app-id]} '{"app_id": $APP_ID, "manifest": .}' ${args[--manifest]} | jq -c .)
BANKER_ENDPOINT=$(cd packages/banker && serverless info --verbose | grep ServiceEndpoint | sed s/ServiceEndpoint\:\ //g)
JSON_MANIFEST="${JSON_MANIFEST//<<BANKER_ENDPOINT>>/"$BANKER_ENDPOINT"}"   
REPORTS_ENDPOINT=$(cd packages/reports && serverless info --verbose | grep ServiceEndpoint | sed s/ServiceEndpoint\:\ //g)
JSON_MANIFEST="${JSON_MANIFEST//<<REPORTS_ENDPOINT>>/"$REPORTS_ENDPOINT"}"   

curl -X POST -H "Content-Type: application/json; charset=utf-8" \
    -H "Authorization: Bearer $SLACK_APP_CONF_TOKEN" \
    --data "${JSON_MANIFEST//[[:blank:]]/}" https://slack.com/api/apps.manifest.update
