# Testing

### Create and update the test database

```bash
bin/adminconsole doctrine:database:create --env=test
bin/adminconsole doctrine:schema:update --force --env=test
```

### Define the URL used for the tests

Open your webspace and check the URL for the `test` environment:
```xml
<environment type="test">
    <urls>
        <url language="en">{host}</url>
    </urls>
</environment>
```

If you change the value from `{host}` to e.g. `test.lo`, you **must** update your tests and pass this URL to the `$this->createWebsiteClient()` call.

### Create custom tests

#### Template tests

The easiest way to get started testing your website, is to define tests for the individual templates. This will be the most common type of testing a "simple" website. It is best to start by copying the test class `DefaultTest.php` and adjusting it for your new template. 

```php
<?php

...

class DefaultTest extends WebsiteTestCase
{
    /* 
     * Provides the `createPage` method vor simply create a new test page and the `assertCrawlerProperty`
     * method for checking the response of the test page.
     */
    use PageTrait;

    public function setUp()
    {
        // Calls the parent's `setUp` method for booting the website kernel.
        parent::setUp();
        
        // Initializes PHPCR datas for starting tests on a "clean" environment.
        $this->initPhpcr();
    }

    public function testDefault()
    {
        $locale = 'en';
        
        /*
         * Creates the testpage: The first parameter is the template key:
         *  - template key
         *  - webspace key
         *  - template data (keys represent the template properties)
         *  - locale
         */
        $this->createPage(
            'default',
            'webspaceKey',
            [
                'title' => 'New default page',
                'url' => '/default',
                'published' => true,
            ],
            $locale
        );

        $client = $this->createWebsiteClient();
        $crawler = $client->request('GET', '/' . $locale . '/default');

        // Checks if there is a successfull HTTP response.
        $this->assertHttpStatusCode(200, $client->getResponse());
        
        // Checks if the given HTML node ('title') contains the expected value ('New default page').
        $this->assertCrawlerProperty($crawler, 'title', 'New default page');
    }
}
```

The preferred procedure is to create the test class before any line of your new template is written. Run the test again and again until it succeeds.

The most simple test is to check if a HTTP status of `200` is responded and if the title is contained. But think about which other properties you would like to have in your new template. 

```php
...
$this->createPage(
    'default',
    'webspaceKey',
    [
        'title' => 'New default page',
        'url' => '/default',
        'published' => true,
        'description' => '<p>Beschreibung</p>',
    ],
    $locale
);
...
$this->assertCrawlerProperty($crawler, '[property=description]', '<p>Beschreibung</p>');
...
```

Use a selector (like in CSS) `[property=description]` for getting the relevant node in the rendered template. The corresponding twig will look like this:

```twig
<p property="description"> {{ description }} </p>
```

But you also can use selectors like `.description-class` if your node has the class `description-class`. But consider that the attribute `property` is used for live preview.

```twig
<p class="description-class"> {{ description }} </p>
```

### Run tests

Run all tests:

```bash
bin/phpunit
```

Run specific tests:

You can run a specific group of tests by using the filter argument which can be part or the complete name of a test class or test method.

```bash
bin/phpunit --filter {part of or complete test name}
```
