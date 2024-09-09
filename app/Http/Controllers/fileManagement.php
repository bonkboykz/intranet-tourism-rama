<?php

namespace App\Http\Controllers;

use Inertia\Inertia;

class FileManagement extends Controller
{
    public function index()
    {
        return Inertia::render('FileManagement', ['id' => auth()->id()]);
    }
}
