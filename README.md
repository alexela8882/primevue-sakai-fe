## Installation

1. `git clone https://github.com/alexela8882/primevue-sakai-fe.git <project_name>`
2. `cd <project_name>`
3. `git checkout <your_designated_branch>`
4. `git merge master`
5. `npm install`

## Project Setup
1. `cd <project_name>`
2. Run `json-server data/db3.json` to start json-server database.
3. Open another terminal the run `npm run dev` to start the project.
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

### Compile and Minify for Esco Production

1. First, build the production in your local development

```sh
git checkout production-3
git merge master // merge from master branch
git push
pnpm build
git add .
git commit -am "production build"
git push
```
2. In production server, run this commands

```sh
sudo /DATA/www/nav.reddotcrm.com
sudo git pull
sudo /usr/bin/pm2 restart all
```

3. To start the production webapp

```sh
sudo /usr/bin/pm2 start "sudo /usr/local/bin/npm run start" --name rdv2
```

4. To start the production json-server

```sh
sudo /usr/bin/pm2 start "sudo /usr/local/bin/npm run startjsonserver" --name rdv2
```

**Note: You may see the configuration in the `package.json` file.**

5. To restart both server

```sh
sudo /usr/bin/pm2 restart all
```

6. Monitor the logs for troubleshooting

```sh
sudo /usr/bin/pm2 monit

or

sudo /usr/bin/pm2 logs
```
