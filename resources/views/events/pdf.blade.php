<!DOCTYPE html>
<html>
<head>
    <title>{{ $title }}</title>
    <style>
        body {
            font-family: Arial, sans-serif;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
        }
        table, th, td {
            border: 1px solid black;
        }
        th, td {
            padding: 10px;
            text-align: left;
        }
        .logo {
            text-align: center;
            margin-bottom: 20px;
        }
        .title {
            text-align: center;
            font-size: 20px;
            font-weight: bold;
            margin-bottom: 20px;
        }
    </style>
</head>
<body>
    <div class="logo">
        <img src="{{ $logoPath }}" alt="Logo" width="100">
    </div>
    <div class="title">
        {{ $title }}
    </div>
    <table>
        <thead>
            <tr>
                <th>Date & Time</th>
                <th>Event Name</th>
                <th>Venue</th>
                <th>Created By</th>
                <th>Description</th>
            </tr>
        </thead>
        <tbody>
            @foreach($events as $event)
                <tr>
                    <td>{{ \Carbon\Carbon::parse($event->start_at)->format('Y-m-d H:i') }}</td>
                    <td>{{ $event->title }}</td>
                    <td>{{ $event->venue }}</td>
                    <td>{{ $event->author->name }}</td>
                    <td>{{ $event->description }}</td>
                </tr>
            @endforeach
        </tbody>
    </table>
</body>
</html>
