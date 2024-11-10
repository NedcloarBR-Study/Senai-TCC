import { useState } from "react";
import { Button, Text, TextInput, ToastAndroid, View } from "react-native";
import { loginUser } from "../lib/api";

export default function Index() {
	const [loginValue, setLoginValue] = useState<string>("");
	const [passwordValue, setPasswordValue] = useState<string>("");
	const [user, setUser] = useState<string>("");

	function handleSetPasswordValue(value: string) {
		const numericValue = value.replace(/\D/g, "");
		setPasswordValue(numericValue);
	}

	async function onPress() {
		if (loginValue === "admin" && passwordValue === "123") {
			ToastAndroid.show("Logado com sucesso!", ToastAndroid.SHORT);
			const userLogin = await loginUser({
				login: loginValue,
				password: passwordValue,
			});
			setUser(userLogin);
			console.log(user);
			return;
		}
		ToastAndroid.show("Login ou senha inválidos!", ToastAndroid.SHORT);
	}

	return (
		<View className="flex-auto justify-center items-center gap-4 dark:bg-slate-700">
			<Text className="font-black text-blue-800 text-xl">Hello, World!</Text>
			<TextInput
				id="login"
				placeholder="Digite seu login"
				className="bg-green-400 h-12 w-[200px] rounded-md"
				onChangeText={setLoginValue}
				value={loginValue}
			/>
			<TextInput
				id="password"
				secureTextEntry={true}
				keyboardType="numeric"
				placeholder="Digite sua senha"
				className="bg-green-400 h-12 w-[200px] rounded-md"
				onChangeText={(value) => handleSetPasswordValue(value)}
				value={passwordValue}
			/>

			<Button title="Logar" onPress={onPress} />
		</View>
	);
}
