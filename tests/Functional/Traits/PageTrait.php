<?php

namespace App\Tests\Functional\Traits;

use Sulu\Bundle\PageBundle\Document\PageDocument;
use Sulu\Component\Content\Document\WorkflowStage;
use Symfony\Component\DomCrawler\Crawler;

/**
 * Page trait to create new pages.
 */
trait PageTrait
{
    /**
     * @param string $template
     * @param string $webspaceKey
     * @param array $data
     * @param string $locale
     *
     * @return PageDocument
     */
    protected function createPage($template, $webspaceKey, array $data, $locale = 'en')
    {
        $documentManager = $this->getDocumentManager();
        /** @var PageDocument $document */
        $document = $documentManager->create('page');

        if (!$document instanceof PageDocument) {
            throw new \RuntimeException('Invalid document');
        }

        $document->setLocale($locale);
        $document->setTitle($data['title']);
        $document->setStructureType($template);
        $document->setResourceSegment($data['url']);

        if ($data['published']) {
            $document->setWorkflowStage(WorkflowStage::PUBLISHED);
        }

        $document->getStructure()->bind($data);

        $documentManager->persist($document, $locale, ['parent_path' => '/cmf/' . $webspaceKey . '/contents']);

        if ($data['published']) {
            $documentManager->publish($document, $locale);
        }

        $documentManager->flush();

        return $document;
    }

    /**
     * Assert crawler property.
     *
     * @param Crawler $crawler
     * @param string $selector
     * @param string $needle
     */
    private function assertCrawlerProperty(Crawler $crawler, $selector, $needle)
    {
        $this->assertStringContainsString($needle, $crawler->filter($selector)->html());
    }
}
