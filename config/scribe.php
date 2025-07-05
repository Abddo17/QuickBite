<?php

use Knuckles\Scribe\Extracting\Strategies;
use Knuckles\Scribe\Config\Defaults;
use Knuckles\Scribe\Config\AuthIn;
use function Knuckles\Scribe\Config\{removeStrategies, configureStrategy};

return [
    'title' => 'QuickBite',
    'description' => 'API pour gérer les produits, catégories, paniers, commandes, commentaires, utilisateurs et paiements dans une plateforme e-commerce.',
    'base_url' => config("app.url"),
    'routes' => [
        [
            'match' => [
                'prefixes' => ['api/*'],
                'domains' => ['*'],
            ],
            'include' => [],
            'exclude' => [
                'sanctum/csrf-cookie',
            ],
        ],
    ],
    'type' => 'laravel',
    'theme' => 'default',
    'static' => [
        'output_path' => 'public/docs',
    ],
    'laravel' => [
        'add_routes' => true,
        'docs_url' => '/docs',
        'assets_directory' => null,
        'middleware' => [],
    ],
    'external' => [
        'html_attributes' => []
    ],
    'try_it_out' => [
        'enabled' => true,
        'base_url' => null,
        'use_csrf' => false,
        'csrf_url' => '/sanctum/csrf-cookie',
    ],
    'auth' => [
        'enabled' => true,
        'default' => false,
        'in' => AuthIn::BEARER->value,
        'name' => 'Authorization',
        'use_value' => env('SCRIBE_AUTH_KEY'),
        'placeholder' => 'Bearer {YOUR_AUTH_TOKEN}',
        'extra_info' => 'Obtenez votre jeton d’authentification via les endpoints POST /api/register ou POST /api/login.',
    ],
    'intro_text' => <<<INTRO
Cette documentation fournit toutes les informations nécessaires pour interagir avec notre API e-commerce.

<aside>Au fur et à mesure que vous parcourez la documentation, vous verrez des exemples de code pour travailler avec l'API dans différents langages de programmation dans la zone sombre à droite (ou dans le contenu sur mobile). Vous pouvez changer le langage utilisé avec les onglets en haut à droite (ou depuis le menu de navigation en haut à gauche sur mobile).</aside>
INTRO,
    'example_languages' => [
        'bash',
        'javascript',
        'php',
    ],
    'postman' => [
        'enabled' => true,
        'overrides' => [
            'info.version' => '1.0.0',
        ],
    ],
    'openapi' => [
        'enabled' => true,
        'overrides' => [],
        'generators' => [],
    ],
    'groups' => [
        'default' => 'Endpoints',
        'order' => [
            'Gestion de l’Authentification',
            'Gestion des Utilisateurs',
            'Gestion des Catégories',
            'Gestion du Panier',
            'Gestion des Commandes',
            'Gestion des Commentaires',
            'Gestion des Paiements',
        ],
    ],
    'logo' => false,
    'last_updated' => 'Dernière mise à jour : {date:j F Y}',
    'examples' => [
        'faker_seed' => 1234,
        'models_source' => ['factoryCreate', 'factoryMake', 'databaseFirst'],
    ],
    'strategies' => [
        'metadata' => [
            ...Defaults::METADATA_STRATEGIES,
        ],
        'headers' => [
            ...Defaults::HEADERS_STRATEGIES,
            Strategies\StaticData::withSettings(data: [
                'Content-Type' => 'application/json',
                'Accept' => 'application/json',
            ]),
        ],
        'urlParameters' => [
            ...Defaults::URL_PARAMETERS_STRATEGIES,
        ],
        'queryParameters' => [
            ...Defaults::QUERY_PARAMETERS_STRATEGIES,
        ],
        'bodyParameters' => [
            ...Defaults::BODY_PARAMETERS_STRATEGIES,
        ],
        'responses' => configureStrategy(
            Defaults::RESPONSES_STRATEGIES,
            Strategies\Responses\ResponseCalls::withSettings(
                only: ['GET *'],
                config: [
                    'app.debug' => false,
                ]
            )
        ),
        'responseFields' => [
            ...Defaults::RESPONSE_FIELDS_STRATEGIES,
        ]
    ],
    'database_connections_to_transact' => [config('database.default')],
    'fractal' => [
        'serializer' => null,
    ],
];
