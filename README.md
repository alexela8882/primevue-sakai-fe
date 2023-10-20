## Installation

1. `git clone https://github.com/alexela8882/primevue-sakai-fe.git <project_name>`
2. `cd <project_name>`
3. `npm install`

## Project Setup
1. `cd <project_name>`
2. Run `json-server data/db3.json` to start json-server database
3. Run `npm run dev` to run the project
4. Make sure to also run your backend project via `php artisan serve` or your linux nginx/apache setup. Go to https://github.com/alexela8882/primevue-sakai-be/blob/master/README.md for more details how to setup the backend.
5. Go to `src/stores/base.js` and edit the following states to your working development:
    - jsonDbUrl (json-server database)
    - backendUrl (laravel backend)

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
npm start
```