// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,

  frontend_host: "http://13.210.148.223/",
  ssl: false,

  backend_api: "http://13.210.148.223/api",
  AAF_url: "https://rapid.test.aaf.edu.au/jwt/authnrequest/research/uipTf8Va3aiPNGQ27luPvA"
};
