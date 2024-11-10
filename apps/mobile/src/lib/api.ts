import axios from "axios";

const baseURL = "http://localhost:9999/api";

export async function loginUser(userLoginDTO: unknown) {
	try {
		const response = await axios.request({
			url: `${baseURL}/auth/login`,
			method: "GET",
			data: userLoginDTO,
			headers: {
				"Content-Type": "application/json",
			},
		});
		return response.data;
	} catch (error) {
		console.error("Error logging in:", error);
	}
}
