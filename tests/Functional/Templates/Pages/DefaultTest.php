<?php

namespace App\Tests\Functional\Templates\Pages;

use App\Tests\Functional\AbstractTestCase;
use App\Tests\Functional\Traits\PageTrait;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Test default template.
 */
class DefaultTest extends AbstractTestCase
{
    use PageTrait;

    /**
     * {@inheritdoc}
     */
    public function setUp(): void
    {
        parent::setUp();
        $this->initPhpcr();
    }

    public function testDefault()
    {
        $this->createPage(
            'default',
            'kristiandubek',
            [
                'title' => 'Neue Defaultseite',
                'url' => '/default',
                'published' => true,
            ]
        );

        $client = $this->createWebsiteClient();
        $crawler = $client->request(Request::METHOD_GET, '/default');

        $this->assertEquals(Response::HTTP_OK, $client->getResponse()->getStatusCode());
        $this->assertCrawlerProperty($crawler, 'title', 'Neue Defaultseite');
    }
}
