export async function signIn(requestBody: { email: string; password: string }) {
  try {
    const response = await fetch("http://localhost:3000/auth/signIn", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (response.status === 200) {
      const data = await response.json();
      console.log("Token:", data.access_token);

      localStorage.setItem("token", data.access_token);
      return data; // Return the data received from the server
    } else {
      console.error("Authentication failed.");
      return null; // or throw an error, depending on your use case
    }
  } catch (error) {
    console.error("Error:", error);
    return null; // or throw an error, depending on your use case
  }
}
