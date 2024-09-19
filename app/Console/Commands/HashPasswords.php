<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Hash;
use Modules\User\Models\User; // Assuming your user model is named User

class HashPasswords extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'passwords:hash';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Hash plain text passwords for all users';

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        // Fetch all users who don't have hashed passwords
        $users = User::whereRaw('LENGTH(password) <= 60')->get(); // Adjust as needed based on your hashing algorithm

        foreach ($users as $user) {
            // Check if the password is already hashed or not
            if (!Hash::needsRehash($user->password)) {
                continue; // Skip if the password is already hashed
            }

            // Hash the password
            $user->password = Hash::make($user->password);
            $user->save();

            $this->info('Password for user ID ' . $user->id . ' has been hashed.');
        }

        $this->info('All passwords have been hashed.');
        return 0;
    }
}
