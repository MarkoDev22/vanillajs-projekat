// Funkcija za prijavu korisnika
const login = async (email, password) => {
  try {
    const response = await fetch("http://localhost:3333/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      throw new Error("Login failed"); // Ako login nije uspešan
    }

    const data = await response.json();
    localStorage.setItem("token", data.accessToken); // Čuvanje tokena u LocalStorage
    return data;
  } catch (error) {
    console.error("Error during login:", error);
    throw error;
  }
};

// Funkcija za odjavu korisnika
const logout = () => {
  localStorage.removeItem("token"); // Brisanje tokena iz LocalStorage
};
