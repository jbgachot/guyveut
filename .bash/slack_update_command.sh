echo -e "Updating the Slack App..."

JSON_MANIFEST=$(jq --arg APP_ID ${args[--app-id]} '{"app_id": $APP_ID, "manifest": .}' ${args[--manifest]} | jq -c .)
if [ -z ${args[--target]} ]; then
    BANKER_ENDPOINT=$(cd packages/banker && serverless info --verbose | grep ServiceEndpoint | sed s/ServiceEndpoint\:\ //g)
    REPORTS_ENDPOINT=$(cd packages/reports && serverless info --verbose | grep ServiceEndpoint | sed s/ServiceEndpoint\:\ //g)
else
    BANKER_ENDPOINT=${args[--target]}
    REPORTS_ENDPOINT=${args[--target]}
fi
JSON_MANIFEST="${JSON_MANIFEST//<<BANKER_ENDPOINT>>/"$BANKER_ENDPOINT"}"   
JSON_MANIFEST="${JSON_MANIFEST//<<REPORTS_ENDPOINT>>/"$REPORTS_ENDPOINT"}"   

curl -X POST -H "Content-Type: application/json; charset=utf-8" \
    -H "Authorization: Bearer $SLACK_APP_CONF_TOKEN" \
    --data "${JSON_MANIFEST//[[:blank:]]/}" https://slack.com/api/apps.manifest.update
