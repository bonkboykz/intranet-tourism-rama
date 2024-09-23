<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class ManageFoldersController extends Controller
{
    public function index()
    {
        return Inertia::render('ManageFolder', ['id' => auth()->id()]);
    }
}