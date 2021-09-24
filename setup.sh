aws ecr get-login-password \
    --region us-east-1 \
| docker login \
    --username AWS \
    --password-stdin 601427279990.dkr.ecr.us-east-1.amazonaws.com


docker build . -t zendesk-language-detector
docker tag zendesk-language-detector:latest 601427279990.dkr.ecr.us-east-1.amazonaws.com/zendesk-language-detector:latest
docker push 601427279990.dkr.ecr.us-east-1.amazonaws.com/zendesk-language-detector:latest