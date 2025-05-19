<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Google\Cloud\Vision\V1\ImageAnnotatorClient;


class GoogleCloudServiceProvider extends ServiceProvider
{
    public function register()
    {
        $this->app->singleton(ImageAnnotatorClient::class, function ($app) {
            return new ImageAnnotatorClient([
                'keyFilePath' => env('GOOGLE_APPLICATION_CREDENTIALS')
            ]);
        });
    }

    public function provides()
    {
        return [ImageAnnotatorClient::class];
    }
}