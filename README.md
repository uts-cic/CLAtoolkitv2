# Connected Learning Toolkit V2

*NOTE*: This codebase is in Active development.

Connected Learning Analytics - new architecture version 2

This version of the toolkit decouples class/course/unit setup, social media scraping, and xAPI statement creation from dashboards and analytics functionality of the
prior CLAToolkit. 

# Road Map
- Complete CLAToolkit UI:
  - Implement AAF SSO 
  - Implement Class creation "wizard" and social media setup (Working - In Test Phase)
    - Implement configurable scrape schedules/import now functionality
    - Implement Dynamic creation form based on already set-up social media backend endpoints 
  - Add Edit Unit functionality (Working - In Test Phase)
  - Add User edit functionality (remove from course/manage attached social media and accounts)
  - Adjust style to comply with Existing dashboard style
- Complete CLAtoolkit-backend:
  - Implement endpoints to support front-end functionality (in progress)
  - Implement configurable data scraping (somewhat functional utilising agenda.js)
- Integrate graphql importer:
  - ~~~Have graphql importer working with toolkit~~~
  - Fix graphql outputs

- General
  - Clean up codebase
  - Imeplement unit tests 
  - Consider Configurable Dashboard/Analytics links to attach to units, would send user to third-party Analytics webpage


# Before installation (local and server)

The CLAtoolkit uses protected APIs of a number of social media, to access these you will need to create a number of social media applications. It is a good idea to create these developer applications before beginning to install the CLAtoolkit. Currently the social media being used are:

- Slack (https://api.slack.com/slack-apps)
- Twitter (https://developer.twitter.com/en.html)
- Trello (https://developers.trello.com/)
- Github (https://github.com/settings/developers)

Some of these developer applications will take a while to setup. For example, twitter requires an authentication process via email and can take up to 5 business days to have your developer app approved before you can access the API endpoints for twitter that are required by the toolkit.

Make sure to add the oauth app key/secrets to .env!

# Installation Instructions (local)

- Download and Install MongoDB (https://www.mongodb.com/download-center/community)
- Clone repository
- npm install all dependencies of all folders
  - e.g.: 
  - ```bash cd clatoolkit-backend && npm install && cd ..```
  - ```bash cd clatoolkitUI && npm install && cd ..```
  - ```bash cd social-imports && npm install && cd ..```
- Start UI/backend/importers 
  - backend: ```bash /clatoolkit-backend/$: npm start```
  - ui: ```bash /clatoolkitUI/$: npm start```
  - importer: ```bash /social-networks-importer/$: node graphql.js```

# Installation Instructions (remote/web)
- Download and Install MongoDB (https://www.mongodb.com/download-center/community)
- Clone repository
- npm install all dependencies of all folders
  - e.g.: 
  - ```bash cd clatoolkit-backend && npm install && cd ..```
  - ```bash cd clatoolkitUI && npm install && cd ..```
  - ```bash cd social-imports && npm install && cd ..```

 ## Install and Configure Webserver (nginx)
 ```bash Sudo apt-get install nginx```

 Example server config (http only):
 ```
 server {
        listen 80 default_server;
        listen [::]:80 default_server;

        # SSL configuration
        #
        # listen 443 ssl default_server;
        # listen [::]:443 ssl default_server;
        #
        # Note: You should disable gzip for SSL traffic.
        # See: https://bugs.debian.org/773332
        #
        # Read up on ssl_ciphers to ensure a secure configuration.
        # See: https://bugs.debian.org/765782
        #

        root /var/www/clatoolkitui;

        # Add index.php to the list if you are using PHP
        index index.html;

        server_name http://some_domain_ip;

        location / {
                # First attempt to serve request as file, then
                # as directory, then fall back to displaying a 404.
#               index.html
                try_files $uri $uri/ /index.html;
        }

        location /api/ {
                proxy_pass http://localhost:3000/;
                proxy_http_version 1.1;
        }

        # /social/ used for oauth redirects
        # note: no trailing slash on proxy_pass, /social/ not stripped
        location /social/ {
      proxy_pass http://localhost:3000;
      proxy_http_version 1.1;
        }

}
```


