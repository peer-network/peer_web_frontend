<?php
/**
 * Vite Asset Helper for PHP
 * 
 * Usage in PHP files:
 *   <?php include 'template-parts/vite-helper.php'; ?>
 *   <?php vite_assets('auth'); ?>
 */

define('VITE_DEV_SERVER', 'http://localhost:5173');
define('VITE_MANIFEST', __DIR__ . '/../dist/.vite/manifest.json');

/**
 * Check if Vite dev server is running
 */
function is_vite_dev_running(): bool {
    // Simple check - you can make this smarter
    $devMode = getenv('VITE_DEV') === 'true' || file_exists(__DIR__ . '/../.vite-dev');
    return $devMode;
}

/**
 * Output script tags for a Vite entry point
 * 
 * @param string $entry Entry name (e.g., 'auth', 'main')
 */
function vite_assets(string $entry): void {
    if (is_vite_dev_running()) {
        // Development mode - load from Vite dev server
        vite_dev_assets($entry);
    } else {
        // Production mode - load from dist folder
        vite_prod_assets($entry);
    }
}

/**
 * Development mode assets
 */
function vite_dev_assets(string $entry): void {
    $entryPath = $entry === 'main' 
        ? 'src/main.ts' 
        : "src/modules/{$entry}/index.ts";
    
    echo '<script type="module" src="' . VITE_DEV_SERVER . '/@vite/client"></script>' . "\n";
    echo '<script type="module" src="' . VITE_DEV_SERVER . '/' . $entryPath . '"></script>' . "\n";
}

/**
 * Production mode assets
 */
function vite_prod_assets(string $entry): void {
    if (!file_exists(VITE_MANIFEST)) {
        echo "<!-- Vite manifest not found. Run 'npm run build' -->";
        return;
    }

    $manifest = json_decode(file_get_contents(VITE_MANIFEST), true);
    
    $entryPath = $entry === 'main' 
        ? 'src/main.ts' 
        : "src/modules/{$entry}/index.ts";
    
    if (!isset($manifest[$entryPath])) {
        echo "<!-- Entry '{$entry}' not found in manifest -->";
        return;
    }

    $asset = $manifest[$entryPath];
    $baseUrl = '/dist/';
    
    // Output CSS if exists
    if (isset($asset['css'])) {
        foreach ($asset['css'] as $cssFile) {
            echo '<link rel="stylesheet" href="' . $baseUrl . $cssFile . '">' . "\n";
        }
    }
    
    // Output JS
    echo '<script type="module" src="' . $baseUrl . $asset['file'] . '"></script>' . "\n";
}
?>
