<?php
header('Content-Type: text/plain');
echo "Directorio actual (__DIR__): " . __DIR__ . "\n";
echo "Directorio realpath (__DIR__): " . realpath(__DIR__) . "\n";
echo "Directorio padre: " . realpath(__DIR__ . '/..') . "\n\n";

echo "Buscando manifest.json en el servidor:\n";

$paths = [
    __DIR__ . '/build/manifest.json',
    __DIR__ . '/../public/build/manifest.json',
    realpath(__DIR__ . '/../public_html/public/build/manifest.json'),
    realpath(__DIR__ . '/../../public_html/public/build/manifest.json'),
];

foreach ($paths as $path) {
    if ($path) {
        echo "$path => " . (file_exists($path) ? "EXISTE" : "NO EXISTE") . "\n";
    }
}

echo "\nListando contenido de " . realpath(__DIR__ . '/..') . ":\n";
$parentDir = realpath(__DIR__ . '/..');
if ($parentDir && $handle = opendir($parentDir)) {
    while (false !== ($entry = readdir($handle))) {
        if ($entry != "." && $entry != "..") {
            echo " - $entry" . (is_dir("$parentDir/$entry") ? " [DIR]" : "") . "\n";
        }
    }
    closedir($handle);
}

echo "\nListando contenido de " . realpath(__DIR__ . '/../..') . ":\n";
$grandParentDir = realpath(__DIR__ . '/../..');
if ($grandParentDir && $handle = opendir($grandParentDir)) {
    while (false !== ($entry = readdir($handle))) {
        if ($entry != "." && $entry != "..") {
            echo " - $entry" . (is_dir("$grandParentDir/$entry") ? " [DIR]" : "") . "\n";
        }
    }
    closedir($handle);
}
