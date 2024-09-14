<?php

namespace App\Http\Controllers;

use Inertia\Inertia;

class FileManagementController extends Controller
{
    public function index()
    {
        return Inertia::render('FileManagementPage', ['id' => auth()->id()]);
    }
}
