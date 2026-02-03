import api from "./api";

export async function fetchMe() {
	const { data } = await api.get("/me/");
	return data;
}

export async function updateMe(payload) {
	// payload should match your MeSerializer structure
	// e.g. { first_name, last_name, email, profile: { display_name, bio, avatar_url } }
	const { data } = await api.patch("/me/", payload);
	return data;
}
