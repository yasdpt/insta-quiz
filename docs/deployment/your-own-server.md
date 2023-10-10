# Your own server

The app uses web sockets to communicate and because of that can not be hosted on services like Vercel or Netlify because they run on serverless functions and will turn off after 30 seconds.

You can deploy the apps on your own server using docker, each app has a Dockerfile in it's directory which you can use to make the docker image and run it on a VPS.

You can use any VPS config for the application but I recommend at least 4GB of RAM for it to run smoothly and handle multiple connections. You can get your server from DigitalOcean or Linode or any other provider.

> This guide assumes it's an Ubuntu 22.04 instance.

## Installing docker

&#x20;You can follow [this](https://www.digitalocean.com/community/tutorials/how-to-install-and-use-docker-on-ubuntu-22-04) guide to setup docker on your server once you're done come back and we will continue.

## Running the app

After installing docker clone the app or clone your own with changes you made into server.

```bash
git clone https://github.com/yasdpt/insta-quiz.git

cd insta-quiz
```

After that you will build images for each the server and the client.

> Be sure to set the correct domains in .env files from domain names you choose in [nginx setup](your-own-server.md#setting-up-nginx) section

```bash
cd server
cp .env.example .env

# build the image
docker build -t quizserver .
```

wait for the build to finish then from the root of the project again:

```bash
cd client
cp .env.example .env.production

# build the image
docker build -t quizclient .
```

Two images with names quizserver and quizclient have been build, to run them run these commands:

```bash
# will run the server on 8081 port
docker run -d --restart unless-stopped -p 8081:3000 quizserver

# will run client on 8082
docker run -d --restart unless-stopped -p 8082:80 quizclient
```

After you containers are up and running you can now test them with their port on your server.

`http://server_ip:8081` for server

`http://server_ip:8082` for client

> If firewall is up you have to give access for testing, remember to disable after

## Setting up nginx

For your apps to be able to be used on Telegram they have to be https protocol.

You can use nginx and certbot to reverse proxy your apps and connect your domains to give Telegram.

```bash
sudo apt update
sudo apt install nginx # reverse proxy
sudo apt install snapd && sudo snap install --classic certbot # ssl installer
sudo ln -s /snap/bin/certbot /usr/bin/certbot # link certbot to path
```

After installing nginx enable it's profile on the firewall:

```bash
sudo ufw allow 'Nginx Full'
```

enable nginx

```bash
sudo systemctl start nginx   # start nginx
sudo systemctl enable nginx     # run on system startup
```

Then create files for subdomain configs

```bash
sudo touch /etc/nginx/sites-available/quizs.YOUR_DOMAIN # config for server
sudo touch /etc/nginx/sites-available/quizs.YOUR_DOMAIN # config for client

# then enable the websites
sudo ln -s /etc/nginx/sites-available/quizs.YOUR_DOMAIN /etc/nginx/sites-enabled/quizs.YOUR_DOMAIN
sudo ln -s /etc/nginx/sites-available/quizc.YOUR_DOMAIN /etc/nginx/sites-enabled/quizc.YOUR_DOMAIN
```

> Make sure your subdomains are pointing at your server's ip in your domains dns settings

After that edit the files and insert configs for each:

```bash
sudo nano /etc/nginx/sites-available/quizs.YOUR_DOMAIN
```

Then paste this inside:

```
server {
    server_name quizs.YOUR_DOMAIN;
    
    # HTTP configuration
    listen 80;
    listen [::]:80;
    
    location / {
        proxy_pass  http://127.0.0.1:8081;
        proxy_redirect                      off;
        proxy_set_header  Host              $http_host;
        proxy_set_header  X-Real-IP         $remote_addr;
        proxy_set_header  X-Forwarded-For   $proxy_add_x_forwarded_for;
        proxy_set_header  X-Forwarded-Proto $scheme;
        proxy_read_timeout                  900;
    }
}
```

Click CTRL+X to and then Click Y to save.

Then do the same for the client:

```bash
sudo nano /etc/nginx/sites-available/quizs.YOUR_DOMAIN
```

And then paste:

```
server {
    server_name quizc.YOUR_DOMAIN;
    
    # HTTP configuration
    listen 80;
    listen [::]:80;
    
    location / {
        proxy_pass  http://127.0.0.1:8082;
        proxy_redirect                      off;
        proxy_set_header  Host              $http_host;
        proxy_set_header  X-Real-IP         $remote_addr;
        proxy_set_header  X-Forwarded-For   $proxy_add_x_forwarded_for;
        proxy_set_header  X-Forwarded-Proto $scheme;
        proxy_read_timeout                  900;
    }
}
```

Then reload nginx for the changes to take effect:

```bash
sudo systemctl reload nginx
```

### Certbot

For creating ssl certificates for your apps run command below:

```bash
sudo certbot --nginx -d quizs.YOUR_DOMAIN -d quizc.YOUR_DOMAIN
```



Now you can check access to your client and server with their domain name.

After that you can set the bot's URL in @botfather as mentioned before in [Testing](../setup/testing.md) guide.
