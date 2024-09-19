@extends('album::layouts.master')

@section('content')
    <h1>Hello World</h1>

    <p>Module: {!! config('album.name') !!}</p>
@endsection
