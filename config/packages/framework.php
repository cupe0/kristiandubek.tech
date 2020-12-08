<?php

$debug = $container->getParameter('kernel.debug');

if (!$container->hasParameter('asset_build_version')) {
    $version = '';

    if (!$debug) {
        $packageJsonPath = __DIR__ . '/../../assets/website/package.json';

        if (file_exists($packageJsonPath) && $jsonContent = file_get_contents($packageJsonPath)) {
            $packageJson = json_decode($jsonContent, true);
            $version = $packageJson['version'] ?? '';
        }
    }

    $container->setParameter('asset_build_version', $version);
}

$container->loadFromExtension('framework', [
    'assets' => [
        'packages' => [
            'static' => [
                'version' => $container->getParameter('asset_build_version'),
                'version_format' => ($debug ? '%%s' : '%%s?v=%%s'),
            ],
        ],
    ],
]);
