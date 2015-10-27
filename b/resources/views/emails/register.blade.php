<!DOCTYPE html>
<html>
	<head>
		<meta charset="UTF-8" />
	</head>
	<body>
		<table>
			<tbody>
				<tr>
					<td>
						<p>{{ $data->name }},</p>
						<p></p>
						<p>歡迎使用此服務</p>
						<p></p>
						<p>
							請由此登入你的帳號
							&nbsp;
							<a href="{{ env('APP_URL') }}" target="_blank">{{ env('APP_NAME') }}CRM</a>
						</p>
						<p></p>
						<p>謝謝!</p>
					</td>
				</tr>
			</tbody>
		</table>
	</body>
</html>