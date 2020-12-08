# Deployment

[TODO: Updated deployment instructions.]

## 1 General hints

Use the following command to install dependencies optimized for the production environment:

```bash
composer install --no-dev --prefer-dist --optimize --apcu-autoloader
```

## 2 Instructions

Check `CHANGES.md` for additional deployment instructions.

```bash
git pull origin master
bin/adminconsole cache:clear --env=prod
bin/websiteconsole cache:clear --env=prod
bin/adminconsole assets:install --symlink --relative --env=prod
```
