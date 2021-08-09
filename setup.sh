# ---------------- Manual Setup on local machine ----------------

# build Docker image and upload to Elastic Container Registry

docker build . -t zendesk-language-detector
docker tag zendesk-language-detector:latest 601427279990.dkr.ecr.us-east-1.amazonaws.com/zendesk-language-detector:latest
docker push 601427279990.dkr.ecr.us-east-1.amazonaws.com/zendesk-language-detector:latest

# run image locally
docker run -p 80:8080 --name zendesk-language-detector --env-file .env -d zendesk-language-detector

# ---------------- Manual Setup on EC2 ----------------

# set up .env file in ~/config/.env on host
# set up AWS CLI to be able to access docker image in ECR - https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-quickstart.html#cli-configure-quickstart-creds

aws ecr get-login --region us-east-1 --no-include-email # run docker login that is output from this command with sudo

# install Datadog Agent and enable logging, replace <DD-API-KEY> with Datadog API key
sudo docker run -d --name datadog-agent \
           -e DD_API_KEY=<DD-API-KEY> \
           -e DD_LOGS_ENABLED=true \
           -e DD_LOGS_CONFIG_CONTAINER_COLLECT_ALL=true \
           -e DD_LOGS_CONFIG_DOCKER_CONTAINER_USE_FILE=true \
           -e DD_CONTAINER_EXCLUDE="name:datadog-agent" \
           -v /var/run/docker.sock:/var/run/docker.sock:ro \
           -v /var/lib/docker/containers:/var/lib/docker/containers:ro \
           -v /proc/:/host/proc/:ro \
           -v /opt/datadog-agent/run:/opt/datadog-agent/run:rw \
           -v /sys/fs/cgroup/:/host/sys/fs/cgroup:ro \
           gcr.io/datadoghq/agent:latest

# ---------------- Automated Setup on EC2 ----------------

# install steps from https://docs.docker.com/engine/install/ubuntu/
sudo apt-get update
sudo apt install -y awscli
sudo apt-get install -y \
    apt-transport-https \
    ca-certificates \
    curl \
    gnupg \
    lsb-release

curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

echo \
  "deb [arch=amd64 signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

sudo apt-get update
sudo apt-get -y install docker-ce docker-ce-cli containerd.io

sudo docker pull 601427279990.dkr.ecr.us-east-1.amazonaws.com/zendesk-language-detector:latest
# dns resolution setting needed otherwise external request to Zendesk takes ~5s from EC2
sudo docker run -p 80:8080 --name zendesk-language-detector --env-file ~/config/.env --dns 8.8.8.8 -d 601427279990.dkr.ecr.us-east-1.amazonaws.com/zendesk-language-detector