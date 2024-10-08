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
                <th>Option Name</th>
                <th>Option Num Votes</th>
                <th>Option Percentage Votes</th>
            </tr>
        </thead>
        <tbody>
            @foreach($options as $option)
                <tr>
                    <td>{{ $option['option_text'] }}</td>
                    <td>{{ $option['count'] }}</td>
                    {{-- format percentage up to 2 digits --}}
                    <th>{{ number_format($option['percentage'], 2) }}%</th>
                </tr>
            @endforeach
        </tbody>
    </table>


    <table>
        <thead>
            <tr>
                <th>Feedback Date</th>
                <th>Name</th>
                <th>Title</th>
                <th>Department</th>
                <th>Feedback</th>
            </tr>
        </thead>
        <tbody>
            @foreach($feedbacks as $feedback)
                <tr>
                    <td>{{ \Carbon\Carbon::parse($feedback['created_at'])->format('Y-m-d H:i') }}</td>
                    <td>{{ $feedback['name'] }}</td>
                    <td>{{ $feedback['position'] }}</td>
                    <td>{{ $feedback['department'] }}</td>
                    <td>{{ $feedback['text'] }}</td>
                </tr>
            @endforeach

    </table>
</body>
</html>
