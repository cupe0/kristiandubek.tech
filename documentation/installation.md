# Installation

## 1 Requirements

 - PHP: **7.4.13**
 - MySQL: **>=5.7**
 - HTTP Server: **nginx**


## 2 Instructions

**1. Clone the repository**

```bash
git clone https://github.com/cupe0/kristiandubek.tech.git .
```

**2. Install dependencies**

Development:

```bash
composer install
```

Production:

```bash
composer install --no-dev --prefer-dist --optimize --apcu-autoloader
```

**3. Build Sulu**

Development:

```bash
bin/adminconsole sulu:build dev
```

Production:

```bash
bin/adminconsole sulu:build prod
```
