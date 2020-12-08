<?php

namespace App\Tests\Functional;

use PHPCR\ImportUUIDBehaviorInterface;
use PHPCR\SessionInterface;
use PHPCR\Util\NodeHelper;
use Sulu\Bundle\DocumentManagerBundle\Initializer\Initializer;
use Sulu\Bundle\TestBundle\Testing\PHPCRImporter;
use Sulu\Component\DocumentManager\DocumentManager;
use Sulu\Component\HttpKernel\SuluKernel;
use Symfony\Bundle\FrameworkBundle\KernelBrowser;
use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;
use Symfony\Component\Filesystem\Filesystem;

/**
 * Abstract test case.
 */
abstract class AbstractTestCase extends WebTestCase
{
    protected static $context = SuluKernel::CONTEXT_WEBSITE;
    protected static $environment = 'test';
    protected static $debug = true;
    private static $workspaceInitialized = false;

    /**
     * @var PHPCRImporter
     */
    protected $importer;

    public function setUp(): void
    {
        self::bootKernel();
    }

    protected function createWebsiteClient($httpHost = null): KernelBrowser
    {
        $client = $this->createClient(
            [
                'sulu_context' => static::$context,
                'environment' => static::$environment,
            ]
        );

        $client->setServerParameter('HTTP_HOST', $httpHost);

        return $client;
    }

    /**
     * @SuppressWarnings("UnusedFormalParameter")
     * @SuppressWarnings("UnusedLocalVariable")
     */
    protected static function createKernel(array $options = [])
    {
        if (null === static::$class) {
            static::$class = static::getKernelClass();
        }

        return new static::$class(static::$environment, static::$debug, static::$context);
    }

    protected function initPhpcr()
    {
        $session = $this->getPhpcrDefaultSession();
        $liveSession = $this->getPhpcrLiveSession();

        if (!self::$workspaceInitialized) {
            $this->getInitializer()->initialize(null, true);

            $this->dumpPhpcr($session, 'default');
            $this->dumpPhpcr($liveSession, 'live');
            self::$workspaceInitialized = true;

            return;
        }

        if (!$this->importer) {
            $this->importer = new PHPCRImporter($session, $liveSession);
        }

        $this->importSession($session, 'default');
        if ($session->getWorkspace()->getName() !== $liveSession->getWorkspace()->getName()) {
            $this->importSession($liveSession, 'live');
        }
    }

    protected function dumpPhpcr(SessionInterface $session, $workspace)
    {
        $initializerDump = $this->getInitializerDumpFilePath($workspace);

        $filesystem = new Filesystem();
        if (!$filesystem->exists(dirname($initializerDump))) {
            $filesystem->mkdir(dirname($initializerDump));
        }

        $handle = fopen($initializerDump, 'w');
        $session->exportSystemView('/cmf', $handle, false, false);
        fclose($handle);
    }

    private function importSession(SessionInterface $session, $workspace)
    {
        $initializerDump = $this->getInitializerDumpFilePath($workspace);

        if ($session->nodeExists('/cmf')) {
            NodeHelper::purgeWorkspace($session);
            $session->save();
        }

        $session->importXml('/', $initializerDump, ImportUUIDBehaviorInterface::IMPORT_UUID_COLLISION_THROW);
        $session->save();
    }

    protected function getInitializerDumpFilePath($workspace)
    {
        $initializerDump = null;

        switch ($workspace) {
            case 'live':
                $initializerDump = self::$kernel->getCacheDir() . '/initial_live.xml';
                break;
            case 'default':
                $initializerDump = self::$kernel->getCacheDir() . '/initial.xml';
                break;
            default:
                throw new \InvalidArgumentException(sprintf('Workspace "%s" is not a valid option', $workspace));
        }

        return $initializerDump;
    }

    protected function getDocumentManager(): DocumentManager
    {
        return static::$container->get('sulu_document_manager.document_manager');
    }

    protected function getInitializer(): Initializer
    {
        return static::$container->get('sulu_document_manager.initializer');
    }

    protected function getPhpcrDefaultSession(): SessionInterface
    {
        return static::$container->get('doctrine_phpcr.session');
    }

    protected function getPhpcrLiveSession(): SessionInterface
    {
        return static::$container->get('doctrine_phpcr.live_session');
    }
}
