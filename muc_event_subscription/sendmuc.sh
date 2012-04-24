#!/bin/bash

xmpp_user="mucmaster"
xmpp_pass="_mypassword_"

domain_name=".chatwith.it"

read -d '' message << EOF
{
	"to":"testmuc@muc.$domain_name",
	"body": "Message from API by $xmpp_user at `date`",
	"message_attributes":{
		"type": "groupchat"
	}
}
EOF

curl -v -X POST https://manager.chatmongers.com/api/1.0/xmppdomains/$domain_name/gateway/messages \
	-u $xmpp_user:$xmpp_pass -d "$message" -H "Content-type: application/json"
