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
</body>
</html>
