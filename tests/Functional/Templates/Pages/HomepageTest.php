<?php

namespace App\Tests\Functional\Templates\Pages;

use App\Tests\Functional\AbstractTestCase;
use App\Tests\Functional\Traits\PageTrait;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Test homepage template.
 */
class HomepageTest extends AbstractTestCase
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

    public function testHomepage()
    {
        $this->createPage(
            'homepage',
            'kristiandubek',
            [
                'title' => 'Neue Homepage',
                'url' => '/homepage',
                'published' => true,
            ]
        );

        $client = $this->createWebsiteClient();
        $crawler = $client->request(Request::METHOD_GET, '/homepage');

        $this->assertEquals(Response::HTTP_OK, $client->getResponse()->getStatusCode());
        $this->assertCrawlerProperty($crawler, 'title', 'Neue Homepage');
    }
}
