# auth-server

This project is a authentication server that authorize users using different authorizations flows.
It uses passport to authenticate user with different strategies (username-password, github, google...) and authorize users (using oaut2orize) to obtain `access token` and `id_token`s to use in applications.

## Flows

This authentication server support the following flows:

- [X] [Code flow](https://auth0.com/docs/flows/concepts/auth-code)
- [X] [Implicit flow](https://auth0.com/docs/flows/concepts/implicit)
- [ ] [Client credentials flow](https://auth0.com/docs/flows/concepts/client-credentials)

### Code flow

TBD

### Implicit flow

TBD

## development

### requirements

- docker
- docker-compose

### start

```sh
docker-compose up
```

All the services required (server and db) will start. It can be configured on the `docker-compose` file.

- The server runs on `http://localhost:8080` 
- The database listen on the port `27018` in case it is needed to access from outside the application, like `mongod` or other GUI for mongo. It uses a different port from the default `27017` to avoid collision wi exisitng running instances of mongo
- Requires to setup the google and github dev keys. (see links section)

## libraries

- [passport](http://www.passportjs.org/docs/configure/)
- [passport-local](https://github.com/jaredhanson/passport-local)
- [passport-github](https://github.com/jaredhanson/passport-github)
- [passport-google-oauth](https://github.com/jaredhanson/passport-google-oauth)
- [passport-http-bearer](https://github.com/jaredhanson/passport-http-bearer)
- [passport-http](https://github.com/jaredhanson/passport-http)
- [oauth2orize](https://github.com/jaredhanson/oauth2orize)
- [oauth2orize-openid](https://github.com/jaredhanson/oauth2orize-openid)
- [oauth2orize-audience](https://github.com/jaredhanson/oauth2orize-audience)
- [flowstate](https://github.com/jaredhanson/flowstate)

## Links

- [https://auth0.com/docs/flows/guides/implicit/call-api-implicit#authorize-the-user]
- [https://auth0.com/docs/flows/guides/implicit/call-api-implicit]
- [https://github.com/awais786327/oauth2orize-openid-examples]
- [Google developers console](https://console.developers.google.com/apis)
- [Github Oauth apps](https://github.com/settings/developers)

## TODO list

- [ ] deploy on heroku
- [ ] add tenants to separate clients
- [ ] set default audience when not passed
- [ ] use audience on code exchange
- [ ] proper error response
- [ ] separate clients with tenant concept
- [ ] set grants on ?clients? to show in consent form
- [ ] validate scopes to only allow registered scopes
- [ ] add api client credential authentication [https://auth0.com/docs/flows/guides/client-credentials/call-api-client-credentials]
- [ ] separate users on tenants
- [ ] separate views into separate project to use authentication
- [ ] separate api to different project that validates tokens
- [ ] nginx as loadbalancer / cors
- [ ] redesign form with better styles
