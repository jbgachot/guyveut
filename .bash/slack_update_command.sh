echo -e "Updating the Slack App..."

JSON_MANIFEST=$(jq --arg APP_ID ${args[--app-id]} '{"app_id": $APP_ID, "manifest": .}' ${args[--manifest]} | jq -c .)

curl -X POST -H "Content-Type: application/json; charset=utf-8" \
    -H "Authorization: Bearer $SLACK_APP_CONF_TOKEN" \
    --data "${JSON_MANIFEST}" https://slack.com/api/apps.manifest.update
