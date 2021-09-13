import requests
import datetime
import sys
import boto3
import os
from dotenv import load_dotenv
from pathlib import Path

dotenv_path = Path("./zendesk-whitelist-ip.env")
load_dotenv(dotenv_path=dotenv_path)

client = boto3.client('ec2')

response = requests.get(url=os.environ.get("URL"))
if response.status_code != 200:
    sys.exit()

zendesk_ips = set(response.json()['ips']['egress']['all'])

security_group_rule_filters = [
    {
        'Name': 'group-id',
        'Values': [os.environ.get("SECURITY_GROUP_ID")]
    }
]
response = client.describe_security_group_rules(Filters=security_group_rule_filters)

ec2_ips = set(map(lambda rule: rule['CidrIpv4'], filter(lambda rule: rule['IsEgress'] == False and rule['FromPort'] == 80 and rule['ToPort'] == 80 and rule['IpProtocol'] == 'tcp', response['SecurityGroupRules'])))

ips_to_add = zendesk_ips.difference(ec2_ips)
ips_to_remove = ec2_ips.difference(zendesk_ips)

if len(ips_to_add) > 0:
    print("adding IP addresses to whitelist:")

ipranges_to_add = []
for ip in ips_to_add:
    print(ip)
    ipranges_to_add.append({
        'CidrIp': ip,
        'Description': 'zendesk ip whitelist script - {}'.format(datetime.datetime.now())
    })

ippermissions_to_add = [
    {
        'FromPort': 80,
        'IpProtocol': 'tcp',
        'IpRanges': ipranges_to_add,
        'ToPort': 80
    }
]

if len(ippermissions_to_add) > 0:
    add_res = client.authorize_security_group_ingress(GroupId=os.environ.get("SECURITY_GROUP_ID"), IpPermissions=ippermissions_to_add)
    print(add_res)

if len(ips_to_remove) > 0:
    print("removing IP addresses from whitelist")

ipranges_to_remove = []
for ip in ips_to_remove:
    print(ip)
    ipranges_to_remove.append({
        'CidrIp': ip
    })

ippermissions_to_remove = [
    {
        'FromPort': 80,
        'IpProtocol': 'tcp',
        'IpRanges': ipranges_to_remove,
        'ToPort': 80
    }
]

if len(ippermissions_to_remove) > 0:
    revoke_res = client.revoke_security_group_ingress(GroupId=os.environ.get("SECURITY_GROUP_ID"), IpPermissions=ippermissions_to_remove)
    print(revoke_res)