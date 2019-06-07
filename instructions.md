# Instructions

The goal is to get to know Node.js, MongoDB, Passport.js and OAuth2orize

## Tasks

### required

- [X] Create a server using Express and Node 8 or later
- [X] Use passport-local to support basic username/password authentication
- [X] Create a page where a user can sign up
- [X] Using the appropriate passport strategies, support social provider login via Google and GitHub
- [X] Create a login page where the user can select their authentication method
- [X] Implement support for the OAuth 2.0 Authorization Code grant using oauth2orize
- [X] Add basic support for OIDC by the way of the /userinfo API, supporting at least the openid profile email scopes. The endpoint must be authenticated via the tokens issues from the Authorization Code flow
- [X] Show a consent page to the user
- [ ] Use FlowState

### optional

- [X] If the user has a valid session, skip the login page
- [X] If the user has previously granted consent, skip the consent dialog
- [ ] Support some of the OIDC request extension parameters using oauth2orize-openid
- [X] Use MongoDB for all the data that needs to be persisted