FROM public.ecr.aws/lambda/nodejs:14
COPY index.js package*.json ./
RUN yum install -y gcc gcc-c++ kernel-devel make && npm install
CMD [ "index.handler" ]