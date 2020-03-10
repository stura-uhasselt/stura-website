# Renewing domain name YEARLY

name.com

# Renewing SSL certificates QUARTERLY


https://certbot.eff.org/docs/using.html#manual

Certificates needs to be renewed manually for:

- sturauhasselt.be
- *.sturauhasselt.be
- *.dev.sturauhasselt.be
- *.local.strauhasselt.be

## Steps

Login to server
- `ssh root@sturauhasselt.be`

Renew certificates
- `certbot certonly --manual --preferred-challenges dns`
- `sturauhasselt.be, *.sturauhasselt.be, *.dev.sturauhasselt.be, *.local.sturauhasselt.be`

Enter TXT records on:
https://www.name.com/account/domain/details/sturauhasselt.be#dns

After completion move certificates to project directory
- `cp -rL /etc/letsencrypt/live/sturauhasselt.be/ /root/stura-website/.certs/`
