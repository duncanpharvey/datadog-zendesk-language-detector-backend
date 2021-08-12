## Summary
This is an express app which determines the language of text sent in a request from Zendesk and updates the corresponding ticket with a language tag 
for a select subset of languages.
Currently it is configured to set language tags for `Japanese`, `Korean`, and `Chinese` but it could be configured to tag any 
language included in the language detection library.

## Packages Used

* [express](https://www.npmjs.com/package/express) - web server  
* [express basic auth](https://www.npmjs.com/package/express-basic-auth) - basic authentication for API requests  
* [axios](https://www.npmjs.com/package/axios) - making external API requests  
* [cld](https://www.npmjs.com/package/cld) - language detection  

## Usage

This application is currently running on an EC2 in AWS and is connected to the Zendesk Sandbox so to use it,
create a ticket where the initial comment in the ticket is in `Japanese`, `Korean`, or `Chinese` and the language will be tagged:

<img src="https://p-qkfgo2.t2.n0.cdn.getcloudapp.com/items/L1urY6DQ/cd28d701-01bd-4dae-96d4-0ef19dc9c3ed.jpg?source=viewer&v=222eeaf521e478e5d6260e065002e713"
alt="Language Detection Example" width="500"/>

## Setup

### AWS

Create an EC2 instance in AWS and add the Zendesk IP Addresses under `ips.egress.specific` to the attached Security Group.

[Zendesk IP Whitelist](https://support.zendesk.com/hc/en-us/articles/203660846-Configuring-your-firewall-for-use-with-Zendesk)

<img src="https://p-qkfgo2.t2.n0.cdn.getcloudapp.com/items/lluowgeZ/f089ee6b-a5bb-4030-ae2a-cfda7c569528.jpg?source=viewer&v=0860f30b89a739d76138f6166bb49de3"
alt="EC2 Security Group" width="500"/>

### Application

Set the following environment variables in `~/config/.env`:

```
LANGUAGES_TO_TAG=japanese,korean,chinese
PORT=8080
ZENDESK_SUBDOMAIN=datadog1562172700
ZENDESK_USERNAME=<redacted>
ZENDESK_API_TOKEN=<redacted>
USERNAME=<redacted>
PASSWORD=<redacted>
```
Use the docker commands in [setup.sh](https://github.com/duncanpharvey/datadog-zendesk-language-detector-backend/blob/master/setup.sh) to build and
run the Language Detection Application along with the Datadog Agent.

**<em>docker-compose.yml in progress</em>**

### Zendesk

<img src="https://p-qkfgo2.t2.n0.cdn.getcloudapp.com/items/6quYDNBO/d339a7f1-9a33-473f-b737-7141d8abf96f.jpg?source=viewer&v=325d33829fca79af0a5c6f729d1418c7"
alt="Language Detection Trigger" width="500"/>

---

<img src="https://p-qkfgo2.t2.n0.cdn.getcloudapp.com/items/p9ukzLKN/a7b24720-b732-4463-8a31-3c31f07d00c1.jpg?source=viewer&v=fc2d38c384c9284d6680e897def61d92"
alt="Language Detection Webhook" width="500"/>
