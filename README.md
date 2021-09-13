## Summary
This is an app which determines the language of text sent in a request from Zendesk and updates the corresponding ticket with a language tag 
for a select subset of languages.
Currently it is configured to set language tags for `Japanese`, `Korean`, and `Chinese` but it could be configured to tag any 
language included in the language detection library.

## Usage

This application is currently running on an EC2 in AWS and is connected to the Zendesk Sandbox. To use it,
create a ticket where the initial comment in the ticket is in `Japanese`, `Korean`, or `Chinese` and the language will be tagged:

<img src="https://p-qkfgo2.t2.n0.cdn.getcloudapp.com/items/L1urY6DQ/cd28d701-01bd-4dae-96d4-0ef19dc9c3ed.jpg?source=viewer&v=222eeaf521e478e5d6260e065002e713"
alt="Language Detection Example" width="500"/>

## Setup

### AWS

Create an EC2 instance in AWS and add the Zendesk IP Addresses under `ips.egress.specific` to the attached Security Group.

[Zendesk IP Whitelist](https://support.zendesk.com/hc/en-us/articles/203660846-Configuring-your-firewall-for-use-with-Zendesk)

<img src="https://p-qkfgo2.t2.n0.cdn.getcloudapp.com/items/lluowgeZ/f089ee6b-a5bb-4030-ae2a-cfda7c569528.jpg?source=viewer&v=0860f30b89a739d76138f6166bb49de3"
alt="EC2 Security Group" width="500"/>

Run [setup.sh](https://github.com/duncanpharvey/datadog-zendesk-language-detector-backend/blob/master/setup.sh) to install Docker and Git on an Ubuntu Linux EC2 Instance.

### Application

Generate a new SSH key on the EC2 instance, connect it to your Github account, and clone this repository onto the EC2 instance.

Create `zendesk-language-detector.env` in this project's root directory and set the following environment variables:

```
LANGUAGES_TO_TAG=japanese,korean,chinese
ZENDESK_SUBDOMAIN=datadog1562172700
ZENDESK_USERNAME=<redacted>
ZENDESK_API_TOKEN=<redacted>
USERNAME=<redacted>
PASSWORD=<redacted>
```

Create `.env` in the this project's root directory and set the `DD_API_KEY`:

```
DD_API_KEY=<redacted>
```

run `sudo docker-compose up -d --build`

### Zendesk

Create a webhook with which makes a `POST` request to the application running on the EC2 instance `http://<ec2.ip>/languages`:

<img src="https://p-qkfgo2.t2.n0.cdn.getcloudapp.com/items/p9ukzLKN/a7b24720-b732-4463-8a31-3c31f07d00c1.jpg?source=viewer&v=fc2d38c384c9284d6680e897def61d92"
alt="Language Detection Webhook" width="500"/>

---

Create a trigger which sends the ticketId and the initial comment to the above webhook when a ticket is created:

<img src="https://p-qkfgo2.t2.n0.cdn.getcloudapp.com/items/6quYDNBO/d339a7f1-9a33-473f-b737-7141d8abf96f.jpg?source=viewer&v=325d33829fca79af0a5c6f729d1418c7"
alt="Language Detection Trigger" width="500"/>

## Packages Used

* [express](https://www.npmjs.com/package/express) - web server  
* [express basic auth](https://www.npmjs.com/package/express-basic-auth) - basic authentication for API requests  
* [axios](https://www.npmjs.com/package/axios) - external API requests  
* [cld](https://www.npmjs.com/package/cld) - language detection  
* [console-stamp](https://www.npmjs.com/package/console-stamp) - log timestamps
