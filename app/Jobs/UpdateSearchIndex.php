<?php

namespace App\Jobs;

use Artisan;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Log;
use Symfony\Component\Console\Output\ConsoleOutput;

class UpdateSearchIndex implements ShouldQueue
{
    use Queueable, Dispatchable;

    /**
     * Create a new job instance.
     */
    public function __construct()
    {
        //
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        Artisan::call('scout:import', ['model' => 'Modules\Posts\Models\Post']);
        Artisan::call('scout:import', ['model' => 'Modules\User\Models\User']);
        Artisan::call('scout:import', ['model' => 'Modules\Communities\Models\Community']);
        Artisan::call('scout:import', parameters: ['model' => 'Modules\Crud\Models\Resource']);
    }
}
