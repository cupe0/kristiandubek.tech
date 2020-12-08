<?php

namespace App\Twig;

use Twig\Extension\AbstractExtension;

/**
 * This Twig Extension provides useful functions and filters for the website.
 */
class WebsiteExtension extends AbstractExtension
{
    /**
     * {@inheritdoc}
     */
    public function getFunctions()
    {
        return [];
    }

    /**
     * {@inheritdoc}
     */
    public function getFilters()
    {
        return [];
    }
}
