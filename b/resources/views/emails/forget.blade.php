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
						<p>
							您的新密碼為「
							<b style="color:#f00">{{ $data->password_note }}</b>
							」
						</p>
						<p></p>
						<p>謝謝!</p>
					</td>
				</tr>
			</tbody>
		</table>
	</body>
</html>