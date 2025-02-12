<?php

return [
    'paths' => ['api/*'],
    'allowed_methods' => ['POST', 'GET', 'OPTIONS'],
    'allowed_origins' => ['http://localhost:5174'],
    'allowed_origins_patterns' => [],
    'allowed_headers' => ['Content-Type', 'Accept', 'Authorization', 'X-Requested-With'],
    'exposed_headers' => [],
    'max_age' => 0,
    'supports_credentials' => true,
]; 